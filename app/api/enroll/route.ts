import { NextResponse } from "next/server";
import {
  isRecord,
  parseEnrollmentValues,
  validateEnrollment,
} from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errors: { form: "Invalid enrollment details." } }, { status: 400 });
  }

  if (isRecord(body) && typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true });
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

  // TODO: Add Supabase, Resend student confirmation and enroll@zetaskills.com notification, and the Google Sheet webhook. Do not log personal data.
  return NextResponse.json({ ok: true });
}
