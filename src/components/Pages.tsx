/* eslint-disable @next/next/no-img-element -- local photos, sized by CSS */
import Link from "next/link";
import { Fragment } from "react";
import { asset, content, EVENT_IDS, FORM_ID, IG_URL, MAP_EMBED, PARKING_URL, path, SPACE_IDS, type Content, type Lang } from "@/content/site";
import { ContactForm } from "./ContactForm";
import { MapEmbed } from "./MapEmbed";
import { feed, type FeedItem } from "@/lib/feed";
import { responsive } from "@/lib/img";
import { FeedBody, FeedSection, IgPostDetail } from "./Feed";
import { Band, ContactBand, Marquee, PageHero, Shell, WindowFilm } from "./Shared";

const d = (s: string) => ({ "--d": s }) as React.CSSProperties;

/* ======================= ABOUT ======================= */
export function AboutPage({ lang }: { lang: Lang }) {
  const a = content[lang].about;
  return (
    <Shell lang={lang} page="about">
      <PageHero hero={a.hero} index="02" />
      <Marquee words={["Museum", "Architecture", "Light", "Osaka Bay"]} />
      {a.chapters.map((c, i) => (
        <Band key={c.no} no={c.no} kicker={`Chapter ${c.no}`} title={c.title} body={c.body} image={c.image} rev={i % 2 === 1} />
      ))}
      <WindowFilm kicker="Vision" title={a.quote} image={asset("/images/about-vision.jpg")} />
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
      {s.spaces.map((sp, i) => (
        <Band key={sp.no} id={SPACE_IDS[i]} no={sp.no.replace("Pl. ", "")} kicker={`${sp.no} · ${sp.en}`} title={sp.name} body={sp.body} image={sp.image} rev={i % 2 === 1}>
          <dl className="specs" data-reveal>
            <div>
              <dt>{s.capacityLabel}</dt>
              <dd className="specs-big">{sp.capacity}<small>{t.common.guests}</small></dd>
            </div>
            <div>
              <dt>{s.usesLabel}</dt>
              <dd><ul className="uses">{sp.uses.map((u) => <li key={u}>{u}</li>)}</ul></dd>
            </div>
          </dl>
        </Band>
      ))}
      <WindowFilm kicker="Combination" title={s.combineTitle} body={s.combineBody} image={asset("/images/spaces-combine.jpg")} />
      <ContactBand lang={lang} />
    </Shell>
  );
}

