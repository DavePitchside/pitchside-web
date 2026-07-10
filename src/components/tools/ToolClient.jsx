"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Download, FileText, PanelLeftClose, PanelLeftOpen, Plus, RefreshCw, RotateCcw, Shuffle, Star, Trophy, Wand2, ChevronDown } from "lucide-react";

const inputClass = "w-full min-w-0 min-h-11 rounded-2xl border-2 border-black bg-white px-4 py-2.5 text-sm font-bold text-black outline-none transition focus:border-[#43F58B] focus:ring-4 focus:ring-[#43F58B]/45";
const smallInputClass = "w-full min-w-0 rounded-xl border border-black/20 bg-white px-3 py-2 text-sm font-bold text-black outline-none transition focus:border-[#43F58B] focus:ring-2 focus:ring-[#43F58B]/45";
const labelClass = "text-[10px] font-black uppercase tracking-[0.22em] text-zinc-600";
const buttonClass = "inline-flex min-h-11 w-full min-w-0 items-center justify-center gap-2 rounded-2xl border-2 border-black bg-black px-4 py-2.5 text-center text-[11px] font-black uppercase tracking-[0.1em] text-[#43F58B] shadow-[3px_3px_0px_#43F58B] transition hover:bg-[#43F58B] hover:text-black hover:shadow-[3px_3px_0px_#000] active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#43F58B]/45 sm:w-auto";
const secondaryButtonClass = "inline-flex min-h-11 w-full min-w-0 items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-black bg-white px-4 py-2.5 text-center text-[11px] font-black uppercase tracking-[0.1em] text-black transition hover:bg-black hover:text-[#43F58B] active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#43F58B]/45 sm:w-auto";

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
  if (normalized === "Goalkeeper") return "bg-[#43F58B] text-black border-black";
  if (normalized === "Defender") return "bg-emerald-100 text-emerald-950 border-emerald-800";
  if (normalized === "Midfielder") return "bg-sky-100 text-sky-950 border-sky-800";
  if (normalized === "Winger") return "bg-violet-100 text-violet-950 border-violet-800";
  if (normalized === "Forward") return "bg-rose-100 text-rose-950 border-rose-800";
  return "bg-zinc-100 text-zinc-700 border-zinc-400";
}

const posAbbrev = {
  "Goalkeeper": "GK", "Defender": "DEF", "Midfielder": "MID", "Winger": "WIN",
  "Forward": "FWD", "Any": "ANY", "Fix / Defender": "FIX", "Ala / Winger": "ALA",
  "Pivot / Forward": "PIV", "Right Back": "RB", "Centre Back": "CB", "Left Back": "LB",
  "Defensive Midfielder": "DM", "Central Midfielder": "CM", "Attacking Midfielder": "AM",
  "Right Winger": "RW", "Left Winger": "LW", "Striker": "ST",
};

function positionLabel(pos) {
  return posAbbrev[pos] || pos.slice(0, 4).toUpperCase();
}

