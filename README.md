# Pitchside Web

Next.js App Router site for Pitchside AI: marketing pages, SEO landing pages, editorial articles, free tools, admin-managed CMS content and Firebase-backed media/content workflows.

## Stack

- Next.js `16.2.4` App Router
- React `19.2.4`
- Firebase client SDK for Auth, Firestore and Storage
- Tailwind CSS v4 via `@tailwindcss/postcss`
- Framer Motion, Lenis and lucide-react

Before changing Next.js routing, metadata, sitemap or config behaviour, read the matching local docs in `node_modules/next/dist/docs/`. This repo intentionally uses a newer Next version with breaking API changes.

## Local Setup

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Use `.env.local` locally. Never commit real values.

Required public Firebase variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Optional:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `QA_BASE_URL`
- `GOOGLE_APPLICATION_CREDENTIALS` for local CMS migration tooling only

## Commands

```bash
npm run dev
npm run lint
npm run build
```

The repository also includes operational scripts:

- `scripts/audit-live.mjs` - crawl selected live pages.
- `scripts/parse-downloaded-audit.mjs` - parse downloaded audit HTML.
- `scripts/qa-local-pages.mjs` - run local Playwright checks against key pages.
- `scripts/export-cms-backups.mjs` - export selected CMS docs to an ignored local backup directory.
- `scripts/apply-firestore-cms-patch.mjs` - apply reviewed CMS migration payloads.

## Firebase and CMS Architecture

The app reads CMS content from Firestore collections such as `pages`, `posts`, `tools` and `settings`. Public pages are rendered by App Router routes and client display components; admin editing lives under `src/app/admin`.

Firebase client initialisation is in `src/lib/firebase.js`, exporting:

- `db`
- `auth`
- `storage`

Do not use the live admin panel or production Firestore during repository hygiene work unless the task explicitly requires it.

## CMS Migrations

Reviewed migration payloads live in `migrations/cms/`.

Always run a dry run first:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json \
  node scripts/apply-firestore-cms-patch.mjs migrations/cms/applied/example.json --dry-run
```

Production writes require an explicit confirmation flag:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json \
  node scripts/apply-firestore-cms-patch.mjs migrations/cms/applied/example.json --confirm-production-write
```

The runner prints document IDs and changed/deleted fields before writes. It also creates Firestore backup records before production updates.

## Deployment

Deploy from reviewed pull requests only. Do not merge directly into `main`.

Production checks before deploy:

- `npm ci`
- `npm run lint`
- `npm run build`
- key-route smoke test
- sitemap generation
- image-reference validation
- redirect validation

## Image Standards

- Use WebP for photographic or large visual assets when transparency and browser support allow it.
- Keep PNG/SVG for icons, logos and assets where exact transparency or vector behaviour matters.
- File extensions must match actual MIME type.
- Social image: `public/og-image.png`, 1200×630.
- Do not delete a public asset until source, metadata, CMS patches, backups and email references have been checked.
- Keep generated reports under ignored paths unless they are intentionally committed as documentation.

## Content Workflow

- Product and editorial copy can be stored in Firestore and rendered dynamically.
- Do not publish internal editorial instructions as customer copy.
- Keep pricing sourced from `src/lib/pricing.js`.
- Preserve indexed URLs.
- Use `Product Status` as the public source for launch state and current limitations.

## Security Precautions

- Never commit service-account JSON, passwords, recovery codes or real environment values.
- Keep generated CMS backups out of Git.
- Do not expose Firestore rule internals, secrets or implementation details in public content.
- Use dry-run migrations and explicit confirmation for production writes.
- Treat public-form spam/rate limiting, App Check and Firestore rules as production infrastructure concerns requiring owner review.
