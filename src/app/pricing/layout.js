const SITE_URL = "https://pitchside.ai";

export const metadata = {
  title: "Pricing for Grassroots Football",
  description:
    "Compare Pitchside AI free, weekly, monthly and annual launch pricing for grassroots football stats, highlights and player moments.",
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: "Pricing for Grassroots Football",
    description:
      "Compare Pitchside AI free, weekly, monthly and annual launch pricing for grassroots football stats, highlights and player moments.",
    url: `${SITE_URL}/pricing`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Pitchside AI pricing" }],
  },
  twitter: {
    title: "Pricing for Grassroots Football",
    description:
      "Compare Pitchside AI free, weekly, monthly and annual launch pricing for grassroots football stats, highlights and player moments.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function PricingLayout({ children }) {
  return <>{children}</>;
}
