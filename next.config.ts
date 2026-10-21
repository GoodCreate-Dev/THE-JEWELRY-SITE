import type { NextConfig } from "next";

// GITHUB_PAGES=1 builds a static copy for https://anamul009.github.io/the-jewelry/.
// Static export cannot run with Cache Components, so it is switched off for that build.
const pages = process.env.GITHUB_PAGES === "1";
const basePath = pages ? "/the-jewelry" : "";

const nextConfig: NextConfig = {
  cacheComponents: !pages,
  partialPrefetching: !pages,
  trailingSlash: true,
  ...(pages && { output: "export", basePath, images: { unoptimized: true } }),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
