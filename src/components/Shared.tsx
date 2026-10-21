/* eslint-disable @next/next/no-img-element -- local photos, sized by CSS */
import Link from "next/link";
import type { ReactNode } from "react";
import { COMPANY_URL, content, IG_URL, path, PAGES, PRIVACY_URL, type Lang, type PageKey } from "@/content/site";
import { Header } from "./Header";

/** Every page: header, content, footer, sample label. */
export function Shell({ lang, page, children }: { lang: Lang; page: PageKey; children: ReactNode }) {
  const t = content[lang];
  return (
    <>
      <Header lang={lang} page={page} />
      <main>{children}</main>
      <Footer lang={lang} />
      <span className="pointer-events-none fixed bottom-2 right-2 z-[70] bg-black/70 px-2 py-1 text-[8px] tracking-[.14em] text-gold-hi/80 md:bottom-3 md:right-3 md:px-3 md:py-2 md:text-[10px] md:tracking-[.18em]">{t.sample}</span>
    </>
  );
}

/** Black screen with the white logo and a gold line, shown once per visit (CSS hides it after). */
export function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-mark">
        <span className="logo" />
        <span className="intro-line" />
      </div>
    </div>
  );
}

/** Large photo header used by every page except the home page. */
export function PageHero({ lang, hero }: { lang: Lang; hero: { kicker: string; title: string; lead: string; image: string } }) {
  return (
    <section className="page-hero">
      <div className="hero-img">
        <img src={hero.image} alt="" />
      </div>
      <div className="hero-veil" />
      <div className="page-hero-inner">
        <div>
          <p className="kicker rv">{hero.kicker}</p>
          <h1 className="display rv mt-4" style={{ "--d": ".12s" } as React.CSSProperties}>{hero.title}</h1>
          <p className="lead rv" style={{ "--d": ".24s" } as React.CSSProperties}>{hero.lead}</p>
        </div>
        <p className="caption rv" style={{ "--d": ".36s" } as React.CSSProperties}>{content[lang].common.temp}</p>
      </div>
    </section>
  );
}

/** Gold hairline with a small diamond, used between blocks. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`ornament ${className}`} aria-hidden="true">
      <i />
    </div>
  );
}

/** Black band inviting enquiries; ends most pages. */
export function ContactBand({ lang }: { lang: Lang }) {
  const t = content[lang];
  return (
    <section className="sec text-center">
      <Ornament className="mx-auto mb-14 max-w-md rv" />
      <p className="kicker rv">Contact</p>
      <h2 className="display sec-title rv mx-auto mt-5 max-w-4xl" style={{ "--d": ".1s" } as React.CSSProperties}>
        {t.home.contactTitle}
      </h2>
      <p className="rv mx-auto mt-6 max-w-xl text-white/75" style={{ "--d": ".2s" } as React.CSSProperties}>{t.home.contactBody}</p>
      <div className="rv mt-10 flex flex-wrap justify-center gap-4" style={{ "--d": ".3s" } as React.CSSProperties}>
        <Link href={path(lang, "contact")} className="btn btn-gold">{t.nav.cta}</Link>
        <a href={IG_URL} target="_blank" rel="noopener" className="btn btn-line">Instagram DM</a>
      </div>
    </section>
  );
}

function Footer({ lang }: { lang: Lang }) {
  const t = content[lang];
  return (
    <footer className="border-t border-gold/25 px-[var(--pad)] pt-20 pb-10">
      <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <span className="logo w-20" />
          <p className="mt-6 text-sm text-white/70">{t.footer.address}</p>
          <p className="caption mt-1">{t.footer.tagline}</p>
        </div>
        <nav className="grid grid-cols-2 gap-x-8 gap-y-2 text-[13px] text-white/75" aria-label="Footer">
          {PAGES.map((p) => (
            <Link key={p} href={path(lang, p)} className="transition hover:text-gold-hi">{t.nav.labels[p]}</Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 text-[13px] text-white/75">
          <a href={IG_URL} target="_blank" rel="noopener" className="hover:text-gold-hi">Instagram ↗</a>
          <a href={COMPANY_URL} target="_blank" rel="noopener" className="hover:text-gold-hi">{t.footer.company} ↗</a>
          <a href={PRIVACY_URL} target="_blank" rel="noopener" className="hover:text-gold-hi">{t.footer.privacy} ↗</a>
          <span className="mt-3 text-[11px] tracking-[.2em]">
            <Link href={path("ja", "home")} className={lang === "ja" ? "text-gold-hi" : ""}>JP</Link> /{" "}
            <Link href={path("en", "home")} className={lang === "en" ? "text-gold-hi" : ""}>EN</Link>
          </span>
        </div>
      </div>
      <Ornament className="my-12" />
      <p className="caption text-center">{t.footer.rights}</p>
    </footer>
  );
}
