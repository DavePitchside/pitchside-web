import { notFound } from "next/navigation";
import { cache } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { canonicalInternalHref, canonicalizeInternalLinks, isIndexableContent } from "@/lib/contentPolicy";
import { cleanMetaTitle, contentDateToIso, formatContentDate, getContentAuthor, getPublishedDate, getUpdatedDate } from "@/lib/contentMeta";
import { getMoreToRead } from "@/lib/recommendations";
import MoreToRead from "@/components/MoreToRead";
import SplitTextReveal from "@/components/motion/SplitTextReveal";

export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, ChevronDown } from "lucide-react";

const SITE_URL = "https://pitchside.ai";
const isLegacyPlaceholderImage = (url = "") => /^https?:\/\/(?:www\.)?pitchside\.ai\/images\//i.test(url);
const stripHtml = (value = "") => String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const isFaqHeading = (value = "") => /^(faqs?|frequently asked questions)$/i.test(stripHtml(value));
const normalizeText = (value = "") => stripHtml(value).toLowerCase();

const getPostImage = (post) => {
  const contentImage = post.contentBlocks?.find((block) => block.type === "image" && block.content)?.content;
  const candidates = [post.primaryImage, post.thumbnail, contentImage, post.heroBackground].filter(Boolean);
  return candidates.find((url) => !isLegacyPlaceholderImage(url)) || candidates[0] || "";
};

