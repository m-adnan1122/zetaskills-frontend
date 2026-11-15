import { FadeUp } from "@/components/motion/FadeUp";
import { ContactForm } from "@/components/ContactForm";

export function ContactSection() {
  return <section className="contact-section"><div className="container contact-grid"><FadeUp><div><h2>Your Future in<br />Tech Starts Here!</h2><p>Ready to turn your interest in technology into practical, career-ready skills? Join ZetaSkills and learn through hands-on training, real-world projects, and expert guidance. Build your confidence, earn a certificate, and get opportunities to gain industry experience through AR Swift Private Limited.</p><ul className="contact-points"><li>Learn in-demand digital and technology skills</li><li>Gain practical experience through internship opportunities</li><li>Build projects and prepare for your professional career</li></ul></div></FadeUp><FadeUp delay={0.2}><ContactForm /></FadeUp></div></section>;
}
