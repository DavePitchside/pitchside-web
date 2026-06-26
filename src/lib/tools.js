export const SITE_URL = "https://pitchside.ai";

export const toolsHub = {
  id: "tools-hub",
  slug: "tools",
  title: "Free Football Tools",
  metaTitle: "Free Football Tools for 5-a-Side, Futsal & Grassroots Teams",
  metaDescription:
    "Use free football tools for 5-a-side, futsal and grassroots teams. Generate teams, build formations, create tables and track stats.",
  heroH1: "Free Football Tools for 5-a-Side, Futsal and Grassroots Teams",
  intro:
    "Practical tools for players, captains and organisers before kickoff. Split teams, plan formations, choose a name, manage a table and track the stats that make grassroots matches easier to run.",
  badge: "Pitchside tools",
  hero: {
    eyebrow: "Pitchside tools",
    primaryCtaLabel: "Explore tools",
    secondaryCtaLabel: "Get early access",
    previewLabel: "Tools ecosystem",
    previewType: "hub",
    previewData: {
      tools: ["Team Generator", "Formation Builder", "Team Names", "League Table", "Stats Tracker"],
      notes: ["Plan before kickoff", "Review better when Pitchside launches"],
    },
  },
  aeoQuickAnswer:
    "Pitchside's free football tools help 5-a-side, futsal, Sunday league and grassroots teams generate balanced sides, build formations, create team names, calculate league tables and track match stats.",
  ctaBlock: {
    headline: "Track manually now, automate later with Pitchside",
    description:
      "Pitchside AI is being built to turn match footage into stats, highlights and shareable moments for amateur football, futsal and grassroots teams.",
    buttonText: "Join the waitlist",
  },
  contentBlocks: [
    {
      type: "h2",
      content: "Tools for players before kickoff",
    },
    {
      type: "paragraph",
      content:
        "Most amateur football admin happens in the hour before a game: who plays together, where everyone starts, what the teams are called and how the result gets recorded. These tools keep that work quick without forcing a captain into a spreadsheet.",
    },
    {
      type: "h2",
      content: "Built for captains and organisers",
    },
    {
      type: "paragraph",
      content:
        "Use the team generator for fair sides, the formation builder for 5-a-side, futsal, 7-a-side or 11-a-side shape, the name generator for team identity, the league table generator for standings and the stats tracker for goals, assists, saves and tackles.",
    },
    {
      type: "h2",
      content: "Where Pitchside fits",
    },
    {
      type: "paragraph",
      content:
        "Manual tools are useful now. Pitchside's long-term product vision is to help teams review matches better by turning football footage into stats, highlights and moments players can share when the app launches.",
    },
  ],
};

