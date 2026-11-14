import Image from "next/image";
import { Star } from "lucide-react";
import testimonials from "@/data/placeholders";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

export function TestimonialsSection({ title = "What Students Say" }: { title?: string }) {
  return <section className="section container testimonial-section"><div className="center-heading"><h2>{title}</h2></div><Stagger className="testimonial-grid">{testimonials.map((item) => <StaggerItem className="testimonial-item h-full w-full" key={item.name}><article className="testimonial-card h-full w-full"><div className="stars" aria-label="5 out of 5 stars">{[1,2,3,4,5].map((n) => <Star size={15} fill="currentColor" key={n} />)}</div><p className="quote">“{item.quote}”</p><div className="testimonial-person"><Image src={item.photo} alt={item.name} width={48} height={48} className="avatar-image" /><div><strong>{item.name}</strong><span>{item.course}</span></div></div></article></StaggerItem>)}</Stagger></section>;
}
