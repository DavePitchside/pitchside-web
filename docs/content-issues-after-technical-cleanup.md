# Content Issues After Technical Cleanup

Date: 23 July 2026  
Scope: audit only. No CMS/admin content was rewritten or published.

## /

- Primary job: explain Pitchside quickly and drive early-access signups.
- Search intent: grassroots football analysis and highlights from phone-recorded matches.
- Problem: H1 still says “Own the Cage — AI Football Camera & Highlights App for Amateur & Grassroots Players”, which is strong branding but less precise than the approved small-sided private-beta positioning.
- Unsupported claim: app-level copy should avoid implying a fully available camera app until store/download paths exist.
- Missing proof/screenshots: current mockups help, but real beta output should replace or label mockups.
- Recommended action: refine hero and availability copy in CMS/source after product evidence is ready.
- Priority: P1. Dave evidence required: yes for screenshots and signup claim. Implementation: code/source.

## /about

- Primary job: establish trust in Dave, company identity and team.
- Search intent: who runs Pitchside AI.
- Problem sentence: “AI analyses your match footage and assembles a personalised highlight reel automatically.”
- Unsupported claim: “Goals, assists, key moments – tracked automatically for definitive proof of your performance.”
- Pricing/launch inconsistency: “Join 250+ early sign-ups” still needs source evidence before it should be treated as a trust proof.
- Recommended action: replace automatic/definitive phrasing with reviewable beta output; keep 250+ only if Dave can evidence it.
- Priority: P0. Dave evidence required: yes. Implementation: code/source.

## /technology

- Primary job: explain how Pitchside works and its current technical limits.
- Search intent: Pitchside AI technology.
- Problem sentence in metadata: “turns basic footage into professional-level analysis and highlights.”
- Unsupported claims: “custom machine learning model trained specifically on small-sided football footage”, “local match footage and frame-by-frame annotation” and “British winter conditions” need technical substantiation before being retained.
- Launch-feature inconsistency: “automatically” and “professional-level” are too broad for private beta.
- Recommended action: narrow claims to verified beta workflow and link evidence to Product Status.
- Priority: P0. Dave/technical evidence required: yes. Implementation: code/source.

## /technology/how-pitchside-ai-works

- Primary job: deeper explainer for the analysis workflow.
- Search intent: how Pitchside AI works.
- Problem: likely overlaps heavily with `/technology` and should not repeat broad model claims without evidence.
- Unsupported claims: any dataset, annotation, accuracy or automatic-learning claims must be verified by the technical team.
- Recommended action: audit CMS page against Product Status and remove internal/process claims that are not public evidence.
- Priority: P1. Dave/technical evidence required: yes. Implementation: CMS/admin.

## /grassroots-football-app

- Primary job: master product hub.
- Search intent: grassroots football app.
- Problem: product pages previously had duplicated pricing/table patterns and should be checked in CMS for repeated “Start Free, record more with Paid” sections after the renderer fix.
- Missing proof/screenshots: needs real app screenshot or clearly labelled beta mockup.
- Recommended action: keep one pricing teaser near the bottom and add evidence screenshots.
- Priority: P1. Dave evidence required: yes. Implementation: CMS/admin.

## /football-analysis-app

- Primary job: weekly match-review outcome.
- Search intent: football analysis app.
- Problem: rendered metadata is good, but content should be checked for any remaining “automatic final analysis” framing.
- Unsupported claims: any promise that event/player assignment is final without review.
- Recommended action: add a concrete review/correct/report workflow example with screenshots.
- Priority: P1. Dave evidence required: screenshots helpful. Implementation: CMS/admin.

## /football-stats-app

- Primary job: explain stats, leaderboards and Personal Clips boundaries.
- Search intent: football stats app for amateur players.
- Problem: must keep Personal Clips as Paid and avoid implying GPS-style physical-load metrics.
- Unsupported claims: any distance, speed, sprint-load or training-load language.
- Recommended action: add visual examples for match stats, personal record, leaderboard and stat-to-video.
- Priority: P1. Dave evidence required: yes. Implementation: CMS/admin.

## /football-video-analysis

