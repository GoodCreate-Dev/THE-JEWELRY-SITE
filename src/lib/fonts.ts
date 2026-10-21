import { Cormorant_Garamond, Noto_Sans_JP, Shippori_Mincho } from "next/font/google";

export const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });

// Japanese fonts are large: not preloaded, Next.js serves the needed slices on demand.
export const mincho = Shippori_Mincho({ weight: ["400", "500"], variable: "--font-mincho", display: "swap", preload: false });
export const noto = Noto_Sans_JP({ weight: ["300", "400", "500"], variable: "--font-noto", display: "swap", preload: false });

export const fontVars = `${cormorant.variable} ${mincho.variable} ${noto.variable}`;
