# Repository Cleanup Report

Date: 23 July 2026  
Branch: `codex/repo-hygiene-image-optimization`

## Baseline

- Starting branch: `main`
- Starting commit: `7b8100ec903519fd0a1ba72e4034d7cc146d336b`
- Pull status: `git pull --ff-only origin main` returned already up to date.
- Node: `v24.18.0`
- npm: `11.16.0`
- Repository size including dependencies/build artifacts: `3.0G`
- Public asset size: `19M`
- Audits directory size: `6.6M`
- CMS backup directory size: `420K`
- CMS patch directory size: `76K`

## Baseline Validation

- `npm ci`: passed. npm reported pending install-script approval warnings for transitive packages; no install failure occurred.
- `npm run lint`: passed.
- `npm run build`: entered `Creating an optimized production build ...` and produced no further output for more than two minutes. The baseline run was interrupted with exit code `130` and is recorded as an unresolved local Turbopack build hang, not yet a code regression.

## Repository Map

- Production source: `src/app`, `src/components`, `src/lib`, `src/app/fonts`
- Public assets: `public`
- CMS/admin source: `src/app/admin`, `src/app/admin/PageBuilder.js`, `src/lib/cmsValidation.js`
- Sitemap/robots/metadata source: `src/app/sitemap.js`, `src/app/robots.js`, route `layout.js` files, route `page.js` files
- Reusable operational scripts: to be normalised under `scripts/`
- Generated audit files: `audits/`
- Public CMS backups: `backups/cms/`
- One-off CMS patches: `cms-patches/`
- Internal contributor documentation: `AGENTS.md`, `ARCHITECTURE_CONTEXT.md`, `CLAUDE.md`, `README.md`

## Initial Findings

- `audits/` contains generated screenshots and crawl reports that are not production inputs.
- `backups/cms/` contains CMS export data and should not be kept in the production repository.
- `cms-patches/` contains applied one-off Firestore patch JSON files; these should not be mixed with production content. Migration tooling should support documented dry runs and explicit confirmation before production writes.
- `public/logogreen.webp` and `public/logowhite.webp` have identical SHA-256 hashes, so one can become canonical after references are checked.
- `public/mockup-1.jpg`, `public/mockup-2.jpg`, `public/mockup-3.jpg`, `public/mockup-4.jpg`, `public/portrait-action.jpg`, `public/11.jpg`, and `public/2.jpg` have `.jpg` extensions but are PNG files.
- `public/email footer.png` has no repository references, but should not be deleted automatically because historic emails may reference the public URL.
- Suspected unused assets with no repository references found so far: `public/11.jpg`, `public/2.jpg`, `public/slide.png`, `public/logowhite.webp`. `public/davidcoombs.jpg` is not referenced directly, but a cutout version is used on `/about`.
- Dependencies with no runtime/source imports found so far: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `@react-three/drei`, `@react-three/fiber`, `three`, `resend`, `tw-animate-css`, `autoprefixer`. `shadcn` is referenced by `components.json`; `@phosphor-icons/react` is referenced by `components.json` as the configured icon library.

## Deletion Safety Notes

- No asset will be deleted based only on filename.
- Search scope for deletion candidates includes source code, CSS, metadata, JSON-LD, scripts, CMS patches, CMS backups and docs.
- If a public URL may have been used outside the repository, it will be documented rather than deleted.

## Completed Cleanup

- Removed tracked generated audit screenshots and crawl reports from `audits/`.
- Removed tracked public CMS export backups from `backups/cms/`.
- Moved applied CMS patch JSON from `cms-patches/` to `migrations/cms/applied/`.
- Deleted the one-off patch generator `scripts/generate-seo-cms-patch.mjs`.
- Added ignore rules for `/audits/`, `/backups/cms/`, `/tmp/` and `/reports/generated/`.
- Kept `public/email footer.png` because historic email clients may still request that public URL.
- Kept contributor documentation (`AGENTS.md`, `ARCHITECTURE_CONTEXT.md`, `CLAUDE.md`) and refreshed `ARCHITECTURE_CONTEXT.md` after dependency cleanup.

## Static Asset Decisions

Deleted after repo-wide reference checks:

- `public/11.jpg`: no source, CSS, metadata, JSON-LD, docs, migration or email-template references found.
- `public/2.jpg`: no source, CSS, metadata, JSON-LD, docs, migration or email-template references found.
- `public/slide.png`: no references found.
- `public/davidcoombs.jpg`: no references found; `/about` uses the cutout asset instead.
- `public/logowhite.webp`: byte-identical to `public/logogreen.webp`; canonical logo is `logogreen.webp`.

Converted or renamed active assets:

- `public/1.png` → `public/1.webp`
- `public/1-neon.png` → `public/1-neon.webp`
- `public/davidcoombs-cutout.png` → `public/davidcoombs-cutout.webp`
- `public/portrait-action.jpg` → `public/portrait-action.webp`
- `public/mockup-1.jpg` → `public/mockup-1.png`
- `public/mockup-2.jpg` → `public/mockup-2.png`
- `public/mockup-3.jpg` → `public/mockup-3.png`
- `public/mockup-4.jpg` → `public/mockup-4.png`

