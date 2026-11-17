-- Run in the Supabase SQL editor using the intended project.
create table if not exists public.enrollments (
  id uuid primary key,
  created_at timestamptz not null default now(),
  payload jsonb not null,
  sheet_sent boolean not null default false,
  admin_email_sent boolean not null default false,
  student_email_sent boolean not null default false,
  processing_until timestamptz,
  last_attempt_at timestamptz
);
alter table public.enrollments enable row level security;
-- Generated columns keep existing JSON records and readable table columns in sync.
alter table public.enrollments
  add column if not exists full_name text generated always as (payload->>'fullName') stored,
  add column if not exists father_name text generated always as (payload->>'fatherName') stored,
  add column if not exists phone_number text generated always as (payload->>'phoneNumber') stored,
  add column if not exists whatsapp_number text generated always as (payload->>'whatsappNumber') stored,
  add column if not exists same_as_phone text generated always as (payload->>'sameAsPhone') stored,
  add column if not exists email_address text generated always as (payload->>'emailAddress') stored,
  add column if not exists cnic text generated always as (payload->>'cnic') stored,
  add column if not exists date_of_birth text generated always as (payload->>'dateOfBirth') stored,
  add column if not exists last_qualification text generated always as (payload->>'lastQualification') stored,
  add column if not exists institution_name text generated always as (payload->>'institutionName') stored,
  add column if not exists course_slug text generated always as (payload->>'courseSlug') stored,
  add column if not exists batch_time text generated always as (payload->>'batchTime') stored,
  add column if not exists referral_source text generated always as (payload->>'referralSource') stored,
  add column if not exists laptop text generated always as (payload->>'laptop') stored,
  add column if not exists goal text generated always as (payload->>'goal') stored,
  add column if not exists referred_by text generated always as (payload->>'referredBy') stored,
  add column if not exists confirmed text generated always as (payload->>'confirmed') stored;
revoke all on public.enrollments from anon, authenticated;
create index if not exists enrollments_pending_idx on public.enrollments (created_at) where not (sheet_sent and admin_email_sent and student_email_sent);
