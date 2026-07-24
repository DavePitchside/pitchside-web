# CMS Server-Rendered Page System Audit

Date: 23 July 2026  
Branch: `codex/cms-server-rendered-page-system`  
Scope: audit before migration. No production Firestore writes were performed.

## Summary

Pitchside currently has a mixed page architecture:

- Hard-coded client-heavy marketing pages in `src/app/**/page.js`.
- Firestore-backed dynamic product/landing pages in `pages`.
- Firestore-backed blog posts in `posts`.
- Code-owned interactive tools with Firestore content overrides in `tools`.
- Static trust/legal/author pages generated from repository data.

The main migration risk is route identity. Current public page loaders often query by `slug` and then use the first acceptable document. The new CMS foundation must use `routePath` as the canonical identifier and reject duplicate or ambiguous matches.

## Hard-Coded Routes

These routes currently contain page content or page-specific layout directly in source:

| Route | Source | Notes |
| --- | --- | --- |
| `/` | `src/app/page.js` | Home hero, feature sections, app previews and pricing teaser are hard-coded client UI. Preserve immersive design and mockup behaviour. |
| `/about` | `src/app/(marketing)/about/page.js` | Founder story, company details, FAQ and Dave portrait are hard-coded client UI. Preserve portrait composition and Companies House evidence. |
| `/contact` | `src/app/(marketing)/contact/page.js` | Contact/lead form is hard-coded client UI. Preserve Firestore lead submission. |
| `/technology` | `src/app/(marketing)/technology/page.js` | Server/CMS merged technology content with specialized technology sections. Preserve capability tables and private-beta wording. |
| `/technology/football-recording-setup` | `src/app/(marketing)/technology/football-recording-setup/page.js` | Server route with Firestore lookup plus fallback. Must preserve setup guide, safety, mount and consent content. |
| `/technology/how-pitchside-ai-works` | `src/app/(marketing)/technology/how-pitchside-ai-works/page.js` | Thin explicit wrapper around `/technology/[slug]` fallback. |
| `/pricing` | `src/app/pricing/page.js` and `src/lib/pricing.js` | Hard-coded pricing page fed by central pricing data. Prices must remain source-of-truth aligned. |
| `/privacy` | `src/app/privacy/page.js` | Legal document hard-coded. Preserve exact legal content. |
| `/terms` | `src/app/terms/page.js` | Legal document hard-coded. Preserve exact legal content. |
| `/account-deletion` | `src/app/account-deletion/page.js` | Public deletion intake form. Preserve Firestore write and workflow. Not a marketing CMS candidate until form behaviour is separated. |
| `/editorial-policy` | `src/app/editorial-policy/page.js`, `src/lib/eeatPages.js` | Static E-E-A-T page from repository object. |
| `/comparison-methodology` | `src/app/comparison-methodology/page.js`, `src/lib/eeatPages.js` | Static E-E-A-T page from repository object. |
| `/affiliate-disclosure` | `src/app/affiliate-disclosure/page.js`, `src/lib/eeatPages.js` | Static E-E-A-T page from repository object. |
| `/product-status` | `src/app/product-status/page.js`, `src/lib/eeatPages.js` | Static status page from repository object. |
| `/recording-consent-and-privacy` | `src/app/recording-consent-and-privacy/page.js`, `src/lib/eeatPages.js` | Static practical policy page from repository object. |
| `/security-and-data` | `src/app/security-and-data/page.js`, `src/lib/eeatPages.js` | Static trust page from repository object. |
| `/authors/dave-coombs` | `src/app/authors/[slug]/page.js`, `src/lib/eeatPages.js` | Static author profile route by slug. |
| `/authors/abdullah-luqman` | `src/app/authors/[slug]/page.js`, `src/lib/eeatPages.js` | Static author profile route by slug. |
| `/blog` | `src/app/blog/page.js` + `BlogListingClient` | Blog index is code-owned list of `posts`. Preserve post-only listing. |
| `/tools` | `src/app/tools/page.js` + `ToolsHub` | Tool hub is code-owned with Firestore override from `tools`. |
| `/tools/[slug]` | `src/app/tools/[slug]/page.js` + tool registry | Tool logic is code-owned. Surrounding content can be CMS-managed only as metadata/instructions/FAQ/CTA/toolEmbed. |
| `/admin` | `src/app/admin/page.js` + `PageBuilder.js` | Admin client app. Not public content. |

## Already CMS-Managed Routes

