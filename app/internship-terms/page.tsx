import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { WHATSAPP_NUMBER } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Internship Terms | ZetaSkills",
  description: "Learn about internship opportunities with AR Swift and how to ask about eligibility and availability.",
};

export default function InternshipTermsPage() {
  const message = encodeURIComponent("Hello, I would like to know about the internship terms, eligibility and availability.");
  return <><Navbar /><main className="internship-page container">
    <nav className="internship-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/about">About</Link><span aria-hidden="true">/</span><span aria-current="page">Internship terms</span></nav>
    <div className="internship-page-layout">
      <div className="internship-page-content">
        <p className="internship-page-eyebrow">YOUR NEXT STEP</p>
        <h1>Internship opportunities at AR Swift</h1>
        <p className="internship-page-lead">Explore how you may be able to put your skills into practice after a ZetaSkills course.</p>
        <section><h2>About the opportunity</h2><p>ZetaSkills students can ask about internship opportunities with AR Swift Private Limited. These opportunities may offer practical experience and a chance to build on the skills learned during training.</p></section>
        <section><h2>Eligibility and availability</h2><p>Internships are subject to eligibility and availability and are not guaranteed with course enrollment or completion. Contact the training team for the current requirements and application process.</p></section>
        <section><h2>Details to confirm with our team</h2><p>The team can explain the current terms, including internship duration, schedule, location, responsibilities, compensation, and any selection requirements before you decide to apply.</p></section>
      </div>
      <aside className="internship-page-aside"><span className="internship-page-aside-icon"><MessageCircle size={23} aria-hidden="true" /></span><h2>Have questions?</h2><p>Speak with our training team for the latest internship details.</p><a className="button detail-whatsapp" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`} target="_blank" rel="noreferrer"><MessageCircle size={19} aria-hidden="true" /> Ask on WhatsApp</a><Link className="button button-outline" href="/contact">Other ways to contact us</Link></aside>
    </div>
  </main><Footer /><WhatsAppButton /></>;
}
