import Image from "next/image";

export function SitePhoto({ src, alt, className, sizes, priority = false }: { src: string; alt: string; className: string; sizes: string; priority?: boolean }) {
  return <div className={`site-photo ${className}`}><Image src={src} alt={alt} fill sizes={sizes} priority={priority} /></div>;
}
