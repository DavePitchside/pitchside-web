# CMS Server-Rendered Page System Validation

Date: 23 July 2026  
Branch: `codex/cms-server-rendered-page-system`  
Production Firestore writes: none.

## Commands Run

- `npm ci`: passed. npm reported install-script approval warnings for known transitive packages.
- `npm run lint`: passed.
- `node scripts/validate-repository.mjs`: passed with `missingAssets: 0` and `obsoleteRouteReferences: 0`.
- `npm run build`: reproduced the known local Turbopack hang at `Creating an optimized production build ...`; interrupted after no error output.

## Local Route Checks

Using the existing local dev server on `http://localhost:3000`:

| Route | Status | Result |
| --- | ---: | --- |
| `/grassroots-football-app` | 200 | Server HTML includes H1 and important body text from `CmsPageRenderer` fallback seed. |
| `/technology/football-recording-setup` | 200 | Server HTML includes one H1, SVG pitch diagrams, affiliate cards, FAQ content and CTA. |
| `/sitemap.xml` | 200 | Includes `/technology/football-recording-setup` and `/grassroots-football-app`. |

## SEO Checks

- `generateMetadata()` for migrated routes uses the same `getCmsPageByPath()` loader as page rendering.
- Canonical, Open Graph and Twitter fields render from CMS `seo` fields or normalized fallbacks.
- JSON-LD author and reviewer URLs are absolute.
- FAQ schema is generated only from visible `faq` blocks.
- `/technology/football-recording-setup` source contains one `<h1`.

## Affiliate Checks

The recording setup page renders three paid links with:

```html
rel="sponsored nofollow noopener"
```

No tripod paid link was added.

## Visual QA

Generated screenshots, ignored by Git:

- `reports/generated/grassroots-desktop.png`
- `reports/generated/setup-desktop.png`
- `reports/generated/setup-mobile.png`

Observed:

- Representative templates are visibly different while retaining Pitchside brand colors, large condensed headings, borders and offset shadows.
- Mobile recording setup diagram/card flow is readable with no obvious content overlap.
- The product status notice required a class-order fix and now uses important dark background/text classes in CMS templates.

## Migration Dry Run

Dry-run file:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json \
  node scripts/apply-firestore-cms-patch.mjs migrations/cms/2026-07-23-cms-server-rendered-foundation-seed.json --dry-run
```

The migration runner now checks page `routePath` duplicates before planning writes and aborts when a conflicting document exists.

## Rollback

No production data was written. Code rollback is:

1. Revert the branch or revert the commits containing `src/lib/cms`, `src/components/cms`, `src/app/admin/CmsPageManager.jsx`, and the route wrapper changes.
2. Restore the previous `src/app/(marketing)/technology/football-recording-setup/page.js` implementation from `main`.
3. Remove the `All Pages` admin tab if the CMS foundation is not wanted.

If production seed writes are later approved and applied, rollback requires restoring the Firestore backups created by `scripts/apply-firestore-cms-patch.mjs` in `cmsRevisionBackups` before reverting route wrappers.

## Remaining Manual Tasks

- Run the routePath duplicate dry run against production Firestore with service-account credentials.
- Merge existing Firestore legacy content into routePath documents before publishing the new documents.
- Build out richer structured editors for every block type; the current block editor includes structured page/template/SEO controls and an advanced JSON block editor.
- Migrate remaining hard-coded pages in batches from `migrations/cms/cms-server-rendered-page-system-manifest.json`.
- Investigate the existing local production build hang separately.
