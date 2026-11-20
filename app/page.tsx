import Link from "next/link";
import { ArrowRight, Bot, Code2, Layers2, ShoppingCart, Megaphone, Smartphone, Building2, Lightbulb, Wallet, Clock3, CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SitePhoto } from "@/components/SitePhoto";
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
  return <><Navbar /><main className="home-redesign">
    <section className="new-hero"><div className="container new-hero-grid"><div className="new-hero-copy"><p className="new-hero-tag"><span /> Learn. Create. Grow.</p><h1>Skills that take you <em>further.</em></h1><p className="new-hero-description">Turn your curiosity into practical skills. Learn technology and freelancing through hands-on courses in Faisalabad.</p><div className="new-hero-actions"><Link className="new-primary" href="/courses">Explore our courses <ArrowRight size={18} /></Link><Link className="new-secondary" href="/about">Get to know us <ArrowRight size={17} /></Link></div><div className="new-hero-note"><span className="new-note-icon"><CheckCircle2 size={20} /></span><span><strong>Learn by doing</strong><br />Practical training with real-world projects</span></div></div><div className="new-hero-art"><SitePhoto src="/Website_Images_Pack/Website_Images/collaborative_learning_in_a_bright_modern_classroo.png" alt="Illustration of students learning together with an instructor" className="new-hero-image" sizes="(max-width: 700px) 100vw, 50vw" priority /><div className="new-art-badge"><strong>8 weeks.</strong><span>A new skill starts here.</span></div><div className="new-art-caption">A better way to learn <span>?</span></div></div></div></section>
    <StatsStrip />
    <section className="section container category-section"><div className="section-heading"><div><p className="home-overline">Find your direction</p><h2>What do you want<br />to learn?</h2></div><p className="category-intro">From your first idea to your next opportunity, there is a path for you here.</p></div><Stagger className="category-grid">{categories.map(({ title, key, count, text, Icon }) => <StaggerItem key={key} className="category-item h-full w-full"><Link href={`/courses?category=${key}`} className="category-card"><div className="category-top"><span className="category-icon"><Icon /></span><span className="count">{count} courses</span></div><div className="category-content"><h3>{title}</h3><p>{text}</p></div><span className="category-action">Explore courses <ArrowRight size={17} aria-hidden="true" /></span></Link></StaggerItem>)}</Stagger></section>
    <section className="section container"><div className="section-heading"><div><p className="home-overline">Made for your next move</p><h2>Learn something<br />that moves you forward.</h2><p>Explore practical courses designed to help you build.</p></div><Link href="/courses" className="text-link">View All Courses <ArrowRight size={17} /></Link></div><Stagger className="course-grid">{featuredCourses.map((course) => <StaggerItem key={course.id} className="course-item h-full w-full"><CourseCard course={course} /></StaggerItem>)}</Stagger></section>
    <section className="section container why"><div className="center-heading"><p className="home-overline">Learning with purpose</p><h2>More than just a classroom.</h2><p>Learn the skills, put them to work and take your next step with confidence.</p></div><Stagger className="why-grid">{reasons.map(({ title, text, Icon }) => <StaggerItem className="why-item h-full w-full" key={title}><article className="why-card h-full w-full"><span className="why-icon"><Icon /></span><h3>{title}</h3><p>{text}</p></article></StaggerItem>)}</Stagger></section>
    <InternshipSection />
    <TestimonialsSection />
    <ContactSection />
  </main><Footer /><WhatsAppButton /></>;
}
