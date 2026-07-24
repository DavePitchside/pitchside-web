import CmsPageRenderer, { generateCmsMetadata } from "@/components/cms/CmsPageRenderer";

export const dynamic = "force-dynamic";

const ROUTE_PATH = "/technology/football-recording-setup";

export function generateMetadata() {
  return generateCmsMetadata(ROUTE_PATH);
}

export default function FootballRecordingSetupPage() {
  return <CmsPageRenderer routePath={ROUTE_PATH} />;
}
