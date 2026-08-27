import type { Metadata } from "next";

// Internal-only reference page — not part of the marketing site, deliberately
// unlinked from Navbar/Footer and excluded from sitemap.ts. Kept out of search
// results and off-limits to crawlers via robots.ts's Disallow line below,
// with noindex here too as a second layer for any crawler that ignores
// robots.txt. Content is entirely self-contained (its own <style>, its own
// light-theme design tokens under a page-scoped :root) rather than using the
// site's design system — this is a working tool for one person, not a page
// visitors ever see, so the sitewide permanent-dark-theme rule does not apply
// here (same reasoning as /design-lab/).
export const metadata: Metadata = {
  title: "Systems Handbook",
  robots: { index: false, follow: false },
};

const BODY_HTML = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

  :root {
    --bg: #f4f5fa;
    --bg-alt: #eceef6;
    --surface: #ffffff;
    --surface-2: #eef0f7;
    --border: #dbdfeb;
    --border-strong: #c2c8dc;
    --ink: #13151f;
    --muted: #5b6178;
    --faint: #8890a6;
    --accent: #3b4fdb;
    --accent-ink: #ffffff;
    --accent-tint: #e8eaf9;
    --ok: #157a4a;
    --ok-tint: #e3f3ea;
    --warn: #9a6209;
    --warn-tint: #faf0dc;
    --todo: #6b7185;
    --todo-tint: #eaecf3;
    --danger: #b23636;
    --danger-tint: #f8e6e6;
    --shadow: 0 1px 2px rgba(20, 24, 50, 0.04), 0 8px 24px -12px rgba(20, 24, 50, 0.12);
    --radius: 10px;
    --font-display: 'Manrope', 'Segoe UI', sans-serif;
    --font-body: 'Public Sans', 'Segoe UI', sans-serif;
    --font-mono: 'IBM Plex Mono', 'Consolas', monospace;
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --bg: #14151c;
      --bg-alt: #191a23;
      --surface: #1c1e29;
      --surface-2: #21232f;
      --border: #2f3242;
      --border-strong: #3c3f54;
      --ink: #edeef5;
      --muted: #a4a9c1;
      --faint: #767c96;
      --accent: #7c8bff;
      --accent-ink: #10112a;
      --accent-tint: #262a52;
      --ok: #4fcf94;
      --ok-tint: #1a3329;
      --warn: #e0ab4f;
      --warn-tint: #3a2f16;
      --todo: #9aa0b8;
      --todo-tint: #262837;
      --danger: #e8817e;
      --danger-tint: #3a2020;
      --shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 8px 24px -12px rgba(0, 0, 0, 0.5);
    }
  }
  :root[data-theme="dark"] {
    --bg: #14151c;
    --bg-alt: #191a23;
    --surface: #1c1e29;
    --surface-2: #21232f;
    --border: #2f3242;
    --border-strong: #3c3f54;
    --ink: #edeef5;
    --muted: #a4a9c1;
    --faint: #767c96;
    --accent: #7c8bff;
    --accent-ink: #10112a;
    --accent-tint: #262a52;
    --ok: #4fcf94;
    --ok-tint: #1a3329;
    --warn: #e0ab4f;
    --warn-tint: #3a2f16;
    --todo: #9aa0b8;
    --todo-tint: #262837;
    --danger: #e8817e;
    --danger-tint: #3a2020;
    --shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 8px 24px -12px rgba(0, 0, 0, 0.5);
  }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  ::selection { background: var(--accent-tint); color: var(--ink); }

  h1, h2, h3, h4 { font-family: var(--font-display); font-weight: 800; text-wrap: balance; margin: 0; color: var(--ink); }
  p { margin: 0; }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
  code, .mono { font-family: var(--font-mono); }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 3px; }

  /* ---------- layout shell ---------- */
  .shell { display: grid; grid-template-columns: 268px minmax(0, 1fr); min-height: 100vh; }
  @media (max-width: 980px) { .shell { grid-template-columns: 1fr; } }

  .sidebar {
    position: sticky; top: 0; height: 100vh; overflow-y: auto;
    padding: 28px 20px 40px; border-right: 1px solid var(--border);
    background: var(--bg-alt);
  }
  @media (max-width: 980px) {
    .sidebar { position: static; height: auto; border-right: none; border-bottom: 1px solid var(--border); padding: 18px 20px; }
    .sidebar-nav { display: none; }
    .sidebar.open .sidebar-nav { display: block; margin-top: 16px; }
  }

  .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
  .brand-mark {
    width: 30px; height: 30px; border-radius: 8px; background: var(--accent);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .brand-mark svg { width: 16px; height: 16px; }
  .brand-name { font-family: var(--font-display); font-weight: 800; font-size: 0.95rem; letter-spacing: -0.01em; }
  .brand-sub { font-size: 0.72rem; color: var(--faint); margin: 2px 0 22px 40px; }

  .nav-toggle {
    display: none; width: 100%; justify-content: space-between; align-items: center;
    background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
    padding: 10px 14px; font-family: var(--font-body); font-weight: 600; font-size: 0.85rem; color: var(--ink);
    cursor: pointer;
  }
  @media (max-width: 980px) { .nav-toggle { display: flex; } }

  .sidebar-nav { display: flex; flex-direction: column; gap: 1px; }
  .nav-group-label {
    font-family: var(--font-mono); font-size: 0.66rem; letter-spacing: 0.09em; text-transform: uppercase;
    color: var(--faint); margin: 16px 0 6px 10px;
  }
  .nav-group-label:first-child { margin-top: 4px; }
  .nav-link {
    display: flex; align-items: baseline; gap: 8px; padding: 7px 10px; border-radius: 7px;
    font-size: 0.84rem; color: var(--muted); font-weight: 600;
    border-left: 2px solid transparent;
  }
  .nav-link:hover { background: var(--surface); color: var(--ink); text-decoration: none; }
  .nav-link.active { background: var(--surface); color: var(--accent); border-left-color: var(--accent); }
  .nav-num { font-family: var(--font-mono); font-size: 0.7rem; color: var(--faint); width: 16px; flex-shrink: 0; }

  .main { min-width: 0; }
  .chapter {
    max-width: 860px; margin: 0 auto; padding: 64px 28px 20px;
    scroll-margin-top: 24px;
  }
  .chapter.wide { max-width: 1080px; }
  .chapter + .chapter { border-top: 1px solid var(--border); padding-top: 56px; }

  .kicker {
    display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-mono);
    font-size: 0.72rem; letter-spacing: 0.09em; text-transform: uppercase; color: var(--accent);
    margin-bottom: 12px;
  }
  .chapter h2 { font-size: clamp(1.5rem, 1.1rem + 1.6vw, 2.1rem); line-height: 1.15; letter-spacing: -0.015em; }
  .chapter .lede { margin-top: 14px; font-size: 1.05rem; color: var(--muted); max-width: 65ch; line-height: 1.65; }
  .chapter h3 { font-size: 1.15rem; margin-top: 40px; margin-bottom: 14px; letter-spacing: -0.01em; }
  .chapter h3:first-of-type { margin-top: 32px; }
  .prose { max-width: 68ch; color: var(--ink); }
  .prose p + p, .prose ul + p, .prose p + ul { margin-top: 12px; }
  .prose ul { padding-left: 20px; margin: 10px 0; }
  .prose li + li { margin-top: 6px; }
  .prose strong { font-weight: 700; }

  /* ---------- hero (chapter 0) ---------- */
  .hero { padding-top: 40px; }
  .hero h1 { font-size: clamp(2rem, 1.3rem + 3vw, 3.1rem); line-height: 1.05; letter-spacing: -0.02em; }
  .hero .lede { font-size: 1.15rem; margin-top: 18px; }
  .hero-meta {
    display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px;
  }
  .meta-chip {
    display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px;
    background: var(--surface); border: 1px solid var(--border); border-radius: 999px;
    font-size: 0.78rem; color: var(--muted); font-weight: 600;
  }
  .meta-chip .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ok); }
  .howto {
    margin-top: 32px; padding: 16px 20px; background: var(--accent-tint); border-radius: var(--radius);
    border: 1px solid var(--border); font-size: 0.92rem; color: var(--ink); max-width: 68ch;
  }
  .howto strong { color: var(--accent); }

  /* ---------- status pill ---------- */
  .status { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px 3px 8px; border-radius: 999px; font-size: 0.72rem; font-weight: 700; font-family: var(--font-mono); white-space: nowrap; }
  .status .dot { width: 7px; height: 7px; border-radius: 50%; }
  .status.ok { background: var(--ok-tint); color: var(--ok); }
  .status.ok .dot { background: var(--ok); }
  .status.warn { background: var(--warn-tint); color: var(--warn); }
  .status.warn .dot { background: var(--warn); }
  .status.todo { background: var(--todo-tint); color: var(--todo); }
  .status.todo .dot { background: var(--todo); }
  .status.danger { background: var(--danger-tint); color: var(--danger); }
  .status.danger .dot { background: var(--danger); }

  /* ---------- architecture diagram ---------- */
  .diagram-wrap { overflow-x: auto; margin-top: 28px; padding-bottom: 8px; }
  .diagram { min-width: 760px; }
  .diagram svg text { font-family: var(--font-body); }
  .diagram-legend { display: flex; flex-wrap: wrap; gap: 18px; margin-top: 18px; font-size: 0.8rem; color: var(--muted); }
  .diagram-legend span { display: inline-flex; align-items: center; gap: 6px; }
  .legend-line { width: 22px; height: 2px; display: inline-block; }

  .box-jobs { margin-top: 32px; display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; }
  .box-job { padding: 12px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; font-size: 0.84rem; }
  .box-job b { font-family: var(--font-display); font-weight: 800; display: block; margin-bottom: 3px; font-size: 0.86rem; }
  .box-job span { color: var(--muted); }

  /* ---------- timeline ---------- */
  .timeline { margin-top: 32px; position: relative; }
  .timeline::before {
    content: ""; position: absolute; left: 15px; top: 6px; bottom: 6px; width: 2px; background: var(--border-strong);
  }
  .t-phase { position: relative; padding: 0 0 34px 46px; }
  .t-phase:last-child { padding-bottom: 0; }
  .t-phase::before {
    content: ""; position: absolute; left: 8px; top: 4px; width: 16px; height: 16px; border-radius: 50%;
    background: var(--surface); border: 3px solid var(--accent);
  }
  .t-phase .t-num { font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent); font-weight: 700; letter-spacing: 0.04em; }
  .t-phase h4 { font-size: 1.02rem; margin-top: 4px; }
  .t-phase .t-body { color: var(--muted); font-size: 0.9rem; margin-top: 6px; max-width: 62ch; line-height: 1.55; }
  .t-phase .t-commits { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 5px; }
  .t-commit { font-family: var(--font-mono); font-size: 0.68rem; padding: 2px 7px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 5px; color: var(--faint); }
  .t-note { margin-top: 8px; font-size: 0.82rem; padding: 8px 12px; border-radius: 7px; }
  .t-note.warn { background: var(--warn-tint); color: var(--warn); }

  .status-row { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  @media (max-width: 640px) { .status-row { grid-template-columns: 1fr; } }
  .status-block h4 { font-size: 0.95rem; margin-bottom: 12px; }
  .status-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
  .status-list li { display: flex; justify-content: space-between; align-items: center; gap: 10px; font-size: 0.85rem; padding: 8px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 7px; }

  /* ---------- cards ---------- */
  .card-grid { margin-top: 28px; display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 16px; }
  .card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px 20px 22px; box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 10px;
  }
  .card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
  .card-head h4 { font-size: 1.02rem; }
  .card-def { font-size: 0.86rem; color: var(--muted); }
  .card dl { margin: 4px 0 0; display: flex; flex-direction: column; gap: 9px; }
  .card dl > div { display: flex; flex-direction: column; gap: 2px; }
  .card dt { font-family: var(--font-mono); font-size: 0.66rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--faint); }
  .card dd { margin: 0; font-size: 0.86rem; color: var(--ink); line-height: 1.5; }
  .card .example { background: var(--accent-tint); border-radius: 7px; padding: 9px 11px; font-size: 0.83rem; color: var(--ink); line-height: 1.5; }
  .card .example b { color: var(--accent); }
  .card .flag { background: var(--warn-tint); color: var(--warn); border-radius: 7px; padding: 9px 11px; font-size: 0.8rem; line-height: 1.5; }
  .card-envs { display: flex; flex-wrap: wrap; gap: 5px; }
  .env-chip { font-family: var(--font-mono); font-size: 0.68rem; padding: 2px 7px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 5px; color: var(--muted); }
  .card a.loginlink { font-size: 0.83rem; font-weight: 600; }

  /* ---------- tables ---------- */
  .table-wrap { overflow-x: auto; margin-top: 22px; border: 1px solid var(--border); border-radius: var(--radius); }
  table { border-collapse: collapse; width: 100%; font-size: 0.85rem; min-width: 560px; }
  thead th {
    text-align: left; font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--faint); background: var(--surface-2); padding: 10px 14px; border-bottom: 1px solid var(--border); white-space: nowrap;
  }
  tbody td { padding: 12px 14px; border-bottom: 1px solid var(--border); vertical-align: top; color: var(--ink); }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background: var(--surface-2); }
  td.mono, th.mono { font-family: var(--font-mono); font-size: 0.8rem; }
  td.muted { color: var(--muted); }
  .tag {
    display: inline-block; font-family: var(--font-mono); font-size: 0.72rem; padding: 1px 7px;
    background: var(--surface-2); border: 1px solid var(--border); border-radius: 5px; color: var(--muted);
  }

  .trap-box {
    margin-top: 26px; padding: 18px 20px; border-radius: var(--radius); background: var(--danger-tint);
    border: 1px solid color-mix(in srgb, var(--danger) 30%, var(--border));
  }
  .trap-box h4 { font-size: 0.95rem; color: var(--danger); margin-bottom: 8px; }
  .trap-box p { font-size: 0.88rem; color: var(--ink); line-height: 1.55; }
  .trap-box p + p { margin-top: 8px; }

  /* ---------- code group blocks (section 5) ---------- */
  .group-label {
    font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--accent); margin-top: 36px; margin-bottom: 10px; display: flex; align-items: center; gap: 10px;
  }
  .group-label::after { content: ""; flex: 1; height: 1px; background: var(--border); }
  .group-label:first-of-type { margin-top: 30px; }

  .route-card { border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); padding: 16px 18px; margin-top: 10px; }
  .route-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .route-method { font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 5px; }
  .route-method.get { background: var(--ok-tint); color: var(--ok); }
  .route-method.post { background: var(--accent-tint); color: var(--accent); }
  .route-path { font-family: var(--font-mono); font-size: 0.86rem; font-weight: 600; }
  .route-grid { margin-top: 10px; display: grid; grid-template-columns: 90px 1fr; gap: 6px 12px; font-size: 0.84rem; }
  .route-grid dt { font-family: var(--font-mono); font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--faint); padding-top: 2px; }
  .route-grid dd { margin: 0; color: var(--ink); line-height: 1.5; }

  /* ---------- glossary ---------- */
  .glossary-grid { margin-top: 26px; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 4px 22px; }
  .g-term { padding: 12px 0; border-bottom: 1px solid var(--border); }
  .g-term dt { font-family: var(--font-mono); font-weight: 700; font-size: 0.86rem; color: var(--ink); }
  .g-term dd { margin: 4px 0 0; font-size: 0.83rem; color: var(--muted); line-height: 1.5; }

  /* ---------- next-steps ranked list ---------- */
  .rank-list { margin-top: 28px; display: flex; flex-direction: column; gap: 16px; }
  .rank-item { display: flex; gap: 18px; padding: 18px 20px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
  .rank-num { font-family: var(--font-display); font-weight: 800; font-size: 1.6rem; color: var(--accent); flex-shrink: 0; line-height: 1.2; }
  .rank-item h4 { font-size: 1rem; }
  .rank-item p { font-size: 0.88rem; color: var(--muted); margin-top: 5px; line-height: 1.55; }

  /* ---------- routines (section 8) ---------- */
  .routine { margin-top: 28px; }
  .routine h4 { font-size: 0.98rem; display: flex; align-items: center; gap: 8px; }
  .steps { counter-reset: step; margin: 12px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0; }
  .steps li {
    counter-increment: step; position: relative; padding: 10px 0 10px 34px; font-size: 0.87rem;
    border-bottom: 1px dashed var(--border);
  }
  .steps li:last-child { border-bottom: none; }
  .steps li::before {
    content: counter(step); position: absolute; left: 0; top: 9px; width: 22px; height: 22px; border-radius: 6px;
    background: var(--accent-tint); color: var(--accent); font-family: var(--font-mono); font-weight: 700; font-size: 0.72rem;
    display: flex; align-items: center; justify-content: center;
  }
  .steps code { background: var(--surface-2); border: 1px solid var(--border); padding: 1px 6px; border-radius: 4px; font-size: 0.82rem; }

  /* ---------- rebuild numbered ---------- */
  .rebuild-list { counter-reset: rb; margin: 26px 0 0; padding: 0; list-style: none; }
  .rebuild-list li {
    counter-increment: rb; position: relative; padding: 12px 0 12px 40px; font-size: 0.9rem; border-bottom: 1px solid var(--border);
    line-height: 1.55;
  }
  .rebuild-list li::before {
    content: counter(rb); position: absolute; left: 0; top: 12px; width: 24px; height: 24px; border-radius: 50%;
    background: var(--accent); color: var(--accent-ink); font-family: var(--font-mono); font-weight: 700; font-size: 0.75rem;
    display: flex; align-items: center; justify-content: center;
  }

  footer.end {
    max-width: 860px; margin: 0 auto; padding: 40px 28px 70px; color: var(--faint); font-size: 0.8rem;
    border-top: 1px solid var(--border); margin-top: 40px;
  }

  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 6px; }

  @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
