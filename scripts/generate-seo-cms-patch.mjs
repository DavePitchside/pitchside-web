import fs from "fs";

const now = "July 23, 2026";

const p = (id, content) => ({ id, type: "paragraph", content });
const h2 = (id, content) => ({ id, type: "h2", content });
const h3 = (id, content) => ({ id, type: "h3", content });
const list = (id, items) => ({ id, type: "list", items });
const table = (id, headers, rows) => ({ id, type: "table", headers, rows: rows.map((cells) => ({ cells })) });

const pricingTeaser = [
  h2("pricing-teaser-heading", "Start Free, record more with Paid"),
  p("pricing-teaser-copy", "Pitchside's planned Free launch tier includes Match Stats & Highlights, Leaderboards, Personal Stats and one recording per month. Paid adds Personal Clips and increases the allowance to one recording per week. See the full <a href=\"/pricing\">planned launch pricing</a>."),
  table("pricing-teaser-table", ["Tier", "Price", "Current launch allowance", "Included output"], [
    ["Free", "£0", "One recording per month", "Match Stats & Highlights, Leaderboards and Personal Stats"],
    ["Paid", "£4.99 weekly, £12.99 monthly or £99 annually", "One recording per week", "Everything in Free plus Personal Clips"],
  ]),
];

const availabilityNote = p("private-beta-note", "Pitchside is currently in private beta. Subscriptions are not available to purchase yet, and supported output depends on suitable footage, camera position and the beta workflow.");

const productCta = {
  headline: "Join early access",
  description: "Join the launch list for updates as Pitchside expands private-beta access.",
  buttonText: "Join early access",
  buttonUrl: "/contact",
};

