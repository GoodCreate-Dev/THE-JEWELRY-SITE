import { Manrope, Noto_Serif_JP } from "next/font/google";

// Latin: Manrope for headings (light) and text: modern and minimal.
export const manrope = Manrope({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-en", display: "swap" });

// Japanese: Noto Serif JP for headings and text (same as the LOBMEYR site).
// Large font: not preloaded, Next.js serves the needed slices on demand.
export const notoSerif = Noto_Serif_JP({ weight: ["300", "400", "500"], variable: "--font-jp", display: "swap", preload: false });

export const fontVars = `${manrope.variable} ${notoSerif.variable}`;
