import EeatPage from "@/components/EeatPage";
import { eeatPages } from "@/lib/eeatPages";
import PitchsideVideoEvidence from "@/components/cms/PitchsideVideoEvidence";
import { videoAssets } from "@/lib/cms/videoAssets";

const SITE_URL = "https://pitchside.ai";
const page = eeatPages["product-status"];

export const metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: `${SITE_URL}${page.canonical}` },
  openGraph: { title: page.title, description: page.description, url: `${SITE_URL}${page.canonical}` },
};

export default function ProductStatusPage() {
  return <><EeatPage page={page} /><div className="bg-[#F4F3EF] px-6 pb-20 md:px-12"><div className="mx-auto max-w-5xl"><PitchsideVideoEvidence asset={videoAssets["private-beta-walkthrough"]} /></div></div></>;
}
