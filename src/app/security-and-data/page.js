import EeatPage from "@/components/EeatPage";
import { eeatPages } from "@/lib/eeatPages";

const SITE_URL = "https://pitchside.ai";
const page = eeatPages["security-and-data"];

export const metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: `${SITE_URL}${page.canonical}` },
  openGraph: { title: page.title, description: page.description, url: `${SITE_URL}${page.canonical}` },
};

export default function SecurityAndDataPage() {
  return <EeatPage page={page} />;
}
