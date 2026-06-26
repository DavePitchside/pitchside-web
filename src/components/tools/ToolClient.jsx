"use client";

import { useMemo, useState } from "react";
import { Copy, Plus, RefreshCw, RotateCcw, Shuffle, Star, Trophy, Wand2 } from "lucide-react";

const neon = "#CCFF00";
const inputClass = "w-full min-w-0 min-h-12 rounded-2xl border-2 border-black bg-white px-4 py-3 text-base font-bold text-black outline-none transition focus:border-[#CCFF00] focus:ring-4 focus:ring-[#CCFF00]/45";
const smallInputClass = "w-full min-w-0 rounded-xl border border-black/20 bg-white px-3 py-2.5 text-sm font-bold text-black outline-none transition focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/45";
const labelClass = "text-[10px] font-black uppercase tracking-[0.22em] text-zinc-600";
const buttonClass = "inline-flex min-h-12 w-full min-w-0 max-w-full items-center justify-center gap-2 whitespace-normal break-words rounded-2xl border-2 border-black bg-black px-4 py-3 text-center text-[11px] font-black uppercase leading-tight tracking-[0.12em] text-[#CCFF00] shadow-[3px_3px_0px_#CCFF00] transition hover:-translate-y-0.5 hover:bg-[#CCFF00] hover:text-black hover:shadow-[3px_3px_0px_#000] focus:outline-none focus:ring-4 focus:ring-[#CCFF00]/45 sm:w-auto sm:px-5 sm:text-xs sm:tracking-widest";
const secondaryButtonClass = "inline-flex min-h-12 w-full min-w-0 max-w-full items-center justify-center gap-2 whitespace-normal break-words rounded-2xl border-2 border-black bg-white px-4 py-3 text-center text-[11px] font-black uppercase leading-tight tracking-[0.12em] text-black transition hover:bg-black hover:text-[#CCFF00] focus:outline-none focus:ring-4 focus:ring-[#CCFF00]/45 sm:w-auto sm:px-5 sm:text-xs sm:tracking-widest";

const footballFormats = [
  { value: "5", label: "5-a-side" },
  { value: "6", label: "6-a-side" },
  { value: "7", label: "7-a-side" },
  { value: "11", label: "11-a-side" },
];
const futsalFormats = [{ value: "futsal5", label: "Futsal 5-a-side" }];
const generalPositions = ["Goalkeeper", "Defender", "Midfielder", "Winger", "Forward", "Any"];
const elevenPositions = ["Goalkeeper", "Right Back", "Centre Back", "Left Back", "Defensive Midfielder", "Central Midfielder", "Attacking Midfielder", "Right Winger", "Left Winger", "Striker", "Any"];
const futsalPositions = ["Goalkeeper", "Fix / Defender", "Ala / Winger", "Pivot / Forward", "Any"];
const teamLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function formatsForSport(sport) {
  return sport === "futsal" ? futsalFormats : footballFormats;
}

function positionsFor(sport, format) {
  if (sport === "futsal") return futsalPositions;
  if (format === "11") return elevenPositions;
  return generalPositions;
}

function clampNumber(value, min = 0, max = 99) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function normalizePosition(value = "Any") {
  const lowered = value.toLowerCase();
  if (lowered.includes("goal") || lowered === "gk") return "Goalkeeper";
  if (lowered.includes("back") || lowered.includes("def") || lowered.includes("fix")) return "Defender";
  if (lowered.includes("wing") || lowered.includes("ala")) return "Winger";
  if (lowered.includes("striker") || lowered.includes("forward") || lowered.includes("pivot")) return "Forward";
  if (lowered.includes("mid")) return "Midfielder";
  return "Any";
}

function shuffleList(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function parseBulkPlayers(raw, options = {}) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const ratingMatch = line.match(/(?:,|\s)([1-5])$/);
      const rating = ratingMatch ? Number(ratingMatch[1]) : 3;
      const withoutRating = ratingMatch ? line.slice(0, ratingMatch.index).trim().replace(/,$/, "") : line;
      const position = /\b(gk|keeper|goalkeeper)\b/i.test(withoutRating) ? "Goalkeeper" : "Any";
      const name = withoutRating.replace(/\b(gk|keeper|goalkeeper)\b/gi, "").trim() || line;
      return { id: `${Date.now()}-${index}-${name}`, name, position, rating, team: options.team || "A" };
    });
}

function positionTone(position) {
  const normalized = normalizePosition(position);
  if (normalized === "Goalkeeper") return "bg-[#CCFF00] text-black border-black";
  if (normalized === "Defender") return "bg-emerald-100 text-emerald-950 border-emerald-800";
  if (normalized === "Midfielder") return "bg-sky-100 text-sky-950 border-sky-800";
  if (normalized === "Winger") return "bg-violet-100 text-violet-950 border-violet-800";
  if (normalized === "Forward") return "bg-rose-100 text-rose-950 border-rose-800";
  return "bg-zinc-100 text-zinc-700 border-zinc-400";
}

