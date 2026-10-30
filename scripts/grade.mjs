/**
 * One colour grade for every site photo and film, so phone shots from different nights read as
 * one shoot: gentle noise reduction, slightly lifted blacks and softened highlights, cool teal
 * shadows and warm champagne highlights, a touch less saturation, light sharpening, a soft
 * vignette and fine grain. The same ffmpeg filter chain is used for stills and video
 * (scripts/make-lattice-loop.mjs uses grade()), so they match exactly.
 *
 * Originals are kept in photo-originals/ (outside public/, never published); grading always
 * starts again from them, so the script can be re-run after changing the grade.
 *   node scripts/grade.mjs                 grade every site photo (PHOTOS)
 *   node scripts/grade.mjs --preview a b   write graded copies of a.jpg, b.jpg to photo-preview/
 * Then: node scripts/make-image-sizes.mjs (graded photos get fresh WebP sizes).
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const images = path.join(root, "public", "images");
const originals = path.join(root, "photo-originals");

/** Shared grade (ffmpeg -vf). `still` adds per-frame grain; video uses moving grain (`grain`: strength). */
export function grade({ still = false, grain = 5, denoise = "hqdn3d=2.5:2.5:3:3" } = {}) {
  return [
    denoise,
    "eq=contrast=1.05:saturation=0.9:gamma=1.07",
    "curves=all='0/0.035 0.25/0.225 0.5/0.5 0.75/0.775 1/0.965'",
    "colorbalance=rs=-0.035:gs=0.005:bs=0.05:rm=0.015:bm=-0.015:rh=0.05:gh=0.025:bh=-0.045",
    "unsharp=5:5:0.55:5:5:0",
    "vignette=angle=PI/7:mode=forward",
    still ? `noise=alls=${grain}:allf=u` : `noise=alls=${grain}:allf=t+u`,
  ].join(",");
}

/** Every site photo is graded (originals move to photo-originals/), except: */
const SKIP = new Set([
  "lattice-loop-poster", // a frame of a film that is already graded
  "ai-front", // not used by the site
  // home images chosen by the client: their own colours, as supplied
  "hero-stage", "home-event", "home-dome", "home-lounge",
]);
export const PHOTOS = readdirSync(images).filter((f) => f.endsWith(".jpg")).map((f) => f.slice(0, -4)).filter((n) => !SKIP.has(n));

function run(src, out) {
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", src, "-vf", grade({ still: true }), "-q:v", "2", out]);
}

if (process.argv[1] === import.meta.filename) {
  mkdirSync(originals, { recursive: true });
  const preview = process.argv.indexOf("--preview");
  if (preview > 0) {
    const out = path.join(root, "photo-preview");
    mkdirSync(out, { recursive: true });
    for (const name of process.argv.slice(preview + 1)) {
      const src = existsSync(path.join(originals, `${name}.jpg`)) ? path.join(originals, `${name}.jpg`) : path.join(images, `${name}.jpg`);
      run(src, path.join(out, `${name}.jpg`));
    }
    console.log(`Previews in photo-preview/.`);
  } else {
    for (const name of PHOTOS) {
      const orig = path.join(originals, `${name}.jpg`);
      if (!existsSync(orig)) copyFileSync(path.join(images, `${name}.jpg`), orig);
      run(orig, path.join(images, `${name}.jpg`));
      // stale WebP sizes of the ungraded photo
      const sized = new RegExp(`^${name}-\\d+\\.webp$`);
      for (const f of readdirSync(images)) if (sized.test(f)) rmSync(path.join(images, f));
    }
    console.log(`Graded ${PHOTOS.length} photos.`);
  }
}
