import { notFound } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";
import ToolClient from "@/components/tools/ToolClient";
import { ToolShell } from "@/components/tools/ToolChrome";
import { db } from "@/lib/firebase";
import { SITE_URL, getToolBySlug, mergeToolContent, toolSlugs } from "@/lib/tools";
import { cleanMetaTitle } from "@/lib/contentMeta";
import { isIndexableContent } from "@/lib/contentPolicy";

export const dynamic = "force-dynamic";

function removeFirestoreMetadata(data) {
  if (!data) return data;
  const { createdAt, updatedAt, ...content } = data;
  return content;
}

export function generateStaticParams() {
  return toolSlugs.map((slug) => ({ slug }));
}

async function getAdminToolContent(slug) {
  try {
    const snapshot = await getDoc(doc(db, "tools", slug));
    return snapshot.exists() ? removeFirestoreMetadata(snapshot.data()) : null;
  } catch (error) {
    console.error("Error loading tool admin content:", error);
    return null;
  }
}

async function getMergedTool(slug) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;
  const adminData = await getAdminToolContent(slug);
  return mergeToolContent(tool, adminData);
}

function serializeRelatedDoc(docSnapshot, contentType) {
  const data = docSnapshot.data();
  const slug = data.slug;
  const url = contentType === "post" ? `/blog/${slug}` : `/${slug}`;

  return {
    id: docSnapshot.id,
    contentType,
    slug,
    url,
    title: data.heroH1 || data.title || data.metaTitle || "Untitled guide",
    description: data.metaDescription || data.intro || "",
  };
}

async function getToolRelatedGuides(toolSlug) {
  const parentUrl = `/tools/${toolSlug}`;

  try {
    const [postsSnap, pagesSnap] = await Promise.all([
      getDocs(query(collection(db, "posts"), where("parentPage.url", "==", parentUrl))),
      getDocs(query(collection(db, "pages"), where("parentPage.url", "==", parentUrl))),
    ]);

    return [
      ...postsSnap.docs
        .filter((docSnapshot) => isIndexableContent(docSnapshot.data()))
        .map((docSnapshot) => serializeRelatedDoc(docSnapshot, "post")),
      ...pagesSnap.docs
        .filter((docSnapshot) => isIndexableContent(docSnapshot.data()))
        .map((docSnapshot) => serializeRelatedDoc(docSnapshot, "page")),
    ].sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error("Error loading tool related guides:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = await getMergedTool(slug);
  if (!tool) return {};

  const title = cleanMetaTitle(tool.metaTitle || tool.title);

  return {
    title,
    description: tool.metaDescription,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title,
      description: tool.metaDescription,
      url: `${SITE_URL}/tools/${tool.slug}`,
      siteName: "Pitchside AI",
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@pitchsideai",
      title,
      description: tool.metaDescription,
      images: ["/og-image.png"],
    },
  };
}

export default async function ToolPage({ params }) {
  const { slug } = await params;
  const tool = await getMergedTool(slug);
  if (!tool) notFound();
  const relatedGuides = await getToolRelatedGuides(tool.slug);

  const faqSchema = tool.faqs?.filter((faq) => faq?.question).length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: tool.faqs.filter((faq) => faq?.question).map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: String(faq.answer || "").replace(/<[^>]+>/g, ""),
          },
        })),
      }
    : null;

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    applicationCategory: "SportsApplication",
    operatingSystem: "Web",
    url: `${SITE_URL}/tools/${tool.slug}`,
    description: tool.metaDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: tool.heroH1 || tool.title,
    url: `${SITE_URL}/tools/${tool.slug}`,
    description: tool.metaDescription,
    isPartOf: {
      "@type": "WebSite",
      name: "Pitchside AI",
      url: SITE_URL,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Free Football Tools", item: `${SITE_URL}/tools` },
      { "@type": "ListItem", position: 3, name: tool.title, item: `${SITE_URL}/tools/${tool.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <ToolShell tool={tool} relatedGuides={relatedGuides}>
        <ToolClient slug={tool.slug} />
      </ToolShell>
    </>
  );
}
