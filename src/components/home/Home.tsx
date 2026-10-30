/* eslint-disable @next/next/no-img-element -- local photos, sized by CSS */
import Link from "next/link";
import { asset, content, EVENT_IDS, FORM_ID, path, SPACE_IDS, type Lang } from "@/content/site";
import { responsive } from "@/lib/img";
import { HeroCine } from "../HeroCine";
import { Band, ContactBand, Shell } from "../Shared";

/**
 * Home, new version: one film in scenes. Hero (HeroCine) → three full-width bands (event,
 * spaces, museum) → the four kinds of event as tall cards → statement and figures → kinetic
 * line → horizontal gallery of the interior → spaces index → 11.01 → visit → news → contact.
 * All motion lives in SceneMotion (GSAP, via Shell) and Cursor; without them every scene is a plain,
 * readable layout. Headings marked [data-split] rise letter by letter.
 */

const KINETIC = ["Beyond the ordinary", "The night", "Osaka Bay", "Experience"];
const pad = (n: number) => String(n).padStart(2, "0");

/** Text split for the statement: characters for Japanese, words for English. */
function chars(text: string) {
  return text
    .split(/(\s+)/)
    .flatMap((w) => (/[　-鿿＀-￯]/.test(w) ? [...w] : [w]))
    .filter(Boolean)
    .map((w, i) => (/^\s+$/.test(w) ? " " : <span key={i} className="sc">{w}</span>));
}

/** The hero word, split into letters (each rises out of its own mask in the opening). */
function CineWord() {
  return (
    <span className="cine-letters" aria-hidden="true">
      {[..."JEWELRY"].map((c, i) => (
        <span key={i} className="cl"><span style={{ "--i": i } as React.CSSProperties}>{c}</span></span>
      ))}
    </span>
  );
}

