import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { retryPendingEnrollments } from "@/lib/enrollment-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const actual = Buffer.from(request.headers.get("authorization") || "");
  const expected = Buffer.from(`Bearer ${secret || ""}`);
  if (!secret || actual.length !== expected.length || !timingSafeEqual(actual, expected)) return new NextResponse("Unauthorized", { status: 401 });
  try { return NextResponse.json({ processed: await retryPendingEnrollments() }); }
  catch { console.error("Enrollment retry failed"); return new NextResponse("Retry failed", { status: 503 }); }
}
