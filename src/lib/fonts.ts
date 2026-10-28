import { EB_Garamond, Noto_Serif_JP, Source_Sans_3 } from "next/font/google";

// Latin: EB Garamond for headings (calm, classic book serif), Source Sans 3 for text and labels.
export const garamond = EB_Garamond({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-garamond", display: "swap" });
export const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: "--font-source", display: "swap" });

// Japanese: Noto Serif JP for headings and text (same as the LOBMEYR site).
// Large font: not preloaded, Next.js serves the needed slices on demand.
export const notoSerif = Noto_Serif_JP({ weight: ["300", "400", "500"], variable: "--font-jp", display: "swap", preload: false });

export const fontVars = `${garamond.variable} ${sourceSans.variable} ${notoSerif.variable}`;
