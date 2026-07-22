import { CONTENT_AUTHOR } from "@/lib/contentMeta";
import { companyInfo } from "@/lib/companyInfo";

export const EEAT_LAST_UPDATED = "July 22, 2026";

export const authors = {
  "dave-coombs": {
    title: "Dave Coombs",
    eyebrow: "Founder profile",
    description:
      "Founder of Pitchside AI, grassroots football player and product lead for Pitchside's private-beta football analysis workflow.",
    role: "Founder and Director, Pitchside AI Ltd",
    canonical: "/authors/dave-coombs",
    profileUrl: "https://www.linkedin.com/in/david-coombs-pitchside/",
    sections: [
      {
        heading: "Role at Pitchside",
        body: [
          "Dave Coombs is the founder and director of Pitchside AI Ltd. He leads product direction, customer discovery, launch messaging and the practical football workflow behind Pitchside.",
          `Pitchside AI Ltd is registered in England and Wales as company number ${companyInfo.companyNumber}.`,
        ],
      },
      {
        heading: "Relevant experience",
        body: [
          "Dave is a marketing professional and lifelong amateur footballer. Pitchside began from his own frustration that grassroots football moments disappear after the final whistle.",
          "He shaped the first version of the product, reviewed real small-sided football footage, gathered early player feedback and works with technical collaborators on the private-beta workflow.",
        ],
      },
      {
        heading: "Editorial responsibility",
        body: [
          "Dave is responsible for product claims, launch-status wording and commercial pages. Technical or legal-sensitive claims should be reviewed against the product-status, pricing, privacy and terms pages before publication.",
        ],
      },
    ],
  },
  "abdullah-luqman": {
    title: "Abdullah Luqman",
    eyebrow: "Author profile",
    description:
      "Pitchside AI content author profile for football analysis, product education and grassroots football explainers.",
    role: "Pitchside AI content author",
    canonical: "/authors/abdullah-luqman",
    profileUrl: CONTENT_AUTHOR.url,
    sections: [
      {
        heading: "Role at Pitchside",
        body: [
          "Abdullah Luqman is listed as the default content author for Pitchside AI articles and educational pages.",
          "Author attribution is managed through Pitchside's CMS fields, with a fallback author profile used when an article does not provide an author override.",
        ],
      },
      {
        heading: "Content focus",
        body: [
          "Abdullah's attributed content focuses on grassroots football, small-sided football stats, football analysis workflows, product education and practical player guidance.",
        ],
      },
      {
        heading: "Review standards",
        body: [
          "Published content should avoid unsupported performance claims, clearly label beta limitations and link back to product-status or methodology pages when discussing accuracy, pricing or comparisons.",
        ],
      },
    ],
  },
};

