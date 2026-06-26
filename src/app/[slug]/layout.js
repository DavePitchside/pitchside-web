import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SITE_URL = "https://pitchside.ai";
const FALLBACK_OG_IMAGE = `${SITE_URL}/og-image.png`;

export async function generateMetadata(props) {
  const params = await props.params;
  const slug = params.slug;

  let seoTitle = "Pitchside AI";
  let seoDesc = "The intersection of artificial intelligence and grassroots football.";
  let ogImage = FALLBACK_OG_IMAGE;

  try {
    const qPage = query(collection(db, "pages"), where("slug", "==", slug));
    const pageSnap = await getDocs(qPage);

    if (!pageSnap.empty) {
      const data = pageSnap.docs[0].data();
      seoTitle = data.metaTitle || data.title || seoTitle;
      seoDesc = data.metaDescription || seoDesc;
      ogImage = data.primaryImage || data.heroBackground || ogImage;
    } else {
      const qPost = query(collection(db, "posts"), where("slug", "==", slug));
      const postSnap = await getDocs(qPost);

      if (!postSnap.empty) {
        const data = postSnap.docs[0].data();
        seoTitle = data.metaTitle || data.title || seoTitle;
        seoDesc = data.metaDescription || seoDesc;
        ogImage = data.primaryImage || data.heroBackground || ogImage;
      }
    }
  } catch (error) {
    console.error("Error generating metadata for slug:", slug, error);
  }

  const canonicalUrl = `${SITE_URL}/${slug}`;

  return {
    title: seoTitle,
    description: seoDesc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: canonicalUrl,
      images: [{ url: ogImage, width: 1200, height: 630, alt: seoTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDesc,
      images: [ogImage],
    },
  };
}

export default function SlugLayout({ children }) {
  return <>{children}</>;
}