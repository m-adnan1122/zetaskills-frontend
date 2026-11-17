import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return <Link href="/" className="logo" aria-label="ZetaSkills home">
    <span className="logo-light" aria-hidden="true" />
    <Image className="logo-dark" src="/Zeta_Skills_White_Logo.png" alt="" width={190} height={31} priority />
  </Link>;
}