export const eeatPages = {
  "editorial-policy": {
    title: "Editorial Policy",
    eyebrow: "Content standards",
    description:
      "How Pitchside AI writes, reviews and updates product, football analysis and comparison content before launch.",
    canonical: "/editorial-policy",
    sections: [
      {
        heading: "Purpose",
        body: [
          "Pitchside publishes product education, football-analysis explainers, comparison pages and launch updates for grassroots football players.",
          "Content must help readers understand what Pitchside does now, what is still in beta and what is planned.",
        ],
      },
      {
        heading: "Accuracy rules",
        bullets: [
          "Use current product-status wording for beta features, processing time and launch availability.",
          "Do not claim guaranteed accuracy, instant processing or professional-club parity.",
          "Do not present prices or subscriptions as purchasable until the verified purchase path is live.",
          "Use named sources, first-party data or clearly dated comparison checks for factual claims.",
        ],
      },
      {
        heading: "Review process",
        body: [
          "Product and pricing claims should be checked against the canonical pricing and product-status pages. Privacy, consent, security and legal wording should be reviewed before launch and whenever the app workflow changes.",
          "Articles should be updated when product features, plan allowances, processing times or supported formats change.",
        ],
      },
      {
        heading: "Corrections",
        body: [
          "If a factual error is found, Pitchside should correct the page, update the visible date where appropriate and avoid preserving old claims in metadata, schema or llms.txt output.",
        ],
      },
    ],
  },
  "comparison-methodology": {
    title: "Comparison Methodology",
    eyebrow: "How comparisons are checked",
    description:
      "The methodology Pitchside AI uses for competitor, alternative and pricing comparison pages.",
    canonical: "/comparison-methodology",
    sections: [
      {
        heading: "Scope",
        body: [
          "Pitchside comparison pages are intended to help grassroots football users understand differences between Pitchside and other football-camera, stats, analysis or recording options.",
        ],
      },
      {
        heading: "What we compare",
        bullets: [
          "Pricing and billing model, with a checked-on date on comparison pages.",
          "Recording requirements, hardware requirements and whether phone footage is supported.",
          "Stats, highlights, clips and personal player output.",
          "Launch status, beta limitations and planned features.",
          "Privacy, consent and account/data controls where publicly available.",
        ],
      },
      {
        heading: "Rules for fair comparison",
        bullets: [
          "Do not imply future Pitchside features are already available.",
          "Separate app subscription cost from physical mount cost.",
          "Use total-cost context when comparing weekly, monthly and annual plans.",
          "Link to canonical pricing for current Pitchside prices instead of duplicating a full pricing table.",
        ],
      },
    ],
  },
  "affiliate-disclosure": {
    title: "Affiliate Disclosure",
    eyebrow: "Commercial transparency",
    description:
      "Pitchside AI's disclosure for affiliate links, partnerships, sponsorships and commercial relationships.",
    canonical: "/affiliate-disclosure",
    sections: [
      {
        heading: "Current position",
        body: [
          "Pitchside does not currently use affiliate links on the site unless a page explicitly says otherwise.",
          "If affiliate links, sponsorships or paid placements are added, they should be clearly labelled near the relevant link or recommendation.",
        ],
      },
      {
        heading: "Editorial independence",
        body: [
          "Commercial relationships must not change the requirement for accurate product-status wording, fair comparisons or clear separation between available, beta and planned features.",
        ],
      },
      {
        heading: "Future updates",
        body: [
          "This page should be updated before any affiliate programme, sponsored comparison, referral arrangement or paid placement goes live.",
        ],
      },
    ],
  },
  "product-status": {
    title: "Product Status",
    eyebrow: "Private beta and release notes",
    description:
      "Current Pitchside AI launch status, beta limitations, processing expectations and release-note policy.",
    canonical: "/product-status",
    sections: [
      {
        heading: "Current status",
        body: [
          "Pitchside is in private beta. The product is being developed to turn phone-recorded small-sided football footage into stats, highlights and player moments.",
          "Subscriptions are not currently purchasable. Pricing is published for launch planning only.",
        ],
      },
      {
        heading: "Known beta limitations",
        bullets: [
          "Processing can take up to 45 minutes depending on upload quality, footage length, queue volume and connection speed.",
          "Accuracy is improving and should not be presented as perfect.",
          "Footage quality, camera position, lighting and pitch format affect output.",
          "The upload and processing workflow may change before public launch.",
        ],
      },
      {
        heading: "Release notes policy",
        body: [
          "Material product changes should be recorded here or on a dedicated release-notes page, including changes to pricing, allowances, supported formats, processing time, account controls and data retention.",
        ],
      },
    ],
  },
  "recording-consent-and-privacy": {
    title: "Recording Consent and Privacy",
    eyebrow: "Before recording",
    description:
      "Guidance for Pitchside users on recording consent, player privacy and responsible grassroots football footage handling.",
    canonical: "/recording-consent-and-privacy",
    sections: [
      {
        heading: "Core principle",
        body: [
          "Teams should only record matches where recording is permitted and players understand how footage may be used. This page is practical guidance and does not replace legal advice.",
        ],
      },
      {
        heading: "Before recording",
        bullets: [
          "Tell players, organisers and venue staff that the match may be recorded.",
          "Check venue, league, school, club or tournament rules before filming.",
          "Do not record children or vulnerable participants without the correct permission from responsible adults and organisers.",
          "Avoid filming bystanders where possible.",
        ],
      },
      {
        heading: "Sharing clips",
        body: [
          "Clips should be shared responsibly after processing. Do not publish footage that humiliates, harasses or identifies someone who reasonably objected to being recorded.",
        ],
      },
      {
        heading: "Data requests",
        body: [
          "Account deletion requests can be submitted through the account deletion page. Privacy questions can be sent through the contact page.",
        ],
      },
    ],
  },
  "security-and-data": {
    title: "Security and Data",
    eyebrow: "Data handling",
    description:
      "How Pitchside AI approaches account data, uploaded footage, Firebase-backed storage and launch security expectations.",
    canonical: "/security-and-data",
    sections: [
      {
        heading: "Current architecture",
        body: [
          "Pitchside Web uses Firebase services for authentication, Firestore data storage and Firebase Storage media uploads. Public website content is served through the Next.js App Router.",
        ],
      },
      {
        heading: "Data handled before launch",
        bullets: [
          "Waitlist and contact form submissions: name, email, intent, message and source page.",
          "Account deletion requests: email, platform, reason, request date and status.",
          "CMS media uploads for website pages and articles.",
          "Future app footage and analysis data should be covered by updated privacy, retention and security documentation before public launch.",
        ],
      },
      {
        heading: "Security expectations",
        bullets: [
          "Admin access should be restricted through Firebase Auth and Firestore/Storage security rules.",
          "Sensitive server credentials must not be exposed to the browser.",
          "Payment handling must not launch until checkout, cancellation, refund, tax and store-policy requirements are approved.",
          "Data retention and deletion rules should be documented before public app access expands.",
        ],
      },
      {
        heading: "Contact",
        body: [
          "Security or privacy questions can be sent through the contact page. Pitchside should publish a dedicated security contact before broad public launch if vulnerability reports are expected.",
        ],
      },
    ],
  },
};
