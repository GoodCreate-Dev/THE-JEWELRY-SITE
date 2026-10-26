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

export function HomePage({ lang }: { lang: Lang }) {
  const t = content[lang];
  const h = t.home;
  return (
    <Shell lang={lang} page="home">
      {/* hero */}
      <section className="hero" data-hero>
        <div className="hero-img">
          <HeroLive src={asset("/images/ai-front.jpg")} />
        </div>
        <div className="hero-veil" />
        <div className="hero-lines" aria-hidden="true"><i /><i /></div>
        <div className="hero-inner hero-drift">
          <span className="logo rv w-[clamp(109px,10.4vw,161px)]" />
          <p className="kicker rv" style={d(".15s")}>{h.kicker}</p>
          <h1 className="display rv letters" style={d(".3s")} aria-label={h.title.join(" ")}>
            <span aria-hidden="true"><SplitText text={h.title[0]} /></span>
            <span aria-hidden="true" className="text-gold-hi"><SplitText text={h.title[1]} start={h.title[0].length + 2} /></span>
          </h1>
          <p className="hero-lead rv" style={d(".45s")}>{h.lead}</p>
          <div className="hero-actions rv" style={d(".6s")}>
            <Link href={path(lang, "contact")} className="btn btn-gold">{h.ctaPrimary}</Link>
            <Link href={path(lang, "spaces")} className="btn btn-line">{h.ctaSecondary}</Link>
          </div>
        </div>
        <p className="hero-caption caption rv" style={d(".8s")}><b>THE JEWELRY</b><br />{h.caption}</p>
        <span className="hero-scroll" aria-hidden="true">Scroll</span>
      </section>

      {/* story */}
      <section className="sec light">
        <div className="split">
          <p className="kicker rv">{h.statementLabel}</p>
          <div>
            <h2 className="display sec-title rv">{h.statement}</h2>
            <p className="rv mt-8 max-w-2xl text-black/70" style={d(".12s")}>{h.statementBody}</p>
            <div className="rv mt-16 grid grid-cols-3 border-t border-black/80" style={d(".24s")}>
              {h.figures.map((f) => (
                <div key={f.label} className="border-r border-black/10 py-8 pr-4 last:border-r-0 [&:not(:first-child)]:pl-6">
                  <p className="display whitespace-nowrap text-[clamp(28px,4.4vw,68px)] leading-none text-gold-lo">
                    {f.value}<small className="ml-1 text-base">{f.unit}</small>
                  </p>
                  <p className="mt-3 text-xs tracking-[.14em] text-black/60">{f.label}</p>
                </div>
              ))}
            </div>
            <Link href={path(lang, "about")} className="link-arrow rv mt-12 !text-gold-lo" style={d(".3s")}>{t.common.more} <span>→</span></Link>
          </div>
        </div>
      </section>

      <Marquee words={["Museum", "Exhibitions", "Events", "Osaka Bay"]} />

      {/* spaces */}
      <section className="sec !pt-[clamp(60px,8vw,120px)]">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="kicker rv">Spaces</p>
            <h2 className="display sec-title rv mt-4" style={d(".1s")}>{h.spacesTitle}</h2>
          </div>
          <p className="rv max-w-md text-white/70" style={d(".2s")}>{h.spacesLead}</p>
        </div>
        <SpacesIndex lang={lang} />
      </section>

      {/* the bay film opens from a framed window to full screen while scrolling */}
      <WindowFilm kicker={h.window.kicker} title={h.window.title} body={h.window.body} image={asset("/images/ai-aerial-color.jpg")} />

      {/* relaunch band */}
      <section className="grid md:grid-cols-[7fr_5fr]">
        <div className="frame rv-img min-h-[420px]"><img {...responsive(asset("/images/dome-2.jpg"), "(min-width: 768px) 58vw, 100vw")} alt="" loading="lazy" /></div>
        <div className="ivory flex flex-col justify-center gap-6 p-[clamp(40px,6vw,96px)]">
          <p className="kicker rv">Re:Start</p>
          <p className="display rv text-[clamp(80px,9vw,156px)] leading-none" style={d(".1s")}>{h.relaunch.date}</p>
          <h2 className="display rv text-[clamp(22px,2.2vw,34px)]" style={d(".2s")}>{h.relaunch.title}</h2>
          <p className="rv text-black/70" style={d(".3s")}>{h.relaunch.body}</p>
          <Link href={path(lang, "contact")} className="btn btn-dark rv self-start" style={d(".4s")}>{h.relaunch.cta} →</Link>
        </div>
      </section>

      {/* programme */}
      <section className="sec">
        <div className="split">
          <p className="kicker rv">Programme</p>
          <div>
            <h2 className="display sec-title rv">{h.programmeTitle}</h2>
            <ol className="mt-12 border-t border-gold/50">
              {t.events.types.map((e, i) => (
                <li key={e.no} className="rv grid grid-cols-[60px_1fr] gap-x-6 border-b border-white/10 py-7 md:grid-cols-[70px_1.1fr_1.6fr]" style={d(`${i * 0.08}s`)}>
                  <span className="display text-xl text-gold">{e.no}</span>
                  <h3 className="display text-2xl">{e.title}<small className="mt-1 block font-sans text-[11px] tracking-[.2em] text-white/45">{e.en}</small></h3>
                  <p className="col-start-2 text-sm text-white/65 md:col-start-auto">{e.body}</p>
                </li>
              ))}
            </ol>
            <Link href={path(lang, "events")} className="link-arrow rv mt-12">{t.common.more} <span>→</span></Link>
          </div>
        </div>
      </section>

      {/* visit teaser */}
      <section className="sec light">
        <div className="split">
          <p className="kicker rv">Visit</p>
          <div>
            <h2 className="display sec-title rv">{h.visitTitle}</h2>
            <p className="rv mt-6 max-w-xl text-black/70" style={d(".1s")}>{h.visitBody}</p>
            <Link href={path(lang, "visit")} className="link-arrow rv mt-10 !text-gold-lo" style={d(".2s")}>{t.common.more} <span>→</span></Link>
          </div>
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
      <PageHero hero={a.hero} />
      <Marquee words={["Museum", "Architecture", "Light", "Osaka Bay"]} />
      <section className="sec light">
        {a.chapters.map((c, i) => (
          <article key={c.no} className={`grid items-center gap-[clamp(30px,5vw,90px)] py-[clamp(40px,6vw,80px)] md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <div className="frame rv-img aspect-[4/3]"><img {...responsive(c.image, "(min-width: 768px) 50vw, 100vw")} alt="" loading="lazy" /></div>
            <div>
              <p className="display rv text-5xl text-gold-lo">{c.no}.</p>
              <h2 className="display rv mt-4 text-[clamp(26px,2.8vw,42px)]" style={d(".1s")}>{c.title}</h2>
              <p className="rv mt-6 max-w-lg text-black/70" style={d(".2s")}>{c.body}</p>
            </div>
          </article>
        ))}
      </section>
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
      <PageHero hero={s.hero} />
      <Marquee words={content.en.spaces.spaces.map((x) => x.name)} />
      {s.spaces.map((sp, i) => (
        <section key={sp.no} className={`sec ${i % 2 ? "" : "light"}`}>
          <div className={`grid items-center gap-[clamp(30px,5vw,90px)] md:grid-cols-[7fr_5fr] ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <div className="frame rv-img aspect-[16/11]"><img {...responsive(sp.image, "(min-width: 768px) 58vw, 100vw")} alt={sp.name} loading="lazy" /></div>
            <div>
              <p className="caption rv">{sp.no} ・ {sp.en}</p>
              <h2 className="display sec-title rv mt-3" style={d(".1s")}>{sp.name}</h2>
              <p className="rv mt-6" style={d(".2s")}>{sp.body}</p>
              <dl className="rv mt-10" style={d(".3s")}>
                <div className={`flex justify-between border-t py-4 ${i % 2 ? "border-gold/40" : "border-black/80"}`}>
                  <dt className="text-xs tracking-[.16em] opacity-60">{s.capacityLabel}</dt>
                  <dd className="display text-3xl">{sp.capacity} <small className="text-sm opacity-60">{t.common.guests}</small></dd>
                </div>
                <div className={`border-t border-b py-4 ${i % 2 ? "border-white/15" : "border-black/10"}`}>
                  <dt className="text-xs tracking-[.16em] opacity-60">{s.usesLabel}</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {sp.uses.map((u) => (
                      <span key={u} className={`border px-3 py-1 text-xs ${i % 2 ? "border-white/25" : "border-black/30"}`}>{u}</span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
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
      <PageHero hero={e.hero} video={asset("/videos/hero.mp4")} />
      <Marquee words={content.en.events.types.map((x) => x.title)} />
      <section className="sec light">
        <div className="grid gap-px bg-black/10 md:grid-cols-2">
          {e.types.map((ty, i) => (
            <article key={ty.no} className="rv bg-white p-[clamp(28px,4vw,60px)]" style={d(`${i * 0.08}s`)}>
              <p className="display text-4xl text-gold-lo">{ty.no}</p>
              <h2 className="display mt-6 text-[clamp(26px,2.6vw,40px)]">{ty.title}</h2>
              <p className="mt-1 text-[11px] tracking-[.2em] text-black/45">{ty.en}</p>
              <p className="mt-6 text-black/70">{ty.body}</p>
            </article>
          ))}
        </div>
      </section>
      <FeedSection lang={lang} manual={feed(lang, "event")} kind="event" />
      <section className="sec">
        <div className="split">
          <p className="kicker rv">Flow</p>
          <div>
            <h2 className="display sec-title rv">{e.flowTitle}</h2>
            <ol className="mt-12 grid gap-px bg-gold/30 md:grid-cols-4">
              {e.flow.map((f, i) => (
                <li key={f.no} className="rv bg-black p-7" style={d(`${i * 0.1}s`)}>
                  <p className="display text-3xl text-gold">{f.no}</p>
                  <h3 className="display mt-4 text-xl">{f.title}</h3>
                  <p className="mt-3 text-sm text-white/65">{f.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
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
      <PageHero hero={v.hero} />
      <Marquee words={["Nanko", "Osaka Bay", "Cosmosquare", "Access"]} />
      <section className="sec light">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="rv">
            <h2 className="kicker border-b border-black/80 pb-3">{v.hoursTitle}</h2>
            <p className="display mt-6 text-3xl">{v.hours}</p>
            <p className="mt-4 text-sm text-black/65">{v.hoursNote}</p>
            <span className="mt-4 inline-block border border-gold-lo px-2 py-0.5 text-[11px] text-gold-lo">{t.common.pending}</span>
          </div>
          <div className="rv" style={d(".1s")}>
            <h2 className="kicker border-b border-black/80 pb-3">{v.addressTitle}</h2>
            <p className="display mt-6 text-3xl">{v.address[0]}<br />{v.address[1]}</p>
            <h3 className="kicker mt-10 border-b border-black/20 pb-2">{v.trainsTitle}</h3>
            <ul className="mt-3 text-sm text-black/70">{v.trains.map((x) => <li key={x} className="border-b border-black/10 py-2">{x}</li>)}</ul>
          </div>
          <div className="rv" style={d(".2s")}>
            <h2 className="kicker border-b border-black/80 pb-3">{v.timesTitle}</h2>
            <ul className="mt-4">
              {v.times.map((x) => (
                <li key={x.from} className="flex justify-between gap-4 border-b border-black/10 py-3 text-sm">
                  <span className="text-black/70">{x.from}</span><span className="text-right text-gold-lo">{x.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <WindowFilm kicker="Osaka Bay" title={v.window.title} body={v.window.body} image={asset("/images/ai-aerial-gold.jpg")} />
      <section className="grid md:grid-cols-2">
        <div className="min-h-[420px] grayscale-[.6] invert-[.9] hue-rotate-180">
          <iframe title="Map" src={MAP_EMBED} loading="lazy" className="h-full min-h-[420px] w-full border-0" />
        </div>
        <div className="sec">
          <p className="kicker rv">{v.parkingTitle}</p>
          <p className="rv mt-6 max-w-md text-white/80" style={d(".1s")}>{v.parking}</p>
          <a href={PARKING_URL} target="_blank" rel="noopener" className="btn btn-line rv mt-8" style={d(".2s")}>{v.parkingLink} ↗</a>
          <figure className="rv mt-10" style={d(".3s")}>
            <img src={asset("/images/parking-atc.png")} alt={v.parkingAtc} loading="lazy" className="w-full bg-white" />
            <figcaption className="caption mt-3">{v.parkingAtc}</figcaption>
          </figure>
        </div>
      </section>
      <section className="sec light">
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
      <PageHero hero={n.hero} />
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
      <PageHero hero={c.hero} />
      <Marquee words={["Let's talk", "Exhibitions", "Events", "Receptions"]} />
      <section className="sec light">
        <div className="split">
          <div>
            <p className="rv text-black/75">{c.intro}</p>
            <div className="rv mt-12 border-t border-black/80 pt-6" style={d(".1s")}>
              <h2 className="display text-2xl">{c.dmTitle}</h2>
              <p className="mt-3 text-sm text-black/65">{c.dmBody}</p>
              <a href={IG_URL} target="_blank" rel="noopener" className="btn btn-dark mt-6">Instagram DM</a>
            </div>
          </div>
          <ContactForm lang={lang} />
        </div>
      </section>
    </Shell>
  );
}
