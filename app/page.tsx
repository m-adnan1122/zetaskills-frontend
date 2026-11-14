import Link from "next/link";
import Image from "next/image";
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
import { FadeUp } from "@/components/motion/FadeUp";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { SlideIn } from "@/components/motion/SlideIn";
import { CountUp } from "@/components/motion/CountUp";

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
const stats = [{ target: 21, suffix: "+", label: "Courses" }, { target: 500, suffix: "+", label: "Graduates" }, { target: 4, suffix: " Years", label: "AR Swift Experience" }, { target: 100, suffix: "%", label: "Practical Training" }];
const reasons = [
  { title: "Internship at AR Swift", text: "An opportunity to work on live international projects after your course.", Icon: Building2 },
  { title: "100% Practical Training", text: "Learn by working through practical tasks and projects.", Icon: Lightbulb },
  { title: "Affordable fees from PKR 16,000", text: "Course fees start at PKR 16,000.", Icon: Wallet },
  { title: "Short courses of 1 to 4 months", text: "Choose a course that fits your learning goals.", Icon: Clock3 },
];
export default function Home() {
  return <><Navbar /><main>
    <section className="hero"><div className="container hero-grid"><div><FadeUp onLoad duration={0.6} blur><h1>Learn a Skill.<br /><span>Work on Real Projects.</span></h1></FadeUp><FadeUp onLoad delay={0.2} duration={0.6}><p className="hero-copy">IT and freelancing courses from 1 to 4 months, with an internship at AR Swift Private Limited after you finish.</p></FadeUp><FadeUp onLoad delay={0.4} duration={0.6}><div className="button-row"><Link className="button button-primary" href="/courses">Explore Courses <ArrowRight size={18} /></Link><Link className="button button-outline" href="/enroll">Enroll Now</Link></div><p className="trained"><CheckCircle2 size={17} /> 500+ students trained in Faisalabad</p></FadeUp></div><FadeUp onLoad delay={0.3} duration={0.6}><PhotoPlaceholder caption="Classroom photo" className="hero-photo" /></FadeUp></div></section>
    <section className="stats" aria-label="ZetaSkills at a glance"><div className="container stats-grid">{stats.map(({ target, suffix, label }) => <div key={label}><strong><CountUp target={target} suffix={suffix} once /></strong><span>{label}</span></div>)}</div></section>
    <section className="section container category-section"><div className="section-heading"><div><h2>Explore by Category</h2><p>Pick a track and start learning.</p></div><p className="category-intro">Explore practical courses across AI, web development, design, e-commerce, marketing and mobile.</p></div><Stagger className="category-grid">{categories.map(({ title, key, count, text, Icon }) => <StaggerItem key={key} className="category-item h-full w-full"><Link href={`/courses?category=${key}`} className="category-card block h-full w-full min-h-[190px] rounded-card bg-primary p-6 text-white"><div className="category-top"><span className="category-icon"><Icon /></span><span className="count">{count} courses</span></div><h3>{title}</h3><p>{text}</p></Link></StaggerItem>)}</Stagger></section>
    <section className="section container"><div className="section-heading"><h2>Featured Courses</h2><Link href="/courses" className="text-link">View All Courses <ArrowRight size={17} /></Link></div><Stagger className="course-grid">{featuredCourses.map((course) => <StaggerItem key={course.id} className="course-item h-full w-full"><CourseCard course={course} /></StaggerItem>)}</Stagger></section>
    <section className="section container why"><div className="center-heading"><h2>Why ZetaSkills?</h2><p>Practical courses, short durations and an internship opportunity.</p></div><Stagger className="why-grid">{reasons.map(({ title, text, Icon }) => <StaggerItem className="why-item h-full w-full" key={title}><article className="why-card h-full w-full"><span className="why-icon"><Icon /></span><h3>{title}</h3><p>{text}</p></article></StaggerItem>)}</Stagger></section>
    <SlideIn className="container internship" duration={0.6}><div><h2>Graduate and Intern at AR Swift Private Limited</h2><p>Work directly on live international projects, client software architectures, and production codebases after completing your course. Build proof-of-work that commands respect from global employers.</p><div className="internship-actions"><Link className="button button-primary internship-enroll" href="/enroll">Enroll Now</Link><Link className="button internship-terms" href="/about#internship">Learn About Internship Terms <ArrowRight size={17} /></Link></div></div><ul>{["Live international projects", "Real client work experience", "Mentorship from AR Swift team", "Portfolio-building projects"].map((text) => <li key={text}><CheckCircle2 />{text}</li>)}</ul></SlideIn>
    <section className="section container testimonial-section"><div className="center-heading"><h2>What Students Say</h2></div><Stagger className="testimonial-grid">{testimonials.map((item) => <StaggerItem className="testimonial-item h-full w-full" key={item.name}><article className="testimonial-card h-full w-full"><div className="stars" aria-label="5 out of 5 stars">{[1,2,3,4,5].map((n) => <Star size={15} fill="currentColor" key={n} />)}</div><p className="quote">“{item.quote}”</p><div className="testimonial-person"><Image src={item.photo} alt={item.name} width={48} height={48} className="avatar-image" /><div><strong>{item.name}</strong><span>{item.course}</span></div></div></article></StaggerItem>)}</Stagger></section>
    <section className="contact-section"><div className="container contact-grid"><FadeUp><div><h2>Your Future in<br />Tech Starts Here!</h2><p>Ready to turn your interest in technology into practical, career-ready skills? Join ZetaSkills and learn through hands-on training, real-world projects, and expert guidance. Build your confidence, earn a certificate, and get opportunities to gain industry experience through AR Swift Private Limited.</p><ul className="contact-points"><li>Learn in-demand digital and technology skills</li><li>Gain practical experience through internship opportunities</li><li>Build projects and prepare for your professional career</li></ul></div></FadeUp><FadeUp delay={0.2}><ContactForm /></FadeUp></div></section>
  </main><Footer /><WhatsAppButton /></>;
}
