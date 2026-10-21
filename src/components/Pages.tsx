/* eslint-disable @next/next/no-img-element -- local photos, sized by CSS */
import Link from "next/link";
import { asset, content, IG_URL, MAP_EMBED, path, type Lang } from "@/content/site";
import { ContactForm } from "./ContactForm";
import { ContactBand, Ornament, PageHero, Shell } from "./Shared";

const d = (s: string) => ({ "--d": s }) as React.CSSProperties;

/* ======================= HOME ======================= */
export function HomePage({ lang }: { lang: Lang }) {
  const t = content[lang];
  const h = t.home;
  const sp = t.spaces;
  return (
    <Shell lang={lang} page="home">
      {/* hero */}
      <section className="hero">
        <div className="hero-img">
          <img src={asset("/images/dome-1.jpg")} alt="" />
        </div>
        <div className="hero-veil" />
        <div className="hero-lines" aria-hidden="true"><i /><i /></div>
        <div className="hero-inner">
          <span className="logo rv w-[clamp(84px,8vw,124px)]" />
          <p className="kicker rv" style={d(".15s")}>{h.kicker}</p>
          <h1 className="display rv" style={d(".3s")}>
            <span>{h.title[0]}</span>
            <span className="gold-text">{h.title[1]}</span>
          </h1>
          <p className="hero-lead rv" style={d(".45s")}>{h.lead}</p>
          <div className="hero-actions rv" style={d(".6s")}>
            <Link href={path(lang, "contact")} className="btn btn-gold">{h.ctaPrimary}</Link>
            <Link href={path(lang, "spaces")} className="btn btn-line">{h.ctaSecondary}</Link>
          </div>
        </div>
        <p className="hero-caption caption rv" style={d(".8s")}><b>THE JEWELRY</b><br />{h.caption} {t.common.temp}</p>
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

      {/* spaces */}
      <section className="sec">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="kicker rv">Spaces</p>
            <h2 className="display sec-title rv mt-4" style={d(".1s")}>{h.spacesTitle}</h2>
          </div>
          <p className="rv max-w-md text-white/70" style={d(".2s")}>{h.spacesLead}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {sp.spaces.map((s, i) => (
            <Link key={s.no} href={path(lang, "spaces")} className="group rv block" style={d(`${i * 0.12}s`)}>
              <div className={`frame rv-img ${i === 1 ? "aspect-[4/5.4]" : "aspect-[4/5]"}`} style={d(`${i * 0.12}s`)}>
                <img src={s.image} alt={s.name} loading="lazy" />
              </div>
              <div className="mt-5 flex items-baseline justify-between border-b border-gold/40 pb-4">
                <span className="caption">{s.no}</span>
                <h3 className="display text-2xl">{s.name}</h3>
                <span className="display text-2xl">{s.capacity}<small className="ml-1 text-xs text-white/50">{t.common.guests}</small></span>
              </div>
              <p className="mt-4 text-sm text-white/65">{s.body}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* relaunch band */}
      <section className="grid md:grid-cols-[7fr_5fr]">
        <div className="frame rv-img min-h-[420px]"><img src={asset("/images/dome-2.jpg")} alt="" loading="lazy" /></div>
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

      {/* visit + news teaser */}
      <section className="sec light grid gap-16 md:grid-cols-2">
        <div>
          <p className="kicker rv">Visit</p>
          <h2 className="display sec-title rv mt-4">{h.visitTitle}</h2>
          <p className="rv mt-6 max-w-md text-black/70" style={d(".1s")}>{h.visitBody}</p>
          <Link href={path(lang, "visit")} className="link-arrow rv mt-10 !text-gold-lo" style={d(".2s")}>{t.common.more} <span>→</span></Link>
        </div>
        <div>
          <p className="kicker rv">News</p>
          <h2 className="display sec-title rv mt-4">{h.newsTitle}</h2>
          <ul className="rv mt-8 border-t border-black/80" style={d(".1s")}>
            {t.news.items.map((n) => (
              <li key={n.title} className="border-b border-black/10 py-5">
                <Link href={path(lang, "news")} className="grid grid-cols-[100px_1fr] gap-4">
                  <time className="text-xs text-black/50">{n.date}</time>
                  <span className="text-sm">{n.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={path(lang, "news")} className="link-arrow rv mt-10 !text-gold-lo" style={d(".2s")}>{t.common.more} <span>→</span></Link>
        </div>
      </section>

      <ContactBand lang={lang} />
    </Shell>
  );
}

/* ======================= ABOUT ======================= */
export function AboutPage({ lang }: { lang: Lang }) {
  const a = content[lang].about;
  return (
    <Shell lang={lang} page="about">
      <PageHero lang={lang} hero={a.hero} />
      <section className="sec light">
        {a.chapters.map((c, i) => (
          <article key={c.no} className={`grid items-center gap-[clamp(30px,5vw,90px)] py-[clamp(40px,6vw,80px)] md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <div className="frame rv-img aspect-[4/3]"><img src={c.image} alt="" loading="lazy" /></div>
            <div>
              <p className="display rv text-5xl text-gold-lo">{c.no}.</p>
              <h2 className="display rv mt-4 text-[clamp(26px,2.8vw,42px)]" style={d(".1s")}>{c.title}</h2>
              <p className="rv mt-6 max-w-lg text-black/70" style={d(".2s")}>{c.body}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="sec text-center">
        <Ornament className="mx-auto mb-12 max-w-sm rv" />
        <p className={`display rv mx-auto max-w-3xltext-[clamp(28px,3.6vw,56px)] ${lang === "en" ? "italic" : ""}`}>{lang === "en" ? `“${a.quote}”` : `「${a.quote}」`}</p>
      </section>
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
      <PageHero lang={lang} hero={s.hero} />
      {s.spaces.map((sp, i) => (
        <section key={sp.no} className={`sec ${i % 2 ? "" : "light"}`}>
          <div className={`grid items-center gap-[clamp(30px,5vw,90px)] md:grid-cols-[7fr_5fr] ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <div className="frame rv-img aspect-[16/11]"><img src={sp.image} alt={sp.name} loading="lazy" /></div>
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
      <section className="sec ivory text-center">
        <p className="kicker rv">Combination</p>
        <h2 className="display sec-title rv mt-4">{s.combineTitle}</h2>
        <p className="rv mx-auto mt-6 max-w-2xl text-black/70">{s.combineBody}</p>
      </section>
      <ContactBand lang={lang} />
    </Shell>
  );
}

/* ======================= EVENTS ======================= */
export function EventsPage({ lang }: { lang: Lang }) {
  const e = content[lang].events;
  return (
    <Shell lang={lang} page="events">
      <PageHero lang={lang} hero={e.hero} />
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
      <PageHero lang={lang} hero={v.hero} />
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
            <h3 className="kicker mt-10 border-b border-black/20 pb-2">{v.parkingTitle}</h3>
            <p className="mt-3 text-sm text-black/70">{v.parking}</p>
          </div>
        </div>
      </section>
      <section className="grid md:grid-cols-2">
        <div className="min-h-[420px] grayscale-[.6] invert-[.9] hue-rotate-180">
          <iframe title="Map" src={MAP_EMBED} loading="lazy" className="h-full min-h-[420px] w-full border-0" />
        </div>
        <div className="sec">
          <p className="kicker rv">{v.routesTitle}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {v.routes.map((r) => (
              <figure key={r.caption} className="rv bg-white p-4">
                <img src={r.image} alt={r.caption} loading="lazy" className="mx-auto max-h-[360px] w-auto" />
                <figcaption className="caption mt-3 !text-black/60">{r.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <ContactBand lang={lang} />
    </Shell>
  );
}

/* ======================= NEWS ======================= */
export function NewsPage({ lang }: { lang: Lang }) {
  const n = content[lang].news;
  const ig = ["cafe-event.jpg", "dome-5.jpg", "cafe-sunset.jpg", "blue-impulse.jpg", "cafe-open.jpg", "fireworks.jpg"].map((n) => asset(`/images/${n}`));
  return (
    <Shell lang={lang} page="news">
      <PageHero lang={lang} hero={n.hero} />
      <section className="sec light">
        <ul className="border-t border-black/80">
          {n.items.map((it, i) => (
            <li key={it.title} className="rv grid gap-2 border-b border-black/10 py-8 md:grid-cols-[140px_90px_1fr]" style={d(`${i * 0.08}s`)}>
              <time className="text-sm text-black/50">{it.date}</time>
              <span className="text-[11px] tracking-[.2em] text-gold-lo">{it.tag}</span>
              <div>
                <h2 className="display text-[clamp(20px,2vw,28px)]">{it.title}</h2>
                <p className="mt-2 text-sm text-black/65">{it.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="sec">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="kicker rv">@thejewelry_official</p>
            <h2 className="display sec-title rv mt-3">{n.igTitle}</h2>
          </div>
          <a href={IG_URL} target="_blank" rel="noopener" className="link-arrow rv">{n.follow} <span>→</span></a>
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
          {ig.map((src, i) => (
            <a key={src} href={IG_URL} target="_blank" rel="noopener" className="frame rv-img aspect-square" style={d(`${i * 0.06}s`)}>
              <img src={src} alt="" loading="lazy" />
            </a>
          ))}
        </div>
        <p className="caption mt-4">{n.igNote}</p>
      </section>
      <ContactBand lang={lang} />
    </Shell>
  );
}

/* ======================= CONTACT ======================= */
export function ContactPage({ lang }: { lang: Lang }) {
  const c = content[lang].contact;
  return (
    <Shell lang={lang} page="contact">
      <PageHero lang={lang} hero={c.hero} />
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
