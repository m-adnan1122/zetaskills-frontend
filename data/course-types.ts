export type CourseCategory = "ai" | "web" | "design" | "ecommerce" | "marketing" | "mobile";
export type Course = { id: number; slug: string; title: string; category: CourseCategory; badge: "HOT" | "NEW" | null; duration: string; description: string; image?: string; tools: string[]; syllabus: { week: number; topic: string; topics: string[] }[]; learn: string[]; prerequisites: string };
