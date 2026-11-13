import { MessageCircle } from "lucide-react";
export function WhatsAppButton() { const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567"; return <a className="whatsapp" href={`https://wa.me/${number}`} aria-label="Chat with ZetaSkills on WhatsApp"><MessageCircle size={24} /></a>; }
