const presets = {
  "one-phone-sideline": [{ id: "camera-1", label: "Phone 1", x: 50, y: 94, rotation: 270, coverageAngle: 80, coverageDepth: 75 }],
  "one-phone-corner": [{ id: "camera-1", label: "Phone 1", x: 8, y: 92, rotation: 315, coverageAngle: 70, coverageDepth: 78 }],
  "one-phone-behind-goal": [{ id: "camera-1", label: "Phone 1", x: 50, y: 104, rotation: 270, coverageAngle: 65, coverageDepth: 82 }],
  "two-phones-opposing-halves": [
    { id: "camera-1", label: "Phone 1", x: 28, y: 94, rotation: 285, coverageAngle: 70, coverageDepth: 68 },
    { id: "camera-2", label: "Phone 2", x: 72, y: 6, rotation: 105, coverageAngle: 70, coverageDepth: 68 },
  ],
  "two-phones-opposite-sidelines": [
    { id: "camera-1", label: "Phone 1", x: 30, y: 94, rotation: 270, coverageAngle: 72, coverageDepth: 72 },
    { id: "camera-2", label: "Phone 2", x: 70, y: 6, rotation: 90, coverageAngle: 72, coverageDepth: 72 },
  ],
  "two-phones-diagonal-corners": [
    { id: "camera-1", label: "Phone 1", x: 8, y: 92, rotation: 315, coverageAngle: 70, coverageDepth: 78 },
    { id: "camera-2", label: "Phone 2", x: 92, y: 8, rotation: 135, coverageAngle: 70, coverageDepth: 78 },
  ],
};

function conePath(camera) {
  const angle = Number(camera.coverageAngle || 70);
  const depth = Number(camera.coverageDepth || 70);
  const rotation = Number(camera.rotation || 270);
  const x = Number(camera.x || 50);
  const y = Number(camera.y || 90);
  const left = ((rotation - angle / 2) * Math.PI) / 180;
  const right = ((rotation + angle / 2) * Math.PI) / 180;
  const x1 = x + Math.cos(left) * depth;
  const y1 = y + Math.sin(left) * depth;
  const x2 = x + Math.cos(right) * depth;
  const y2 = y + Math.sin(right) * depth;
  return `M ${x} ${y} L ${x1} ${y1} L ${x2} ${y2} Z`;
}

export default function PitchDiagram({ block }) {
  const cameras = block.cameras?.length ? block.cameras : presets[block.variant] || presets["one-phone-sideline"];
  const blindSpots = block.blindSpots || [];
  const markers = block.markers || [];
  const usePhoneMarkers = block.cameraStyle === "phone";

  return (
    <figure className="overflow-hidden rounded-2xl border-4 border-[#050505] bg-[#123018] shadow-[8px_8px_0px_#050505]">
      <div className="grid gap-0 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="relative bg-[#174321] p-4">
          <svg viewBox="0 0 100 100" role="img" aria-labelledby={`${block.id}-title ${block.id}-desc`} className="aspect-[1.45/1] w-full rounded-xl bg-[#1e5a2a]">
            <title id={`${block.id}-title`}>{block.title}</title>
            <desc id={`${block.id}-desc`}>{block.description || "Example football recording setup diagram."}</desc>
            <rect x="4" y="4" width="92" height="92" fill="none" stroke="#F4F3EF" strokeWidth="1.2" />
            <line x1="50" y1="4" x2="50" y2="96" stroke="#F4F3EF" strokeWidth="0.8" />
            <circle cx="50" cy="50" r="11" fill="none" stroke="#F4F3EF" strokeWidth="0.8" />
            <rect x="35" y="4" width="30" height="12" fill="none" stroke="#F4F3EF" strokeWidth="0.8" />
            <rect x="35" y="84" width="30" height="12" fill="none" stroke="#F4F3EF" strokeWidth="0.8" />
            <text x="50" y="9" textAnchor="middle" className="fill-[#F4F3EF] text-[3px] uppercase">Goal</text>
            <text x="50" y="94" textAnchor="middle" className="fill-[#F4F3EF] text-[3px] uppercase">Goal</text>
            {blindSpots.map((spot) => (
              <ellipse key={spot.id} cx={spot.x} cy={spot.y} rx={spot.rx || 10} ry={spot.ry || 7} fill="#050505" opacity="0.28" />
            ))}
            {cameras.map((camera) => (
              <g key={camera.id}>
                <path d={conePath(camera)} fill="#CCFF00" opacity="0.24" stroke="#CCFF00" strokeWidth="0.35" />
                {usePhoneMarkers ? (
                  <g transform={`rotate(${camera.markerRotation ?? 0} ${camera.x} ${camera.y})`}>
                    <rect x={Number(camera.x) - 3} y={Number(camera.y) - 5.5} width="6" height="11" rx="2.7" fill="#050505" />
                    <rect x={Number(camera.x) - 2.25} y={Number(camera.y) - 4.75} width="4.5" height="9.5" rx="1.95" fill="#CCFF00" />
                    <circle cx={camera.x} cy={Number(camera.y) - 3.55} r="0.35" fill="#050505" />
                  </g>
                ) : (
                  <>
                    <circle cx={camera.x} cy={camera.y} r="3.4" fill="#050505" stroke="#CCFF00" strokeWidth="1.1" />
                    <text x={camera.x} y={Number(camera.y) - 5.5} textAnchor="middle" className="fill-[#CCFF00] text-[3px] font-bold uppercase">{camera.label}</text>
                  </>
                )}
              </g>
            ))}
            {markers.map((marker) => (
              <g key={marker.id}>
                <circle cx={marker.x} cy={marker.y} r="2" fill="#F4F3EF" />
                <text x={Number(marker.x) + 3} y={Number(marker.y) + 1} className="fill-[#F4F3EF] text-[3px]">{marker.label}</text>
              </g>
            ))}
          </svg>
        </div>
        <figcaption className="bg-[#F4F3EF] p-6 text-[#050505]">
          <p className="mb-2 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#5d7400]">{block.pitchFormat || "Small-sided pitch"} example</p>
          <h3 className="text-2xl font-black uppercase tracking-tight">{block.title}</h3>
          {block.description && <p className="mt-3 text-sm font-bold leading-relaxed text-zinc-700">{block.description}</p>}
          {block.notes?.length > 0 && (
            <ul className="mt-5 space-y-2 text-sm font-medium text-zinc-700">
              {block.notes.map((note) => <li key={note} className="flex gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#CCFF00]" />{note}</li>)}
            </ul>
          )}
          <p className="mt-5 border-t border-black/10 pt-4 text-xs font-black uppercase tracking-widest text-zinc-500">
            {block.caption || "Example only. Final placement depends on the pitch, venue rules and safe mounting points."}
          </p>
        </figcaption>
      </div>
    </figure>
  );
}
