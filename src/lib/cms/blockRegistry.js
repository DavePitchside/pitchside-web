export const blockRegistry = Object.freeze({
  heading: { label: "Heading", requiredFields: ["text"], fields: ["level", "text"] },
  richText: { label: "Rich Text", requiredFields: ["html"], fields: ["html"] },
  image: { label: "Image", requiredFields: ["src", "alt"], fields: ["src", "alt", "caption"] },
  video: { label: "Video", requiredFields: ["src", "title"], fields: ["src", "title", "caption"] },
  quote: { label: "Quote", requiredFields: ["quote"], fields: ["quote", "attribution"] },
  featureGrid: { label: "Feature Grid", requiredFields: ["items"], fields: ["title", "items"] },
  statsGrid: { label: "Stats Grid", requiredFields: ["items"], fields: ["items"] },
  comparisonTable: { label: "Comparison Table", requiredFields: ["headers", "rows"], fields: ["title", "headers", "rows"] },
  pricingTeaser: { label: "Pricing Teaser", requiredFields: [], fields: ["title", "description"] },
  workflowSteps: { label: "Workflow Steps", requiredFields: ["steps"], fields: ["title", "steps"] },
  timeline: { label: "Timeline", requiredFields: ["items"], fields: ["title", "items"] },
  statusTable: { label: "Status Table", requiredFields: ["rows"], fields: ["title", "rows"] },
  limitations: { label: "Limitations / Checklist", requiredFields: ["items"], fields: ["title", "items"] },
  evidencePanel: { label: "Evidence Panel", requiredFields: ["items"], fields: ["title", "items"] },
  mediaGallery: { label: "Media Gallery", requiredFields: ["items"], fields: ["title", "items"] },
  appScreenshot: { label: "App Screenshot", requiredFields: ["src", "alt"], fields: ["src", "alt", "caption"] },
  affiliateProductCards: { label: "Affiliate Product Cards", requiredFields: ["items"], fields: ["title", "disclosure", "items"] },
  pitchDiagram: { label: "Pitch Diagram", requiredFields: ["title", "cameras"], fields: ["title", "description", "pitchFormat", "variant", "cameras", "blindSpots", "markers", "notes", "caption"] },
  faq: { label: "FAQ", requiredFields: ["items"], fields: ["items"] },
  authorReview: { label: "Author / Reviewer", requiredFields: [], fields: ["author", "reviewer", "body"] },
  relatedLinks: { label: "Related Links", requiredFields: ["items"], fields: ["title", "items"] },
  callToAction: { label: "Call To Action", requiredFields: ["headline"], fields: ["headline", "description", "buttonText", "buttonUrl"] },
  divider: { label: "Divider", requiredFields: [], fields: [] },
  notice: { label: "Notice", requiredFields: ["body"], fields: ["title", "body", "tone"] },
  toolEmbed: { label: "Tool Embed", requiredFields: ["toolKey"], fields: ["toolKey"] },
});

export const blockOptions = Object.entries(blockRegistry).map(([type, config]) => ({ type, ...config }));

export function getBlockConfig(type) {
  return blockRegistry[type] || null;
}

export function isVisibleBlock(block = {}) {
  return block && block.hidden !== true && block.type && block.id;
}
