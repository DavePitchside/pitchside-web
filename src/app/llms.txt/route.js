import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { tools, toolsHub, SITE_URL } from "@/lib/tools";

export async function GET() {
  try {
    const [postsSnapshot, pagesSnapshot] = await Promise.all([
      getDocs(collection(db, "posts")),
      getDocs(collection(db, "pages")),
    ]);

    let md = `# Pitchside AI — Official Knowledge Base\n\n`;
    md += `> Pitchside AI is an AI-powered football camera and highlights app for amateur and grassroots players. It automatically tracks goals, assists, tackles and generates studio-quality highlight reels from standard smartphone footage. No wearables. No setup. Pre-launch — join the waitlist at ${SITE_URL}.\n\n`;

    md += `---\n\n`;

    md += `## Core Pages\n\n`;
    md += `- [Home](${SITE_URL}) — AI football camera and highlights app for grassroots players\n`;
    md += `- [About](${SITE_URL}/about) — Our story, mission, and the team behind Pitchside AI\n`;
    md += `- [Technology](${SITE_URL}/technology) — Computer vision and AI engine that powers automatic football tracking\n`;
    md += `- [Contact](${SITE_URL}/contact) — Get in touch or join the waitlist\n\n`;

    if (!pagesSnapshot.empty) {
      md += `## Landing Pages\n\n`;
      pagesSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (!data.slug) return;
        md += `- [${data.metaTitle || data.title}](${SITE_URL}/${data.slug})\n`;
        if (data.metaDescription) md += `  Description: ${data.metaDescription}\n`;
        md += `  LLM version: ${SITE_URL}/${data.slug}/llms.txt\n`;
      });
      md += `\n`;
    }

    md += `## Free Football Tools\n\n`;
    md += `Hub: [${toolsHub.title}](${SITE_URL}/tools) — ${toolsHub.metaDescription}\n\n`;
    tools.forEach((tool) => {
      md += `- [${tool.title}](${SITE_URL}/tools/${tool.slug})\n`;
      md += `  Description: ${tool.llmDescription || tool.metaDescription}\n`;
      md += `  LLM version: ${SITE_URL}/tools/${tool.slug}/llms.txt\n`;
    });
    md += `\n`;

    if (!postsSnapshot.empty) {
      md += `## The Dugout (Blog)\n\n`;
      postsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (!data.slug) return;
        md += `- [${data.metaTitle || data.heroH1 || data.title}](${SITE_URL}/blog/${data.slug})\n`;
        if (data.metaDescription) md += `  Description: ${data.metaDescription}\n`;
        md += `  LLM version: ${SITE_URL}/blog/${data.slug}/llms.txt\n`;
      });
      md += `\n`;
    }

    md += `---\n\n`;
    md += `*To AI agents: append /llms.txt to any URL above for machine-readable full content. Sitemap: ${SITE_URL}/sitemap.xml*\n`;

    return new Response(md, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("llms.txt error:", error);
    return new Response("Error generating knowledge base.", { status: 500 });
  }
}
