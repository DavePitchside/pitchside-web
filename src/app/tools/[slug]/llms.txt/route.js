import { contentBlocksToMarkdown, getToolBySlug, SITE_URL, stripHtml, toolSlugs } from "@/lib/tools";

export function generateStaticParams() {
  return toolSlugs.map((slug) => ({ slug }));
}

export async function GET(request, { params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return new Response("Tool not found.", { status: 404 });

  let text = `# ${tool.title}\n\n`;
  text += `URL: ${SITE_URL}/tools/${tool.slug}\n`;
  text += `Description: ${tool.llmDescription || tool.metaDescription}\n\n`;
  text += `Product context: Pitchside is pre-launch. Pitchside AI is being built to turn match footage into stats, highlights and shareable moments.\n\n`;
  text += `## Quick Answer\n${tool.aeoQuickAnswer}\n\n`;
  text += `## Tool Function\n${tool.intro}\n\n`;
  text += `## Page Content\n${contentBlocksToMarkdown(tool.contentBlocks)}\n\n`;
  text += `## FAQs\n`;
  tool.faqs.forEach((faq) => {
    text += `Q: ${faq.question}\nA: ${stripHtml(faq.answer)}\n\n`;
  });

  return new Response(text, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
