const SITE_URL = "https://pitchside.ai";

export const metadata = {
  title: "The Dugout — Football Insights & AI News",
  description:
    "The Pitchside AI blog. In-depth articles on grassroots football, AI sports technology, player development, 5-a-side tips, and the latest from the Pitchside platform.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "The Dugout — Football Insights & AI News",
    description:
      "In-depth articles on grassroots football, AI sports technology, and the latest from Pitchside AI.",
    url: `${SITE_URL}/blog`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Pitchside AI Blog" }],
  },
  twitter: {
    title: "The Dugout — Football Insights & AI News",
    description:
      "In-depth articles on grassroots football, AI sports technology, and the latest from Pitchside AI.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function BlogLayout({ children }) {
  return <>{children}</>;
}
