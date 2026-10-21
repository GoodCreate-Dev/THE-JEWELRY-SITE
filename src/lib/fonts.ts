import { Bodoni_Moda, Jost, Noto_Sans_JP, Shippori_Mincho } from "next/font/google";

// Latin: Bodoni Moda for headings (optical sizes keep large type crisp), Jost for text and labels.
export const bodoni = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"], variable: "--font-bodoni", display: "swap" });
export const jost = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-jost", display: "swap" });

// Japanese fonts are large: not preloaded, Next.js serves the needed slices on demand.
export const mincho = Shippori_Mincho({ weight: ["400", "500"], variable: "--font-mincho", display: "swap", preload: false });
export const noto = Noto_Sans_JP({ weight: ["300", "400", "500"], variable: "--font-noto", display: "swap", preload: false });

export const fontVars = `${bodoni.variable} ${jost.variable} ${mincho.variable} ${noto.variable}`;
