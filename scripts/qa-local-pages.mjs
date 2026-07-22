import { chromium } from "playwright";

const base = process.env.QA_BASE_URL || "http://localhost:3000";
const pages = ["/", "/pricing", "/technology", "/technology/football-recording-setup", "/product-status", "/affiliate-disclosure"];
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch({ headless: true });
const results = [];

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });

  for (const route of pages) {
    const page = await context.newPage();
    const response = await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(1500);
    const h1s = await page.locator("h1").evaluateAll((nodes) => nodes.map((node) => node.innerText.trim()).filter(Boolean));
    const title = await page.title();
    const metaDescription = await page.locator('meta[name="description"]').getAttribute("content").catch(() => null);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href").catch(() => null);
    const screenshot = `audits/${viewport.name}${route === "/" ? "-home" : route.replaceAll("/", "-")}.png`;
    await page.screenshot({ path: screenshot, fullPage: false });
    results.push({ route, viewport: viewport.name, status: response?.status(), title, metaDescription, canonical, h1Count: h1s.length, h1s, screenshot });
    await page.close();
  }

  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
