import { WHATSAPP_NUMBER } from "@/lib/contact";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, BriefcaseBusiness, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactSection } from "@/components/ContactSection";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import coursesData from "@/data/courses.json";
import type { Course } from "@/data/course-types";

const courses = coursesData as Course[];
const categories: Record<Course["category"], string> = { ai: "AI & Automation", web: "Web Development", design: "Design", ecommerce: "E-Commerce", marketing: "Digital Marketing", mobile: "Mobile Development" };
export function generateStaticParams() { return courses.map(({ slug }) => ({ slug })); }
export function generateMetadata({ params }: { params: { slug: string } }) { const course = courses.find(c => c.slug === params.slug); return { title: course ? `${course.title} | ZetaSkills` : "Course | ZetaSkills", description: course?.description }; }
export default function CourseDetail({ params }: { params: { slug: string } }) {
  const course = courses.find(c => c.slug === params.slug);
  if (!course) notFound();
  const number = WHATSAPP_NUMBER;
  const faqs = [
    ["What courses does ZetaSkills offer?", "We offer practical courses in AI, web development, design, marketing, e-commerce and mobile development."],
    ["Are the courses beginner-friendly?", course.prerequisites],
    ["Do I need prior experience to enroll?", course.prerequisites],
    ["Will I receive a certificate after completing the course?", "Contact our team for details about course completion and certificates."],
    ["Are internship opportunities available?", "Contact our team to learn about available internship opportunities and eligibility."]
  ];
  return <><Navbar /><main><div className="container detail-page">
    <nav className="detail-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/courses">Courses</Link><span>/</span><strong>{course.title}</strong></nav>
    <div className="detail-layout"><div className="detail-content">
      <span className="detail-category">{categories[course.category]}</span><h1>{course.title}</h1><p className="detail-description">{course.description}</p>
      <div className="detail-tags"><span>{course.duration}</span><span>Practical learning</span></div>
      <section><h2>What You Will Learn</h2><ul className="detail-learn">{course.learn.map(item => <li key={item}><CheckCircle2 size={20} aria-hidden="true" />{item}</li>)}</ul></section>
      <section><h2>Tools Covered</h2><div className="detail-tags">{course.tools.map(tool => <span key={tool}>{tool}</span>)}</div></section>
      <section><h2>Course Syllabus</h2><div className="detail-accordion">{course.syllabus.map(({ week, topic, topics }) => <details key={week}><summary>Week {week}: {topic}</summary><ul className="syllabus-topics">{topics.map(item => <li key={item}>{item}</li>)}</ul></details>)}</div></section>
      <div className="detail-intern"><BriefcaseBusiness aria-hidden="true" /><div><strong>Graduate and Intern at AR Swift Private Limited</strong><p>Ask our team about opportunities to gain practical experience.</p></div></div>
      <section><h2>Frequently asked questions</h2><div className="detail-accordion">{faqs.map(([q,a], i) => <details key={q}><summary>{i + 1}. {q}</summary><p>{a}</p></details>)}</div></section>
    </div><aside className="detail-sidebar"><dl><div><dt>Duration</dt><dd>{course.duration}</dd></div><div><dt>Batches</dt><dd>Morning / Evening</dd></div></dl><Link className="button button-primary" href={`/enroll?course=${course.slug}`}>Enroll Now</Link><a className="button detail-whatsapp" href={`https://wa.me/${number}?text=${encodeURIComponent(`Hello, I would like to know more about ${course.title}.`)}`} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Ask on WhatsApp</a></aside></div>
  </div><ContactSection /></main><Footer /><WhatsAppButton /></>;
}
