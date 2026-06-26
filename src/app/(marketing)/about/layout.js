const SITE_URL = "https://pitchside.ai";

export const metadata = {
  title: "About Pitchside AI — Our Story & Mission",
  description:
    "Pitchside AI was founded by Dave Coombs to give amateur and grassroots footballers the same AI-powered highlights and stats that professional players get. No wearables. No expensive kit.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About Pitchside AI — Our Story & Mission",
    description:
      "Pitchside AI was founded by Dave Coombs to give amateur and grassroots footballers AI-powered highlights and stats. No wearables required.",
    url: `${SITE_URL}/about`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "About Pitchside AI" }],
  },
  twitter: {
    title: "About Pitchside AI — Our Story & Mission",
    description:
      "Pitchside AI was founded by Dave Coombs to give amateur and grassroots footballers AI-powered highlights and stats.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function AboutLayout({ children }) {
  return <>{children}</>;
}
