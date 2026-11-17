"use client";
import { WHATSAPP_NUMBER } from "@/lib/contact";
import { ZetaLoader } from "@/components/ZetaLoader";

import { useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Laptop, LoaderCircle, Moon, Sun } from "lucide-react";
import type { Course } from "@/data/course-types";
import {
  formatCnic,
  hasEnrollmentErrors,
  isRecord,
  normalizeCnic,
  normalizePakistaniPhone,
  validateCourseStep,
  validateEnrollment,
  validatePersonalStep,
  type EnrollmentErrors,
  type EnrollmentField,
  type EnrollmentValues,
} from "@/lib/validation";

type EnrollFlowProps = {
  courses: Course[];
  initialCourse: string;
  courseWasPrefilled: boolean;
  referredBy: string;
};

const initialValues = (initialCourse: string, referredBy: string): EnrollmentValues => ({
  fullName: "",
  fatherName: "",
  phoneNumber: "",
  whatsappNumber: "",
  sameAsPhone: true,
  emailAddress: "",
  cnic: "",
  dateOfBirth: "",
  lastQualification: "",
  institutionName: "",
  courseSlug: initialCourse,
  batchTime: "",
  referralSource: "",
  laptop: "",
  goal: "",
  confirmed: false,
  referredBy,
  website: "",
});

const personalOrder: EnrollmentField[] = ["fullName", "fatherName", "phoneNumber", "whatsappNumber", "emailAddress", "cnic", "dateOfBirth", "lastQualification"];
const courseOrder: EnrollmentField[] = ["courseSlug", "batchTime", "referralSource", "laptop", "goal"];
const focusIds: Partial<Record<EnrollmentField, string>> = {
  fullName: "enroll-fullName",
  fatherName: "enroll-fatherName",
  phoneNumber: "enroll-phoneNumber",
  whatsappNumber: "enroll-whatsappNumber",
  emailAddress: "enroll-emailAddress",
  cnic: "enroll-cnic",
  dateOfBirth: "enroll-dateOfBirth",
  lastQualification: "enroll-lastQualification",
  courseSlug: "enroll-courseSlug",
  batchTime: "enroll-batchTime-morning",
  referralSource: "enroll-referralSource",
  laptop: "enroll-laptop-yes",
  goal: "enroll-goal-job",
  confirmed: "enroll-confirmed",
};

const stepVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 36 : -36 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -36 : 36 }),
};

