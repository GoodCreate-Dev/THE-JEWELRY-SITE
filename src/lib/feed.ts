import { readFileSync } from "node:fs";
import path from "node:path";
import { asset, content, type Lang } from "@/content/site";

export type FeedKind = "news" | "event";

/** One card on the News / Events lists: a manual news item or an Instagram post. */
export type FeedItem = {
  id: string;
  kind: FeedKind;
  date: string; // "YYYY.MM.DD"
  title: string;
  desc: string;
  image: string;
  permalink?: string; // Instagram posts only
};

type IgPost = { id: string; kind: FeedKind; date: string; title: string; desc: string; image: string; permalink: string };

// Written by scripts/fetch-instagram.mjs before each CI build; read once at build time.
function readInstagram(): IgPost[] {
  try {
    const posts = JSON.parse(readFileSync(path.join(process.cwd(), "public", "instagram", "posts.json"), "utf8"));
    return Array.isArray(posts) ? posts : [];
  } catch {
    return [];
  }
}
const instagram = readInstagram();

const dateKey = (d: string) => Number(d.replace(/\D/g, "")) || 0;

/** Manual news plus tagged Instagram posts, newest first; optionally only one kind. */
export function feed(lang: Lang, kind?: FeedKind): FeedItem[] {
  const manual: FeedItem[] = content[lang].news.items.map((n) => ({ id: n.id, kind: "news", date: n.date, title: n.title, desc: n.body, image: n.image }));
  const ig: FeedItem[] = instagram.map((p) => ({ id: p.id, kind: p.kind, date: p.date, title: p.title, desc: p.desc, image: asset(p.image), permalink: p.permalink }));
  return [...manual, ...ig].filter((i) => !kind || i.kind === kind).sort((a, b) => dateKey(b.date) - dateKey(a.date));
}

export const feedItem = (lang: Lang, id: string) => feed(lang).find((i) => i.id === id);

/** Every detail-page id; never empty because manual news always exists. */
export const feedIds = () => feed("ja").map((i) => ({ id: i.id }));