function CopyButton({ value, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  const copyValue = async () => {
    await navigator.clipboard.writeText(value || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button type="button" onClick={copyValue} className={`${secondaryButtonClass} overflow-hidden`}>
      <Copy className="h-4 w-4 shrink-0" /> <span className="min-w-0 whitespace-normal break-words">{copied ? "Copied" : label}</span>
    </button>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`grid gap-2 ${className}`}>
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function Segmented({ label, options, value, onChange }) {
  return (
    <div className="grid min-w-0 gap-2">
      <span className={labelClass}>{label}</span>
      <div className="grid min-w-0 gap-2 sm:flex sm:flex-wrap">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`min-h-11 w-full min-w-0 max-w-full whitespace-normal break-words rounded-2xl border-2 px-3 py-2 text-center text-[11px] font-black uppercase leading-tight tracking-[0.12em] transition focus:outline-none focus:ring-4 focus:ring-[#CCFF00]/45 sm:px-4 sm:text-xs sm:tracking-widest ${
                selected ? "border-black bg-[#CCFF00] text-black shadow-[3px_3px_0px_#000]" : "border-black/20 bg-white text-zinc-600 hover:border-black hover:text-black"
              }`}
              aria-pressed={selected}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ToolPanel({ title, eyebrow, actions, children }) {
  return (
    <section id="tool-start" className="mx-auto w-full max-w-[calc(100vw-1.5rem)] scroll-mt-28 overflow-hidden rounded-[1.1rem] border-2 border-black bg-white shadow-[3px_3px_0px_#000] sm:max-w-full md:rounded-[1.6rem] md:shadow-[8px_8px_0px_#000]">
      <div className="overflow-hidden border-b-2 border-black bg-black p-4 text-white md:p-6">
        <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            {eyebrow && <p className="mb-2 max-w-full break-words text-[8px] font-black uppercase leading-tight tracking-[0.14em] text-[#CCFF00] [overflow-wrap:anywhere] md:text-[10px] md:tracking-[0.22em]">{eyebrow}</p>}
            <h2 className="max-w-full break-words text-base font-black uppercase leading-[1.02] tracking-tight [overflow-wrap:anywhere] md:text-4xl">{title}</h2>
          </div>
          <div className="grid w-full min-w-0 gap-3 sm:flex sm:w-auto sm:flex-wrap">{actions}</div>
        </div>
      </div>
      <div className="grid min-w-0 gap-6 p-4 md:p-6">{children}</div>
    </section>
  );
}

function ResultsGrid({ children, empty }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : children;
  if ((!items || items.length === 0) && empty) {
    return <div className="grid min-h-56 place-items-center rounded-3xl border-2 border-dashed border-black bg-[#F4F3EF] p-8 text-center text-sm font-black uppercase tracking-widest text-zinc-500">{empty}</div>;
  }
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

function ResultCard({ title, children, accent = false }) {
  return (
    <div className={`rounded-2xl border-2 border-black p-4 shadow-[4px_4px_0px_#000] md:rounded-3xl md:p-5 ${accent ? "bg-black text-white shadow-[4px_4px_0px_#CCFF00]" : "bg-[#F4F3EF] text-black"}`}>
      <h3 className={`text-lg font-black uppercase tracking-tight ${accent ? "text-[#CCFF00]" : "text-black"}`}>{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function PlayerEditor({ players, setPlayers, sport, format, allowTeam = false, teams = ["A", "B"], showStats = false }) {
  const options = positionsFor(sport, format);
  const update = (id, key, value) => {
    setPlayers((current) => current.map((player) => (player.id === id ? { ...player, [key]: value } : player)));
  };
  const addPlayer = () => {
    const team = allowTeam ? teams[0] : "A";
    setPlayers((current) => [...current, { id: `${Date.now()}-${current.length}`, name: "", position: options[0], rating: 3, team, goals: 0, assists: 0, saves: 0, conceded: 0, tackles: 0, dribbles: 0, shots: 0 }]);
  };
  return (
    <div className="grid gap-3">
      {players.map((player, index) => (
        <div key={player.id} className="rounded-3xl border border-black/15 bg-[#F4F3EF] p-3 md:p-4">
          <div className="mb-3 flex items-center justify-between gap-3 md:hidden">
            <span className="rounded-full border border-black/15 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">Player {index + 1}</span>
            <button type="button" onClick={() => setPlayers((current) => current.filter((item) => item.id !== player.id))} className="rounded-full border border-black bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-black">
              Remove
            </button>
          </div>
          <div className={`grid gap-3 ${showStats ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-[1.4fr_0.95fr_repeat(8,minmax(70px,0.55fr))_auto]" : "grid-cols-2 md:grid-cols-[1.4fr_1fr_0.6fr_auto]"} items-end`}>
            <Field label={`Player ${index + 1}`} className={showStats ? "col-span-2 sm:col-span-1" : "col-span-2 md:col-span-1"}>
              <input value={player.name} onChange={(e) => update(player.id, "name", e.target.value)} className={smallInputClass} placeholder="Player name" />
            </Field>
            {allowTeam && (
              <Field label="Team" className={showStats ? "col-span-1" : ""}>
                <select value={player.team} onChange={(e) => update(player.id, "team", e.target.value)} className={smallInputClass}>
                  {teams.map((team) => <option key={team} value={team}>{team}</option>)}
                </select>
              </Field>
            )}
            <Field label="Position" className={showStats ? "col-span-2 sm:col-span-1" : ""}>
              <select value={player.position} onChange={(e) => update(player.id, "position", e.target.value)} className={smallInputClass}>
                {options.map((position) => <option key={position} value={position}>{position}</option>)}
              </select>
            </Field>
            {!showStats && (
              <Field label="Skill">
                <input type="number" min="1" max="5" value={player.rating} onChange={(e) => update(player.id, "rating", clampNumber(e.target.value, 1, 5))} className={smallInputClass} />
              </Field>
            )}
            {showStats && ["goals", "assists", "saves", "conceded", "tackles", "dribbles", "shots", "rating"].map((key) => (
              <Field key={key} label={key === "conceded" ? "GC" : key}>
                <input type="number" min="0" max={key === "rating" ? "10" : "99"} value={player[key] ?? 0} onChange={(e) => update(player.id, key, clampNumber(e.target.value, 0, key === "rating" ? 10 : 99))} className={smallInputClass} />
              </Field>
            ))}
            <button type="button" onClick={() => setPlayers((current) => current.filter((item) => item.id !== player.id))} className={`hidden min-h-11 rounded-xl border-2 border-black bg-white px-3 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-[#CCFF00] md:block ${showStats ? "col-span-2 sm:col-span-3 lg:col-span-1" : ""}`}>
              Remove
            </button>
          </div>
        </div>
      ))}
      <button type="button" onClick={addPlayer} className={secondaryButtonClass}>
        <Plus className="h-4 w-4" /> Add player
      </button>
    </div>
  );
}

function FormatControls({ sport, setSport, format, setFormat }) {
  const setSportAndFormat = (nextSport) => {
    setSport(nextSport);
    setFormat(nextSport === "futsal" ? "futsal5" : "5");
  };
  return (
    <div className="grid gap-4 rounded-3xl border border-black/10 bg-[#F4F3EF] p-4">
      <Segmented label="Sport" value={sport} onChange={setSportAndFormat} options={[{ value: "football", label: "Football" }, { value: "futsal", label: "Futsal" }]} />
      <Segmented label="Format" value={format} onChange={setFormat} options={formatsForSport(sport)} />
    </div>
  );
}

function RandomTeamsTool() {
  const [sport, setSport] = useState("football");
  const [format, setFormat] = useState("5");
  const [bulk, setBulk] = useState("");
  const [players, setPlayers] = useState([
    { id: "p1", name: "Alex", position: "Forward", rating: 5 },
    { id: "p2", name: "Ben", position: "Defender", rating: 3 },
    { id: "p3", name: "Chris", position: "Goalkeeper", rating: 4 },
    { id: "p4", name: "Dani", position: "Midfielder", rating: 2 },
    { id: "p5", name: "Elliot", position: "Winger", rating: 4 },
    { id: "p6", name: "Farah", position: "Any", rating: 3 },
    { id: "p7", name: "Gus", position: "Defender", rating: 2 },
    { id: "p8", name: "Hassan", position: "Forward", rating: 5 },
    { id: "p9", name: "Imran", position: "Goalkeeper", rating: 3 },
    { id: "p10", name: "Jules", position: "Midfielder", rating: 4 },
  ]);
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState([]);

  const importBulk = () => {
    const parsed = parseBulkPlayers(bulk);
    if (parsed.length) setPlayers((current) => [...current, ...parsed]);
    setBulk("");
  };

  const generate = () => {
    const usable = players.filter((player) => player.name.trim());
    const output = Array.from({ length: Number(teamCount) }, (_, index) => ({ name: `Team ${teamLetters[index]}`, players: [], score: 0, positions: {} }));
    const groups = ["Goalkeeper", "Defender", "Midfielder", "Winger", "Forward", "Any"].flatMap((group) =>
      shuffleList(usable.filter((player) => normalizePosition(player.position) === group)).sort((a, b) => Number(b.rating) - Number(a.rating))
    );
    groups.forEach((player) => {
      const target = output.reduce((best, team) => {
        const playerPosition = normalizePosition(player.position);
        const teamHasPosition = team.positions[playerPosition] || 0;
        const bestHasPosition = best.positions[playerPosition] || 0;
        if (teamHasPosition !== bestHasPosition) return teamHasPosition < bestHasPosition ? team : best;
        if (team.score !== best.score) return team.score < best.score ? team : best;
        return team.players.length < best.players.length ? team : best;
      }, output[0]);
      target.players.push(player);
      target.score += Number(player.rating) || 3;
      const normalized = normalizePosition(player.position);
      target.positions[normalized] = (target.positions[normalized] || 0) + 1;
    });
    setTeams(output);
  };

  const copyText = teams.map((team) => `${team.name} (${team.score})\n${team.players.map((player) => `- ${player.name} (${player.position}, ${player.rating}/5)`).join("\n")}`).join("\n\n");

  return (
    <ToolPanel title="Random football team generator" eyebrow="Balance keepers, positions and ability" actions={<CopyButton value={copyText} label="Copy to WhatsApp" />}>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <FormatControls sport={sport} setSport={setSport} format={format} setFormat={setFormat} />
          <div className="grid gap-4 rounded-3xl border border-black/10 bg-white p-4">
            <Field label="Bulk paste">
              <textarea value={bulk} onChange={(e) => setBulk(e.target.value)} rows={4} className={inputClass} placeholder="One player per line, e.g. Sam GK 4" />
            </Field>
            <button type="button" onClick={importBulk} className={secondaryButtonClass}>Import pasted players</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Number of teams">
              <input type="number" min="2" max="6" value={teamCount} onChange={(e) => setTeamCount(clampNumber(e.target.value, 2, 6))} className={inputClass} />
            </Field>
            <div className="rounded-3xl border border-[#CCFF00]/50 bg-black p-4 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#CCFF00]">Format hint</p>
              <p className="mt-2 text-sm font-bold text-zinc-200">{sport === "futsal" ? "Use keeper, fix, ala and pivot roles for cleaner futsal balance." : `${format}-a-side football works best when keepers and defenders are spread first.`}</p>
            </div>
          </div>
          <PlayerEditor players={players} setPlayers={setPlayers} sport={sport} format={format} />
          <div className="grid gap-3 sm:flex sm:flex-wrap">
            <button type="button" onClick={generate} className={buttonClass}><Shuffle className="h-4 w-4" /> Generate</button>
            <button type="button" onClick={generate} className={secondaryButtonClass}><RefreshCw className="h-4 w-4" /> Regenerate</button>
            <button type="button" onClick={() => { setTeams([]); setPlayers([]); }} className={secondaryButtonClass}><RotateCcw className="h-4 w-4" /> Reset</button>
          </div>
        </div>
        <ResultsGrid empty="Generate teams to see balanced Team A, Team B and more.">
          {teams.map((team) => (
            <ResultCard key={team.name} title={`${team.name} · rating ${team.score}`} accent>
              <ul className="space-y-2">
                {team.players.map((player) => (
                  <li key={`${team.name}-${player.id}`} className="grid gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm font-bold sm:flex sm:items-center sm:justify-between">
                    <span>{player.name}</span>
                    <span className={`w-fit rounded-full border px-2 py-1 text-[10px] font-black uppercase ${positionTone(player.position)}`}>{player.position} · {player.rating}/5</span>
                  </li>
                ))}
              </ul>
            </ResultCard>
          ))}
        </ResultsGrid>
      </div>
    </ToolPanel>
  );
}

const formationOptions = {
  football: {
    "5": ["1-2-1", "1-1-2", "2-1-1", "2-2"],
    "6": ["2-2-1", "2-1-2", "1-3-1"],
    "7": ["2-3-1", "3-2-1", "2-2-2"],
    "11": ["4-3-3", "4-4-2", "4-2-3-1", "3-5-2", "3-4-3"],
  },
  futsal: {
    futsal5: ["1-2-1 Diamond", "2-2 Box", "3-1", "1-3"],
  },
};

const roleTemplates = {
  "1-2-1": ["Goalkeeper", "Defender", "Left Winger", "Right Winger", "Forward"],
  "1-1-2": ["Goalkeeper", "Defender", "Midfielder", "Forward", "Forward"],
  "2-1-1": ["Goalkeeper", "Defender", "Defender", "Midfielder", "Forward"],
  "2-2": ["Goalkeeper", "Defender", "Defender", "Forward", "Forward"],
  "1-2-1 Diamond": ["Goalkeeper", "Fix / Defender", "Ala / Winger", "Ala / Winger", "Pivot / Forward"],
  "2-2 Box": ["Goalkeeper", "Fix / Defender", "Fix / Defender", "Ala / Winger", "Pivot / Forward"],
  "3-1": ["Goalkeeper", "Fix / Defender", "Ala / Winger", "Ala / Winger", "Pivot / Forward"],
  "1-3": ["Goalkeeper", "Fix / Defender", "Ala / Winger", "Pivot / Forward", "Pivot / Forward"],
  "2-2-1": ["Goalkeeper", "Defender", "Defender", "Midfielder", "Midfielder", "Forward"],
  "2-1-2": ["Goalkeeper", "Defender", "Defender", "Midfielder", "Forward", "Forward"],
  "1-3-1": ["Goalkeeper", "Defender", "Midfielder", "Midfielder", "Midfielder", "Forward"],
  "2-3-1": ["Goalkeeper", "Defender", "Defender", "Midfielder", "Midfielder", "Winger", "Forward"],
  "3-2-1": ["Goalkeeper", "Defender", "Defender", "Defender", "Midfielder", "Midfielder", "Forward"],
  "2-2-2": ["Goalkeeper", "Defender", "Defender", "Midfielder", "Midfielder", "Forward", "Forward"],
  "4-3-3": ["Goalkeeper", "Right Back", "Centre Back", "Centre Back", "Left Back", "Central Midfielder", "Defensive Midfielder", "Central Midfielder", "Right Winger", "Striker", "Left Winger"],
  "4-4-2": ["Goalkeeper", "Right Back", "Centre Back", "Centre Back", "Left Back", "Right Winger", "Central Midfielder", "Central Midfielder", "Left Winger", "Striker", "Striker"],
  "4-2-3-1": ["Goalkeeper", "Right Back", "Centre Back", "Centre Back", "Left Back", "Defensive Midfielder", "Defensive Midfielder", "Right Winger", "Attacking Midfielder", "Left Winger", "Striker"],
  "3-5-2": ["Goalkeeper", "Centre Back", "Centre Back", "Centre Back", "Right Winger", "Central Midfielder", "Defensive Midfielder", "Central Midfielder", "Left Winger", "Striker", "Striker"],
  "3-4-3": ["Goalkeeper", "Centre Back", "Centre Back", "Centre Back", "Right Winger", "Central Midfielder", "Central Midfielder", "Left Winger", "Right Winger", "Striker", "Left Winger"],
};

function makeLineup(players, formation) {
  const roles = roleTemplates[formation] || roleTemplates["1-2-1"];
  return roles.map((role, index) => ({ role, player: players[index]?.name || "TBC" }));
}

function FormationPitch({ lineup, label }) {
  return (
    <div className="rounded-[1.4rem] border-2 border-black bg-[#102b19] p-3 shadow-[6px_6px_0px_#000]">
      <div className="relative min-h-[390px] overflow-hidden rounded-2xl border-2 border-[#CCFF00]/80 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.12),transparent_34%),linear-gradient(90deg,rgba(255,255,255,0.07)_50%,transparent_50%)] bg-[length:auto,70px_70px] p-3 md:min-h-[520px] md:p-4">
        <div className="absolute inset-x-6 top-1/2 h-px bg-[#CCFF00]/70" />
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#CCFF00]/70" />
        <p className="relative z-10 mb-4 text-center text-[10px] font-black uppercase tracking-[0.22em] text-[#CCFF00]">{label}</p>
        <div className="relative z-10 grid h-full gap-3">
          {lineup.map((item, index) => (
            <div key={`${item.role}-${index}`} className="mx-auto w-full max-w-sm rounded-2xl border-2 border-black bg-white/95 px-4 py-3 text-center text-black shadow-[3px_3px_0px_#CCFF00]">
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{item.role}</div>
              <div className="truncate text-lg font-black uppercase tracking-tight">{item.player}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FormationTool() {
  const [sport, setSport] = useState("football");
  const [format, setFormat] = useState("5");
  const [formationA, setFormationA] = useState("1-2-1");
  const [formationB, setFormationB] = useState("1-2-1");
  const [includeB, setIncludeB] = useState(false);
  const [teamA, setTeamA] = useState([
    { id: "a1", name: "Alex", position: "Goalkeeper", rating: 3 },
    { id: "a2", name: "Ben", position: "Defender", rating: 3 },
    { id: "a3", name: "Chris", position: "Midfielder", rating: 3 },
    { id: "a4", name: "Dani", position: "Winger", rating: 3 },
    { id: "a5", name: "Elliot", position: "Forward", rating: 3 },
  ]);
  const [teamB, setTeamB] = useState([{ id: "b1", name: "Opponent GK", position: "Goalkeeper", rating: 3 }]);
  const options = formationOptions[sport][format] || formationOptions.football["5"];
  const safeFormationA = options.includes(formationA) ? formationA : options[0];
  const safeFormationB = options.includes(formationB) ? formationB : options[0];
  const lineupA = makeLineup(teamA, safeFormationA);
  const lineupB = makeLineup(teamB, safeFormationB);
  const tacticalNote = sport === "futsal" ? "Rotate the ala players, keep the fix available as a reset, and avoid leaving the pivot isolated." : format === "11" ? "Keep the distances between lines compact and use the wide roles to stretch the opponent before switching play." : "Keep one player behind the ball, one central outlet, and rotate wide runners after attacks.";
  const copyText = [`Team A · ${safeFormationA}`, ...lineupA.map((item) => `${item.role}: ${item.player}`), includeB ? `\nTeam B · ${safeFormationB}\n${lineupB.map((item) => `${item.role}: ${item.player}`).join("\n")}` : "", `\nNote: ${tacticalNote}`].filter(Boolean).join("\n");

  return (
    <ToolPanel title="Football formation builder" eyebrow="Lineups, roles and second team planning" actions={<CopyButton value={copyText} label="Copy lineup" />}>
      <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="space-y-5">
          <FormatControls sport={sport} setSport={(value) => { setSport(value); setFormat(value === "futsal" ? "futsal5" : "5"); }} format={format} setFormat={setFormat} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Team A formation">
              <select value={safeFormationA} onChange={(e) => setFormationA(e.target.value)} className={inputClass}>{options.map((item) => <option key={item}>{item}</option>)}</select>
            </Field>
            <label className="flex min-h-12 items-center gap-3 rounded-2xl border-2 border-black bg-white px-4 py-3 text-sm font-black uppercase tracking-widest">
              <input type="checkbox" checked={includeB} onChange={(e) => setIncludeB(e.target.checked)} className="h-5 w-5 accent-[#CCFF00]" /> Add Team B
            </label>
          </div>
          <ResultCard title="Team A players">
            <PlayerEditor players={teamA} setPlayers={setTeamA} sport={sport} format={format} />
          </ResultCard>
          {includeB && (
            <ResultCard title="Team B players">
              <Field label="Team B formation">
                <select value={safeFormationB} onChange={(e) => setFormationB(e.target.value)} className={inputClass}>{options.map((item) => <option key={item}>{item}</option>)}</select>
              </Field>
              <div className="mt-4">
                <PlayerEditor players={teamB} setPlayers={setTeamB} sport={sport} format={format} />
              </div>
            </ResultCard>
          )}
          <div className="rounded-3xl border-2 border-black bg-black p-5 text-[#CCFF00] shadow-[4px_4px_0px_#CCFF00]">
            <p className="text-[10px] font-black uppercase tracking-[0.22em]">Tactical note</p>
            <p className="mt-2 text-sm font-bold leading-relaxed text-zinc-100">{tacticalNote}</p>
          </div>
        </div>
        <div className={`grid gap-5 ${includeB ? "lg:grid-cols-2" : ""}`}>
          <FormationPitch label={`Team A · ${safeFormationA}`} lineup={lineupA} />
          {includeB && <FormationPitch label={`Team B · ${safeFormationB}`} lineup={lineupB} />}
        </div>
      </div>
    </ToolPanel>
  );
}

const nameBanks = {
  "5-a-side": ["Five Alive FC", "Cage Kings", "Back Post Five", "Nutmeg Unit", "Astro Authority", "The Bib Rotation", "Slot Finishers", "Small Goals Big Talk"],
  futsal: ["Pivot Society", "Ala Athletic", "Court Tempo", "Fix & Finish", "Toe Poke Union", "Indoor Press", "Futsal Flow", "The Low Blockers"],
  "sunday league": ["Late Kickoff FC", "Half-Time Oranges", "Muddy Trainers", "Borrowed Boots", "Crossbar Club", "Shin Pad Optional", "Rolling Subs", "Post-Match Pints"],
  funny: ["Expected Toulouse", "Inter Ya Nan", "Ctrl Alt De Ligt", "Game of Throw-ins", "Goal Diggers", "No Kane No Gain", "ABCDE FC", "Slide Tackle Social"],
  serious: ["Relentless FC", "Final Third", "Press Unit", "Clean Sheet Club", "Apex Athletic", "Tempo FC", "First Touch", "The Finishers"],
  "local-style": ["Station Road FC", "High Street Rovers", "Canal Side Athletic", "Park Lane Five", "Market Town FC", "Postcode Press", "Corner Shop United", "North End Athletic"],
  "pun-based": ["Tea & Busquets", "Pique Blinders", "Moves Like Agger", "Kroos Control", "Neville Wears Prada", "Obi Wan Iwobi", "Haaland Oates", "Bayer Neverlusen"],
};

function TeamNameTool() {
  const [category, setCategory] = useState("5-a-side");
  const [names, setNames] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const generate = () => {
    const bank = [...nameBanks[category], ...nameBanks.serious, ...nameBanks.funny, ...nameBanks["local-style"]];
    setNames(shuffleList([...new Set(bank)]).slice(0, 20));
  };
  const text = names.map((name, index) => `${index + 1}. ${name}`).join("\n");

  return (
    <ToolPanel title="Football team name generator" eyebrow="20 ideas by category" actions={<CopyButton value={text} label="Copy all" />}>
      <Segmented label="Category" value={category} onChange={setCategory} options={Object.keys(nameBanks).map((key) => ({ value: key, label: key }))} />
      <div className="grid gap-3 sm:flex sm:flex-wrap">
        <button type="button" onClick={generate} className={buttonClass}><Wand2 className="h-4 w-4" /> Generate 20 names</button>
        <button type="button" onClick={generate} className={secondaryButtonClass}><RefreshCw className="h-4 w-4" /> Regenerate</button>
      </div>
      <ResultsGrid empty="Choose a category and generate football team name ideas.">
        {names.map((name, index) => {
          const saved = favourites.includes(name);
          return (
            <ResultCard key={`${name}-${index}`} title={name}>
              <p className="text-sm font-bold text-zinc-600">Category: {category}. Short enough for league tables, group chats and match recaps.</p>
              <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
                <CopyButton value={name} label="Copy name" />
                <button type="button" onClick={() => setFavourites((current) => saved ? current.filter((item) => item !== name) : [...current, name])} className={saved ? buttonClass : secondaryButtonClass}>
                  <Star className="h-4 w-4" /> {saved ? "Saved" : "Save"}
                </button>
              </div>
            </ResultCard>
          );
        })}
      </ResultsGrid>
      {favourites.length > 0 && <ResultCard title="Favourites"><p className="text-sm font-black text-zinc-700">{favourites.join(" · ")}</p></ResultCard>}
    </ToolPanel>
  );
}

function LeagueTableTool() {
  const [sport, setSport] = useState("football");
  const [leagueType, setLeagueType] = useState("5-a-side");
  const [rows, setRows] = useState([
    { team: "Pitchside FC", played: 3, wins: 2, draws: 1, losses: 0, gf: 12, ga: 6 },
    { team: "Astro United", played: 3, wins: 2, draws: 0, losses: 1, gf: 10, ga: 8 },
    { team: "Five Alive", played: 3, wins: 1, draws: 1, losses: 1, gf: 8, ga: 8 },
    { team: "Late Kickoff", played: 3, wins: 0, draws: 0, losses: 3, gf: 4, ga: 12 },
  ]);
  const [result, setResult] = useState({ a: "Pitchside FC", b: "Astro United", scoreA: 0, scoreB: 0 });
  const table = useMemo(() => rows.map((row) => ({ ...row, gd: Number(row.gf) - Number(row.ga), pts: Number(row.wins) * 3 + Number(row.draws) })).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf), [rows]);
  const update = (index, key, value) => setRows((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: key === "team" ? value : clampNumber(value, 0, 999) } : row));
  const applyResult = () => {
    if (!result.a || !result.b || result.a === result.b) return;
    setRows((current) => current.map((row) => {
      const isA = row.team === result.a;
      const isB = row.team === result.b;
      if (!isA && !isB) return row;
      const gf = isA ? Number(result.scoreA) : Number(result.scoreB);
      const ga = isA ? Number(result.scoreB) : Number(result.scoreA);
      return {
        ...row,
        played: Number(row.played) + 1,
        wins: Number(row.wins) + (gf > ga ? 1 : 0),
        draws: Number(row.draws) + (gf === ga ? 1 : 0),
        losses: Number(row.losses) + (gf < ga ? 1 : 0),
        gf: Number(row.gf) + gf,
        ga: Number(row.ga) + ga,
      };
    }));
  };
  const copyText = ["Team | P | W | D | L | GF | GA | GD | PTS", ...table.map((row) => `${row.team} | ${row.played} | ${row.wins} | ${row.draws} | ${row.losses} | ${row.gf} | ${row.ga} | ${row.gd} | ${row.pts}`)].join("\n");

  return (
    <ToolPanel title="Football league table generator" eyebrow="Standings, points and match result updates" actions={<CopyButton value={copyText} label="Copy table" />}>
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <Segmented label="Sport" value={sport} onChange={setSport} options={[{ value: "football", label: "Football" }, { value: "futsal", label: "Futsal" }]} />
          <Segmented label="League type" value={leagueType} onChange={setLeagueType} options={["5-a-side", "Futsal", "Sunday league", "Grassroots", "Custom"].map((item) => ({ value: item, label: item }))} />
          <ResultCard title="Add match result">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Team A"><select value={result.a} onChange={(e) => setResult({ ...result, a: e.target.value })} className={smallInputClass}>{rows.map((row) => <option key={row.team}>{row.team}</option>)}</select></Field>
              <Field label="Team B"><select value={result.b} onChange={(e) => setResult({ ...result, b: e.target.value })} className={smallInputClass}>{rows.map((row) => <option key={row.team}>{row.team}</option>)}</select></Field>
              <Field label="Score A"><input type="number" min="0" value={result.scoreA} onChange={(e) => setResult({ ...result, scoreA: clampNumber(e.target.value, 0, 99) })} className={smallInputClass} /></Field>
              <Field label="Score B"><input type="number" min="0" value={result.scoreB} onChange={(e) => setResult({ ...result, scoreB: clampNumber(e.target.value, 0, 99) })} className={smallInputClass} /></Field>
            </div>
            <button type="button" onClick={applyResult} className={`${buttonClass} mt-4`}>Update table</button>
          </ResultCard>
        </div>
        <div className="space-y-4">
          <div className="grid gap-3 md:hidden">
            {rows.map((row, index) => (
              <div key={`mobile-row-${index}`} className="rounded-3xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
                <Field label={`Team ${index + 1}`}>
                  <input type="text" value={row.team} onChange={(e) => update(index, "team", e.target.value)} className={smallInputClass} />
                </Field>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    ["played", "P"],
                    ["wins", "W"],
                    ["draws", "D"],
                    ["losses", "L"],
                    ["gf", "GF"],
                    ["ga", "GA"],
                  ].map(([key, label]) => (
                    <Field key={key} label={label}>
                      <input type="number" min="0" value={row[key]} onChange={(e) => update(index, key, e.target.value)} className={smallInputClass} />
                    </Field>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl border border-black/10 bg-[#F4F3EF] p-3">
                    <p className={labelClass}>GD</p>
                    <p className="mt-1 text-xl font-black text-black">{Number(row.gf) - Number(row.ga)}</p>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-[#CCFF00] p-3">
                    <p className={labelClass}>PTS</p>
                    <p className="mt-1 text-xl font-black text-black">{Number(row.wins) * 3 + Number(row.draws)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden overflow-x-auto rounded-3xl border-2 border-black shadow-[6px_6px_0px_#000] md:block">
            <table className="w-full min-w-[900px] border-collapse bg-white text-left">
              <thead className="bg-black text-[#CCFF00]">
                <tr>{["Team", "P", "W", "D", "L", "GF", "GA", "GD", "PTS"].map((header) => <th key={header} className="p-3 text-xs font-black uppercase tracking-widest">{header}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="border-t border-zinc-200">
                    {["team", "played", "wins", "draws", "losses", "gf", "ga"].map((key) => (
                      <td key={key} className="p-2">
                        <input type={key === "team" ? "text" : "number"} min="0" value={row[key]} onChange={(e) => update(index, key, e.target.value)} className={smallInputClass} />
                      </td>
                    ))}
                    <td className="p-3 font-black">{Number(row.gf) - Number(row.ga)}</td>
                    <td className="p-3 font-black">{Number(row.wins) * 3 + Number(row.draws)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 sm:flex sm:flex-wrap">
            <button type="button" onClick={() => setRows([...rows, { team: "New Team", played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0 }])} className={buttonClass}>Add team</button>
            <button type="button" onClick={() => setRows(rows.slice(0, -1))} className={secondaryButtonClass}>Remove last</button>
            <button type="button" onClick={() => setRows([])} className={secondaryButtonClass}>Reset</button>
          </div>
        </div>
      </div>
      <ResultsGrid empty="">
        {table.map((row, index) => (
          <ResultCard key={`${row.team}-${index}`} title={`${index + 1}. ${row.team}`} accent={index === 0}>
            <p className={`text-sm font-black ${index === 0 ? "text-white" : "text-zinc-700"}`}>{row.pts} pts · GD {row.gd > 0 ? "+" : ""}{row.gd} · GF {row.gf}</p>
          </ResultCard>
        ))}
      </ResultsGrid>
    </ToolPanel>
  );
}

function StatsTrackerTool() {
  const [sport, setSport] = useState("football");
  const [format, setFormat] = useState("5");
  const [trackSecond, setTrackSecond] = useState(false);
  const [match, setMatch] = useState({ teamA: "Pitchside FC", teamB: "Astro United", date: new Date().toISOString().slice(0, 10), scoreA: 8, scoreB: 6 });
  const [players, setPlayers] = useState([
    { id: "s1", name: "Alex", team: "A", position: "Forward", goals: 3, assists: 1, saves: 0, conceded: 0, tackles: 2, dribbles: 4, shots: 6, rating: 9 },
    { id: "s2", name: "Ben", team: "A", position: "Defender", goals: 1, assists: 3, saves: 0, conceded: 0, tackles: 4, dribbles: 1, shots: 2, rating: 8 },
    { id: "s3", name: "Chris", team: "A", position: "Goalkeeper", goals: 0, assists: 0, saves: 9, conceded: 6, tackles: 1, dribbles: 0, shots: 0, rating: 8 },
    { id: "s4", name: "Opponent 9", team: "B", position: "Forward", goals: 3, assists: 0, saves: 0, conceded: 0, tackles: 1, dribbles: 2, shots: 5, rating: 7 },
  ]);
  const visiblePlayers = players.filter((player) => trackSecond || player.team !== "B");
  const scorePlayer = (p) => Number(p.goals) * 4 + Number(p.assists) * 3 + Number(p.saves) * 1.5 + Number(p.tackles) * 2 + Number(p.dribbles) + Number(p.rating);
  const ranked = useMemo(() => [...visiblePlayers].map((p) => ({ ...p, score: scorePlayer(p) })).sort((a, b) => b.score - a.score), [visiblePlayers]);
  const topScorer = [...visiblePlayers].sort((a, b) => Number(b.goals) - Number(a.goals))[0];
  const topAssister = [...visiblePlayers].sort((a, b) => Number(b.assists) - Number(a.assists))[0];
  const bestKeeper = [...visiblePlayers].sort((a, b) => Number(b.saves) - Number(a.saves))[0];
  const potm = ranked[0];
  const recap = `${match.teamA} ${match.scoreA}-${match.scoreB} ${match.teamB} (${match.date})\n${sport === "futsal" ? "Futsal 5-a-side" : `Football ${format}-a-side`}\n\nTop scorer: ${topScorer?.name || "TBC"} (${topScorer?.goals || 0})\nTop assister: ${topAssister?.name || "TBC"} (${topAssister?.assists || 0})\nBest goalkeeper / saves: ${bestKeeper?.name || "TBC"} (${bestKeeper?.saves || 0})\nPlayer of the match suggestion: ${potm?.name || "TBC"}\n\n${visiblePlayers.map((p) => `${p.team === "B" ? match.teamB : match.teamA} - ${p.name} (${p.position}): ${p.goals}G ${p.assists}A ${p.saves}SV ${p.tackles}T ${p.dribbles}D ${p.shots}SH rating ${p.rating}`).join("\n")}\n\nTrack manually now, automate later with Pitchside.`;

  return (
    <ToolPanel title="5-a-side football stats tracker" eyebrow="Match setup, second team stats and recap" actions={<CopyButton value={recap} label="Copy recap" />}>
      <FormatControls sport={sport} setSport={setSport} format={format} setFormat={setFormat} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
        <Field label="Team A"><input value={match.teamA} onChange={(e) => setMatch({ ...match, teamA: e.target.value })} className={inputClass} /></Field>
        <Field label="Team B / opponent"><input value={match.teamB} onChange={(e) => setMatch({ ...match, teamB: e.target.value })} className={inputClass} /></Field>
        <Field label="Date" className="col-span-2 md:col-span-1"><input type="date" value={match.date} onChange={(e) => setMatch({ ...match, date: e.target.value })} className={inputClass} /></Field>
        <Field label="Score A"><input type="number" min="0" value={match.scoreA} onChange={(e) => setMatch({ ...match, scoreA: clampNumber(e.target.value, 0, 99) })} className={inputClass} /></Field>
        <Field label="Score B"><input type="number" min="0" value={match.scoreB} onChange={(e) => setMatch({ ...match, scoreB: clampNumber(e.target.value, 0, 99) })} className={inputClass} /></Field>
      </div>
      <label className="flex min-h-12 items-center gap-3 rounded-2xl border-2 border-black bg-white px-4 py-3 text-sm font-black uppercase tracking-widest">
        <input type="checkbox" checked={trackSecond} onChange={(e) => setTrackSecond(e.target.checked)} className="h-5 w-5 accent-[#CCFF00]" /> Track opponent / second team stats
      </label>
      <PlayerEditor players={visiblePlayers} setPlayers={(next) => setPlayers((current) => {
        const hidden = current.filter((player) => !trackSecond && player.team === "B");
        return [...next, ...hidden];
      })} sport={sport} format={format} allowTeam teams={trackSecond ? ["A", "B"] : ["A"]} showStats />
      <ResultsGrid empty="">
        <ResultCard title="Top scorer" accent><p className="text-sm font-black text-white">{topScorer?.name || "TBC"} · {topScorer?.goals || 0} goals</p></ResultCard>
        <ResultCard title="Top assister"><p className="text-sm font-black text-zinc-700">{topAssister?.name || "TBC"} · {topAssister?.assists || 0} assists</p></ResultCard>
        <ResultCard title="Best goalkeeper / saves"><p className="text-sm font-black text-zinc-700">{bestKeeper?.name || "TBC"} · {bestKeeper?.saves || 0} saves</p></ResultCard>
        <ResultCard title="POTM suggestion"><p className="text-sm font-black text-zinc-700">{potm?.name || "TBC"} · score {Math.round(potm?.score || 0)}</p></ResultCard>
      </ResultsGrid>
      <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-3xl border-2 border-black bg-black p-4 text-xs font-bold leading-relaxed text-[#CCFF00] md:p-5 md:text-sm">{recap}</pre>
    </ToolPanel>
  );
}

export default function ToolClient({ slug }) {
  if (slug === "random-5-a-side-team-generator") return <RandomTeamsTool />;
  if (slug === "football-formation-builder") return <FormationTool />;
  if (slug === "football-team-name-generator") return <TeamNameTool />;
  if (slug === "football-league-table-generator") return <LeagueTableTool />;
  if (slug === "5-a-side-football-stats-tracker") return <StatsTrackerTool />;
  return null;
}
