import ToolsHub from "@/components/tools/ToolsHub";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SITE_URL, mergeToolContent, mergeToolsHubContent, tools, toolsHub } from "@/lib/tools";

export const dynamic = "force-dynamic";

function removeFirestoreMetadata(data) {
  if (!data) return data;
  const { createdAt, updatedAt, ...content } = data;
  return content;
}

async function getAdminToolsContent() {
  try {
    const ids = [toolsHub.id, ...tools.map((tool) => tool.id || tool.slug)];
    const snapshots = await Promise.all(ids.map((id) => getDoc(doc(db, "tools", id))));
    return Object.fromEntries(
      snapshots
        .filter((snapshot) => snapshot.exists())
        .map((snapshot) => [snapshot.id, removeFirestoreMetadata(snapshot.data())])
    );
  } catch (error) {
    console.error("Error loading tools admin content:", error);
    return {};
  }
}

async function getMergedToolsContent() {
  const adminContent = await getAdminToolsContent();

  return {
    hub: mergeToolsHubContent(adminContent[toolsHub.id]),
    tools: tools.map((tool) => mergeToolContent(tool, adminContent[tool.id] || adminContent[tool.slug])),
  };
}

export async function generateMetadata() {
  const { hub } = await getMergedToolsContent();

  return {
    title: hub.metaTitle,
    description: hub.metaDescription,
    alternates: {
      canonical: "/tools",
    },
    openGraph: {
      title: hub.metaTitle,
      description: hub.metaDescription,
      url: `${SITE_URL}/tools`,
      siteName: "Pitchside AI",
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: hub.metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@pitchsideai",
      title: hub.metaTitle,
      description: hub.metaDescription,
      images: ["/og-image.png"],
    },
  };
}

export default async function ToolsPage() {
  const { hub, tools: mergedTools } = await getMergedToolsContent();
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: hub.title,
    description: hub.metaDescription,
    url: `${SITE_URL}/tools`,
    mainEntity: mergedTools.map((tool) => ({
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
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Free Football Tools", item: `${SITE_URL}/tools` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ToolsHub hub={hub} tools={mergedTools} />
    </>
  );
}