</style>

<div class="shell">
  <aside class="sidebar" id="sidebar">
    <div class="brand">
      <span class="brand-mark">
        <svg viewBox="0 0 24 24" fill="none"><path d="M4 20V10L12 4L20 10V20H14V14H10V20H4Z" stroke="white" stroke-width="2" stroke-linejoin="round"/></svg>
      </span>
      <span class="brand-name">Systems Handbook</span>
    </div>
    <div class="brand-sub">boostwebdigital.com</div>

    <button class="nav-toggle" id="navToggle">
      <span>Jump to a section</span>
      <span>▾</span>
    </button>

    <nav class="sidebar-nav" id="sidebarNav">
      <div class="nav-group-label">Orientation</div>
      <a class="nav-link" href="#what-is-this"><span class="nav-num">0</span>What this is</a>
      <a class="nav-link" href="#picture"><span class="nav-num">1</span>The one-page picture</a>
      <a class="nav-link" href="#story"><span class="nav-num">2</span>The story so far</a>

      <div class="nav-group-label">The stack</div>
      <a class="nav-link" href="#services"><span class="nav-num">3</span>Outside services</a>
      <a class="nav-link" href="#settings"><span class="nav-num">4</span>The settings</a>
      <a class="nav-link" href="#code"><span class="nav-num">5</span>The code</a>
      <a class="nav-link" href="#database"><span class="nav-num">6</span>The database</a>

      <div class="nav-group-label">Operating it</div>
      <a class="nav-link" href="#breaks"><span class="nav-num">7</span>When something breaks</a>
      <a class="nav-link" href="#routines"><span class="nav-num">8</span>The routines</a>
      <a class="nav-link" href="#rebuild"><span class="nav-num">9</span>If you rebuilt it</a>

      <div class="nav-group-label">Reference</div>
      <a class="nav-link" href="#words"><span class="nav-num">10</span>The words</a>
      <a class="nav-link" href="#next"><span class="nav-num">11</span>What I'd do next</a>
    </nav>
  </aside>

  <main class="main">

    <!-- ============ 0. WHAT THIS IS ============ -->
    <section class="chapter hero" id="what-is-this">
      <span class="kicker">● Section 0</span>
      <h1>The Boost Web Digital<br>Systems Handbook</h1>
      <p class="lede">
        boostwebdigital.com is a live website for a healthcare marketing agency in Amritsar, Punjab.
        It's built from real, working pieces — a Next.js site on Vercel, a WordPress blog on Hostinger,
        a small Postgres database, and an email service — that you commissioned but didn't write.
        This handbook is the map of all of it: what exists, why it exists, and how to run it yourself.
      </p>
      <div class="hero-meta">
        <span class="meta-chip"><span class="dot"></span> Live in production</span>
        <span class="meta-chip">🇮🇳 Amritsar, Punjab, India</span>
        <span class="meta-chip">Next.js 16 · React 19 · Vercel</span>
        <span class="meta-chip">52 commits so far</span>
      </div>
      <div class="howto">
        <strong>How to use this:</strong> it's built to be jumped around, not read start to finish.
        Something broken right now? Go straight to <a href="#breaks">Section 7</a>.
        A word you don't recognise? <a href="#words">Section 10</a> defines every one, in plain English.
        Otherwise, start at <a href="#picture">Section 1</a> — it's the one diagram that explains everything else.
      </div>
    </section>

    <!-- ============ 1. THE ONE-PAGE PICTURE ============ -->
    <section class="chapter wide" id="picture">
      <span class="kicker">● Section 1</span>
      <h2>The one-page picture</h2>
      <p class="lede">Ten boxes. Every one of them is a real account you own. Here's how they talk to each other.</p>

      <div class="diagram-wrap">
        <div class="diagram">
          <svg viewBox="0 0 1040 640" width="100%" role="img" aria-label="Architecture diagram showing how the visitor's browser, Vercel, WordPress, Neon, Resend, Upstash, Google Workspace and Namecheap DNS connect">
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="var(--faint)"></path>
              </marker>
              <marker id="arrowAccent" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="var(--accent)"></path>
              </marker>
            </defs>

            <!-- connective lines drawn first, boxes on top -->
            <!-- Visitor -> Vercel -->
            <line x1="150" y1="90" x2="150" y2="150" stroke="var(--faint)" stroke-width="1.6" marker-end="url(#arrow)"></line>
            <!-- GitHub -> Vercel -->
            <line x1="420" y1="60" x2="330" y2="150" stroke="var(--faint)" stroke-width="1.6" marker-end="url(#arrow)"></line>
            <!-- Vercel -> WordPress -->
            <path d="M320,195 C440,195 440,195 540,195" stroke="var(--accent)" stroke-width="1.6" fill="none" marker-end="url(#arrowAccent)"></path>
            <text x="400" y="185" font-size="11" fill="var(--accent)">fetches posts</text>
            <!-- WordPress -> Vercel (webhook) -->
            <path d="M540,230 C440,230 440,230 320,230" stroke="var(--warn)" stroke-width="1.6" stroke-dasharray="4 3" fill="none" marker-end="url(#arrow)"></path>
            <text x="378" y="248" font-size="11" fill="var(--warn)">publish ping ⚠</text>
            <!-- Vercel -> Neon -->
            <line x1="240" y1="240" x2="240" y2="330" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#arrowAccent)"></line>
            <text x="248" y="290" font-size="11" fill="var(--accent)">read / write</text>
            <!-- Vercel -> Resend -->
            <path d="M250,240 C400,300 480,330 540,355" stroke="var(--accent)" stroke-width="1.6" fill="none" marker-end="url(#arrowAccent)"></path>
            <!-- Vercel -> Upstash -->
            <path d="M150,240 C100,300 100,330 130,355" stroke="var(--accent)" stroke-width="1.6" fill="none" marker-end="url(#arrowAccent)"></path>
            <!-- Resend -> Google Workspace -->
            <line x1="660" y1="400" x2="660" y2="470" stroke="var(--faint)" stroke-width="1.6" marker-end="url(#arrow)"></line>
            <!-- Namecheap -> everything (dotted, umbrella) -->
            <path d="M870,80 C870,140 700,140 660,150" stroke="var(--faint)" stroke-width="1.2" stroke-dasharray="3 3" fill="none" marker-end="url(#arrow)"></path>
            <path d="M870,80 C870,140 560,180 560,190" stroke="var(--faint)" stroke-width="1.2" stroke-dasharray="3 3" fill="none" marker-end="url(#arrow)"></path>
            <path d="M870,80 C870,300 700,340 660,350" stroke="var(--faint)" stroke-width="1.2" stroke-dasharray="3 3" fill="none" marker-end="url(#arrow)"></path>
            <path d="M870,80 C870,400 700,460 670,468" stroke="var(--faint)" stroke-width="1.2" stroke-dasharray="3 3" fill="none" marker-end="url(#arrow)"></path>
            <text x="895" y="76" font-size="11" fill="var(--faint)">points DNS at ↓</text>

            <!-- Visitor box -->
            <g>
              <rect x="70" y="20" width="160" height="60" rx="10" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.4"></rect>
              <text x="150" y="45" font-size="13" font-weight="700" fill="var(--ink)" text-anchor="middle" font-family="var(--font-display)">Visitor's Browser</text>
              <text x="150" y="63" font-size="10.5" fill="var(--muted)" text-anchor="middle">a patient, a lead, you</text>
            </g>

            <!-- GitHub box -->
            <g>
              <rect x="360" y="20" width="160" height="60" rx="10" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.4"></rect>
              <text x="440" y="45" font-size="13" font-weight="700" fill="var(--ink)" text-anchor="middle" font-family="var(--font-display)">GitHub</text>
              <text x="440" y="63" font-size="10.5" fill="var(--muted)" text-anchor="middle">stores every code change</text>
            </g>

            <!-- Vercel box (central) -->
            <g>
              <rect x="150" y="150" width="180" height="90" rx="12" fill="var(--accent-tint)" stroke="var(--accent)" stroke-width="1.8"></rect>
              <text x="240" y="180" font-size="14" font-weight="800" fill="var(--accent)" text-anchor="middle" font-family="var(--font-display)">Vercel</text>
              <text x="240" y="198" font-size="10.5" fill="var(--ink)" text-anchor="middle">runs the Next.js site</text>
              <text x="240" y="212" font-size="10.5" fill="var(--ink)" text-anchor="middle">+ every /api/ route</text>
            </g>

            <!-- WordPress box -->
            <g>
              <rect x="540" y="165" width="180" height="80" rx="10" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.4"></rect>
              <text x="630" y="190" font-size="13" font-weight="700" fill="var(--ink)" text-anchor="middle" font-family="var(--font-display)">WordPress</text>
              <text x="630" y="207" font-size="10.5" fill="var(--muted)" text-anchor="middle">blog.boostwebdigital.com</text>
              <text x="630" y="221" font-size="10.5" fill="var(--muted)" text-anchor="middle">(Hostinger)</text>
            </g>

            <!-- Neon box -->
            <g>
              <rect x="150" y="330" width="180" height="80" rx="10" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.4"></rect>
              <text x="240" y="355" font-size="13" font-weight="700" fill="var(--ink)" text-anchor="middle" font-family="var(--font-display)">Neon</text>
              <text x="240" y="372" font-size="10.5" fill="var(--muted)" text-anchor="middle">Postgres database</text>
              <text x="240" y="386" font-size="10.5" fill="var(--muted)" text-anchor="middle">subscribers · sent_posts</text>
            </g>

            <!-- Resend box -->
            <g>
              <rect x="540" y="355" width="180" height="60" rx="10" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.4"></rect>
              <text x="630" y="380" font-size="13" font-weight="700" fill="var(--ink)" text-anchor="middle" font-family="var(--font-display)">Resend</text>
              <text x="630" y="397" font-size="10.5" fill="var(--muted)" text-anchor="middle">sends every email</text>
            </g>

            <!-- Upstash box -->
            <g>
              <rect x="40" y="355" width="160" height="60" rx="10" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.4"></rect>
              <text x="120" y="380" font-size="13" font-weight="700" fill="var(--ink)" text-anchor="middle" font-family="var(--font-display)">Upstash</text>
              <text x="120" y="397" font-size="10.5" fill="var(--muted)" text-anchor="middle">rate-limit counter</text>
            </g>

            <!-- Google Workspace box -->
            <g>
              <rect x="580" y="470" width="180" height="60" rx="10" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.4"></rect>
              <text x="670" y="495" font-size="13" font-weight="700" fill="var(--ink)" text-anchor="middle" font-family="var(--font-display)">Google Workspace</text>
              <text x="670" y="512" font-size="10.5" fill="var(--muted)" text-anchor="middle">ritik@ · contact@</text>
            </g>

            <!-- Namecheap box -->
            <g>
              <rect x="790" y="20" width="180" height="60" rx="10" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.4"></rect>
              <text x="880" y="45" font-size="13" font-weight="700" fill="var(--ink)" text-anchor="middle" font-family="var(--font-display)">Namecheap</text>
              <text x="880" y="63" font-size="10.5" fill="var(--muted)" text-anchor="middle">domain + DNS</text>
            </g>

            <!-- GA4 note -->
            <g>
              <rect x="770" y="330" width="200" height="60" rx="10" fill="var(--surface)" stroke="var(--border)" stroke-width="1.2" stroke-dasharray="3 3"></rect>
              <text x="870" y="355" font-size="12" font-weight="700" fill="var(--muted)" text-anchor="middle" font-family="var(--font-display)">Google Analytics</text>
              <text x="870" y="372" font-size="10.5" fill="var(--faint)" text-anchor="middle">watches visitors only</text>
            </g>
          </svg>
        </div>
      </div>

      <div class="diagram-legend">
        <span><span class="legend-line" style="background:var(--accent)"></span> a request your code makes</span>
        <span><span class="legend-line" style="background:var(--warn); border-top:2px dashed var(--warn)"></span> not confirmed firing yet</span>
        <span><span class="legend-line" style="background:var(--faint); border-top:1.5px dashed var(--faint)"></span> DNS pointing, or a plain link</span>
      </div>

      <h3>Every box's one job</h3>
      <div class="box-jobs">
        <div class="box-job"><b>Visitor's Browser</b><span>Loads pages, submits the contact form and the newsletter form.</span></div>
        <div class="box-job"><b>Vercel</b><span>Runs the actual Next.js code — every page and every <code>/api/</code> route lives here.</span></div>
        <div class="box-job"><b>GitHub</b><span>Stores every version of the code. Vercel deploys straight from it.</span></div>
        <div class="box-job"><b>WordPress (Hostinger)</b><span>Where you write and publish blog posts. The Next.js site fetches them, it never stores them.</span></div>
        <div class="box-job"><b>Neon</b><span>Remembers who subscribed to the newsletter, and which posts have already been emailed out.</span></div>
        <div class="box-job"><b>Resend</b><span>Actually sends every email — contact replies, newsletter confirmations, new-post notices.</span></div>
        <div class="box-job"><b>Upstash</b><span>A shared counter so one visitor can't submit a form 50 times in a minute.</span></div>
        <div class="box-job"><b>Google Workspace</b><span>The real inbox behind ritik@ and contact@ — where replies actually land.</span></div>
        <div class="box-job"><b>Namecheap</b><span>Owns the domain name and points every subdomain at the right service.</span></div>
        <div class="box-job"><b>Google Analytics</b><span>Counts visitors. The only analytics tool actually wired in, despite what the privacy policy says (see Section 3).</span></div>
      </div>
    </section>

    <!-- ============ 2. THE STORY SO FAR ============ -->
    <section class="chapter" id="story">
      <span class="kicker">● Section 2</span>
      <h2>The story so far</h2>
      <p class="lede">Every phase below is real, taken straight from <code class="mono">git log</code> — the project's own save history, oldest first.</p>

      <div class="timeline">
        <div class="t-phase">
          <span class="t-num">PHASE 1</span>
          <h4>Foundation</h4>
          <p class="t-body">The Next.js project is created and the first homepage goes up, along with the design system that every page since has followed — colours, type, spacing rules.</p>
          <div class="t-commits"><span class="t-commit">Initial commit</span><span class="t-commit">homepage, design system, SEO foundation</span></div>
        </div>
        <div class="t-phase">
          <span class="t-num">PHASE 2</span>
          <h4>Blog and core pages</h4>
          <p class="t-body">A blog system is built (writing posts as files in the project itself, called MDX — later replaced, see Phase 5), plus the blog archive, the contact page, and the main navigation.</p>
          <div class="t-commits"><span class="t-commit">dynamic blog system with MDX</span><span class="t-commit">blog archive</span><span class="t-commit">contact page</span><span class="t-commit">nav restructure</span></div>
        </div>
        <div class="t-phase">
          <span class="t-num">PHASE 3</span>
          <h4>Pricing, Services, and a real debugging hunt</h4>
          <p class="t-body">The pricing and services pages are built. A chunk of this phase is spent chasing a genuine mobile-performance bug — pages felt laggy on phones — eventually traced to one specific animation style and removed sitewide.</p>
          <div class="t-commits"><span class="t-commit">/pricing/ built</span><span class="t-commit">mobile lag hunted + fixed</span><span class="t-commit">blur removed sitewide</span><span class="t-commit">/services/ built</span></div>
        </div>
        <div class="t-phase">
          <span class="t-num">PHASE 4</span>
          <h4>FAQ, legal pages, first SEO pass</h4>
          <p class="t-body">An FAQ page and all five legal pages (terms, privacy, refund, disclaimer, cookies) go live. A full SEO/crawlability audit finds and fixes broken links and missing schema, and the site is verified with Google Search Console.</p>
          <div class="t-commits"><span class="t-commit">/faq/ built</span><span class="t-commit">5 legal pages</span><span class="t-commit">SEO/crawlability audit</span><span class="t-commit">GSC verification file</span></div>
        </div>
        <div class="t-phase">
          <span class="t-num">PHASE 5</span>
          <h4>The move to headless WordPress</h4>
          <p class="t-body">The blog's data source is switched from files stored inside the Next.js project to a real WordPress installation, reached over its REST API. A one-hour safety-net cache refresh is added in case the instant-update webhook (Section 1's dashed orange line) ever misses.</p>
          <div class="t-commits"><span class="t-commit">swap MDX → headless WordPress</span><span class="t-commit">1-hour revalidate fallback</span></div>
        </div>
        <div class="t-phase">
          <span class="t-num">PHASE 6</span>
          <h4>Schema cleanup and a real Services page</h4>
          <p class="t-body">The invisible "facts about the business" block search engines read (schema markup) gets cleaned up — a wrong claim about which country the agency serves is removed, real contact details added. The Services page is rebuilt with real service descriptions, and a full AI-visibility (GEO) landing page is built.</p>
          <div class="t-commits"><span class="t-commit">schema: address/email/sameAs fixed</span><span class="t-commit">wrong areaServed removed</span><span class="t-commit">/services/ rebuilt with real content</span><span class="t-commit">GEO landing page built</span></div>
        </div>
        <div class="t-phase">
          <span class="t-num">PHASE 7</span>
          <h4>The contact form is discovered broken — and fixed</h4>
          <p class="t-body">On inspection, the contact form had <strong>never once sent a working email in production</strong>: it was sending from an unverified test address and to an inbox with no mail server behind it, with no API key configured. All three are fixed, rate limiting and an auto-reply are added, and the email itself is redesigned with real brand colours instead of generic styling.</p>
          <div class="t-commits"><span class="t-commit">real sender/recipient</span><span class="t-commit">rate limiting</span><span class="t-commit">auto-reply</span><span class="t-commit">branded email template</span></div>
          <div class="t-note warn">⚠ This is the kind of gap that looks fine on screen but was never actually delivering an email — worth remembering when something looks "done."</div>
        </div>
        <div class="t-phase">
          <span class="t-num">PHASE 8</span>
          <h4>The newsletter — subscribe, confirm, unsubscribe</h4>
          <p class="t-body">A full double opt-in newsletter system is built from nothing: its own two-table database, a subscribe form in the footer, a confirmation email, and a proper one-click unsubscribe. Midway through, two machines (a "Ritik PC" and a "Rahul PC") diverge and a merge conflict has to be resolved by hand — recorded here because it's exactly the trap Section 4 warns about.</p>
          <div class="t-commits"><span class="t-commit">subscribe → confirm → unsubscribe loop</span><span class="t-commit">merge conflict resolved</span></div>
        </div>
        <div class="t-phase">
          <span class="t-num">PHASE 9 — where things stand today</span>
          <h4>Blog-publish notifications</h4>
          <p class="t-body">The last piece of the newsletter: when a post is published, every confirmed subscriber gets emailed automatically, personalised with their own one-click unsubscribe link. Built and committed. <strong>Not yet confirmed working end-to-end in production</strong> — see the flag below and Section 7.</p>
          <div class="t-note warn">⚠ <code class="mono">docs/08-CMS.md</code> says plainly: "the route exists; nothing calls it yet." The connection from WordPress's publish button to this code has not been proven to fire on a real publish — the one-hour fallback cache (Phase 5) is what's actually been keeping the blog visibly up to date.</div>
        </div>
      </div>

      <div class="status-row">
        <div class="status-block">
          <h4>Working right now</h4>
          <ul class="status-list">
            <li>Site live on boostwebdigital.com <span class="status ok"><span class="dot"></span>LIVE</span></li>
            <li>Blog live via WordPress <span class="status ok"><span class="dot"></span>LIVE</span></li>
            <li>Contact form, rate-limited, branded <span class="status ok"><span class="dot"></span>LIVE</span></li>
            <li>Newsletter subscribe/confirm/unsubscribe <span class="status ok"><span class="dot"></span>LIVE</span></li>
          </ul>
        </div>
        <div class="status-block">
          <h4>Not built yet</h4>
          <ul class="status-list">
            <li>AI Visibility Checker (free tool) <span class="status todo"><span class="dot"></span>PLANNED</span></li>
            <li>Monitoring / error alerts / backups <span class="status todo"><span class="dot"></span>NOT STARTED</span></li>
            <li>Go-live checklist <span class="status todo"><span class="dot"></span>NOT STARTED</span></li>
            <li>Ritik's personal-brand-as-CEO plan <span class="status todo"><span class="dot"></span>NO PLAN YET</span></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ============ 3. THE OUTSIDE SERVICES ============ -->
    <section class="chapter wide" id="services">
      <span class="kicker">● Section 3</span>
      <h2>The outside services</h2>
      <p class="lede">Every one of these is a separate account, outside this codebase, that the site depends on. Each card is verified against real code — not guessed.</p>

      <div class="card-grid">

        <div class="card">
          <div class="card-head"><h4>Vercel</h4><span class="status ok"><span class="dot"></span>LIVE</span></div>
          <p class="card-def">The computer that actually runs the website and serves it to visitors.</p>
          <dl>
            <div><dt>Its job here</dt><dd>Hosts the Next.js app and every <code class="mono">/api/</code> route; redeploys itself automatically on every GitHub push.</dd></div>
            <div><dt>Real example</dt><dd class="example">You push a code change → Vercel notices in seconds, rebuilds the whole site, and swaps the live version in — usually under two minutes, with no downtime.</dd></div>
            <div><dt>Free tier</dt><dd>Hobby plan, currently in use — fine for a site this size.</dd></div>
            <div><dt>What breaks without it</dt><dd>Everything. The whole site goes down.</dd></div>
          </dl>
          <div class="card-envs"></div>
          <a class="loginlink" href="https://vercel.com" target="_blank" rel="noopener">vercel.com →</a>
        </div>

        <div class="card">
          <div class="card-head"><h4>GitHub</h4><span class="status ok"><span class="dot"></span>LIVE</span></div>
          <p class="card-def">Where every version of the code is saved — a very detailed history you can always go back to.</p>
          <dl>
            <div><dt>Its job here</dt><dd>The single source of truth for the code. Vercel deploys straight from it.</dd></div>
            <div><dt>Real example</dt><dd class="example">A Claude Code session finishes a feature and runs <code class="mono">git commit</code> (saves it locally). You review it, then <code class="mono">git push</code> sends it to GitHub — that's the moment Vercel picks it up.</dd></div>
            <div><dt>Free tier</dt><dd>Free, for a private repository.</dd></div>
            <div><dt>What breaks without it</dt><dd>Nothing live — the site keeps running off its last deploy. But no new change can ever ship again.</dd></div>
          </dl>
          <div class="card-envs"></div>
          <a class="loginlink" href="https://github.com/ritik2926/boostwebdigital" target="_blank" rel="noopener">github.com/ritik2926/boostwebdigital →</a>
        </div>

        <div class="card">
          <div class="card-head"><h4>Namecheap</h4><span class="status ok"><span class="dot"></span>LIVE</span></div>
          <p class="card-def">Where the domain name itself is registered — and the phonebook (DNS) that says which server owns which name.</p>
          <dl>
            <div><dt>Its job here</dt><dd>Points boostwebdigital.com at Vercel, blog.boostwebdigital.com at Hostinger, and proves who's allowed to send mail as your domain.</dd></div>
            <div><dt>Real example</dt><dd class="example">A DNS lookup run for this handbook confirms boostwebdigital.com currently resolves to a Vercel address, and blog.boostwebdigital.com to Hostinger's — see Section 4, Table B.</dd></div>
            <div><dt>Free tier</dt><dd>N/A — paid domain registration.</dd></div>
            <div><dt>What breaks without it</dt><dd>Everything. The domain stops pointing anywhere at all.</dd></div>
          </dl>
          <div class="card-envs"></div>
          <a class="loginlink" href="https://namecheap.com" target="_blank" rel="noopener">namecheap.com → Domain List →</a>
        </div>

        <div class="card">
          <div class="card-head"><h4>Neon (Postgres)</h4><span class="status ok"><span class="dot"></span>LIVE</span></div>
          <p class="card-def">A database — a permanent, structured notebook the app writes to and reads from.</p>
          <dl>
            <div><dt>Its job here</dt><dd>Remembers every newsletter subscriber and their status, and which blog posts have already been emailed, so nobody gets double-emailed.</dd></div>
            <div><dt>Real example</dt><dd class="example">Someone types their email into the footer form → <b>POST /api/newsletter/subscribe</b> writes one new row into the <code class="mono">subscribers</code> table with status <code class="mono">'pending'</code>.</dd></div>
            <div><dt>Free tier</dt><dd>Neon's free tier — chosen over Supabase specifically because Supabase's free tier pauses after a week of no traffic and needs a manual click to restart. Neon auto-resumes in ~300ms.</dd></div>
            <div><dt>What breaks without it</dt><dd>The entire newsletter system — signups, confirmations, unsubscribes, and post-notification emails all fail.</dd></div>
          </dl>
          <div class="card-envs"><span class="env-chip">DATABASE_URL</span></div>
          <a class="loginlink" href="https://console.neon.tech" target="_blank" rel="noopener">console.neon.tech →</a>
        </div>

        <div class="card">
          <div class="card-head"><h4>Resend</h4><span class="status ok"><span class="dot"></span>LIVE</span></div>
          <p class="card-def">A service that sends email on the site's behalf — a website can't just email people directly.</p>
          <dl>
            <div><dt>Its job here</dt><dd>Sends every email the site sends: contact notifications + auto-reply, newsletter confirmation, and new-post notices.</dd></div>
            <div><dt>Real example</dt><dd class="example">Dr. Sharma submits the contact form → <code class="mono">src/app/api/contact/route.ts</code> calls Resend twice: once to notify ritik@, once to auto-reply to Dr. Sharma.</dd></div>
            <div><dt>Free tier</dt><dd><strong>3,000 emails/month, capped at 100/day.</strong> The blog-notification code already caps a single send at the first 100 confirmed subscribers and logs a warning if there are more — see Section 6.</dd></div>
            <div><dt>What breaks without it</dt><dd>Contact form fails loudly ("email sending isn't configured yet") instead of pretending to work; newsletter signups still save, but no confirmation email goes out.</dd></div>
          </dl>
          <div class="card-envs"><span class="env-chip">RESEND_API_KEY</span></div>
          <a class="loginlink" href="https://resend.com" target="_blank" rel="noopener">resend.com →</a>
        </div>

        <div class="card">
          <div class="card-head"><h4>Upstash (Redis)</h4><span class="status warn"><span class="dot"></span>PARTIAL</span></div>
          <p class="card-def">A very fast shared counter — a small database built specifically for counting things quickly.</p>
          <dl>
            <div><dt>Its job here</dt><dd>Rate limiting: stops one visitor (or a bot) submitting the contact form or newsletter signup more than 3 times an hour.</dd></div>
            <div><dt>Real example</dt><dd class="example">Same visitor submits the contact form a 4th time in an hour → HTTP 429, "Too many messages. Please try again in an hour," instead of a 4th email going out.</dd></div>
            <div><dt>Free tier</dt><dd>Upstash's free tier (exact request quota lives in their dashboard, not in this code).</dd></div>
            <div><dt>What breaks without it</dt><dd>Nothing visible — it "fails open" on purpose. A missing/broken value means <em>no rate limit at all</em>, never a blocked visitor.</dd></div>
          </dl>
          <div class="flag">⚠ Confirmed during this session: the <strong>Development</strong> environment's Upstash URL is a placeholder, not a real value. Production is fine. See the trap box in Section 4.</div>
          <div class="card-envs"><span class="env-chip">UPSTASH_REDIS_REST_URL</span><span class="env-chip">UPSTASH_REDIS_REST_TOKEN</span></div>
          <a class="loginlink" href="https://console.upstash.com" target="_blank" rel="noopener">console.upstash.com →</a>
        </div>

        <div class="card">
          <div class="card-head"><h4>Google Workspace</h4><span class="status ok"><span class="dot"></span>LIVE</span></div>
          <p class="card-def">The real mailbox software behind ritik@boostwebdigital.com — the paid version of Gmail for a custom domain.</p>
          <dl>
            <div><dt>Its job here</dt><dd>Where every email the site sends or receives actually lands and can be replied to.</dd></div>
            <div><dt>Real example</dt><dd class="example">The contact form's notification email is addressed to ritik@boostwebdigital.com — a Google Workspace inbox that lives entirely outside this codebase.</dd></div>
            <div><dt>Free tier</dt><dd>N/A — paid, one user, with contact@ as a free alias on the same inbox.</dd></div>
            <div><dt>What breaks without it</dt><dd>Mail bounces. This actually happened for roughly a month when the site moved off old WordPress hosting and the mail-routing (MX) record was lost — nothing queued, everything returned to sender.</dd></div>
          </dl>
          <div class="card-envs"></div>
          <a class="loginlink" href="https://admin.google.com" target="_blank" rel="noopener">admin.google.com →</a>
        </div>

        <div class="card">
          <div class="card-head"><h4>WordPress <span style="font-weight:500;color:var(--muted);font-size:0.8em;">(Hostinger)</span></h4><span class="status ok"><span class="dot"></span>LIVE</span></div>
          <p class="card-def">The familiar WordPress writing dashboard — running "headless," meaning only its data gets used, never its own visual theme.</p>
          <dl>
            <div><dt>Its job here</dt><dd>Where you write and publish posts. The Next.js site never stores blog content — it fetches it live over WordPress's own REST API.</dd></div>
            <div><dt>Real example</dt><dd class="example">You click "Publish" on a new post → <code class="mono">src/lib/blog/wordpress.ts</code> is what the site uses to fetch that post's title, body and image the next time <code class="mono">/blogs/</code> is visited.</dd></div>
            <div><dt>Free tier</dt><dd>N/A — paid Hostinger hosting.</dd></div>
            <div><dt>What breaks without it</dt><dd>The blog goes blank. <code class="mono">/blogs/</code> and every post page fail to load any content.</dd></div>
          </dl>
          <div class="card-envs"><span class="env-chip">WP_API_URL</span></div>
          <a class="loginlink" href="https://blog.boostwebdigital.com/wp-admin" target="_blank" rel="noopener">blog.boostwebdigital.com/wp-admin →</a>
        </div>

        <div class="card">
          <div class="card-head"><h4>Google Analytics (GA4)</h4><span class="status ok"><span class="dot"></span>LIVE</span></div>
          <p class="card-def">Google's free visitor-counting tool.</p>
          <dl>
            <div><dt>Its job here</dt><dd>Counts how many people visit, which pages, and roughly where from.</dd></div>
            <div><dt>Real example</dt><dd class="example"><code class="mono">src/components/Analytics.tsx</code> loads Google's tracking script on every real visit — never on a local build or preview deploy, since it checks the ID is actually set first.</dd></div>
            <div><dt>Free tier</dt><dd>Free — effectively unlimited for a site this size.</dd></div>
            <div><dt>What breaks without it</dt><dd>Nothing breaks. The site works identically — you just can't see visitor numbers.</dd></div>
          </dl>
          <div class="flag">⚠ The privacy and cookie-policy pages also mention "Microsoft Clarity and/or Hotjar" as session-recording tools. <strong>Neither exists anywhere in the actual code.</strong> Either install one, or soften that policy wording — right now it discloses a tool you don't have.</div>
          <div class="card-envs"><span class="env-chip">NEXT_PUBLIC_GA_ID</span></div>
          <a class="loginlink" href="https://analytics.google.com" target="_blank" rel="noopener">analytics.google.com →</a>
        </div>

        <div class="card">
          <div class="card-head"><h4>Google Search Console</h4><span class="status warn"><span class="dot"></span>NEEDS WORK</span></div>
          <p class="card-def">Google's free tool for telling it your site exists and watching how it performs in search.</p>
          <dl>
            <div><dt>Its job here</dt><dd>Confirms you own the domain, tracks which of your pages Google has actually indexed.</dd></div>
            <div><dt>Real example</dt><dd class="example">Ownership is proven by a real file sitting at <code class="mono">public/googlee0e7c245548e8b89.html</code> — verified present in the code.</dd></div>
            <div><dt>Free tier</dt><dd>Free, no limit.</dd></div>
            <div><dt>What breaks without it</dt><dd>Nothing breaks — but per the last working session's notes, <strong>only 1 of 9 real pages is indexed</strong>. Not independently re-checked for this handbook — verify in the dashboard.</dd></div>
          </dl>
          <div class="card-envs"></div>
          <a class="loginlink" href="https://search.google.com/search-console" target="_blank" rel="noopener">search.google.com/search-console →</a>
        </div>

      </div>
    </section>

    <!-- ============ 4. THE SETTINGS ============ -->
    <section class="chapter wide" id="settings">
      <span class="kicker">● Section 4</span>
      <h2>The settings</h2>
      <p class="lede">Two tables: the passwords and keys the app needs (never shown — just their names and purpose), and the DNS records that make the domain work.</p>

      <h3>Table A — Environment variables</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>What it's for</th><th>Where the value comes from</th><th>What breaks if missing</th></tr></thead>
          <tbody>
            <tr><td class="mono">RESEND_API_KEY</td><td>Lets the app send email through Resend</td><td class="muted">resend.com → API Keys</td><td class="muted">Contact form fails loudly (503); newsletter emails silently skip sending</td></tr>
            <tr><td class="mono">DATABASE_URL</td><td>Connects to the Neon database</td><td class="muted">Neon dashboard → Connection string, a <code class="mono">postgresql://</code> URL ending in <code class="mono">.neon.tech</code></td><td class="muted">Every newsletter route (subscribe/confirm/unsubscribe/notify) fails</td></tr>
            <tr><td class="mono">CONTACT_TO_EMAIL</td><td>Which inbox contact-form notifications go to</td><td class="muted">You choose it — optional</td><td class="muted">Nothing breaks — falls back to ritik@boostwebdigital.com automatically</td></tr>
            <tr><td class="mono">UPSTASH_REDIS_REST_URL</td><td>Address of the Upstash rate-limit counter</td><td class="muted">Upstash dashboard → REST API, starts with <code class="mono">https://</code></td><td class="muted">Rate limiting fails open — no limit is enforced, nothing else breaks</td></tr>
            <tr><td class="mono">UPSTASH_REDIS_REST_TOKEN</td><td>The password for that counter</td><td class="muted">Same Upstash screen</td><td class="muted">Same as above</td></tr>
            <tr><td class="mono">WP_API_URL</td><td>Where to fetch blog posts from</td><td class="muted">Your WordPress site's REST root, e.g. a URL ending <code class="mono">/wp-json/wp/v2</code></td><td class="muted">Blog pages show no posts at all</td></tr>
            <tr><td class="mono">REVALIDATE_SECRET</td><td>A password only WordPress (and you) should know, proving a "post published" ping is real</td><td class="muted">You invent it yourself — any random string</td><td class="muted">Anyone could trigger the newsletter-notify system or clear the cache without permission</td></tr>
            <tr><td class="mono">NEXT_PUBLIC_GA_ID</td><td>Your Google Analytics measurement ID</td><td class="muted">analytics.google.com → Admin → Data Streams, starts with <code class="mono">G-</code></td><td class="muted">No visitor tracking — the site itself works identically</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Table B — DNS records at Namecheap</h3>
      <p class="prose" style="margin-top:-6px; font-size:0.86rem; color:var(--muted);">Looked up directly for this handbook, not guessed — but confirm the exact values in Namecheap yourself before changing anything.</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Type</th><th>Host</th><th>Points to (as found)</th><th>Why it exists</th></tr></thead>
          <tbody>
            <tr><td class="tag">A</td><td class="mono">@</td><td class="mono muted">216.198.79.1</td><td>The main site — Vercel's address</td></tr>
            <tr><td class="tag">A</td><td class="mono">blog</td><td class="mono muted">178.16.136.160</td><td>The WordPress blog — Hostinger's address</td></tr>
            <tr><td class="tag">MX</td><td class="mono">@</td><td class="mono muted">smtp.google.com</td><td>Routes ritik@ / contact@ mail to Google Workspace</td></tr>
            <tr><td class="tag">TXT (SPF)</td><td class="mono">@</td><td class="mono muted">v=spf1 include:_spf.google.com ~all</td><td>Tells other mail servers Google is allowed to send as your domain</td></tr>
            <tr><td class="tag">TXT (SPF)</td><td class="mono">send</td><td class="mono muted">v=spf1 include:amazonses.com ~all</td><td>Authorises Resend (built on Amazon's mail infrastructure) to send as hello@</td></tr>
            <tr><td class="tag">MX</td><td class="mono">send</td><td class="mono muted">feedback-smtp.ap-northeast-1&#8203;.amazonses.com</td><td>Handles bounce/complaint feedback for Resend's sends</td></tr>
            <tr><td class="tag">TXT (DKIM)</td><td class="mono">resend._domainkey</td><td class="mono muted">present, verified</td><td>A digital seal proving a Resend email wasn't tampered with in transit</td></tr>
            <tr><td class="tag">TXT (DKIM)</td><td class="mono">google._domainkey</td><td class="mono muted">present, verified</td><td>Same seal, for Google Workspace's own outgoing mail</td></tr>
            <tr><td class="tag">TXT (DMARC)</td><td class="mono">_dmarc</td><td class="mono muted">v=DMARC1; p=none; rua=mailto:ritik@…</td><td>The policy for what happens when SPF/DKIM fail — see the note below</td></tr>
          </tbody>
        </table>
      </div>
      <p class="prose" style="margin-top:14px; font-size:0.86rem; color:var(--muted);">
        ⚠ <strong>One honest nuance:</strong> the DMARC record above says <code class="mono">p=none</code> — it's currently in <em>monitor-only</em> mode. It records failures and emails you a report (<code class="mono">rua=</code>), but doesn't yet instruct other mail servers to actually reject spoofed mail. That's a normal, safe first step — moving to <code class="mono">p=quarantine</code> or <code class="mono">p=reject</code> is a deliberate later tightening, not a bug.
      </p>

      <div class="trap-box">
        <h4>⚠ The trap that has caught you three times</h4>
        <p><strong>Vercel keeps a separate copy of every environment variable for Production, Preview, and Development.</strong> Setting one doesn't set the others — they're three different boxes, even though they have the same names.</p>
        <p><strong>Real example that actually happened:</strong> <code class="mono">WP_API_URL</code> was set only for Development. Production kept running with no value — the live blog went blank — even though it worked perfectly on your own machine.</p>
        <p><strong>The fix, every time:</strong> when you add or change a variable in Vercel, tick all three environments unless you have a specific reason not to. And remember <code class="mono">vercel env pull</code> only ever grabs the Development copy by default.</p>
      </div>
    </section>

    <!-- ============ 5. THE CODE ============ -->
    <section class="chapter wide" id="code">
      <span class="kicker">● Section 5</span>
      <h2>The code, in plain English</h2>
      <p class="lede">No code is pasted below — just what each piece actually does, described in words.</p>

      <div class="group-label">Pages you'd recognise</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Path</th><th>What it does</th><th>Real example</th></tr></thead>
          <tbody>
            <tr><td class="mono">src/app/page.tsx</td><td>The homepage</td><td class="muted">What a Google search or a shared link opens first</td></tr>
            <tr><td class="mono">src/app/services/</td><td>The three core services, written out fully</td><td class="muted">What a prospect reads before booking a call</td></tr>
            <tr><td class="mono">src/app/ai-visibility-geo/</td><td>The dedicated GEO landing page</td><td class="muted">Where you'd send a paid-ad click for the AI-visibility pitch specifically</td></tr>
            <tr><td class="mono">src/app/pricing/</td><td>Pricing and packages</td><td class="muted">—</td></tr>
            <tr><td class="mono">src/app/blogs/</td><td>The blog archive — every post, pulled live from WordPress</td><td class="muted">Refreshes at most an hour after you hit publish, even if the instant-update ping (Phase 9) never fires</td></tr>
            <tr><td class="mono">src/app/blog/[slug]/</td><td>One individual blog post</td><td class="muted">e.g. <code class="mono">/blog/why-healthcare-practices-are-invisible-in-ai-search/</code></td></tr>
            <tr><td class="mono">src/app/contact/</td><td>The contact form page</td><td class="muted">—</td></tr>
            <tr><td class="mono">src/app/newsletter/confirmed/</td><td>What a subscriber sees after clicking the confirm link</td><td class="muted">Also handles an expired-link message</td></tr>
            <tr><td class="mono">src/app/newsletter/unsubscribe/</td><td>The unsubscribe page, with its one button</td><td class="muted">Deliberately a page + button, not a plain link — see Section 10, "link prefetching"</td></tr>
            <tr><td class="mono">src/app/terms, /privacy, /refund-policy, /disclaimer, /cookie-policy</td><td>The five legal pages</td><td class="muted">Deliberately excluded from Google's search results (noindex)</td></tr>
            <tr><td class="mono">src/app/faq/</td><td>Clustered FAQ accordion</td><td class="muted">—</td></tr>
          </tbody>
        </table>
      </div>

      <div class="group-label">API routes — the URLs that DO things, not show pages</div>

      <div class="route-card">
        <div class="route-head"><span class="route-method post">POST</span><span class="route-path">/api/contact</span></div>
        <dl class="route-grid">
          <dt>Triggered by</dt><dd>Submitting the contact form</dd>
          <dt>Does</dt><dd>Checks it isn't a bot (honeypot + timing), checks rate limits, emails Ritik the message, auto-replies to the visitor</dd>
          <dt>Returns</dt><dd>Success, or a specific error (bad fields, rate-limited, email service down)</dd>
          <dt>If it fails</dt><dd>The visitor sees a plain message telling them to email directly instead — never a silent failure</dd>
        </dl>
      </div>

      <div class="route-card">
        <div class="route-head"><span class="route-method post">POST</span><span class="route-path">/api/newsletter/subscribe</span></div>
        <dl class="route-grid">
          <dt>Triggered by</dt><dd>The footer form, or the form at the bottom of a blog post</dd>
          <dt>Does</dt><dd>Bot checks, rate limit, saves the email as 'pending', emails a confirm link</dd>
          <dt>Returns</dt><dd>The exact same message every time — on purpose, so the form can never be used to check who's already on the list (see "enumeration," Section 10)</dd>
          <dt>If it fails</dt><dd>The row still saves; only the confirmation email is skipped, logged quietly</dd>
        </dl>
      </div>

      <div class="route-card">
        <div class="route-head"><span class="route-method get">GET</span><span class="route-path">/api/newsletter/confirm</span></div>
        <dl class="route-grid">
          <dt>Triggered by</dt><dd>Clicking the link inside the confirmation email</dd>
          <dt>Does</dt><dd>Flips that subscriber's status from 'pending' to 'confirmed'</dd>
          <dt>Returns</dt><dd>Redirects to the confirmed page (or an "expired link" version)</dd>
          <dt>If it fails</dt><dd>Shows the expired-link message — never a raw error</dd>
        </dl>
      </div>

      <div class="route-card">
        <div class="route-head"><span class="route-method post">POST</span><span class="route-path">/api/newsletter/unsubscribe</span></div>
        <dl class="route-grid">
          <dt>Triggered by</dt><dd>Clicking the button on the unsubscribe page — or a mail app's built-in one-click unsubscribe</dd>
          <dt>Does</dt><dd>Marks that subscriber as 'unsubscribed'</dd>
          <dt>Returns</dt><dd>Always a clean success, whether or not the token was even real</dd>
          <dt>If it fails</dt><dd>It doesn't — this route is deliberately built to never show an error</dd>
        </dl>
      </div>

      <div class="route-card">
        <div class="route-head"><span class="route-method post">POST</span><span class="route-path">/api/newsletter/test-send</span></div>
        <dl class="route-grid">
          <dt>Triggered by</dt><dd>You, manually — needs the same secret as revalidate below</dd>
          <dt>Does</dt><dd>Sends exactly one preview of a post-notification email, to one address you choose, using the identical rendering as a real send</dd>
          <dt>Returns</dt><dd>Success, or 401 if the secret is wrong</dd>
          <dt>If it fails</dt><dd>Nothing is written anywhere — it never touches the subscriber list or the sent-posts record</dd>
        </dl>
      </div>

      <div class="route-card">
        <div class="route-head"><span class="route-method post">POST</span><span class="route-path">/api/revalidate</span></div>
        <dl class="route-grid">
          <dt>Triggered by</dt><dd>WordPress, the moment a post is published (intended — not yet confirmed firing, Phase 9) — or the 1-hour fallback, or you manually</dd>
          <dt>Does</dt><dd>Clears the cached copy of the blog so the new post shows up immediately, then emails every confirmed subscriber about it</dd>
          <dt>Returns</dt><dd>A simple confirmation — the newsletter part can never make this route report failure</dd>
          <dt>If it fails</dt><dd>Cache-clearing still happens even if the email step throws an error — that's a deliberate design choice, not luck</dd>
        </dl>
      </div>

      <div class="group-label">lib/ — the helpers every route shares</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>File</th><th>What it does</th><th>Who calls it</th></tr></thead>
          <tbody>
            <tr><td class="mono">src/lib/db.ts</td><td>The one connection to the Neon database</td><td class="muted">Every newsletter API route, and only those</td></tr>
            <tr><td class="mono">src/lib/rate-limit.ts</td><td>The shared "too many requests" counter, backed by Upstash</td><td class="muted">Contact form + newsletter subscribe</td></tr>
            <tr><td class="mono">src/lib/email/template.ts</td><td>The one email design every outgoing email uses — logo, light background, brand blue button</td><td class="muted">Contact auto-reply, newsletter confirm email, post-notification email</td></tr>
            <tr><td class="mono">src/lib/email/disposable.ts</td><td>A list of throwaway email domains (like 10-minute-mail services) to reject at signup</td><td class="muted">Newsletter subscribe</td></tr>
            <tr><td class="mono">src/lib/newsletter/notify.ts</td><td>The whole blog-publish notification: claims the post so it can't double-send, fetches it, emails every confirmed subscriber in batches of 100</td><td class="muted">revalidate + test-send</td></tr>
            <tr><td class="mono">src/lib/blog/wordpress.ts</td><td>Fetches and reshapes posts from WordPress's API into the format every page expects</td><td class="muted">Every blog page</td></tr>
            <tr><td class="mono">src/lib/schema.ts</td><td>The shared "facts about the business" block search engines and AI systems read</td><td class="muted">Every page's invisible SEO data</td></tr>
            <tr><td class="mono">src/lib/tokens.ts</td><td>The single list of allowed spacing, colour and animation values — nothing on the site uses a one-off value outside this file</td><td class="muted">Every component</td></tr>
          </tbody>
        </table>
      </div>

      <div class="group-label">Components + config, briefly</div>
      <div class="prose">
        <p><strong>src/components/</strong> — every visual building block (buttons, the navbar, the footer, the newsletter sign-up form) lives here, organised roughly one folder per page. <strong>src/components/newsletter/SubscribeForm.tsx</strong> is the one form that appears in two places — the footer and under every blog post — so it only had to be built once.</p>
        <p><strong>next.config.ts</strong> — tells Vercel which external image sources are trusted (WordPress's media library, Gravatar), sets a handful of security headers, and fixes one old link (<code class="mono">/blog</code> → <code class="mono">/blogs/</code>).</p>
        <p><strong>package.json</strong> — the real dependency list: Next.js 16, React 19, Framer Motion (animation), Resend (email), the Neon and Upstash database/cache libraries, and Tailwind CSS v4 for styling.</p>
      </div>
    </section>

    <!-- ============ 6. THE DATABASE ============ -->
    <section class="chapter wide" id="database">
      <span class="kicker">● Section 6</span>
      <h2>The database</h2>
      <p class="lede">Two tables, live in Neon right now. Every column below was checked directly against the real database for this handbook.</p>

      <h3>subscribers</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Column</th><th>Type</th><th>What it holds</th><th>Sample value</th></tr></thead>
          <tbody>
            <tr><td class="mono">id</td><td class="mono muted">uuid</td><td>A unique internal ID for the row</td><td class="mono muted">3f2a91c4-…</td></tr>
            <tr><td class="mono">email</td><td class="mono muted">text</td><td>The subscriber's address</td><td class="mono muted">dr.sample@example.com</td></tr>
            <tr><td class="mono">status</td><td class="mono muted">text</td><td>Where they are in the opt-in flow</td><td class="mono muted">'pending' · 'confirmed' · 'unsubscribed'</td></tr>
            <tr><td class="mono">token</td><td class="mono muted">text</td><td>Their private confirm/unsubscribe key — never shown on any page</td><td class="mono muted">(hidden — see Rule 0)</td></tr>
            <tr><td class="mono">source</td><td class="mono muted">text</td><td>Which form they signed up through</td><td class="mono muted">'footer' · 'blog-post'</td></tr>
            <tr><td class="mono">ip_hash</td><td class="mono muted">text</td><td>A scrambled (unreadable) version of their signup IP, for abuse tracking only</td><td class="mono muted">a1b2c3…</td></tr>
            <tr><td class="mono">created_at</td><td class="mono muted">timestamptz</td><td>When they signed up</td><td class="mono muted">2026-08-26 06:44</td></tr>
            <tr><td class="mono">confirmed_at</td><td class="mono muted">timestamptz</td><td>When they clicked confirm</td><td class="mono muted">2026-08-26 06:47</td></tr>
            <tr><td class="mono">unsubscribed_at</td><td class="mono muted">timestamptz</td><td>When (if ever) they left</td><td class="mono muted">null</td></tr>
          </tbody>
        </table>
      </div>

      <h3>sent_posts</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Column</th><th>Type</th><th>What it holds</th><th>Sample value</th></tr></thead>
          <tbody>
            <tr><td class="mono">post_slug</td><td class="mono muted">text (primary key)</td><td>The post's URL slug — also the duplicate-send guard</td><td class="mono muted">why-ai-search-matters</td></tr>
            <tr><td class="mono">sent_at</td><td class="mono muted">timestamptz</td><td>When the notification run happened</td><td class="mono muted">2026-08-26 09:12</td></tr>
            <tr><td class="mono">recipient_count</td><td class="mono muted">integer</td><td>How many people were actually emailed</td><td class="mono muted">2</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Questions you'd realistically ask it</h3>
      <div class="prose">
        <p><strong>"How many confirmed subscribers do I have?"</strong> — count the rows in <code class="mono">subscribers</code> where status equals 'confirmed'.</p>
        <p><strong>"Did last week's post actually get emailed out?"</strong> — look up that post's slug in <code class="mono">sent_posts</code>; if there's no row, it never sent.</p>
        <p><strong>"How many people unsubscribed this month?"</strong> — count rows in <code class="mono">subscribers</code> where <code class="mono">unsubscribed_at</code> falls in that month.</p>
        <p><strong>"Is anyone stuck never confirming?"</strong> — count rows where status is still 'pending' after more than a few days — a sign the confirmation email might not be arriving.</p>
      </div>
    </section>

    <!-- ============ 7. WHEN SOMETHING BREAKS ============ -->
    <section class="chapter wide" id="breaks">
      <span class="kicker">● Section 7</span>
      <h2>When something breaks</h2>
      <p class="lede">Written in the words you'd actually use, not the technical name for the problem.</p>

      <div class="table-wrap">
        <table>
          <thead><tr><th>What you'd notice</th><th>Most likely cause</th><th>How to check</th><th>How to fix</th></tr></thead>
          <tbody>
            <tr><td>Contact form emails aren't arriving</td><td class="muted">Missing/expired Resend key, or Resend account issue</td><td class="muted">Vercel → your project → Settings → Environment Variables → confirm RESEND_API_KEY is set for Production</td><td class="muted">Add or refresh the key at resend.com → API Keys, redeploy</td></tr>
            <tr><td>My emails land in spam</td><td class="muted">SPF/DKIM/DMARC misconfigured, or DMARC still in monitor-only mode</td><td class="muted">mail-tester.com — send a test email and read the score</td><td class="muted">Compare against Table B in Section 4; fix any record that doesn't match</td></tr>
            <tr><td>A new blog post isn't showing on the site</td><td class="muted">The 1-hour cache hasn't refreshed yet, or the publish webhook never fired (Phase 9)</td><td class="muted">Wait an hour and recheck; if it still hasn't appeared, that's real</td><td class="muted">Call <code class="mono">POST /api/revalidate?secret=…</code> yourself with that post's slug</td></tr>
            <tr><td>Contact form says "check the highlighted fields" but they look fine</td><td class="muted">A field genuinely fails validation (name too short, message too short, bad email format)</td><td class="muted">Re-read each field against the rule</td><td class="muted">Fix the field — this is working as designed, not a bug</td></tr>
            <tr><td>Newsletter confirmation emails aren't arriving</td><td class="muted">Same as contact-form email issues, or the address bounced/was rejected</td><td class="muted">Same as above — check RESEND_API_KEY first</td><td class="muted">Same fix; also check Resend's own dashboard for a bounce</td></tr>
            <tr><td>A new post didn't trigger any notification email</td><td class="muted">The publish webhook not confirmed (Phase 9), or zero confirmed subscribers, or it already sent once</td><td class="muted">Vercel → Logs → search "newsletter" — the result of every attempt is logged</td><td class="muted">Use <code class="mono">/api/newsletter/test-send</code> to prove the email itself works, independent of the trigger</td></tr>
            <tr><td>"Database error" or a newsletter route returns a server error</td><td class="muted">DATABASE_URL missing, wrong, or the Neon project is paused/deleted</td><td class="muted">console.neon.tech — confirm the project is active</td><td class="muted">Re-copy the connection string, update Vercel, redeploy</td></tr>
            <tr><td><code class="mono">npm run build</code> fails on your machine</td><td class="muted">A real code error, or out-of-date dependencies after switching machines</td><td class="muted">Read the actual error text — it names the file</td><td class="muted">Run <code class="mono">npm install</code> first; if it still fails, paste the error into Claude Code</td></tr>
            <tr><td>The whole site is down</td><td class="muted">A bad deploy, or Vercel/the domain itself has an issue</td><td class="muted">Vercel → Deployments — is the latest one marked "Ready" or "Error"?</td><td class="muted">Vercel → Deployments → previous good one → <strong>Instant Rollback</strong> (10 seconds)</td></tr>
            <tr><td>You pushed a change but the live site looks unchanged</td><td class="muted">Vercel served a stale cached build</td><td class="muted">Vercel → Deployments → confirm a new one actually ran</td><td class="muted">Redeploy with "Use existing Build Cache" <strong>unticked</strong></td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ============ 8. THE ROUTINES ============ -->
    <section class="chapter" id="routines">
      <span class="kicker">● Section 8</span>
      <h2>The routines</h2>
      <p class="lede">Copy-pasteable, step by step, for the things you'll actually do again and again.</p>

      <div class="routine">
        <h4>🔁 Switching between the Ritik PC and the Rahul PC</h4>
        <ol class="steps">
          <li><strong>Before you stop working</strong> on whichever machine you're on: <code>git push</code> — don't just commit, actually send it to GitHub.</li>
          <li>On the machine you're switching to: <code>cd</code> into the project folder.</li>
          <li>Run <code>git pull</code>.</li>
          <li>Run <code>npm install</code> (picks up any new dependencies).</li>
          <li>Run <code>git status -sb</code> — it must say you're up to date with <code>origin/main</code>. If it doesn't, stop and pull again before touching anything.</li>
        </ol>
      </div>

      <div class="routine">
        <h4>📝 Publishing a blog post — what happens automatically</h4>
        <ol class="steps">
          <li>Write and click Publish, as normal, inside WordPress.</li>
          <li>WordPress is meant to ping <code>/api/revalidate</code> immediately — not yet confirmed firing, see Section 7.</li>
          <li>Either way, the site's 1-hour fallback guarantees the post appears within an hour even if that ping never arrives.</li>
          <li>The moment the site's cache clears, every confirmed newsletter subscriber gets emailed about the new post automatically.</li>
          <li>Nothing else needs touching — this is the entire point of the headless setup.</li>
        </ol>
      </div>

      <div class="routine">
        <h4>🔑 Adding a new environment variable, end to end</h4>
        <ol class="steps">
          <li>Vercel → your project → Settings → Environment Variables.</li>
          <li>Add the name and value — <strong>tick Production, Preview, and Development all three</strong> (the Section 4 trap).</li>
          <li>Redeploy — an env-var change doesn't apply to a deployment that already ran.</li>
          <li>On your local machine: <code>vercel env pull .env.local --yes</code> — updates the copy on disk.</li>
          <li>Never paste the actual value into a chat, a doc, or a commit — only ever into these two places.</li>
        </ol>
      </div>

      <div class="routine">
        <h4>🚀 Deploying a change</h4>
        <ol class="steps">
          <li>Make the change (yourself, or via Claude Code).</li>
          <li>Confirm <code>npm run build</code> passes with no red errors.</li>
          <li><code>git add</code>, <code>git commit</code> with a real message.</li>
          <li><code>git push</code> — this is the actual "go live" moment; Vercel deploys automatically from here.</li>
          <li>Open the live site and check the specific thing you changed.</li>
        </ol>
      </div>

      <div class="routine">
        <h4>📬 Reading your leads</h4>
        <ol class="steps">
          <li>Contact-form submissions land as an email to ritik@ (or contact@) — check that inbox first, always.</li>
          <li>Reply directly from there — the auto-reply already told the visitor you'll respond within one business day.</li>
        </ol>
      </div>

      <div class="routine">
        <h4>✉️ Sending a test newsletter before the real one</h4>
        <ol class="steps">
          <li>Call <code>POST /api/newsletter/test-send?secret=…</code> with a real published post's slug and your own email address.</li>
          <li>Open what arrives — check the subject, the logo, and that the "Read the post" button goes to <code>boostwebdigital.com/blog/…</code>, not the WordPress domain.</li>
          <li>This never touches the real subscriber list or the sent-posts record — safe to run as many times as you like.</li>
        </ol>
      </div>

      <div class="routine">
        <h4>🔐 Rotating a leaked key</h4>
        <ol class="steps">
          <li>Go to that service's dashboard (Resend, Neon, Upstash, whichever leaked) and generate a new key/password.</li>
          <li>Update it in Vercel → Environment Variables, for all three environments.</li>
          <li>Update your local <code>.env.local</code> via <code>vercel env pull .env.local --yes</code>.</li>
          <li>Redeploy.</li>
          <li>Revoke/delete the old key at the source, once you've confirmed the new one works.</li>
        </ol>
      </div>
    </section>

    <!-- ============ 9. IF YOU HAD TO REBUILD IT ============ -->
    <section class="chapter" id="rebuild">
      <span class="kicker">● Section 9</span>
      <h2>If you had to rebuild it from zero</h2>
      <p class="lede">Your insurance policy. The order to create every account in, so nothing depends on something that doesn't exist yet.</p>

      <ol class="rebuild-list">
        <li>Register the domain at Namecheap.</li>
        <li>Create a GitHub account and a private repository for the code.</li>
        <li>Create a Vercel account, connect it to that GitHub repository, deploy once (it'll be broken — that's fine, it proves the pipe works).</li>
        <li>Point Namecheap's DNS at Vercel for the root domain.</li>
        <li>Set up Google Workspace, verify it with the MX record Namecheap needs.</li>
        <li>Create a Resend account, verify a sending subdomain (this project uses <code class="mono">send.</code>), add its SPF/DKIM/MX records to Namecheap.</li>
        <li>Create a Neon account and a database — copy its connection string into Vercel as <code class="mono">DATABASE_URL</code>.</li>
        <li>Create an Upstash Redis database — copy its two values into Vercel.</li>
        <li>Set up Hostinger, install WordPress, point <code class="mono">blog.</code> at it in Namecheap.</li>
        <li>Add every environment variable from Section 4, Table A, into Vercel — all three environments.</li>
        <li>Create a Google Analytics 4 property, add its ID.</li>
        <li>Verify the domain in Google Search Console and submit the sitemap.</li>
        <li>Redeploy — everything should now actually work end to end.</li>
      </ol>
    </section>

    <!-- ============ 10. THE WORDS ============ -->
    <section class="chapter wide" id="words">
      <span class="kicker">● Section 10</span>
      <h2>The words</h2>
      <p class="lede">Every technical term used anywhere in this handbook, defined once, in plain English.</p>

      <dl class="glossary-grid">
        <div class="g-term"><dt>DNS</dt><dd>The internet's phonebook — turns a name like boostwebdigital.com into the actual address of a server.</dd></div>
        <div class="g-term"><dt>MX record</dt><dd>The specific phonebook entry that says "mail for this domain goes here." Missing it means mail bounces — it does not queue and wait.</dd></div>
        <div class="g-term"><dt>SPF</dt><dd>A public list of who's allowed to send email as your domain — like a list of couriers approved to deliver in your name.</dd></div>
        <div class="g-term"><dt>DKIM</dt><dd>A digital seal on an email proving it wasn't altered in transit — like a wax seal on an envelope.</dd></div>
        <div class="g-term"><dt>DMARC</dt><dd>The instruction for what to do when SPF or DKIM fails — ignore it, quarantine it, or reject it outright.</dd></div>
        <div class="g-term"><dt>API</dt><dd>A fixed way for two pieces of software to talk to each other — like a restaurant menu: fixed options, predictable results.</dd></div>
        <div class="g-term"><dt>API route</dt><dd>A URL on your own site that does something instead of showing a page — e.g. <code class="mono">/api/contact</code> sends an email, it doesn't display anything.</dd></div>
        <div class="g-term"><dt>Environment variable</dt><dd>A setting or secret the code reads at run time instead of having it typed directly into the code — so the same code can use different keys in different places.</dd></div>
        <div class="g-term"><dt>Serverless</dt><dd>Your code doesn't run on one fixed machine — every visit might be handled by a different, temporary one. Great for cost, but it means nothing can be "remembered in memory" between requests.</dd></div>
        <div class="g-term"><dt>Cache</dt><dd>A saved copy kept around so the real, slower source doesn't have to be re-fetched every single time.</dd></div>
        <div class="g-term"><dt>Revalidation</dt><dd>Deliberately throwing away a cached copy so the next visitor gets a fresh one.</dd></div>
        <div class="g-term"><dt>Webhook</dt><dd>One system automatically pinging another the moment something happens — WordPress publishing a post is meant to ping this site directly, instead of the site having to keep checking.</dd></div>
        <div class="g-term"><dt>Rate limiting</dt><dd>Capping how many times something can happen in a given time — protects your capacity to handle real customers, not inbox tidiness.</dd></div>
        <div class="g-term"><dt>Honeypot</dt><dd>An invisible form field a real person never sees or fills in — only an automated bot filling in every field trips it.</dd></div>
        <div class="g-term"><dt>Double opt-in</dt><dd>Type your email, then click a confirm link — only then are you actually subscribed. Stops someone signing up an address that isn't theirs.</dd></div>
        <div class="g-term"><dt>Enumeration</dt><dd>Using a form's response to figure out private information — e.g. a different message for "already subscribed" vs "new" would let anyone test who's on your list. This site always replies identically.</dd></div>
        <div class="g-term"><dt>Fail open</dt><dd>When a safety system breaks, it lets everything through rather than blocking everyone — a broken lock left open, not welded shut.</dd></div>
        <div class="g-term"><dt>Idempotent</dt><dd>Running it twice changes nothing beyond the first time — like a light switch that's already on staying on.</dd></div>
        <div class="g-term"><dt>Headless CMS</dt><dd>A content system (WordPress here) used purely for its writing tools and storage — its own visual theme is switched off entirely, and another site (this one) displays the content instead.</dd></div>
        <div class="g-term"><dt>ISR (Incremental Static Regeneration)</dt><dd>Next.js quietly rebuilding one page in the background on a schedule, instead of the whole site — this project's 1-hour blog fallback is a form of it.</dd></div>
        <div class="g-term"><dt>Schema markup</dt><dd>An invisible block of structured facts about your business embedded in a page's code, written for machines (Google, ChatGPT) to read, not for a human visitor to see.</dd></div>
        <div class="g-term"><dt>Repository ("repo")</dt><dd>The whole project's code and its full history, in one place — this project's lives on GitHub.</dd></div>
        <div class="g-term"><dt>Commit</dt><dd>Saving a labelled snapshot of your changes — but only on your own machine, not sent anywhere yet.</dd></div>
        <div class="g-term"><dt>Push</dt><dd>Sending your saved commits up to GitHub, where Vercel can see and deploy them.</dd></div>
        <div class="g-term"><dt>Pull</dt><dd>Downloading whatever changes exist on GitHub that your own machine doesn't have yet.</dd></div>
        <div class="g-term"><dt>Merge conflict</dt><dd>Two people (or two machines) changed the exact same lines differently — Git refuses to guess which version you meant, and asks a human to decide.</dd></div>
        <div class="g-term"><dt>Branch</dt><dd>A separate, safe parallel copy of the code to experiment on — your main, live version stays untouched until you decide to merge it back in.</dd></div>
        <div class="g-term"><dt>Batch send</dt><dd>Sending many emails in one request to Resend instead of one at a time — faster, and how the blog-notification system emails every subscriber.</dd></div>
        <div class="g-term"><dt>Token</dt><dd>A long random string used as a private key — this site's newsletter tokens identify a subscriber's confirm/unsubscribe link without ever using their email in the URL.</dd></div>
      </dl>
    </section>

    <!-- ============ 11. WHAT I'D DO NEXT ============ -->
    <section class="chapter" id="next">
      <span class="kicker">● Section 11</span>
      <h2>What I'd do next</h2>
      <p class="lede">My honest opinion, ranked, having read the actual code and configuration rather than the plan for it.</p>

      <div class="rank-list">
        <div class="rank-item">
          <span class="rank-num">1</span>
          <div>
            <h4>Confirm the WordPress → revalidate webhook is really firing</h4>
            <p>Right now the entire blog-publish notification system — the one you just finished building — is running on an unproven connection. <code class="mono">docs/08-CMS.md</code> says outright "the route exists; nothing calls it yet." The 1-hour fallback is hiding the problem from you: the blog LOOKS instant because of it, so a silently-broken webhook could go unnoticed indefinitely. This is a 15-minute check (publish a real post, watch Vercel's logs for a hit on <code class="mono">/api/revalidate</code> within seconds) that closes the single biggest unknown in the whole system.</p>
          </div>
        </div>
        <div class="rank-item">
          <span class="rank-num">2</span>
          <div>
            <h4>Fix the Development-environment Upstash placeholder</h4>
            <p>Confirmed directly this session: rate limiting is silently disabled whenever you or Claude Code test locally, because the Development copy of <code class="mono">UPSTASH_REDIS_REST_URL</code> in Vercel is a placeholder, not a real value. It fails open by design, so nothing looks broken — but it means local testing has never actually exercised the real rate-limit path. Five minutes in Upstash's dashboard fixes it.</p>
          </div>
        </div>
        <div class="rank-item">
          <span class="rank-num">3</span>
          <div>
            <h4>Either wire up Microsoft Clarity, or stop claiming you have it</h4>
            <p>Your own privacy and cookie policy pages tell visitors their session behaviour is tracked by "Microsoft Clarity and/or Hotjar." No such script exists anywhere in the code — only Google Analytics is actually wired in. This is a small thing to build (Clarity is free and it's a five-minute install) but right now the policy is disclosing a capability you don't have, which is exactly the kind of gap worth closing before it's ever noticed by someone other than you.</p>
          </div>
        </div>
      </div>

      <p class="prose" style="margin-top:26px; font-size:0.88rem; color:var(--muted);">
        Smaller things worth a look when you have time: only 1 of 9 real pages is indexed in Search Console per the last session's notes — worth re-checking and, if still true, submitting the sitemap and requesting indexing manually; and the DMARC record is in monitor-only mode (<code class="mono">p=none</code>), which is a safe starting point but not yet real protection against someone spoofing your domain.
      </p>
    </section>

    <footer class="end">
      Built from the real project — code, configuration, git history, and live DNS lookups — on 27 August 2026.
      No invented numbers, no invented features. Where something couldn't be verified, it says so.
    </footer>

  </main>
</div>
`;

const SCRIPT_JS = `
  (function () {
    var toggle = document.getElementById('navToggle');
    var sidebar = document.getElementById('sidebar');
    if (toggle) {
      toggle.addEventListener('click', function () {
        sidebar.classList.toggle('open');
      });
    }

    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
    var sections = links
      .map(function (l) { return document.querySelector(l.getAttribute('href')); })
      .filter(Boolean);

    function setActive() {
      var scrollPos = window.scrollY + 120;
      var current = sections[0];
      sections.forEach(function (sec) {
        if (sec.offsetTop <= scrollPos) current = sec;
      });
      links.forEach(function (l) {
        l.classList.toggle('active', l.getAttribute('href') === '#' + current.id);
      });
    }

    window.addEventListener('scroll', setActive, { passive: true });
    setActive();

    links.forEach(function (l) {
      l.addEventListener('click', function () {
        if (window.innerWidth <= 980) sidebar.classList.remove('open');
      });
    });
  })();
`;

export default function HandbookPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: BODY_HTML }} />
      <script dangerouslySetInnerHTML={{ __html: SCRIPT_JS }} />
    </>
  );
}
