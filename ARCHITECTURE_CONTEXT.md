# ARCHITECTURE CONTEXT

## 1. SYSTEM OVERVIEW & TECH STACK

Pitchside Web is the public website and lightweight CMS for Pitchside AI, a private-beta football analysis product for grassroots/small-sided football. The site serves marketing pages, editable SEO landing pages, technology subpages, a blog, free football tools, lead capture forms, and account deletion request intake. Firestore is used as the CMS/data store; Firebase Auth protects the browser-based admin dashboard; Firebase Storage hosts uploaded CMS media.

Concrete stack:

- Next.js `16.2.4` using the App Router under `src/app`.
- React `19.2.4` and React Compiler enabled via `next.config.mjs`.
- Firebase Web SDK `12.16.0` for Auth, Firestore, and Storage.
- Tailwind CSS `4.2.4` using Tailwind v4 CSS-first config in `src/app/globals.css`.
- Framer Motion `12.38.0`, Lenis `1.3.23`, lucide-react `1.14.0`, Phosphor icons, Three/R3F dependencies.
- JavaScript/JSX codebase, not TypeScript. Schema examples below are TypeScript-style inferred contracts for future migration/context.
- Path alias: `@/*` maps to `./src/*` via `jsconfig.json`.

Important Next.js 16 context from local docs: App Router pages/layouts are Server Components by default; add `"use client"` only where browser state, effects, event handlers, or browser APIs are required. Route handlers live in `app/**/route.js` and are the App Router equivalent of API routes.

## 2. ARCHITECTURAL PATTERNS & DIRECTORY STRUCTURE

Root structure:

```txt
src/app/                 App Router routes, layouts, metadata files, route handlers
src/app/(marketing)/     Route group for marketing pages; group name is not in URLs
src/app/[slug]/          Dynamic CMS landing-page fallback, also redirects post slugs to /blog
src/app/blog/            Blog listing and /blog/[slug] article renderer
src/app/tools/           Static tool routes enriched with optional Firestore overrides
src/app/admin/           Client-side CMS/admin dashboard and page builder
src/components/          Shared UI, header/footer, schema, tool shells, client renderers
src/components/tools/    Tool hub, tool shell, and interactive tool client components
src/components/ui/       shadcn-style primitive(s), currently button
src/lib/                 Firebase setup, content policy, metadata/date helpers, tools data
public/                  Static images, logos, SVG corner assets, mockups
```

Server/Client split:

- Server Components/pages fetch Firestore directly with the Firebase client SDK for public content routes: `src/app/[slug]/page.js`, `src/app/blog/page.js`, `src/app/blog/[slug]/page.js`, `src/app/tools/**/page.js`, `src/app/sitemap.js`.
- Client Components are used for interactive/animated screens and browser-only state: home page, marketing contact page, technology page, admin dashboard, header/footer, `DynamicPageClient`, `BlogListingClient`, tool clients.
- `"use client"` files can pull Firebase client SDK into the browser. Admin writes, lead forms, deletion requests, footer reads, and media uploads all happen from client components.
- There is no middleware/proxy auth layer. `/admin` hides global header/footer and gates UI in the component after Firebase Auth state resolves.

## 3. FIREBASE CONFIGURATION & INITIALIZATION

Firebase is initialized once in `src/lib/firebase.js`:

```js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
```

Config comes only from public env vars:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

There is no Firebase Admin SDK, no service-account initialization, and no Cloud Functions source in this repo. All Firestore/Storage access depends on Firebase Security Rules.

Storage upload paths:

- `content-images/{timestamp}_{cleanFileName}`
- `content-images/thumbnails/{timestamp}_{name}.webp`
- `hero-backgrounds/{timestamp}_{cleanFileName}`
- `hero-backgrounds/thumbnails/{timestamp}_{name}.webp`

`next.config.mjs` allows remote images from `firebasestorage.googleapis.com`, `pitchside.ai`, `www.pitchside.ai`, `ibb.co`, `i.ibb.co`, and `res.cloudinary.com`.

## 4. DATA MODELS & FIRESTORE SCHEMA

No subcollections are used in the current code. Top-level collections are `pages`, `posts`, `tools`, `authors`, `settings`, `leads`, and `deletions`.

Shared content block contracts:

```ts
type FirestoreTimestampLike = { seconds: number; nanoseconds: number } | { toDate(): Date; toMillis(): number };

type ParentPageRef = {
  type?: "landing" | "tool" | "blog";
  id?: string;
  title: string;
  url: string; // e.g. "/technology", "/tools/random-5-a-side-team-generator"
};

type MoreToReadItem = {
  type: "blog" | "tool";
  title: string;
  url: string;
  description?: string;
};

type ContentBlock =
  | { id: string; type: "h2" | "h3" | "paragraph" | "image"; content: string }
  | { id: string; type: "list"; items: string[] }
  | { id: string; type: "table"; headers: string[]; rows: { cells: string[] }[] };

type FAQ = { question: string; answer: string };
type CTA = { headline?: string; description?: string; buttonText?: string; buttonUrl?: string };
```

