import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { EnrollFlow } from "@/components/EnrollFlow";
import coursesData from "@/data/courses.json";
import type { Course } from "@/data/course-types";

const courses = coursesData as Course[];

export function generateMetadata(): Metadata {
  return { title: "Enroll | ZetaSkills", description: "Complete the ZetaSkills enrollment form." };
}

type EnrollSearchParams = Record<string, string | string[] | undefined>;

export default async function EnrollPage({ searchParams }: { searchParams: Promise<EnrollSearchParams> }) {
  const query = await searchParams;
  const courseQuery = query.course;
  const refQuery = query.ref;
  const requestedCourse = typeof courseQuery === "string" ? courseQuery : "";
  const initialCourse = courses.some((course) => course.slug === requestedCourse) ? requestedCourse : "";
  const referredBy = typeof refQuery === "string" ? refQuery.slice(0, 200) : "";

  return <>
    <Navbar />
    <EnrollFlow courses={courses} initialCourse={initialCourse} courseWasPrefilled={Boolean(initialCourse)} referredBy={referredBy} />
    <Footer />
    <WhatsAppButton />
  </>;
}
