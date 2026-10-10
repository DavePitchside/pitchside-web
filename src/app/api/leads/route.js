import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Receives lead submissions from the header modal and the /contact form.
// 1. Saves the lead to the Firestore "leads" collection (the admin table reads this).
// 2. Forwards it to the Google Apps Script web app, which appends a Sheet row
//    and emails a notification. The webhook URL and secret stay server-side.

const INTENTS = new Set(["waitlist", "invest"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (value, max) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

// TEMPORARY diagnostic: reports whether the Sheet webhook is configured and
// reachable, without revealing values or writing a row. Remove before merge.
export async function GET() {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL || "";
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET || "";
  const { createHash } = await import("node:crypto");
  const report = {
    urlSet: Boolean(url),
    urlEndsWithExec: url.trim().endsWith("/exec"),
    urlHasWhitespace: url !== url.trim(),
    secretSet: Boolean(secret),
    secretLength: secret.length,
    secretHasWhitespace: secret !== secret.trim(),
    secretHashPrefix: secret ? createHash("sha256").update(secret).digest("hex").slice(0, 8) : null,
  };
  if (url) {
    try {
      const res = await fetch(url.trim(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: "diagnostic-probe" }),
        signal: AbortSignal.timeout(8000),
      });
      report.probeStatus = res.status;
      report.probeBody = (await res.text()).slice(0, 200);
    } catch (error) {
      report.probeError = String(error);
    }
  }
  return Response.json(report);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const lead = {
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    message: clean(body.message, 5000),
    intent: INTENTS.has(body.intent) ? body.intent : "waitlist",
    sourcePage: clean(body.sourcePage, 300),
    sourceUrl: clean(body.sourceUrl, 1000),
    sourcePlacement: clean(body.sourcePlacement, 200),
    sourceComponent: clean(body.sourceComponent, 200),
    createdAt: new Date().toISOString(),
  };

  if (!lead.name || !EMAIL_RE.test(lead.email)) {
    return Response.json({ error: "Name and a valid email are required" }, { status: 400 });
  }

  // Firestore is the source of truth: if this fails, the visitor sees an error.
  try {
    await addDoc(collection(db, "leads"), lead);
  } catch (error) {
    console.error("Lead save failed:", error);
    return Response.json({ error: "Could not save lead" }, { status: 500 });
  }

  // The Sheet and email are best-effort: a failure here is logged, not shown.
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
  if (webhookUrl && secret) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, secret }),
        signal: AbortSignal.timeout(8000),
      });
      const result = await res.json().catch(() => null);
      if (!result?.ok) console.error("Sheet webhook rejected lead:", result);
    } catch (error) {
      console.error("Sheet webhook failed:", error);
    }
  } else {
    console.warn("Sheet webhook not configured; lead saved to Firestore only.");
  }

  return Response.json({ ok: true });
}
