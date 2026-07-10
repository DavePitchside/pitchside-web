import React from 'react';
import { cleanMetaTitle, contentDateToIso, getContentAuthor, getPublishedDate, getUpdatedDate } from "@/lib/contentMeta";

export default function SchemaMarkup({ data, type = "WebPage", url }) {
  if (!data) return null;
  const author = getContentAuthor(data);

  // 1. BASE SCHEMA: Defines the page type (Article vs Landing Page)
  const headline = cleanMetaTitle(data.metaTitle || data.title || data.heroH1);
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
    "headline": headline,
    "description": data.metaDescription || "Pitchside AI Platform",
    "image": data.primaryImage || data.heroBackground || "https://pitchside.ai/logo.png",
    "author": {
      "@type": "Person",
      "name": author.name,
      "url": author.url
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
      "@id": `https://pitchside.ai${url}`
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