function CopyButton({ value, label = "Copy", shortLabel }) {
  const [copied, setCopied] = useState(false);
  const copyValue = async () => {
    await navigator.clipboard.writeText(value || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  const displayLabel = copied ? "Copied!" : label;
  const displayShort = copied ? "Copied!" : (shortLabel || label);
  return (
    <button type="button" onClick={copyValue} className={secondaryButtonClass}>
      <Copy className="h-4 w-4 shrink-0" />
      {shortLabel ? (
        <>
          <span className="lg:hidden">{displayShort}</span>
          <span className="hidden lg:inline">{displayLabel}</span>
        </>
      ) : (
        <span className="min-w-0 truncate">{displayLabel}</span>
      )}
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
    <div className="min-w-0 grid gap-2 [grid-template-columns:minmax(0,1fr)]">
      <span className={labelClass}>{label}</span>
      <div className="grid gap-1.5 [grid-template-columns:repeat(2,minmax(0,1fr))]">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`min-h-10 w-full min-w-0 overflow-hidden rounded-xl border-2 px-2 py-2 text-center text-[11px] font-black uppercase tracking-[0.06em] transition focus:outline-none active:scale-95 ${
                selected ? "border-black bg-[#43F58B] text-black" : "border-black/20 bg-white text-zinc-600 hover:border-black hover:text-black"
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
    <section id="tool-start" className="mx-auto w-full scroll-mt-28 overflow-hidden rounded-[1.1rem] border-2 border-black bg-white shadow-[3px_3px_0px_#000] md:rounded-[1.6rem] md:shadow-[8px_8px_0px_#000]">
      <div className="overflow-hidden border-b-2 border-black bg-black p-4 lg:p-6">
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            {eyebrow && <p className="mb-1.5 max-w-full break-words text-[8px] font-black uppercase leading-tight tracking-[0.14em] text-[#43F58B] [overflow-wrap:anywhere] md:text-[9px] md:tracking-[0.18em]">{eyebrow}</p>}
            <h2 className="max-w-full break-words text-sm font-black uppercase leading-[1.05] tracking-tight [overflow-wrap:anywhere] md:text-xl lg:text-3xl xl:text-4xl">{title}</h2>
          </div>
          {actions && <div className="flex min-w-0 flex-wrap gap-2 lg:shrink-0">{actions}</div>}
        </div>
      </div>
      <div className="grid gap-5 p-4 md:p-6 [grid-template-columns:minmax(0,1fr)]">{children}</div>
    </section>
  );
}

function ResultsGrid({ children, empty }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : children;
  if ((!items || items.length === 0) && empty) {
    return <div className="grid min-h-48 place-items-center rounded-2xl border-2 border-dashed border-black bg-[#F4F3EF] p-6 text-center text-sm font-black uppercase tracking-widest text-zinc-500">{empty}</div>;
  }
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

function ResultCard({ title, children, accent = false }) {
  return (
    <div className={`rounded-2xl border-2 border-black p-4 shadow-[4px_4px_0px_#000] md:rounded-3xl md:p-5 ${accent ? "bg-black text-white shadow-[4px_4px_0px_#43F58B]" : "bg-[#F4F3EF] text-black"}`}>
      <h3 className={`text-base font-black uppercase tracking-tight ${accent ? "text-[#43F58B]" : "text-black"}`}>{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

/* ─── PlayerEditor (used by FormationTool only) ─────────────────────── */
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
        <div key={player.id} className="rounded-2xl border border-black/15 bg-[#F4F3EF] p-3">
          <div className="mb-3 flex items-center justify-between gap-3 md:hidden">
            <span className="rounded-full border border-black/15 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">Player {index + 1}</span>
            <button type="button" onClick={() => setPlayers((current) => current.filter((item) => item.id !== player.id))} className="rounded-full border border-black bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-black">Remove</button>
          </div>
          <div className={`grid gap-2 ${showStats ? "grid-cols-6 sm:grid-cols-3 lg:grid-cols-[1.4fr_0.6fr_0.85fr_repeat(8,minmax(55px,0.5fr))_auto]" : "grid-cols-2 md:grid-cols-[1.4fr_1fr_0.6fr_auto]"} items-end`}>
            <Field label={`Player ${index + 1}`} className={showStats ? "col-span-6 sm:col-span-1" : "col-span-2 md:col-span-1"}>
              <input value={player.name} onChange={(e) => update(player.id, "name", e.target.value)} className={smallInputClass} placeholder="Player name" />
            </Field>
            {allowTeam && (
              <Field label="Team" className={showStats ? "col-span-3 sm:col-span-1" : ""}>
                <select value={player.team} onChange={(e) => update(player.id, "team", e.target.value)} className={smallInputClass}>
                  {teams.map((team) => <option key={team} value={team}>{team}</option>)}
                </select>
              </Field>
            )}
            <Field label="Position" className={showStats ? "col-span-3 sm:col-span-1" : ""}>
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
              <Field key={key} label={key === "conceded" ? "GC" : key} className="col-span-2 sm:col-span-1">
                <input type="number" min="0" max={key === "rating" ? "10" : "99"} value={player[key] ?? 0} onChange={(e) => update(player.id, key, clampNumber(e.target.value, 0, key === "rating" ? 10 : 99))} className={smallInputClass} />
              </Field>
            ))}
            <button type="button" onClick={() => setPlayers((current) => current.filter((item) => item.id !== player.id))} className={`hidden min-h-10 rounded-xl border-2 border-black bg-white px-3 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-[#43F58B] md:block ${showStats ? "col-span-6 sm:col-span-3 lg:col-span-1" : ""}`}>
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
    <div className="grid gap-4 rounded-2xl border border-black/10 bg-[#F4F3EF] p-4">
      <Segmented label="Sport" value={sport} onChange={setSportAndFormat} options={[{ value: "football", label: "Football" }, { value: "futsal", label: "Futsal" }]} />
      <Segmented label="Format" value={format} onChange={setFormat} options={formatsForSport(sport)} />
    </div>
  );
}

function recommendedFormationFor(sport, format, playerCount = 5) {
  if (sport === "futsal") return "1-2-1 Diamond";
  if (format === "11" || playerCount >= 11) return "4-3-3";
  if (format === "7" || playerCount >= 7) return "2-3-1";
  if (format === "6" || playerCount >= 6) return "2-2-1";
  return "1-2-1";
}

function readPendingFormationSetup() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("pitchside_pending_formation");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/* ═══════════════════════════════════════════════════════════
   RANDOM TEAM GENERATOR — mobile-first redesign
   ═══════════════════════════════════════════════════════════ */

function RandomPlayerRow({ player, index, onUpdate, onRemove, positions }) {
  return (
    <div className="grid min-w-0 grid-cols-[32px_minmax(76px,1fr)_64px] items-center gap-2 rounded-xl border border-white/10 bg-[#0c1320] p-2 sm:grid-cols-[34px_minmax(120px,1fr)_76px_92px_28px]">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#43F58B] bg-[#43F58B]/10 text-[11px] font-black text-[#43F58B]">{player.name.slice(0, 1) || index + 1}</span>
      <input
        value={player.name}
        onChange={(e) => onUpdate(player.id, "name", e.target.value)}
        placeholder="Name"
        className="min-w-0 rounded-lg border border-white/10 bg-[#08111d] px-2 py-2 text-sm font-black text-white outline-none placeholder:text-slate-500 focus:border-[#43F58B]"
      />
      <select
        value={player.position}
        onChange={(e) => onUpdate(player.id, "position", e.target.value)}
        className="min-h-8 w-full shrink-0 rounded-lg border border-white/10 bg-[#111827] px-1 text-[10px] font-black text-white outline-none focus:border-[#43F58B]"
      >
        {positions.map((pos) => (
          <option key={pos} value={pos}>{positionLabel(pos)}</option>
        ))}
      </select>
      <div className="col-span-2 flex shrink-0 items-center justify-start gap-1 sm:col-span-1 sm:justify-end">
        <span className="text-[10px] font-black uppercase text-zinc-500">Skl:</span>
        <button type="button" onClick={() => onUpdate(player.id, "rating", Math.max(1, player.rating - 1))} className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-[#111827] text-sm font-black text-white transition hover:bg-[#43F58B] hover:text-black active:scale-90">−</button>
        <span className="w-4 text-center text-sm font-black text-[#43F58B]">{player.rating}</span>
        <button type="button" onClick={() => onUpdate(player.id, "rating", Math.min(5, player.rating + 1))} className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-[#111827] text-sm font-black text-white transition hover:bg-[#43F58B] hover:text-black active:scale-90">+</button>
      </div>
      <button type="button" onClick={() => onRemove(player.id)} className="shrink-0 flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-[#111827] text-zinc-500 transition hover:border-rose-300 hover:bg-rose-500 hover:text-white active:scale-90">
        ×
      </button>
    </div>
  );
}

function RandomTeamsTool() {
  const [sport, setSport] = useState("football");
  const [format, setFormat] = useState("5");
  const [bulk, setBulk] = useState("");
  const [showBulk, setShowBulk] = useState(false);
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
  const isFutsal = sport === "futsal";

  const importBulk = () => {
    const parsed = parseBulkPlayers(bulk);
    if (parsed.length) { setPlayers((cur) => [...cur, ...parsed]); setBulk(""); setShowBulk(false); }
  };
  const rosterPositions = positionsFor(sport, format);
  const updateRosterPlayer = (id, key, value) => {
    setPlayers((current) => current.map((player) => (player.id === id ? { ...player, [key]: value } : player)));
  };
  const removeRosterPlayer = (id) => {
    setPlayers((current) => current.filter((player) => player.id !== id));
  };
  const addRosterPlayer = () => {
    setPlayers((current) => [...current, { id: `p-${Date.now()}`, name: "", position: rosterPositions[0], rating: 3 }]);
  };

  const generate = () => {
    const usable = players.filter((p) => p.name.trim());
    const output = Array.from({ length: Number(teamCount) }, (_, i) => ({
      name: `Team ${teamLetters[i]}`, players: [], score: 0, positions: {},
    }));
    const groups = ["Goalkeeper", "Defender", "Midfielder", "Winger", "Forward", "Any"].flatMap((group) =>
      shuffleList(usable.filter((p) => normalizePosition(p.position) === group))
        .sort((a, b) => Number(b.rating) - Number(a.rating))
    );
    groups.forEach((player) => {
      const target = output.reduce((best, team) => {
        const pos = normalizePosition(player.position);
        const th = team.positions[pos] || 0;
        const bh = best.positions[pos] || 0;
        if (th !== bh) return th < bh ? team : best;
        if (team.score !== best.score) return team.score < best.score ? team : best;
        return team.players.length < best.players.length ? team : best;
      }, output[0]);
      target.players.push(player);
      target.score += Number(player.rating) || 3;
      const pos = normalizePosition(player.position);
      target.positions[pos] = (target.positions[pos] || 0) + 1;
    });
    setTeams(output);
  };

  const openInFormationBuilder = () => {
    if (teams.length < 2) return;
    const [teamOne, teamTwo] = teams;
    const formationA = recommendedFormationFor(sport, format, teamOne.players.length);
    const formationB = recommendedFormationFor(sport, format, teamTwo.players.length);
    const payload = {
      sport,
      format,
      includeB: true,
      formationA,
      formationB,
      teamA: teamOne.players.map((player, index) => ({ ...player, id: `a-${player.id || index}` })),
      teamB: teamTwo.players.map((player, index) => ({ ...player, id: `b-${player.id || index}` })),
    };
    window.localStorage.setItem("pitchside_pending_formation", JSON.stringify(payload));
    window.location.href = "/tools/football-formation-builder#tool-start";
  };

  const copyText = teams
    .map((t) => `${t.name} (Rating: ${t.score})\n${t.players.map((p) => `- ${p.name} · ${p.position} · ${p.rating}/5`).join("\n")}`)
    .join("\n\n");

  const formatHint = sport === "futsal"
    ? "Spread keepers and pivots across teams for balance."
    : `${format}v${format}: always spread goalkeepers first, then defenders.`;

  return (
    <section id="tool-start" className="mx-auto w-full scroll-mt-28 overflow-hidden rounded-2xl border border-white/10 bg-[#08111d] p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:p-6">
      {/* ── Settings ── */}
      <div className="rounded-2xl border border-white/10 bg-[#0b1220] p-4">
        <div className="grid gap-5 md:grid-cols-[1fr_1.4fr_0.8fr] md:items-end">
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">Sport selection</p>
            <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-white/10 bg-black">
              {[{ value: "football", label: "Football" }, { value: "futsal", label: "Futsal" }].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => { setSport(option.value); setFormat(option.value === "futsal" ? "futsal5" : "5"); }}
                  className={`min-h-11 text-sm font-black transition ${sport === option.value ? "bg-[#43F58B] text-black" : "text-zinc-400 hover:text-white"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">Format</p>
            <div className={`grid overflow-hidden rounded-xl border border-white/10 bg-black ${isFutsal ? "grid-cols-1" : "grid-cols-4"}`}>
              {formatsForSport(sport).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormat(option.value)}
                  className={`min-h-11 px-2 text-xs font-black transition ${format === option.value ? "bg-[#43F58B] text-black" : "text-zinc-400 hover:text-white"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">Team count</p>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setTeamCount((c) => Math.max(2, c - 1))} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-black text-xl font-black text-white hover:bg-[#43F58B] hover:text-black active:scale-90">−</button>
              <span className="min-w-8 text-center text-3xl font-black text-[#43F58B]">{teamCount}</span>
              <button type="button" onClick={() => setTeamCount((c) => Math.min(6, c + 1))} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-black text-xl font-black text-white hover:bg-[#43F58B] hover:text-black active:scale-90">+</button>
            </div>
          </div>
        </div>
        <p className="mt-4 rounded-xl border border-[#43F58B]/30 bg-[#43F58B]/10 p-3 text-[11px] font-bold leading-relaxed text-zinc-300">{formatHint}</p>
      </div>

      {/* ── Players ── */}
      <div className="mt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white">Player Roster</h2>
            <p className="mt-1 text-sm font-bold text-zinc-400">Configure players and skill levels for balanced generation.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowBulk((v) => !v)}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#43F58B]/60 bg-black px-5 text-[11px] font-black uppercase tracking-widest text-[#43F58B] transition hover:bg-[#43F58B] hover:text-black"
          >
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showBulk ? "rotate-180" : ""}`} />
            {showBulk ? "Close" : "Bulk paste"}
          </button>
        </div>

        {showBulk && (
          <div className="mb-3 rounded-2xl border border-white/10 bg-[#0b1220] p-3 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">One per line - e.g. Sam GK 4 or just Sam</p>
            <textarea
              value={bulk}
              onChange={(e) => setBulk(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-black p-3 text-sm font-bold text-white outline-none focus:border-[#43F58B]"
              placeholder={"Sam GK 4\nAlex FWD 5\nBen DEF 3"}
            />
            <button type="button" onClick={importBulk} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#43F58B] px-4 text-xs font-black uppercase tracking-widest text-black">
              <Plus className="h-4 w-4" /> Import players
            </button>
          </div>
        )}

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-[#0b1220] p-3 md:grid-cols-2 xl:grid-cols-3">
          {players.map((player, index) => (
            <RandomPlayerRow
              key={player.id}
              player={player}
              index={index}
              onUpdate={updateRosterPlayer}
              onRemove={removeRosterPlayer}
              positions={rosterPositions}
            />
          ))}
          <button type="button" onClick={addRosterPlayer} className="min-h-14 rounded-xl border-2 border-dashed border-white/15 bg-black/10 text-sm font-black text-zinc-400 transition hover:border-[#43F58B] hover:text-[#43F58B] md:col-span-2 xl:col-span-3">
            <Plus className="mr-2 inline h-4 w-4" /> Add Another Player to Roster
          </button>
        </div>
      </div>

      {/* ── Generate actions ── */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={generate} className="inline-flex min-h-16 items-center justify-center gap-3 rounded-full bg-[#43F58B] px-10 text-lg font-black text-black transition hover:bg-white active:scale-95">
          <Shuffle className="h-5 w-5" /> Generate Balanced Teams
        </button>
        {teams.length > 0 && (
          <>
            <button type="button" onClick={openInFormationBuilder} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#43F58B]/60 bg-black px-5 text-[11px] font-black uppercase tracking-widest text-[#43F58B] hover:bg-[#43F58B] hover:text-black">
              <PanelLeftOpen className="h-4 w-4" /> Arrange in formation
            </button>
            <button type="button" onClick={generate} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-black px-5 text-[11px] font-black uppercase tracking-widest text-white hover:border-[#43F58B]">
              <RefreshCw className="h-4 w-4" /> Reshuffle
            </button>
            <button type="button" onClick={() => { setTeams([]); setPlayers([]); }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-black px-5 text-[11px] font-black uppercase tracking-widest text-white hover:border-[#43F58B]">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </>
        )}
      </div>

      {/* ── Results ── */}
      {teams.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-[#43F58B]">Generated Teams</h3>
            <CopyButton value={copyText} label="Copy all to WhatsApp" shortLabel="Copy All" />
          </div>
          {teams.map((team) => {
            const teamCopy = `${team.name} (Rating: ${team.score})\n${team.players.map((p) => `- ${p.name} · ${p.position} · ${p.rating}/5`).join("\n")}`;
            return (
              <div key={team.name} className="overflow-hidden rounded-2xl border-2 border-black bg-black shadow-[4px_4px_0px_#43F58B]">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                  <div>
                    <h4 className="text-base font-black uppercase tracking-tight text-[#43F58B]">{team.name}</h4>
                    <p className="text-[10px] font-bold text-zinc-500">Rating {team.score} · {team.players.length} players</p>
                  </div>
                  <CopyButton value={teamCopy} label="Copy team" shortLabel="Copy" />
                </div>
                <ul className="divide-y divide-white/[0.06] px-1 py-1">
                  {team.players.map((player) => (
                    <li key={player.id} className="flex items-center justify-between px-3 py-2.5">
                      <span className="text-sm font-bold text-white">{player.name}</span>
                      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-black uppercase ${positionTone(player.position)}`}>
                        {positionLabel(player.position)} · {player.rating}★
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {teams.length === 0 && (
        <div className="mt-6 grid min-h-32 place-items-center rounded-2xl border-2 border-dashed border-white/10 bg-[#0b1220] p-6 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Add players above, then hit Generate</p>
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FORMATION BUILDER (unchanged)
   ═══════════════════════════════════════════════════════════ */

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

const darkInputClass = "w-full min-w-0 rounded-lg border border-emerald-300/20 bg-[#0c1320] px-3 py-2 text-xs font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-[#43F58B] focus:ring-2 focus:ring-[#43F58B]/25";

function formationShapeParts(formation) {
  const compact = formation.match(/\d(?:-\d)+/)?.[0] || "1-2-1";
  return compact.split("-").map((value) => Number(value)).filter(Boolean);
}

function distributeFormationX(count) {
  const points = {
    1: [50],
    2: [34, 66],
    3: [24, 50, 76],
    4: [16, 39, 61, 84],
    5: [11, 30, 50, 70, 89],
  };
  return points[count] || Array.from({ length: count }, (_, index) => 12 + (76 / Math.max(1, count - 1)) * index);
}

function makePitchLineup(players, formation, savedPositions = {}) {
  const roles = roleTemplates[formation] || roleTemplates["1-2-1"];
  const shape = formationShapeParts(formation);
  const rows = [[roles[0]], ...shape.map((lineSize, lineIndex) => roles.slice(1 + shape.slice(0, lineIndex).reduce((sum, value) => sum + value, 0), 1 + shape.slice(0, lineIndex + 1).reduce((sum, value) => sum + value, 0)))];
  const yValues = rows.length === 5 ? [90, 72, 54, 35, 14] : rows.length === 4 ? [90, 66, 42, 16] : rows.length === 3 ? [90, 55, 18] : [90, 18];
  let playerIndex = 0;

  return rows.flatMap((row, rowIndex) => {
    const xs = distributeFormationX(row.length);
    return row.map((role, roleIndex) => {
      const player = players[playerIndex] || {};
      const id = player.id || `${role}-${playerIndex}`;
      const saved = savedPositions[id];
      const output = {
        id,
        role,
        player: player.name || "TBC",
        rating: player.rating || 3,
        left: saved?.left ?? xs[roleIndex],
        top: saved?.top ?? yValues[rowIndex] ?? 50,
      };
      playerIndex += 1;
      return output;
    });
  });
}

function FormationPlayerCard({ item, teamTone, accent = "#43F58B", onMove, onNameChange }) {
  const moveCard = (pitch, clientX, clientY) => {
    const rect = pitch.getBoundingClientRect();
    const left = clampNumber(((clientX - rect.left) / rect.width) * 100, 8, 92);
    const top = clampNumber(((clientY - rect.top) / rect.height) * 100, 8, 92);
    onMove(item.id, { left, top });
  };
  const getPitch = (target) => target.closest("[data-formation-pitch]");
  const startPointerDrag = (event) => {
    if (event.target.closest("input")) return;
    const pitch = getPitch(event.currentTarget);
    if (!pitch) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);

    const move = (moveEvent) => {
      moveCard(pitch, moveEvent.clientX, moveEvent.clientY);
    };

    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop, { once: true });
    move(event);
  };
  const startMouseDrag = (event) => {
    if (event.target.closest("input")) return;
    const pitch = getPitch(event.currentTarget);
    if (!pitch) return;
    event.preventDefault();

    const move = (moveEvent) => moveCard(pitch, moveEvent.clientX, moveEvent.clientY);
    const stop = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop, { once: true });
    move(event);
  };
  const startTouchDrag = (event) => {
    if (event.target.closest("input")) return;
    const pitch = getPitch(event.currentTarget);
    const touch = event.touches[0];
    if (!pitch || !touch) return;

    const move = (moveEvent) => {
      const nextTouch = moveEvent.touches[0];
      if (nextTouch) moveCard(pitch, nextTouch.clientX, nextTouch.clientY);
    };
    const stop = () => {
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", stop);
    };

    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", stop, { once: true });
    moveCard(pitch, touch.clientX, touch.clientY);
  };

  return (
    <div
      onPointerDown={startPointerDrag}
      onMouseDown={startMouseDrag}
      onTouchStart={startTouchDrag}
      className={`absolute z-20 w-[64px] -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-lg border bg-[#111827]/95 px-1.5 py-1.5 text-center shadow-[0_0_20px_rgba(67,245,139,0.24)] active:cursor-grabbing md:w-[76px] ${teamTone}`}
      style={{ left: `${item.left}%`, top: `${item.top}%`, borderColor: accent, boxShadow: `0 0 22px ${accent}40`, background: `linear-gradient(180deg, ${accent}24, rgba(17,24,39,0.98) 44%)` }}
    >
      <div className="mx-auto mb-1 grid h-5 w-5 place-items-center rounded-full border text-[8px] font-black text-black md:h-6 md:w-6 md:text-[9px]" style={{ backgroundColor: accent, borderColor: accent }}>
        {item.player.slice(0, 1)}
      </div>
      <input
        value={item.player}
        onChange={(event) => onNameChange(item.id, event.target.value)}
        className="w-full rounded bg-transparent text-center text-[8px] font-black uppercase leading-none text-white outline-none focus:bg-white/10 md:text-[10px]"
        aria-label={`${item.role} player name`}
      />
      <p className="mt-0.5 truncate text-center text-[7px] font-black uppercase tracking-widest" style={{ color: accent }}>{positionLabel(item.role)}</p>
      <div className="mt-0.5 grid grid-cols-3 gap-x-0.5 gap-y-0.5 text-center text-[6px] font-black uppercase text-slate-400">
        <span>POS</span>
        <span>ATK</span>
        <span>AVG</span>
        <span className="text-white">{Math.max(35, item.rating * 18)}</span>
        <span className="text-white">{Math.max(40, item.rating * 17)}</span>
        <span className="text-white">{Math.max(50, item.rating * 19)}</span>
      </div>
    </div>
  );
}

function FormationPitch({ lineup, label, tone = "border-[#43F58B]/60", accent = "#43F58B", onMove, onNameChange, exportId }) {
  return (
    <div id={exportId} data-formation-pitch className={`relative mx-auto aspect-[7/10] min-h-[520px] w-full max-w-[620px] overflow-hidden rounded-2xl border ${tone} bg-[#12361f] shadow-[0_0_24px_rgba(67,245,139,0.22)] sm:min-h-[560px] xl:max-w-none`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(67,245,139,0.22),transparent_34%),linear-gradient(90deg,rgba(255,255,255,0.06)_50%,transparent_50%),linear-gradient(rgba(255,255,255,0.035)_50%,transparent_50%)] bg-[length:auto,88px_88px,88px_88px]" />
      <div className="absolute inset-5 rounded-xl border-2 border-white/60" />
      <div className="absolute inset-x-5 top-1/2 h-0.5 bg-white/60" />
      <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60" />
      <div className="absolute inset-x-[18%] top-5 h-[13%] border-x-2 border-b-2 border-white/60" />
      <div className="absolute inset-x-[34%] top-5 h-[6%] border-x-2 border-b-2 border-white/60" />
      <div className="absolute inset-x-[18%] bottom-5 h-[13%] border-x-2 border-t-2 border-white/60" />
      <div className="absolute inset-x-[34%] bottom-5 h-[6%] border-x-2 border-t-2 border-white/60" />
      <p className="absolute left-4 top-4 z-30 rounded-full border border-[#43F58B]/40 bg-[#08111d]/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#43F58B]">{label}</p>
      {lineup.map((item, index) => (
        <FormationPlayerCard key={`${label}-${item.role}-${index}`} item={item} teamTone={tone} accent={accent} onMove={onMove} onNameChange={onNameChange} />
      ))}
    </div>
  );
}

function SidebarSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111827]/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex min-h-11 w-full items-center justify-between gap-3 px-3 py-3 text-left transition hover:bg-white/[0.04]"
        aria-expanded={isOpen}
      >
        <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-white">{title}</h3>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${isOpen ? "rotate-180 text-[#43F58B]" : ""}`} />
      </button>
      {isOpen && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}

function SidebarButtonGroup({ label, options, value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <div className="grid grid-cols-2 gap-1.5">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`min-h-9 rounded-lg border px-2 text-[10px] font-black uppercase transition ${selected ? "border-[#43F58B] bg-[#43F58B]/15 text-[#43F58B]" : "border-white/10 bg-[#0c1320] text-slate-300 hover:border-[#43F58B]/60"}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CompactFormationPlayers({ title, players, setPlayers, sport, format }) {
  const options = positionsFor(sport, format);
  const update = (id, key, value) => setPlayers((current) => current.map((player) => (player.id === id ? { ...player, [key]: value } : player)));
  const addPlayer = () => setPlayers((current) => [...current, { id: `${title}-${Date.now()}`, name: "", position: options[0], rating: 3 }]);

  return (
    <SidebarSection title={title}>
      <div className="grid gap-2">
        {players.map((player) => (
          <div key={player.id} className="grid grid-cols-[28px_minmax(0,1fr)_52px] items-center gap-2 rounded-lg border border-white/8 bg-[#0c1320] p-2">
            <div className="grid h-7 w-7 place-items-center rounded-full border border-[#43F58B]/50 bg-[#43F58B]/15 text-[10px] font-black text-[#43F58B]">{player.name.slice(0, 1) || "P"}</div>
            <div className="min-w-0">
              <input value={player.name} onChange={(event) => update(player.id, "name", event.target.value)} className="w-full bg-transparent text-xs font-black uppercase text-white outline-none placeholder:text-slate-600" placeholder="Player" />
              <select value={player.position} onChange={(event) => update(player.id, "position", event.target.value)} className="mt-1 w-full bg-transparent text-[9px] font-bold uppercase text-slate-400 outline-none">
                {options.map((position) => <option key={position} value={position}>{position}</option>)}
              </select>
            </div>
            <input type="number" min="1" max="5" value={player.rating} onChange={(event) => update(player.id, "rating", clampNumber(event.target.value, 1, 5))} className="rounded-md border border-white/10 bg-[#111827] px-2 py-1.5 text-center text-xs font-black text-white outline-none focus:border-[#43F58B]" />
          </div>
        ))}
        <button type="button" onClick={addPlayer} className="min-h-9 rounded-lg border border-[#43F58B]/40 bg-[#43F58B]/10 text-[10px] font-black uppercase tracking-widest text-[#43F58B] hover:bg-[#43F58B] hover:text-black">
          Add player
        </button>
      </div>
    </SidebarSection>
  );
}

function FormationSidebar({
  open,
  sport,
  setSport,
  format,
  setFormat,
  includeB,
  setIncludeB,
  options,
  safeFormationA,
  setFormationA,
  safeFormationB,
  setFormationB,
  teamA,
  setTeamA,
  teamB,
  setTeamB,
  tacticalNote,
  setSidebarOpen,
}) {
  if (!open) {
    return (
      <aside className="hidden rounded-2xl border-2 border-black bg-black p-2 text-[#43F58B] shadow-[4px_4px_0px_#43F58B] lg:block">
        <div className="grid gap-2">
          {["Sport", "Shape", "Team"].map((item) => (
            <div key={item} className="grid min-h-16 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-[9px] font-black uppercase tracking-widest [writing-mode:vertical-rl]">
              {item}
            </div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[1px] lg:hidden"
        aria-label="Dismiss controls backdrop"
      />
      <aside className="fixed inset-y-0 left-0 z-50 w-[min(72vw,340px)] overflow-y-auto overscroll-contain border-r border-white/10 bg-[#08111d] p-4 text-white shadow-[18px_0_50px_rgba(0,0,0,0.45)] [scrollbar-color:#43F58B_#111827] [scrollbar-width:thin] lg:sticky lg:top-4 lg:z-auto lg:max-h-[calc(100svh-2rem)] lg:w-auto lg:self-start lg:rounded-xl lg:border lg:border-white/10 lg:bg-transparent lg:p-3 lg:shadow-none">
      <div className="sticky top-0 z-10 -mx-4 mb-4 flex items-center justify-between gap-3 border-b border-white/10 bg-[#08111d]/95 px-4 py-3 backdrop-blur lg:hidden">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#43F58B]">Builder controls</p>
          <h3 className="text-xl font-black uppercase tracking-tight text-white">Formation setup</h3>
        </div>
        <button type="button" onClick={() => setSidebarOpen(false)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#43F58B]/40 bg-[#43F58B]/10 px-3 text-[10px] font-black uppercase tracking-widest text-[#43F58B]" aria-label="Close controls">
          <PanelLeftClose className="h-5 w-5" />
          Close
        </button>
      </div>
      <div className="space-y-4 pb-4">
        <SidebarSection title="Team settings">
          <div className="grid gap-3">
            <SidebarButtonGroup label="Sport" value={sport} onChange={(value) => { setSport(value); setFormat(value === "futsal" ? "futsal5" : "5"); }} options={[{ value: "football", label: "Football" }, { value: "futsal", label: "Futsal" }]} />
            <SidebarButtonGroup label="Format" value={format} onChange={setFormat} options={formatsForSport(sport)} />
            <label className="flex min-h-9 items-center gap-2 rounded-lg border border-white/10 bg-[#0c1320] px-3 text-[10px] font-black uppercase tracking-widest text-slate-300">
              <input type="checkbox" checked={includeB} onChange={(e) => setIncludeB(e.target.checked)} className="h-4 w-4 accent-[#43F58B]" /> Preview Team B
            </label>
          </div>
        </SidebarSection>
        {includeB && (
          <SidebarSection title="Team B setup">
            <div className="grid gap-3">
              <label className="grid gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Formation</span>
                <select value={safeFormationB} onChange={(e) => setFormationB(e.target.value)} className={darkInputClass}>{options.map((item) => <option key={item}>{item}</option>)}</select>
              </label>
              <div>
                <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-slate-400">Templates</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {options.map((item) => (
                    <button key={item} type="button" onClick={() => setFormationB(item)} className={`min-h-9 rounded-lg border px-2 text-[10px] font-black uppercase ${safeFormationB === item ? "border-sky-400 bg-sky-400/15 text-sky-300" : "border-white/10 bg-[#0c1320] text-slate-300"}`}>{item}</button>
                  ))}
                </div>
              </div>
            </div>
          </SidebarSection>
        )}
        {includeB && (
          <CompactFormationPlayers title="Team B players" players={teamB} setPlayers={setTeamB} sport={sport} format={format} />
        )}
        <SidebarSection title="Team A setup">
          <div className="grid gap-3">
            <label className="grid gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Formation</span>
              <select value={safeFormationA} onChange={(e) => setFormationA(e.target.value)} className={darkInputClass}>{options.map((item) => <option key={item}>{item}</option>)}</select>
            </label>
            <div>
              <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-slate-400">Templates</p>
              <div className="grid grid-cols-3 gap-1.5">
                {options.map((item) => (
                  <button key={item} type="button" onClick={() => setFormationA(item)} className={`min-h-9 rounded-lg border px-2 text-[10px] font-black uppercase ${safeFormationA === item ? "border-[#43F58B] bg-[#43F58B]/15 text-[#43F58B]" : "border-white/10 bg-[#0c1320] text-slate-300"}`}>{item}</button>
                ))}
              </div>
            </div>
          </div>
        </SidebarSection>
        <CompactFormationPlayers title="Team A players" players={teamA} setPlayers={setTeamA} sport={sport} format={format} />
        <SidebarSection title="Tactical notes">
          <textarea value={tacticalNote} readOnly className="min-h-28 w-full resize-none rounded-lg border border-white/10 bg-[#0c1320] p-3 text-xs font-bold leading-relaxed text-slate-200 outline-none" />
        </SidebarSection>
      </div>
      </aside>
    </>
  );
}

function FormationTool() {
  const pendingSetup = useMemo(() => readPendingFormationSetup(), []);
  const [sport, setSport] = useState(pendingSetup?.sport || "football");
  const [format, setFormat] = useState(pendingSetup?.format || "5");
  const [formationA, setFormationA] = useState(pendingSetup?.formationA || "1-2-1");
  const [formationB, setFormationB] = useState(pendingSetup?.formationB || "1-2-1");
  const [includeB, setIncludeB] = useState(pendingSetup?.includeB ?? true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [positions, setPositions] = useState({ A: {}, B: {} });
  const [teamA, setTeamA] = useState(pendingSetup?.teamA?.length ? pendingSetup.teamA : [
    { id: "a1", name: "Alex", position: "Goalkeeper", rating: 3 },
    { id: "a2", name: "Ben", position: "Defender", rating: 3 },
    { id: "a3", name: "Chris", position: "Midfielder", rating: 3 },
    { id: "a4", name: "Dani", position: "Winger", rating: 3 },
    { id: "a5", name: "Elliot", position: "Forward", rating: 3 },
  ]);
  const [teamB, setTeamB] = useState(pendingSetup?.teamB?.length ? pendingSetup.teamB : [
    { id: "b1", name: "Kai", position: "Goalkeeper", rating: 3 },
    { id: "b2", name: "Mia", position: "Defender", rating: 3 },
    { id: "b3", name: "Leo", position: "Midfielder", rating: 3 },
    { id: "b4", name: "Nia", position: "Winger", rating: 3 },
    { id: "b5", name: "Omar", position: "Forward", rating: 3 },
  ]);
  const options = formationOptions[sport][format] || formationOptions.football["5"];
  const safeFormationA = options.includes(formationA) ? formationA : options[0];
  const safeFormationB = options.includes(formationB) ? formationB : options[0];
  const lineupA = makePitchLineup(teamA, safeFormationA, positions.A);
  const lineupB = makePitchLineup(teamB, safeFormationB, positions.B);
  const tacticalNote = sport === "futsal" ? "Rotate the ala players, keep the fix available as a reset, and avoid leaving the pivot isolated." : format === "11" ? "Keep the distances between lines compact and use the wide roles to stretch the opponent before switching play." : "Keep one player behind the ball, one central outlet, and rotate wide runners after attacks.";
  const copyText = [`Team A · ${safeFormationA}`, ...lineupA.map((item) => `${item.role}: ${item.player}`), includeB ? `\nTeam B · ${safeFormationB}\n${lineupB.map((item) => `${item.role}: ${item.player}`).join("\n")}` : "", `\nNote: ${tacticalNote}`].filter(Boolean).join("\n");

  const sidebarToggleLabel = sidebarOpen ? "Hide controls" : "Show controls";

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setSidebarOpen(window.matchMedia("(min-width: 1024px)").matches);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const updatePosition = (team, id, position) => {
    setPositions((current) => ({ ...current, [team]: { ...current[team], [id]: position } }));
  };
  const updatePlayerName = (team, id, name) => {
    const setter = team === "A" ? setTeamA : setTeamB;
    setter((current) => current.map((player) => (player.id === id ? { ...player, name } : player)));
  };
  const chooseExportTarget = () => {
    const answer = window.prompt("Download which formation? Type A, B, or Both.", includeB ? "Both" : "A");
    if (!answer) return null;
    const normalized = answer.trim().toLowerCase();
    if (["a", "team a", "teama"].includes(normalized)) return "A";
    if (includeB && ["b", "team b", "teamb"].includes(normalized)) return "B";
    if (includeB && ["both", "all", "a+b"].includes(normalized)) return "Both";
    window.alert("Choose A, B, or Both.");
    return null;
  };
  const exportFormationPdf = () => {
    const target = chooseExportTarget();
    if (!target) return;
    const ids = target === "Both" ? ["formation-team-a", "formation-team-b"] : [`formation-team-${target.toLowerCase()}`];
    const formationHtml = ids.map((id) => document.getElementById(id)?.outerHTML).filter(Boolean).join("");
    if (!formationHtml) return;
    const styles = [...document.querySelectorAll('link[rel="stylesheet"], style')].map((node) => node.outerHTML).join("");
    const printWindow = window.open("", "_blank", "width=1100,height=900");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${target} formation</title>
          ${styles}
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; background: #08111d; padding: 24px; font-family: Arial, sans-serif; }
            .print-grid { display: grid; grid-template-columns: repeat(${target === "Both" ? 2 : 1}, minmax(0, 1fr)); gap: 24px; align-items: start; }
            [data-formation-pitch] { min-height: 760px !important; }
            @media print { body { padding: 12px; } .print-grid { gap: 12px; } }
          </style>
        </head>
        <body><div class="print-grid">${formationHtml}</div><script>window.onload = () => { window.print(); };</script></body>
      </html>
    `);
    printWindow.document.close();
  };
  const saveFormation = () => {
    const data = { savedAt: new Date().toISOString(), sport, format, formationA: safeFormationA, formationB: safeFormationB, includeB, teamA, teamB, positions };
    localStorage.setItem("pitchside_formation_builder", JSON.stringify(data));
    setSaveStatus("Saved locally");
    setTimeout(() => setSaveStatus(""), 1600);
  };

  return (
    <section id="tool-start" className="mx-auto w-full scroll-mt-28 overflow-hidden rounded-2xl border border-white/10 bg-[#08111d] text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <div className="border-b border-white/10 bg-[#0b1220] px-4 py-4 md:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex justify-start">
            <button type="button" onClick={() => setSidebarOpen((value) => !value)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-[#111827] px-3 text-[10px] font-black uppercase tracking-widest text-white hover:border-[#43F58B]/60" aria-expanded={sidebarOpen}>
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
              {sidebarToggleLabel}
            </button>
          </div>
          <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
            <CopyButton value={copyText} label="Copy lineup" shortLabel="Copy" />
            <button type="button" onClick={exportFormationPdf} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#43F58B] px-3 text-[10px] font-black uppercase tracking-widest text-black">
              <FileText className="h-4 w-4" /> Export PDF
            </button>
            <button type="button" onClick={saveFormation} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#43F58B] px-3 text-[10px] font-black uppercase tracking-widest text-black">
              <Download className="h-4 w-4" /> {saveStatus || "Save formation"}
            </button>
          </div>
        </div>
      </div>
      {!sidebarOpen && (
        <button type="button" onClick={() => setSidebarOpen(true)} className="m-4 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#43F58B]/50 bg-[#43F58B]/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-[#43F58B] lg:hidden">
          <PanelLeftOpen className="h-4 w-4" /> Open controls
        </button>
      )}
      <div className={`grid gap-5 p-4 ${sidebarOpen ? "lg:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]" : "lg:grid-cols-[70px_minmax(0,1fr)]"}`}>
        <FormationSidebar
          open={sidebarOpen}
          sport={sport}
          setSport={setSport}
          format={format}
          setFormat={setFormat}
          includeB={includeB}
          setIncludeB={setIncludeB}
          options={options}
          safeFormationA={safeFormationA}
          setFormationA={setFormationA}
          safeFormationB={safeFormationB}
          setFormationB={setFormationB}
          teamA={teamA}
          setTeamA={setTeamA}
          teamB={teamB}
          setTeamB={setTeamB}
          tacticalNote={tacticalNote}
          setSidebarOpen={setSidebarOpen}
        />
        <div className={`grid gap-4 ${includeB ? "xl:grid-cols-2" : ""}`}>
          <FormationPitch
            exportId="formation-team-a"
            label={`Team A · ${safeFormationA}`}
            lineup={lineupA}
            tone="border-[#43F58B]/60"
            accent="#43F58B"
            onMove={(id, position) => updatePosition("A", id, position)}
            onNameChange={(id, name) => updatePlayerName("A", id, name)}
          />
          {includeB && (
            <FormationPitch
              exportId="formation-team-b"
              label={`Team B · ${safeFormationB}`}
              lineup={lineupB}
              tone="border-sky-400/60"
              accent="#38BDF8"
              onMove={(id, position) => updatePosition("B", id, position)}
              onNameChange={(id, name) => updatePlayerName("B", id, name)}
            />
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEAM NAME GENERATOR (unchanged)
   ═══════════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════════
   LEAGUE TABLE GENERATOR (unchanged)
   ═══════════════════════════════════════════════════════════ */

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
      return { ...row, played: Number(row.played) + 1, wins: Number(row.wins) + (gf > ga ? 1 : 0), draws: Number(row.draws) + (gf === ga ? 1 : 0), losses: Number(row.losses) + (gf < ga ? 1 : 0), gf: Number(row.gf) + gf, ga: Number(row.ga) + ga };
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
              <div key={`mobile-row-${index}`} className="rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
                <Field label={`Team ${index + 1}`}>
                  <input type="text" value={row.team} onChange={(e) => update(index, "team", e.target.value)} className={smallInputClass} />
                </Field>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[["played", "P"], ["wins", "W"], ["draws", "D"], ["losses", "L"], ["gf", "GF"], ["ga", "GA"]].map(([key, label]) => (
                    <Field key={key} label={label}>
                      <input type="number" min="0" value={row[key]} onChange={(e) => update(index, key, e.target.value)} className={smallInputClass} />
                    </Field>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-black/10 bg-[#F4F3EF] p-3"><p className={labelClass}>GD</p><p className="mt-1 text-xl font-black text-black">{Number(row.gf) - Number(row.ga)}</p></div>
                  <div className="rounded-xl border border-black/10 bg-[#43F58B] p-3"><p className={labelClass}>PTS</p><p className="mt-1 text-xl font-black text-black">{Number(row.wins) * 3 + Number(row.draws)}</p></div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden overflow-x-auto rounded-2xl border-2 border-black shadow-[6px_6px_0px_#000] md:block">
            <table className="w-full min-w-[900px] border-collapse bg-white text-left">
              <thead className="bg-black text-[#43F58B]">
                <tr>{["Team", "P", "W", "D", "L", "GF", "GA", "GD", "PTS"].map((header) => <th key={header} className="p-3 text-xs font-black uppercase tracking-widest">{header}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="border-t border-zinc-200">
                    {["team", "played", "wins", "draws", "losses", "gf", "ga"].map((key) => (
                      <td key={key} className="p-2"><input type={key === "team" ? "text" : "number"} min="0" value={row[key]} onChange={(e) => update(index, key, e.target.value)} className={smallInputClass} /></td>
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

/* ═══════════════════════════════════════════════════════════
   STATS TRACKER — mobile-first redesign
   ═══════════════════════════════════════════════════════════ */

const STAT_FIELDS = [
  { key: "goals", label: "G" },
  { key: "assists", label: "A" },
  { key: "saves", label: "SV" },
  { key: "conceded", label: "GC" },
  { key: "tackles", label: "TK" },
  { key: "dribbles", label: "DR" },
  { key: "shots", label: "SH" },
  { key: "rating", label: "★", max: 10 },
];

function StatsPlayerCard({ player, onUpdate, onRemove, options, teams, teamAName, teamBName }) {
  const [expanded, setExpanded] = useState(false);
  const isTeamB = player.team === "B";

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white">
      {/* ── Collapsed header ── */}
      <div className="flex min-w-0 items-center gap-2 px-3 py-2.5">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${isTeamB ? "bg-sky-400" : "bg-[#43F58B]"}`} />
        <input
          value={player.name}
          onChange={(e) => onUpdate(player.id, "name", e.target.value)}
          placeholder="Player name"
          className="min-w-0 flex-1 border-none bg-transparent text-sm font-bold text-black outline-none placeholder:text-zinc-300"
        />
        <span className="shrink-0 rounded-full bg-[#F4F3EF] px-2 py-0.5 text-[10px] font-black uppercase text-zinc-500">
          {positionLabel(player.position)}
        </span>
        <span className="shrink-0 text-[11px] font-black text-zinc-400">★{player.rating}</span>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg border border-black/10 bg-[#F4F3EF] text-zinc-500 transition hover:bg-[#43F58B] hover:text-black active:scale-90"
        >
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* ── Expanded edit area ── */}
      {expanded && (
        <div className="border-t border-black/5 p-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Position">
              <select value={player.position} onChange={(e) => onUpdate(player.id, "position", e.target.value)} className={smallInputClass}>
                {options.map((pos) => <option key={pos} value={pos}>{pos}</option>)}
              </select>
            </Field>
            {teams.length > 1 && (
              <Field label="Team">
                <select value={player.team} onChange={(e) => onUpdate(player.id, "team", e.target.value)} className={smallInputClass}>
                  <option value="A">{teamAName || "Team A"}</option>
                  <option value="B">{teamBName || "Team B"}</option>
                </select>
              </Field>
            )}
          </div>

          {/* Stat inputs — 4 cols on mobile */}
          <div className="grid grid-cols-4 gap-2">
            {STAT_FIELDS.map(({ key, label, max }) => (
              <label key={key} className="grid gap-1 text-center">
                <span className="text-[9px] font-black uppercase tracking-wider text-zinc-500">{label}</span>
                <input
                  type="number"
                  min="0"
                  max={max || 99}
                  value={player[key] ?? 0}
                  onChange={(e) => onUpdate(player.id, key, clampNumber(e.target.value, 0, max || 99))}
                  className="w-full rounded-lg border border-black/10 bg-[#F4F3EF] py-2 text-center text-sm font-black text-black outline-none focus:border-[#43F58B] focus:ring-2 focus:ring-[#43F58B]/40"
                />
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onRemove(player.id)}
            className="w-full rounded-xl border border-rose-200 bg-rose-50 py-2 text-[11px] font-black uppercase tracking-wider text-rose-600 transition hover:bg-rose-100 active:scale-95"
          >
            Remove Player
          </button>
        </div>
      )}
    </div>
  );
}

function StatsTrackerTool() {
  const [sport, setSport] = useState("football");
  const [format, setFormat] = useState("5");
  const [trackSecond, setTrackSecond] = useState(false);
  const [match, setMatch] = useState({
    teamA: "Pitchside FC", teamB: "Astro United",
    date: new Date().toISOString().slice(0, 10),
    scoreA: 8, scoreB: 6,
  });
  const [players, setPlayers] = useState([
    { id: "s1", name: "Alex", team: "A", position: "Forward", goals: 3, assists: 1, saves: 0, conceded: 0, tackles: 2, dribbles: 4, shots: 6, rating: 9 },
    { id: "s2", name: "Ben", team: "A", position: "Defender", goals: 1, assists: 3, saves: 0, conceded: 0, tackles: 4, dribbles: 1, shots: 2, rating: 8 },
    { id: "s3", name: "Chris", team: "A", position: "Goalkeeper", goals: 0, assists: 0, saves: 9, conceded: 6, tackles: 1, dribbles: 0, shots: 0, rating: 8 },
  ]);

  const visiblePlayers = players.filter((p) => trackSecond || p.team !== "B");

  const scorePlayer = (p) =>
    Number(p.goals) * 4 + Number(p.assists) * 3 + Number(p.saves) * 1.5 + Number(p.tackles) * 2 + Number(p.dribbles) + Number(p.rating);

  const ranked = useMemo(() =>
    [...visiblePlayers].map((p) => ({ ...p, score: scorePlayer(p) })).sort((a, b) => b.score - a.score),
    [visiblePlayers]
  );
  const topScorer = [...visiblePlayers].sort((a, b) => Number(b.goals) - Number(a.goals))[0];
  const topAssister = [...visiblePlayers].sort((a, b) => Number(b.assists) - Number(a.assists))[0];
  const bestKeeper = [...visiblePlayers].sort((a, b) => Number(b.saves) - Number(a.saves))[0];
  const potm = ranked[0];

  const recap = `${match.teamA} ${match.scoreA}–${match.scoreB} ${match.teamB} (${match.date})\n${sport === "futsal" ? "Futsal 5-a-side" : `Football ${format}-a-side`}\n\nTop scorer: ${topScorer?.name || "TBC"} (${topScorer?.goals || 0})\nTop assister: ${topAssister?.name || "TBC"} (${topAssister?.assists || 0})\nBest GK / saves: ${bestKeeper?.name || "TBC"} (${bestKeeper?.saves || 0})\nPOTM suggestion: ${potm?.name || "TBC"}\n\n${visiblePlayers.map((p) => `${p.team === "B" ? match.teamB : match.teamA} - ${p.name} (${p.position}): ${p.goals}G ${p.assists}A ${p.saves}SV ${p.tackles}T ${p.dribbles}D ${p.shots}SH ★${p.rating}`).join("\n")}\n\nTrack manually now, automate later with Pitchside.`;

  return (
    <ToolPanel
      title="5-a-side Stats Tracker"
      eyebrow="Match setup, player stats and recap"
      actions={<CopyButton value={recap} label="Copy recap" shortLabel="Copy" />}
    >
      {/* ── Sport / Format ── */}
      <FormatControls sport={sport} setSport={setSport} format={format} setFormat={setFormat} />

      {/* ── Match info ── */}
      <div className="rounded-2xl border border-black/10 bg-[#F4F3EF] p-4">
        <span className={`${labelClass} mb-3 block`}>Match info</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Field label="Team A">
            <input value={match.teamA} onChange={(e) => setMatch({ ...match, teamA: e.target.value })} className={smallInputClass} />
          </Field>
          <Field label="Team B">
            <input value={match.teamB} onChange={(e) => setMatch({ ...match, teamB: e.target.value })} className={smallInputClass} />
          </Field>
          <Field label="Date" className="col-span-2 sm:col-span-1">
            <input type="date" value={match.date} onChange={(e) => setMatch({ ...match, date: e.target.value })} className={smallInputClass} />
          </Field>
          <Field label={`Score — ${match.teamA || "A"}`}>
            <input type="number" min="0" value={match.scoreA} onChange={(e) => setMatch({ ...match, scoreA: clampNumber(e.target.value, 0, 99) })} className={smallInputClass} />
          </Field>
          <Field label={`Score — ${match.teamB || "B"}`}>
            <input type="number" min="0" value={match.scoreB} onChange={(e) => setMatch({ ...match, scoreB: clampNumber(e.target.value, 0, 99) })} className={smallInputClass} />
          </Field>
        </div>
      </div>

      {/* ── Track second team toggle ── */}
      <label className="flex min-h-11 items-center gap-3 rounded-2xl border-2 border-black bg-white px-4 py-3 text-sm font-black uppercase tracking-widest cursor-pointer">
        <input type="checkbox" checked={trackSecond} onChange={(e) => setTrackSecond(e.target.checked)} className="h-5 w-5 accent-[#43F58B]" />
        Track opponent / second team stats
      </label>

      {/* ── Player list ── */}
      <PlayerEditor
        players={players}
        setPlayers={setPlayers}
        sport={sport}
        format={format}
        allowTeam={trackSecond}
        teams={["A", "B"]}
        showStats
      />

      {/* ── Summary cards ── */}
      <div className="grid gap-3 [grid-template-columns:repeat(2,minmax(0,1fr))] md:[grid-template-columns:repeat(4,minmax(0,1fr))]">
        <ResultCard title="Top scorer" accent>
          <p className="text-sm font-black text-white">{topScorer?.name || "TBC"}</p>
          <p className="mt-1 text-[11px] font-bold text-zinc-400">{topScorer?.goals || 0} goals</p>
        </ResultCard>
        <ResultCard title="Top assister">
          <p className="text-sm font-black text-black">{topAssister?.name || "TBC"}</p>
          <p className="mt-1 text-[11px] font-bold text-zinc-500">{topAssister?.assists || 0} assists</p>
        </ResultCard>
        <ResultCard title="Best GK">
          <p className="text-sm font-black text-black">{bestKeeper?.name || "TBC"}</p>
          <p className="mt-1 text-[11px] font-bold text-zinc-500">{bestKeeper?.saves || 0} saves</p>
        </ResultCard>
        <ResultCard title="POTM">
          <p className="text-sm font-black text-black">{potm?.name || "TBC"}</p>
          <p className="mt-1 text-[11px] font-bold text-zinc-500">Score {Math.round(potm?.score || 0)}</p>
        </ResultCard>
      </div>

      {/* ── Recap ── */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className={labelClass}>Match recap</span>
          <CopyButton value={recap} label="Copy recap" shortLabel="Copy" />
        </div>
        <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border-2 border-black bg-black p-4 text-xs font-bold leading-relaxed text-[#43F58B]">{recap}</pre>
      </div>
    </ToolPanel>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════════════════ */

export default function ToolClient({ slug }) {
  if (slug === "random-5-a-side-team-generator") return <RandomTeamsTool />;
  if (slug === "football-formation-builder") return <FormationTool />;
  if (slug === "football-team-name-generator") return <TeamNameTool />;
  if (slug === "football-league-table-generator") return <LeagueTableTool />;
  if (slug === "5-a-side-football-stats-tracker") return <StatsTrackerTool />;
  return null;
}