| Route Pattern | Collection | Loader | Notes |
| --- | --- | --- | --- |
| `/{slug}` | `pages` | `src/app/[slug]/page.js` | Queries by `slug`, excludes technology children, renders `DynamicPageClient`. Risk: duplicate slug first-match behaviour. |
| `/technology/{slug}` | `pages` | `src/app/(marketing)/technology/[slug]/page.js` | Queries by `slug`, requires `parentPage.url === "/technology"`, includes fallback for `how-pitchside-ai-works`. Risk: duplicate slug first-match behaviour. |
| `/blog/{slug}` | `posts` | `src/app/blog/[slug]/page.js` | Queries by `slug`, renders server-side article HTML. Risk: duplicate post slug first-match behaviour. |
| `/tools` | `tools` override | `src/app/tools/page.js` | Code-owned hub merged with `tools/{tools}` override. |
| `/tools/{slug}` | `tools` override | `src/app/tools/[slug]/page.js` | Code-owned tool registry merged with `tools/{slug}` override. |
| Static core page overrides | `pages` fixed IDs | Admin only or page-specific code | Core static pages can be edited for selected fields, but most visual/content source remains hard-coded. |

## Interactive Tool Routes

The interactive tool logic must remain in code:

- `/tools`
- `/tools/random-5-a-side-team-generator`
- `/tools/formation-builder`
- `/tools/football-tournament-planner`
- Any other slug exported by `src/lib/tools.js`

Only metadata, H1, intro, instructions, FAQ, related links, CTA, author/reviewer and a registered `toolEmbed` block should move into CMS.

## Duplicate Or Conflicting Routes

Detected from source:

- `/technology/how-pitchside-ai-works` has both a dynamic fallback route and an explicit wrapper route. The explicit route is intentional to guarantee a 200.
- `/technology/football-recording-setup` is explicitly listed in the admin as a static technology page and can also appear in Firestore query results where `parentPage.url === "/technology"`. The admin can show it twice unless the Firestore list excludes the static doc id.
- Static sitemap routes are combined with dynamic `pages` routes and de-duped by final URL. This hides route conflicts rather than failing them.
- `/{slug}` can conflict with hard-coded routes if Firestore contains reserved slugs. `isIndexableContent` blocks many reserved slugs, but routePath is not enforced yet.

Duplicate Firestore `slug` or `routePath` documents are not detectable offline without a Firestore export. Migration tooling must query production in dry-run mode and abort when duplicates exist.

## Current Firestore Collections And Fields

Top-level collections currently used:

- `pages`: landing pages, core page overrides, technology subpages.
- `posts`: blog articles.
- `tools`: static tool content overrides.
- `authors`: author picker entries; currently minimal.
- `settings`: footer/social settings.
- `leads`: public lead capture.
- `deletions`: account deletion queue.

Important existing `pages` fields:

- `title`, `slug`, `metaTitle`, `metaDescription`, `intro`, `badge`, `heroH1`, `llmDescription`
- `parentPage`, `moreToRead`, `thumbnail`, `primaryImage`, `heroBackground`
- `tldrPoints`, `aeoQuickAnswer`, `contentBlocks`, `ctaBlock`, `faqs`
- `technologyStats`, `technologyStack`, `technologySections`
- `status`, `publishStatus`, `draft`, `published`, `noindex`
- `publishedAt`, `createdAt`, `updatedAt`

Target `pages` additions:

- `routePath`, `parentPath`, `pageType`, `templateKey`, `templateVersion`
- `seo`, `hero`, `blocks`, `author`, `reviewer`, `schemaConfig`, `designOptions`
- `legacyFields` only for migration traceability when needed

## Pages Requiring Specialized Functionality

- `/`: immersive hero, app preview carousel, pricing teaser, waitlist modal trigger.
- `/about`: Dave portrait/cutout, company details, founder story.
- `/contact`: public Firestore lead form.
- `/technology`: technology capability system and status-aware tables.
- `/technology/football-recording-setup`: pitch diagrams, affiliate product cards, mount/safety guidance.
- `/pricing`: central pricing matrix from approved pricing source.
- `/tools` and `/tools/[slug]`: interactive tool logic.
- `/blog` and `/blog/[slug]`: post-only editorial system.
- `/account-deletion`: public deletion request form.
- Legal/trust pages: exact wording and metadata must be preserved.
- Author pages: Person/ProfilePage schema and article/review relationships.

## Not Safe For Automatic Migration

- Large client-only animated page compositions cannot be faithfully inferred into CMS blocks automatically.
- Exact legal text should be migrated from source only after owner/legal review.
- `/contact` and `/account-deletion` include Firestore write workflows and need form components separated from content.
- Blog posts remain in `posts`; they should not be converted into `pages`.
- Tools must not store algorithms or React component names in Firestore.
- Unsupported product/evidence claims identified in `docs/content-issues-after-technical-cleanup.md` should not be rewritten during this migration.

## Initial Migration Strategy

1. Add a routePath-first loader and CMS renderer with server-rendered templates.
2. Add template and block registries in source; Firestore stores only safe keys/options/data.
3. Add migration manifests and seed JSON files with no production writes.
4. Migrate representative wrappers first:
   - `/grassroots-football-app` using `pitchside-product-hub`.
   - `/technology/football-recording-setup` using `pitchside-pitch-setup`.
5. Keep existing content fallbacks in source until Firestore docs exist and route/source/metadata validation passes.
6. Expand in controlled batches after duplicate route checks pass.