const rawTools = [
  {
    id: "random-5-a-side-team-generator",
    slug: "random-5-a-side-team-generator",
    title: "Random Football Team Generator",
    shortTitle: "Team Generator",
    metaTitle: "Random Football Team Generator for 5-a-Side & Futsal",
    metaDescription:
      "Split players into fair football or futsal teams with a free random team generator. Build 5-a-side, 6-a-side, 7-a-side or casual teams fast.",
    llmDescription:
      "Free tool for splitting football or futsal players into balanced 5-a-side, 6-a-side, 7-a-side or casual teams.",
    heroH1: "Random Football Team Generator for 5-a-Side, Futsal and Casual Matches",
    intro:
      "Paste your player list, choose the number of teams and split football or futsal players into random or balanced sides before kickoff.",
    aeoQuickAnswer:
      "Use this random football team generator to split players into fair 5-a-side, 6-a-side, 7-a-side, futsal or casual teams. Add ratings such as Alex 4 or Sam, 3 and mark goalkeepers with GK to balance the split.",
    badge: "Squad Splitter",
    hero: {
      eyebrow: "Squad splitter",
      primaryCtaLabel: "Use the team generator",
      secondaryCtaLabel: "Join the waitlist",
      previewLabel: "Balanced split",
      previewType: "teams",
      previewData: {
        teams: [
          { name: "Team A", players: ["Alex · Forward", "Chris · Goalkeeper", "Dani · Midfielder"] },
          { name: "Team B", players: ["Ben · Defender", "Elliot · Winger", "Jules · Forward"] },
        ],
      },
    },
    outputLabel: "Teams",
    ctaBlock: {
      headline: "Picked your teams?",
      description:
        "Pitchside AI is being built to turn match footage into stats, highlights and shareable moments. Join the waitlist.",
      buttonText: "Join the waitlist",
    },
    faqs: [
      {
        question: "Can I use this as a 5-a-side team generator?",
        answer:
          "Yes. Add your players, choose two teams and generate a quick 5-a-side split. It also works for 6-a-side, 7-a-side, futsal and casual football groups.",
      },
      {
        question: "Can I split players by position?",
        answer:
          "Yes. Add each player with a position such as goalkeeper, defender, midfielder, winger, forward or any. For 11-a-side squads, use more specific roles such as full-back, centre-back, winger and striker. Ratings can also help balance ability.",
      },
      {
        question: "Can I use this for futsal?",
        answer:
          "Yes. Futsal teams need balance through the keeper, last player, wide runners and pivot, so a random team generator is useful when regular squads change each week.",
      },
      {
        question: "How do I make football teams fair?",
        answer:
          "Rate players honestly, separate known goalkeepers and avoid putting every strong defender or finisher on the same side. If the first split looks wrong, regenerate or tweak a player rating.",
      },
      {
        question: "Can I copy the teams to WhatsApp?",
        answer:
          "Yes. Generate the teams and use the copy button to share the split in WhatsApp, a group chat or your league organiser notes.",
      },
      {
        question: "Is this the same as a random team picker?",
        answer:
          "It works like a random team picker, but it is tuned for football with optional balancing, player ratings and goalkeeper handling.",
      },
      {
        question: "Can this help before a Sunday league or grassroots match?",
        answer:
          "Yes. It is useful for training nights, five-a-side bookings, futsal sessions, Sunday league warm-ups and grassroots groups where squads change late.",
      },
    ],
    contentBlocks: [
      {
        type: "h2",
        content: "Why use a random team generator before kickoff?",
      },
      {
        type: "paragraph",
        content:
          "When players arrive at different times or the numbers change, picking teams by memory can waste time and create arguments. A random football team generator gives the group a neutral starting point and gets the ball moving faster.",
      },
      {
        type: "h2",
        content: "How to split football players fairly",
      },
      {
        type: "paragraph",
        content:
          "Enter one player per line. For a fairer split, add a simple rating from 1 to 5 after the name, such as <strong>Ali 4</strong>, <strong>Ben, 2</strong> or <strong>Chris GK 5</strong>. The tool spreads higher and lower ratings across the teams.",
      },
      {
        type: "h2",
        content: "Balance keepers, defenders and forwards",
      },
      {
        type: "paragraph",
        content:
          "Small-sided football changes quickly when one team has all the keepers, defenders or natural finishers. Mark goalkeepers with GK first, then use ratings to make sure ball winners, runners and forwards are not stacked on one side.",
      },
      {
        type: "h2",
        content: "Use it for football, futsal and casual groups",
      },
      {
        type: "paragraph",
        content:
          "The generator works for 5-a-side, 6-a-side, 7-a-side, futsal and informal matches. For futsal, try to keep one reliable defensive player and one comfortable ball carrier on each team where possible.",
      },
      {
        type: "h2",
        content: "Common mistakes",
      },
      {
        type: "list",
        items: [
          "Using random mode when the group has a big ability gap.",
          "Forgetting to mark goalkeepers before generating teams.",
          "Treating ratings as permanent instead of adjusting them for fitness, injuries or late arrivals.",
        ],
      },
      {
        type: "h2",
        content: "After the teams are picked",
      },
      {
        type: "paragraph",
        content:
          "Once the sides are set, build a shape with the formation builder or record goals, assists and saves with the stats tracker. Pitchside AI is being built to automate that review from match footage when it launches.",
      },
    ],
    links: [
      { href: "/tools", label: "View all football tools" },
      { href: "/tools/football-formation-builder", label: "Build a formation" },
      { href: "/tools/5-a-side-football-stats-tracker", label: "Track match stats" },
      { href: "/best-way-to-track-5aside-stats", label: "Read the 5-a-side stats guide" },
    ],
  },
  {
    id: "football-formation-builder",
    slug: "football-formation-builder",
    title: "Football Formation Builder",
    shortTitle: "Formation Builder",
    metaTitle: "Football Formation Builder & Futsal Tactics Board",
    metaDescription:
      "Build football and futsal formations for 5-a-side, 7-a-side and 11-a-side teams. Create lineups, position players and plan tactics free.",
    llmDescription:
      "Free tool for creating football and futsal formations, including 5-a-side, 7-a-side and 11-a-side lineups.",
    heroH1: "Football Formation Builder for 5-a-Side, Futsal and 11-a-Side Teams",
    intro:
      "Create a football lineup, position players and plan a simple tactical shape for 5-a-side, 6-a-side, 7-a-side, futsal or 11-a-side matches.",
    aeoQuickAnswer:
      "The football formation builder works as a lineup creator and tactics board for small-sided football, futsal and 11-a-side teams. Choose a format, pick a style and add player names to generate a shape.",
    badge: "Lineup Planner",
    hero: {
      eyebrow: "Lineup planner",
      primaryCtaLabel: "Build a formation",
      secondaryCtaLabel: "Get early access",
      previewLabel: "Tactical board",
      previewType: "formation",
      previewData: {
        shape: "1-2-1",
        positions: [
          { label: "GK", left: "50%", top: "83%" },
          { label: "CB", left: "50%", top: "62%" },
          { label: "LW", left: "32%", top: "43%" },
          { label: "RW", left: "68%", top: "43%" },
          { label: "ST", left: "50%", top: "21%" },
        ],
      },
    },
    outputLabel: "Lineup",
    ctaBlock: {
      headline: "Plan your team shape before kickoff",
      description:
        "Pitchside AI is being built to help teams review stats, highlights and key moments after the match.",
      buttonText: "Get early access",
    },
    faqs: [
      {
        question: "Can I build 11-a-side football formations?",
        answer:
          "Yes. Choose the 11-a-side option to create a simple lineup with positions such as goalkeeper, full-backs, centre-backs, midfielders, wingers and striker.",
      },
      {
        question: "Can I use this as a futsal formation builder?",
        answer:
          "Yes. Use the 5-a-side format for futsal-style shapes and think in roles such as keeper, last player, wide players and pivot.",
      },
      {
        question: "What is the best 5-a-side formation?",
        answer:
          "A 1-2-1 diamond is usually the safest 5-a-side shape because it gives a defender, two passing options and a forward. A 2-2 is simpler if your team needs defensive structure.",
      },
      {
        question: "What is the best futsal formation?",
        answer:
          "Many futsal teams use a 2-2 or 1-2-1 depending on rotation and player confidence. The best shape is the one your players can keep while pressing, defending transitions and using the keeper as a reset.",
      },
      {
        question: "Is this a football tactics board?",
        answer:
          "Yes. It acts as a simple football tactics board online for planning lineups, roles and match ideas before a grassroots or amateur game.",
      },
      {
        question: "Can I add player names to the formation?",
        answer:
          "Yes. Add player names by position for Team A, then optionally add Team B with its own player list and formation. The pitch view keeps role labels visible on mobile and desktop.",
      },
      {
        question: "What is the difference between football and futsal formations?",
        answer:
          "Futsal uses a smaller court, heavier rotations and less space, so roles are more fluid. Outdoor football formations usually hold wider lanes and more fixed defensive lines.",
      },
    ],
    contentBlocks: [
      {
        type: "h2",
        content: "What a formation builder does",
      },
      {
        type: "paragraph",
        content:
          "A football formation builder helps you turn a squad list into a starting shape. It is useful when you need to explain who starts in goal, who protects the middle, who gives width and who stays high.",
      },
      {
        type: "h2",
        content: "How to create a football lineup",
      },
      {
        type: "paragraph",
        content:
          "Choose the match format, select a playing style and add player names. For grassroots teams, start with your strongest keeper or organiser, then place reliable defenders and runners before deciding attacking roles.",
      },
      {
        type: "h2",
        content: "5-a-side, futsal, 7-a-side and 11-a-side setups",
      },
      {
        type: "paragraph",
        content:
          "In 5-a-side and futsal, compact shapes such as <strong>1-2-1</strong> and <strong>2-2</strong> keep the team connected. In 7-a-side, <strong>2-3-1</strong> gives width and a clear striker. In 11-a-side, <strong>4-3-3</strong>, <strong>4-4-2</strong> and <strong>4-2-3-1</strong> are common starting points.",
      },
      {
        type: "h2",
        content: "How grassroots teams can use it",
      },
      {
        type: "paragraph",
        content:
          "Use the formation as a simple pre-match plan, then adjust after five minutes if the opposition overloads one side or your team cannot play out. A good tactics board is a conversation starter, not a rigid script.",
      },
      {
        type: "h2",
        content: "Common mistakes",
      },
      {
        type: "list",
        items: [
          "Choosing an ambitious shape that your players cannot keep when tired.",
          "Ignoring the keeper's role in small-sided build-up.",
          "Putting every ball carrier in advanced positions and leaving no one to protect counters.",
        ],
      },
      {
        type: "h2",
        content: "From planning to review",
      },
      {
        type: "paragraph",
        content:
          "Planning tactics is only the first step. Reviewing real match footage shows whether the shape actually worked. Pitchside is pre-launch and being built to help football teams turn that footage into stats, highlights and key moments.",
      },
    ],
    links: [
      { href: "/tools", label: "View all football tools" },
      { href: "/tools/random-5-a-side-team-generator", label: "Generate teams first" },
      { href: "/tools/5-a-side-football-stats-tracker", label: "Track the match" },
      { href: "/technology", label: "See Pitchside technology" },
    ],
  },
  {
    id: "football-team-name-generator",
    slug: "football-team-name-generator",
    title: "Football Team Name Generator",
    shortTitle: "Team Names",
    metaTitle: "Football Team Name Generator for 5-a-Side & Sunday League",
    metaDescription:
      "Generate funny football team names for 5-a-side, futsal and Sunday league teams. Get creative team name ideas in seconds.",
    llmDescription:
      "Free tool for generating funny and creative team names for 5-a-side, futsal, Sunday league and grassroots teams.",
    heroH1: "Football Team Name Generator for 5-a-Side, Futsal and Sunday League Teams",
    intro:
      "Generate funny, classic, local or competitive football team name ideas for 5-a-side, futsal, Sunday league and grassroots teams.",
    aeoQuickAnswer:
      "The football team name generator creates team name ideas for 5-a-side, futsal, Sunday league and grassroots football, with styles including funny, classic, local and competitive.",
    badge: "Name Maker",
    hero: {
      eyebrow: "Name maker",
      primaryCtaLabel: "Generate names",
      secondaryCtaLabel: "Join the waitlist",
      previewLabel: "Name ideas",
      previewType: "names",
      previewData: {
        names: ["Cage Kings", "Postcode Press", "North Stand Five", "Pivot Society"],
      },
    },
    outputLabel: "Name Ideas",
    ctaBlock: {
      headline: "Got your team name?",
      description:
        "Join the Pitchside waitlist to bring stats and highlights to your matches when the app launches.",
      buttonText: "Join the waitlist",
    },
    faqs: [
      {
        question: "What makes a good football team name?",
        answer:
          "A good football team name is easy to say, easy to remember and matches the team's personality. Funny names work well for casual groups, while cleaner names suit public leagues and tournaments.",
      },
      {
        question: "Can I generate funny 5-a-side team names?",
        answer:
          "Yes. Choose the funny or Sunday league style to generate lighter 5-a-side team names for group chats, leagues and tournaments.",
      },
      {
        question: "Can I use this for Sunday league team names?",
        answer:
          "Yes. The Sunday league style is built for casual football teams that want names with a local, funny or matchday feel.",
      },
      {
        question: "Can I use this for futsal team names?",
        answer:
          "Yes. The names can be used for futsal teams, indoor leagues, university tournaments and small-sided football groups.",
      },
      {
        question: "Should I choose a serious or funny team name?",
        answer:
          "Choose a funny name if the team is casual and social. Choose a cleaner name if you will use it on public fixtures, league tables, kits or sponsor material.",
      },
      {
        question: "Can I copy the generated names?",
        answer:
          "Yes. Generate a list and copy individual names or the full set into WhatsApp, notes or your league setup.",
      },
      {
        question: "What should I do after choosing a team name?",
        answer:
          "Pick teams, build a formation and start tracking results or player stats. Pitchside is being built so teams can later turn match footage into stats and highlights.",
      },
    ],
    contentBlocks: [
      {
        type: "h2",
        content: "How to choose a good football team name",
      },
      {
        type: "paragraph",
        content:
          "The best football team names fit the group. A 5-a-side team in a WhatsApp league can be playful; a grassroots side entering public competitions may want something easier to put on a badge, table and social post.",
      },
      {
        type: "h2",
        content: "Funny football team names",
      },
      {
        type: "paragraph",
        content:
          "Funny names work when they are quick to understand and not too forced. If the joke needs explaining, it probably will not land on a league table or group chat.",
      },
      {
        type: "h2",
        content: "5-a-side, futsal and Sunday league ideas",
      },
      {
        type: "paragraph",
        content:
          "For 5-a-side team names, short and sharp usually wins. For futsal, names with speed, touch or indoor identity can work. For Sunday league teams, local references, matchday habits and squad personality often make the name feel more real.",
      },
      {
        type: "h2",
        content: "Why team identity matters",
      },
      {
        type: "paragraph",
        content:
          "A name gives a casual group something to rally around. It makes fixtures, stats, group chats and highlights feel like part of the same story rather than one-off games.",
      },
      {
        type: "h2",
        content: "Common mistakes",
      },
      {
        type: "list",
        items: [
          "Choosing a name that is too long for a league table or kit.",
          "Copying a famous club name without adding any identity of your own.",
          "Picking a joke that only two players in the squad understand.",
        ],
      },
      {
        type: "h2",
        content: "After naming the team",
      },
      {
        type: "paragraph",
        content:
          "Once the name is set, use it in your team split, formation plan and stats recap. Pitchside is being built to help amateur players turn those match moments into stats and highlights when the app launches.",
      },
    ],
    links: [
      { href: "/tools", label: "View all football tools" },
      { href: "/tools/random-5-a-side-team-generator", label: "Pick balanced teams" },
      { href: "/tools/football-formation-builder", label: "Build a formation" },
      { href: "/tools/5-a-side-football-stats-tracker", label: "Track team stats" },
    ],
  },
  {
    id: "football-league-table-generator",
    slug: "football-league-table-generator",
    title: "Football League Table Generator",
    shortTitle: "League Table",
    metaTitle: "Football League Table Generator & Points Table Maker",
    metaDescription:
      "Create a football league table free. Add teams, wins, draws, goals and points for 5-a-side, futsal and grassroots leagues.",
    llmDescription:
      "Free tool for creating football, futsal and grassroots league tables with points and goal difference.",
    heroH1: "Football League Table Generator for 5-a-Side, Futsal and Grassroots Leagues",
    intro:
      "Create a football points table for 5-a-side, futsal, Sunday league, school leagues and grassroots tournaments with automatic points and goal difference.",
    aeoQuickAnswer:
      "The football league table generator calculates points, goal difference and rankings from wins, draws, losses, goals for and goals against, then sorts teams by points, goal difference and goals scored.",
    badge: "Table Builder",
    hero: {
      eyebrow: "Table builder",
      primaryCtaLabel: "Create a league table",
      secondaryCtaLabel: "Get early access",
      previewLabel: "Live standings",
      previewType: "table",
      previewData: {
        rows: [
          ["Pitchside FC", "12", "+8"],
          ["Astro United", "9", "+3"],
          ["Five Alive", "7", "0"],
          ["Late Kickoff", "3", "-6"],
        ],
      },
    },
    outputLabel: "Table",
    ctaBlock: {
      headline: "Managing your league manually?",
      description:
        "Pitchside AI is being built to make grassroots football stats and highlights easier for every team.",
      buttonText: "Get early access",
    },
    faqs: [
      {
        question: "How does a football league table work?",
        answer:
          "A football league table ranks teams using match results. The usual columns are played, wins, draws, losses, goals for, goals against, goal difference and points.",
      },
      {
        question: "How are points calculated in football?",
        answer:
          "The standard football system gives three points for a win, one point for a draw and zero points for a loss.",
      },
      {
        question: "How is goal difference calculated?",
        answer:
          "Goal difference is goals for minus goals against. For example, 18 goals scored and 10 conceded gives a goal difference of +8.",
      },
      {
        question: "Can I use this for a 5-a-side league?",
        answer:
          "Yes. It works well for 5-a-side leagues, work tournaments, school competitions and weekly small-sided groups.",
      },
      {
        question: "Can I use this for futsal?",
        answer:
          "Yes. Futsal leagues use the same basic table logic: wins, draws, losses, goals, goal difference and points. You can also add individual match results between two teams and update the table.",
      },
      {
        question: "Can I copy the league table?",
        answer:
          "Yes. Use the copy button to share the current standings in WhatsApp, email or organiser notes.",
      },
      {
        question: "Can this replace a spreadsheet?",
        answer:
          "For simple standings, yes. A spreadsheet is better for full fixture history, custom rules or large competitions, but this tool is quicker for clean points tables.",
      },
    ],
    contentBlocks: [
      {
        type: "h2",
        content: "How football league tables work",
      },
      {
        type: "paragraph",
        content:
          "A league table turns match results into a clear ranking. Organisers can see who is top, who has games played, who has the best goal difference and which teams are close on points.",
      },
      {
        type: "h2",
        content: "Points and goal difference",
      },
      {
        type: "paragraph",
        content:
          "The default setup uses three points for a win and one for a draw. Goal difference is calculated by subtracting goals against from goals for, then used as a common tiebreaker when teams have the same points.",
      },
      {
        type: "h2",
        content: "For 5-a-side, futsal and grassroots leagues",
      },
      {
        type: "paragraph",
        content:
          "Small-sided leagues often move quickly, especially when teams play multiple games in one evening. A clean table helps captains and players understand the standings without waiting for a full spreadsheet update.",
      },
      {
        type: "h2",
        content: "Manual tables now, automated stats later",
      },
      {
        type: "paragraph",
        content:
          "Manual league tables are useful because they are transparent and easy to share. Pitchside is pre-launch and being built around the next step: helping teams capture match stats, highlights and player moments from footage.",
      },
      {
        type: "h2",
        content: "Common mistakes",
      },
      {
        type: "list",
        items: [
          "Updating points but forgetting goals for and goals against.",
          "Using goal difference before checking the league's official tiebreak rules.",
          "Letting team names change between weeks, which makes tables harder to compare.",
        ],
      },
    ],
    links: [
      { href: "/tools", label: "View all football tools" },
      { href: "/tools/5-a-side-football-stats-tracker", label: "Track match stats" },
      { href: "/tools/random-5-a-side-team-generator", label: "Generate teams" },
      { href: "/best-way-to-track-5aside-stats", label: "Read the 5-a-side stats guide" },
    ],
  },
  {
    id: "5-a-side-football-stats-tracker",
    slug: "5-a-side-football-stats-tracker",
    title: "5-a-Side Football Stats Tracker",
    shortTitle: "Stats Tracker",
    metaTitle: "5-a-Side Football Stats Tracker & Futsal Stat Tool",
    metaDescription:
      "Track 5-a-side football and futsal stats free. Record goals, assists, saves, tackles, dribbles and player ratings after every match.",
    llmDescription:
      "Free tool for manually tracking football and futsal stats, including goals, assists, saves, tackles, dribbles and ratings.",
    heroH1: "5-a-Side Football Stats Tracker for Football and Futsal",
    intro:
      "Record 5-a-side football and futsal match stats manually, including goals, assists, saves and tackles, then copy a clean recap for your group.",
    aeoQuickAnswer:
      "The 5-a-side football stats tracker helps amateur and grassroots players manually record goals, assists, saves, tackles and player performance notes before Pitchside automates stats and highlights from match footage in the future.",
    badge: "Match Recap",
    hero: {
      eyebrow: "Match recap",
      primaryCtaLabel: "Track match stats",
      secondaryCtaLabel: "Get early access",
      previewLabel: "Match dashboard",
      previewType: "stats",
      previewData: {
        player: "Alex",
        rating: "9.1",
        stats: ["3 Goals", "2 Assists", "8 Saves"],
      },
    },
    outputLabel: "Stats",
    ctaBlock: {
      headline: "Track manually now",
      description:
        "Pitchside AI is being built to automate football stats and highlights from match footage when it launches.",
      buttonText: "Get early access",
    },
    faqs: [
      {
        question: "What stats should I track in 5-a-side football?",
        answer:
          "Start with goals, assists, saves, tackles and a player of the match note. If your group wants more detail, add shots, dribbles, blocks, interceptions and ratings.",
      },
      {
        question: "Can I track futsal stats too?",
        answer:
          "Yes. Choose futsal 5-a-side and track goals, assists, saves, tackles, shots, dribbles, ratings and keeper actions.",
      },
      {
        question: "Can I track goalkeeper stats?",
        answer:
          "Yes. Saves and goals conceded are included, and player positions make it clear who played in goal. You can also enable second team stats for opponent keepers.",
      },
      {
        question: "What is the easiest way to track football stats?",
        answer:
          "The easiest manual method is to record key events straight after the game while everyone remembers them. For deeper accuracy, video review or automated tracking is better.",
      },
      {
        question: "Can I copy the stats to WhatsApp?",
        answer:
          "Yes. The recap is formatted so you can copy goals, assists, saves, tackles and top performers into WhatsApp or a team chat.",
      },
      {
        question: "Is this better than a football stats spreadsheet?",
        answer:
          "It is quicker for a single match recap. A spreadsheet is stronger for long-term history, but this tracker is easier when you just need clean post-match stats.",
      },
      {
        question: "Will Pitchside automate football stats in the future?",
        answer:
          "Yes. Pitchside is pre-launch and is being built to automate football stats and highlights from match footage.",
      },
    ],
    contentBlocks: [
      {
        type: "h2",
        content: "What stats matter in 5-a-side football?",
      },
      {
        type: "paragraph",
        content:
          "The most useful 5-a-side stats are the ones players actually remember and care about: goals, assists, saves, tackles, shots, dribbles and a simple player rating. Keep the first version simple so the habit sticks.",
      },
      {
        type: "h2",
        content: "Goals, assists, saves, tackles and ratings",
      },
      {
        type: "paragraph",
        content:
          "Goals and assists explain the score. Saves and tackles show defensive impact. Dribbles, shots and ratings add context for players who create danger without always scoring.",
      },
      {
        type: "h2",
        content: "Keeper-specific stats",
      },
      {
        type: "paragraph",
        content:
          "In 5-a-side and futsal, the keeper can decide the whole match. Track saves, key blocks, one-on-one stops and distribution notes so goalkeeper performances are not reduced to the final score.",
      },
      {
        type: "h2",
        content: "Manual tracker, spreadsheet or future AI tracking?",
      },
      {
        type: "paragraph",
        content:
          "A manual stat tracker is fastest after one match. A football stats spreadsheet is better for season history. Future AI tracking should reduce the admin by reading events from match footage and turning them into stats and highlights.",
      },
      {
        type: "h2",
        content: "Grassroots players deserve stats too",
      },
      {
        type: "paragraph",
        content:
          "Stats should not be limited to professional football. Amateur players, Sunday league teams, futsal groups and 5-a-side squads all have goals, saves, tackles and moments worth remembering.",
      },
      {
        type: "h2",
        content: "Common mistakes",
      },
      {
        type: "list",
        items: [
          "Trying to track too many advanced stats before the group has a simple routine.",
          "Ignoring goalkeeper impact because only goals and assists are counted.",
          "Waiting too long after the match, when key assists and saves are already forgotten.",
        ],
      },
      {
        type: "h2",
        content: "How Pitchside connects",
      },
      {
        type: "paragraph",
        content:
          "This tool helps you track manually now. Pitchside is being built to automate football stats and highlights from match footage, so grassroots teams can review games better when the app launches.",
      },
    ],
    links: [
      { href: "/tools", label: "View all football tools" },
      { href: "/best-way-to-track-5aside-stats", label: "Read the 5-a-side stats guide" },
      { href: "/tools/football-league-table-generator", label: "Update the league table" },
      { href: "/tools/football-formation-builder", label: "Plan the next lineup" },
      { href: "/technology", label: "See Pitchside technology" },
    ],
  },
];

