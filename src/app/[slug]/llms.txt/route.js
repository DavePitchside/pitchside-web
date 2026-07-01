import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { isIndexableContent } from "@/lib/contentPolicy";

export async function GET(request, { params }) {
  // Await params in Next.js 15
  const { slug } = await params;

  try {
    let pageData = null;
    let dataSource = null;

    // 1. Check the 'pages' collection (SEO Landing Pages)
    const qPage = query(collection(db, "pages"), where("slug", "==", slug));
    const pageSnap = await getDocs(qPage);

    if (!pageSnap.empty) {
      pageData = pageSnap.docs[0].data();
      dataSource = "pages";
    } else {
      // 2. Fallback: Check the 'posts' collection (Standard Blog Posts)
      const qPost = query(collection(db, "posts"), where("slug", "==", slug));
      const postSnap = await getDocs(qPost);
      if (!postSnap.empty) {
        pageData = postSnap.docs[0].data();
        dataSource = "posts";
      }
    }

    // 3. 404 if no old or new page exists in the database
    if (!isIndexableContent(pageData)) {
      return new Response("Content not found. Return to Pitchside.ai", { status: 404 });
    }

    if (dataSource === "posts") {
      return Response.redirect(new URL(`/blog/${slug}/llms.txt`, request.url), 301);
    }

    // 4. Construct the Machine-Readable Markdown Profile
    let md = `# ${pageData.heroH1 || pageData.title}\n\n`;
    
    // --- ADDED: META INFORMATION BLOCK ---
    md += `## Meta Information\n`;
    md += `- **Title:** ${pageData.metaTitle || pageData.title || 'N/A'}\n`;
    md += `- **Description:** ${pageData.metaDescription || 'N/A'}\n\n`;

    if (pageData.tldrPoints && pageData.tldrPoints.length > 0 && pageData.tldrPoints[0] !== "") {
      md += `## TL;DR Summary\n`;
      pageData.tldrPoints.forEach(pt => {
         // Basic regex to strip any rogue HTML tags from the database strings
         if(pt) md += `- ${pt.replace(/<[^>]+>/g, '')}\n`;
      });
      md += `\n`;
    }

    if (pageData.aeoQuickAnswer) {
       md += `## Quick Answer\n${pageData.aeoQuickAnswer.replace(/<[^>]+>/g, '')}\n\n`;
    }

    // 5. Parse the Block Engine Dynamically
    if (pageData.contentBlocks) {
      pageData.contentBlocks.forEach(block => {
        if (block.type === 'h2' && block.content) {
            md += `## ${block.content}\n\n`;
        }
        if (block.type === 'h3' && block.content) {
            md += `### ${block.content}\n\n`;
        }
        if (block.type === 'paragraph' && block.content) {
            md += `${block.content.replace(/<[^>]+>/g, '')}\n\n`;
        }
        if (block.type === 'list' && block.items.length > 0) {
          block.items.forEach(item => {
            if(item) md += `- ${item.replace(/<[^>]+>/g, '')}\n`;
          });
          md += `\n`;
        }
        // Tables are highly valuable for LLMs, we format them into Markdown tables
        if (block.type === 'table' && block.headers.length > 0) {
            md += `| ${block.headers.join(' | ')} |\n`;
            md += `| ${block.headers.map(() => '---').join(' | ')} |\n`;
            block.rows.forEach(row => {
               if (row.cells) {
                   // Clean out HTML checkmarks/crosses and replace with text for the LLM
                   const cleanCells = row.cells.map(cell => cell.replace(/<[^>]+>/g, ''));
                   md += `| ${cleanCells.join(' | ')} |\n`;
               }
            });
            md += `\n`;
        }
      });
    }

    // 6. Inject Schema-Ready FAQs
    if (pageData.faqs && pageData.faqs.length > 0 && pageData.faqs[0].question !== "") {
      md += `## Frequently Asked Questions\n\n`;
      pageData.faqs.forEach(faq => {
        if (faq.question) {
          md += `**Q: ${faq.question}**\n${faq.answer.replace(/<[^>]+>/g, '')}\n\n`;
        }
      });
    }

    // Return as raw text with caching headers so it loads instantly for crawlers
    return new Response(md, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error("LLMs.txt Generator Error:", error);
    return new Response("Error generating machine-readable content.", { status: 500 });
  }
}
