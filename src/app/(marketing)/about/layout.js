const SITE_URL = "https://pitchside.ai";

export const metadata = {
  title: "About Us — Our Story & Mission",
  description:
    "Pitchside AI was founded to help amateur and grassroots footballers review phone-recorded matches with beta highlights, stats and player moments. No wearables.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About Us — Our Story & Mission",
    description:
      "Pitchside AI was founded to help amateur and grassroots footballers review phone-recorded matches with beta highlights, stats and player moments.",
    url: `${SITE_URL}/about`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "About Pitchside AI" }],
  },
  twitter: {
    title: "About Us — Our Story & Mission",
    description:
      "Pitchside AI was founded to help amateur and grassroots footballers review phone-recorded matches with beta highlights, stats and player moments.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function AboutLayout({ children }) {
  return <>{children}</>;
}
