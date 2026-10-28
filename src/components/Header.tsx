"use client";

/* eslint-disable @next/next/no-img-element -- local photos, sized by CSS */
import Link from "next/link";
import { useEffect, useState } from "react";
import { asset, content, path, PAGES, type Lang, type PageKey } from "@/content/site";
import { responsive } from "@/lib/img";

/** Photo shown beside each page name in the full-screen menu. */
function menuImage(lang: Lang, p: PageKey) {
  if (p === "home") return asset("/images/hero-night.jpg");
  return content[lang][p].hero.image;
}

/**
 * Fixed header (no logo; the home hero carries it): language, enquiry and the menu icon on the right. The icon opens a full-screen
 * menu with large numbered page names and a photo of the page under the pointer.
 */
export function Header({ lang, page }: { lang: Lang; page: PageKey }) {
  const t = content[lang];
  const [solid, setSolid] = useState(false);
  const [away, setAway] = useState(false);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<PageKey>(page);

  // Solid after the hero edge; slides away while scrolling down, returns on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 60);
      if (Math.abs(y - last) > 6) {
        setAway(y > last && y > 240);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hidden by the `notice-closed` class, which the layout's inline script restores on later pages.
  const closeNotice = () => {
    document.documentElement.classList.add("notice-closed");
    try {
      sessionStorage.setItem("tj-notice", "1");
    } catch {}
  };

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className={`site-head${solid || open ? " solid" : ""}${away && !open ? " away" : ""}`}>
        {!open && (
          <div className="notice-bar">
            <span>{t.notice.text}</span>
            <Link href={path(lang, "contact")}>{t.notice.link} →</Link>
            <button type="button" className="notice-close" aria-label={t.nav.close} onClick={closeNotice}>×</button>
          </div>
        )}
        <div className="head-row">
          <div className="head-right">
            <span className="head-lang">
              <Link href={path("ja", page)} aria-current={lang === "ja" ? "true" : undefined} lang="ja">JP</Link>
              <Link href={path("en", page)} aria-current={lang === "en" ? "true" : undefined} lang="en">EN</Link>
            </span>
            <Link href={path(lang, "contact")} className="head-cta">
              <span className="cta-long">{t.nav.cta}</span>
              <span className="cta-short">{t.nav.ctaShort}</span>
            </Link>
            <button type="button" className="menu-btn" aria-label={open ? t.nav.close : t.nav.menu} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
              <span className="menu-lines" aria-hidden="true"><i /><i /></span>
            </button>
          </div>
        </div>
      </header>

      <div className="menu-panel" inert={!open}>
        <div className="menu-media" aria-hidden="true">
          {PAGES.map((p) => (
            <img key={p} {...responsive(menuImage(lang, p), "40vw")} alt="" className={p === preview ? "on" : ""} loading="lazy" />
          ))}
        </div>
        <nav className="menu-links" aria-label="Main">
          <ol>
            {PAGES.map((p, i) => (
              <li key={p} style={{ "--i": i } as React.CSSProperties}>
                <Link href={path(lang, p)} aria-current={p === page ? "page" : undefined} onMouseEnter={() => setPreview(p)} onFocus={() => setPreview(p)} onClick={() => setOpen(false)}>
                  <span className="menu-no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="display menu-name">{t.nav.labels[p]}</span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="menu-foot">
            <span className="caption">THE JEWELRY · OSAKA BAY</span>
            <span className="head-lang">
              <Link href={path("ja", page)} aria-current={lang === "ja" ? "true" : undefined} onClick={() => setOpen(false)}>JP</Link>
              <Link href={path("en", page)} aria-current={lang === "en" ? "true" : undefined} onClick={() => setOpen(false)}>EN</Link>
            </span>
          </div>
        </nav>
      </div>
    </>
  );
}
