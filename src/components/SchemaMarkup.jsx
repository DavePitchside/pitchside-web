import React from 'react';

export default function SchemaMarkup({ data, type = "WebPage", url }) {
  if (!data) return null;

  // 1. BASE SCHEMA: Defines the page type (Article vs Landing Page)
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
    "headline": data.metaTitle || data.title || data.heroH1,
    "description": data.metaDescription || "Pitchside AI Platform",
    "image": data.primaryImage || data.heroBackground || "https://pitchside.ai/logo.png",
    "author": {
      "@type": "Organization",
      "name": "Pitchside AI",
      "url": "https://pitchside.ai"
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
  if (data.date) {
    baseSchema.datePublished = new Date(data.date).toISOString();
  } else if (data.createdAt && data.createdAt.seconds) {
    baseSchema.datePublished = new Date(data.createdAt.seconds * 1000).toISOString();
  }

  // 2. FAQ SCHEMA: Automatically generated if FAQs exist in the data
  let faqSchema = null;
  if (data.faqs && data.faqs.length > 0 && data.faqs[0].question !== "") {
    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.faqs.map(faq => ({
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