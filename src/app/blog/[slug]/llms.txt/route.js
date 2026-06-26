import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(request, { params }) {
  // Await params in Next.js 15
  const { slug } = await params;

  try {
    const q = query(collection(db, "posts"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return new Response("Post not found.", { status: 404 });
    }

    const post = querySnapshot.docs[0].data();

    // Strip HTML tags to make it pure markdown/text for the LLM
    const cleanContent = post.content ? post.content.replace(/<[^>]*>?/gm, '') : '';

    let llmText = `# ${post.title}\n\n`;
    
    // --- ADDED: META INFORMATION BLOCK ---
    llmText += `## Meta Information\n`;
    llmText += `- **Title:** ${post.metaTitle || post.title || 'N/A'}\n`;
    llmText += `- **Description:** ${post.metaDescription || 'N/A'}\n`;
    llmText += `- **Category:** ${post.category || 'Article'}\n`;
    llmText += `- **Date:** ${post.date || 'Recent'}\n\n`;
    
    llmText += `## Article Content\n`;
    llmText += `${cleanContent}\n`;

    return new Response(llmText, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (error) {
    console.error("Error generating post llms.txt:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}