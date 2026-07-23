import crypto from "crypto";
import fs from "fs";

const args = process.argv.slice(2);
const patchPath = args.find((arg) => !arg.startsWith("--"));
const dryRun = args.includes("--dry-run");
const confirmedProductionWrite = args.includes("--confirm-production-write");

if (!patchPath) {
  console.error("Usage: GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json node scripts/apply-firestore-cms-patch.mjs path/to/patch.json --dry-run");
  console.error("Production writes require --confirm-production-write.");
  process.exit(1);
}

if (!dryRun && !confirmedProductionWrite) {
  console.error("Refusing to write. Run with --dry-run first, then add --confirm-production-write for production writes.");
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
const importOnlyFields = new Set(["internalLinks"]);
const collectionBlockedFields = {
  pages: new Set(["contentBlocksJson"]),
  posts: new Set(["contentBlocksJson"]),
  tools: new Set(["primaryImage", "thumbnail", "heroBackground"]),
};
const blockedPublicationPhrases = [
  "do not publish",
  "this page should",
  "the site must",
  "approved launch",
  "canonical source",
  "in this draft",
  "should live",
  "should confirm",
  "designed to support searches",
  "the final list must",
  "this page sells",
  "approved product flow",
  "do not claim",
  "do not promise",
  "needs confirmation",
  "publish a tested",
  "describe only",
  "do not answer until",
];

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
  return { fields: Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined).map(([key, value]) => [key, encodeValue(value)])) };
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

function walkStrings(value, path = "content", result = []) {
  if (typeof value === "string") {
    result.push({ path, value });
    return result;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkStrings(item, `${path}[${index}]`, result));
    return result;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => walkStrings(item, `${path}.${key}`, result));
  }
  return result;
}

function validatePatchData(data) {
  return walkStrings(data).flatMap(({ path, value }) => {
    const normalized = value.toLowerCase();
    return blockedPublicationPhrases
      .filter((phrase) => normalized.includes(phrase))
      .map((phrase) => ({ path, phrase }));
  });
}

function sanitizeMerge(collectionName, merge) {
  const blockedFields = collectionBlockedFields[collectionName] || new Set();
  return Object.fromEntries(
    Object.entries(merge)
      .filter(([field]) => !importOnlyFields.has(field) && !blockedFields.has(field))
      .filter(([, value]) => value !== undefined)
  );
}

async function planOperation(token, operation) {
  if (!allowedCollections.has(operation.collection)) throw new Error(`Unsupported collection: ${operation.collection}`);
  if (operation.delete || operation.remove) throw new Error("Delete operations are not supported.");
  const mergeObject = operation.merge || {};
  if (typeof mergeObject !== "object" || Array.isArray(mergeObject)) throw new Error("Operation merge data must be an object when provided.");
  if (!Object.keys(mergeObject).length && !operation.deleteFields?.length) {
    throw new Error("Each operation needs merge data or deleteFields.");
  }

  const target = operation.docId
    ? { docId: operation.docId, document: await firestoreFetch(token, documentUrl(operation.collection, operation.docId)) }
    : await findBySlug(token, operation.collection, operation.slug);
  const docId = target?.docId || operation.createDocId || `${operation.slug}-${Date.now()}`;
  const existingData = target?.document?.fields ? decodeFields(target.document.fields) : null;
  const sanitizedMerge = sanitizeMerge(operation.collection, mergeObject);
  const deleteFields = [...new Set([...(operation.deleteFields || []), ...Object.keys(mergeObject).filter((field) => importOnlyFields.has(field))])];
  const validationIssues = validatePatchData(sanitizedMerge);
  if (validationIssues.length) {
    throw new Error(`Patch contains blocked editorial instructions: ${JSON.stringify(validationIssues.slice(0, 12), null, 2)}`);
  }

  const timestamp = new Date().toISOString();
  const merge = {
    ...sanitizedMerge,
    updatedAt: timestamp,
    ...(existingData ? {} : { createdAt: timestamp }),
  };
  const updateFields = Object.keys(merge);
  const updateMaskFields = [...new Set([...updateFields, ...deleteFields])];

  return {
    collection: operation.collection,
    docId,
    slug: operation.slug || mergeObject.slug || existingData?.slug || null,
    exists: Boolean(existingData),
    existingData,
    merge,
    deleteFields,
    updateMaskFields,
  };
}

async function applyPlannedOperation(token, plannedOperation) {
  const backupId = `${plannedOperation.collection}-${plannedOperation.docId}-${Date.now()}`;
  await firestoreFetch(token, documentUrl("cmsRevisionBackups", backupId), {
    method: "PATCH",
    body: JSON.stringify(encodeDocument({
      label: patch.label,
      collection: plannedOperation.collection,
      docId: plannedOperation.docId,
      slug: plannedOperation.slug,
      backupType: plannedOperation.existingData ? "before-update" : "before-create",
      dataJson: JSON.stringify(plannedOperation.existingData, null, 2),
      createdAt: new Date().toISOString(),
      createdBy: patch.operator || "codex-firestore-rest-runner",
    })),
  });

  const updateMask = plannedOperation.updateMaskFields.map((field) => `updateMask.fieldPaths=${encodeURIComponent(field)}`).join("&");
  await firestoreFetch(token, `${documentUrl(plannedOperation.collection, plannedOperation.docId)}?${updateMask}`, {
    method: "PATCH",
    body: JSON.stringify(encodeDocument(plannedOperation.merge)),
  });

  return {
    collection: plannedOperation.collection,
    docId: plannedOperation.docId,
    slug: plannedOperation.slug,
    changedFields: Object.keys(plannedOperation.merge),
    deletedFields: plannedOperation.deleteFields,
  };
}

if (!patch.label || !Array.isArray(patch.operations)) {
  throw new Error("Patch JSON must contain label and operations.");
}

const token = await getAccessToken();
const planned = [];
for (const operation of patch.operations) {
  planned.push(await planOperation(token, operation));
}

const planOutput = planned.map((operation) => ({
  collection: operation.collection,
  docId: operation.docId,
  slug: operation.slug,
  exists: operation.exists,
  mergeFields: Object.keys(operation.merge),
  deleteFields: operation.deleteFields,
}));

if (dryRun) {
  console.log(JSON.stringify({ label: patch.label, mode: "dry-run", operations: planOutput }, null, 2));
  process.exit(0);
}

const applied = [];
for (const operation of planned) {
  applied.push(await applyPlannedOperation(token, operation));
}

console.log(JSON.stringify({ label: patch.label, mode: "write", applied }, null, 2));
