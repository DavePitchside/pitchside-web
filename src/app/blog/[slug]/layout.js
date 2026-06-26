import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SITE_URL = "https://pitchside.ai";
const FALLBACK_OG_IMAGE = `${SITE_URL}/og-image.png`;

async function getPostData(slug) {
  try {
    const qPost = query(collection(db, "posts"), where("slug", "==", slug));
    const postSnap = await getDocs(qPost);
    if (!postSnap.empty) return postSnap.docs[0].data();
  } catch (error) {
    console.error("Error fetching post for slug:", slug, error);
  }
  return null;
}

export async function generateMetadata(props) {
  const params = await props.params;
  const { slug } = params;
  const data = await getPostData(slug);

  const seoTitle = data?.metaTitle || data?.title || "Pitchside AI Blog";
  const seoDesc = data?.metaDescription || "Read the latest news and insights on Pitchside AI.";
  const ogImage = data?.primaryImage || data?.heroBackground || FALLBACK_OG_IMAGE;
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;

  const datePublished = data?.createdAt?.seconds
    ? new Date(data.createdAt.seconds * 1000).toISOString()
    : data?.date || undefined;

  const dateModified = data?.updatedAt?.seconds
    ? new Date(data.updatedAt.seconds * 1000).toISOString()
    : datePublished;

  return {
    title: seoTitle,
    description: seoDesc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      title: seoTitle,
      description: seoDesc,
      url: canonicalUrl,
      publishedTime: datePublished,
      modifiedTime: dateModified,
      authors: ["Dave Coombs"],
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

export default async function BlogSlugLayout({ children, params }) {
  const { slug } = await params;
  const data = await getPostData(slug);
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;

  const datePublished = data?.createdAt?.seconds
    ? new Date(data.createdAt.seconds * 1000).toISOString()
    : data?.date || new Date().toISOString();

  const dateModified = data?.updatedAt?.seconds
    ? new Date(data.updatedAt.seconds * 1000).toISOString()
    : datePublished;

  const schema = data
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: data.metaTitle || data.title,
        description: data.metaDescription,
        image: data.primaryImage || data.heroBackground || FALLBACK_OG_IMAGE,
        datePublished,
        dateModified,
        author: {
          "@type": "Person",
          name: "Dave Coombs",
          url: "https://www.linkedin.com/in/david-coombs-pitchside/",
        },
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "Pitchside AI",
          logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
      }
    : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      {children}
    </>
  );
}
