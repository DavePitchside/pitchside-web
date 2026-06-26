const SITE_URL = "https://pitchside.ai";

export const metadata = {
  title: "Privacy Policy",
  description: "Read Pitchside AI's privacy policy to understand how we collect, use, and protect your personal data.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: false },
};

export default function PrivacyLayout({ children }) {
  return <>{children}</>;
}
