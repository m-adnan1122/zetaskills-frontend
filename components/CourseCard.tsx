import Image from "next/image";
import Link from "next/link";
import { Bot, Code2, Layers2, Megaphone, ShoppingCart, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Course } from "@/data/course-types";

const categoryIcons: Record<Course["category"], LucideIcon> = {
  ai: Bot,
  web: Code2,
  design: Layers2,
  ecommerce: ShoppingCart,
  marketing: Megaphone,
  mobile: Smartphone,
};

export function CourseCard({ course }: { course: Course }) {
  const CategoryIcon = categoryIcons[course.category];
  return <article className="course-card course-list-card">
    <div className="course-image">
      {course.image ? <Image src={course.image} alt={`${course.title} course`} fill sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw" /> : <div className="course-fallback"><CategoryIcon size={34} strokeWidth={1.7} aria-hidden="true" /><strong>{course.title}</strong><span>{course.duration}</span></div>}
      {course.badge && <span className={`course-image-badge badge ${course.badge.toLowerCase()}`}>{course.badge}</span>}
    </div>
    <h3 className="course-card-title"><Link className="course-card-link" href={`/courses/${course.slug}`}>{course.title}</Link></h3>
    <p className="course-description">{course.description}</p>
    <div className="tool-tags">{course.tools.slice(0, 4).map((tool) => <span key={tool}>{tool}</span>)}</div>
    <div className="course-meta"><span>{course.duration}</span></div>
    <div className="course-card-actions"><Link className="button button-outline" href={`/courses/${course.slug}`}>Details</Link><Link className="button button-primary" href={`/enroll?course=${course.slug}`}>Enroll Now</Link></div>
  </article>;
}
