"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

type StaggerProps = { children: ReactNode; className?: string; delay?: number; duration?: number; once?: boolean };
const itemVariants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
function useMotionReady(): boolean { const [ready, setReady] = useState(false); useEffect(() => setReady(true), []); return ready; }

export function Stagger({ children, className, delay = 0, duration = 0.4, once = true }: StaggerProps) {
  const ready = useMotionReady();
  if (!ready) return <div className={className}>{children}</div>;
  return <AnimatedStagger className={className} delay={delay} duration={duration} once={once}>{children}</AnimatedStagger>;
}
function AnimatedStagger({ children, className, delay, duration, once }: StaggerProps) {
  const reduced = useReducedMotion() ?? false;
  if (reduced) return <div className={className}>{children}</div>;
  const parentVariants: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: delay, duration, ease: "easeOut" as const } } };
  return <motion.div className={className} variants={parentVariants} initial="hidden" whileInView="visible" viewport={{ once, amount: 0.2 }}>{children}</motion.div>;
}

export function StaggerItem({ children, className, duration = 0.4, delay = 0 }: StaggerProps) {
  const ready = useMotionReady();
  if (!ready) return <div className={className}>{children}</div>;
  return <AnimatedStaggerItem className={className} delay={delay} duration={duration}>{children}</AnimatedStaggerItem>;
}
function AnimatedStaggerItem({ children, className, duration, delay }: StaggerProps) {
  const reduced = useReducedMotion() ?? false;
  if (reduced) return <div className={className}>{children}</div>;
  return <motion.div className={className} variants={itemVariants} transition={{ duration, delay, ease: "easeOut" }}>{children}</motion.div>;
}
