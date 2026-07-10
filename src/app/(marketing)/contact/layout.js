const SITE_URL = "https://pitchside.ai";

export const metadata = {
  title: "Contact Us — Join the Waitlist or Invest",
  description:
    "Get in touch with Pitchside AI. Join the waitlist for private-beta access to our football highlights and analysis app, or enquire about investment opportunities.",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: "Contact Us — Join the Waitlist or Invest",
    description:
      "Join the Pitchside AI waitlist for early access, or enquire about investment opportunities.",
    url: `${SITE_URL}/contact`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Contact Pitchside AI" }],
  },
  twitter: {
    title: "Contact Us — Join the Waitlist or Invest",
    description:
      "Join the Pitchside AI waitlist for early access, or enquire about investment opportunities.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function ContactLayout({ children }) {
  return <>{children}</>;
}
