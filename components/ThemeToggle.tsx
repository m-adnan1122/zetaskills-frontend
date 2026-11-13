"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
export function ThemeToggle() { const [dark, setDark] = useState(false); useEffect(() => setDark(document.documentElement.classList.contains("dark")), []); function toggle() { const next = !document.documentElement.classList.contains("dark"); document.documentElement.classList.toggle("dark", next); localStorage.setItem("zetaskills-theme", next ? "dark" : "light"); setDark(next); } return <button className="theme-toggle" onClick={toggle} aria-label={`Switch to ${dark ? "light" : "dark"} theme`}>{dark ? <Sun size={19} /> : <Moon size={19} />}</button>; }
