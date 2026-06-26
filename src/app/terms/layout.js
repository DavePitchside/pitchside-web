const SITE_URL = "https://pitchside.ai";

export const metadata = {
  title: "Terms of Service",
  description: "Read the Pitchside AI terms of service to understand your rights and responsibilities when using our platform.",
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: true, follow: false },
};

export default function TermsLayout({ children }) {
  return <>{children}</>;
}
