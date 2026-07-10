import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import SquareScannerCursor from "@/components/SquareScannerCursor";
import { PRODUCT_STATUS_NOTICE } from "@/lib/productStatus";

const alphaHeadline = localFont({
  src: "./fonts/AlphaHeadline-Regular.ttf",
  variable: "--font-alpha",
  display: "swap",
});

const roobert = localFont({
  src: [
    { path: "./fonts/Roobert-Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/Roobert-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/Roobert-Medium.otf", weight: "500", style: "normal" },
  ],
  variable: "--font-roobert",
  display: "swap",
});

const SITE_URL = "https://pitchside.ai";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pitchside AI — AI Football Camera & Highlights App",
    template: "%s | Pitchside AI",
  },
  description:
    "Pitchside AI is a private-beta football analysis platform being developed to turn phone-recorded grassroots matches into stats, highlights and player moments.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: "Pitchside AI",
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pitchside AI — AI Football Camera & Highlights App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@pitchsideai",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

function SiteSchema() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Pitchside AI",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
        width: 400,
        height: 400,
      },
      sameAs: ["https://www.linkedin.com/company/pitchside-ai"],
      foundingDate: "2024",
      description:
        PRODUCT_STATUS_NOTICE,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Pitchside AI",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${alphaHeadline.variable} ${roobert.variable}`}>
      <head>
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
      </head>
      <body className="antialiased bg-zinc-950">
        <SiteSchema />
        <SmoothScroll />
        <SquareScannerCursor />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
