"use client";
import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Contact request failed.");
      setStatus("Thanks! Your message has been received.");
      form.reset();
    } catch {
      setStatus("We couldn't send your message. Please email us at info@zetaskills.com instead.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form className="contact-form" onSubmit={submit}>
    <h3>Get in touch</h3>
    <p>We&apos;d love to hear from you. Please fill out this form.</p>
    <div className="form-pair">
      <label>First name<input name="firstName" placeholder="First name" autoComplete="given-name" required /></label>
      <label>Last name<input name="lastName" placeholder="Last name" autoComplete="family-name" /></label>
    </div>
    <label>Email<input type="email" name="email" placeholder="you@company.com" autoComplete="email" required /></label>
    <label>Phone number<span className="phone-input"><span>+92</span><input type="tel" name="phone" placeholder="300 1234567" autoComplete="tel-national" required /></span></label>
    <label>Message<textarea name="message" rows={3} placeholder="Leave us a message..." required /></label>
    <label className="privacy-check"><input type="checkbox" name="privacy" required /><span>You agree to our friendly privacy policy.</span></label>
    <button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send Message"}</button>
    <span className="form-status" aria-live="polite">{status}</span>
  </form>;
}
