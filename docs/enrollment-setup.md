# Enrollment setup

Enrollment is stored in Supabase Postgres first. After storage succeeds, the app attempts to copy the row to Google Sheets and send an admin email and, if an email was supplied, a student confirmation. Failed deliveries stay pending in Postgres. The protected scheduled endpoint retries pending work; the included Vercel schedule runs daily at 03:00 UTC (08:00 Pakistan time). A database save failure returns an error and does not show success.

The submission response waits for the database save, not for email or Sheets. On Vercel, `waitUntil` keeps delivery work running after the response; on other hosts, configure a protected scheduler for retries if background work is interrupted. A successful submission means the database record was saved, not that external notifications have already arrived.

## 1. Supabase

1. Create/select the intended Supabase project. Run `supabase/enrollments.sql` in its SQL editor. It creates the table with RLS enabled and revokes access from Supabase's `anon` and `authenticated` roles.
2. In Supabase's Connect screen copy the server-side pooled Postgres connection URI (transaction pooler is suitable for serverless). Use the supplied SSL settings and URL-encode special characters in the password if constructing the URI manually. This is a privileged credential: never put it in a `NEXT_PUBLIC_` variable or commit it.
3. Set it as `DATABASE_URL` in `.env.local` and in the Vercel project environment. The configured database role needs permission to insert, select and update `public.enrollments`.

The table contains sensitive personal data, including CNIC and date of birth. Restrict project, email inbox and spreadsheet access to authorized staff. Configure backups, retention and deletion according to your organization's policy. The client never receives the database credentials.

Readable form columns are generated from `payload` and cannot be edited directly. They also show data from existing records. `confirmed` is present on new records; older records that did not store it show an empty value. Run the updated SQL migration when deploying to another database.

## 2. Google Sheet

1. Create the destination spreadsheet and open Extensions > Apps Script. Copy the contents of `scripts/google-sheets-enrollment.gs` into its bound script project.
2. Under Project Settings > Script Properties add `WEBHOOK_SECRET` with a long random secret and `SPREADSHEET_ID` with the ID from the spreadsheet URL (between `/d/` and `/edit`). Use the same secret for `GOOGLE_SHEET_WEBHOOK_SECRET` in the server environment.
3. Deploy > New deployment > Web app, execute as the owner and allow the server to access the endpoint (typically "Anyone"). Authorize access to the spreadsheet. Copy the versioned `/exec` URL to `GOOGLE_SHEET_WEBHOOK_URL`. Keep the secret private; the endpoint verifies it before writing. Redeploy a new version when the script changes.
4. The script creates an `Enrollments` tab if missing and uses the enrollment ID to avoid duplicate rows on retry. Share the spreadsheet only with authorized staff.

## 3. Resend

Verify a sending domain in Resend, create an API key and set `RESEND_API_KEY`. Set `ENROLLMENT_FROM_EMAIL` to an address on that verified domain (for example `ZetaSkills <enroll@zetaskills.com>`). Set `ENROLLMENT_TO_EMAIL` to the mailbox that receives applications. The mailbox itself must exist; domain verification alone does not create it. Student confirmations are skipped when the optional student email is empty. Admin emails include all enrollment fields, including CNIC and date of birth.

## 4. Scheduler and environment

Copy `.env.example` to `.env.local` and fill in the server-only values. Set the same variables on the deployment environment and redeploy. Generate separate long random secrets for `CRON_SECRET` and the Sheet webhook. On Vercel, `vercel.json` invokes `/api/cron/enrollments` with `Authorization: Bearer <CRON_SECRET>`; verify the cron is enabled on the deployed project. Other hosts must schedule an authenticated GET to the same endpoint. Keep the cron secret private.

Inspect `sheet_sent`, `admin_email_sent`, `student_email_sent` and `last_attempt_at` in Supabase to monitor delivery. Failed jobs remain pending; this implementation retries up to five records per scheduled run and does not notify staff about failures automatically. Operators can invoke the protected endpoint again for a backlog. Never put secrets in a URL or source control.

## 5. Verify before launch

Submit a test with a controlled test email and fictitious personal information. Confirm one database row, one matching spreadsheet row, one admin email and one student email. Repeat without a student email, and verify the confirmation is skipped. Test a temporarily incorrect webhook or email credential: the database record should remain saved with the corresponding status false; restore the credential and run the authenticated retry, then confirm the status and delivery. Test a missing database connection: the form must report failure rather than success. Resend's idempotency key limits duplicate email on retries within its provider retention window; verify and monitor delivery failures.

External services and production configuration cannot be verified without their credentials and access. Do not use real student data in test runs.