const productPages = {
  "grassroots-football-app": {
    metaTitle: "Grassroots Football App for Stats and Highlights",
    metaDescription: "Explore Pitchside's private-beta grassroots football app for phone-recorded 5-, 6- and 7-a-side stats, highlights, personal records and leaderboards.",
    heroH1: "A Grassroots Football App for Stats and Highlights",
    intro: "Pitchside helps grassroots players turn suitable phone-recorded small-sided matches into stats, highlights and player records for review.",
    aeoQuickAnswer: "Pitchside is a private-beta grassroots football app focused on suitable 5-, 6- and 7-a-side phone footage, with planned Free and Paid launch tiers.",
    contentBlocks: [
      availabilityNote,
      h2("job-heading", "Find the part of Pitchside you need"),
      table("hub-table", ["Need", "Where to go"], [
        ["Record a match", "<a href=\"/record-football-matches\">Record Football Matches</a>"],
        ["Choose a phone setup", "<a href=\"/technology/football-recording-setup\">Football recording setup guide</a>"],
        ["Use your phone as the camera", "<a href=\"/football-camera-app\">Football Camera App</a>"],
        ["Review footage after the match", "<a href=\"/football-video-analysis\">Football Video Analysis</a>"],
        ["Compare stats output", "<a href=\"/football-stats-app\">Football Stats App</a>"],
        ["Check current availability", "<a href=\"/product-status\">Product Status</a>"],
      ]),
      h2("workflow-heading", "The weekly player workflow"),
      list("workflow-list", ["Record the game from a stable phone setup.", "Upload suitable footage after the match.", "Review supported moments and player assignments.", "Keep the stats, highlights and records that are useful.", "Use free tools while the app remains in private beta."]),
      h2("current-output-heading", "Current launch focus"),
      p("current-output-copy", "Pitchside is focused on 5-a-side, 6-a-side and 7-a-side football first. The beta is testing supported events around goals, assists, saves, passes and tackles."),
      ...pricingTeaser,
    ],
    ctaBlock: productCta,
  },
  "football-analysis-app": {
    metaTitle: "Football Analysis App for Weekly Match Review",
    metaDescription: "Review supported moments, stats and clips from suitable phone-recorded small-sided football footage with Pitchside's private-beta workflow.",
    heroH1: "Football Analysis for the Match You Just Played",
    intro: "Pitchside is built around the weekly match review: open the match, review supported moments, check player assignment and keep the record useful.",
    contentBlocks: [
      availabilityNote,
      h2("review-flow-heading", "A practical match-review flow"),
      list("review-flow-list", ["Open the processed match.", "Review supported moments such as goals, assists, saves, passes and tackles.", "Check that player assignment makes sense.", "Correct or report anything that looks wrong.", "Keep the stats and clips that are useful for the team."]),
      h2("not-final-heading", "Reviewable, not perfect"),
      p("not-final-copy", "Pitchside analyses suitable footage and returns supported stats and moments for review. Camera height, lighting, kit similarity, obstructions and pitch size can affect what the beta can read."),
      h2("who-for-heading", "Who it is for"),
      p("who-for-copy", "This page is for players and small-sided teams who want a useful record of regular games without setting up a full analyst workflow."),
      ...pricingTeaser,
    ],
    ctaBlock: productCta,
  },
  "football-stats-app": {
    metaTitle: "Football Stats App for Amateur Players",
    metaDescription: "Track Match Stats & Highlights, Personal Stats, Leaderboards and Paid Personal Clips from suitable small-sided football recordings.",
    heroH1: "Football Stats From the Match Recording",
    intro: "Pitchside connects supported match events to player and team output so small-sided players can review more than the final score.",
    contentBlocks: [
      availabilityNote,
      h2("stats-output-heading", "Stats Pitchside is testing"),
      table("stats-output-table", ["Output", "Launch tier", "Notes"], [
        ["Match Stats & Highlights", "Free and Paid", "Generated from suitable footage after processing"],
        ["Personal Stats", "Free and Paid", "Built from supported player assignments"],
        ["Leaderboards", "Free and Paid", "Designed for comparing reviewed stats"],
        ["Personal Clips", "Paid", "Paid feature planned for launch"],
      ]),
      h2("not-gps-heading", "What it does not replace"),
      p("not-gps-copy", "Pitchside is not a GPS vest. Do not use it as a replacement for distance, speed, sprint load or training-load data."),
      h2("review-heading", "Review before treating stats as final"),
      p("review-copy", "Detected events and player assignments can need review, especially when footage is obstructed, unstable or filmed from pitch level."),
      ...pricingTeaser,
    ],
    ctaBlock: productCta,
  },
  "ai-football-analysis": {
    metaTitle: "AI Football Analysis From Phone Video",
    metaDescription: "See how Pitchside tests computer vision for event recognition, player assignment and reviewable football output from suitable phone footage.",
    heroH1: "AI Football Analysis From Suitable Phone Footage",
    intro: "Pitchside uses computer vision to help identify supported football events from small-sided match recordings.",
    contentBlocks: [
      availabilityNote,
      h2("capability-heading", "Computer vision capability"),
      p("capability-copy", "The beta is testing event recognition and player assignment from phone-recorded 5-, 6- and 7-a-side football. The workflow is designed to return stats and moments that can be reviewed, not unchangeable final results."),
      h2("limits-heading", "Limits that affect output"),
      list("limits-list", ["Low camera height", "Players blocking the lens", "Similar kits", "Poor lighting", "Rain or glare", "Excessive zoom", "Unstable mounting"]),
      h2("human-review-heading", "Human review stays important"),
      p("human-review-copy", "Review detected events and player assignments before using the match record for team decisions or public sharing."),
      ...pricingTeaser,
    ],
    ctaBlock: productCta,
  },
  "football-video-analysis": {
    metaTitle: "Football Video Analysis From Phone Footage",
    metaDescription: "Capture, upload, process and review suitable football footage with Pitchside's private-beta video analysis workflow.",
    heroH1: "Football Video Analysis Without Rewatching Everything",
    intro: "Pitchside helps turn a stable phone recording into reviewable match output after processing.",
    contentBlocks: [
      availabilityNote,
      h2("workflow-heading", "From recording to review"),
      table("workflow-table", ["Step", "What happens"], [
        ["Capture", "Record the match from a safe, stable landscape position."],
        ["Upload", "Submit the recording after the match."],
        ["Process", "Pitchside analyses suitable footage for supported events."],
        ["Review", "Check moments, stats and player assignments before treating them as final."],
        ["Save and share", "Use clips responsibly after processing and consent checks."],
      ]),
      h2("example-heading", "Example beta workflow"),
      p("example-copy", "A 6-a-side team records from a raised sideline position, uploads after full time and reviews goals, saves and key passages once processing is complete. Poor angles or obstructions may reduce what can be detected."),
      h2("privacy-heading", "Share responsibly"),
      p("privacy-copy", "Before sharing clips publicly, read the <a href=\"/recording-consent-and-privacy\">recording consent and privacy guidance</a>."),
      ...pricingTeaser,
    ],
    ctaBlock: productCta,
  },
  "ai-football-highlights": {
    metaTitle: "AI Football Highlights From Match Video",
    metaDescription: "Pitchside is testing match highlights and Paid Personal Clips from suitable phone-recorded small-sided football footage.",
    heroH1: "Highlights From the Match You Recorded",
    intro: "Pitchside is testing highlights from suitable phone-recorded footage so players can review the moments that matter without editing the full match by hand.",
    contentBlocks: [
      availabilityNote,
      h2("match-vs-personal-heading", "Match Highlights and Personal Clips"),
      table("highlight-table", ["Output", "Launch tier", "What it means"], [
        ["Match Stats & Highlights", "Free and Paid", "Team-level match output after processing"],
        ["Personal Clips", "Paid", "Player-focused clips planned for the Paid tier"],
      ]),
      h2("not-instant-heading", "Processing is not instant"),
      p("not-instant-copy", "During private beta, upload and processing may take up to 45 minutes depending on footage, connection and queue conditions."),
      h2("sharing-heading", "Share clips with consent"),
      p("sharing-copy", "Clips should be shared responsibly after processing. Check <a href=\"/recording-consent-and-privacy\">recording consent and privacy guidance</a> before posting publicly."),
      ...pricingTeaser,
    ],
    ctaBlock: productCta,
  },
  "football-camera-app": {
    metaTitle: "AI Football Camera App Using One or Two Phones",
    metaDescription: "Use suitable phone footage with Pitchside's private-beta football camera workflow for small-sided stats, highlights and player records.",
    heroH1: "A Football Camera App Built Around Phones",
    intro: "Pitchside starts with the camera players already have: one or two suitable phones mounted safely for small-sided football.",
    contentBlocks: [
      availabilityNote,
      h2("setup-heading", "Choose a setup that fits the pitch"),
      p("setup-copy", "Caged pitches, netted venues and open grass grounds require different mounting approaches. Pitchside's <a href=\"/technology/football-recording-setup\">setup guide</a> explains where to place one or two phones, how to reduce common blind spots and when to use a fence mount, post mount or tripod."),
      h2("one-two-heading", "One phone or two phones"),
      p("one-two-copy", "One phone can work on smaller pitches when a wide, stable view captures the important playing area. Two phones can cover opposing halves or different angles when one view leaves too much action hidden."),
      h2("dedicated-camera-heading", "Phone-first, not a dedicated camera replacement for everyone"),
      p("dedicated-camera-copy", "Dedicated systems may be more appropriate for established full-field recording, tactical review and livestreaming. Pitchside is focused on phone-recorded small-sided stats, highlights and player records."),
      h2("mount-heading", "Pitchside mount development"),
      p("mount-copy", "Pitchside is developing its own double-phone mounting option. Compatibility, pricing and availability will be published after testing. Check <a href=\"/product-status\">Product Status</a> for current availability."),
      ...pricingTeaser,
    ],
    ctaBlock: productCta,
  },
  "record-football-matches": {
    metaTitle: "Record Football Matches With One or Two Phones",
    metaDescription: "Learn how Pitchside helps players record small-sided football with phones, upload suitable footage and review stats and highlights after processing.",
    heroH1: "Record Football Matches With Your Phone",
    intro: "Use a safe phone setup, record the match, upload suitable footage and review supported stats and highlights after processing.",
    contentBlocks: [
      availabilityNote,
      h2("prepare-heading", "Five-minute preparation"),
      list("prepare-list", ["Confirm recording is allowed.", "Get the necessary consent.", "Choose one phone or two phones.", "Mount each phone safely in landscape.", "Check storage, battery, lens and framing."]),
      h2("one-two-heading", "One phone versus two"),
      p("one-two-copy", "One phone can work when a wide elevated view captures the important playing area. Two phones can help when one angle leaves goalmouths or far corners hidden."),
      h2("cluster-links-heading", "Recording guides"),
      list("cluster-links", ["Read the <a href=\"/blog/how-to-record-a-football-match-on-your-phone\">phone recording guide</a> for organic setup and mount advice.", "Use the <a href=\"/technology/football-recording-setup\">football recording setup guide</a> for one-phone and two-phone positioning.", "Compare the <a href=\"/football-camera-app\">football camera app</a> workflow.", "Understand <a href=\"/football-video-analysis\">football video analysis</a> after upload.", "Check <a href=\"/recording-consent-and-privacy\">recording consent and privacy</a> before sharing footage."]),
      h2("allowances-heading", "Recording allowances"),
      p("allowances-copy", "Free is planned to include one recording per month. Paid is planned to include one recording per week. Two-phone and failed-upload allowance handling is still to be confirmed."),
      ...pricingTeaser,
    ],
    ctaBlock: productCta,
  },
  "best-veo-alternative-football": {
    metaTitle: "Best Veo Alternative for Grassroots Football",
    metaDescription: "Compare Pitchside with Veo for small-sided football recording, pricing, hardware, stats, highlights and current private-beta limitations.",
    heroH1: "A Phone-First Veo Alternative for Small-Sided Football",
    intro: "Pitchside is a phone-first private-beta option for players who want small-sided stats, highlights, leaderboards and player records from suitable recordings.",
    contentBlocks: [
      availabilityNote,
      h2("summary-heading", "Pitchside versus Veo"),
      table("summary-table", ["Need", "Pitchside", "Veo"], [
        ["Capture hardware", "Suitable phones plus safe mounts", "Dedicated Veo camera or official Veo phone workflow where available"],
        ["Current focus", "5-, 6- and 7-a-side phone footage", "Established full-field recording, tactical review and livestreaming workflows"],
        ["Pricing", "Free and Paid launch tiers; not purchasable yet", "Check Veo's official pricing for current plans"],
        ["Output", "Stats, highlights, personal records and leaderboards being tested", "Dedicated camera analysis and team-video workflows"],
      ]),
      h2("not-right-heading", "Pitchside may not be right if"),
      list("not-right-list", ["You need established full-field 11-a-side capture today.", "You need livestreaming now.", "You need a dedicated camera supplied as part of the workflow.", "You need a product that is already publicly purchasable."]),
      h2("next-reading-heading", "Compare the options"),
      list("next-reading-list", ["Read the wider <a href=\"/blog/veo-camera-alternative\">Veo camera alternatives comparison</a>.", "Review <a href=\"/blog/cheapest-veo-alternative\">hardware and three-year costs</a>.", "Check <a href=\"/comparison-methodology\">how Pitchside comparisons are researched</a>.", "See <a href=\"/pricing\">planned Pitchside pricing</a>."]),
      ...pricingTeaser,
    ],
    ctaBlock: productCta,
  },
};

