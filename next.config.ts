import type { NextConfig } from "next";

// GitHub Pages serves this repo at username.github.io/nebl-vape/, not at
// the domain root, so the build needs a base path — but only in CI
// (GITHUB_ACTIONS is set there), never for local dev/preview.
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repoName = "nebl-vape";

const basePath = isGithubActions ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath,
  assetPrefix: isGithubActions ? `/${repoName}/` : "",
  // next/image (unoptimized) and plain <img>/<video> tags don't get
  // basePath rewritten into their src automatically — only next/link and
  // the Next-managed _next/static assets do. Expose it so components can
  // prefix hardcoded /public paths themselves (see lib/basePath.ts).
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