`pages/{pageId}` drives core page metadata, dynamic landing pages, and technology subpages:

```ts
interface PageDoc {
  title: string;
  slug: string; // no slash; reserved slugs are filtered from dynamic public routes
  metaTitle?: string;
  metaDescription?: string;
  intro?: string;
  badge?: string;
  heroH1?: string;
  llmDescription?: string;
  authorName?: string;
  authorUrl?: string;
  parentPage?: ParentPageRef; // parentPage.url === "/technology" means /technology/[slug]
  moreToRead?: MoreToReadItem[];
  thumbnail?: string;
  primaryImage?: string;
  heroBackground?: string;
  tldrPoints?: string[];
  aeoQuickAnswer?: string;
  contentBlocks?: ContentBlock[];
  ctaBlock?: CTA;
  faqs?: FAQ[];
  technologyStats?: { value: string; label: string }[];
  technologyStack?: { id: string; icon: "vision" | "ai" | "hardware" | "cloud" | string; title: string; desc: string }[];
  technologySections?: { h2: string; content: string[]; table?: { headers: string[]; rows: string[][] } | null }[];
  status?: string;
  publishStatus?: string;
  draft?: boolean;
  published?: boolean;
  noindex?: boolean;
  publishedAt?: FirestoreTimestampLike;
  createdAt?: FirestoreTimestampLike;
  updatedAt?: FirestoreTimestampLike;
}
```

Page relationships:

- Core static page overrides use fixed IDs like `technology`, `about`, `blog`, `privacy`, `terms`.
- Generic dynamic landing pages render at `/{slug}` when `parentPage.url !== "/technology"`.
- Technology subpages render at `/technology/{slug}` when `parentPage.url === "/technology"`.
- Blog posts can reference a page/tool with `parentPage.url`; related child posts are queried by that URL.

`posts/{postId}` drives `/blog/[slug]` and may also be discovered by `/{slug}` then redirected:

```ts
interface PostDoc {
  title: string;
  slug: string;
  heroH1?: string;
  metaTitle?: string;
  metaDescription?: string;
  intro?: string;
  category?: string;
  date?: string;
  authorName?: string;
  authorUrl?: string;
  parentPage?: ParentPageRef;
  moreToRead?: MoreToReadItem[];
  thumbnail?: string;
  primaryImage?: string;
  heroBackground?: string;
  featuredImage?: string;
  heroImage?: string;
  image?: string;
  coverImage?: string;
  ogImage?: string;
  mediaUrl?: string;
  tldrPoints?: string[];
  aeoQuickAnswer?: string;
  contentBlocks?: ContentBlock[];
  ctaBlock?: CTA;
  faqs?: FAQ[];
  status?: string;
  draft?: boolean;
  published?: boolean;
  noindex?: boolean;
  publishedAt?: FirestoreTimestampLike;
  createdAt?: FirestoreTimestampLike;
  updatedAt?: FirestoreTimestampLike;
}
```

`tools/{toolId}` stores admin overrides for static tool definitions from `src/lib/tools.js`:

```ts
interface ToolOverrideDoc {
  slug: string; // usually same as document ID
  title?: string;
  shortTitle?: string;
  metaTitle?: string;
  metaDescription?: string;
  llmDescription?: string;
  heroH1?: string;
  intro?: string;
  badge?: string;
  hero?: {
    eyebrow?: string;
    primaryCtaLabel?: string;
    secondaryCtaLabel?: string;
    previewLabel?: string;
    previewType?: string;
    previewDataJson?: string; // saved as JSON string
  };
  aeoQuickAnswer?: string;
  contentBlocksJson?: string; // saved string version; image fields are deleted for tools
  ctaBlock?: CTA;
  faqs?: FAQ[];
  updatedAt?: FirestoreTimestampLike;
}
```

Other collections:

```ts
interface AuthorDoc {
  name: string;
  url: string; // validated as https://*.linkedin.com
  createdAt?: FirestoreTimestampLike;
  updatedAt?: FirestoreTimestampLike;
}

interface SettingsFooterDoc {
  instagram?: string;
  tiktok?: string;
  x?: string;
  linkedin?: string;
  appStore?: string;
  playStore?: string;
  updatedAt?: string;
}

interface LeadDoc {
  name: string;
  email: string;
  message?: string;
  intent: "waitlist" | "invest" | string;
  sourcePage?: string;
  sourceUrl?: string;
  sourcePlacement?: string;
  sourceComponent?: string;
  createdAt: string;
}

interface DeletionRequestDoc {
  email: string;
  platform: "apple" | "google" | string;
  reason: string;
  status: "pending" | string;
  requestDate: string;
  createdAt: FirestoreTimestampLike;
}
```

Indexability rules live in `src/lib/contentPolicy.js`: content requires a clean `slug`, cannot use reserved/deleted slugs, and is excluded when status/draft/deleted/archived/private/unpublished/noindex flags indicate it should not be public.

## 5. AUTHENTICATION & STATE MANAGEMENT

Admin authentication is client-only in `src/app/admin/page.js`:

