import React from 'react';
import { cleanMetaTitle, contentDateToIso, getContentAuthor, getPublishedDate, getUpdatedDate } from "@/lib/contentMeta";

const SITE_URL = "https://pitchside.ai";

function absoluteSiteUrl(value, fallback) {
  if (!value || typeof value !== "string") return fallback;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return `${SITE_URL}${value}`;
  return fallback;
}

export default function SchemaMarkup({ data, type = "WebPage", url }) {
  if (!data) return null;
  const author = getContentAuthor(data);
  const authorUrl = absoluteSiteUrl(author.url, `${SITE_URL}/authors/abdullah-luqman`);
  const imageUrl = absoluteSiteUrl(data.primaryImage || data.heroBackground, `${SITE_URL}/og-image.png`);

  // 1. BASE SCHEMA: Defines the page type (Article vs Landing Page)
  const headline = cleanMetaTitle(data.metaTitle || data.title || data.heroH1);
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
    "headline": headline,
    "description": data.metaDescription || "Pitchside AI Platform",
    "image": imageUrl,
    "author": {
      "@type": "Person",
      "name": author.name,
      "url": authorUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Pitchside AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pitchside.ai/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}${url}`
    }
  };

  // Add date published if available (especially good for blogs)
  const publishedDate = contentDateToIso(getPublishedDate(data));
  const updatedDate = contentDateToIso(getUpdatedDate(data));
  if (publishedDate) baseSchema.datePublished = publishedDate;
  if (updatedDate) baseSchema.dateModified = updatedDate;

  // 2. FAQ SCHEMA: Automatically generated if FAQs exist in the data
  const visibleFaqs = data.faqs?.filter((faq) => faq?.question) || [];
  let faqSchema = null;
  if (visibleFaqs.length > 0) {
    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": visibleFaqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          // Strip HTML tags for clean schema validation
          "text": faq.answer ? faq.answer.replace(/<[^>]+>/g, '') : "" 
        }
      }))
    };
  }

  // Inject JSON-LD directly into the DOM
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(baseSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
