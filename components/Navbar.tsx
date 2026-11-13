"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
export function Navbar() { const [open, setOpen] = useState(false); const links = [["Home", "/"], ["Courses", "/courses"], ["About", "/about"], ["Contact", "/contact"]]; return <header className="site-header"><div className="container nav-inner"><Logo /><nav className={open ? "nav-links nav-open" : "nav-links"} aria-label="Main navigation">{links.map(([label, href]) => <Link onClick={() => setOpen(false)} href={href} key={href}>{label}</Link>)}<Link className="mobile-enroll" href="/enroll">Enroll Now</Link></nav><div className="nav-actions"><ThemeToggle /><Link className="button button-primary desktop-enroll" href="/enroll">Enroll Now</Link><button className="menu-toggle" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div></div></header>; }
