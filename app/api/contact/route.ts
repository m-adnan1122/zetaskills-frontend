import { NextResponse } from "next/server";
export async function POST() {
  // No delivery service is configured yet; do not report unsent messages as received.
  return NextResponse.json({ ok: false }, { status: 503 });
}
