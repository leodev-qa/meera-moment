import { mkdir, access, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const BASES = [
  "https://raw.githubusercontent.com/leodev-qa/meera-moment/main/public/",
  "https://cdn.jsdelivr.net/gh/leodev-qa/meera-moment@main/public/",
];

const FILES = [
  "og.jpg",
  "brand/almeera-lockup.jpg",
  "__grok/icon-180.png",
  "__grok/install/assets/homescreen/ob-ipad.png",
  "__grok/install/assets/homescreen/ob-phone.png",
  "moments/after-anniversary.jpg",
  "moments/after-everyday.jpg",
  "moments/after-f1.jpg",
  "moments/after-falcon.jpg",
  "moments/after-national.jpg",
  "moments/after-school.jpg",
  "moments/after-sustain.jpg",
  "moments/after-u17.jpg",
  "moments/aisle.jpg",
  "moments/aisle.mp4",
  "moments/before.jpg",
  "moments/f1.jpg",
  "moments/falcon.jpg",
  "moments/family.jpg",
  "moments/green.jpg",
  "moments/mango.jpg",
  "moments/national.jpg",
];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function download(file) {
  const dest = join("public", file);
  if (await exists(dest)) return;
  await mkdir(dirname(dest), { recursive: true });
  let lastErr;
  for (const base of BASES) {
    try {
      const res = await fetch(base + file, { redirect: "follow" });
      if (!res.ok) {
        lastErr = new Error(`${base}${file} -> ${res.status}`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 100) {
        lastErr = new Error(`${base}${file} too small`);
        continue;
      }
      await writeFile(dest, buf);
      console.log("fetched", file, buf.length);
      return;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error(`failed to fetch ${file}`);
}

const missing = [];
for (const file of FILES) {
  if (!(await exists(join("public", file)))) missing.push(file);
}
if (!missing.length) {
  console.log("public assets already present");
  process.exit(0);
}
console.log("fetching", missing.length, "assets");
for (const file of missing) await download(file);
