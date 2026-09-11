/**
 * Six-step method loop — original inline SVG, no stock/AI image. Six nodes
 * evenly spaced on a circle (viewBox 0 0 560 440, center (280,220), radius
 * 145, computed at 60° steps starting at 12 o'clock, clockwise), connected
 * by arc segments with arrowheads showing flow direction. The step 6 →
 * step 1 arc is dashed and labelled "repeats monthly" — this is a cycle,
 * not a one-time checklist.
 *
 * Colors are theme tokens only (--accent-outline, --foreground,
 * --background) so it always matches the site's one permanent dark
 * palette (see CLAUDE.md — no light/dark toggle exists here).
 *
 * The viewBox is deliberately wider (560) than the node circle needs
 * (which would fit in ~460) specifically to give the side labels ("AI
 * tracking", "Reputation") room to extend past their anchor point without
 * clipping at the SVG's own edge — SVG clips anything outside its viewBox
 * by default, and a first pass at this diagram with a tighter viewBox
 * clipped exactly those two labels at a 390px viewport. Caught by
 * screenshot, not assumed.
 */
const STEPS = [
  { n: 1, label: "Entity audit" },
  { n: 2, label: "Reviewer" },
  { n: 3, label: "Technical" },
  { n: 4, label: "Local signals" },
  { n: 5, label: "AI tracking" },
  { n: 6, label: "Reputation" },
] as const;

const NODES = [
  { x: 280, y: 75 },
  { x: 405.6, y: 147.5 },
  { x: 405.6, y: 292.5 },
  { x: 280, y: 365 },
  { x: 154.4, y: 292.5 },
  { x: 154.4, y: 147.5 },
];

const LABELS: Array<{ x: number; y: number; anchor: "start" | "middle" | "end" }> = [
  { x: 280, y: 30, anchor: "middle" },
  { x: 448.9, y: 122.5, anchor: "start" },
  { x: 448.9, y: 317.5, anchor: "start" },
  { x: 280, y: 412, anchor: "middle" },
  { x: 111.1, y: 317.5, anchor: "end" },
  { x: 111.1, y: 122.5, anchor: "end" },
];

function arcPath(from: { x: number; y: number }, to: { x: number; y: number }) {
  return `M ${from.x},${from.y} A 145,145 0 0 1 ${to.x},${to.y}`;
}

export function MethodDiagram() {
  return (
    <svg
      viewBox="0 0 560 440"
      role="img"
      aria-label="The six-step method loop: entity audit, reviewer-verified content, technical foundation, local and directory signals, AI-answer tracking, and reputation system — repeating every month."
      className="mx-auto w-full max-w-130"
    >
      <defs>
        <marker id="method-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-outline)" />
        </marker>
      </defs>

      {/* Flow arcs, steps 1 through 5 */}
      {NODES.slice(0, 5).map((node, i) => (
        <path
          key={`arc-${i}`}
          d={arcPath(node, NODES[i + 1])}
          fill="none"
          stroke="var(--accent-outline)"
          strokeWidth="2"
          markerEnd="url(#method-arrow)"
        />
      ))}

      {/* Loop-back arc, step 6 to step 1 — dashed, marks the monthly repeat */}
      <path
        d={arcPath(NODES[5], NODES[0])}
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
        strokeDasharray="5 6"
        markerEnd="url(#method-arrow)"
      />
      <text x="280" y="220" textAnchor="middle" fontSize="13" fill="rgba(255,255,255,0.45)" fontFamily="var(--font-mono)">
        <tspan x="280" dy="0">repeats</tspan>
        <tspan x="280" dy="16">monthly</tspan>
      </text>

      {/* Nodes */}
      {NODES.map((node, i) => (
        <g key={`node-${i}`}>
          <circle cx={node.x} cy={node.y} r="26" fill="var(--background)" stroke="var(--accent-outline)" strokeWidth="2" />
          <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central" fontSize="20" fontWeight="700" fill="var(--foreground)">
            {STEPS[i].n}
          </text>
        </g>
      ))}

      {/* Labels */}
      {LABELS.map((pos, i) => (
        <text
          key={`label-${i}`}
          x={pos.x}
          y={pos.y}
          textAnchor={pos.anchor}
          fontSize="15"
          fontWeight="600"
          fill="var(--foreground)"
        >
          {STEPS[i].label}
        </text>
      ))}
    </svg>
  );
}
