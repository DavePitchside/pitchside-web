const SITE_URL = "https://pitchside.ai";

export const metadata = {
  title: "Pitchside Pricing: Free and Paid Football App Plans",
  description:
    "Compare Pitchside Free and Paid launch plans. Start with one monthly recording or get weekly recording and Personal Clips from £99 annually.",
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: "Pitchside Pricing: Free and Paid Football App Plans",
    description:
      "Compare Pitchside Free and Paid launch plans. Start with one monthly recording or get weekly recording and Personal Clips from £99 annually.",
    url: `${SITE_URL}/pricing`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Pitchside AI pricing" }],
  },
  twitter: {
    title: "Pitchside Pricing: Free and Paid Football App Plans",
    description:
      "Compare Pitchside Free and Paid launch plans. Start with one monthly recording or get weekly recording and Personal Clips from £99 annually.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function PricingLayout({ children }) {
  return <>{children}</>;
}
