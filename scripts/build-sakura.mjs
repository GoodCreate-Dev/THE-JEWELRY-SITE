/**
 * Builds the site for the Sakura rental server and puts everything to upload in
 * deploy/sakura/www/ (upload its contents into the server's www folder):
 *   - static export served from the domain root (no GitHub sub-path)
 *   - instagram/ with the PHP fetch scripts (config.php needs the token on the server)
 *   - .htaccess: HTTPS redirect and the site's own 404 page
 * Usage:  node scripts/build-sakura.mjs [https://the-jewelry.sakura.ne.jp]
 * Web3Forms key: set NEXT_PUBLIC_WEB3FORMS_KEY before running, or the form reports a failure.
 */
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
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
  env: { ...process.env, GITHUB_PAGES: "1", PAGES_BASE_PATH: "", SITE_URL: siteUrl },
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

// Sakura sits behind a proxy: plain-HTTP requests arrive without X-Sakura-Forwarded-For.
writeFileSync(
  path.join(www, ".htaccess"),
  `ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTP:X-Sakura-Forwarded-For} ^$
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
</IfModule>
`,
);

if (!existsSync(path.join(www, "index.html"))) throw new Error("Build output missing index.html");
console.log(`\nReady to upload: ${www}\nSite URL: ${siteUrl}`);
