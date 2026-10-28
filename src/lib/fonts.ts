import { Manrope, Noto_Sans_JP } from "next/font/google";

// Latin: Manrope for headings (light) and text: modern and minimal.
export const manrope = Manrope({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-en", display: "swap" });

// Japanese: Noto Sans JP for headings and text.
// Large font: not preloaded, Next.js serves the needed slices on demand.
export const notoSans = Noto_Sans_JP({ weight: ["300", "400", "500"], variable: "--font-jp", display: "swap", preload: false });

export const fontVars = `${manrope.variable} ${notoSans.variable}`;
