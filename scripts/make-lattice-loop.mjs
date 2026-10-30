/**
 * The quiet background film of the home contact section (public/videos/lattice-loop.mp4, 8s,
 * muted): the LED lattice changing colour, from the client's phone clip, in the site's grade
 * (scripts/grade.mjs), fading in and out so the loop restarts softly. Also writes its poster.
 *   node scripts/make-lattice-loop.mjs
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { grade } from "./grade.mjs";

const root = path.resolve(import.meta.dirname, "..");
const clip = path.resolve(root, "..", "pic and vid", "video", "LINE_ALBUM_素材_261028_1.mp4");
const loop = path.join(root, "public", "videos", "lattice-loop.mp4");

execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", "2", "-t", "8", "-i", clip, "-vf",
  `scale=720:-2,${grade({ grain: 3 })},fade=t=in:st=0:d=0.8,fade=t=out:st=7.2:d=0.8`, "-an", "-c:v", "libx264", "-crf", "27", "-preset", "slow",
  "-pix_fmt", "yuv420p", "-movflags", "+faststart", loop], { stdio: "inherit" });
execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", "1.5", "-i", loop, "-frames:v", "1", "-q:v", "4",
  path.join(root, "public", "images", "lattice-loop-poster.jpg")], { stdio: "inherit" });
console.log("lattice-loop.mp4 and its poster written.");
