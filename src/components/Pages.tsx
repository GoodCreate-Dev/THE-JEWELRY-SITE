/* eslint-disable @next/next/no-img-element -- local photos, sized by CSS */
import Link from "next/link";
import { Fragment } from "react";
import { asset, content, IG_URL, MAP_EMBED, PARKING_URL, path, type Content, type Lang } from "@/content/site";
import { ContactForm } from "./ContactForm";
import { feed, type FeedItem } from "@/lib/feed";
import { responsive } from "@/lib/img";
import { FeedBody, FeedSection, IgPostDetail } from "./Feed";
import { SpacesIndex } from "./SpacesIndex";
import { ContactBand, Marquee, PageHero, Shell, SplitText, WindowFilm } from "./Shared";

const d = (s: string) => ({ "--d": s }) as React.CSSProperties;

/* ======================= HOME ======================= */

// Sky twinkles, in image coordinates (% of width, % of height, delay in s).
const TWINKLES = [
  [11, 12, 0], [27, 21, 1.8], [44, 7, 3.1], [71, 9, 0.9], [84, 15, 2.4], [93, 29, 4.2], [6, 33, 3.6], [36, 30, 5.1],
];

/**
 * Hero still made to feel like film: the camera drifts, the water ripples, the dome's LED
 * colours shift and lights twinkle. All layers share the photo's proportions (cover-sized box)
 * so the effects stay on the dome and its reflection at any screen size.
 */
