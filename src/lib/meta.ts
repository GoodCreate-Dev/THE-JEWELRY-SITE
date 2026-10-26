import type { Metadata } from "next";
import { asset, content, path, type Lang, type PageKey } from "@/content/site";

/** Link-share defaults (LINE, Instagram, X, email): site name and the share image public/og.jpg. */
export function share(lang: Lang) {
  const images = [{ url: asset("/og.jpg"), width: 1200, height: 630, alt: "THE JEWELRY — glass dome glowing on Osaka Bay at night" }];
  return {
    openGraph: { type: "website" as const, siteName: "THE JEWELRY", locale: lang === "ja" ? "ja_JP" : "en_US", images },
    twitter: { card: "summary_large_image" as const, images },
  };
}

export function pageMeta(lang: Lang, page: PageKey): Metadata {
  const m = content[lang].meta[page];
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: asset(path(lang, page)), languages: { ja: asset(path("ja", page)), en: asset(path("en", page)) } },
    openGraph: { ...share(lang).openGraph, title: m.title, description: m.description, url: asset(path(lang, page)) },
    twitter: { ...share(lang).twitter, title: m.title, description: m.description },
    robots: { index: false }, // design sample
  };
}