- Primary job: explain capture → upload → process → review workflow.
- Search intent: football video analysis app.
- Problem: likely overlaps with `/football-analysis-app`; needs one distinct workflow example rather than repeated feature lists.
- Unsupported claims: instant processing or final automatic event output.
- Recommended action: keep processing/review limits close to claims and add a labelled beta workflow example.
- Priority: P1. Dave evidence required: screenshot/workflow. Implementation: CMS/admin.

## /ai-football-analysis

- Primary job: explain computer vision capability and limits.
- Search intent: AI football analysis.
- Problem: strongest risk area for unsupported technical claims.
- Unsupported claims: dataset size, model accuracy, annotation volume, player assignment certainty or named technical review without approval.
- Recommended action: use “supported events being tested” language and add named reviewer only after real review.
- Priority: P0. Dave/technical evidence required: yes. Implementation: CMS/admin.

## /ai-football-highlights

- Primary job: explain Match Highlights versus Paid Personal Clips.
- Search intent: AI football highlights.
- Problem: must not imply instant clips or that every player receives a finished personal reel.
- Launch-feature inconsistency: Free Match Highlights and Paid Personal Clips must remain separated.
- Recommended action: add visual examples when available and keep consent/sharing guidance near CTA.
- Priority: P1. Dave evidence required: screenshots. Implementation: CMS/admin.

## /football-camera-app

- Primary job: compare phone setup, blind spots and dedicated camera alternatives.
- Search intent: football camera app.
- Problem: should not become an affiliate roundup and should link to the setup guide for mount detail.
- Unsupported claims: no claim that phones rival every dedicated camera system or that all modern phones are compatible.
- Recommended action: keep concise setup guidance and push mount recommendations to the blog/setup guide.
- Priority: P1. Dave evidence required: phone requirements. Implementation: CMS/admin.

## /record-football-matches

- Primary job: parent job-to-be-done page for recording a match.
- Search intent: record football matches with phone.
- Problem: must avoid detailed duplication with the phone-recording article and setup guide.
- Internal-linking problem: ensure links remain to the phone guide, setup guide, camera app, consent page and video analysis page.
- Recommended action: keep the page focused on preparation, recording, upload, review and consent.
- Priority: P1. Dave evidence required: no unless screenshots added. Implementation: CMS/admin.

## /best-veo-alternative-football

- Primary job: Pitchside-led commercial comparison.
- Search intent: best Veo alternative for grassroots football.
- Problem: must not imply Pitchside is a like-for-like Veo replacement for full-field capture/livestreaming.
- Unsupported claims: “best”, “cheapest” or 11-a-side support without qualification.
- Recommended action: add “Pitchside may not be right if…” and link to methodology/pricing.
- Priority: P0. Dave evidence required: product limits and screenshots. Implementation: CMS/admin.

## /blog/cheapest-veo-alternative

- Primary job: cost comparison article.
- Search intent: cheapest Veo alternatives.
- Problem: competitor prices are time-sensitive and must use official checked sources.
- Unsupported claims: “Pitchside is the cheapest Veo alternative” without the qualification that suitable phones are already owned and Pitchside is private beta.
- Recommended action: keep original currencies, checked dates and three-year totals; add phone/mount/data exclusions.
- Priority: P0. Dave evidence required: no for competitor prices, but Dave needed for Pitchside status if changed. Implementation: CMS/admin.

## /blog/veo-camera-alternative

- Primary job: wider researched alternatives article.
- Search intent: Veo camera alternative.
- Problem: needs current Veo Go information from official Veo docs and clear tested-vs-researched labelling.
- Broken-link risk: avoid old links to `/football-player-tracking` and `/football-performance-analysis`; redirects now exist, but article links should use final destinations.
- Recommended action: update comparison table with official sources and checked date.
- Priority: P0. Dave evidence required: only for Pitchside-specific claims. Implementation: CMS/admin.

## /blog/how-to-record-a-football-match-on-your-phone

