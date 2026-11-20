import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Suspense } from "react";
import { NavigationLoader } from "@/components/NavigationLoader";
import { ChatWidget } from "@/components/ChatWidget";
import "./globals.css";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-poppins" });
export const metadata: Metadata = { title: "ZetaSkills", description: "IT and freelancing courses in Faisalabad." };
const themeScript = `(function(){try{var t=localStorage.getItem('zetaskills-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`;
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body className={`${inter.variable} ${poppins.variable}`}><Suspense fallback={null}><NavigationLoader /></Suspense>{children}<ChatWidget /></body></html>; }
