/* eslint-disable @next/next/no-img-element -- local photos, sized by CSS */
import Link from "next/link";
import type { ReactNode } from "react";
import { responsive } from "@/lib/img";
import { asset, COMPANY_URL, content, FORM_ID, IG_URL, path, PAGES, PRIVACY_URL, type Lang, type PageKey } from "@/content/site";
import { Cursor } from "./Cursor";
import { Header } from "./Header";
import { HeroImg } from "./HeroImg";
import { SceneMotion } from "./SceneMotion";
import "./footer.css";
import "./scenes.css";
import "./inner.css";

/** Every page: header, content, footer. */
export function Shell({ lang, page, children }: { lang: Lang; page: PageKey; children: ReactNode }) {
  return (
    <>
      <a href="#top" className="skip">{lang === "ja" ? "本文へ移動" : "Skip to content"}</a>
      <Header lang={lang} page={page} />
      <main id="top" tabIndex={-1}>{children}</main>
      <Cursor />
      <SceneMotion />
      <Footer lang={lang} page={page} />
    </>
  );
}

/**
 * Header of every page but home: a full-bleed photo (or film) that pushes in slowly, the page
 * number as a large gold outline, and the title rising letter by letter (SceneMotion split).
 */
export function PageHero({ hero, video, index }: { hero: { kicker: string; title: string; lead: string; image: string }; video?: string; index?: string }) {
  return (
    // Motion.tsx may set --hp on it before hydration
    <section className="ph" data-hero suppressHydrationWarning>
      <div className="ph-media">
        {video ? <video src={video} poster={hero.image} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" /> : <HeroImg {...responsive(hero.image)} />}
      </div>
      <div className="ph-veil" />
      {index && <span className="ph-index" aria-hidden="true">{index}</span>}
      <div className="ph-inner">
        <p className="kicker ph-kicker">{hero.kicker}</p>
        <h1 className="display ph-title" data-split>{hero.title}</h1>
        <i className="ph-line" aria-hidden="true" />
        <p className="ph-lead">{hero.lead}</p>
      </div>
      <span className="ph-scroll" aria-hidden="true">Scroll</span>
    </section>
  );
}

/** Large words drifting sideways as the page scrolls (SceneMotion moves .h-kinetic). */
export function Marquee({ words }: { words: string[] }) {
  return (
    <div className="h-kinetic" aria-hidden="true">
      <div className="h-kinetic-track">
        {[0, 1].map((k) => words.map((w) => <span key={`${k}-${w}`}>{w}<i /></span>))}
      </div>
    </div>
  );
}

/**
 * A full-screen photo that opens out of a narrow window as it comes in, with one large line
 * (and an optional sentence) set over it.
 */
export function WindowFilm({ kicker, title, body, video, image }: { kicker: string; title: string; body?: string; video?: string; image: string }) {
  return (
    <section className="qs">
      <div className="qs-media">
        {video ? <video src={video} poster={image} autoPlay muted loop playsInline preload="none" aria-hidden="true" /> : <img {...responsive(image)} alt="" loading="lazy" />}
      </div>
      <div className="qs-text">
        <p className="kicker" data-reveal>{kicker}</p>
        <h2 className="display qs-title" data-split>{title}</h2>
        {body && <p className="h-body" data-reveal>{body}</p>}
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

/**
 * Full-width band: a photo on one side fading into the dark (it opens from its side and drifts
 * as you scroll), text on the other with a large outlined number behind it. `rev` swaps sides;
 * `children` adds details under the text (specs, facts, thumbnails); `focus` is the part of the
 * photo to keep in view (CSS object-position), for subjects away from the centre.
 */
export function Band({ id, no, kicker, title, body, image, href, cta, rev, focus, children }: {
  id?: string; no: string; kicker: string; title: ReactNode; body?: ReactNode; image: string; href?: string; cta?: string; rev?: boolean; focus?: string; children?: ReactNode;
}) {
  const photo = <img {...responsive(image, "(min-width: 1025px) 70vw, 100vw")} alt="" loading="lazy" style={focus ? { objectPosition: focus } : undefined} />;
  return (
    <section id={id} className={`bd${rev ? " bd-rev" : ""}`}>
      {href ? <Link href={href} className="bd-img" data-cursor="view" tabIndex={-1} aria-hidden="true">{photo}</Link> : <div className="bd-img" aria-hidden="true">{photo}</div>}
      <div className="bd-text">
        <span className="bd-num" aria-hidden="true">{no}</span>
        <p className="kicker" data-reveal>{kicker}</p>
        <h2 className="display bd-title" data-split>{title}</h2>
        {body && <div className="bd-body" data-reveal>{body}</div>}
        {children}
        {href && cta && <Link href={href} className="btn btn-line magnetic" data-reveal>{cta}<i className="btn-arrow" /></Link>}
      </div>
    </section>
  );
}

/** Closing scene of every page: the LED lattice moving behind an invitation to get in touch. */
export function ContactBand({ lang }: { lang: Lang }) {
  const t = content[lang];
  return (
    <section className="h-contact">
      {/* poster and film are loaded by SceneMotion once it is close (the film only where motion is allowed) */}
      <video className="h-contact-bg" data-lazy-src={asset("/videos/lattice-loop.mp4")} data-lazy-poster={asset("/images/lattice-loop-poster.jpg")} muted loop playsInline preload="none" aria-hidden="true" />
      <div className="h-contact-inner">
        <p className="kicker" data-reveal>Contact</p>
        <h2 className="display h-contact-title" data-split>{t.home.contactTitle}</h2>
        <p className="h-body" data-reveal>{t.home.contactBody}</p>
        <div className="h-contact-actions" data-reveal>
          <Link href={`${path(lang, "contact")}#${FORM_ID}`} className="btn btn-accent magnetic">{t.nav.cta}<i className="btn-arrow" /></Link>
          <a href={IG_URL} target="_blank" rel="noopener" className="btn btn-line magnetic">Instagram DM<i className="btn-arrow" /></a>
        </div>
      </div>
    </section>
  );
}


/**
 * Footer: brand and address, page links, outside links and a way back up, closed by the name
 * set across the full width (its letters rise as the footer comes into view: .ft-word).
 */
function Footer({ lang, page }: { lang: Lang; page: PageKey }) {
  const t = content[lang];
  return (
    <footer className="site-foot ft">
      <div className="ft-grid">
        <div className="ft-brand">
          <span className="logo ft-mark" aria-hidden="true" />
          <p className="ft-name">The Jewelry<small>Osaka Bay</small></p>
          <p className="ft-addr">{t.footer.address}</p>
          <p className="ft-tag">{t.footer.tagline}</p>
        </div>
        <nav className="ft-nav" aria-label="Footer">
          {PAGES.map((p, i) => (
            <Link key={p} href={path(lang, p)}><span>{String(i + 1).padStart(2, "0")}</span>{t.nav.labels[p]}</Link>
          ))}
        </nav>
        <div className="ft-links">
          <a href={IG_URL} target="_blank" rel="noopener">Instagram <i>↗</i></a>
          <a href={COMPANY_URL} target="_blank" rel="noopener">{t.footer.company} <i>↗</i></a>
          <a href={PRIVACY_URL} target="_blank" rel="noopener">{t.footer.privacy} <i>↗</i></a>
          <a href="#top" className="ft-top">Page top <i>↑</i></a>
        </div>
      </div>
      <p className="ft-word" aria-hidden="true">
        {[..."THE JEWELRY"].map((c, i) => <span key={i} style={{ "--i": i } as React.CSSProperties}>{c === " " ? " " : c}</span>)}
      </p>
      <div className="ft-base">
        <p>{t.footer.rights}</p>
        <span className="hd-lang">
          <Link href={path("ja", page)} aria-current={lang === "ja" ? "true" : undefined} lang="ja">JP</Link>
          <Link href={path("en", page)} aria-current={lang === "en" ? "true" : undefined} lang="en">EN</Link>
        </span>
      </div>
    </footer>
  );
}
