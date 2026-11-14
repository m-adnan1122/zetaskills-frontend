import coursesData from "@/data/courses.json";
import type { Course } from "@/data/course-types";

const courses = coursesData as Course[];

export type EnrollmentValues = {
  fullName: string;
  fatherName: string;
  phoneNumber: string;
  whatsappNumber: string;
  sameAsPhone: boolean;
  emailAddress: string;
  cnic: string;
  dateOfBirth: string;
  lastQualification: string;
  institutionName: string;
  courseSlug: string;
  batchTime: string;
  referralSource: string;
  laptop: string;
  goal: string;
  confirmed: boolean;
  referredBy: string;
  website: string;
};

export type EnrollmentField = keyof EnrollmentValues;
export type EnrollmentErrors = Partial<Record<EnrollmentField, string>>;

const qualifications = ["Matric", "Inter", "Graduate", "Other"];
const referralSources = ["Facebook", "Friend", "Walk-in", "Google", "Other"];
const laptopOptions = ["Yes", "No", "Will arrange"];
const goals = ["Job", "Freelancing", "Own Business"];

export function normalizePakistaniPhone(value: string): string | null {
  const compact = value.trim().replace(/[\s()-]/g, "");
  if (/^03\d{9}$/.test(compact)) return compact;
  if (/^\+?923\d{9}$/.test(compact)) return `0${compact.replace(/^\+/, "").slice(2)}`;
  return null;
}

export function formatCnic(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 13);
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}

export function normalizeCnic(value: string): string | null {
  const trimmed = value.trim();
  if (!/^\d{13}$|^\d{5}-\d{7}-\d$/.test(trimmed)) return null;
  const digits = trimmed.replace(/-/g, "");
  if (!/^\d{13}$/.test(digits)) return null;
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}

function validateName(value: string, label: string): string | undefined {
  const name = value.trim();
  if (!name) return `${label} is required.`;
  if (name.length < 2 || name.length > 60 || !/^[A-Za-z\u00C0-\u024F .-]+$/.test(name)) {
    return "Use 2 to 60 letters, spaces, dots or hyphens.";
  }
  return undefined;
}

function validateDob(value: string): string | undefined {
  if (!value) return "Date of birth is required.";
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return "Enter a valid date of birth.";
  }
  const year = date.getUTCFullYear();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  const today = `${part("year")}-${part("month")}-${part("day")}`;
  if (year < 1950 || value > today) return "Enter a date from 1950 through today.";
  return undefined;
}

export function validatePersonalStep(values: EnrollmentValues): EnrollmentErrors {
  const errors: EnrollmentErrors = {};
  const fullNameError = validateName(values.fullName, "Full name");
  const fatherNameError = validateName(values.fatherName, "Father's name");
  if (fullNameError) errors.fullName = fullNameError;
  if (fatherNameError) errors.fatherName = fatherNameError;
  if (!normalizePakistaniPhone(values.phoneNumber)) {
    errors.phoneNumber = "Enter a valid Pakistani mobile number (03XX XXXXXXX).";
  }
  if (!values.sameAsPhone && !normalizePakistaniPhone(values.whatsappNumber)) {
    errors.whatsappNumber = "Enter a valid Pakistani mobile number (03XX XXXXXXX).";
  }
  if (values.emailAddress.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailAddress.trim())) {
    errors.emailAddress = "Enter a valid email address.";
  }
  if (!normalizeCnic(values.cnic)) errors.cnic = "Enter a 13-digit CNIC or B-Form number.";
  const dobError = validateDob(values.dateOfBirth);
  if (dobError) errors.dateOfBirth = dobError;
  if (!qualifications.includes(values.lastQualification)) errors.lastQualification = "Select your last qualification.";
  return errors;
}

export function validateCourseStep(values: EnrollmentValues): EnrollmentErrors {
  const errors: EnrollmentErrors = {};
  if (!courses.some((course) => course.slug === values.courseSlug)) errors.courseSlug = "Select a course.";
  if (values.batchTime !== "Morning" && values.batchTime !== "Evening") errors.batchTime = "Select a preferred batch time.";
  if (!referralSources.includes(values.referralSource)) errors.referralSource = "Select how you heard about us.";
  if (!laptopOptions.includes(values.laptop)) errors.laptop = "Choose one laptop option.";
  if (!goals.includes(values.goal)) errors.goal = "Select your goal after the course.";
  return errors;
}

export function validateEnrollment(values: EnrollmentValues): EnrollmentErrors {
  const errors: EnrollmentErrors = {
    ...validatePersonalStep(values),
    ...validateCourseStep(values),
  };
  if (!values.confirmed) errors.confirmed = "Please confirm that the information is correct.";
  if (values.referredBy.length > 200) errors.referredBy = "Referral value is too long.";
  return errors;
}

export function hasEnrollmentErrors(errors: EnrollmentErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const stringFields = [
  "fullName", "fatherName", "phoneNumber", "whatsappNumber", "emailAddress", "cnic",
  "dateOfBirth", "lastQualification", "institutionName", "courseSlug", "batchTime",
  "referralSource", "laptop", "goal", "referredBy", "website",
] as const;

export function parseEnrollmentValues(value: unknown): EnrollmentValues | null {
  if (!isRecord(value)) return null;
  for (const field of stringFields) {
    if (typeof value[field] !== "string") return null;
  }
  if (typeof value.sameAsPhone !== "boolean" || typeof value.confirmed !== "boolean") return null;
  return {
    fullName: value.fullName as string,
    fatherName: value.fatherName as string,
    phoneNumber: value.phoneNumber as string,
    whatsappNumber: value.whatsappNumber as string,
    sameAsPhone: value.sameAsPhone,
    emailAddress: value.emailAddress as string,
    cnic: value.cnic as string,
    dateOfBirth: value.dateOfBirth as string,
    lastQualification: value.lastQualification as string,
    institutionName: value.institutionName as string,
    courseSlug: value.courseSlug as string,
    batchTime: value.batchTime as string,
    referralSource: value.referralSource as string,
    laptop: value.laptop as string,
    goal: value.goal as string,
    confirmed: value.confirmed,
    referredBy: value.referredBy as string,
    website: value.website as string,
  };
}
