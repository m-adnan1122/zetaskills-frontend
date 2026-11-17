import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { normalizeCnic, normalizePakistaniPhone } from "@/lib/validation";
import { processEnrollment, saveEnrollment } from "@/lib/enrollment-server";
import {
  isRecord,
  parseEnrollmentValues,
  validateEnrollment,
} from "@/lib/validation";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 12000) return NextResponse.json({ ok: false }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ ok: false, errors: { form: "Invalid enrollment details." } }, { status: 400 });
  }

  const submissionId = isRecord(body) && typeof body.submissionId === "string" ? body.submissionId : "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)) {
    return NextResponse.json({ ok: false, errors: { form: "Your form session has expired. Please refresh the page and try again." } }, { status: 400 });
  }

  const values = parseEnrollmentValues(body);
  if (!values) {
    return NextResponse.json({ ok: false, errors: { form: "Invalid enrollment details." } }, { status: 400 });
  }

  const validationValues = {
    ...values,
    whatsappNumber: values.sameAsPhone ? values.phoneNumber : values.whatsappNumber,
  };
  const errors = validateEnrollment(validationValues);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  if (Object.values(values).some((value) => typeof value === "string" && value.length > 500)) {
    return NextResponse.json({ ok: false, errors: { form: "Enrollment details are too long." } }, { status: 400 });
  }
  const normalized = { ...validationValues, fullName: values.fullName.trim(), fatherName: values.fatherName.trim(), emailAddress: values.emailAddress.trim(), institutionName: values.institutionName.trim(), phoneNumber: normalizePakistaniPhone(values.phoneNumber)!, whatsappNumber: normalizePakistaniPhone(validationValues.whatsappNumber)!, cnic: normalizeCnic(values.cnic)! };
  try {
    const saved = await saveEnrollment(submissionId, normalized);
    if (!saved) return NextResponse.json({ ok: false }, { status: 409 });
  } catch {
    console.error("Unable to save enrollment");
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  waitUntil(processEnrollment(submissionId).catch(() => { console.error("Enrollment processing deferred", submissionId); }));
  return NextResponse.json({ ok: true, reference: submissionId });
}
