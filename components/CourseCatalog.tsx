"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import type { Course, CourseCategory } from "@/data/course-types";
import { CourseCard } from "@/components/CourseCard";

const categoryTabs: { key: CourseCategory | "all"; label: string }[] = [
  { key: "all", label: "All Courses" },
  { key: "ai", label: "AI & Automation" },
  { key: "web", label: "Web Dev" },
  { key: "design", label: "Design" },
  { key: "ecommerce", label: "E-Commerce" },
  { key: "marketing", label: "Digital Marketing" },
  { key: "mobile", label: "Mobile Dev" },
];
const validCategories = new Set<CourseCategory>(["ai", "web", "design", "ecommerce", "marketing", "mobile"]);

export function CourseCatalog({ courses }: { courses: Course[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const columns = useColumns();
  const [reducedMotion, setReducedMotion] = useState(false);
  const requestedCategory = searchParams.get("category");
  const activeCategory = requestedCategory && validCategories.has(requestedCategory as CourseCategory) ? requestedCategory as CourseCategory : "all";
  const filteredCourses = useMemo(() => activeCategory === "all" ? courses : courses.filter((course) => course.category === activeCategory), [activeCategory, courses]);
  const counts = useMemo(() => Object.fromEntries(categoryTabs.map(({ key }) => [key, key === "all" ? courses.length : courses.filter((course) => course.category === key).length])), [courses]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const container = tabsRef.current;
    const activeTab = activeTabRef.current;
    if (!container || !activeTab) return;
    const left = activeTab.offsetLeft - container.offsetLeft - (container.clientWidth - activeTab.clientWidth) / 2;
    container.scrollTo({ left, behavior: reducedMotion ? "auto" : "smooth" });
  }, [activeCategory, reducedMotion]);

  function selectCategory(category: CourseCategory | "all") {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") params.delete("category");
    else params.set("category", category);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return <>
    <div className="course-filter-bar"><div className="course-filter-scroll container" ref={tabsRef} aria-label="Filter courses by category">
      {categoryTabs.map(({ key, label }) => {
        const active = key === activeCategory;
        return <button key={key} ref={active ? activeTabRef : null} type="button" className={active ? "course-filter active" : "course-filter"} aria-pressed={active} onClick={() => selectCategory(key)}>
          {active && <motion.span className="course-filter-indicator" layoutId="course-filter-indicator" transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }} />}
          <span className="course-filter-label">{label}</span><span className="course-filter-count">{counts[key]}</span>
        </button>;
      })}
    </div></div>
    <div className="container courses-results"><div className="course-grid" key={activeCategory}>{filteredCourses.map((course, index) => <CourseReveal key={course.id} course={course} delay={(index % columns) * 0.08} />)}</div></div>
  </>;
}

function useColumns(): number {
  const [columns, setColumns] = useState(3);
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 700px)");
    const tablet = window.matchMedia("(max-width: 1050px)");
    const update = () => setColumns(mobile.matches ? 1 : tablet.matches ? 2 : 3);
    update();
    mobile.addEventListener("change", update);
    tablet.addEventListener("change", update);
    return () => { mobile.removeEventListener("change", update); tablet.removeEventListener("change", update); };
  }, []);
  return columns;
}

function CourseReveal({ course, delay }: { course: Course; delay: number }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="course-grid-item"><CourseCard course={course} /></div>;
  return <AnimatedCourseReveal course={course} delay={delay} />;
}

function AnimatedCourseReveal({ course, delay }: { course: Course; delay: number }) {
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  if (reducedMotion !== false) return <div className="course-grid-item"><CourseCard course={course} /></div>;
  return <motion.div className="course-grid-item" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15, margin: "0px 0px -60px 0px" }} transition={{ duration: 0.5, ease: "easeOut", delay }}><CourseCard course={course} /></motion.div>;
}
