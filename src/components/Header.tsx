"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { content, path, PAGES, type Lang, type PageKey } from "@/content/site";

/** Fixed header: white logo, page links, language switch, booking button, closable notice. */
export function Header({ lang, page }: { lang: Lang; page: PageKey }) {
  const t = content[lang];
  const [solid, setSolid] = useState(false);
  const [away, setAway] = useState(false);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState(true);

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

  useEffect(() => {
    try {
      if (sessionStorage.getItem("tj-notice")) setNotice(false);
    } catch {}
  }, []);

  const closeNotice = () => {
    setNotice(false);
    try {
      sessionStorage.setItem("tj-notice", "1");
    } catch {}
  };

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const navPages = PAGES.filter((p) => p !== "home" && p !== "contact");

  return (
    <>
      <header className={`site-head${solid || open ? " solid" : ""}${away && !open ? " away" : ""}`}>
        {notice && !open && (
          <div className="notice-bar">
            <span>{t.notice.text}</span>
            <Link href={path(lang, "contact")}>{t.notice.link} →</Link>
            <button type="button" className="notice-close" aria-label={t.nav.close} onClick={closeNotice}>×</button>
          </div>
        )}
        <div className="head-row">
          <nav className="head-nav" aria-label="Main">
            {navPages.map((p) => (
              <Link key={p} href={path(lang, p)} aria-current={p === page ? "page" : undefined}>
                {t.nav.labels[p]}
              </Link>
            ))}
          </nav>
          <Link href={path(lang, "home")} className="logo" aria-label="THE JEWELRY" style={{ justifySelf: "center" }} />
          <div className="head-right">
            <span className="head-lang">
              <Link href={path("ja", page)} aria-current={lang === "ja" ? "true" : undefined} lang="ja">JP</Link>
              {" / "}
              <Link href={path("en", page)} aria-current={lang === "en" ? "true" : undefined} lang="en">EN</Link>
            </span>
            <Link href={path(lang, "contact")} className="head-cta">{t.nav.cta}</Link>
            <button type="button" className="menu-btn" aria-label={open ? t.nav.close : t.nav.menu} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <nav className="mobile-menu" aria-label="Mobile" inert={!open}>
        {PAGES.map((p) => (
          <Link key={p} href={path(lang, p)} onClick={() => setOpen(false)}>
            {t.nav.labels[p]}
          </Link>
        ))}
        <div style={{ marginTop: 28, display: "flex", gap: 20, fontSize: 12, letterSpacing: ".2em" }}>
          <Link href={path("ja", page)} onClick={() => setOpen(false)}>JP</Link>
          <Link href={path("en", page)} onClick={() => setOpen(false)}>EN</Link>
        </div>
      </nav>
    </>
  );
}
