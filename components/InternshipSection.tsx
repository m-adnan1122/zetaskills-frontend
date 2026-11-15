import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SlideIn } from "@/components/motion/SlideIn";

export function InternshipSection({ id }: { id?: string }) {
  return <SlideIn id={id} className="container internship" duration={0.6}><div><h2>Graduate and Intern at AR Swift Private Limited</h2><p>Work directly on live international projects, client software architectures, and production codebases after completing your course. Build proof-of-work that commands respect from global employers.</p><div className="internship-actions"><Link className="button button-primary internship-enroll" href="/enroll">Enroll Now</Link><Link className="button internship-terms" href="/about#internship">Learn About Internship Terms <ArrowRight size={17} /></Link></div></div><ul>{["Live international projects", "Real client work experience", "Mentorship from AR Swift team", "Portfolio-building projects"].map((text) => <li key={text}><CheckCircle2 />{text}</li>)}</ul></SlideIn>;
}
