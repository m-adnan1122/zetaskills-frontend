import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SlideIn } from "@/components/motion/SlideIn";
import { SitePhoto } from "@/components/SitePhoto";

export function InternshipSection({ id }: { id?: string }) {
  return <SlideIn id={id} className="container internship" duration={0.6}><div><h2>Explore an Internship with AR Swift Private Limited</h2><p>After your course, explore opportunities to develop practical experience with AR Swift. Contact our team to learn about eligibility and availability.</p><div className="internship-actions"><Link className="button button-primary internship-enroll" href="/enroll">Enroll Now</Link><Link className="button internship-terms" href="/internship-terms">Learn About Internship Terms <ArrowRight size={17} /></Link></div></div><div className="internship-visual"><SitePhoto src="/Website_Images_Pack/Website_Images/pakistan_tech_training_workspace.png" alt="Illustration of a learner working on a laptop" className="internship-photo" sizes="(max-width: 700px) 100vw, 40vw" /><ul>{["Explore practical project work", "Learn about client work", "Connect with the AR Swift team", "Develop your portfolio"].map((text) => <li key={text}><CheckCircle2 />{text}</li>)}</ul></div></SlideIn>;
}
