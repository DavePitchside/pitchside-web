import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SITE_URL = "https://pitchside.ai";

const defaultMetadata = {
  title: "The Technology Behind Pitchside AI | Small-Sided Football Analysis",
  description:
    "See how Pitchside AI uses custom machine learning and computer vision trained on small-sided football footage to generate stats, highlights and player moments.",
  alternates: { canonical: `${SITE_URL}/technology` },
  openGraph: {
    title: "The Technology Behind Pitchside AI | Small-Sided Football Analysis",
    description:
      "See how Pitchside AI uses custom machine learning and computer vision trained on small-sided football footage to generate stats, highlights and player moments.",
    url: `${SITE_URL}/technology`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Pitchside AI Technology" }],
  },
  twitter: {
    title: "The Technology Behind Pitchside AI | Small-Sided Football Analysis",
    description:
      "Custom machine learning and computer vision for small-sided football footage, beta stats, highlights and player moments.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export async function generateMetadata() {
  try {
    const snapshot = await getDoc(doc(db, "pages", "technology"));
    if (snapshot.exists()) {
      const data = snapshot.data();
      const title = data.metaTitle || data.heroH1 || data.title || defaultMetadata.title;
      const description = data.metaDescription || defaultMetadata.description;
      const image = data.primaryImage || data.heroBackground || `${SITE_URL}/og-image.png`;

      return {
        title,
        description,
        alternates: { canonical: `${SITE_URL}/technology` },
        openGraph: {
          title,
          description,
          url: `${SITE_URL}/technology`,
          images: [{ url: image, width: 1200, height: 630, alt: title }],
        },
        twitter: {
          title,
          description,
          images: [image],
        },
      };
    }
  } catch (error) {
    console.warn("technology metadata: using defaults:", error.message);
  }

  return defaultMetadata;
}

export default function TechnologyLayout({ children }) {
  return <>{children}</>;
}
