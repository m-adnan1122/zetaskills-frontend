"use client";
import { WHATSAPP_NUMBER } from "@/lib/contact";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

function WhatsAppIcon() {
  return <svg width="27" height="27" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.9 11.9 0 0 0 12.04 0C5.43 0 .05 5.37.05 11.98c0 2.11.55 4.17 1.6 5.99L0 24l6.17-1.62a11.97 11.97 0 0 0 5.87 1.49h.01c6.6 0 11.98-5.38 11.98-11.99 0-3.2-1.24-6.21-3.51-8.4ZM12.05 21.85h-.01a9.95 9.95 0 0 1-5.07-1.39l-.36-.21-3.66.96.98-3.57-.24-.37a9.96 9.96 0 1 1 8.36 4.58Zm5.46-7.46c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.67-.51h-.58c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.09 4.48.71.31 1.27.49 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.34Z" /></svg>;
}

export function WhatsAppButton() {
  const [ready, setReady] = useState(false);
  const number = WHATSAPP_NUMBER;
  useEffect(() => setReady(true), []);
  if (!ready) return <a className="whatsapp" href={`https://wa.me/${number}`} aria-label="Chat with ZetaSkills on WhatsApp"><WhatsAppIcon /></a>;
  return <AnimatedWhatsApp number={number} />;
}
function AnimatedWhatsApp({ number }: { number: string }) {
  const reduced = useReducedMotion() ?? false;
  return <motion.a className="whatsapp" href={`https://wa.me/${number}`} aria-label="Chat with ZetaSkills on WhatsApp" whileHover={reduced ? undefined : { scale: 1.05 }} whileTap={reduced ? undefined : { scale: 0.98 }}><WhatsAppIcon />{!reduced && <motion.span className="whatsapp-pulse" aria-hidden="true" animate={{ scale: [1, 1.6], opacity: [0.4, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }} />}</motion.a>;
}