export function HomePage({ lang }: { lang: Lang }) {
  const t = content[lang];
  const h = t.home;
  const ja = lang === "ja";
  return (
    <Shell lang={lang} page="home">
      {/* 00 hero: opens (first visit) on JEWELRY lit from inside, rushing through to the bay at night */}
      <HeroCine>
        <div className="cine-stage">
          <div className="cine-night"><img {...responsive(asset("/images/hero-stage.jpg"))} alt="" fetchPriority="high" /></div>
          <div className="cine-veil" />
          <div className="cine-black" aria-hidden="true" />

          <p className="cine-ui cine-tag">
            {h.tagline.map((line, l) => (
              <span key={l} className="cine-tag-line">
                {[...line].map((c, i) => <span key={i} style={{ "--i": l * 8 + i } as React.CSSProperties}>{c === " " ? " " : c}</span>)}
              </span>
            ))}
          </p>

          <div className="cine-title">
            <h1 className="cine-word" aria-label="THE JEWELRY">
              <CineWord />
            </h1>
            <div className="cine-ui">
              <i className="cine-line" />
              <p className="cine-sub">Osaka Bay</p>
            </div>
          </div>

          <p className="cine-ui cine-meta" aria-hidden="true">34°38′N&nbsp;&nbsp;135°24′E</p>
          <span className="cine-ui cine-scroll" aria-hidden="true">Scroll</span>

          {/* the opening (first visit of a session only, see HeroCine) */}
          <div className="cine-open" aria-hidden="true" style={{ "--inside": `url(${asset("/images/hero-inside-1200.webp")})` } as React.CSSProperties}>
            <div className="open-word">
              {[..."JEWELRY"].map((c, i) => (
                <span key={i} className="ol"><span style={{ "--i": i } as React.CSSProperties}>{c}</span></span>
              ))}
            </div>
            <i className="open-line" />
            <p className="open-sub">Osaka Bay</p>
          </div>
        </div>
      </HeroCine>

      {/* 01–03 bands: photograph and text on alternating sides, a large number behind the text */}
      {h.bands.map((b, i) => (
        <Band key={b.kicker} no={pad(i + 1)} kicker={b.kicker} title={<>{b.title[0]}<br />{b.title[1]}</>} body={b.body} image={b.image} focus={b.focus} href={path(lang, b.page)} cta={b.cta} rev={i % 2 === 1} />
      ))}

      {/* the four kinds of event, as tall cards side by side */}
      <section className="cats" aria-label={h.programmeTitle}>
        {t.events.types.map((e, i) => (
          <Link key={e.no} href={`${path(lang, "events")}#${EVENT_IDS[i]}`} className="cat" data-cursor="view" style={{ "--n": i } as React.CSSProperties}>
            <span className="cat-img"><img {...responsive(e.card, "(min-width: 1025px) 25vw, 50vw")} alt="" loading="lazy" /></span>
            <span className="cat-text">
              <span className="cat-no">{e.no}</span>
              <span className="cat-en">{e.en}</span>
              <span className="cat-title">{e.title}</span>
              <span className="cat-body">{e.body}</span>
              <i className="btn-arrow" />
            </span>
          </Link>
        ))}
      </section>

      {/* statement: characters light up as it scrolls through */}
      <section className="h-statement">
        <p className="kicker" data-reveal>{h.statementLabel}</p>
        <h2 className="display h-statement-text" aria-label={h.statement}>
          <span aria-hidden="true">{chars(h.statement)}</span>
        </h2>
        <div className="h-statement-foot">
          <p data-reveal>{h.statementBody}</p>
          <Link href={path(lang, "about")} className="h-link" data-reveal>{t.common.more}<i className="btn-arrow" /></Link>
        </div>
        <dl className="h-figures">
          {h.figures.map((f) => (
            <div key={f.label} data-reveal>
              <dd className="h-figure-value"><span data-count={f.value}>{f.value}</span><small>{f.unit}</small></dd>
              <dt className="h-figure-label">{f.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* kinetic line, moved by scrolling */}
      <div className="h-kinetic" aria-hidden="true">
        <div className="h-kinetic-track">
          {[0, 1].map((k) => KINETIC.map((w) => <span key={`${k}-${w}`}>{w}<i /></span>))}
        </div>
      </div>

      {/* inside: horizontal gallery of the interior */}
      <section className="h-gallery">
        <div className="h-gallery-stage">
          <div className="h-gallery-head">
            <p className="kicker">{h.gallery.kicker}</p>
            <h2 className="display h-title" data-split>{h.gallery.title}</h2>
            <span className="h-gallery-count" aria-hidden="true"><b>01</b> / {pad(h.gallery.items.length)}</span>
          </div>
          <ul className="h-gallery-track">
            {h.gallery.items.map((g, i) => (
              <li key={g.image} className="h-plate">
                <div className="h-plate-img"><img {...responsive(g.image, "(min-width: 1025px) 40vw, 80vw")} alt={g.caption} loading="lazy" /></div>
                <p className="h-plate-cap"><span>Pl. {pad(i + 1)}</span>{g.caption}</p>
              </li>
            ))}
          </ul>
          <div className="h-gallery-bar" aria-hidden="true"><i /></div>
        </div>
      </section>

      {/* spaces: a large numbered index */}
      <section className="h-spaces">
        <div className="h-spaces-head">
          <p className="kicker" data-reveal>Spaces</p>
          <h2 className="display h-title" data-split>{h.spacesTitle}</h2>
          <p className="h-body" data-reveal>{h.spacesLead}</p>
        </div>
        <ol className="h-spaces-list">
          {t.spaces.spaces.map((s, i) => (
            <li key={s.no} data-reveal>
              <Link href={`${path(lang, "spaces")}#${SPACE_IDS[i]}`} className="h-space">
                <span className="h-space-no">{s.no}</span>
                <span className="display h-space-name">{s.name}</span>
                <span className="h-space-en">{s.en}</span>
                <span className="h-space-cap">{s.capacity}<small>{t.common.guests}</small></span>
                <span className="h-space-img" aria-hidden="true"><img {...responsive(s.image, "30vw")} alt="" loading="lazy" /></span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* 11.01: the date, with the dome's light inside the numerals */}
      <section className="h-date">
        <p className="kicker" data-reveal>Re:Start</p>
        <p className="h-date-num" aria-hidden="true" style={{ "--photo": `url(${asset("/images/hero-inside-1600.webp")})` } as React.CSSProperties}>{h.relaunch.date}</p>
        <h2 className="display h-title" data-split>{h.relaunch.title}</h2>
        <p className="h-body" data-reveal>{h.relaunch.body}</p>
        <Link href={`${path(lang, "contact")}#${FORM_ID}`} className="btn btn-accent magnetic" data-reveal>{h.relaunch.cta}<i className="btn-arrow" /></Link>
      </section>

      {/* visit and news side by side */}
      <section className="h-visit">
        <div className="h-visit-img" data-cursor="view"><img {...responsive(asset("/images/v2-entrance.jpg"), "(min-width: 1025px) 45vw, 100vw")} alt="" loading="lazy" /></div>
        <div className="h-visit-text">
          <p className="kicker" data-reveal>Visit</p>
          <h2 className="display h-title" data-split>{h.visitTitle}</h2>
          <p className="h-body" data-reveal>{h.visitBody}</p>
          <p className="h-visit-addr" data-reveal>{t.footer.address}</p>
          <Link href={path(lang, "visit")} className="h-link" data-reveal>{t.common.more}<i className="btn-arrow" /></Link>

          <div className="h-news">
            <p className="kicker" data-reveal>News</p>
            <ul className="h-news-list">
              {t.news.items.map((n) => (
                <li key={n.id} data-reveal>
                  <Link href={`${path(lang, "news")}${n.id}/`} className="h-news-item">
                    <time>{n.date}</time>
                    <span>{n.title}</span>
                    <i className="btn-arrow" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={path(lang, "news")} className="h-link" data-reveal>{ja ? "お知らせ一覧" : "All news"}<i className="btn-arrow" /></Link>
          </div>
        </div>
      </section>

      <ContactBand lang={lang} />
    </Shell>
  );
}
