"use client";

import { useEffect, useRef, useState } from "react";

const letters = Array.from("ZETASKILLS");

export function ZetaLoader({ active }: { active: boolean }) {
  const [visible, setVisible] = useState(active);
  const activeRef = useRef(active);
  const shownAt = useRef(0);
  activeRef.current = active;

  useEffect(() => {
    if (active) {
      if (!visible) shownAt.current = performance.now();
      setVisible(true);
      return;
    }
    if (!visible) return;
    const remaining = Math.max(0, 1000 - (performance.now() - shownAt.current));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The fallback also clears the overlay if animations are paused by the browser.
    const timer = setTimeout(() => { if (!activeRef.current) setVisible(false); }, reduced ? remaining : Math.max(remaining, 4000));
    return () => clearTimeout(timer);
  }, [active, visible]);

  if (!visible) return null;
  return <div className="zeta-loader-overlay" role="status" aria-live="polite" aria-label="Loading, please wait">
    <span className="zeta-loader-word" aria-hidden="true">{letters.map((letter, index) => <span key={index} style={{ animationDelay: `${index * 70}ms` }} onAnimationIteration={index === letters.length - 1 ? (event) => {
      if (!activeRef.current && event.elapsedTime % 2 === 0 && performance.now() - shownAt.current >= 1000) setVisible(false);
    } : undefined}>{letter}</span>)}</span>
  </div>;
}
