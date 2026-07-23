import { notFound } from "next/navigation";
import CmsTemplate from "@/components/cms/CmsTemplates";
import { getVisibleFaqs } from "@/components/cms/CmsBlocks";
import { getCmsPageByPath } from "@/lib/cms/pageLoader";
import { absoluteUrl, normalizeRoutePath, SITE_URL } from "@/lib/cms/pageSchema";
import { cleanMetaTitle } from "@/lib/contentMeta";

function stripHtml(value = "") {
  return String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateCmsMetadata(routePath) {
  const page = await getCmsPageByPath(routePath);
  if (!page) return {};

  const title = cleanMetaTitle(page.seo.metaTitle || page.hero.h1 || page.title);
  const description = page.seo.metaDescription || page.hero.intro || "";
  const canonical = page.seo.canonical || normalizeRoutePath(routePath);
  const image = absoluteUrl(page.seo.ogImage || "/og-image.png");

  return {
    title,
    description,
    alternates: { canonical },
    robots: page.status === "published" && page.seo.robots !== "noindex,nofollow" ? "index,follow" : "noindex,nofollow",
    openGraph: {
      title: page.seo.ogTitle || title,
      description: page.seo.ogDescription || description,
      url: absoluteUrl(canonical),
      siteName: "Pitchside AI",
      type: page.pageType === "author" ? "profile" : "website",
      images: [{ url: image, width: 1200, height: 630, alt: page.seo.ogTitle || title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@pitchsideai",
      title: page.seo.ogTitle || title,
      description: page.seo.ogDescription || description,
      images: [image],
    },
  };
}

function cmsSchemas(page) {
  const routeUrl = absoluteUrl(page.routePath);
  const authorUrl = page.author?.url ? absoluteUrl(page.author.url) : undefined;
  const reviewerUrl = page.reviewer?.url ? absoluteUrl(page.reviewer.url) : undefined;
  const visibleFaqs = getVisibleFaqs(page.blocks);

  const webPage = {
    "@context": "https://schema.org",
    "@type": page.pageType === "author" ? "ProfilePage" : "WebPage",
    name: page.hero.h1 || page.title,
    description: page.seo.metaDescription || page.hero.intro || "",
    url: routeUrl,
    isPartOf: { "@type": "WebSite", name: "Pitchside AI", url: SITE_URL },
    ...(page.publishedAt && { datePublished: page.publishedAt }),
    ...(page.updatedAt && { dateModified: page.updatedAt }),
    ...(page.author?.name && { author: { "@type": "Person", name: page.author.name, ...(authorUrl && { url: authorUrl }) } }),
    ...(page.reviewer?.name && { reviewedBy: { "@type": "Person", name: page.reviewer.name, ...(reviewerUrl && { url: reviewerUrl }) } }),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: page.title, item: routeUrl },
    ],
  };

  const faq = visibleFaqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: visibleFaqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: stripHtml(item.answer || "") },
        })),
      }
    : null;

  return [webPage, breadcrumb, faq].filter(Boolean);
}

export default async function CmsPageRenderer({ routePath }) {
  const page = await getCmsPageByPath(routePath);
  if (!page) notFound();

  return (
    <>
      {cmsSchemas(page).map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <CmsTemplate page={page} />
    </>
  );
}
