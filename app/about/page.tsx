import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
export const metadata: Metadata = { title: "About | ZetaSkills", description: "About ZetaSkills and AR Swift Private Limited." };
export default function AboutPage() { return <><Navbar /><main className="container section" style={{ minHeight: "55vh" }}><h1>About ZetaSkills</h1><p>An IT and freelancing institute in Faisalabad, owned by AR Swift Private Limited.</p></main><Footer /><WhatsAppButton /></>; }
