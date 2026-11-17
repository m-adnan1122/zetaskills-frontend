import "server-only";
import { Pool } from "pg";
import courses from "@/data/courses.json";
import type { EnrollmentValues } from "@/lib/validation";

type EnrollmentRecord = { id: string; created_at: Date; payload: EnrollmentValues; sheet_sent: boolean; admin_email_sent: boolean; student_email_sent: boolean };
const globalDb = globalThis as typeof globalThis & { enrollmentPool?: Pool };

export function db(): Pool {
  if (!process.env.DATABASE_URL) throw new Error("Database is not configured");
  if (!globalDb.enrollmentPool) globalDb.enrollmentPool = new Pool({ connectionString: process.env.DATABASE_URL, max: 2, connectionTimeoutMillis: 10000, idleTimeoutMillis: 20000, query_timeout: 10000 });
  return globalDb.enrollmentPool;
}

export async function saveEnrollment(id: string, values: EnrollmentValues) {
  const { website, ...payload } = values;
  void website;
  const result = await db().query("insert into public.enrollments (id, payload, student_email_sent) values ($1, $2::jsonb, $3) on conflict (id) do update set id = excluded.id where enrollments.payload = excluded.payload returning id", [id, JSON.stringify(payload), !values.emailAddress.trim()]);
  return result.rowCount === 1;
}

async function sendEmail(to: string, subject: string, text: string, idempotencyKey: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENROLLMENT_FROM_EMAIL;
  if (!apiKey || !from) throw new Error("Email service not configured");
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey }, body: JSON.stringify({ from, to: [to], subject, text }), signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error("Email delivery failed");
}

async function sendSheet(row: EnrollmentRecord) {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEET_WEBHOOK_SECRET;
  if (!url || !secret) throw new Error("Sheet service not configured");
  const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ secret, id: row.id, createdAt: row.created_at, ...row.payload }), signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error(`Sheet webhook HTTP ${response.status}`);
  const result: unknown = await response.json();
  if (!result || typeof result !== "object" || !("ok" in result) || result.ok !== true) {
    const validCodes = new Set(["INVALID_REQUEST", "AUTH_OR_REQUEST_INVALID", "LOCK_FAILED", "SPREADSHEET_ID_MISSING", "SPREADSHEET_ACCESS_FAILED", "SHEET_WRITE_FAILED", "HEADER_MISMATCH"]);
    const code = result && typeof result === "object" && "code" in result && typeof result.code === "string" && validCodes.has(result.code) ? result.code : "UNKNOWN_SCRIPT_ERROR";
    throw new Error(`Sheet delivery failed: ${code}`);
  }
}

export async function processEnrollment(id: string) {
  const claim = await db().query<EnrollmentRecord>(`update public.enrollments set processing_until = now() + interval '5 minutes', last_attempt_at = now()
    where id = $1 and (processing_until is null or processing_until < now()) and not (sheet_sent and admin_email_sent and student_email_sent)
    returning id, created_at, payload, sheet_sent, admin_email_sent, student_email_sent`, [id]);
  const row = claim.rows[0];
  if (!row) return;
  const course = courses.find((item) => item.slug === row.payload.courseSlug)?.title ?? row.payload.courseSlug;
  const v = row.payload;
  const adminText = [ `Enrollment ID: ${row.id}`, `Course: ${course}`, `Full name: ${v.fullName}`, `Father's name: ${v.fatherName}`, `Phone: ${v.phoneNumber}`, `WhatsApp: ${v.whatsappNumber}`, `Email: ${v.emailAddress || "Not provided"}`, `CNIC/B-Form: ${v.cnic}`, `Date of birth: ${v.dateOfBirth}`, `Qualification: ${v.lastQualification}`, `Institution: ${v.institutionName || "Not provided"}`, `Batch: ${v.batchTime}`, `Heard from: ${v.referralSource}`, `Laptop: ${v.laptop}`, `Goal: ${v.goal}`, `Referred by: ${v.referredBy || "Not provided"}` ].join("\n");
  const jobs: { field: "sheet_sent" | "admin_email_sent" | "student_email_sent"; needed: boolean; run: () => Promise<void> }[] = [
    { field: "sheet_sent", needed: !row.sheet_sent, run: () => sendSheet(row) },
    { field: "admin_email_sent", needed: !row.admin_email_sent, run: () => sendEmail(process.env.ENROLLMENT_TO_EMAIL || "info@zetaskills.com", `New enrollment: ${course}`, adminText, `enroll-admin/${id}`) },
    { field: "student_email_sent", needed: !row.student_email_sent, run: () => sendEmail(v.emailAddress, "Your ZetaSkills enrollment", `Hello ${v.fullName},\n\nWe received your enrollment for ${course}. Our team will contact you on WhatsApp about your application.\n\nZetaSkills`, `enroll-student/${id}`) },
  ];
  try {
    for (const job of jobs) {
      if (!job.needed) continue;
      try {
        await job.run();
        await db().query(`update public.enrollments set ${job.field} = true where id = $1`, [id]);
      } catch (error) {
        const reason = error instanceof Error && job.field === "sheet_sent" && /^(Sheet webhook HTTP \d{3}|Sheet delivery failed: [A-Z_]+|Sheet service not configured)$/.test(error.message) ? error.message : "Delivery failed or service not configured";
        console.error(`Enrollment delivery failed: ${job.field}: ${reason}`, id);
      }
    }
  } finally { await db().query("update public.enrollments set processing_until = null where id = $1", [id]); }
}

export async function retryPendingEnrollments() {
  const result = await db().query<{ id: string }>("select id from public.enrollments where not (sheet_sent and admin_email_sent and student_email_sent) and (processing_until is null or processing_until < now()) order by last_attempt_at nulls first, created_at limit 5");
  for (const row of result.rows) await processEnrollment(row.id);
  return result.rowCount ?? 0;
}