function HeroLive({ src }: { src: string }) {
  return (
    <div className="hero-live" aria-hidden="true">
      <svg className="absolute size-0" focusable="false">
        <filter id="hero-water" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.002 0.06" numOctaves="2" seed="7">
            <animate attributeName="baseFrequency" dur="14s" values="0.002 0.06;0.0026 0.078;0.002 0.06" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="12" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <img {...responsive(src)} alt="" />
      <div className="hero-live-water"><img {...responsive(src)} alt="" /></div>
      <div className="hero-live-water hero-live-reflection"><img {...responsive(src)} alt="" className="hero-live-led" /></div>
      <div className="hero-live-dome"><img {...responsive(src)} alt="" className="hero-live-led" /></div>
      {TWINKLES.map(([x, y, t]) => (
        <i key={`${x}-${y}`} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${t}s` }} />
      ))}
    </div>
  );
}

/**
 * A sentence whose words light up one by one while scrolling (Motion.tsx adds `.lit`).
 * Japanese is lit character by character; `word` is lit as one iridescent phrase.
 */
function LitText({ text, word }: { text: string; word: string }) {
  const i = text.indexOf(word);
  const parts = i < 0 ? [text] : [text.slice(0, i), word, text.slice(i + word.length)];
  const tokens = (t: string) => t.split(/(\s+)/).flatMap((w) => (/[\u3000-\u9fff\uff00-\uffef]/.test(w) ? [...w] : [w])).filter(Boolean);
  return (
    <>
      {parts.map((part, p) =>
        p === 1 ? (
          <span key={p} className="lw iri-text">{part}</span>
        ) : (
          tokens(part).map((w, k) => (/^\s+$/.test(w) ? " " : <span key={`${p}-${k}`} className="lw">{w}</span>))
        ),
      )}
    </>
  );
}

/** Photos for the event types (same order as the content). */
const TYPE_IMAGES = ["real-gold-walkway", "f-stage", "ai-aerial-gold", "ai-promenade"].map((n) => asset(`/images/${n}.jpg`));

export function HomePage({ lang }: { lang: Lang }) {
  const t = content[lang];
  const h = t.home;
  return (
    <Shell lang={lang} page="home">
      {/* hero: editorial, text anchored bottom-left over the living still */}
      <section className="hero hero-v2" data-hero>
        <div className="hero-img">
          <HeroLive src={asset("/images/ai-front.jpg")} />
        </div>
        <div className="hero-veil" />
        <div className="hero-inner hero-drift">
          <span className="logo rv w-[clamp(136px,13vw,200px)]" />
          <p className="kicker rv" style={d(".15s")}>{h.kicker}</p>
          <h1 className="display rv letters" style={d(".3s")} aria-label={h.title.join(" ")}>
            <span aria-hidden="true"><SplitText text={h.title[0]} /></span>
            <span aria-hidden="true" className="iri-text"><SplitText text={h.title[1]} start={h.title[0].length + 2} /></span>
          </h1>
          <div className="hero-foot rv" style={d(".5s")}>
            <p className="hero-lead">{h.lead}</p>
            <div className="hero-actions">
              <Link href={path(lang, "contact")} className="btn btn-accent">{h.ctaPrimary}</Link>
              <Link href={path(lang, "spaces")} className="btn btn-line">{h.ctaSecondary}</Link>
            </div>
          </div>
        </div>
        <p className="hero-meta rv" style={d(".8s")} aria-hidden="true">34°38′N&nbsp;&nbsp;135°24′E<br />Osaka Bay</p>
        <span className="hero-scroll" aria-hidden="true">Scroll</span>
      </section>

      {/* statement: one large sentence, the key phrase in the dome's colours */}
      <section className="sec statement aura">
        <div className="collage-item c1 frame" data-speed="0.18" aria-hidden="true"><img {...responsive(asset("/images/ai-aerial-gold.jpg"), "22vw")} alt="" loading="lazy" /></div>
        <div className="collage-item c2 frame" data-speed="0.32" aria-hidden="true"><img {...responsive(asset("/images/real-blue-trees.jpg"), "16vw")} alt="" loading="lazy" /></div>
        <div className="collage-item c3 frame" data-speed="0.1" aria-hidden="true"><img {...responsive(asset("/images/real-rainbow-garden.jpg"), "14vw")} alt="" loading="lazy" /></div>
        <p className="kicker rv">{h.statementLabel}</p>
        <h2 className="display statement-text mt-10" aria-label={h.statement}>
          <span aria-hidden="true"><LitText text={h.statement} word={lang === "ja" ? "新しい舞台" : "a new stage"} /></span>
        </h2>
        <div className="statement-foot">
          <p className="rv max-w-xl text-white/70" style={d(".15s")}>{h.statementBody}</p>
          <Link href={path(lang, "about")} className="link-arrow rv" style={d(".2s")}>{t.common.more} <span>→</span></Link>
        </div>
        <div className="figures">
          {h.figures.map((f, i) => (
            <div key={f.label} className="rv" style={d(`${0.1 + i * 0.1}s`)}>
              <p className="display figure-value">{f.value}<small>{f.unit}</small></p>
              <p className="caption mt-3">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Marquee words={["Museum", "Exhibitions", "Events", "Osaka Bay"]} />

      {/* spaces */}
      <section className="sec aura !pt-[clamp(60px,8vw,120px)]">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="kicker rv">Spaces</p>
            <h2 className="display sec-title rv mt-4" style={d(".1s")}>{h.spacesTitle}</h2>
          </div>
          <p className="rv max-w-md text-white/70" style={d(".2s")}>{h.spacesLead}</p>
        </div>
        <SpacesIndex lang={lang} />
      </section>

      {/* lights on: scrolling turns the dark dome into its full colour illumination */}
      <section className="lights" data-lights>
        <div className="lights-stick">
          <img {...responsive(asset("/images/ai-aerial-color.jpg"))} alt="" className="lights-img" />
          <div className="lights-text">
            <p className="kicker">{h.window.kicker}</p>
            <h2 className="display sec-title mt-5">
              <span className="lights-before">{h.lights.before}</span>
              <span className="lights-after">{h.lights.after}</span>
            </h2>
            <p className="lights-after mx-auto mt-6 max-w-xl text-white/80">{h.window.body}</p>
          </div>
        </div>
      </section>

      {/* programme: event types slide sideways while scrolling (swipe on phones) */}
      <section className="hscroll" data-hscroll>
        <div className="hscroll-stick">
          <div className="hscroll-head">
            <p className="kicker rv">Programme</p>
            <h2 className="display sec-title rv mt-4" style={d(".1s")}>{h.programmeTitle}</h2>
          </div>
          <ol className="hscroll-track">
            {t.events.types.map((e, i) => (
              <li key={e.no} className="hs-card">
                <div className="hs-photo frame rv-img"><img {...responsive(TYPE_IMAGES[i], "(min-width: 1020px) 30vw, 80vw")} alt="" loading="lazy" /><span className="hs-no display" aria-hidden="true">{e.no}</span></div>
                <p className="caption">{e.en}</p>
                <h3 className="display mt-3 text-[clamp(26px,2.6vw,40px)]">{e.title}</h3>
                <p className="mt-5 text-sm leading-[2] text-white/65">{e.body}</p>
              </li>
            ))}
            <li className="hs-card hs-end">
              <Link href={path(lang, "events")} className="link-arrow">{t.common.more} <span>→</span></Link>
            </li>
          </ol>
        </div>
      </section>

      {/* relaunch: the date, full screen */}
      <section className="relaunch aura">
        <p className="kicker rv">Re:Start</p>
        <p className="display relaunch-date rv" style={{ ...d(".1s"), backgroundImage: `url(${asset("/images/ai-aerial-color-1600.webp")})` }}>{h.relaunch.date}</p>
        <h2 className="display rv mt-6 text-[clamp(24px,2.6vw,40px)]" style={d(".2s")}>{h.relaunch.title}</h2>
        <p className="rv mx-auto mt-6 max-w-xl text-white/70" style={d(".3s")}>{h.relaunch.body}</p>
        <Link href={path(lang, "contact")} className="btn btn-accent rv mt-10" style={d(".4s")}>{h.relaunch.cta} →</Link>
      </section>

      {/* visit: one row, photo and text */}
      <section className="visit-row">
        <div className="frame rv-img visit-photo"><img {...responsive(asset("/images/ai-promenade.jpg"), "(min-width: 1024px) 50vw, 100vw")} alt="" loading="lazy" /></div>
        <div className="visit-text">
          <p className="kicker rv">Visit</p>
          <h2 className="display sec-title rv mt-4" style={d(".1s")}>{h.visitTitle}</h2>
          <p className="rv mt-6 max-w-md text-white/70" style={d(".2s")}>{h.visitBody}</p>
          <Link href={path(lang, "visit")} className="link-arrow rv mt-10" style={d(".3s")}>{t.common.more} <span>→</span></Link>
        </div>
      </section>

      <FeedSection lang={lang} manual={feed(lang)} limit={3} />

      <ContactBand lang={lang} />
    </Shell>
  );
}

/* ======================= ABOUT ======================= */
export function AboutPage({ lang }: { lang: Lang }) {
  const a = content[lang].about;
  return (
    <Shell lang={lang} page="about">
      <PageHero hero={a.hero} index="02" />
      <Marquee words={["Museum", "Architecture", "Light", "Osaka Bay"]} />
      {a.chapters.map((c) => (
        <article key={c.no} className="chapter">
          <div className="chapter-band frame rv-img">
            <img {...responsive(c.image)} alt="" loading="lazy" />
            <span className="chapter-no display" aria-hidden="true">{c.no}</span>
          </div>
          <div className="chapter-text">
            <h2 className="display rv text-[clamp(30px,3.6vw,56px)] leading-tight">{c.title}</h2>
            <p className="rv text-white/70" style={d(".12s")}>{c.body}</p>
          </div>
        </article>
      ))}
      <WindowFilm kicker="Vision" title={a.quote} image={asset("/images/dome-3.jpg")} />
      <ContactBand lang={lang} />
    </Shell>
  );
}

/* ======================= SPACES ======================= */
export function SpacesPage({ lang }: { lang: Lang }) {
  const t = content[lang];
  const s = t.spaces;
  return (
    <Shell lang={lang} page="spaces">
      <PageHero hero={s.hero} index="03" />
      <Marquee words={content.en.spaces.spaces.map((x) => x.name)} />
      {s.spaces.map((sp) => (
        <section key={sp.no} className="plate">
          <div className="plate-photo frame rv-img">
            <img {...responsive(sp.image)} alt={sp.name} loading="lazy" />
            <div className="plate-title">
              <p className="caption">{sp.no} · {sp.en}</p>
              <h2 className="display">{sp.name}</h2>
            </div>
            <p className="plate-cap display" aria-hidden="true">{sp.capacity}</p>
          </div>
          <dl className="plate-specs">
            <div className="rv">
              <dt className="kicker">{s.capacityLabel}</dt>
              <dd className="display mt-3 text-[clamp(30px,3vw,44px)]">{sp.capacity}<small className="ml-2 text-sm text-white/50">{t.common.guests}</small></dd>
            </div>
            <div className="rv" style={d(".1s")}>
              <dt className="kicker">{s.usesLabel}</dt>
              <dd className="mt-4 flex flex-wrap gap-2">
                {sp.uses.map((u) => <span key={u} className="chip">{u}</span>)}
              </dd>
            </div>
            <div className="rv" style={d(".2s")}>
              <dt className="sr-only">{sp.name}</dt>
              <dd className="text-white/70">{sp.body}</dd>
            </div>
          </dl>
        </section>
      ))}
      <WindowFilm kicker="Combination" title={s.combineTitle} body={s.combineBody} image={asset("/images/dome-1.jpg")} />
      <ContactBand lang={lang} />
    </Shell>
  );
}

/* ======================= EVENTS ======================= */
export function EventsPage({ lang }: { lang: Lang }) {
  const e = content[lang].events;
  return (
    <Shell lang={lang} page="events">
      <PageHero hero={e.hero} video={asset("/videos/hero.mp4")} index="04" />
      <Marquee words={content.en.events.types.map((x) => x.title)} />
      <section className="sec">
        <div className="type-grid">
          {e.types.map((ty, i) => (
            <article key={ty.no} className="hs-card rv" style={d(`${i * 0.08}s`)}>
              <div className="hs-photo frame rv-img"><img {...responsive(TYPE_IMAGES[i], "(min-width: 1020px) 45vw, 100vw")} alt="" loading="lazy" /><span className="hs-no display" aria-hidden="true">{ty.no}</span></div>
              <p className="caption">{ty.en}</p>
              <h2 className="display mt-3 text-[clamp(26px,2.6vw,40px)]">{ty.title}</h2>
              <p className="mt-5 text-sm leading-[2] text-white/65">{ty.body}</p>
            </article>
          ))}
        </div>
      </section>
      <FeedSection lang={lang} manual={feed(lang, "event")} kind="event" />
      <section className="sec flow aura">
        <div className="flow-head">
          <p className="kicker rv">Flow</p>
          <h2 className="display sec-title rv mt-4" style={d(".1s")}>{e.flowTitle}</h2>
        </div>
        <ol className="flow-steps">
          {e.flow.map((f, i) => (
            <li key={f.no} className="rv" style={d(`${i * 0.1}s`)}>
              <span className="flow-no display">{f.no}</span>
              <div>
                <h3 className="display text-[clamp(22px,2vw,30px)]">{f.title}</h3>
                <p className="mt-3 text-sm leading-[2] text-white/65">{f.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <ContactBand lang={lang} />
    </Shell>
  );
}

/* ======================= VISIT ======================= */
export function VisitPage({ lang }: { lang: Lang }) {
  const t = content[lang];
  const v = t.visit;
  return (
    <Shell lang={lang} page="visit">
      <PageHero hero={v.hero} index="05" />
      <Marquee words={["Nanko", "Osaka Bay", "Cosmosquare", "Access"]} />
      <section className="sec info-grid aura">
        <div className="rv">
          <h2 className="kicker">{v.hoursTitle}</h2>
          <p className="display info-value">{v.hours}</p>
          <p className="mt-4 text-sm text-white/60">{v.hoursNote}</p>
          <span className="chip mt-5 inline-block">{t.common.pending}</span>
        </div>
        <div className="rv" style={d(".1s")}>
          <h2 className="kicker">{v.addressTitle}</h2>
          <p className="display info-value">{v.address[0]}<br />{v.address[1]}</p>
          <ul className="mt-6 text-sm text-white/65">{v.trains.map((x) => <li key={x} className="border-t border-white/10 py-3">{x}</li>)}</ul>
        </div>
        <div className="rv" style={d(".2s")}>
          <h2 className="kicker">{v.timesTitle}</h2>
          <ul className="times">
            {v.times.map((x) => (
              <li key={x.from}><span>{x.from}</span><i aria-hidden="true" /><b>{x.time}</b></li>
            ))}
          </ul>
        </div>
      </section>
      <WindowFilm kicker="Osaka Bay" title={v.window.title} body={v.window.body} image={asset("/images/ai-aerial-gold.jpg")} />
      <section className="grid md:grid-cols-2">
        <div className="map-frame">
          <iframe title="Map" src={MAP_EMBED} loading="lazy" className="h-full min-h-[460px] w-full border-0" />
        </div>
        <div className="sec bg-coal">
          <p className="kicker rv">{v.parkingTitle}</p>
          <p className="rv mt-6 max-w-md text-white/75" style={d(".1s")}>{v.parking}</p>
          <a href={PARKING_URL} target="_blank" rel="noopener" className="btn btn-line rv mt-8" style={d(".2s")}>{v.parkingLink} ↗</a>
          <figure className="rv mt-10" style={d(".3s")}>
            <img src={asset("/images/parking-atc.png")} alt={v.parkingAtc} loading="lazy" className="w-full" />
            <figcaption className="caption mt-3">{v.parkingAtc}</figcaption>
          </figure>
        </div>
      </section>
      <section className="sec">
        <p className="kicker rv">{v.routesTitle}</p>
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-2">
          {v.routes.map((r, i) => (
            <RouteChart key={r.caption} route={r} end={v.routeEnd} delay={i * 0.12} />
          ))}
        </div>
        <p className="caption rv mt-8">{v.routeEnd.note}</p>
      </section>
      <ContactBand lang={lang} />
    </Shell>
  );
}

/** Train route chart drawn in HTML: each path's lines and stations, joined at Cosmosquare, then the walk. */
function RouteChart({ route, end, delay }: { route: Content["visit"]["routes"][number]; end: Content["visit"]["routeEnd"]; delay: number }) {
  return (
    <figure className="route rv" style={d(`${delay}s`)}>
      <figcaption className="display text-2xl">{route.caption}</figcaption>
      <div className="route-paths" style={{ gridTemplateColumns: `repeat(${route.paths.length}, 1fr)` }}>
        {route.paths.map((path, i) => (
          <div key={i} className="route-path">
            <span className="route-stop route-start">{path.from}</span>
            {path.legs.map((leg) => (
              <Fragment key={leg.line + leg.min}>
                <span className="route-leg" style={{ "--c": leg.color } as React.CSSProperties}>
                  <span>{leg.line}<b>{leg.min}</b></span>
                </span>
                {leg.to && <span className="route-stop">{leg.to}</span>}
              </Fragment>
            ))}
          </div>
        ))}
      </div>
      <span className="route-stop route-cosmo">{end.station}</span>
      <span className="route-walk">{end.walk}</span>
      <span className="route-stop route-goal">THE JEWELRY</span>
    </figure>
  );
}

/** Full page for a manual news item (static, one per item). */
export function FeedDetailPage({ lang, item }: { lang: Lang; item: FeedItem }) {
  const n = content[lang].news;
  return (
    <Shell lang={lang} page="news">
      <PageHero hero={{ kicker: n.labels[item.kind], title: item.title, lead: item.date, image: item.image }} />
      <FeedBody lang={lang} item={item} />
      <ContactBand lang={lang} />
    </Shell>
  );
}

/** Full page for an Instagram post (/news/post/?id=…), filled in the browser from posts.json. */
export function IgPostPage({ lang }: { lang: Lang }) {
  return (
    <Shell lang={lang} page="news">
      <IgPostDetail lang={lang} />
      <ContactBand lang={lang} />
    </Shell>
  );
}

/* ======================= NEWS ======================= */
export function NewsPage({ lang }: { lang: Lang }) {
  const n = content[lang].news;
  return (
    <Shell lang={lang} page="news">
      <PageHero hero={n.hero} index="06" />
      <Marquee words={["News", "Instagram", "@thejewelry_official"]} />
      <FeedSection lang={lang} manual={feed(lang)} all />
      <ContactBand lang={lang} />
    </Shell>
  );
}

/* ======================= CONTACT ======================= */
export function ContactPage({ lang }: { lang: Lang }) {
  const c = content[lang].contact;
  return (
    <Shell lang={lang} page="contact">
      <PageHero hero={c.hero} index="07" />
      <Marquee words={["Let's talk", "Exhibitions", "Events", "Receptions"]} />
      <section className="sec contact-layout aura">
        <aside className="contact-aside">
          <p className="display rv text-[clamp(24px,2.4vw,34px)] leading-snug">{c.intro}</p>
          <div className="dm-card rv" style={d(".1s")}>
            <h2 className="display text-2xl">{c.dmTitle}</h2>
            <p className="mt-3 text-sm text-white/65">{c.dmBody}</p>
            <a href={IG_URL} target="_blank" rel="noopener" className="btn btn-line mt-6">Instagram DM ↗</a>
          </div>
        </aside>
        <ContactForm lang={lang} />
      </section>
    </Shell>
  );
}
