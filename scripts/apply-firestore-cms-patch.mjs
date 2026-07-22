import crypto from "crypto";
import fs from "fs";

const [,, patchPath] = process.argv;

if (!patchPath) {
  console.error("Usage: GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json node scripts/apply-firestore-cms-patch.mjs path/to/patch.json");
  process.exit(1);
}

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credentialsPath) {
  console.error("Set GOOGLE_APPLICATION_CREDENTIALS to a local Firebase service-account JSON path.");
  process.exit(1);
}

const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
const patch = JSON.parse(fs.readFileSync(patchPath, "utf8"));
const projectId = credentials.project_id;

const allowedCollections = new Set(["pages", "posts", "tools", "settings"]);

function base64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(JSON.stringify({
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  }));
  const signingInput = `${header}.${claim}`;
  const signature = crypto.sign("RSA-SHA256", Buffer.from(signingInput), credentials.private_key);
  const assertion = `${signingInput}.${base64Url(signature)}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error(`OAuth failed: ${response.status} ${await response.text()}`);
  }

  return (await response.json()).access_token;
}

function encodeValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (Number.isInteger(value)) return { integerValue: String(value) };
  if (typeof value === "number") return { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeValue) } };
  if (typeof value === "object") {
    return {
      mapValue: {
        fields: Object.fromEntries(Object.entries(value).map(([key, item]) => [key, encodeValue(item)])),
      },
    };
  }
  return { stringValue: String(value) };
}

function decodeValue(value) {
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(decodeValue);
  if ("mapValue" in value) return decodeFields(value.mapValue.fields || {});
  return null;
}

function decodeFields(fields = {}) {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]));
}

function encodeDocument(data) {
  return { fields: Object.fromEntries(Object.entries(data).map(([key, value]) => [key, encodeValue(value)])) };
}

function documentUrl(collectionName, docId) {
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}/${docId}`;
}

async function firestoreFetch(token, url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Firestore ${response.status}: ${await response.text()}`);
  return response.json();
}

async function findBySlug(token, collectionName, slug) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
  const response = await firestoreFetch(token, url, {
    method: "POST",
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: collectionName }],
        where: {
          fieldFilter: {
            field: { fieldPath: "slug" },
            op: "EQUAL",
            value: { stringValue: slug },
          },
        },
        limit: 1,
      },
    }),
  });
  const found = response.find((item) => item.document)?.document;
  if (!found) return null;
  return { docId: found.name.split("/").pop(), document: found };
}

async function applyOperation(token, operation) {
  if (!allowedCollections.has(operation.collection)) throw new Error(`Unsupported collection: ${operation.collection}`);
  if (operation.delete || operation.remove) throw new Error("Delete operations are not supported.");
  if (!operation.merge || typeof operation.merge !== "object" || Array.isArray(operation.merge)) throw new Error("Each operation needs a merge object.");

  const target = operation.docId
    ? { docId: operation.docId, document: await firestoreFetch(token, documentUrl(operation.collection, operation.docId)) }
    : await findBySlug(token, operation.collection, operation.slug);
  const docId = target?.docId || operation.createDocId || `${operation.slug}-${Date.now()}`;
  const existingData = target?.document?.fields ? decodeFields(target.document.fields) : null;

  const backupId = `${operation.collection}-${docId}-${Date.now()}`;
  await firestoreFetch(token, documentUrl("cmsRevisionBackups", backupId), {
    method: "PATCH",
    body: JSON.stringify(encodeDocument({
      label: patch.label,
      collection: operation.collection,
      docId,
      slug: operation.slug || operation.merge.slug || existingData?.slug || null,
      backupType: existingData ? "before-update" : "before-create",
      dataJson: JSON.stringify(existingData, null, 2),
      createdAt: new Date().toISOString(),
      createdBy: patch.operator || "codex-firestore-rest-runner",
    })),
  });

  const merge = {
    ...operation.merge,
    updatedAt: new Date().toISOString(),
    ...(existingData ? {} : { createdAt: new Date().toISOString() }),
  };
  const updateMask = Object.keys(merge).map((field) => `updateMask.fieldPaths=${encodeURIComponent(field)}`).join("&");
  await firestoreFetch(token, `${documentUrl(operation.collection, docId)}?${updateMask}`, {
    method: "PATCH",
    body: JSON.stringify(encodeDocument(merge)),
  });

  return { collection: operation.collection, docId, slug: operation.slug || operation.merge.slug || existingData?.slug || null };
}

if (!patch.label || !Array.isArray(patch.operations)) {
  throw new Error("Patch JSON must contain label and operations.");
}

const token = await getAccessToken();
const applied = [];
for (const operation of patch.operations) {
  applied.push(await applyOperation(token, operation));
}

console.log(JSON.stringify({ label: patch.label, applied }, null, 2));