const phoneRecordingBlog = {
  metaTitle: "How to Record a Football Match on Your Phone",
  metaDescription: "Learn how to record football with a phone, choose one or two phone positions, avoid blind spots and pick a safe mount for your pitch.",
  heroH1: "How to Record a Football Match on Your Phone",
  intro: "A good football recording is mostly about height, stability, consent and a clear view of the important playing area.",
  contentBlocks: [
    h2("start-heading", "Before you press record"),
    p("start-copy", "Check that the venue allows recording, get the necessary consent and choose a position where the phone is away from players, spectators and emergency routes. Pitchside is focused on suitable 5-, 6- and 7-a-side footage during private beta."),
    h2("one-phone-heading", "One-phone setup"),
    p("one-phone-copy", "One phone is most useful on smaller pitches when a wide, stable landscape view can capture the important playing area. A central elevated position usually gives the most balanced view, but a raised corner can work for compact cages."),
    h2("two-phone-heading", "Two-phone setup"),
    p("two-phone-copy", "Two phones can cover opposing halves or different angles. Record the same kickoff or a visible clap before the game so the recordings have a clear synchronisation moment."),
    h2("settings-heading", "Phone settings"),
    p("settings-copy", "Use landscape orientation and test your own device before relying on it for a full match. Higher resolution and frame rate can improve detail, but they also use more storage and battery. Do not assume one setting is right for every phone."),
    h2("iphone-android-heading", "iPhone and Android checks"),
    list("phone-checks", ["Free storage before arriving at the pitch.", "Charge the battery and bring a power bank for longer matches.", "Clean the lens.", "Use a focus or Do Not Disturb mode so calls and notifications do not interrupt recording.", "Record a short test clip and watch it before kickoff."]),
    h2("mount-heading", "Choose a phone mount for your pitch"),
    p("mount-intro", "The right mount depends less on your phone and more on what surrounds the pitch. Before buying anything, check whether the venue has rigid fencing, netting posts or completely open grass. The phone must be held securely, positioned away from players and spectators, and mounted without damaging venue property."),
    p("affiliate-disclosure", "Affiliate disclosure: Some links below are paid links. If you buy through them, Pitchside may earn a commission at no additional cost to you. Our recommendations are based on suitability for different pitch setups, not commission rates. As an Amazon Associate I earn from qualifying purchases. Read the full <a href=\"/affiliate-disclosure\">affiliate disclosure</a>."),
    h3("budget-fence-heading", "Cheapest option for rigid fencing"),
    p("budget-fence-best", "<b>Best for:</b> caged 5-a-side pitches with secure fencing or railings"),
    p("budget-fence-copy", "This is the inexpensive style of mount Dave has used himself. Its flexible legs can attach to suitable rigid fencing or a secure railing, making it a practical starting point for many small-sided venues. It is less suitable for open grass pitches, loose netting or places where the phone could be struck by the ball."),
    p("budget-fence-link", "<a href=\"https://amzn.to/44FurlS\" target=\"_blank\" rel=\"sponsored nofollow noopener\">View the budget fence mount on Amazon - paid link</a>"),
    h3("covered-fence-heading", "Fence mount with additional cover"),
    p("covered-fence-best", "<b>Best for:</b> fenced pitches where glare or changeable weather is a concern"),
    p("covered-fence-copy", "This option attaches to suitable fencing and provides more cover around the phone. The hood may help reduce direct sunlight and offer limited protection in light rain, but it should not be treated as a guarantee that the phone is waterproof. Stop recording if weather conditions could damage the phone or make the setup unsafe."),
    p("covered-fence-link", "<a href=\"https://amzn.to/4fpobUq\" target=\"_blank\" rel=\"sponsored nofollow noopener\">View the covered fence mount on Amazon - paid link</a>"),
    h3("post-heading", "Mount for a suitable netting post"),
    p("post-best", "<b>Best for:</b> pitches with netting and suitable supporting posts"),
    p("post-copy", "Some grassroots pitches have loose perimeter netting rather than rigid fencing. Where venue rules allow it, a mount designed for a solid supporting post can provide a more stable position than attaching directly to the netting. Check that the post is secure and that the mount cannot fall onto the playing area."),
    p("post-link", "<a href=\"https://amzn.to/4bnus1N\" target=\"_blank\" rel=\"sponsored nofollow noopener\">View the post mount on Amazon - paid link</a>"),
    h3("tripod-heading", "Tripod for open grass"),
    p("tripod-best", "<b>Best for:</b> Sunday league and open grass pitches with nothing secure to attach to"),
    p("tripod-copy", "A freestanding tripod is usually the most practical option when the pitch has no suitable fencing, railing or post. Position it outside the playing area and pedestrian routes. Use appropriate ballast when conditions allow, never leave it unstable in strong wind, and make sure the setup complies with the venue's rules."),
    h3("kickoff-heading", "Check these things before kickoff"),
    list("kickoff-list", ["Confirm that the venue allows recording and mounting equipment.", "Obtain the necessary <a href=\"/recording-consent-and-privacy\">recording consent</a>.", "Keep the mount outside the playing area and emergency routes.", "Film in landscape orientation.", "Check that both goals and the important playing area are visible.", "Make sure the phone cannot fall onto players or spectators.", "Check storage and battery before the match.", "Record a short test clip and watch it before kickoff.", "Do not leave the equipment unattended."]),
    p("setup-guide-link", "For one-phone and two-phone positioning, common blind spots and setup diagrams, read our complete <a href=\"/technology/football-recording-setup\">football recording setup guide</a>. Check <a href=\"/product-status\">Product Status</a> for current app and mount availability."),
  ],
};

