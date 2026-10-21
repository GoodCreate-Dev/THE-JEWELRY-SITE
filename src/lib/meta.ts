import type { Metadata } from "next";
import { content, path, type Lang, type PageKey } from "@/content/site";

export function pageMeta(lang: Lang, page: PageKey): Metadata {
  const m = content[lang].meta[page];
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: path(lang, page), languages: { ja: path("ja", page), en: path("en", page) } },
    robots: { index: false }, // design sample
  };
}
