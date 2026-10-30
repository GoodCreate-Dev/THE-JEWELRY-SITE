import { Cormorant_Garamond, Manrope } from "next/font/google";
import localFont from "next/font/local";

// Latin: Manrope for headings (light) and text: modern and minimal.
export const manrope = Manrope({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-en", display: "swap" });

// Japanese: Noto Sans JP, cut down to the characters the site uses (scripts/make-jp-font.py),
// so phones load two small files instead of Google's ~270 pieces. Re-run that script after
// changing Japanese text; characters not in the file fall back to the device's Japanese font.
export const notoSans = localFont({
  src: [
    { path: "../fonts/noto-sans-jp-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/noto-sans-jp-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-jp",
  display: "swap",
  preload: false,
  fallback: ["Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans CJK JP", "Yu Gothic", "Meiryo", "sans-serif"],
});

// Headlines: Cormorant Garamond (high-contrast editorial serif) and Shippori Mincho, cut down
// like Noto Sans JP by scripts/make-jp-font.py.
export const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
export const mincho = localFont({
  src: [{ path: "../fonts/shippori-mincho-400.woff2", weight: "400", style: "normal" }],
  variable: "--font-mincho-jp",
  display: "swap",
  preload: false,
  fallback: ["Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif CJK JP", "serif"],
});

export const fontVars = `${manrope.variable} ${notoSans.variable} ${cormorant.variable} ${mincho.variable}`;