Created `public/og-image.png` at exactly `1200x630`.

Image manifest: `docs/image-optimization-manifest.json`

Size results:

- Public assets: `19M` before, `1.8M` after.
- Large active-image examples:
  - `1.png`: `1,746,782` bytes → `75,466` bytes.
  - `1-neon.png`: `6,596,468` bytes → `107,878` bytes.
  - `davidcoombs-cutout.png`: `2,549,614` bytes → `101,196` bytes.
  - `portrait-action.jpg`: `1,902,751` bytes → `22,612` bytes.

## Dependency Cleanup

Removed after import/config/script checks:

- `@aws-sdk/client-s3`
- `@aws-sdk/s3-request-presigner`
- `@phosphor-icons/react`
- `@react-three/drei`
- `@react-three/fiber`
- `three`
- `resend`
- `shadcn`
- `tw-animate-css`
- `autoprefixer`

`components.json` now uses `lucide` as the icon library. `npm ci` passed after lockfile update.

## Technical SEO and Rendering Fixes

- Added `src/lib/redirects.mjs` as the central redirect map for Next config and content-link cleanup.
- Added permanent redirects:
  - `/football-performance-analysis` → `/football-analysis-app`
  - `/football-player-tracking` → `/ai-football-analysis`
- Hardened sitemap date handling for Firestore Timestamp values, JavaScript Dates, ISO strings and missing/invalid values.
- Stopped using `new Date()` as a fallback for every static sitemap route request; static routes now use a maintained date.
- Blog index now fetches posts only and no longer mixes product landing pages into the journal listing.
- Product landing pages no longer receive generic article chrome such as reading progress, uploaded labels, executive summary framing or table-of-contents sidebars.
- Dynamic product pages now render visible `intro`, respect CMS `ctaBlock`, avoid duplicate pricing teaser rendering, and use central pricing teaser logic.
- JSON-LD image and author URLs are absolute.
- Author pages now include `ProfilePage` and `Person` schema.
- Static page titles no longer double-suffix `Pitchside AI`.
- All metadata and JSON-LD references to converted images were updated.
- `next.config.mjs` now allows image quality `72`, matching existing `next/image` usage.
- Home page fill images that logged warnings now include `sizes`.

## CMS Migration Safety

- `scripts/apply-firestore-cms-patch.mjs` now requires `--dry-run` or `--confirm-production-write`.
- Production writes are refused without explicit confirmation.
- Dry-run prints exact target documents, merge fields and delete fields.
- Supports explicit `deleteFields`.
- Strips import-only `internalLinks` after processing.
- Blocks irrelevant fields from generic collections.
- Validates patch content for internal editorial instructions before publication writes.
- `PageBuilder` strips import-only `internalLinks` from saved CMS data.
- No production Firestore migration was run during this task.

## Security and Forms Review

- Firestore rules are not versioned in this repository.
- Storage rules are not versioned in this repository.
- Public forms write directly to Firestore:
  - Header waitlist/invest modal writes to `leads`.
  - `/contact` writes to `leads`.
  - `/account-deletion` writes to `deletions`.
- No App Check setup was found in source.
- No server-side spam/rate protection was found for public forms.
- Google Analytics loads with `afterInteractive`; no consent gate was found in repo code.
- Public server-rendered routes use the Firebase client SDK and rely on Firebase Security Rules. Draft visibility cannot be proven from this repo because rules are not versioned here.
- Full collection reads still exist on server-rendered sitemap, blog listing, recommendations and LLM routes. This is acceptable for small CMS data but should be monitored for quota/performance and draft-rule safety.

## Final Validation

- `npm ci`: passed.
- `npm run lint`: passed.
- `node scripts/validate-repository.mjs`: passed with `missingAssets: 0` and `obsoleteRouteReferences: 0`.
- Rendered local route check passed for sampled desktop/server routes: status `200`, one H1, metadata present, canonical present, and local Next image sources existing.
- `/sitemap.xml`: HTTP `200`; includes `/technology/football-recording-setup`; obsolete redirect sources are not present.
- `/football-performance-analysis`: `308` to `/football-analysis-app`.
- `/football-player-tracking`: `308` to `/ai-football-analysis`.
- `public/og-image.png`: HTTP `200`, `image/png`, `1200x630`.
- Playwright screenshot QA could launch only with escalation and then hung during screenshot capture; rendered HTTP checks were used instead.
- `npm run build`: still hangs in `Creating an optimized production build ...` and was interrupted with exit code `130`, matching the baseline Turbopack hang. The earlier ESM module-type warning was removed by renaming the shared redirect helper to `.mjs`.

## Remaining Technical Follow-Up

- Investigate the local Turbopack production build hang separately from this cleanup branch.
- Version Firestore and Storage rules in the repository.
- Decide production App Check, spam/rate protection and analytics consent handling.
- Obtain the correct tripod affiliate URL before any tripod paid link is published.
