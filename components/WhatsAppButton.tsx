"use client";
import { WHATSAPP_NUMBER } from "@/lib/contact";

import { MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function WhatsAppButton() {
  const [ready, setReady] = useState(false);
  const number = WHATSAPP_NUMBER;
  useEffect(() => setReady(true), []);
  if (!ready) return <a className="whatsapp" href={`https://wa.me/${number}`} aria-label="Chat with ZetaSkills on WhatsApp"><MessageCircle size={24} /></a>;
  return <AnimatedWhatsApp number={number} />;
}
function AnimatedWhatsApp({ number }: { number: string }) {
  const reduced = useReducedMotion() ?? false;
  return <motion.a className="whatsapp" href={`https://wa.me/${number}`} aria-label="Chat with ZetaSkills on WhatsApp" whileHover={reduced ? undefined : { scale: 1.05 }} whileTap={reduced ? undefined : { scale: 0.98 }}><MessageCircle size={24} />{!reduced && <motion.span className="whatsapp-pulse" aria-hidden="true" animate={{ scale: [1, 1.6], opacity: [0.4, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }} />}</motion.a>;
}