const getPost = cache(async (slug) => {
  const q = query(collection(db, "posts"), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (!snap.empty && isIndexableContent(snap.docs[0].data())) return snap.docs[0].data();
  return null;
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const image = getPostImage(post) || `${SITE_URL}/og-image.png`;
  const title = cleanMetaTitle(post.metaTitle || post.heroH1 || post.title);
  const publishedTime = contentDateToIso(getPublishedDate(post));
  const modifiedTime = contentDateToIso(getUpdatedDate(post));
  const author = getContentAuthor(post);

  return {
    title,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description: post.metaDescription,
      url: `${SITE_URL}/blog/${slug}`,
      siteName: "Pitchside AI",
      type: "article",
      publishedTime,
      modifiedTime,
      authors: [author.name],
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@pitchsideai",
      title,
      description: post.metaDescription,
      images: [image],
    },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const displayImage = getPostImage(post);
  const publishedDate = getPublishedDate(post);
  const updatedDate = getUpdatedDate(post);
  const publishedIso = contentDateToIso(publishedDate);
  const updatedIso = contentDateToIso(updatedDate);
  const author = getContentAuthor(post);
  const isInternalAuthorLink = author.url?.startsWith("/");
  const moreToRead = await getMoreToRead(post, `/blog/${slug}`);
  const visibleFaqs = post.faqs?.filter((faq) => faq?.question) || [];
  const isFaqQuestion = (value = "") => {
    const text = normalizeText(value);
    return visibleFaqs.some((faq) => normalizeText(faq.question) === text);
  };
  const articleContentBlocks = [];
  let skippingImportedFaqSection = false;

  for (const block of post.contentBlocks || []) {
    const isHeading = block?.type === "h2" || block?.type === "h3";
    const isFaqStart = visibleFaqs.length > 0 && isHeading && (isFaqHeading(block.content) || isFaqQuestion(block.content));

    if (isFaqStart) {
      skippingImportedFaqSection = true;
      continue;
    }

    if (skippingImportedFaqSection) {
      const startsNextArticleSection = block?.type === "h2" && !isFaqHeading(block.content) && !isFaqQuestion(block.content);
      if (!startsNextArticleSection) continue;
      skippingImportedFaqSection = false;
    }

    articleContentBlocks.push(block);
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.heroH1 || post.title,
    description: post.metaDescription || "",
    image: displayImage || `${SITE_URL}/og-image.png`,
    author: { "@type": "Person", name: author.name, url: author.url?.startsWith("/") ? `${SITE_URL}${author.url}` : author.url },
    publisher: {
      "@type": "Organization",
      name: "Pitchside AI",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    ...(publishedIso && { datePublished: publishedIso }),
    ...(updatedIso && { dateModified: updatedIso }),
    ...(post.parentPage?.url && {
      isPartOf: {
        "@type": "WebPage",
        name: post.parentPage.title,
        url: `${SITE_URL}${post.parentPage.url}`,
      },
    }),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${slug}` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.heroH1 || post.title, item: `${SITE_URL}/blog/${slug}` },
    ],
  };

  const faqSchema =
    visibleFaqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: visibleFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: stripHtml(faq.answer || ""),
            },
          })),
        }
      : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <main data-header-theme="light" className="w-full min-h-screen bg-[#F4F3EF] text-zinc-950 pt-32 pb-24 px-6 font-sans">
        <article className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-950 transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dugout
          </Link>

          <header className="mb-12">
            <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-bold text-zinc-500">
              <span>
                By{" "}
                {isInternalAuthorLink ? (
                  <Link href={author.url} className="text-zinc-950 underline decoration-[#CCFF00] decoration-2 underline-offset-4 hover:text-zinc-600">
                    {author.name}
                  </Link>
                ) : (
                  <a href={author.url} target="_blank" rel="noopener noreferrer" className="text-zinc-950 underline decoration-[#CCFF00] decoration-2 underline-offset-4 hover:text-zinc-600">
                    {author.name}
                  </a>
                )}
              </span>
              <span aria-hidden="true">•</span>
              <Link href="/editorial-policy" className="text-zinc-950 underline decoration-[#CCFF00] decoration-2 underline-offset-4 hover:text-zinc-600">
                Editorial Policy
              </Link>
              <span aria-hidden="true">•</span>
              <span>Uploaded <time dateTime={publishedIso}>{formatContentDate(publishedDate)}</time></span>
              <span aria-hidden="true">•</span>
              <span>Updated <time dateTime={updatedIso}>{formatContentDate(updatedDate)}</time></span>
            </div>
            {post.parentPage?.url && (
              <p className="mb-5 text-sm font-bold text-zinc-500">
                Read <Link href={post.parentPage.url} className="text-zinc-950 underline decoration-[#CCFF00] decoration-2 underline-offset-4">{post.parentPage.title}</Link>
              </p>
            )}
            <SplitTextReveal as="h1" html={post.heroH1 || post.title} className="mb-8 text-4xl font-black uppercase leading-[0.9] tracking-tighter text-zinc-950 md:text-6xl" />
          </header>

          {displayImage && (
            <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-none border-4 border-zinc-950 shadow-[8px_8px_0px_#000]">
              <Image
                src={displayImage}
                alt={post.heroH1 || post.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          )}

          {post.tldrPoints?.length > 0 && post.tldrPoints[0] !== "" && (
            <div className="mb-12 rounded-none border-l-4 border-[#CCFF00] bg-zinc-950 p-6 text-white shadow-xl md:p-8">
              <h3 className="text-lg font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                TL;DR Summary
              </h3>
              <ul className="space-y-3">
                {post.tldrPoints.map(
                  (point, i) =>
                    point && (
                      <li key={i} className="flex items-start gap-3 text-zinc-300">
                        <CheckCircle2 className="w-5 h-5 text-[#CCFF00] flex-shrink-0 mt-0.5" />
                        <span dangerouslySetInnerHTML={{ __html: point }} />
                      </li>
                    )
                )}
              </ul>
            </div>
          )}

          {post.aeoQuickAnswer && (
            <div className="text-xl md:text-2xl font-serif italic text-zinc-800 leading-relaxed mb-10 border-l-4 border-zinc-950 pl-6">
              <span dangerouslySetInnerHTML={{ __html: post.aeoQuickAnswer }} />
            </div>
          )}

          <div className="space-y-6 text-lg text-zinc-800 leading-relaxed mb-16">
            {articleContentBlocks.map((block) => {
              if (block.type === "image" && block.content) {
                return (
                  <div
                    key={block.id}
                    className="relative my-10 aspect-video overflow-hidden rounded-none border-4 border-zinc-950 shadow-[6px_6px_0px_#000]"
                  >
                    <Image
                      src={block.content}
                      alt="Blog image"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 768px"
                      loading="lazy"
                    />
                  </div>
                );
              }
              if (block.type === "h2" && block.content) {
                return (
                  <SplitTextReveal
                    as="h2"
                    key={block.id}
                    className="mt-16 mb-6 text-3xl font-black uppercase tracking-tighter text-zinc-950 [&_a]:underline [&_a]:decoration-[#CCFF00] [&_a]:decoration-4 [&_a]:underline-offset-4"
                    html={canonicalizeInternalLinks(block.content)}
                  />
                );
              }
              if (block.type === "h3" && block.content) {
                return (
                  <SplitTextReveal
                    as="h3"
                    key={block.id}
                    className="mt-8 mb-4 text-2xl font-bold tracking-tight text-zinc-900 [&_a]:underline [&_a]:decoration-[#CCFF00] [&_a]:decoration-2 [&_a]:underline-offset-4"
                    html={canonicalizeInternalLinks(block.content)}
                  />
                );
              }
              if (block.type === "paragraph" && block.content) {
                return <SplitTextReveal key={block.id} html={canonicalizeInternalLinks(block.content)} />;
              }
              if (block.type === "list" && block.items?.length > 0) {
                return (
                  <ul key={block.id} className="space-y-3 my-6 ml-4">
                    {block.items.map(
                      (item, idx) =>
                        item && (
                          <li key={idx} className="flex items-start gap-3 text-zinc-800">
                            <span className="w-2 h-2 rounded-full bg-zinc-950 mt-2.5 shrink-0" />
                            <span dangerouslySetInnerHTML={{ __html: canonicalizeInternalLinks(item) }} />
                          </li>
                        )
                    )}
                  </ul>
                );
              }
              if (block.type === "table" && block.headers?.length > 0) {
                return (
                  <div
                    key={block.id}
                    className="my-10 w-full overflow-x-auto rounded-none border-4 border-zinc-950 shadow-[6px_6px_0px_#000]"
                  >
                    <table className="w-full text-left border-collapse bg-white">
                      <thead>
                        <tr className="bg-zinc-950 border-b-2 border-zinc-950">
                          {block.headers.map((th, i) => (
                            <th
                              key={i}
                              className="p-4 text-xs font-black uppercase tracking-widest text-[#CCFF00] border-r border-zinc-800 last:border-r-0"
                            >
                              {th}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows?.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-zinc-200 last:border-b-0 hover:bg-zinc-50">
                            {row.cells?.map((td, cIdx) => (
                              <td
                                key={cIdx}
                                className="p-4 border-r border-zinc-200 last:border-r-0 font-medium text-zinc-800 text-sm md:text-base"
                              >
                                <span dangerouslySetInnerHTML={{ __html: canonicalizeInternalLinks(td) }} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              return null;
            })}
          </div>

          {post.ctaBlock?.headline && (
            <div className="my-16 rounded-none border-4 border-zinc-950 bg-[#CCFF00] p-8 text-center text-zinc-950 shadow-[8px_8px_0px_rgba(9,9,11,1)] md:p-12">
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">{post.ctaBlock.headline}</h3>
              <p className="text-lg font-medium mb-8 max-w-lg mx-auto" dangerouslySetInnerHTML={{ __html: post.ctaBlock.description || "" }} />
              <Link
                href={canonicalInternalHref(post.ctaBlock.buttonUrl || "/contact")}
                className="inline-block rounded-full border-4 border-zinc-950 bg-zinc-950 px-8 py-4 font-bold uppercase tracking-widest text-white transition-colors hover:bg-transparent hover:text-zinc-950"
              >
                {post.ctaBlock.buttonText || "Learn More"}
              </Link>
            </div>
          )}

          {visibleFaqs.length > 0 && (
            <section className="mt-20 border-t-2 border-zinc-950 pt-12">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-950 mb-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {visibleFaqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group cursor-pointer rounded-none border-2 border-zinc-950 bg-white p-6"
                  >
                    <summary className="flex justify-between items-center font-bold text-lg list-none">
                      {faq.question}
                      <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
                    </summary>
                    <p
                      className="mt-4 text-zinc-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </details>
                ))}
              </div>
            </section>
          )}
          <MoreToRead items={moreToRead} />
        </article>
      </main>
    </>
  );
}
