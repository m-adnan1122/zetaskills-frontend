import { Image as ImageIcon } from "lucide-react";
export function PhotoPlaceholder({ caption, className = "" }: { caption: string; className?: string }) { return <div className={`photo-placeholder ${className}`} role="img" aria-label={caption}><ImageIcon size={27} strokeWidth={1.5} /><span>{caption}</span></div>; }
