import { EB_Garamond, Noto_Sans_JP, Shippori_Mincho, Source_Sans_3 } from "next/font/google";

// Latin: EB Garamond for headings (calm, classic book serif), Source Sans 3 for text and labels.
export const garamond = EB_Garamond({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-garamond", display: "swap" });
export const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: "--font-source", display: "swap" });

// Japanese fonts are large: not preloaded, Next.js serves the needed slices on demand.
export const mincho = Shippori_Mincho({ weight: ["400", "500"], variable: "--font-mincho", display: "swap", preload: false });
export const noto = Noto_Sans_JP({ weight: ["300", "400", "500"], variable: "--font-noto", display: "swap", preload: false });

export const fontVars = `${garamond.variable} ${sourceSans.variable} ${mincho.variable} ${noto.variable}`;
