import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
export const metadata: Metadata = { title: "Enroll | ZetaSkills", description: "Get in touch with ZetaSkills about enrollment." };
export default function EnrollPage() { return <><Navbar /><main className="container section" style={{ minHeight: "55vh" }}><h1>Enroll Now</h1><p>Contact our team at info@zetaskills.com to ask about a course.</p></main><Footer /><WhatsAppButton /></>; }