export const toolHeroDefaults = Object.fromEntries(rawTools.map((tool) => [tool.slug, tool.hero]));

export const tools = rawTools.map((tool) => ({
  ...tool,
  hero: {
    ...tool.hero,
    eyebrow: tool.hero?.eyebrow || tool.badge,
    secondaryCtaLabel: tool.hero?.secondaryCtaLabel || "Join the waitlist",
  },
}));

export const toolSlugs = tools.map((tool) => tool.slug);

export function getToolBySlug(slug) {
  return tools.find((tool) => tool.slug === slug) || null;
}

export function mergeToolContent(tool, adminData) {
  if (!adminData) return tool;
  return {
    ...tool,
    ...adminData,
    id: tool.id,
    slug: tool.slug,
    links: tool.links,
    badge: adminData.badge || tool.badge,
    intro: adminData.intro || tool.intro,
    hero: {
      ...(tool.hero || {}),
      ...(adminData.hero || {}),
      previewData: {
        ...(tool.hero?.previewData || {}),
        ...(adminData.hero?.previewData || {}),
      },
    },
    outputLabel: tool.outputLabel,
    llmDescription: adminData.llmDescription || tool.llmDescription,
    ctaBlock: {
      ...tool.ctaBlock,
      ...(adminData.ctaBlock || {}),
    },
    faqs: adminData.faqs?.length ? adminData.faqs : tool.faqs,
    contentBlocks: adminData.contentBlocks?.length ? adminData.contentBlocks : tool.contentBlocks,
  };
}

