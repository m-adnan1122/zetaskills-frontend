import { CAMPUS_ADDRESS, WHATSAPP_DISPLAY } from "@/lib/contact";

function Announcement() {
  return <span className="announcement-message"><strong>Registrations are open till November 2026</strong><span className="announcement-separator" aria-hidden="true" />Contact ZetaSkills Training Team at<b>{WHATSAPP_DISPLAY}</b><span className="announcement-separator" aria-hidden="true" />Visit us: {CAMPUS_ADDRESS}</span>;
}

export function AnnouncementBar() {
  return <div className="announcement-bar" aria-label={`Registrations are open. Contact: ${WHATSAPP_DISPLAY}. Visit us: ${CAMPUS_ADDRESS}.`}><div className="announcement-track"><div className="announcement-copy" aria-hidden="true"><Announcement /></div><div className="announcement-copy" aria-hidden="true"><Announcement /></div></div></div>;
}
