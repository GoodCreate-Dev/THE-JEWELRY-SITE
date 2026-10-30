"use client";

/* eslint-disable @next/next/no-img-element -- local photos, sized by CSS */
import Link from "next/link";
import { useEffect, useState } from "react";
import { asset, content, FORM_ID, path, PAGES, type Lang, type PageKey } from "@/content/site";
import { responsive } from "@/lib/img";
import "./header.css";

/**
 * Photo shown beside each page name in the full-screen menu (a tall frame). Pages whose wide
 * hero crops badly there get their own photo; the rest use the page hero.
 */
const MENU_IMAGES: Partial<Record<PageKey, string>> = {};

function menuImage(lang: Lang, p: PageKey) {
  if (p === "home") return asset("/images/hero-stage.jpg");
  const own = MENU_IMAGES[p];
  return own ? asset(`/images/${own}.jpg`) : content[lang][p].hero.image;
}

/** The bar's own short labels, in English on both sites (as in an editorial masthead). */
const BAR: [PageKey, string][] = [["about", "About"], ["spaces", "Spaces"], ["events", "Events"], ["news", "News"], ["visit", "Access"]];

/**
 * Fixed header: brand left, page links centred, language, enquiry and the menu icon right.
 * Transparent over the hero, a dark glass bar once the page scrolls; slides away while
 * scrolling down and returns on scroll up. The icon opens a full-screen menu with large
 * numbered page names and a photo of the page under the pointer.
 */
export function Header({ lang, page }: { lang: Lang; page: PageKey }) {
  const t = content[lang];
  const [solid, setSolid] = useState(false);
  const [away, setAway] = useState(false);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<PageKey>(page);

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
      <header className={`hd${solid || open ? " is-solid" : ""}${away && !open ? " is-away" : ""}`}>
        {/* the home page announces 11.01 itself, further down */}
        {page !== "home" && !open && (
          <div className="notice-bar">
            <span>{t.notice.text}</span>
            <Link href={`${path(lang, "contact")}#${FORM_ID}`}>{t.notice.link} →</Link>
            <button type="button" className="notice-close" aria-label={t.nav.close} onClick={closeNotice}>×</button>
          </div>
        )}
        <div className="hd-row">
          <Link href={path(lang, "home")} className="hd-brand" aria-label="THE JEWELRY">
            <span className="hd-word" aria-hidden="true"><b>The Jewelry</b><small>Osaka Bay</small></span>
          </Link>
          <nav className="hd-nav" aria-label="Primary">
            {BAR.map(([p, label]) => (
              <Link key={p} href={path(lang, p)} aria-current={p === page ? "page" : undefined}>{label}</Link>
            ))}
          </nav>
          <div className="hd-right">
            <span className="hd-lang">
              <Link href={path("ja", page)} aria-current={lang === "ja" ? "true" : undefined} lang="ja">JP</Link>
              <Link href={path("en", page)} aria-current={lang === "en" ? "true" : undefined} lang="en">EN</Link>
            </span>
            <Link href={`${path(lang, "contact")}#${FORM_ID}`} className="hd-cta">
              <span className="cta-long">{t.nav.cta}</span>
              <span className="cta-short">{t.nav.ctaShort}</span>
            </Link>
            <button type="button" className="menu-btn" aria-label={open ? t.nav.close : t.nav.menu} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
              <span className="menu-lines" aria-hidden="true"><i /><i /><i /></span>
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
            <span className="hd-lang">
              <Link href={path("ja", page)} aria-current={lang === "ja" ? "true" : undefined} onClick={() => setOpen(false)}>JP</Link>
              <Link href={path("en", page)} aria-current={lang === "en" ? "true" : undefined} onClick={() => setOpen(false)}>EN</Link>
            </span>
          </div>
        </nav>
      </div>
    </>
  );
}
