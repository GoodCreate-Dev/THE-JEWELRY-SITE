"use client";

/* eslint-disable @next/next/no-img-element -- local photos, sized by CSS */
import Link from "next/link";
import { useEffect, useState } from "react";
import { content, path, type Lang } from "@/content/site";
import { responsive } from "@/lib/img";

const AUTO_MS = 6000;

/**
 * Home "Spaces" as an index: a large typographic list on one side, one large photo on the
 * other that crossfades to the chosen space. Advances by itself every few seconds until the
 * visitor hovers, focuses or taps a space.
 */
export function SpacesIndex({ lang }: { lang: Lang }) {
  const t = content[lang];
  const spaces = t.spaces.spaces;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % spaces.length), AUTO_MS);
    return () => clearTimeout(id);
  }, [active, paused, spaces.length]);

  return (
    <div className="spaces-index" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="spaces-stage rv-img">
        {spaces.map((s, i) => (
          <img key={s.no} {...responsive(s.image, "(min-width: 1024px) 55vw, 100vw")} alt={i === active ? s.name : ""} className={i === active ? "on" : ""} loading={i === 0 ? "eager" : "lazy"} />
        ))}
        <span className="spaces-stage-no" aria-hidden="true">{String(active + 1).padStart(2, "0")}</span>
      </div>

      <ol className="spaces-list">
        {spaces.map((s, i) => (
          <li key={s.no} className={i === active ? "on" : ""}>
            <button type="button" onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} aria-expanded={i === active}>
              <span className="caption">{s.no}</span>
              <span className="display spaces-name">{s.name}</span>
              <span className="display spaces-cap">{s.capacity}<small>{t.common.guests}</small></span>
            </button>
            <div className="spaces-detail">
              <div>
                <p className="text-sm leading-[2] text-white/70">{s.body}</p>
                <p className="mt-4 flex flex-wrap gap-2">
                  {s.uses.map((u) => <span key={u} className="border border-white/20 px-3 py-1 text-[11px] tracking-[.08em] text-white/70">{u}</span>)}
                </p>
                <Link href={path(lang, "spaces")} className="link-arrow mt-6">{t.common.more} <span>→</span></Link>
              </div>
            </div>
            <i className="spaces-progress" style={{ animationPlayState: paused ? "paused" : "running" }} aria-hidden="true" />
          </li>
        ))}
      </ol>
    </div>
  );
}
