export const pageTemplateRegistry = Object.freeze({
  "pitchside-home-hero": {
    label: "Immersive Product Home",
    pageTypes: ["product", "hub"],
    supportedBlocks: ["statsGrid", "featureGrid", "pricingTeaser", "mediaGallery", "callToAction", "notice"],
    defaultDesignOptions: { heroVariant: "media-led", sectionDensity: "comfortable", cardStyle: "offset-shadow", backgroundPattern: "glow", accentMode: "neon", contentWidth: "wide", showStatusNotice: true },
  },
  "pitchside-team-story": {
    label: "Founder and Team Story",
    pageTypes: ["trust", "author"],
    supportedBlocks: ["richText", "quote", "timeline", "evidencePanel", "authorReview", "faq", "callToAction"],
    defaultDesignOptions: { heroVariant: "split", sectionDensity: "comfortable", cardStyle: "bordered", backgroundPattern: "pitch-lines", accentMode: "neon", contentWidth: "standard", showStatusNotice: false },
  },
  "pitchside-contact": {
    label: "Conversion Contact Page",
    pageTypes: ["product", "trust"],
    supportedBlocks: ["featureGrid", "notice", "callToAction", "toolEmbed"],
    defaultDesignOptions: { heroVariant: "split", sectionDensity: "comfortable", cardStyle: "offset-shadow", backgroundPattern: "grid", accentMode: "neon", contentWidth: "standard", showStatusNotice: false },
  },
  "pitchside-technology-system": {
    label: "Technology Capability System",
    pageTypes: ["technology"],
    supportedBlocks: ["statsGrid", "statusTable", "limitations", "evidencePanel", "featureGrid", "faq", "callToAction"],
    defaultDesignOptions: { heroVariant: "compact", sectionDensity: "compact", cardStyle: "bordered", backgroundPattern: "grid", accentMode: "restrained", contentWidth: "wide", showStatusNotice: true },
  },
  "pitchside-workflow-map": {
    label: "How It Works Workflow",
    pageTypes: ["technology"],
    supportedBlocks: ["workflowSteps", "timeline", "statusTable", "limitations", "faq", "callToAction"],
    defaultDesignOptions: { heroVariant: "centered", sectionDensity: "comfortable", cardStyle: "bordered", backgroundPattern: "pitch-lines", accentMode: "neon", contentWidth: "standard", showStatusNotice: true },
  },
  "pitchside-pitch-setup": {
    label: "Interactive Recording Setup",
    pageTypes: ["technology"],
    supportedBlocks: ["pitchDiagram", "featureGrid", "limitations", "affiliateProductCards", "notice", "faq", "callToAction"],
    defaultDesignOptions: { heroVariant: "split", sectionDensity: "comfortable", cardStyle: "offset-shadow", backgroundPattern: "pitch-lines", accentMode: "neon", contentWidth: "wide", showStatusNotice: true },
  },
  "pitchside-product-hub": {
    label: "Product Master Hub",
    pageTypes: ["product", "hub"],
    supportedBlocks: ["featureGrid", "workflowSteps", "pricingTeaser", "relatedLinks", "faq", "callToAction"],
    defaultDesignOptions: { heroVariant: "split", sectionDensity: "comfortable", cardStyle: "offset-shadow", backgroundPattern: "grid", accentMode: "neon", contentWidth: "wide", showStatusNotice: true },
  },
  "pitchside-outcome-story": { label: "Match Review Outcome", pageTypes: ["product"], supportedBlocks: ["featureGrid", "workflowSteps", "mediaGallery", "faq", "callToAction"], defaultDesignOptions: { heroVariant: "media-led", sectionDensity: "comfortable", cardStyle: "bordered", backgroundPattern: "glow", accentMode: "neon", contentWidth: "standard", showStatusNotice: true } },
  "pitchside-stats-board": { label: "Stats and Leaderboards", pageTypes: ["product"], supportedBlocks: ["statsGrid", "appScreenshot", "featureGrid", "faq", "callToAction"], defaultDesignOptions: { heroVariant: "compact", sectionDensity: "compact", cardStyle: "bordered", backgroundPattern: "grid", accentMode: "neon", contentWidth: "wide", showStatusNotice: true } },
  "pitchside-process-flow": { label: "Video Analysis Process", pageTypes: ["product"], supportedBlocks: ["workflowSteps", "timeline", "limitations", "faq", "callToAction"], defaultDesignOptions: { heroVariant: "centered", sectionDensity: "comfortable", cardStyle: "bordered", backgroundPattern: "pitch-lines", accentMode: "restrained", contentWidth: "standard", showStatusNotice: true } },
  "pitchside-ai-lab": { label: "AI Capability Explainer", pageTypes: ["product", "technology"], supportedBlocks: ["statusTable", "evidencePanel", "limitations", "featureGrid", "faq", "callToAction"], defaultDesignOptions: { heroVariant: "split", sectionDensity: "compact", cardStyle: "bordered", backgroundPattern: "grid", accentMode: "restrained", contentWidth: "wide", showStatusNotice: true } },
  "pitchside-highlights-reel": { label: "Highlights Gallery", pageTypes: ["product"], supportedBlocks: ["mediaGallery", "featureGrid", "pricingTeaser", "faq", "callToAction"], defaultDesignOptions: { heroVariant: "media-led", sectionDensity: "comfortable", cardStyle: "offset-shadow", backgroundPattern: "glow", accentMode: "neon", contentWidth: "wide", showStatusNotice: true } },
  "pitchside-camera-setup": { label: "Phone Capture System", pageTypes: ["product"], supportedBlocks: ["pitchDiagram", "featureGrid", "limitations", "relatedLinks", "faq", "callToAction"], defaultDesignOptions: { heroVariant: "split", sectionDensity: "comfortable", cardStyle: "bordered", backgroundPattern: "pitch-lines", accentMode: "neon", contentWidth: "wide", showStatusNotice: true } },
  "pitchside-recording-journey": { label: "Record a Match Journey", pageTypes: ["product"], supportedBlocks: ["workflowSteps", "notice", "limitations", "relatedLinks", "faq", "callToAction"], defaultDesignOptions: { heroVariant: "centered", sectionDensity: "comfortable", cardStyle: "bordered", backgroundPattern: "pitch-lines", accentMode: "restrained", contentWidth: "standard", showStatusNotice: true } },
  "pitchside-versus": { label: "Product Comparison Decision", pageTypes: ["comparison"], supportedBlocks: ["comparisonTable", "statusTable", "limitations", "evidencePanel", "faq", "callToAction"], defaultDesignOptions: { heroVariant: "compact", sectionDensity: "compact", cardStyle: "offset-shadow", backgroundPattern: "grid", accentMode: "neon", contentWidth: "wide", showStatusNotice: true } },
  "pitchside-pricing": { label: "Pricing Plans", pageTypes: ["product"], supportedBlocks: ["pricingTeaser", "comparisonTable", "faq", "notice", "callToAction"], defaultDesignOptions: { heroVariant: "split", sectionDensity: "compact", cardStyle: "offset-shadow", backgroundPattern: "none", accentMode: "neon", contentWidth: "wide", showStatusNotice: true } },
  "pitchside-status-board": { label: "Product Status and Roadmap", pageTypes: ["trust"], supportedBlocks: ["statusTable", "timeline", "limitations", "notice"], defaultDesignOptions: { heroVariant: "compact", sectionDensity: "compact", cardStyle: "bordered", backgroundPattern: "grid", accentMode: "restrained", contentWidth: "wide", showStatusNotice: false } },
  "pitchside-methodology": { label: "Comparison Methodology", pageTypes: ["trust"], supportedBlocks: ["richText", "limitations", "evidencePanel", "faq"], defaultDesignOptions: { heroVariant: "centered", sectionDensity: "comfortable", cardStyle: "bordered", backgroundPattern: "none", accentMode: "restrained", contentWidth: "narrow", showStatusNotice: false } },
  "pitchside-editorial-standard": { label: "Editorial Policy", pageTypes: ["trust"], supportedBlocks: ["richText", "limitations", "authorReview", "faq"], defaultDesignOptions: { heroVariant: "centered", sectionDensity: "comfortable", cardStyle: "bordered", backgroundPattern: "none", accentMode: "restrained", contentWidth: "narrow", showStatusNotice: false } },
  "pitchside-affiliate-guide": { label: "Affiliate Disclosure", pageTypes: ["trust"], supportedBlocks: ["richText", "affiliateProductCards", "notice", "faq"], defaultDesignOptions: { heroVariant: "centered", sectionDensity: "comfortable", cardStyle: "bordered", backgroundPattern: "none", accentMode: "restrained", contentWidth: "narrow", showStatusNotice: false } },
  "pitchside-practical-policy": { label: "Practical Recording Policy", pageTypes: ["trust"], supportedBlocks: ["notice", "limitations", "richText", "faq"], defaultDesignOptions: { heroVariant: "compact", sectionDensity: "comfortable", cardStyle: "bordered", backgroundPattern: "pitch-lines", accentMode: "restrained", contentWidth: "standard", showStatusNotice: false } },
  "pitchside-security": { label: "Security and Data Trust", pageTypes: ["trust"], supportedBlocks: ["statusTable", "notice", "limitations", "richText"], defaultDesignOptions: { heroVariant: "compact", sectionDensity: "compact", cardStyle: "bordered", backgroundPattern: "grid", accentMode: "restrained", contentWidth: "standard", showStatusNotice: false } },
  "pitchside-legal": { label: "Legal Document", pageTypes: ["legal"], supportedBlocks: ["heading", "richText", "notice"], defaultDesignOptions: { heroVariant: "compact", sectionDensity: "compact", cardStyle: "flat", backgroundPattern: "none", accentMode: "restrained", contentWidth: "narrow", showStatusNotice: false } },
  "pitchside-tools-hub": { label: "Interactive Tools Hub", pageTypes: ["tool-hub"], supportedBlocks: ["toolEmbed", "featureGrid", "faq", "callToAction"], defaultDesignOptions: { heroVariant: "split", sectionDensity: "comfortable", cardStyle: "offset-shadow", backgroundPattern: "grid", accentMode: "neon", contentWidth: "wide", showStatusNotice: false } },
  "pitchside-topic-hub": { label: "Football Topic Hub", pageTypes: ["hub"], supportedBlocks: ["featureGrid", "relatedLinks", "faq", "callToAction"], defaultDesignOptions: { heroVariant: "centered", sectionDensity: "comfortable", cardStyle: "bordered", backgroundPattern: "pitch-lines", accentMode: "neon", contentWidth: "wide", showStatusNotice: false } },
  "pitchside-author-profile": { label: "Author and Reviewer Profile", pageTypes: ["author"], supportedBlocks: ["authorReview", "richText", "relatedLinks"], defaultDesignOptions: { heroVariant: "split", sectionDensity: "comfortable", cardStyle: "bordered", backgroundPattern: "grid", accentMode: "restrained", contentWidth: "standard", showStatusNotice: false } },
  "pitchside-editorial-index": { label: "Blog Index", pageTypes: ["blog-index"], supportedBlocks: ["toolEmbed", "relatedLinks"], defaultDesignOptions: { heroVariant: "compact", sectionDensity: "comfortable", cardStyle: "bordered", backgroundPattern: "grid", accentMode: "neon", contentWidth: "wide", showStatusNotice: false } },
  "pitchside-editorial-article": { label: "Editorial Article", pageTypes: ["blog-article"], supportedBlocks: ["heading", "richText", "image", "comparisonTable", "faq", "callToAction"], defaultDesignOptions: { heroVariant: "compact", sectionDensity: "comfortable", cardStyle: "bordered", backgroundPattern: "none", accentMode: "restrained", contentWidth: "narrow", showStatusNotice: false } },
  "pitchside-tool-shell": { label: "Interactive Tool Page", pageTypes: ["tool"], supportedBlocks: ["toolEmbed", "richText", "faq", "relatedLinks", "callToAction"], defaultDesignOptions: { heroVariant: "compact", sectionDensity: "comfortable", cardStyle: "bordered", backgroundPattern: "grid", accentMode: "neon", contentWidth: "wide", showStatusNotice: false } },
});

export const templateOptions = Object.entries(pageTemplateRegistry).map(([templateKey, config]) => ({
  templateKey,
  label: config.label,
  pageTypes: config.pageTypes,
  supportedBlocks: config.supportedBlocks,
  defaultDesignOptions: config.defaultDesignOptions,
}));

export function getTemplateConfig(templateKey) {
  return pageTemplateRegistry[templateKey] || pageTemplateRegistry["pitchside-product-hub"];
}
