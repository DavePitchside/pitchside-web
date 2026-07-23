import fs from "fs";
import path from "path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const scanDirs = ["src", "README.md", "docs", "migrations"].map((item) => path.join(root, item));
const ignored = new Set(["node_modules", ".next", ".git"]);
const assetExtensions = /\.(png|jpe?g|webp|avif|svg|ico)(\?[^"'`\s<)]*)?$/i;
const obsoleteRoutes = [
  "/football-performance-analysis",
  "/football-player-tracking",
  "/football-highlights-app",
  "/best-football-stats-apps",
  "/sunday-league-football",
  "/football-stats-without-gps",
];

function walkFiles(target) {
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  return fs.readdirSync(target).flatMap((entry) => {
    if (ignored.has(entry)) return [];
    return walkFiles(path.join(target, entry));
  });
}

const files = scanDirs.flatMap(walkFiles).filter((file) => {
  const ext = path.extname(file).toLowerCase();
  return [".js", ".jsx", ".mjs", ".json", ".md", ".css", ".html"].includes(ext);
});

const missingAssets = [];
const obsoleteRouteHits = [];

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file);
  const candidates = [...text.matchAll(/["'`](\/[^"'`\s<>)]+)["'`]/g)].map((match) => match[1]);

  for (const candidate of candidates) {
    const assetPath = candidate.split("?")[0].split("#")[0];
    if (assetExtensions.test(assetPath) && !fs.existsSync(path.join(publicDir, assetPath.slice(1)))) {
      missingAssets.push(`${rel}: ${candidate}`);
    }
    if (!rel.startsWith("docs/") && rel !== "src/lib/redirects.mjs" && obsoleteRoutes.some((route) => assetPath === route || assetPath.startsWith(`${route}/`))) {
      obsoleteRouteHits.push(`${rel}: ${candidate}`);
    }
  }
}

if (missingAssets.length || obsoleteRouteHits.length) {
  if (missingAssets.length) {
    console.error("Missing local assets:");
    missingAssets.forEach((hit) => console.error(`- ${hit}`));
  }
  if (obsoleteRouteHits.length) {
    console.error("Obsolete internal route references:");
    obsoleteRouteHits.forEach((hit) => console.error(`- ${hit}`));
  }
  process.exit(1);
}

console.log(JSON.stringify({
  scannedFiles: files.length,
  missingAssets: 0,
  obsoleteRouteReferences: 0,
}, null, 2));