export function mergeToolsHubContent(adminData) {
  if (!adminData) return toolsHub;
  return {
    ...toolsHub,
    ...adminData,
    id: toolsHub.id,
    slug: toolsHub.slug,
    intro: adminData.intro || toolsHub.intro,
    badge: adminData.badge || toolsHub.badge,
    hero: {
      ...(toolsHub.hero || {}),
      ...(adminData.hero || {}),
      previewData: {
        ...(toolsHub.hero?.previewData || {}),
        ...(adminData.hero?.previewData || {}),
      },
    },
    ctaBlock: {
      ...toolsHub.ctaBlock,
      ...(adminData.ctaBlock || {}),
    },
    contentBlocks: adminData.contentBlocks?.length ? adminData.contentBlocks : toolsHub.contentBlocks,
  };
}

export function stripHtml(value = "") {
  return String(value).replace(/<[^>]+>/g, "");
}

export function contentBlocksToMarkdown(blocks = []) {
  return blocks
    .map((block) => {
      if (block.type === "h2" && block.content) return `## ${stripHtml(block.content)}`;
      if (block.type === "h3" && block.content) return `### ${stripHtml(block.content)}`;
      if (block.type === "paragraph" && block.content) return stripHtml(block.content);
      if (block.type === "list" && block.items?.length) {
        return block.items.filter(Boolean).map((item) => `- ${stripHtml(item)}`).join("\n");
      }
      if (block.type === "table" && block.headers?.length) {
        const header = `| ${block.headers.map(stripHtml).join(" | ")} |`;
        const divider = `| ${block.headers.map(() => "---").join(" | ")} |`;
        const rows = (block.rows || []).map((row) => `| ${(row.cells || []).map(stripHtml).join(" | ")} |`);
        return [header, divider, ...rows].join("\n");
      }
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}
