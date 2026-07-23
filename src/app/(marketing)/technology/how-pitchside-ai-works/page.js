import TechnologySubpage, { generateMetadata as generateTechnologyMetadata } from "../[slug]/page";

const params = Promise.resolve({ slug: "how-pitchside-ai-works" });

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return generateTechnologyMetadata({ params });
}

export default function HowPitchsideAiWorksPage() {
  return <TechnologySubpage params={params} />;
}
