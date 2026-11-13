import Link from "next/link";
import { ArrowRight, Bot, Code2, Layers2, ShoppingCart, Megaphone, Smartphone, Building2, Lightbulb, Wallet, Clock3, CheckCircle2, Star } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CourseCard } from "@/components/CourseCard";
import { ContactForm } from "@/components/ContactForm";
import courses from "@/data/courses.json";
import type { Course } from "@/data/course-types";
import testimonials from "@/data/placeholders";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ZetaSkills | Learn a Skill. Work on Real Projects.", description: "IT and freelancing courses in Faisalabad, with an internship opportunity at AR Swift Private Limited." };
const featuredSlugs = ["ai-tools-mastery", "ai-automation-workflows-n8n", "mern-stack-development", "ui-ux-design", "upwork-fiverr-freelancing", "flutter-mobile-development"];
const featuredCourses = featuredSlugs.map((slug) => (courses as Course[]).find((course) => course.slug === slug)).filter((course): course is Course => Boolean(course));
const categories = [
  { title: "AI & Automation", key: "ai", count: 5, text: "Learn useful AI tools and automation workflows.", Icon: Bot },
  { title: "Web Development", key: "web", count: 4, text: "Build websites and web applications.", Icon: Code2 },
  { title: "Design", key: "design", count: 2, text: "Create clear, useful digital designs.", Icon: Layers2 },
  { title: "E-Commerce", key: "ecommerce", count: 5, text: "Learn online selling and freelancing skills.", Icon: ShoppingCart },
  { title: "Digital Marketing", key: "marketing", count: 2, text: "Reach audiences across digital channels.", Icon: Megaphone },
  { title: "Mobile & Game Dev", key: "mobile", count: 3, text: "Make mobile apps and games.", Icon: Smartphone },
];
const stats = [["21+", "Courses"], ["500+", "Graduates"], ["4 Years", "AR Swift Experience"], ["100%", "Practical Training"]];
const reasons = [
  { title: "Internship at AR Swift", text: "An opportunity to work on live international projects after your course.", Icon: Building2 },
  { title: "100% Practical Training", text: "Learn by working through practical tasks and projects.", Icon: Lightbulb },
  { title: "Affordable fees from PKR 16,000", text: "Course fees start at PKR 16,000.", Icon: Wallet },
  { title: "Short courses of 1 to 4 months", text: "Choose a course that fits your learning goals.", Icon: Clock3 },
];
export default function Home() {
  return <><Navbar /><main>
    <section className="hero"><div className="container hero-grid"><div><h1>Learn a Skill.<br /><span>Work on Real Projects.</span></h1><p className="hero-copy">IT and freelancing courses from 1 to 4 months, with an internship at AR Swift Private Limited after you finish.</p><div className="button-row"><Link className="button button-primary" href="/courses">Explore Courses <ArrowRight size={18} /></Link><Link className="button button-outline" href="/enroll">Enroll Now</Link></div><p className="trained"><CheckCircle2 size={17} /> 500+ students trained in Faisalabad</p></div><PhotoPlaceholder caption="Classroom photo" className="hero-photo" /></div></section>
    <section className="stats" aria-label="ZetaSkills at a glance"><div className="container stats-grid">{stats.map(([number, label]) => <div key={label}><strong>{number}</strong><span>{label}</span></div>)}</div></section>
    <section className="section container"><div className="section-heading"><div><h2>Explore by Category</h2><p>Pick a track and start learning.</p></div></div><div className="category-grid">{categories.map(({ title, key, count, text, Icon }) => <Link href={`/courses?category=${key}`} className="category-card" key={key}><div className="category-top"><span className="category-icon"><Icon /></span><span className="count">{count} courses</span></div><h3>{title}</h3><p>{text}</p></Link>)}</div></section>
    <section className="section container"><div className="section-heading"><h2>Featured Courses</h2><Link href="/courses" className="text-link">View All Courses <ArrowRight size={17} /></Link></div><div className="course-grid">{featuredCourses.map((course) => <CourseCard course={course} key={course.id} />)}</div></section>
    <section className="section container why"><div className="center-heading"><h2>Why ZetaSkills?</h2><p>Practical courses, short durations and an internship opportunity.</p></div><div className="why-grid">{reasons.map(({ title, text, Icon }) => <article className="why-card" key={title}><span className="why-icon"><Icon /></span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="container internship"><div><h2>Graduate and Intern at AR Swift Private Limited</h2><p>Complete your course and get the opportunity to work on live international projects.</p><Link className="button button-primary" href="/enroll">Enroll Now</Link></div><ul>{["Live international projects", "Real client work experience", "Mentorship from AR Swift team", "Portfolio-building projects"].map((text) => <li key={text}><CheckCircle2 />{text}</li>)}</ul></section>
    <section className="section container testimonial-section"><div className="center-heading"><h2>What Students Say</h2><p>Placeholder testimonials</p></div><div className="testimonial-grid">{testimonials.map((item) => <article className="testimonial-card" key={item.name}><span className="placeholder-label">Placeholder</span><div className="stars" aria-label="Placeholder rating">{[1,2,3,4,5].map((n) => <Star size={15} fill="currentColor" key={n} />)}</div><p className="quote">“{item.quote}”</p><div className="testimonial-person"><PhotoPlaceholder caption="Photo placeholder" className="avatar" /><div><strong>{item.name}</strong><span>{item.course}</span></div></div></article>)}</div></section>
    <section className="contact-section"><div className="container contact-grid"><div><h2>Questions?<br />Let&apos;s talk</h2><p>Tell us what you would like to learn. Our team will be in touch.</p></div><ContactForm /></div></section>
  </main><Footer /><WhatsAppButton /></>;
}
