import { execSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";

const BUNDLE_URLS = [
  "https://raw.githubusercontent.com/leodev-qa/meera-moment/main/bundle.tar.gz",
  "https://github.com/leodev-qa/meera-moment/raw/main/bundle.tar.gz",
  "https://cdn.jsdelivr.net/gh/leodev-qa/meera-moment@main/bundle.tar.gz",
];

async function ensureBundle() {
  if (existsSync("src/router.tsx")) return;
  if (!existsSync("bundle.tar.gz")) {
    let lastErr;
    for (const url of BUNDLE_URLS) {
      try {
        console.log("downloading", url);
        const res = await fetch(url, { redirect: "follow" });
        if (!res.ok) throw new Error(`${url} -> ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length < 1000) throw new Error(`${url} too small: ${buf.length}`);
        writeFileSync("bundle.tar.gz", buf);
        lastErr = null;
        break;
      } catch (err) {
        lastErr = err;
        console.warn(String(err));
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
