const SITE_URL = "https://pitchside.ai";

export const metadata = {
  title: "Technology — The AI Engine Behind Pitchside",
  description:
    "Pitchside AI uses spatial computer vision and autonomous event detection to track every goal, assist, tackle, and save from standard smartphone footage. No GPS vests. No camera rigs. 98% accuracy.",
  alternates: { canonical: `${SITE_URL}/technology` },
  openGraph: {
    title: "Technology — The AI Engine Behind Pitchside",
    description:
      "Pitchside AI uses spatial computer vision to track every goal, assist, tackle, and save from standard smartphone footage. No GPS vests. 98% accuracy.",
    url: `${SITE_URL}/technology`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Pitchside AI Technology" }],
  },
  twitter: {
    title: "Technology — The AI Engine Behind Pitchside",
    description:
      "Spatial computer vision. Autonomous event detection. 98% accuracy. No hardware required.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function TechnologyLayout({ children }) {
  return <>{children}</>;
}
