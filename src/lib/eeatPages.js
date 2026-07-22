import { CONTENT_AUTHOR } from "@/lib/contentMeta";
import { companyInfo } from "@/lib/companyInfo";

export const EEAT_LAST_UPDATED = "July 23, 2026";

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
          "He shaped the first version of the product, reviewed small-sided football footage, gathered early player feedback and works with technical collaborators on the private-beta workflow.",
          "Dave has used an inexpensive flexible fence-mount style for grassroots recording and reviews mount guidance where Pitchside discusses practical recording setups.",
        ],
      },
      {
        heading: "Editorial responsibility",
        body: [
          "Dave reviews Pitchside product, pricing and recording-workflow information before publication.",
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
          "Abdullah Luqman writes and edits Pitchside AI educational content for players comparing phone recording, football analysis tools and small-sided match workflows.",
        ],
      },
      {
        heading: "Content focus",
        body: [
          "Abdullah's attributed content focuses on grassroots football, small-sided football stats, football analysis workflows, product education and practical player guidance.",
        ],
      },
      {
        heading: "Research responsibilities",
        body: [
          "Abdullah's comparison work is based on current public sources, visible product information and Pitchside's comparison methodology. Product claims are checked against current Pitchside status and pricing before publication.",
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
        heading: "Accuracy standards",
        bullets: [
          "Product status, pricing and launch availability are checked against current Pitchside information.",
          "Beta features are labelled clearly, including limits around accuracy, processing time and availability.",
          "Comparison pages use official product sources where possible and include checked dates for time-sensitive prices.",
          "First-hand use, researched recommendations and Pitchside-owned products are labelled separately.",
        ],
      },
      {
        heading: "Review process",
        body: [
          "Abdullah Luqman writes and edits educational and comparison content. Dave Coombs reviews product, pricing and recording-workflow claims before publication where they describe Pitchside's current or planned product.",
          "AI tools may support research, drafting or editing, but public content must be human-reviewed before publication.",
        ],
      },
      {
        heading: "Corrections",
        body: [
          "If a factual error is found, Pitchside will correct the affected page and update the visible date where appropriate. Readers can report issues through the contact page.",
        ],
      },
      {
        heading: "Affiliate independence",
        body: [
          "Affiliate relationships do not determine editorial conclusions. Paid links are labelled near the recommendation and explained in the affiliate disclosure.",
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
          "Pitchside is our own product. We therefore disclose its limitations and private-beta status alongside the limitations of other products.",
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
        heading: "How unknowns are handled",
        bullets: [
          "If a current price is not publicly disclosed by the manufacturer, we label it as not publicly disclosed.",
          "Where currencies differ, we keep the original currency unless a dated exchange-rate source is used.",
          "Phones, mounts, accessories, data costs, taxes and shipping are separated where they materially affect total cost.",
          "Products are labelled as physically tested by Pitchside only when that is true; otherwise they are researched from official sources.",
        ],
      },
      {
        heading: "Updates and corrections",
        body: [
          "Comparison pages are reviewed when product prices, hardware requirements, availability or Pitchside launch status change. Readers can report corrections through the contact page.",
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
        heading: "How affiliate links work",
        body: [
          "Pitchside uses some affiliate links. If you buy through a paid link, Pitchside may earn a commission from qualifying purchases at no additional cost to you.",
          "As an Amazon Associate I earn from qualifying purchases.",
        ],
      },
      {
        heading: "Editorial independence",
        body: [
          "Affiliate relationships do not determine rankings or editorial conclusions. Recommendations are based on suitability for the stated pitch setup, not commission rates.",
        ],
      },
      {
        heading: "Tested, researched and Pitchside-owned products",
        body: [
          "First-hand use is stated only when it really occurred. Products not personally tested by Pitchside are described as researched recommendations based on public product information.",
          "Pitchside may recommend its own mounting product. When it does, the page will identify it as a Pitchside-owned product.",
          "Product availability, specifications, compatibility and venue rules can change. Check the seller's current product page and confirm that the setup is safe and permitted at your venue before buying or using any mount.",
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
        heading: "Current capability status",
        bullets: [
          "Match Stats & Highlights: private beta; suitable footage is analysed for supported match output.",
          "Leaderboards: planned for launch.",
          "Personal Stats: planned for launch.",
          "Personal Clips: planned for the Paid tier.",
          "Recording allowance: Free is planned at one recording per month; Paid is planned at one recording per week.",
          "Supported formats: current focus is suitable 5-a-side, 6-a-side and 7-a-side football footage.",
          "Supported event testing: goals, assists, saves, passes and tackles.",
          "Upload and processing: beta processing may take up to 45 minutes depending on footage and queue conditions.",
          "App availability and billing: not publicly purchasable yet.",
          "Double-phone mount: in development as a separate physical product.",
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
        heading: "Release notes",
        body: [
          "23 July 2026: Pricing wording updated to separate Free and Paid product tiers from Paid billing frequencies. Recording setup guidance now separates phone mounts from app subscriptions.",
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
          "Use clear notices or team messages where appropriate, especially before sharing clips outside a private team context.",
        ],
      },
      {
        heading: "Children and vulnerable participants",
        body: [
          "Do not record children or vulnerable participants unless the organiser and responsible adults have given the required permission. Follow the venue, league, club, school or tournament rules before recording starts.",
        ],
      },
      {
        heading: "Sharing clips",
        body: [
          "Clips should be shared responsibly after processing. Group-chat sharing and public social-media sharing can both identify players and bystanders, so use the most limited audience that fits the purpose.",
          "Do not publish footage that humiliates, harasses or identifies someone who reasonably objected to being recorded.",
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
        heading: "Current data use",
        body: [
          "Pitchside currently collects website enquiries, launch-list submissions and account-deletion requests. This helps the team respond to users, understand launch demand and manage support requests.",
        ],
      },
      {
        heading: "Data handled before launch",
        bullets: [
          "Waitlist and contact form submissions: name, email, intent, message and source page.",
          "Account deletion requests: email, platform, reason, request date and status.",
          "CMS media uploads used to publish website pages and articles.",
          "Beta footage and analysis data handling will be documented before public app access expands.",
        ],
      },
      {
        heading: "Before public launch",
        bullets: [
          "Payment handling, subscription terms and refund wording need to be finalised before checkout is enabled.",
          "Footage retention, deletion and support processes need to be confirmed before broad public app access.",
          "Third-party processors will be described in the privacy materials when the app workflow is ready for public launch.",
        ],
      },
      {
        heading: "Contact",
        body: [
          "Security, privacy or deletion questions can be sent through the contact page. Account deletion requests can also be submitted through the account deletion page.",
        ],
      },
    ],
  },
};
