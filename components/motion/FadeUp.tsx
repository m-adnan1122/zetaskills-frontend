"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

type FadeUpProps = { children: ReactNode; className?: string; delay?: number; duration?: number; once?: boolean; blur?: boolean; onLoad?: boolean; style?: CSSProperties };
function useMotionReady(): boolean { const [ready, setReady] = useState(false); useEffect(() => setReady(true), []); return ready; }

export function FadeUp(props: FadeUpProps) {
  const ready = useMotionReady();
  if (!ready) return <div className={props.className} style={props.style}>{props.children}</div>;
  return <AnimatedFadeUp {...props} />;
}

function AnimatedFadeUp({ children, className, delay = 0, duration = 0.4, once = true, blur = false, onLoad = false, style }: FadeUpProps) {
  const reduced = useReducedMotion() ?? false;
  if (reduced) return <div className={className} style={style}>{children}</div>;
  const hidden = { opacity: 0, y: 24, ...(blur ? { filter: "blur(6px)" } : {}) };
  const shown = { opacity: 1, y: 0, ...(blur ? { filter: "blur(0px)" } : {}) };
  return <motion.div className={className} style={style} initial={hidden} {...(onLoad ? { animate: shown } : { whileInView: shown, viewport: { once, amount: 0.2 } })} transition={{ duration, delay, ease: "easeOut" }}>{children}</motion.div>;
}
