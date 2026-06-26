import { SITE_URL, tools, toolsHub } from "@/lib/tools";

export const dynamic = "force-static";

export async function GET() {
  let text = `# ${toolsHub.title}\n\n`;
  text += `${toolsHub.metaDescription}\n\n`;
  text += `## Tools\n`;
  tools.forEach((tool) => {
    text += `- [${tool.title}](${SITE_URL}/tools/${tool.slug})\n  Description: ${tool.llmDescription || tool.metaDescription}\n  LLM version: ${SITE_URL}/tools/${tool.slug}/llms.txt\n`;
  });

  return new Response(text, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
