export const FEATURE_STATUSES = Object.freeze({
  LIVE: "Live",
  PUBLIC_BETA: "Public beta",
  PRIVATE_BETA: "Private beta",
  IN_TESTING: "In testing",
  PLANNED: "Planned",
  RESEARCHING: "Researching",
  UNSUPPORTED: "Unsupported",
});

export const PRODUCT_STATUS = Object.freeze({
  overallStatus: "Private beta / pre-launch",
  publicAvailability: "Private beta access only",
  supportedMatchFormats: ["5-a-side", "6-a-side", "7-a-side", "Futsal", "Sunday League", "Grassroots football"],
  supportedDevices: ["Phone-recorded football footage"],
  processingTime: "Current upload and processing can take up to 45 minutes during testing.",
  pricingStatus: "Public pricing has not been announced.",
  geographicAvailability: "Private beta access only",
  ios: FEATURE_STATUSES.PLANNED,
  android: FEATURE_STATUSES.PLANNED,
  uploads: FEATURE_STATUSES.PRIVATE_BETA,
  highlights: FEATURE_STATUSES.PRIVATE_BETA,
  playerIdentification: FEATURE_STATUSES.IN_TESTING,
  eventDetection: FEATURE_STATUSES.IN_TESTING,
  stats: FEATURE_STATUSES.IN_TESTING,
  livestreaming: FEATURE_STATUSES.UNSUPPORTED,
});

export const PRODUCT_STATUS_NOTICE =
  "Pitchside AI is currently in private beta. Product capabilities, supported match formats, processing times and availability may change during testing.";

export const PRODUCT_CLAIMS = Object.freeze([
  {
    claimId: "phone-first-recording",
    label: "Phone-first recording workflow",
    status: FEATURE_STATUSES.PRIVATE_BETA,
    publicDescription:
      "Pitchside is being developed around phone-recorded small-sided and grassroots football footage.",
    evidenceUrl: "",
    evidenceNotes: "Awaiting public beta documentation and product availability confirmation.",
    verifiedAt: "",
    verifiedBy: "",
    supportedFormats: PRODUCT_STATUS.supportedMatchFormats,
    supportedDevices: PRODUCT_STATUS.supportedDevices,
    limitations: "Footage quality, camera angle, lighting and upload flow affect results.",
    canShowAsConfirmed: false,
    replacementWording:
      "Pitchside is being developed as a phone-first workflow for small-sided and grassroots football footage.",
  },
  {
    claimId: "automatic-event-detection",
    label: "Automatic event detection",
    status: FEATURE_STATUSES.IN_TESTING,
    publicDescription:
      "Pitchside is testing automatic detection of key football events from match footage.",
    evidenceUrl: "",
    evidenceNotes: "No public accuracy study or independently verified benchmark is currently available.",
    verifiedAt: "",
    verifiedBy: "",
    supportedFormats: PRODUCT_STATUS.supportedMatchFormats,
    supportedDevices: PRODUCT_STATUS.supportedDevices,
    limitations: "Event definitions and player identification may be ambiguous in crowded or low-quality footage.",
    canShowAsConfirmed: false,
    replacementWording:
      "Pitchside is being developed to identify important match events from phone-recorded footage.",
  },
  {
    claimId: "player-identification",
    label: "Player identification",
    status: FEATURE_STATUSES.IN_TESTING,
    publicDescription:
      "Pitchside is testing player identification for small-sided football footage.",
    evidenceUrl: "",
    evidenceNotes: "Awaiting verified beta evidence.",
    verifiedAt: "",
    verifiedBy: "",
    supportedFormats: PRODUCT_STATUS.supportedMatchFormats,
    supportedDevices: PRODUCT_STATUS.supportedDevices,
    limitations: "Kit similarity, camera angle, occlusion and lighting can affect identification.",
    canShowAsConfirmed: false,
    replacementWording:
      "Pitchside is being developed to connect key moments and stats to individual players during beta testing.",
  },
  {
    claimId: "highlight-generation",
    label: "Highlight generation",
    status: FEATURE_STATUSES.PRIVATE_BETA,
    publicDescription:
      "Pitchside is testing highlight generation from recorded grassroots football footage.",
    evidenceUrl: "",
    evidenceNotes: "Public launch and processing-time guarantees are not confirmed.",
    verifiedAt: "",
    verifiedBy: "",
    supportedFormats: PRODUCT_STATUS.supportedMatchFormats,
    supportedDevices: PRODUCT_STATUS.supportedDevices,
    limitations: "Processing time and output quality may change during beta.",
    canShowAsConfirmed: false,
    replacementWording:
      "Pitchside is testing highlight generation from small-sided and grassroots football footage.",
  },
]);
