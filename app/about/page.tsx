import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
export const metadata: Metadata = { title: "About | ZetaSkills", description: "About ZetaSkills and AR Swift Private Limited." };
export default function AboutPage() { return <><Navbar /><main className="container section" style={{ minHeight: "55vh" }}><h1>About ZetaSkills</h1><p>An IT and freelancing institute in Faisalabad, owned by AR Swift Private Limited.</p><section id="internship" className="internship"><h2>Internship at AR Swift Private Limited</h2><p>Students can get an opportunity to work on live international projects after completing a course.</p></section></main><Footer /><WhatsAppButton /></>; }
