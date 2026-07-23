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
    title: page.title,
    description: page.description,
    alternates: { canonical: `${SITE_URL}${page.canonical}` },
    openGraph: {
      title: page.title,
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
  const pageUrl = `${SITE_URL}${page.canonical}`;
  const sameAs = page.profileUrl ? [page.profileUrl] : [];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": pageUrl,
      url: pageUrl,
      name: page.title,
      description: page.description,
      mainEntity: {
        "@type": "Person",
        name: page.title,
        url: pageUrl,
        sameAs,
        worksFor: {
          "@type": "Organization",
          name: "Pitchside AI",
          url: SITE_URL,
        },
      },
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <EeatPage page={page} isAuthor />
    </>
  );
}
