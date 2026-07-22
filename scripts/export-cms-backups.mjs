import fs from "fs";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";

for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^["' ]|["' ]$/g, "");
}

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

const db = getFirestore(app);
const pageSlugs = [
  "football-analysis-app",
  "football-stats-app",
  "ai-football-analysis",
  "football-video-analysis",
  "ai-football-highlights",
  "football-camera-app",
  "record-football-matches",
  "grassroots-football-app",
  "best-veo-alternative-football",
  "how-pitchside-ai-works",
  "football-recording-setup",
];
const postSlugs = ["veo-camera-alternative", "cheapest-veo-alternative", "how-to-record-a-football-match-on-your-phone"];

const serialise = (value) =>
  JSON.parse(
    JSON.stringify(value, (_key, item) => {
      if (item && typeof item.toDate === "function") return item.toDate().toISOString();
      return item;
    }),
  );

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.mkdirSync("backups/cms", { recursive: true });
const manifest = [];

async function exportMatching(collectionName, slug) {
  const snapshot = await getDocs(query(collection(db, collectionName), where("slug", "==", slug)));
  if (snapshot.empty) {
    manifest.push({ collection: collectionName, slug, status: "missing" });
    return;
  }

  for (const docSnapshot of snapshot.docs) {
    const file = `backups/cms/${stamp}-${collectionName}-${slug}-${docSnapshot.id}.json`;
    fs.writeFileSync(
      file,
      JSON.stringify(
        {
          collection: collectionName,
          slug,
          id: docSnapshot.id,
          exportedAt: new Date().toISOString(),
          data: serialise(docSnapshot.data()),
        },
        null,
        2,
      ),
    );
    manifest.push({ collection: collectionName, slug, id: docSnapshot.id, status: "backed-up", file });
  }
}

for (const slug of pageSlugs) await exportMatching("pages", slug);
for (const slug of postSlugs) await exportMatching("posts", slug);

const manifestFile = `backups/cms/${stamp}-seo-cro-affiliate-audit-manifest.json`;
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
console.log(manifestFile);
console.log(JSON.stringify(manifest.map(({ collection, slug, id, status }) => ({ collection, slug, id, status })), null, 2));

setTimeout(() => process.exit(0), 250);
