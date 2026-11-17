import Link from "next/link";
import { ArrowRight, Bot, Code2, Layers2, ShoppingCart, Megaphone, Smartphone, Building2, Lightbulb, Wallet, Clock3, CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CourseCard } from "@/components/CourseCard";
import { StatsStrip } from "@/components/StatsStrip";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { InternshipSection } from "@/components/InternshipSection";
import { ContactSection } from "@/components/ContactSection";
import courses from "@/data/courses.json";
import type { Course } from "@/data/course-types";
import type { Metadata } from "next";
import { FadeUp } from "@/components/motion/FadeUp";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

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
const reasons = [
  { title: "Internship at AR Swift", text: "An opportunity to work on live international projects after your course.", Icon: Building2 },
  { title: "100% Practical Training", text: "Learn by working through practical tasks and projects.", Icon: Lightbulb },
  { title: "Portfolio-Ready Projects", text: "Build practical projects to showcase your skills.", Icon: Wallet },
  { title: "8-week courses", text: "Choose a course that fits your learning goals.", Icon: Clock3 },
];
export default function Home() {
  return <><Navbar /><main>
    <section className="hero"><div className="container hero-grid"><div><FadeUp onLoad duration={0.6} blur><h1>Learn a Skill.<br /><span>Work on Real Projects.</span></h1></FadeUp><FadeUp onLoad delay={0.2} duration={0.6}><p className="hero-copy">8-week IT and freelancing courses, with an internship at AR Swift Private Limited after you finish.</p></FadeUp><FadeUp onLoad delay={0.4} duration={0.6}><div className="button-row"><Link className="button button-primary" href="/courses">Explore Courses <ArrowRight size={18} /></Link><Link className="button button-outline" href="/enroll">Enroll Now</Link></div><p className="trained"><CheckCircle2 size={17} /> 500+ students trained in Faisalabad</p></FadeUp></div><FadeUp onLoad delay={0.3} duration={0.6}><PhotoPlaceholder caption="Classroom photo" className="hero-photo" /></FadeUp></div></section>
    <StatsStrip />
    <section className="section container category-section"><div className="section-heading"><div><h2>Explore by Category</h2><p>Pick a track and start learning.</p></div><p className="category-intro">Explore practical courses across AI, web development, design, e-commerce, marketing and mobile.</p></div><Stagger className="category-grid">{categories.map(({ title, key, count, text, Icon }) => <StaggerItem key={key} className="category-item h-full w-full"><Link href={`/courses?category=${key}`} className="category-card"><div className="category-top"><span className="category-icon"><Icon /></span><span className="count">{count} courses</span></div><div className="category-content"><h3>{title}</h3><p>{text}</p></div><span className="category-action">Explore courses <ArrowRight size={17} aria-hidden="true" /></span></Link></StaggerItem>)}</Stagger></section>
    <section className="section container"><div className="section-heading"><h2>Featured Courses</h2><Link href="/courses" className="text-link">View All Courses <ArrowRight size={17} /></Link></div><Stagger className="course-grid">{featuredCourses.map((course) => <StaggerItem key={course.id} className="course-item h-full w-full"><CourseCard course={course} /></StaggerItem>)}</Stagger></section>
    <section className="section container why"><div className="center-heading"><h2>Why ZetaSkills?</h2><p>Practical courses, short durations and an internship opportunity.</p></div><Stagger className="why-grid">{reasons.map(({ title, text, Icon }) => <StaggerItem className="why-item h-full w-full" key={title}><article className="why-card h-full w-full"><span className="why-icon"><Icon /></span><h3>{title}</h3><p>{text}</p></article></StaggerItem>)}</Stagger></section>
    <InternshipSection />
    <TestimonialsSection />
    <ContactSection />
  </main><Footer /><WhatsAppButton /></>;
}