const veoAlternativeBlog = {
  metaTitle: "Veo Camera Alternatives Compared",
  metaDescription: "Compare researched Veo alternatives including phone-first and dedicated camera options, with current status, public pricing notes and fair limitations.",
  heroH1: "Veo Camera Alternatives Compared",
  intro: "This comparison helps teams decide whether they need a dedicated camera workflow, a phone-based workflow or a lower-cost recording setup.",
  contentBlocks: [
    h2("checked-heading", "Checked date and source standard"),
    p("checked-copy", "Prices and public availability were reviewed on 23 July 2026. Where a current official price is not publicly disclosed, the table says not publicly disclosed rather than guessing."),
    h2("veo-go-heading", "Veo Go is the important phone-based Veo option"),
    p("veo-go-copy", "Veo Go should be considered separately from dedicated Veo camera hardware because it is a phone-based Veo workflow. Check Veo's official documentation for current phone, rig, tripod, editor, recording and availability requirements."),
    h2("comparison-heading", "Research comparison"),
    table("comparison-table", ["Option", "Type", "Public price status", "Best fit", "Research status"], [
      ["Pitchside", "Phone-first small-sided stats and highlights", "Free £0; Paid £4.99 weekly, £12.99 monthly or £99 annually; not purchasable yet", "5-, 6- and 7-a-side players with suitable phones", "Pitchside product information"],
      ["Veo camera", "Dedicated football camera workflow", "Check official Veo pricing", "Established full-field capture, tactical review and livestreaming", "Researched from official manufacturer sources"],
      ["Veo Go", "Phone-based Veo workflow", "Not publicly disclosed in this CMS update", "Teams considering Veo without dedicated camera hardware", "Researched from official Veo sources"],
      ["Other dedicated systems", "Dedicated or semi-dedicated camera workflows", "Not publicly disclosed unless shown by manufacturer", "Clubs needing established team video systems", "Researched from official manufacturer sources"],
    ]),
    h2("links-heading", "Read next"),
    list("links-list", ["See Pitchside's <a href=\"/best-veo-alternative-football\">phone-first Veo alternative page</a>.", "Compare <a href=\"/blog/cheapest-veo-alternative\">hardware and three-year costs</a>.", "Review the <a href=\"/comparison-methodology\">comparison methodology</a>.", "Learn how to <a href=\"/record-football-matches\">record football matches with phones</a>."]),
  ],
};

