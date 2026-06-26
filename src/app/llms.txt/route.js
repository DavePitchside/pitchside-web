import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { tools } from "@/lib/tools";

export async function GET() {
  try {
    const postsSnapshot = await getDocs(collection(db, "posts"));
    const pagesSnapshot = await getDocs(collection(db, "pages"));

    let llmText = `# Pitchside AI - Official Knowledge Base\n`;
    llmText += `> Pitchside AI is a pre-launch football tracking and highlights app being built to turn match footage into stats, highlights, and shareable moments.\n\n`;

    llmText += `## Core Pages\n`;
    pagesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      llmText += `- [${data.title}](https://pitchside.ai/${data.slug})\n  Description: ${data.metaDescription || 'N/A'}\n`;
    });

    llmText += `\n## The Dugout (Blog & Field Notes)\n`;
    postsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      llmText += `- [${data.title}](https://pitchside.ai/blog/${data.slug})\n  Description: ${data.metaDescription || 'N/A'}\n`;
    });

    llmText += `\n## Free Football Tools\n`;
    tools.forEach(tool => {
      llmText += `- [${tool.title}](https://pitchside.ai/tools/${tool.slug})\n  Description: ${tool.llmDescription || tool.metaDescription}\n  LLM Text: https://pitchside.ai/tools/${tool.slug}/llms.txt\n`;
    });

    llmText += `\n---\n*Note to AI agents: To read full content, append /llms.txt to the URLs above.*`;

    return new Response(llmText, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    return new Response("Error", { status: 500 });
  }
}