/* ======================= EVENTS ======================= */
export function EventsPage({ lang }: { lang: Lang }) {
  const t = content[lang];
  const e = t.events;
  return (
    <Shell lang={lang} page="events">
      <PageHero hero={e.hero} index="04" />

      {/* intro and enquiry */}
      <section className="lead-sec">
        <p className="kicker" data-reveal>{e.hero.kicker}</p>
        <h2 className="display lead-title" data-split>{e.intro.title}</h2>
        <div className="lead-side">
          <p className="h-body" data-reveal>{e.intro.body}</p>
          <Link href={`${path(lang, "contact")}#${FORM_ID}`} className="btn btn-line magnetic" data-reveal>{e.intro.cta}<i className="btn-arrow" /></Link>
        </div>
      </section>

      {/* one band per event type: main photo, text, two more photos and the key facts */}
      {e.types.map((ty, i) => (
        <Band key={ty.no} id={EVENT_IDS[i]} no={ty.no} kicker={`${ty.no} — ${ty.en}`} title={ty.title} body={<><p>{ty.body}</p><p>{ty.more}</p></>} image={ty.images[0]} rev={i % 2 === 1}>
          <div className="thumbs" data-reveal aria-hidden="true">
            {ty.images.slice(1).map((src) => <span key={src} className="thumb"><img {...responsive(src, "16vw")} alt="" loading="lazy" /></span>)}
          </div>
          <dl className="facts" data-reveal>
            {ty.facts.map((f) => (
              <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
            ))}
          </dl>
          <p className="pending" data-reveal>{t.common.pending}</p>
        </Band>
      ))}

      {/* the spaces, as tall cards */}
      <section className="cats-head">
        <p className="kicker" data-reveal>Spaces</p>
        <h2 className="display h-title" data-split>{e.spacesTitle}</h2>
        <Link href={path(lang, "spaces")} className="h-link" data-reveal>{t.common.more}<i className="btn-arrow" /></Link>
      </section>
      <section className="cats cats-3" aria-label={e.spacesTitle}>
        {t.spaces.spaces.map((sp, i) => (
          <Link key={sp.no} href={`${path(lang, "spaces")}#${SPACE_IDS[i]}`} className="cat" data-cursor="view">
            <span className="cat-img"><img {...responsive(sp.image, "(min-width: 1025px) 33vw, 50vw")} alt="" loading="lazy" /></span>
            <span className="cat-text">
              <span className="cat-no">{sp.no}</span>
              <span className="cat-en">{sp.en}</span>
              <span className="cat-title">{sp.name} · {sp.capacity}{t.common.guests}</span>
              <span className="cat-body">{sp.body}</span>
              <i className="btn-arrow" />
            </span>
          </Link>
        ))}
      </section>

      <FeedSection lang={lang} manual={feed(lang, "event")} kind="event" />

      {/* how booking works: four numbered steps along a gold line */}
      <section className="flow2">
        <div className="flow2-head">
          <p className="kicker" data-reveal>Flow</p>
          <h2 className="display h-title" data-split>{e.flowTitle}</h2>
        </div>
        <ol className="flow2-steps">
          {e.flow.map((f) => (
            <li key={f.no} data-reveal>
              <span className="flow2-no">{f.no}</span>
              <h3 className="display flow2-title">{f.title}</h3>
              <p>{f.body}</p>
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

      {/* hours, address, travel times */}
      <section className="facts3">
        <div data-reveal>
          <h2 className="kicker">{v.hoursTitle}</h2>
          <p className="facts3-value">{v.hours}</p>
          <p className="facts3-note">{v.hoursNote}</p>
          <p className="pending">{t.common.pending}</p>
        </div>
        <div data-reveal>
          <h2 className="kicker">{v.addressTitle}</h2>
          <p className="facts3-value facts3-address">{v.address[0]}<br />{v.address[1]}</p>
          <ul className="facts3-list">{v.trains.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div data-reveal>
          <h2 className="kicker">{v.timesTitle}</h2>
          <ul className="times2">
            {v.times.map((x) => (
              <li key={x.from}><span>{x.from}</span><i aria-hidden="true" /><b>{x.time}</b></li>
            ))}
          </ul>
        </div>
      </section>

      <WindowFilm kicker="Osaka Bay" title={v.window.title} body={v.window.body} image={asset("/images/visit-bay.jpg")} />

      {/* map and parking */}
      <section className="access2">
        <MapEmbed src={MAP_EMBED} title="Map" />
        <div className="access2-text">
          <p className="kicker" data-reveal>{v.parkingTitle}</p>
          <p className="h-body" data-reveal>{v.parking}</p>
          <a href={PARKING_URL} target="_blank" rel="noopener" className="btn btn-line magnetic" data-reveal>{v.parkingLink}<i className="btn-arrow" /></a>
          <figure className="access2-fig" data-reveal>
            <img src={asset("/images/parking-atc.png")} alt={v.parkingAtc} width={1200} height={780} loading="lazy" />
            <figcaption>{v.parkingAtc}</figcaption>
          </figure>
        </div>
      </section>

      {/* train routes */}
      <section className="routes2">
        <p className="kicker" data-reveal>{v.routesTitle}</p>
        <div className="routes2-grid">
          {v.routes.map((r, i) => (
            <RouteChart key={r.caption} route={r} end={v.routeEnd} delay={i * 0.12} />
          ))}
        </div>
        <p className="facts3-note" data-reveal>{v.routeEnd.note}</p>
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
      <section className="contact2" id={FORM_ID}>
        <aside className="contact2-aside">
          <p className="kicker" data-reveal>Contact</p>
          <p className="display contact2-intro" data-split>{c.intro}</p>
          <div className="contact2-dm" data-reveal>
            <h2 className="display">{c.dmTitle}</h2>
            <p>{c.dmBody}</p>
            <a href={IG_URL} target="_blank" rel="noopener" className="btn btn-line magnetic">Instagram DM<i className="btn-arrow" /></a>
          </div>
        </aside>
        <ContactForm lang={lang} />
      </section>
    </Shell>
  );
}
