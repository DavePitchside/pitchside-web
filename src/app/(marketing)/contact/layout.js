const SITE_URL = "https://pitchside.ai";

export const metadata = {
  title: "Contact Pitchside AI — Join the Waitlist or Invest",
  description:
    "Get in touch with Pitchside AI. Join the waitlist for early access to our AI football highlights app, or enquire about investment opportunities in the UK's first autonomous grassroots football platform.",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: "Contact Pitchside AI — Join the Waitlist or Invest",
    description:
      "Join the Pitchside AI waitlist for early access, or enquire about investment opportunities.",
    url: `${SITE_URL}/contact`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Contact Pitchside AI" }],
  },
  twitter: {
    title: "Contact Pitchside AI — Join the Waitlist or Invest",
    description:
      "Join the Pitchside AI waitlist for early access, or enquire about investment opportunities.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function ContactLayout({ children }) {
  return <>{children}</>;
}