const cheapestVeoBlog = {
  metaTitle: "Cheapest Veo Alternatives: Hardware and 3-Year Costs",
  metaDescription: "Compare football recording options by software price, hardware needs and three-year cost. Pitchside remains private beta and phone/mount costs are separate.",
  heroH1: "Which Veo Alternative Costs the Least?",
  intro: "The cheapest setup depends on whether your team already owns suitable phones, whether you need dedicated camera hardware and what output you expect after the match.",
  contentBlocks: [
    h2("pitchside-cost-heading", "Pitchside announced launch pricing"),
    table("pitchside-cost-table", ["Item", "Cost", "Notes"], [
      ["Additional camera hardware", "£0 if suitable phones are already owned", "Phones, mounts and data costs are separate"],
      ["Free software", "£0", "One recording per month"],
      ["Paid weekly", "£4.99", "One recording per week"],
      ["Paid monthly", "£12.99", "One recording per week"],
      ["Paid annual", "£99", "One recording per week; £8.25/month equivalent"],
      ["Three-year annual software cost", "£297", "Excludes phones, mounts, data, taxes and accessories"],
    ]),
    p("fair-summary", "Pitchside has the lowest announced software entry price in this comparison when a team already owns suitable phones. It is not a like-for-like replacement for Veo's dedicated full-field recording and livestreaming workflow."),
    h2("official-prices-heading", "Official price-check notes"),
    p("official-prices-copy", "Checked on 23 July 2026. Prices that are not clearly available from official manufacturer sources are labelled as not publicly disclosed. Currency, tax, shipping, accessories and promotional status can change."),
    h2("low-cost-setup-heading", "Lowest-cost phone setup"),
    p("low-cost-setup-copy", "A suitable phone the team already owns plus a safe mount is usually the lowest-cost way to record a match. The complete mount roundup lives in the <a href=\"/blog/how-to-record-a-football-match-on-your-phone\">phone recording guide</a>; this cost page keeps affiliate links limited and disclosed."),
    h2("faq-heading", "Frequently asked questions"),
    h3("faq-cheapest", "What is the cheapest Veo alternative?"),
    p("faq-cheapest-answer", "The cheapest way to record a football match is normally a suitable phone the team already owns plus a secure mount. Pitchside's announced Free plan costs £0 and includes one recording per month. Paid access is £4.99 weekly, £12.99 monthly or £99 annually, with one recording per week and Personal Clips. Pitchside remains in private beta, and phones, mounts and data costs are separate."),
    h3("faq-cheaper", "Is Pitchside cheaper than Veo?"),
    p("faq-cheaper-answer", "Based on Pitchside's announced launch prices, Pitchside has a lower software and hardware entry cost when a team already owns suitable phones. It is not a like-for-like product: Veo provides dedicated capture and broader full-field workflows, while Pitchside focuses on small-sided phone footage, stats, highlights and player records."),
    h3("faq-cost", "How much does Pitchside cost?"),
    p("faq-cost-answer", "The Free launch tier costs £0 and includes Match Stats & Highlights, Leaderboards, Personal Stats and one recording per month. Paid adds Personal Clips and one recording per week for £4.99 weekly, £12.99 monthly or £99 annually. Subscriptions are not currently available to purchase."),
    h3("faq-camera", "Does Pitchside require a special camera?"),
    p("faq-camera-answer", "No dedicated camera is required. Pitchside is designed around suitable footage recorded with one or two phones. A secure mount may still be needed, and the result depends on positioning, visibility and footage quality."),
    h3("faq-best", "Is the cheapest football camera option always the best?"),
    p("faq-best-answer", "No. A phone setup may have the lowest starting cost, but a dedicated system may be more appropriate for full-pitch tactical footage, livestreaming or an established club workflow. Compare the output you need, not only the initial hardware price."),
    h2("links-heading", "Read next"),
    list("links-list", ["Compare Pitchside with Veo on the <a href=\"/best-veo-alternative-football\">Veo alternative page</a>.", "Read the wider <a href=\"/blog/veo-camera-alternative\">Veo camera alternatives comparison</a>.", "Check <a href=\"/pricing\">planned Pitchside pricing</a>.", "Review the <a href=\"/comparison-methodology\">comparison methodology</a> and <a href=\"/affiliate-disclosure\">affiliate disclosure</a>."]),
  ],
};

