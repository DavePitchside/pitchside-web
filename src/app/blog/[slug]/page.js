import { notFound } from "next/navigation";
import { cache } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, ChevronDown } from "lucide-react";

const SITE_URL = "https://pitchside.ai";

const getPost = cache(async (slug) => {
  const q = query(collection(db, "posts"), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (!snap.empty) return snap.docs[0].data();
  return null;
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const image = post.primaryImage || post.heroBackground || `${SITE_URL}/og-image.png`;
  const title = post.metaTitle || post.heroH1 || post.title;

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

  const displayImage = post.heroBackground || post.primaryImage;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.heroH1 || post.title,
    description: post.metaDescription || "",
    image: displayImage || `${SITE_URL}/og-image.png`,
    author: { "@type": "Organization", name: "Pitchside AI", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "Pitchside AI",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    ...(post.date && { datePublished: new Date(post.date).toISOString() }),
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
    post.faqs?.length > 0 && post.faqs[0]?.question
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs
            .filter((f) => f?.question)
            .map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: String(faq.answer || "").replace(/<[^>]+>/g, ""),
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

      <main className="w-full min-h-screen bg-[#F4F3EF] text-zinc-950 pt-32 pb-24 px-6 font-sans">
        <article className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-950 transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dugout
          </Link>

          <header className="mb-12">
            <p className="text-sm font-bold font-mono text-zinc-500 mb-4">{post.date || "Recent"}</p>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-950 leading-[0.9] mb-8">
              {post.heroH1 || post.title}
            </h1>
          </header>

          {displayImage && (
            <div className="w-full aspect-video rounded-2xl overflow-hidden mb-12 border-4 border-zinc-950 shadow-[8px_8px_0px_#000] relative">
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
            <div className="bg-zinc-950 text-white p-6 md:p-8 rounded-xl mb-12 shadow-xl border-l-4 border-[#CCFF00]">
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
              {post.aeoQuickAnswer}
            </div>
          )}

          <div className="space-y-6 text-lg text-zinc-800 leading-relaxed mb-16">
            {post.contentBlocks?.map((block) => {
              if (block.type === "image" && block.content) {
                return (
                  <div
                    key={block.id}
                    className="my-10 rounded-2xl overflow-hidden border-4 border-zinc-950 shadow-[6px_6px_0px_#000] relative aspect-video"
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
                  <h2
                    key={block.id}
                    className="text-3xl font-black uppercase tracking-tighter text-zinc-950 mt-16 mb-6"
                  >
                    {block.content}
                  </h2>
                );
              }
              if (block.type === "h3" && block.content) {
                return (
                  <h3
                    key={block.id}
                    className="text-2xl font-bold tracking-tight text-zinc-900 mt-8 mb-4"
                  >
                    {block.content}
                  </h3>
                );
              }
              if (block.type === "paragraph" && block.content) {
                return <p key={block.id} dangerouslySetInnerHTML={{ __html: block.content }} />;
              }
              if (block.type === "list" && block.items?.length > 0) {
                return (
                  <ul key={block.id} className="space-y-3 my-6 ml-4">
                    {block.items.map(
                      (item, idx) =>
                        item && (
                          <li key={idx} className="flex items-start gap-3 text-zinc-800">
                            <span className="w-2 h-2 rounded-full bg-zinc-950 mt-2.5 shrink-0" />
                            <span dangerouslySetInnerHTML={{ __html: item }} />
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
                    className="w-full overflow-x-auto my-10 rounded-xl border-4 border-zinc-950 shadow-[6px_6px_0px_#000]"
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
                                <span dangerouslySetInnerHTML={{ __html: td }} />
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
            <div className="bg-[#CCFF00] text-zinc-950 p-8 md:p-12 rounded-xl text-center my-16 border-4 border-zinc-950 shadow-[8px_8px_0px_rgba(9,9,11,1)]">
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">{post.ctaBlock.headline}</h3>
              <p className="text-lg font-medium mb-8 max-w-lg mx-auto">{post.ctaBlock.description}</p>
              <Link
                href={post.ctaBlock.buttonUrl || "/contact"}
                className="inline-block bg-zinc-950 text-white font-bold uppercase tracking-widest px-8 py-4 hover:bg-transparent hover:text-zinc-950 border-4 border-zinc-950 transition-colors"
              >
                {post.ctaBlock.buttonText || "Learn More"}
              </Link>
            </div>
          )}

          {post.faqs?.length > 0 && post.faqs[0].question !== "" && (
            <section className="mt-20 border-t-2 border-zinc-950 pt-12">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-950 mb-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {post.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group bg-white border-2 border-zinc-950 p-6 rounded-lg cursor-pointer"
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
        </article>
      </main>
    </>
  );
}
