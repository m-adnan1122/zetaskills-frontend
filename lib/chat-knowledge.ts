import coursesData from "@/data/courses.json";
import { CAMPUS_ADDRESS, CONTACT_EMAIL, WHATSAPP_DISPLAY } from "@/lib/contact";
import type { Course, CourseCategory } from "@/data/course-types";

export const chatCourses = coursesData as Course[];
export type ChatLink = { label: string; href: string };
const categories: { key: CourseCategory; words: string[]; label: string }[] = [
  { key: "ai", words: ["ai", "artificial intelligence", "automation"], label: "AI & Automation" },
  { key: "web", words: ["web", "website", "coding", "programming"], label: "Web Development" },
  { key: "design", words: ["design", "figma", "graphic", "ui", "ux"], label: "Design" },
  { key: "ecommerce", words: ["ecommerce", "e-commerce", "amazon", "selling", "freelance", "freelancing"], label: "E-Commerce & Freelancing" },
  { key: "marketing", words: ["marketing", "social media"], label: "Digital Marketing" },
  { key: "mobile", words: ["mobile", "app development", "game", "flutter"], label: "Mobile & Game Development" },
];

function contains(text: string, word: string) {
  return (` ${text} `).includes(` ${word} `) || (word.length > 3 && text.includes(word));
}

export function courseMatches(message: string): Course[] {
  const text = message.toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/g, " ").trim();
  const aliases: [string, string][] = [["mern", "mern-stack-development"], ["n8n", "ai-automation-workflows-n8n"], ["laravel", "php-laravel"], ["wordpress", "wordpress-development"], ["shopify", "shopify-store-development"], ["flutter", "flutter-mobile-development"], ["react native", "react-native"], ["unity", "game-development-unity"], ["prompt engineering", "prompt-engineering"], ["ui ux", "ui-ux-design"]];
  const aliasMatches = aliases.filter(([alias]) => contains(text, alias)).map(([, slug]) => chatCourses.find((course) => course.slug === slug)).filter((course): course is Course => Boolean(course));
  if (aliasMatches.length) return aliasMatches.slice(0, 5);
  const exact = chatCourses.filter((course) => {
    const title = course.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (text.includes(title)) return true;
    return course.tools.some((tool) => tool.length >= 4 && contains(text, tool.toLowerCase()));
  });
  if (exact.length) return exact.slice(0, 5);
  const category = categories.find((item) => item.words.some((word) => contains(text, word)));
  return category ? chatCourses.filter((course) => course.category === category.key).slice(0, 5) : [];
}

export function knowledgeContext(): string {
  return JSON.stringify({
    institute: "ZetaSkills is an IT and freelancing institute in Faisalabad connected with AR Swift Private Limited.",
    address: CAMPUS_ADDRESS, email: CONTACT_EMAIL, whatsapp: WHATSAPP_DISPLAY,
    enrollment: "Apply using the enrollment form at /enroll. Course pages link to a preselected enrollment form. Morning and evening are preferred batch options; availability must be confirmed with the team.",
    pricing: "Fees are not listed. Contact the team for current fees.",
    internship: "There may be an internship opportunity with AR Swift Private Limited; contact the team for eligibility and availability. Do not guarantee it.",
    certificate: "Contact the team for current certificate details.",
    courses: chatCourses.map(({ slug, title, category, duration, description, prerequisites, learn, tools, syllabus }) => ({ slug, title, category, duration, description, prerequisites, learn, tools, syllabus })),
  });
}

export function suggestedLinks(question: string): ChatLink[] {
  const text = question.toLowerCase();
  const matched = courseMatches(question);
  const links: ChatLink[] = matched.slice(0, 3).map((course) => ({ label: course.title, href: `/courses/${course.slug}` }));
  if (/enrol|admis|apply|register|registration|dakhla/.test(text)) links.unshift({ label: "Enroll now", href: "/enroll" });
  if (/contact|location|address|where|location|pata|whatsapp|fee|fees|price|cost/.test(text)) links.push({ label: "Contact our team", href: "/contact" });
  if (!links.length) links.push({ label: "Explore courses", href: "/courses" });
  return links.slice(0, 4);
}

export function basicAnswer(question: string): string {
  const text = question.toLowerCase();
  const match = courseMatches(question);
  if (/fee|fees|price|cost|charges|قیمت|فیس/.test(text)) return `Course fees website par listed nahi hain. Current fee ke liye hamari team se WhatsApp ${WHATSAPP_DISPLAY} par rabta karein.`;
  if (/address|location|where|pata|کہاں|پتہ/.test(text)) return `Hamara address: ${CAMPUS_ADDRESS}. Aap ${WHATSAPP_DISPLAY} par WhatsApp bhi kar sakte hain.`;
  if (/contact|phone|whatsapp|number|email|رابطہ/.test(text)) return `Aap hamari team se WhatsApp ${WHATSAPP_DISPLAY} ya email ${CONTACT_EMAIL} par rabta kar sakte hain.`;
  if (/enrol|admis|apply|register|registration|dakhla|داخلہ/.test(text)) return "Enrollment ke liye Enroll Now page kholein, personal details aur course select karein, phir review karke form submit karein. Kisi sawal ke liye team se rabta karein.";
  if (/intern|internship|certificate|سرٹیفکیٹ/.test(text)) return `AR Swift ke saath internship opportunity ke baare mein eligibility aur availability team se confirm karein. Certificate ki details ke liye bhi WhatsApp ${WHATSAPP_DISPLAY} par rabta karein.`;
  if (match.length === 1) {
    const c = match[0];
    if (/syllabus|curriculum|week|topics|کیا سیکھ/.test(text)) return `${c.title} — 8-week syllabus:\n${c.syllabus.map((week) => `Week ${week.week}: ${week.topic} — ${week.topics.join(", ")}`).join("\n")}\n\nCourse page par bhi complete syllabus dekh sakte hain.`;
    return `${c.title} — ${c.duration}. ${c.description}\n\nAap seekhenge: ${c.learn.join(", ")}.\nTools: ${c.tools.join(", ")}.\nPrerequisites: ${c.prerequisites}\n\nPoora 8-week syllabus dekhne ke liye course page kholein.`;
  }
  if (match.length > 1) return `Is field mein yeh courses available hain: ${match.map((c) => c.title).join(", ")}. Sab ki duration 8 weeks hai. Kisi course ka naam batayein ya uska page kholein.`;
  if (/course|courses|سکِل|کورس/.test(text)) return `ZetaSkills mein ${chatCourses.length} courses hain: AI, web development, design, e-commerce, marketing aur mobile development. Apni interest batayein ya courses page dekhein.`;
  return `Main ZetaSkills ke courses, enrollment aur contact information mein madad kar sakta hoon. Apni interest ya course ka naam batayein; mazeed sawalat ke liye WhatsApp ${WHATSAPP_DISPLAY} par rabta karein.`;
}
