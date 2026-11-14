import { CountUp } from "@/components/motion/CountUp";

const stats = [
  { target: 21, suffix: "+", label: "Courses" },
  { target: 500, suffix: "+", label: "Graduates" },
  { target: 4, suffix: " Years", label: "AR Swift Experience" },
  { target: 100, suffix: "%", label: "Practical Training" },
];

export function StatsStrip() {
  return <section className="stats" aria-label="ZetaSkills at a glance"><div className="container stats-grid">{stats.map(({ target, suffix, label }) => <div key={label}><strong><CountUp target={target} suffix={suffix} once /></strong><span>{label}</span></div>)}</div></section>;
}
