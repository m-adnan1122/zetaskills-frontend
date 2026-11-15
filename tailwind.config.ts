import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)", card: "var(--card)", raised: "var(--raised)",
        border: "var(--border)", foreground: "var(--text)", muted: "var(--muted)",
        primary: "var(--primary)", accent: "var(--accent)", whatsapp: "var(--whatsapp)",
      },
      borderRadius: { card: "12px", button: "8px" },
      fontFamily: { sans: ["var(--font-inter)"], heading: ["var(--font-poppins)"] },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
