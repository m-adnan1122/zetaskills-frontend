"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type CountUpProps = { target: number; suffix?: string; duration?: number; delay?: number; once?: boolean };
function useMotionReady(): boolean { const [ready, setReady] = useState(false); useEffect(() => setReady(true), []); return ready; }

export function CountUp(props: CountUpProps) {
  const ready = useMotionReady();
  return ready ? <AnimatedCountUp {...props} /> : <span className="tabular-nums" style={{ display: "inline-block", minWidth: `${String(props.target).length + (props.suffix?.length ?? 0) * 0.55}ch` }}>{props.target}{props.suffix}</span>;
}
function AnimatedCountUp({ target, suffix = "", duration = 0.9, delay = 0, once = true }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, amount: 0.2 });
  const reduced = useReducedMotion() ?? false;
  const [value, setValue] = useState(target);
  const hasCounted = useRef(false);
  useEffect(() => {
    if (!inView || reduced || hasCounted.current) return;
    hasCounted.current = true;
    let frame = 0;
    let startTime = 0;
    const timeout = setTimeout(() => {
      setValue(0);
      const tick = (time: number) => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / (duration * 1000), 1);
        setValue(Math.round(progress * target));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, delay * 1000);
    return () => { clearTimeout(timeout); cancelAnimationFrame(frame); };
  }, [delay, duration, inView, reduced, target]);
  return <span ref={ref} className="tabular-nums" style={{ display: "inline-block", minWidth: `${String(target).length + suffix.length * 0.55}ch` }}>{value}{suffix}</span>;
}
