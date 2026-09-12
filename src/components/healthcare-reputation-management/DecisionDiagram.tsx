/**
 * The one required diagram — a real decision tree with labelled Yes/No
 * paths, not an infographic with icons (per this task's brief: take the
 * structural habit of a well-set print manual's diagrams, not their
 * decoration). One vertical trunk, two decision points, three real-world
 * endings. Colors are theme tokens only (--accent-outline, --foreground,
 * --background), so it renders identically in both the current dark
 * default and any future light stamp without a second color pass.
 *
 * Decision nodes (diamond-adjacent rectangles) are outlined in
 * --accent-outline; the three terminal/action nodes use a neutral
 * white/25 border instead, so a reader can tell "still deciding" from
 * "here is what to do" without relying on icons or color alone — the
 * label text itself always carries the meaning either way.
 */
export function DecisionDiagram() {
  return (
    <svg
      viewBox="0 0 620 660"
      role="img"
      aria-label="Decision diagram: a review arrives. Is the reviewer a verifiable patient? If no, report it through Google's review process. If yes, does the review name any clinical detail? If no, it is safe to reply — thank them and stay generic. If yes, move the conversation offline and do not reply with any clinical detail."
      className="mx-auto w-full max-w-140"
    >
      <defs>
        <marker id="hrm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-outline)" />
        </marker>
      </defs>

      {/* Trunk connectors */}
      <path d="M 340,75 L 340,133" fill="none" stroke="var(--accent-outline)" strokeWidth="2" markerEnd="url(#hrm-arrow)" />
      <path d="M 340,255 L 340,333" fill="none" stroke="var(--accent-outline)" strokeWidth="2" markerEnd="url(#hrm-arrow)" />
      <text x="358" y="298" fontSize="14" fontWeight="700" fill="var(--foreground)">
        Yes
      </text>
      <path d="M 340,455 L 340,503" fill="none" stroke="var(--accent-outline)" strokeWidth="2" markerEnd="url(#hrm-arrow)" />
      <text x="358" y="482" fontSize="14" fontWeight="700" fill="var(--foreground)">
        Yes
      </text>

      {/* Left exit connectors */}
      <path d="M 180,195 L 220,195" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" markerEnd="url(#hrm-arrow)" />
      <text x="184" y="182" fontSize="14" fontWeight="700" fill="var(--foreground)">
        No
      </text>
      <path d="M 180,375 L 220,375" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" markerEnd="url(#hrm-arrow)" />
      <text x="184" y="362" fontSize="14" fontWeight="700" fill="var(--foreground)">
        No
      </text>

      {/* 1. Start node */}
      <rect x="210" y="15" width="260" height="60" rx="10" fill="var(--background)" stroke="var(--accent-outline)" strokeWidth="2" />
      <text x="340" y="51" textAnchor="middle" fontSize="17" fontWeight="700" fill="var(--foreground)">
        A review arrives
      </text>

      {/* 2. Decision 1 */}
      <rect x="220" y="135" width="240" height="120" rx="10" fill="var(--background)" stroke="var(--accent-outline)" strokeWidth="2" />
      <text x="340" y="185" textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--foreground)">
        <tspan x="340" dy="0">Is the reviewer</tspan>
        <tspan x="340" dy="24">a verifiable</tspan>
        <tspan x="340" dy="24">patient?</tspan>
      </text>

      {/* Exit A — No, from decision 1 */}
      <rect x="20" y="130" width="200" height="130" rx="10" fill="var(--background)" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      <text x="120" y="180" textAnchor="middle" fontSize="15" fontWeight="600" fill="var(--foreground)">
        <tspan x="120" dy="0">Report it through</tspan>
        <tspan x="120" dy="22">Google&rsquo;s review</tspan>
        <tspan x="120" dy="22">process.</tspan>
      </text>

      {/* 3. Decision 2 */}
      <rect x="220" y="315" width="240" height="120" rx="10" fill="var(--background)" stroke="var(--accent-outline)" strokeWidth="2" />
      <text x="340" y="365" textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--foreground)">
        <tspan x="340" dy="0">Does it name</tspan>
        <tspan x="340" dy="24">any clinical</tspan>
        <tspan x="340" dy="24">detail?</tspan>
      </text>

      {/* Exit B — No, from decision 2 */}
      <rect x="20" y="310" width="200" height="130" rx="10" fill="var(--background)" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      <text x="120" y="360" textAnchor="middle" fontSize="15" fontWeight="600" fill="var(--foreground)">
        <tspan x="120" dy="0">Safe to reply.</tspan>
        <tspan x="120" dy="22">Thank them and</tspan>
        <tspan x="120" dy="22">stay generic.</tspan>
      </text>

      {/* 4. Final node — Yes, from decision 2 */}
      <rect x="190" y="505" width="300" height="140" rx="10" fill="var(--background)" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      <text x="340" y="555" textAnchor="middle" fontSize="15" fontWeight="600" fill="var(--foreground)">
        <tspan x="340" dy="0">Move it offline.</tspan>
        <tspan x="340" dy="22">Do not reply with</tspan>
        <tspan x="340" dy="22">any clinical detail</tspan>
        <tspan x="340" dy="22">in public.</tspan>
      </text>
    </svg>
  );
}
