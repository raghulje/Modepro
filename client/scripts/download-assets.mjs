import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import https from "https";
import http from "http";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const publicDir = join(root, "public", "images");
const srcDir = join(root, "src");
const manifestPath = join(fileURLToPath(new URL(".", import.meta.url)), "assets-manifest.json");

const REMOTE_RE = /https:\/\/modepro\.co\.in\/images\/[^"']+/g;
/** Only quoted static paths — avoids template literals and paths with spaces breaking on \s */
const LOCAL_RE = /["'](\/images\/[^"']+)["']/g;

const force = process.argv.includes("--force");
const BASE_URL = "https://modepro.co.in/images/";

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (/\.(ts|tsx|html)$/.test(name)) files.push(p);
  }
  return files;
}

function localPathToRemote(localPath) {
  const relative = localPath.replace(/^\/images\//, "");
  const encoded = relative
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `${BASE_URL}${encoded}`;
}

function collectAssetPaths() {
  const locals = new Set();
  const remotes = new Set();
  const files = [...walk(srcDir), join(root, "index.html")];

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    content.match(REMOTE_RE)?.forEach((u) => remotes.add(u));
    let m;
    const localRe = new RegExp(LOCAL_RE.source, LOCAL_RE.flags);
    while ((m = localRe.exec(content)) !== null) {
      locals.add(m[1]);
    }
  }

  return { locals: [...locals], remotes: [...remotes] };
}

function loadManifest() {
  if (!existsSync(manifestPath)) return [];
  try {
    return JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch {
    return [];
  }
}

function resolveDownloadList() {
  const { locals, remotes } = collectAssetPaths();
  const entries = new Map();

  for (const url of remotes) {
    const local = urlToPublicPath(url);
    entries.set(local, url);
  }

  for (const local of locals) {
    if (!entries.has(local)) {
      entries.set(local, localPathToRemote(local));
    }
  }

  for (const local of loadManifest()) {
    if (!entries.has(local)) {
      entries.set(local, localPathToRemote(local));
    }
  }

  return [...entries.entries()].map(([local, remote]) => ({ local, remote }));
}

function urlToLocalPath(remoteUrl) {
  const pathPart = decodeURIComponent(
    remoteUrl.replace("https://modepro.co.in/images/", "")
  );
  return join(publicDir, ...pathPart.split("/"));
}

function localToDiskPath(localPath) {
  const pathPart = decodeURIComponent(localPath.replace(/^\/images\//, ""));
  return join(publicDir, ...pathPart.split("/"));
}

function urlToPublicPath(remoteUrl) {
  const pathPart = decodeURIComponent(
    remoteUrl.replace("https://modepro.co.in/images/", "")
  );
  return `/images/${pathPart}`;
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const dir = dirname(dest);
    mkdirSync(dir, { recursive: true });
    if (existsSync(dest) && !force) {
      resolve("skip");
      return;
    }
    const client = url.startsWith("https") ? https : http;
    const request = client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`${url} => ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        writeFileSync(dest, Buffer.concat(chunks));
        resolve(existsSync(dest) && force ? "updated" : "ok");
      });
    });
    request.on("error", reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error(`timeout: ${url}`));
    });
  });
}

const assets = resolveDownloadList();
console.log(`Found ${assets.length} image asset(s) in source${force ? " (force re-download)" : ""}`);

if (assets.length === 0) {
  console.log(
    "Nothing to download. Add /images/... paths in src/ or run after cloning without public/images."
  );
  process.exit(0);
}

let ok = 0;
let updated = 0;
let skip = 0;
let fail = 0;
const failures = [];
const manifest = [];

for (const { local, remote } of assets) {
  const dest = localToDiskPath(local);
  try {
    const result = await download(remote, dest);
    manifest.push(local);
    if (result === "skip") skip++;
    else if (result === "updated") updated++;
    else ok++;
    process.stdout.write(".");
  } catch (e) {
    fail++;
    failures.push({ local, remote, error: e.message });
    process.stdout.write("x");
  }
}

writeFileSync(manifestPath, JSON.stringify([...new Set(manifest)].sort(), null, 2), "utf8");

console.log(
  `\nDownloaded: ${ok}, updated: ${updated}, skipped (already present): ${skip}, failed: ${fail}`
);

if (failures.length) {
  console.log("Failures:");
  failures.slice(0, 20).forEach((f) =>
    console.log(`  ${f.local}\n    ${f.remote}\n    ${f.error}`)
  );
}

// Migrate any remaining remote URLs in source to local paths
const filesToPatch = [...walk(srcDir), join(root, "index.html")];
let patchedFiles = 0;

for (const file of filesToPatch) {
  let content = readFileSync(file, "utf8");
  const matches = content.match(REMOTE_RE);
  if (!matches) continue;

  for (const remote of matches) {
    content = content.split(remote).join(urlToPublicPath(remote));
  }
  writeFileSync(file, content, "utf8");
  patchedFiles++;
  console.log("migrated to local paths:", file.replace(root, ""));
}

if (patchedFiles === 0 && skip === assets.length && ok === 0 && updated === 0) {
  console.log("All assets are already stored under public/images/.");
}

console.log("Done.");
