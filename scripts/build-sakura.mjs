/**
 * Builds the site for the Sakura rental server and puts everything to upload in
 * deploy/sakura/www/ (upload its contents into the server's www folder):
 *   - static export served from the domain root (no GitHub sub-path)
 *   - instagram/ with the PHP fetch scripts (config.php needs the token on the server)
 *   - api/contact.php, which emails the contact form; the address comes from
 *     deploy/sakura/contact.json  {"to": "name@example.com"}  (not in git)
 *   - .htaccess: HTTPS redirect and the site's own 404 page
 * Usage:  node scripts/build-sakura.mjs [https://the-jewelry.sakura.ne.jp]
 */
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const siteUrl = process.argv[2] ?? "https://the-jewelry.sakura.ne.jp";
const root = path.resolve(import.meta.dirname, "..");
const www = path.join(root, "deploy", "sakura", "www");

// fs.cpSync crashes Node 24 on this Windows setup, so copy folders by hand.
function copyDir(from, to) {
  mkdirSync(to, { recursive: true });
  for (const e of readdirSync(from, { withFileTypes: true })) {
    const [a, b] = [path.join(from, e.name), path.join(to, e.name)];
    if (e.isDirectory()) copyDir(a, b);
    else copyFileSync(a, b);
  }
}

execSync("npx next build", {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, GITHUB_PAGES: "1", PAGES_BASE_PATH: "", SITE_URL: siteUrl, NEXT_PUBLIC_CONTACT_ENDPOINT: "/api/contact.php" },
});

rmSync(www, { recursive: true, force: true });
mkdirSync(path.dirname(www), { recursive: true });
copyDir(path.join(root, "out"), www);

// Instagram: PHP scripts only. posts.json / images/ are written on the server by fetch.php;
// an empty list is shipped so the first visit before the first cron run is not a 404.
const ig = path.join(www, "instagram");
rmSync(ig, { recursive: true, force: true });
mkdirSync(ig, { recursive: true });
for (const f of ["config.php", "fetch.php", "refresh.php", ".htaccess"]) copyFileSync(path.join(root, "server", "instagram", f), path.join(ig, f));
writeFileSync(path.join(ig, "posts.json"), "[]\n");

// Contact form mailer, with the receiving address written into its config.
const api = path.join(www, "api");
mkdirSync(api, { recursive: true });
for (const f of ["contact.php", ".htaccess"]) copyFileSync(path.join(root, "server", "contact", f), path.join(api, f));
const settings = path.join(root, "deploy", "sakura", "contact.json");
const to = existsSync(settings) ? JSON.parse(readFileSync(settings, "utf8")).to : "";
if (!/^[^\s@'"]+@[^\s@'"]+\.[^\s@'"]+$/.test(to ?? "")) console.warn("\nWARNING: no valid address in deploy/sakura/contact.json - the form will report a failure.");
writeFileSync(
  path.join(api, "config.php"),
  readFileSync(path.join(root, "server", "contact", "config.php"), "utf8").replace("'PASTE_EMAIL_HERE'", `'${to || "PASTE_EMAIL_HERE"}'`),
);

// Sakura sits behind a proxy: plain-HTTP requests arrive without X-Sakura-Forwarded-For.
writeFileSync(
  path.join(www, ".htaccess"),
  `ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
RewriteEngine On
# Not for the 404 page itself (Apache fetches it internally; Sakura marks every request as
# internal, so REDIRECT_STATUS cannot tell them apart).
RewriteCond %{REQUEST_URI} !^/404\.html$
RewriteCond %{HTTP:X-Sakura-Forwarded-For} ^$
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
</IfModule>
`,
);

if (!existsSync(path.join(www, "index.html"))) throw new Error("Build output missing index.html");
console.log(`\nReady to upload: ${www}\nSite URL: ${siteUrl}`);
