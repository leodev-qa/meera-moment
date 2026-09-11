import { execSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";

const BUNDLE_URLS = [
  "https://cdn.jsdelivr.net/gh/leodev-qa/meera-moment@main/bundle.tar.gz",
  "https://github.com/leodev-qa/meera-moment/raw/main/bundle.tar.gz",
];

async function ensureBundle() {
  if (existsSync("src/router.tsx")) return;
  if (!existsSync("bundle.tar.gz")) {
    let lastErr;
    for (const url of BUNDLE_URLS) {
      try {
        console.log("downloading", url);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${url} -> ${res.status}`);
        writeFileSync("bundle.tar.gz", Buffer.from(await res.arrayBuffer()));
        lastErr = null;
        break;
      } catch (err) {
        lastErr = err;
      }
    }
    if (lastErr) throw lastErr;
  }
  console.log("extracting bundle.tar.gz");
  execSync("tar -xzf bundle.tar.gz", { stdio: "inherit" });
}

await ensureBundle();
execSync("node scripts/fetch-assets.mjs", { stdio: "inherit" });
execSync("npx vite build", { stdio: "inherit", env: process.env });
