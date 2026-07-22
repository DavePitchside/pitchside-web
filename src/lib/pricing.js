export const PRICING_STATUS_NOTE =
  "Pitchside is in private beta. Prices and allowances are planned launch pricing only; subscriptions are not available to purchase yet.";

export const pricingPlans = [
  {
    id: "free",
    name: "Free",
    price: "£0",
    cadence: "",
    positioning: "Start with core match output and one recording per month.",
    allowance: "1 recording per month",
    action: "Join early access",
    featured: false,
    billingType: "free",
    highlights: [
      "Match Stats & Highlights",
      "Leaderboards",
      "Personal Stats",
      "One recording per month",
    ],
  },
  {
    id: "paid",
    name: "Paid",
    price: "From £4.99",
    cadence: "",
    positioning: "Record more often and unlock Personal Clips when paid subscriptions launch.",
    allowance: "1 recording per week",
    action: "Join early access",
    featured: true,
    billingType: "paid",
    highlights: [
      "Everything in Free",
      "Personal Clips",
      "One recording per week",
      "Weekly, monthly or annual billing",
    ],
    billingOptions: ["£4.99 weekly", "£12.99 monthly", "£99 annually", "£8.25/month equivalent on annual billing"],
  },
];

export const billingOptions = pricingPlans.find((plan) => plan.id === "paid")?.billingOptions || [];

export const featureGroups = [
  {
    name: "Recording",
    rows: [
      { feature: "Recording allowance", free: "1 per month", paid: "1 per week", status: "Planned for launch" },
      { feature: "Two-phone allowance handling", free: "To be confirmed", paid: "To be confirmed", status: "Beta/limited" },
      { feature: "Unused recording rollover", free: "To be confirmed", paid: "To be confirmed", status: "Beta/limited" },
      { feature: "Failed upload handling", free: "To be confirmed", paid: "To be confirmed", status: "Beta/limited" },
    ],
  },
  {
    name: "Stats and highlights",
    rows: [
      { feature: "Match Stats & Highlights", free: "Included", paid: "Included", status: "Planned for launch" },
      { feature: "Goals, assists, saves, passes and tackles", free: "Supported events being tested", paid: "Supported events being tested", status: "Beta/limited" },
      { feature: "Leaderboards", free: "Included", paid: "Included", status: "Planned for launch" },
    ],
  },
  {
    name: "Personal output",
    rows: [
      { feature: "Personal Stats", free: "Included", paid: "Included", status: "Planned for launch" },
      { feature: "Personal Clips", free: "Not included", paid: "Included", status: "Planned for launch" },
      { feature: "Easy sharing after processing", free: "Included for available output", paid: "Included for available output", status: "Beta/limited" },
    ],
  },
  {
    name: "Community and support",
    rows: [
      { feature: "Launch updates", free: "Included", paid: "Included", status: "Planned for launch" },
      { feature: "Support route", free: "Email/contact form", paid: "Email/contact form", status: "Planned for launch" },
      { feature: "Mini Games, Teams, Seasons and awards", free: "Roadmap", paid: "Roadmap", status: "Planned" },
    ],
  },
];

export const pricingFaqs = [
  {
    question: "Can I pay for Pitchside today?",
    answer: "No. Payment is not available yet. Until checkout and store subscriptions are approved, use Join early access or Get launch updates.",
  },
  {
    question: "What counts as one recording?",
    answer: "One submitted match recording is expected to count as one recording. Final duration, file format, file size and two-phone handling will be confirmed before subscriptions go live.",
  },
  {
    question: "Do failed uploads consume my allowance?",
    answer: "Failed upload allowance handling is still to be confirmed before billing goes live.",
  },
  {
    question: "When does the monthly allowance reset?",
    answer: "Allowance reset timing and rollover rules are still to be confirmed before subscriptions become purchasable.",
  },
  {
    question: "Is the double-phone mount included?",
    answer: "No. The Pitchside double-phone mount is a separate physical product unless it is explicitly bundled in a future offer.",
  },
  {
    question: "Can one account cover multiple teams?",
    answer: "Individual and team-account rules are still being tested. Do not assume multi-team access is included until the launch terms confirm it.",
  },
  {
    question: "Which countries and currencies are supported?",
    answer: "Pricing is shown in GBP for UK launch planning. Supported countries, currencies and tax/VAT treatment will be confirmed before purchase is enabled.",
  },
];
