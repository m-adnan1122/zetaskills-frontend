import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ContactSection } from "@/components/ContactSection";
import { CourseCatalog } from "@/components/CourseCatalog";
import { CourseCard } from "@/components/CourseCard";
import coursesData from "@/data/courses.json";
import type { Course } from "@/data/course-types";

const courses = coursesData as Course[];

export function generateMetadata(): Metadata {
  return { title: "Courses | ZetaSkills", description: "Explore practical IT and freelancing courses at ZetaSkills." };
}

const courseTabs: { key: Course["category"] | "all"; label: string }[] = [
  { key: "all", label: "All Courses" },
  { key: "ai", label: "AI & Automation" },
  { key: "web", label: "Web Dev" },
  { key: "design", label: "Design" },
  { key: "ecommerce", label: "E-Commerce" },
  { key: "marketing", label: "Digital Marketing" },
  { key: "mobile", label: "Mobile Dev" },
];

function CourseCatalogFallback({ visibleCourses, activeCategory }: { visibleCourses: Course[]; activeCategory: Course["category"] | "all" }) {
  return <><div className="course-filter-bar" aria-label="Course categories"><div className="course-filter-scroll container">{courseTabs.map(({ key, label }) => <Link key={key} href={key === "all" ? "/courses" : `/courses?category=${key}`} className={key === activeCategory ? "course-filter active course-filter-static-active" : "course-filter"}><span className="course-filter-label">{label}</span><span className="course-filter-count">{key === "all" ? courses.length : courses.filter((course) => course.category === key).length}</span></Link>)}</div></div><div className="container courses-results"><div className="course-grid">{visibleCourses.map((course) => <CourseCard course={course} key={course.id} />)}</div></div></>;
}

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  const query = await searchParams;
  const requestedCategory = typeof query.category === "string" ? query.category : undefined;
  const category = courseTabs.some(({ key }) => key === requestedCategory) ? requestedCategory : undefined;
  const visibleCourses = category && category !== "all" ? courses.filter((course) => course.category === category) : courses;
  return <><Navbar /><main>
    <section className="courses-header container"><h1>Discover <span>Your Path</span> to a<br className="courses-title-break" /> <span>Tech Career.</span></h1><p>{courses.length} practical 8-week courses. Pick a track and start learning.</p></section>
    <Suspense fallback={<CourseCatalogFallback visibleCourses={visibleCourses} activeCategory={(category as Course["category"] | undefined) ?? "all"} />}><CourseCatalog courses={courses} /></Suspense>
    <ContactSection />
  </main><Footer /><WhatsAppButton /></>;
}
