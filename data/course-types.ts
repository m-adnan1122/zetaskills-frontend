export type CourseCategory = "ai" | "web" | "design" | "ecommerce" | "marketing" | "mobile";
export type Course = { id: number; slug: string; title: string; category: CourseCategory; badge: "HOT" | "NEW" | null; duration: string; fee: number; description: string; image?: string; tools: string[]; syllabus: { week: number; topic: string }[]; learn: string[]; prerequisites: string };
