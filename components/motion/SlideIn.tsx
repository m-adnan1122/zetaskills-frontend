"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

type SlideInProps = { children: ReactNode; className?: string; id?: string; delay?: number; duration?: number; once?: boolean };
function useMotionReady(): boolean { const [ready, setReady] = useState(false); useEffect(() => setReady(true), []); return ready; }

export function SlideIn(props: SlideInProps) {
  const ready = useMotionReady();
  if (!ready) return <div id={props.id} className={props.className}>{props.children}</div>;
  return <AnimatedSlideIn {...props} />;
}
function AnimatedSlideIn({ children, className, id, delay = 0, duration = 0.4, once = true }: SlideInProps) {
  const reduced = useReducedMotion() ?? false;
  if (reduced) return <div id={id} className={className}>{children}</div>;
  return <motion.div id={id} className={className} initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once, amount: 0.2 }} transition={{ duration, delay, ease: "easeOut" }}>{children}</motion.div>;
}