- `onAuthStateChanged(auth, callback)` tracks `user` and `authLoading`.
- Login uses `signInWithEmailAndPassword(auth, email, password)`.
- Logout uses `signOut(auth)`.
- When unauthenticated, `/admin` renders the login form. When authenticated, it renders dashboard tabs and `PageBuilder`.

There is no React Context, Zustand, Redux, Next middleware, server session cookie, or server-side admin guard in this repo. Public forms and server-rendered Firestore reads depend on Firebase Security Rules and public SDK credentials.

Local/browser state patterns:

- Admin dashboard state: active tab, list/builder view, editing item, content list.
- `PageBuilder` state: `formData`, upload status, JSON import modal, local draft autosave in `localStorage` under `pitchside_draft_${collectionName}`.
- Header modal lead capture uses local component state and a `window` custom event named `open-pitchside-modal`.
- Lenis smooth scrolling is applied through `useLenis()` in client pages/components.

## 6. CORE DATA FLOW & API ROUTES

Primary CMS publish flow:

1. Admin visits `/admin`; global header/footer are hidden because pathname starts with `/admin`.
2. `AdminDashboard` waits for Firebase Auth via `onAuthStateChanged`.
3. Authenticated admin selects a tab. Lists read Firestore collections with `getDocs`; posts/pages/leads/deletions usually order by `createdAt desc`, tools are read unordered and merged with static tool definitions.
4. Admin edits or creates content in `PageBuilder`.
5. Media uploads go directly from the browser to Firebase Storage; generated thumbnails are created in a browser canvas and uploaded as `.webp`.
6. On publish, `PageBuilder` normalizes authors, meta title, LLM descriptions, tool JSON, parent references, and content validation.
7. It writes with `addDoc`, `updateDoc`, or `setDoc`:
   - new posts/pages: `addDoc(collection(db, collectionName), {..., date, publishedAt, createdAt, updatedAt})`
   - existing docs: `updateDoc(doc(db, collectionName, id), {..., updatedAt})`
   - core pages: `updateDoc(pages/{id})` with fallback `setDoc`
   - tools: `setDoc(tools/{toolId}, ..., { merge: true })`
8. Public routes are `dynamic = "force-dynamic"` for CMS-driven pages, so they read Firestore at request time rather than relying on static generation.

Public read flows:

- `/{slug}` queries `pages` by `slug`, excluding technology children, then falls back to `posts`; post matches redirect permanently to `/blog/{slug}`.
- `/technology/[slug]` queries `pages` by `slug` and requires `parentPage.url === "/technology"`.
- `/blog/[slug]` queries `posts` by `slug`, filters by `isIndexableContent`, builds metadata, JSON-LD, article blocks, FAQs, and recommendations.
- `/tools` and `/tools/[slug]` start from static definitions in `src/lib/tools.js`; Firestore `tools` docs override copy/SEO fields.
- `/sitemap.xml` combines static routes, static tool routes, indexable `pages`, and indexable `posts`.

Route handlers:

- `GET /llms.txt`: Firestore-backed site knowledge base listing core pages, dynamic pages, tools, and posts. Returns `text/plain` with cache headers.
- `GET /[slug]/llms.txt`: queries `pages`, falls back to `posts`; redirects post content to `/blog/[slug]/llms.txt`; serializes metadata, TLDR, quick answer, blocks, tables, and FAQs.
- `GET /blog/[slug]/llms.txt`: queries `posts/{slug}` by field, serializes article content for LLM crawlers.
- `GET /tools/llms.txt`: static tools hub LLM text, `force-static`.
- `GET /tools/[slug]/llms.txt`: static tool details from `src/lib/tools.js`, with `generateStaticParams`.

No POST/PUT/PATCH/DELETE Next route handlers exist. Public writes are direct Firestore client writes from components:

- Header quick-capture modal and `/contact`: add docs to `leads`.
- `/account-deletion`: add docs to `deletions`.
- `/admin`: creates/updates/deletes CMS documents and footer/authors.

## 7. DEVELOPER PUSH & CODING STANDARDS

1. Read `node_modules/next/dist/docs/` before changing routing, caching, metadata, route handlers, or server/client component boundaries; this app is on Next 16.
2. Keep Firestore document shape compatible with the inferred schemas above. New CMS fields must be optional and must not break existing public renderers.
3. Do not add broad `"use client"` directives. Keep data-fetching pages server-side unless the page needs browser state/effects/animations.
4. Treat Firebase Security Rules as the real backend boundary. This repo has no Admin SDK or server auth gate, so never assume a client-side check protects data.
5. Use `isIndexableContent`, `canonicalInternalHref`, `canonicalizeInternalLinks`, and `cleanMetaTitle` for public SEO/content behavior instead of duplicating policy logic.
6. Keep uploaded CMS media in the established Storage folders and update `next.config.mjs` when adding any new remote image host.
7. Prefer adding focused helpers in `src/lib` for shared content/date/Firebase policy logic; avoid embedding new Firestore query conventions deep inside presentation components unless matching an existing local pattern.
