export const PRICING_STATUS_NOTE =
  "Pitchside is in private beta. Prices and allowances are published for launch planning only; subscriptions are not available until billing, cancellation, refund and store-policy requirements are approved.";

export const pricingPlans = [
  {
    id: "free",
    name: "Free",
    price: "£0",
    cadence: "forever",
    positioning: "Try core stats and highlights with one recording per month.",
    allowance: "1 recording per month",
    action: "Join early access",
    featured: false,
    billingType: "free",
    highlights: [
      "Core beta stats and highlights",
      "Personal player moments after processing",
      "Community access and launch updates",
    ],
  },
  {
    id: "weekly",
    name: "Weekly",
    price: "£4.99",
    cadence: "per week",
    positioning: "Short-term flexibility for occasional recording, but the most expensive long-term option.",
    allowance: "Paid recording allowance at launch",
    action: "Get launch updates",
    featured: false,
    billingType: "paid",
    highlights: [
      "Flexible weekly access",
      "Paid stats and highlights allowance",
      "Useful for short events or one-off runs",
    ],
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "£12.99",
    cadence: "per month",
    positioning: "Default flexible paid plan for regular grassroots players.",
    allowance: "Paid recording allowance at launch",
    action: "Get launch updates",
    featured: true,
    billingType: "paid",
    highlights: [
      "Recommended flexible paid plan",
      "Monthly renewal and cancellation at launch",
      "Best fit for regular weekly players",
    ],
  },
  {
    id: "annual",
    name: "Annual",
    price: "£99",
    cadence: "per year",
    equivalent: "£8.25/month equivalent",
    saving: "About 36% cheaper than paying monthly for a year",
    positioning: "Best value for players who expect to use Pitchside throughout the season.",
    allowance: "Paid recording allowance at launch",
    action: "Get launch updates",
    featured: false,
    billingType: "paid",
    highlights: [
      "Lowest equivalent monthly cost",
      "Season-long access once subscriptions launch",
      "No false urgency or limited-time discount",
    ],
  },
];

export const billingOptions = pricingPlans.filter((plan) => plan.billingType === "paid");

export const featureGroups = [
  {
    name: "Recording",
    rows: [
      { feature: "Free recording allowance", free: "1 per month", paid: "Included in paid allowance", status: "Available at launch" },
      { feature: "Paid recording allowance", free: "Not included", paid: "Confirmed before launch", status: "Beta/limited" },
      { feature: "Unused recording rollover", free: "No", paid: "No rollover planned", status: "Available at launch" },
      { feature: "Failed upload handling", free: "Does not consume allowance when processing fails before analysis", paid: "Same policy", status: "Available at launch" },
    ],
  },
  {
    name: "Stats and highlights",
    rows: [
      { feature: "Goals, assists, saves, passes and tackles", free: "Core beta output", paid: "Core beta output", status: "Beta/limited" },
      { feature: "Full match highlights", free: "Included after processing", paid: "Included after processing", status: "Beta/limited" },
      { feature: "Accuracy improvements from more footage", free: "Included", paid: "Included", status: "Planned" },
    ],
  },
  {
    name: "Personal output",
    rows: [
      { feature: "Player moments", free: "Limited", paid: "Expanded allowance planned", status: "Beta/limited" },
      { feature: "Easy clip sharing after processing", free: "Included", paid: "Included", status: "Beta/limited" },
      { feature: "Leaderboards", free: "View only planned", paid: "Team/player leaderboards planned", status: "Planned" },
    ],
  },
  {
    name: "Community and support",
    rows: [
      { feature: "Launch updates", free: "Included", paid: "Included", status: "Available at launch" },
      { feature: "Support route", free: "Email/contact form", paid: "Email/contact form", status: "Available at launch" },
      { feature: "Team account management", free: "Not included", paid: "Planned", status: "Planned" },
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
    answer: "One submitted match recording counts as one recording when it reaches the analysis queue. Final launch limits for duration, file format and file size will be confirmed before subscriptions go live.",
  },
  {
    question: "Do failed uploads consume my allowance?",
    answer: "A failed upload should not consume an allowance if the file never reaches analysis. If processing starts and then fails, support will review the case before launch billing goes live.",
  },
  {
    question: "When does the monthly allowance reset?",
    answer: "The plan is for allowances to reset on the subscription renewal date. Unused recordings are not planned to roll over.",
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
