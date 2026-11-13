import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
export const metadata: Metadata = { title: "Contact | ZetaSkills", description: "Contact ZetaSkills in Faisalabad." };
export default function ContactPage() { return <><Navbar /><main className="container section" style={{ minHeight: "55vh" }}><h1>Contact</h1><p>Email info@zetaskills.com or visit us at Building 01, Street 06, Ali Garden, Madinah Town, Faisalabad.</p></main><Footer /><WhatsAppButton /></>; }
