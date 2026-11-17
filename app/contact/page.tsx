import { CAMPUS_ADDRESS, CAMPUS_MAP_URL, CONTACT_EMAIL, WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/lib/contact";
import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact | ZetaSkills", description: "Contact ZetaSkills in Faisalabad." };

export default function ContactPage() {
  const number = WHATSAPP_NUMBER;
  return <><Navbar /><main className="contact-page"><div className="container contact-page-layout">
    <section className="contact-page-info" aria-labelledby="contact-title">
      <span className="contact-page-eyebrow">WE&apos;RE HERE TO HELP</span>
      <h1 id="contact-title">Let&apos;s start a <span>conversation.</span></h1>
      <p>Have a question about our courses or enrollment? Get in touch and our team will be happy to help you find your next step.</p>
      <div className="contact-methods">
        <a className="contact-method" href={`mailto:${CONTACT_EMAIL}`}><span className="contact-method-icon"><Mail size={21} /></span><span><strong>Email us</strong><small>{CONTACT_EMAIL}</small></span><ArrowUpRight className="contact-method-arrow" size={18} /></a>
        <a className="contact-method" href={`https://wa.me/${number}`} target="_blank" rel="noreferrer"><span className="contact-method-icon"><MessageCircle size={21} /></span><span><strong>Chat on WhatsApp</strong><small>{WHATSAPP_DISPLAY}</small></span><ArrowUpRight className="contact-method-arrow" size={18} /></a>
        <a className="contact-method" href={CAMPUS_MAP_URL} target="_blank" rel="noreferrer"><span className="contact-method-icon"><MapPin size={21} /></span><span><strong>Visit our campus</strong><small>{CAMPUS_ADDRESS}</small></span><ArrowUpRight className="contact-method-arrow" size={18} /></a>
      </div>
    </section>
    <div className="contact-page-form"><ContactForm /></div>
  </div></main><Footer /><WhatsAppButton /></>;
}
