import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return <Link href="/" className="logo" aria-label="ZetaSkills home">
    <Image className="logo-light" src="/Zeta_Skills_White_on_Royal_Blue_Horizontal.png" alt="" width={190} height={31} priority />
    <Image className="logo-dark" src="/Zeta_Skills_White_Logo.png" alt="" width={190} height={31} priority />
  </Link>;
}