const ops = [];
for (const [slug, merge] of Object.entries(productPages)) {
  ops.push({ collection: "pages", slug, merge: { ...merge, slug, publishedAt: "2026-07-23T00:00:00.000Z", authorName: "Abdullah Luqman", authorUrl: "/authors/abdullah-luqman" } });
}
ops.push({ collection: "posts", slug: "how-to-record-a-football-match-on-your-phone", merge: { ...phoneRecordingBlog, slug: "how-to-record-a-football-match-on-your-phone", publishedAt: "2026-06-04T21:59:46.295Z", authorName: "Abdullah Luqman", authorUrl: "/authors/abdullah-luqman" } });
ops.push({ collection: "posts", slug: "veo-camera-alternative", merge: { ...veoAlternativeBlog, slug: "veo-camera-alternative", publishedAt: "2026-07-19T20:31:21.649Z", authorName: "Abdullah Luqman", authorUrl: "/authors/abdullah-luqman" } });
ops.push({ collection: "posts", slug: "cheapest-veo-alternative", merge: { ...cheapestVeoBlog, slug: "cheapest-veo-alternative", publishedAt: "2026-07-19T20:15:22.596Z", authorName: "Abdullah Luqman", authorUrl: "/authors/abdullah-luqman" } });

const patch = {
  label: `SEO/CRO cleanup, pricing correction and recording cluster update - ${now}`,
  operator: "codex-local-service-account",
  operations: ops,
};

fs.mkdirSync("cms-patches", { recursive: true });
fs.writeFileSync("cms-patches/2026-07-23-seo-cro-recording-veo-patch.json", JSON.stringify(patch, null, 2));
console.log("cms-patches/2026-07-23-seo-cro-recording-veo-patch.json");
console.log(`${ops.length} operations`);
