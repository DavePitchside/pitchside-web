import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { stripHtml } from "@/lib/tools";
import { isIndexableContent } from "@/lib/contentPolicy";

export async function GET(request, { params }) {
  const { slug } = await params;

  try {
    const q = query(collection(db, "posts"), where("slug", "==", slug));
    const snap = await getDocs(q);

    if (snap.empty) return new Response("Post not found.", { status: 404 });

    const post = snap.docs[0].data();
    if (!isIndexableContent(post)) return new Response("Post not found.", { status: 404 });

    let md = `# ${post.heroH1 || post.title}\n\n`;

    md += `## Meta Information\n`;
    md += `- **Title:** ${post.metaTitle || post.heroH1 || post.title || "N/A"}\n`;
    md += `- **Description:** ${post.metaDescription || "N/A"}\n`;
    md += `- **Category:** ${post.category || "Article"}\n`;
    md += `- **Date:** ${post.date || "Recent"}\n\n`;

    if (post.tldrPoints?.length > 0 && post.tldrPoints[0] !== "") {
      md += `## TL;DR Summary\n`;
      post.tldrPoints.forEach((pt) => {
        if (pt) md += `- ${stripHtml(pt)}\n`;
      });
      md += `\n`;
    }

    if (post.aeoQuickAnswer) {
      md += `## Quick Answer\n${stripHtml(post.aeoQuickAnswer)}\n\n`;
    }

    if (post.contentBlocks?.length > 0) {
      md += `## Article Content\n\n`;
      post.contentBlocks.forEach((block) => {
        if (block.type === "h2" && block.content) md += `## ${stripHtml(block.content)}\n\n`;
        if (block.type === "h3" && block.content) md += `### ${stripHtml(block.content)}\n\n`;
        if (block.type === "paragraph" && block.content) md += `${stripHtml(block.content)}\n\n`;
        if (block.type === "list" && block.items?.length > 0) {
          block.items.forEach((item) => { if (item) md += `- ${stripHtml(item)}\n`; });
          md += `\n`;
        }
        if (block.type === "table" && block.headers?.length > 0) {
          md += `| ${block.headers.join(" | ")} |\n`;
          md += `| ${block.headers.map(() => "---").join(" | ")} |\n`;
          block.rows?.forEach((row) => {
            if (row.cells) md += `| ${row.cells.map((c) => stripHtml(c)).join(" | ")} |\n`;
          });
          md += `\n`;
        }
      });
    }

    if (post.faqs?.length > 0 && post.faqs[0]?.question) {
      md += `## Frequently Asked Questions\n\n`;
      post.faqs.forEach((faq) => {
        if (faq.question) md += `**Q: ${faq.question}**\n${stripHtml(faq.answer || "")}\n\n`;
      });
    }

    return new Response(md, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("blog llms.txt error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
