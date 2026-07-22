import { notFound } from "next/navigation";
import EeatPage from "@/components/EeatPage";
import { authors } from "@/lib/eeatPages";

const SITE_URL = "https://pitchside.ai";

export function generateStaticParams() {
  return Object.keys(authors).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = authors[slug];
  if (!page) return {};

  return {
    title: `${page.title} — Pitchside AI`,
    description: page.description,
    alternates: { canonical: `${SITE_URL}${page.canonical}` },
    openGraph: {
      title: `${page.title} — Pitchside AI`,
      description: page.description,
      url: `${SITE_URL}${page.canonical}`,
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: page.title }],
    },
  };
}

export default async function AuthorPage({ params }) {
  const { slug } = await params;
  const page = authors[slug];
  if (!page) notFound();

  return <EeatPage page={page} isAuthor />;
}