export function EnrollFlow({ courses, initialCourse, courseWasPrefilled, referredBy }: EnrollFlowProps) {
  const [values, setValues] = useState<EnrollmentValues>(() => initialValues(initialCourse, referredBy));
  const [errors, setErrors] = useState<EnrollmentErrors>({});
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [motionReady, setMotionReady] = useState(false);
  const reducedMotion = useReducedMotion();
  const successHeading = useRef<HTMLHeadingElement>(null);
  const submissionId = useRef<string | null>(null);
  const whatsappNumber = WHATSAPP_NUMBER;
  const whatsappHref = `https://wa.me/${whatsappNumber}`;

  useEffect(() => setMotionReady(true), []);
  useEffect(() => {
    if (!isSuccess) return;
    window.scrollTo({ top: 0, behavior: reducedMotion === false ? "smooth" : "auto" });
    window.requestAnimationFrame(() => successHeading.current?.focus({ preventScroll: true }));
  }, [isSuccess, reducedMotion]);

  const updateValue = <K extends EnrollmentField>(field: K, value: EnrollmentValues[K]) => {
    submissionId.current = null;
    setValues((current) => ({ ...current, [field]: value, ...(field === "confirmed" ? {} : { confirmed: false }) }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      if (field !== "confirmed") delete next.confirmed;
      if (field === "phoneNumber" && values.sameAsPhone) delete next.whatsappNumber;
      if (field === "sameAsPhone" && value === true) delete next.whatsappNumber;
      return next;
    });
    setFormError("");
  };

  const goToStep = (nextStep: 1 | 2 | 3, preserveErrors = false) => {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
    if (!preserveErrors) setErrors({});
    setFormError("");
  };

  const focusFirstError = (nextErrors: EnrollmentErrors, order: EnrollmentField[], delay = 0) => {
    const first = order.find((field) => nextErrors[field]);
    const id = first ? focusIds[first] : undefined;
    if (!id) return;
    const focus = () => window.requestAnimationFrame(() => document.getElementById(id)?.focus());
    if (delay > 0) window.setTimeout(focus, delay);
    else focus();
  };

  const setStepError = (nextErrors: EnrollmentErrors, order: EnrollmentField[]) => {
    setErrors(nextErrors);
    focusFirstError(nextErrors, order);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setFormError("");

    if (step === 1) {
      const nextErrors = validatePersonalStep(values);
      if (hasEnrollmentErrors(nextErrors)) {
        setStepError(nextErrors, personalOrder);
        return;
      }
      goToStep(2);
      return;
    }

    if (step === 2) {
      const nextErrors = validateCourseStep(values);
      if (hasEnrollmentErrors(nextErrors)) {
        setStepError(nextErrors, courseOrder);
        return;
      }
      goToStep(3);
      return;
    }

    const nextErrors = validateEnrollment(values);
    if (hasEnrollmentErrors(nextErrors)) {
      setErrors(nextErrors);
      if (personalOrder.some((field) => nextErrors[field])) {
        goToStep(1, true);
        focusFirstError(nextErrors, personalOrder, 350);
      } else if (courseOrder.some((field) => nextErrors[field])) {
        goToStep(2, true);
        focusFirstError(nextErrors, courseOrder, 350);
      } else {
        focusFirstError(nextErrors, ["confirmed"]);
      }
      return;
    }

    const normalizedPhone = normalizePakistaniPhone(values.phoneNumber);
    const normalizedWhatsapp = normalizePakistaniPhone(values.sameAsPhone ? values.phoneNumber : values.whatsappNumber);
    const normalizedCnic = normalizeCnic(values.cnic);
    if (!normalizedPhone || !normalizedWhatsapp || !normalizedCnic) return;

    setIsSubmitting(true);
    try {
      if (!submissionId.current) submissionId.current = crypto.randomUUID();
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          submissionId: submissionId.current,
          fullName: values.fullName.trim(),
          fatherName: values.fatherName.trim(),
          phoneNumber: normalizedPhone,
          whatsappNumber: normalizedWhatsapp,
          emailAddress: values.emailAddress.trim(),
          cnic: normalizedCnic,
          institutionName: values.institutionName.trim(),
        }),
      });
      const result: unknown = await response.json();
      if (response.ok && isRecord(result) && result.ok === true && result.reference === submissionId.current) {
        setIsSuccess(true);
        return;
      }
      if (response.status === 400 && isRecord(result) && isRecord(result.errors)) {
        const serverErrors: EnrollmentErrors = {};
        for (const [field, message] of Object.entries(result.errors)) {
          if (field in values && typeof message === "string") {
            serverErrors[field as EnrollmentField] = message;
          }
        }
        if (hasEnrollmentErrors(serverErrors)) {
          setErrors(serverErrors);
          if (personalOrder.some((field) => serverErrors[field])) {
            goToStep(1, true);
            focusFirstError(serverErrors, personalOrder, 350);
          } else if (courseOrder.some((field) => serverErrors[field])) {
            goToStep(2, true);
            focusFirstError(serverErrors, courseOrder, 350);
          } else if (serverErrors.confirmed) focusFirstError(serverErrors, ["confirmed"]);
          else setFormError("Please check your enrollment details and try again.");
          return;
        }
        if (typeof result.errors.form === "string") {
          setFormError(result.errors.form);
          return;
        }
      }
      setFormError("Something went wrong. Please try again or message us on WhatsApp.");
    } catch {
      setFormError("Something went wrong. Please try again or message us on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCourse = courses.find((course) => course.slug === values.courseSlug);
  const canAnimate = motionReady && reducedMotion === false;

  if (isSuccess) {
    const success = <SuccessView course={selectedCourse} batchTime={values.batchTime} headingRef={successHeading} whatsappHref={whatsappHref} />;
    return <main className="enroll-main container">
      <ZetaLoader active={isSubmitting} />
      <header className="enroll-heading"><h1>Enroll Now</h1><p>Fill in your details and our team will contact you within 24 hours.</p></header>
      {canAnimate ? <motion.div className="enroll-success-wrap" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>{success}</motion.div> : <div className="enroll-success-wrap">{success}</div>}
    </main>;
  }

  const form = <form id="enroll-form" className="enroll-form" noValidate onSubmit={submit}>
    <input type="hidden" name="referredBy" value={values.referredBy} readOnly />
    {formError && <p className="enroll-form-error" role="alert">{formError} <a href={whatsappHref} target="_blank" rel="noreferrer">Contact us on WhatsApp</a></p>}
    {canAnimate ? <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div key={step} custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeOut" }}>
        {step === 1 ? <PersonalStep values={values} errors={errors} updateValue={updateValue} /> : step === 2 ? <CourseStep values={values} errors={errors} updateValue={updateValue} courses={courses} courseWasPrefilled={courseWasPrefilled} /> : <ConfirmStep values={values} errors={errors} course={selectedCourse} onEdit={goToStep} updateValue={updateValue} />}
      </motion.div>
    </AnimatePresence> : <div key={step}>
      {step === 1 ? <PersonalStep values={values} errors={errors} updateValue={updateValue} /> : step === 2 ? <CourseStep values={values} errors={errors} updateValue={updateValue} courses={courses} courseWasPrefilled={courseWasPrefilled} /> : <ConfirmStep values={values} errors={errors} course={selectedCourse} onEdit={goToStep} updateValue={updateValue} />}
    </div>}
    <div className={`enroll-actions ${step === 1 ? "enroll-actions-single" : ""}`}>
      {step > 1 && <button type="button" className="button button-outline" onClick={() => goToStep(step === 3 ? 2 : 1)} disabled={isSubmitting}><ArrowLeft size={17} />Back</button>}
      {step < 3 ? <button type="submit" className="button button-primary enroll-next">Next<ArrowRight size={17} /></button> : <button type="submit" className="button button-primary enroll-submit" disabled={!values.confirmed || isSubmitting}>{isSubmitting ? <><LoaderCircle className="enroll-spinner" size={17} />Submitting...</> : <>Submit Enrollment<ArrowRight size={17} /></>}</button>}
    </div>
  </form>;

  const card = <div className="enroll-card">{form}</div>;
  return <main className="enroll-main container">
    <ZetaLoader active={isSubmitting} />
    <header className="enroll-heading"><h1>Enroll Now</h1><p>Fill in your details and our team will contact you within 24 hours.</p></header>
    <ProgressSteps step={step} />
    {canAnimate ? <motion.div className="enroll-card-motion" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>{card}</motion.div> : <div className="enroll-card-motion">{card}</div>}
  </main>;
}

function ProgressSteps({ step }: { step: 1 | 2 | 3 }) {
  const items = ["Personal", "Course", "Confirm"];
  return <div className="enroll-progress" aria-label={`Step ${step} of 3`}>
    <div className="enroll-progress-track" aria-hidden="true"><span className="enroll-progress-fill" style={{ width: `${((step - 1) / 2) * 100}%` }} /></div>
    {items.map((label, index) => {
      const number = index + 1;
      const active = number === step;
      const complete = number < step;
      return <div className={`enroll-progress-step${active ? " current" : ""}${complete ? " complete" : ""}`} key={label} aria-current={active ? "step" : undefined}>
        <span className="enroll-step-number">{complete ? <Check size={17} strokeWidth={2.5} /> : number}</span>
        <span className="enroll-step-label"><small>STEP 0{number}</small><strong>{label}</strong></span>
      </div>;
    })}
  </div>;
}

type TextFieldName = "fullName" | "fatherName" | "phoneNumber" | "emailAddress" | "cnic" | "dateOfBirth" | "institutionName";
type TextFieldProps = {
  id: string;
  name: TextFieldName;
  label: string;
  value: string;
  error?: string;
  helper?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  className?: string;
  onChange: (value: string) => void;
};

function TextField({ id, name, label, value, error, helper, placeholder, required, disabled, inputProps, className = "", onChange }: TextFieldProps) {
  const helperId = helper ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;
  return <div className={`enroll-field ${className}`}>
    <label htmlFor={id}>{label}{required && <span className="enroll-required" aria-hidden="true"> *</span>}</label>
    <input id={id} name={name} type="text" value={value} placeholder={placeholder} required={required} disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={describedBy} onChange={(event) => onChange(event.target.value)} {...inputProps} />
    {helper && <small className="enroll-field-hint" id={helperId}>{helper}</small>}
    {error && <small className="enroll-field-error" id={errorId} role="alert">{error}</small>}
  </div>;
}

type SelectFieldProps = {
  id: string;
  name: EnrollmentField;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  error?: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

function SelectField({ id, name, label, value, options, error, placeholder = "Select an option", required = true, onChange }: SelectFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  return <div className="enroll-field">
    <label htmlFor={id}>{label}{required && <span className="enroll-required" aria-hidden="true"> *</span>}</label>
    <select id={id} name={name} value={value} required={required} aria-invalid={Boolean(error)} aria-describedby={errorId} onChange={(event) => onChange(event.target.value)}>
      <option value="">{placeholder}</option>
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
    {error && <small className="enroll-field-error" id={errorId} role="alert">{error}</small>}
  </div>;
}

type PersonalStepProps = {
  values: EnrollmentValues;
  errors: EnrollmentErrors;
  updateValue: <K extends EnrollmentField>(field: K, value: EnrollmentValues[K]) => void;
};

function PersonalStep({ values, errors, updateValue }: PersonalStepProps) {
  const effectiveWhatsapp = values.sameAsPhone ? values.phoneNumber : values.whatsappNumber;
  const whatsappErrorId = errors.whatsappNumber ? "enroll-whatsappNumber-error" : undefined;
  return <section className="enroll-step-content" aria-labelledby="personal-step-title">
    <div className="enroll-card-heading"><h2 id="personal-step-title">Personal Details</h2><p>Tell us a little about yourself.</p></div>
    <div className="enroll-fields-grid">
      <TextField id="enroll-fullName" name="fullName" label="Full Name" required value={values.fullName} error={errors.fullName} placeholder="e.g. Muhammad Ali" onChange={(value) => updateValue("fullName", value)} inputProps={{ autoComplete: "name" }} />
      <TextField id="enroll-fatherName" name="fatherName" label="Father's Name" required value={values.fatherName} error={errors.fatherName} placeholder="e.g. Tariq Mehmood" onChange={(value) => updateValue("fatherName", value)} />
      <TextField id="enroll-phoneNumber" name="phoneNumber" label="Phone Number" required value={values.phoneNumber} error={errors.phoneNumber} placeholder="03XX XXXXXXX" onChange={(value) => updateValue("phoneNumber", value)} inputProps={{ type: "tel", autoComplete: "tel", inputMode: "tel" }} />
      <div className="enroll-field">
        <div className="enroll-field-label-row"><label htmlFor="enroll-whatsappNumber">WhatsApp Number<span className="enroll-required" aria-hidden="true"> *</span></label><label className="enroll-inline-check"><input type="checkbox" checked={values.sameAsPhone} onChange={(event) => updateValue("sameAsPhone", event.target.checked)} />Same as phone number</label></div>
        <input id="enroll-whatsappNumber" name="whatsappNumber" type="tel" autoComplete="tel" inputMode="tel" placeholder="03XX XXXXXXX" value={effectiveWhatsapp} disabled={values.sameAsPhone} required={!values.sameAsPhone} aria-invalid={Boolean(errors.whatsappNumber)} aria-describedby={whatsappErrorId} onChange={(event) => updateValue("whatsappNumber", event.target.value)} />
        {errors.whatsappNumber && <small className="enroll-field-error" id={whatsappErrorId} role="alert">{errors.whatsappNumber}</small>}
      </div>
      <TextField id="enroll-emailAddress" name="emailAddress" label="Email Address (optional)" value={values.emailAddress} error={errors.emailAddress} placeholder="name@example.com" onChange={(value) => updateValue("emailAddress", value)} inputProps={{ type: "email", autoComplete: "email" }} />
      <TextField id="enroll-cnic" name="cnic" label="CNIC or B-Form Number" required value={values.cnic} error={errors.cnic} helper="Used for certificate issuance" placeholder="33100-1234567-1" onChange={(value) => updateValue("cnic", formatCnic(value))} inputProps={{ inputMode: "numeric", autoComplete: "off" }} />
      <TextField id="enroll-dateOfBirth" name="dateOfBirth" label="Date of Birth" required value={values.dateOfBirth} error={errors.dateOfBirth} onChange={(value) => updateValue("dateOfBirth", value)} inputProps={{ type: "date", autoComplete: "bday", min: "1950-01-01" }} />
      <SelectField id="enroll-lastQualification" name="lastQualification" label="Last Qualification" value={values.lastQualification} error={errors.lastQualification} options={["Matric", "Inter", "Graduate", "Other"].map((value) => ({ value, label: value }))} placeholder="Select your qualification" onChange={(value) => updateValue("lastQualification", value)} />
      <TextField id="enroll-institutionName" name="institutionName" label="Institution Name (optional)" value={values.institutionName} placeholder="e.g. GC University Faisalabad" onChange={(value) => updateValue("institutionName", value)} className="enroll-field-full" />
    </div>
  </section>;
}

type RadioOption = { label: string; value: string; icon?: ReactNode };
type RadioCardsProps = {
  name: "batchTime" | "laptop" | "goal";
  legend: string;
  value: string;
  options: RadioOption[];
  error?: string;
  columns?: 2 | 3;
  onChange: (value: string) => void;
};

function RadioCards({ name, legend, value, options, error, columns = 2, onChange }: RadioCardsProps) {
  const errorId = error ? `enroll-${name}-error` : undefined;
  return <fieldset className="enroll-radio-fieldset" aria-describedby={errorId}>
    <legend>{legend}<span className="enroll-required" aria-hidden="true"> *</span></legend>
    <div className={`enroll-radio-grid enroll-radio-grid-${columns}`}>
      {options.map((option) => {
        const optionId = `enroll-${name}-${option.value.toLowerCase().replace(/\s+/g, "-")}`;
        const checked = value === option.value;
        return <label className={`enroll-radio-card${checked ? " selected" : ""}`} htmlFor={optionId} key={option.value}>
          <input id={optionId} name={name} type="radio" value={option.value} checked={checked} required onChange={() => onChange(option.value)} />
          {option.icon && <span className="enroll-radio-icon" aria-hidden="true">{option.icon}</span>}
          <span>{option.label}</span><span className="enroll-radio-dot" aria-hidden="true" />
        </label>;
      })}
    </div>
    {error && <small className="enroll-field-error" id={errorId} role="alert">{error}</small>}
  </fieldset>;
}

type CourseStepProps = PersonalStepProps & { courses: Course[]; courseWasPrefilled: boolean };

function CourseStep({ values, errors, updateValue, courses, courseWasPrefilled }: CourseStepProps) {
  const options = courses.map((course) => ({ value: course.slug, label: `${course.title} (${course.duration})` }));
  return <section className="enroll-step-content" aria-labelledby="course-step-title">
    <div className="enroll-card-heading"><h2 id="course-step-title">Course Details</h2><p>Select a course and share your preferences.</p></div>
    <div className="enroll-course-fields">
      <SelectField id="enroll-courseSlug" name="courseSlug" label="Course Selection" value={values.courseSlug} error={errors.courseSlug} options={options} placeholder="Select a course" onChange={(value) => updateValue("courseSlug", value)} />
      {courseWasPrefilled && <p className="enroll-prefilled-note">Pre-filled from the course page</p>}
      <RadioCards name="batchTime" legend="Preferred Batch Time" value={values.batchTime} error={errors.batchTime} options={[{ label: "Morning", value: "Morning", icon: <Sun size={19} /> }, { label: "Evening", value: "Evening", icon: <Moon size={19} /> }]} onChange={(value) => updateValue("batchTime", value)} />
      <SelectField id="enroll-referralSource" name="referralSource" label="How did you hear about us?" value={values.referralSource} error={errors.referralSource} options={["Facebook", "Friend", "Walk-in", "Google", "Other"].map((value) => ({ value, label: value }))} onChange={(value) => updateValue("referralSource", value)} />
      <RadioCards name="laptop" legend="Do you have a laptop?" value={values.laptop} error={errors.laptop} columns={3} options={[{ label: "Yes", value: "Yes", icon: <Laptop size={18} /> }, { label: "No", value: "No" }, { label: "Will arrange", value: "Will arrange" }]} onChange={(value) => updateValue("laptop", value)} />
      <RadioCards name="goal" legend="Your goal after the course?" value={values.goal} error={errors.goal} columns={3} options={[{ label: "Job", value: "Job" }, { label: "Freelancing", value: "Freelancing" }, { label: "Own Business", value: "Own Business" }]} onChange={(value) => updateValue("goal", value)} />
    </div>
  </section>;
}

type ConfirmStepProps = {
  values: EnrollmentValues;
  errors: EnrollmentErrors;
  course?: Course;
  onEdit: (step: 1 | 2 | 3) => void;
  updateValue: <K extends EnrollmentField>(field: K, value: EnrollmentValues[K]) => void;
};

function ConfirmStep({ values, errors, course, onEdit, updateValue }: ConfirmStepProps) {
  const whatsapp = values.sameAsPhone ? values.phoneNumber : values.whatsappNumber;
  const prettyDate = values.dateOfBirth ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${values.dateOfBirth}T00:00:00.000Z`)) : "Not provided";
  const personal: [string, string][] = [
    ["Full Name", values.fullName],
    ["Father's Name", values.fatherName],
    ["Phone Number", values.phoneNumber],
    ["WhatsApp Number", whatsapp],
    ["WhatsApp setting", values.sameAsPhone ? "Same as phone number" : "Separate number"],
    ["Email Address", values.emailAddress],
    ["CNIC or B-Form Number", values.cnic],
    ["Date of Birth", prettyDate],
    ["Last Qualification", values.lastQualification],
    ["Institution Name", values.institutionName],
  ];
  const preferences: [string, string][] = [
    ["Course Selection", course?.title ?? ""],
    ["Preferred Batch Time", values.batchTime],
    ["How did you hear about us?", values.referralSource],
    ["Do you have a laptop?", values.laptop],
    ["Your goal after the course?", values.goal],
  ];
  return <section className="enroll-step-content enroll-confirm-step" aria-labelledby="confirm-step-title">
    <div className="enroll-card-heading"><h2 id="confirm-step-title">Review Your Application</h2><p>Please check your details before submitting.</p></div>
    <ReviewGroup title="Personal Details" rows={personal} onEdit={() => onEdit(1)} />
    <ReviewGroup title="Course & Preferences" rows={preferences} onEdit={() => onEdit(2)} />
    <div className="enroll-confirm-control">
      <label htmlFor="enroll-confirmed"><input id="enroll-confirmed" name="confirmed" type="checkbox" checked={values.confirmed} required onChange={(event) => updateValue("confirmed", event.target.checked)} aria-invalid={Boolean(errors.confirmed)} aria-describedby={errors.confirmed ? "enroll-confirmed-error" : undefined} />I confirm that the information above is correct.</label>
      {errors.confirmed && <small className="enroll-field-error" id="enroll-confirmed-error" role="alert">{errors.confirmed}</small>}
    </div>
  </section>;
}

function ReviewGroup({ title, rows, onEdit }: { title: string; rows: [string, string][]; onEdit: () => void }) {
  return <section className="enroll-review-group" aria-label={title}>
    <div className="enroll-review-heading"><h3><span aria-hidden="true" />{title}</h3><a href="#enroll-form" onClick={(event) => { event.preventDefault(); onEdit(); }}>Edit</a></div>
    <dl className="enroll-review-grid">{rows.map(([label, value]) => <div className="enroll-review-row" key={label}><dt>{label}</dt><dd>{value.trim() || "Not provided"}</dd></div>)}</dl>
  </section>;
}

function SuccessView({ course, batchTime, headingRef, whatsappHref }: { course?: Course; batchTime: string; headingRef: React.RefObject<HTMLHeadingElement>; whatsappHref: string }) {
  return <section className="enroll-success-card" aria-labelledby="enroll-success-heading">
    <CheckCircle2 className="enroll-success-icon" size={60} strokeWidth={1.8} aria-hidden="true" />
    <h2 id="enroll-success-heading" ref={headingRef} tabIndex={-1}>Enrollment received!</h2>
    <p className="enroll-success-copy">We will contact you within 24 hours on WhatsApp.</p>
    <div className="enroll-success-summary"><span>Selected course</span><strong>{course?.title ?? "Course"}</strong><span>{batchTime} batch</span></div>
    <div className="enroll-next-steps"><h3>What happens next</h3><ol><li>We message you on WhatsApp</li><li>We confirm your batch details</li><li>You start your course</li></ol></div>
    <div className="enroll-success-actions"><Link href="/" className="button button-primary">Back to Home</Link><Link href="/courses" className="button button-outline">Browse More Courses</Link></div>
    <a className="enroll-whatsapp-link" href={whatsappHref} target="_blank" rel="noreferrer">Message us on WhatsApp</a>
  </section>;
}
