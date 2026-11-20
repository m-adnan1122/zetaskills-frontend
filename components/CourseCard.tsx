import Link from "next/link";
import Image from "next/image";
import type { Course } from "@/data/course-types";

export function CourseCard({ course }: { course: Course }) {
  return <article className="course-card course-list-card">
    <div className={`course-image course-cover course-cover-${course.category}`}>
      {course.image && <Image className="course-cover-photo" src={course.image} alt="" fill sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw" />}
      {course.badge && <span className={`course-image-badge badge ${course.badge.toLowerCase()}`}>{course.badge}</span>}
    </div>
    <h3 className="course-card-title"><Link className="course-card-link" href={`/courses/${course.slug}`}>{course.title}</Link></h3>
    <p className="course-description">{course.description}</p>
    <div className="tool-tags">{course.tools.slice(0, 4).map((tool) => <span key={tool}>{tool}</span>)}</div>
    <div className="course-meta"><span>{course.duration}</span></div>
    <div className="course-card-actions"><Link className="button button-outline" href={`/courses/${course.slug}`}>Details</Link><Link className="button button-primary" href={`/enroll?course=${course.slug}`}>Enroll Now</Link></div>
  </article>;
}