- Primary job: comprehensive organic and affiliate recording guide.
- Search intent: how to record a football match on your phone.
- Problem: exact recording settings, height and phone recommendations must match verified Pitchside input requirements.
- Affiliate issue: tripod paid link must remain withheld because supplied tripod URL duplicates the post-mount URL.
- Recommended action: add/verify one-phone and two-phone diagrams, mount cards, affiliate disclosure and consent links.
- Priority: P0. Dave evidence required: correct tripod URL and tested device guidance. Implementation: CMS/admin.

## /pricing

- Primary job: canonical planned launch pricing.
- Search intent: Pitchside pricing.
- Problem: H1 still uses “Simple Pricing”; the user previously requested removing “Simple”.
- Pricing consistency: current two-tier pricing structure is correct in source, but copy should continue to avoid “forever” or purchasable checkout language.
- Recommended action: change H1 to remove “Simple” in a content/code follow-up.
- Priority: P1. Dave evidence required: no. Implementation: code/source.

## /product-status

- Primary job: source of truth for beta availability, pricing and feature status.
- Search intent: Pitchside product status.
- Problem: “Leaderboards: planned for launch” and “Personal Stats: planned for launch” must stay aligned with current approved feature matrix.
- Missing proof: processing up to 45 minutes should remain only if still confirmed.
- Recommended action: Dave should confirm processing time and launch feature statuses before next CMS update.
- Priority: P0. Dave evidence required: yes. Implementation: code/source.

## /authors/dave-coombs

- Primary job: founder/product reviewer profile.
- Search intent: Dave Coombs Pitchside.
- Problem: profile is much better, but claims about gathered feedback and mount use should be backed by Dave.
- Recommended action: keep first-hand mount statement only for the flexible fence style Dave used.
- Priority: P2. Dave evidence required: yes. Implementation: code/source.

## /authors/abdullah-luqman

- Primary job: content author profile.
- Search intent: Abdullah Luqman Pitchside.
- Problem: profile is cautious, but professional link remains internal; add external profile only if verified.
- Missing proof: no invented qualifications should be added.
- Recommended action: add verified LinkedIn/professional URL if Abdullah approves it.
- Priority: P2. Dave/Abdullah evidence required: yes. Implementation: code/source.

## /editorial-policy

- Primary job: reader-facing content standards.
- Search intent: Pitchside editorial policy.
- Problem: still contains the internal-sounding sentence “Content must help readers understand what Pitchside does now, what is still in beta and what is planned.”
- Recommended action: rewrite as reader-facing language, for example “Our content explains current beta features, planned features and known limits clearly.”
- Priority: P1. Dave evidence required: no. Implementation: code/source.

## /comparison-methodology

- Primary job: transparent comparison methodology.
- Search intent: Pitchside comparison methodology.
- Problem: strong structure, but each comparison page still needs its own checked-on date and official source list.
- Recommended action: enforce checked dates inside comparison templates or CMS validation.
- Priority: P1. Dave evidence required: no, but official competitor sources needed. Implementation: CMS/admin plus code validation.

## /affiliate-disclosure

- Primary job: disclose affiliate relationships.
- Search intent: Pitchside affiliate disclosure.
- Problem: disclosure is now accurate, but affiliate buttons still need page-level rel verification after CMS publication.
- Recommended action: add automated HTML check for `rel="sponsored nofollow noopener"` on affiliate links.
- Priority: P1. Dave evidence required: correct tripod URL. Implementation: code validation plus CMS/admin.

## /security-and-data

- Primary job: customer-facing data handling summary.
- Search intent: Pitchside security and data.
- Problem: source copy says beta footage handling “will be documented”; this is honest but still incomplete for launch.
- Missing proof: retention, processors, deletion timelines, App Check/rules and incident process need confirmation.
- Recommended action: keep as pre-launch status until legal/security details are approved.
- Priority: P0 before public launch. Dave/legal evidence required: yes. Implementation: code/source.

## /recording-consent-and-privacy

- Primary job: practical recording consent guidance.
- Search intent: recording consent and privacy for football footage.
- Problem: good practical guidance, but should be reviewed legally before launch if positioned as consent guidance.
- Recommended action: add clearer “not legal advice” note if not already prominent in final rendered page.
- Priority: P1. Dave/legal evidence required: yes. Implementation: code/source.
