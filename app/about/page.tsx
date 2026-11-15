import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { StatsStrip } from "@/components/StatsStrip";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { InternshipSection } from "@/components/InternshipSection";
import { ContactSection } from "@/components/ContactSection";
import { FadeUp } from "@/components/motion/FadeUp";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

export function generateMetadata(): Metadata {
  return { title: "About | ZetaSkills", description: "Learn about ZetaSkills, our practical training, and our internship opportunity." };
}

const differences = [
  { title: "Hands-On Learning", text: "Understand concepts by applying them through exercises, assignments, and practical projects." },
  { title: "Relevant Skills", text: "Learn tools and techniques connected to current digital and technology fields." },
  { title: "Internship", text: "Eligible graduates can explore internship through our connection with AR Swift Private Limited." },
];

export default function AboutPage() {
  return <><Navbar /><main>
    <section className="about-header container">
      <FadeUp onLoad duration={0.6}>
        <h1>Skills That <span>Open Doors</span></h1>
        <p>At ZetaSkills, we believe learning technology should go beyond watching lessons and memorizing concepts. We help students develop practical digital skills, work on real-world projects, and prepare for opportunities in the modern digital industry.</p>
      </FadeUp>
    </section>
    <div className="container about-photo-wrap"><FadeUp><PhotoPlaceholder caption="Institute photo" className="about-photo" /></FadeUp></div>
    <StatsStrip />
    <section className="section container about-learning">
      <FadeUp className="about-learning-copy"><h2>A Learning Environment Built Around Practical Skills</h2><p>ZetaSkills is an IT and freelancing training institute based in Faisalabad, Pakistan, created to make relevant digital education more accessible to aspiring professionals.</p><p>We bring together structured learning, hands-on practice, and industry-oriented training across fields such as Artificial Intelligence, Web Development, Graphic Design, Digital Marketing, E-Commerce, and Mobile App Development.</p></FadeUp>
      <FadeUp delay={0.2}><PhotoPlaceholder caption="Classroom photo" className="about-classroom-photo" /></FadeUp>
    </section>
    <section className="difference-section">
      <div className="container difference-inner">
        <FadeUp className="center-heading"><h2>What Makes ZetaSkills Different?</h2><p>Practical learning, relevant skills and an internship opportunity.</p></FadeUp>
      </div>
    </section>
    <div className="difference-overlap container">
      <Stagger className="difference-grid">{differences.map((item) => <StaggerItem className="difference-item" key={item.title}><article className="difference-card"><h3>{item.title}</h3><p>{item.text}</p></article></StaggerItem>)}</Stagger>
    </div>
    <TestimonialsSection title="Testimonials" />
    <InternshipSection id="internship" />
    <ContactSection />
  </main><Footer /><WhatsAppButton /></>;
}
