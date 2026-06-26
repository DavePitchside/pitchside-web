import { notFound } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import ToolClient from "@/components/tools/ToolClient";
import { ToolShell } from "@/components/tools/ToolChrome";
import { db } from "@/lib/firebase";
import { SITE_URL, getToolBySlug, mergeToolContent, toolSlugs } from "@/lib/tools";

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

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = await getMergedTool(slug);
  if (!tool) return {};

  return {
    title: tool.metaTitle || tool.title,
    description: tool.metaDescription,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title: tool.metaTitle || tool.title,
      description: tool.metaDescription,
      url: `${SITE_URL}/tools/${tool.slug}`,
      siteName: "Pitchside AI",
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: tool.metaTitle || tool.title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@pitchsideai",
      title: tool.metaTitle || tool.title,
      description: tool.metaDescription,
      images: ["/og-image.png"],
    },
  };
}

export default async function ToolPage({ params }) {
  const { slug } = await params;
  const tool = await getMergedTool(slug);
  if (!tool) notFound();

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
      <ToolShell tool={tool}>
        <ToolClient slug={tool.slug} />
      </ToolShell>
    </>
  );
}
