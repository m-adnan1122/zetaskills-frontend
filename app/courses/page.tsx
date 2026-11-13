import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
export const metadata: Metadata = { title: "Courses | ZetaSkills", description: "Explore ZetaSkills courses." };
export default function CoursesPage() { return <><Navbar /><main className="container section" style={{ minHeight: "55vh" }}><h1>Courses</h1><p>Explore courses at ZetaSkills.</p></main><Footer /><WhatsAppButton /></>; }
