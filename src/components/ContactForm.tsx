"use client";

import { useState, type FormEvent } from "react";
import { content, PRIVACY_URL, type Lang } from "@/content/site";

/** Enquiry form (design sample: validates and shows a notice, does not send yet). */
export function ContactForm({ lang }: { lang: Lang }) {
  const f = content[lang].contact.form;
  const [type, setType] = useState(f.types[0]);
  const [note, setNote] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    setNote(f.sampleNote);
  };

  const input = "mt-2 block w-full border-0 border-b border-black/30 bg-transparent px-0 py-3 text-base text-black outline-none transition focus:border-gold-lo";
  const label = "block text-[11px] tracking-[.18em] text-black/60";
  const req = <span className="ml-2 text-gold-lo">{f.required}</span>;

  return (
    <form onSubmit={onSubmit} className="rv grid gap-8 md:grid-cols-2" noValidate={false}>
      <fieldset className="md:col-span-2">
        <legend className={label}>{f.type}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {f.types.map((t) => (
            <label key={t} className="cursor-pointer">
              <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} className="peer sr-only" />
              <span className="inline-block border border-black/30 px-4 py-2 text-sm transition peer-checked:border-black peer-checked:bg-black peer-checked:text-gold-hi peer-focus-visible:outline peer-focus-visible:outline-2">{t}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className={label}>{f.company}{req}<input name="company" required autoComplete="organization" className={input} /></label>
      <label className={label}>{f.name}{req}<input name="name" required autoComplete="name" className={input} /></label>
      <label className={label}>{f.email}{req}<input name="email" type="email" required autoComplete="email" className={input} /></label>
      <label className={label}>{f.tel}<input name="tel" type="tel" autoComplete="tel" className={input} /></label>
      <label className={label}>{f.date}<input name="date" placeholder={f.datePh} className={input} /></label>
      <label className={label}>{f.guests}<input name="guests" placeholder={f.guestsPh} className={input} /></label>
      <label className={`${label} md:col-span-2`}>{f.message}{req}<textarea name="message" rows={5} required className={`${input} resize-y`} /></label>
      <label className="flex items-center gap-3 text-sm text-black/70 md:col-span-2">
        <input type="checkbox" required className="size-4 accent-black" />
        <span>{f.agree[0]}<a href={PRIVACY_URL} target="_blank" rel="noopener" className="underline underline-offset-4">{f.agree[1]}</a>{f.agree[2]}</span>
      </label>
      <div className="md:col-span-2">
        <button type="submit" className="btn btn-dark w-full md:w-auto">{f.submit} →</button>
        <p className="mt-4 text-sm text-gold-lo" role="status" aria-live="polite">{note}</p>
      </div>
    </form>
  );
}
