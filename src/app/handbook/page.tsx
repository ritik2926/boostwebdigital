import type { Metadata } from "next";

// Internal-only reference page — not part of the marketing site, deliberately
// unlinked from Navbar/Footer and excluded from sitemap.ts. Kept out of search
// results and off-limits to crawlers via robots.ts's Disallow line, with
// noindex here too as a second layer for any crawler that ignores robots.txt.
//
// Typography deliberately uses the site's own real fonts — var(--font-switzer)
// and var(--font-geist-mono) — instead of loading anything new. Both are
// already applied to <body> by the root layout (see src/app/layout.tsx), so
// no font-loading code is needed here at all. Note this is NOT the same as
// referencing globals.css's --font-display/--font-mono: those live inside a
// Tailwind v4 `@theme inline` block, which globals.css's own comment on
// `body` explains never emits a real runtime CSS variable — only the raw
// next/font variable names do.
export const metadata: Metadata = {
  title: "Systems Handbook",
  robots: { index: false, follow: false },
};

const BODY_HTML = `
<style>
  :root {
    --bg: #f5f6fa;
    --bg-alt: #ececf4;
    --surface: #ffffff;
    --surface-2: #f0f1f7;
    --border: #dee1ec;
    --border-strong: #c7cce0;
    --ink: #1a1c2b;
    --muted: #5c6178;
    --faint: #8a8fa3;
    --accent: #3b4fdb;
    --accent-ink: #ffffff;
    --accent-tint: #e9ebfa;
    --ok: #147a4d;
    --ok-tint: #e2f4ea;
    --warn: #966209;
    --warn-tint: #faf1dc;
    --todo: #6a6f85;
    --todo-tint: #ebedf4;
    --danger: #ad3939;
    --danger-tint: #f8e7e7;
    --shadow: 0 1px 2px rgba(24, 28, 55, 0.04), 0 10px 28px -14px rgba(24, 28, 55, 0.14);
    --radius: 14px;
    --font-display: var(--font-switzer), 'Segoe UI', Arial, sans-serif;
    --font-mono: var(--font-geist-mono), 'Consolas', monospace;
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --bg: #15161f; --bg-alt: #1a1b26; --surface: #1e202c; --surface-2: #242634;
      --border: #313349; --border-strong: #3e4159; --ink: #eef0f8; --muted: #a7abc4;
      --faint: #797d99; --accent: #8291ff; --accent-ink: #10122a; --accent-tint: #262b52;
      --ok: #4dd095; --ok-tint: #1a3329; --warn: #e3ac52; --warn-tint: #3a2f16;
      --todo: #9aa0bd; --todo-tint: #262838; --danger: #ea837f; --danger-tint: #3a2020;
    }
  }
  :root[data-theme="dark"] {
    --bg: #15161f; --bg-alt: #1a1b26; --surface: #1e202c; --surface-2: #242634;
    --border: #313349; --border-strong: #3e4159; --ink: #eef0f8; --muted: #a7abc4;
    --faint: #797d99; --accent: #8291ff; --accent-ink: #10122a; --accent-tint: #262b52;
    --ok: #4dd095; --ok-tint: #1a3329; --warn: #e3ac52; --warn-tint: #3a2f16;
    --todo: #9aa0bd; --todo-tint: #262838; --danger: #ea837f; --danger-tint: #3a2020;
  }

  .hb * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  .hb {
    background: var(--bg); color: var(--ink); font-family: var(--font-display);
    font-size: 17px; line-height: 1.65; -webkit-font-smoothing: antialiased;
  }
  .hb ::selection { background: var(--accent-tint); color: var(--ink); }
  .hb h1, .hb h2, .hb h3, .hb h4 { font-family: var(--font-display); font-weight: 800; text-wrap: balance; margin: 0; color: var(--ink); }
  .hb p { margin: 0; }
  .hb a { color: var(--accent); text-decoration: none; }
  .hb a:hover { text-decoration: underline; }
  .hb code, .hb .mono { font-family: var(--font-mono); }
  .hb :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 3px; }

  .hb-shell { display: grid; grid-template-columns: 272px minmax(0, 1fr); min-height: 100vh; }
  @media (max-width: 980px) { .hb-shell { grid-template-columns: 1fr; } }

  .hb-sidebar { position: sticky; top: 0; height: 100vh; overflow-y: auto; padding: 30px 20px 40px; border-right: 1px solid var(--border); background: var(--bg-alt); }
  @media (max-width: 980px) {
    .hb-sidebar { position: static; height: auto; border-right: none; border-bottom: 1px solid var(--border); padding: 18px 20px; }
    .hb-sidebar-nav { display: none; }
    .hb-sidebar.open .hb-sidebar-nav { display: block; margin-top: 16px; }
  }

  .hb-brand { display: flex; align-items: center; gap: 11px; margin-bottom: 3px; }
  .hb-brand-mark { width: 32px; height: 32px; border-radius: 9px; background: var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .hb-brand-mark svg { width: 17px; height: 17px; }
  .hb-brand-name { font-weight: 800; font-size: 1rem; letter-spacing: -0.01em; }
  .hb-brand-sub { font-size: 0.78rem; color: var(--faint); margin: 3px 0 24px 43px; }

  .hb-nav-toggle { display: none; width: 100%; justify-content: space-between; align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 9px; padding: 11px 14px; font-family: var(--font-display); font-weight: 700; font-size: 0.9rem; color: var(--ink); cursor: pointer; }
  @media (max-width: 980px) { .hb-nav-toggle { display: flex; } }

  .hb-sidebar-nav { display: flex; flex-direction: column; gap: 1px; }
  .hb-nav-group-label { font-weight: 700; font-size: 0.72rem; letter-spacing: 0.04em; text-transform: uppercase; color: var(--faint); margin: 18px 0 7px 11px; }
  .hb-nav-group-label:first-child { margin-top: 4px; }
  .hb-nav-link { display: flex; align-items: baseline; gap: 9px; padding: 8px 11px; border-radius: 8px; font-size: 0.87rem; color: var(--muted); font-weight: 600; border-left: 2px solid transparent; }
  .hb-nav-link:hover { background: var(--surface); color: var(--ink); text-decoration: none; }
  .hb-nav-link.hb-active { background: var(--surface); color: var(--accent); border-left-color: var(--accent); }
  .hb-nav-num { font-family: var(--font-mono); font-size: 0.72rem; color: var(--faint); width: 18px; flex-shrink: 0; }

  .hb-main { min-width: 0; }
  .hb-chapter { max-width: 880px; margin: 0 auto; padding: 68px 30px 24px; scroll-margin-top: 24px; }
  .hb-chapter.hb-wide { max-width: 1100px; }
  .hb-chapter + .hb-chapter { border-top: 1px solid var(--border); padding-top: 60px; }

  .hb-kicker { display: inline-flex; align-items: center; gap: 7px; font-weight: 700; font-size: 0.78rem; letter-spacing: 0.03em; color: var(--accent); margin-bottom: 14px; }
  .hb-chapter h2 { font-size: clamp(1.55rem, 1.1rem + 1.7vw, 2.15rem); line-height: 1.15; letter-spacing: -0.015em; }
  .hb-chapter .hb-lede { margin-top: 15px; font-size: 1.08rem; color: var(--muted); max-width: 66ch; line-height: 1.65; }
  .hb-chapter h3 { font-size: 1.2rem; margin-top: 42px; margin-bottom: 15px; letter-spacing: -0.01em; }
  .hb-chapter h3:first-of-type { margin-top: 34px; }
  .hb-prose { max-width: 68ch; color: var(--ink); }
  .hb-prose p + p, .hb-prose ul + p, .hb-prose p + ul { margin-top: 13px; }
  .hb-prose ul { padding-left: 20px; margin: 10px 0; }
  .hb-prose li + li { margin-top: 7px; }
  .hb-prose strong { font-weight: 700; }

  .hb-hero { padding-top: 44px; }
  .hb-hero h1 { font-size: clamp(2.1rem, 1.3rem + 3.2vw, 3.2rem); line-height: 1.06; letter-spacing: -0.02em; }
  .hb-hero .hb-lede { font-size: 1.18rem; margin-top: 20px; }
  .hb-hero-meta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
  .hb-meta-chip { display: inline-flex; align-items: center; gap: 7px; padding: 7px 13px; background: var(--surface); border: 1px solid var(--border); border-radius: 999px; font-size: 0.82rem; color: var(--muted); font-weight: 600; }
  .hb-meta-chip .hb-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ok); }
  .hb-howto { margin-top: 32px; padding: 18px 22px; background: var(--accent-tint); border-radius: var(--radius); border: 1px solid var(--border); font-size: 0.96rem; color: var(--ink); max-width: 68ch; line-height: 1.6; }
  .hb-howto strong { color: var(--accent); }

  .hb-status { display: inline-flex; align-items: center; gap: 6px; padding: 4px 11px 4px 9px; border-radius: 999px; font-size: 0.76rem; font-weight: 700; white-space: nowrap; }
  .hb-status .hb-dot { width: 7px; height: 7px; border-radius: 50%; }
  .hb-status.hb-ok { background: var(--ok-tint); color: var(--ok); }
  .hb-status.hb-ok .hb-dot { background: var(--ok); }
  .hb-status.hb-warn { background: var(--warn-tint); color: var(--warn); }
  .hb-status.hb-warn .hb-dot { background: var(--warn); }
  .hb-status.hb-todo { background: var(--todo-tint); color: var(--todo); }
  .hb-status.hb-todo .hb-dot { background: var(--todo); }

  /* ---- progress tracker infographic ---- */
  .hb-track-wrap { overflow-x: auto; margin-top: 32px; padding-bottom: 6px; }
  .hb-track { display: flex; min-width: 900px; gap: 0; }
  .hb-step { flex: 1; position: relative; padding-top: 4px; }
  .hb-step-line { position: absolute; top: 24px; left: -50%; width: 100%; height: 3px; background: var(--border-strong); z-index: 0; }
  .hb-step:first-child .hb-step-line { display: none; }
  .hb-step.hb-done .hb-step-line { background: var(--ok); }
  .hb-step.hb-progress .hb-step-line { background: linear-gradient(to right, var(--ok), var(--warn)); }
  .hb-step-node { position: relative; z-index: 1; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; background: var(--surface); border: 3px solid var(--border-strong); margin: 0 auto; }
  .hb-step.hb-done .hb-step-node { border-color: var(--ok); background: var(--ok-tint); }
  .hb-step.hb-progress .hb-step-node { border-color: var(--warn); background: var(--warn-tint); }
  .hb-step-num { text-align: center; font-family: var(--font-mono); font-size: 0.72rem; color: var(--faint); margin-top: 10px; font-weight: 700; }
  .hb-step-title { text-align: center; font-weight: 700; font-size: 0.92rem; margin-top: 3px; padding: 0 8px; }
  .hb-step-body { text-align: center; font-size: 0.8rem; color: var(--muted); margin-top: 5px; padding: 0 10px; line-height: 1.5; }
  .hb-step-status { display: flex; justify-content: center; margin-top: 8px; }

  .hb-diagram-wrap { overflow-x: auto; margin-top: 28px; padding-bottom: 8px; }
  .hb-diagram { min-width: 760px; }
  .hb-diagram-legend { display: flex; flex-wrap: wrap; gap: 18px; margin-top: 18px; font-size: 0.83rem; color: var(--muted); }
  .hb-diagram-legend span { display: inline-flex; align-items: center; gap: 6px; }
  .hb-legend-line { width: 22px; height: 2px; display: inline-block; }

  .hb-box-jobs { margin-top: 32px; display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 11px; }
  .hb-box-job { padding: 13px 15px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; font-size: 0.87rem; }
  .hb-box-job b { font-weight: 800; display: block; margin-bottom: 3px; font-size: 0.9rem; }
  .hb-box-job span { color: var(--muted); }

  .hb-timeline { margin-top: 32px; position: relative; }
  .hb-timeline::before { content: ""; position: absolute; left: 15px; top: 6px; bottom: 6px; width: 2px; background: var(--border-strong); }
  .hb-t-phase { position: relative; padding: 0 0 34px 48px; }
  .hb-t-phase:last-child { padding-bottom: 0; }
  .hb-t-phase::before { content: ""; position: absolute; left: 8px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: var(--surface); border: 3px solid var(--accent); }
  .hb-t-phase .hb-t-num { font-weight: 800; font-size: 0.78rem; color: var(--accent); letter-spacing: 0.02em; }
  .hb-t-phase h4 { font-size: 1.05rem; margin-top: 4px; }
  .hb-t-phase .hb-t-body { color: var(--muted); font-size: 0.92rem; margin-top: 7px; max-width: 64ch; line-height: 1.6; }
  .hb-t-commits { margin-top: 9px; display: flex; flex-wrap: wrap; gap: 5px; }
  .hb-t-commit { font-family: var(--font-mono); font-size: 0.7rem; padding: 2px 8px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; color: var(--faint); }
  .hb-t-note { margin-top: 9px; font-size: 0.86rem; padding: 10px 13px; border-radius: 9px; line-height: 1.55; }
  .hb-t-note.hb-warn { background: var(--warn-tint); color: var(--warn); }

  .hb-status-row { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  @media (max-width: 640px) { .hb-status-row { grid-template-columns: 1fr; } }
  .hb-status-block h4 { font-size: 0.98rem; margin-bottom: 12px; }
  .hb-status-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
  .hb-status-list li { display: flex; justify-content: space-between; align-items: center; gap: 10px; font-size: 0.87rem; padding: 9px 13px; background: var(--surface); border: 1px solid var(--border); border-radius: 9px; }

  .hb-card-grid { margin-top: 28px; display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 17px; }
  .hb-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 22px 22px 24px; box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 11px; }
  .hb-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
  .hb-card-head-icon { display: flex; align-items: center; gap: 10px; }
  .hb-card-icon { width: 34px; height: 34px; border-radius: 9px; background: var(--accent-tint); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
  .hb-card-head h4 { font-size: 1.05rem; }
  .hb-card-def { font-size: 0.88rem; color: var(--muted); line-height: 1.55; }
  .hb-card dl { margin: 4px 0 0; display: flex; flex-direction: column; gap: 10px; }
  .hb-card dl > div { display: flex; flex-direction: column; gap: 3px; }
  .hb-card dt { font-weight: 700; font-size: 0.78rem; color: var(--faint); }
  .hb-card dd { margin: 0; font-size: 0.88rem; color: var(--ink); line-height: 1.55; }
  .hb-card .hb-example { background: var(--accent-tint); border-radius: 9px; padding: 10px 12px; font-size: 0.85rem; color: var(--ink); line-height: 1.55; }
  .hb-card .hb-example b { color: var(--accent); }
  .hb-card .hb-flag { background: var(--warn-tint); color: var(--warn); border-radius: 9px; padding: 10px 12px; font-size: 0.82rem; line-height: 1.55; }
  .hb-card-envs { display: flex; flex-wrap: wrap; gap: 5px; }
  .hb-env-chip { font-family: var(--font-mono); font-size: 0.7rem; padding: 2px 8px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; color: var(--muted); }
  .hb-card a.hb-loginlink { font-size: 0.85rem; font-weight: 700; }

  .hb-table-wrap { overflow-x: auto; margin-top: 22px; border: 1px solid var(--border); border-radius: var(--radius); }
  .hb table { border-collapse: collapse; width: 100%; font-size: 0.87rem; min-width: 560px; }
  .hb thead th { text-align: left; font-weight: 700; font-size: 0.76rem; color: var(--faint); background: var(--surface-2); padding: 11px 15px; border-bottom: 1px solid var(--border); white-space: nowrap; }
  .hb tbody td { padding: 13px 15px; border-bottom: 1px solid var(--border); vertical-align: top; color: var(--ink); }
  .hb tbody tr:last-child td { border-bottom: none; }
  .hb tbody tr:hover { background: var(--surface-2); }
  .hb td.mono, .hb th.mono { font-family: var(--font-mono); font-size: 0.82rem; }
  .hb td.hb-muted { color: var(--muted); }
  .hb-tag { display: inline-block; font-family: var(--font-mono); font-size: 0.74rem; padding: 1px 8px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; color: var(--muted); }

  .hb-trap-box { margin-top: 26px; padding: 19px 22px; border-radius: var(--radius); background: var(--danger-tint); border: 1px solid color-mix(in srgb, var(--danger) 28%, var(--border)); }
  .hb-trap-box h4 { font-size: 0.98rem; color: var(--danger); margin-bottom: 9px; }
  .hb-trap-box p { font-size: 0.9rem; color: var(--ink); line-height: 1.58; }
  .hb-trap-box p + p { margin-top: 9px; }

  .hb-group-label { font-weight: 800; font-size: 0.86rem; color: var(--accent); margin-top: 38px; margin-bottom: 11px; display: flex; align-items: center; gap: 11px; }
  .hb-group-label::after { content: ""; flex: 1; height: 1px; background: var(--border); }
  .hb-group-label:first-of-type { margin-top: 32px; }

  .hb-route-card { border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); padding: 17px 19px; margin-top: 11px; }
  .hb-route-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .hb-route-method { font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; padding: 2px 9px; border-radius: 6px; }
  .hb-route-method.hb-get { background: var(--ok-tint); color: var(--ok); }
  .hb-route-method.hb-post { background: var(--accent-tint); color: var(--accent); }
  .hb-route-path { font-family: var(--font-mono); font-size: 0.88rem; font-weight: 700; }
  .hb-route-grid { margin-top: 11px; display: grid; grid-template-columns: 100px 1fr; gap: 7px 13px; font-size: 0.86rem; }
  .hb-route-grid dt { font-weight: 700; font-size: 0.76rem; color: var(--faint); padding-top: 2px; }
  .hb-route-grid dd { margin: 0; color: var(--ink); line-height: 1.55; }

  .hb-glossary-grid { margin-top: 26px; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 4px 24px; }
  .hb-g-term { padding: 12px 0; border-bottom: 1px solid var(--border); }
  .hb-g-term dt { font-family: var(--font-mono); font-weight: 700; font-size: 0.86rem; color: var(--ink); }
  .hb-g-term dd { margin: 4px 0 0; font-size: 0.85rem; color: var(--muted); line-height: 1.55; }

  .hb-rank-list { margin-top: 28px; display: flex; flex-direction: column; gap: 16px; }
  .hb-rank-item { display: flex; gap: 19px; padding: 19px 22px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
  .hb-rank-num { font-weight: 800; font-size: 1.7rem; color: var(--accent); flex-shrink: 0; line-height: 1.2; }
  .hb-rank-item h4 { font-size: 1.02rem; }
  .hb-rank-item p { font-size: 0.9rem; color: var(--muted); margin-top: 6px; line-height: 1.58; }

  .hb-routine { margin-top: 30px; }
  .hb-routine h4 { font-size: 1rem; display: flex; align-items: center; gap: 9px; }
  .hb-steps { counter-reset: hbstep; margin: 13px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0; }
  .hb-steps li { counter-increment: hbstep; position: relative; padding: 11px 0 11px 36px; font-size: 0.89rem; border-bottom: 1px dashed var(--border); }
  .hb-steps li:last-child { border-bottom: none; }
  .hb-steps li::before { content: counter(hbstep); position: absolute; left: 0; top: 10px; width: 23px; height: 23px; border-radius: 7px; background: var(--accent-tint); color: var(--accent); font-family: var(--font-mono); font-weight: 700; font-size: 0.74rem; display: flex; align-items: center; justify-content: center; }
  .hb-steps code { background: var(--surface-2); border: 1px solid var(--border); padding: 1px 6px; border-radius: 5px; font-size: 0.84rem; }

  .hb-rebuild-list { counter-reset: hbrb; margin: 26px 0 0; padding: 0; list-style: none; }
  .hb-rebuild-list li { counter-increment: hbrb; position: relative; padding: 13px 0 13px 42px; font-size: 0.92rem; border-bottom: 1px solid var(--border); line-height: 1.58; }
  .hb-rebuild-list li::before { content: counter(hbrb); position: absolute; left: 0; top: 13px; width: 25px; height: 25px; border-radius: 50%; background: var(--accent); color: var(--accent-ink); font-family: var(--font-mono); font-weight: 700; font-size: 0.76rem; display: flex; align-items: center; justify-content: center; }

  /* learned-topic cards */
  .hb-learn-group { margin-top: 36px; }
  .hb-learn-group:first-of-type { margin-top: 30px; }
  .hb-learn-head { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .hb-learn-icon { width: 40px; height: 40px; border-radius: 11px; background: var(--accent-tint); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0; }
  .hb-learn-head h3 { margin: 0; font-size: 1.15rem; }
  .hb-learn-count { font-size: 0.82rem; color: var(--faint); font-weight: 600; }
  .hb-learn-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
  .hb-learn-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 17px 19px; }
  .hb-learn-card dt { font-weight: 800; font-size: 0.95rem; margin-bottom: 6px; }
  .hb-learn-card dd { margin: 0; font-size: 0.87rem; color: var(--muted); line-height: 1.58; }
  .hb-learn-card .hb-real { margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--border); font-size: 0.84rem; color: var(--ink); line-height: 1.55; }
  .hb-learn-card .hb-real b { color: var(--accent); font-weight: 700; }

  /* next-skill connector cards */
  .hb-connect-list { margin-top: 28px; display: flex; flex-direction: column; gap: 16px; }
  .hb-connect-item { display: grid; grid-template-columns: 1fr 40px 1fr; align-items: center; gap: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px 22px; }
  @media (max-width: 700px) { .hb-connect-item { grid-template-columns: 1fr; text-align: left; } .hb-connect-arrow { transform: rotate(90deg); margin: 4px 0; } }
  .hb-connect-know { text-align: right; }
  @media (max-width: 700px) { .hb-connect-know { text-align: left; } }
  .hb-connect-eyebrow { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase; color: var(--faint); margin-bottom: 5px; }
  .hb-connect-title { font-weight: 800; font-size: 0.96rem; }
  .hb-connect-body { font-size: 0.85rem; color: var(--muted); margin-top: 4px; line-height: 1.5; }
  .hb-connect-arrow { font-size: 1.3rem; color: var(--accent); text-align: center; }
  .hb-connect-next .hb-connect-eyebrow { color: var(--accent); }

  .hb-end { max-width: 880px; margin: 40px auto 0; padding: 40px 30px 70px; color: var(--faint); font-size: 0.82rem; border-top: 1px solid var(--border); }

  .hb ::-webkit-scrollbar { width: 10px; height: 10px; }
  .hb ::-webkit-scrollbar-track { background: transparent; }
  .hb ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 6px; }

  @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
</style>

<div class="hb">
<div class="hb-shell">
  <aside class="hb-sidebar" id="hbSidebar">
    <div class="hb-brand">
      <span class="hb-brand-mark">
        <svg viewBox="0 0 24 24" fill="none"><path d="M4 20V10L12 4L20 10V20H14V14H10V20H4Z" stroke="white" stroke-width="2" stroke-linejoin="round"/></svg>
      </span>
      <span class="hb-brand-name">Systems Handbook</span>
    </div>
    <div class="hb-brand-sub">boostwebdigital.com</div>

    <button class="hb-nav-toggle" id="hbNavToggle">
      <span>Jump to a section</span>
      <span>▾</span>
    </button>

    <nav class="hb-sidebar-nav" id="hbSidebarNav">
      <div class="hb-nav-group-label">Start here</div>
      <a class="hb-nav-link" href="#what-is-this"><span class="hb-nav-num">0</span>What this is</a>
      <a class="hb-nav-link" href="#progress"><span class="hb-nav-num">1</span>Your progress</a>
      <a class="hb-nav-link" href="#picture"><span class="hb-nav-num">2</span>The one-page picture</a>
      <a class="hb-nav-link" href="#story"><span class="hb-nav-num">3</span>The story so far</a>

      <div class="hb-nav-group-label">Learning</div>
      <a class="hb-nav-link" href="#services"><span class="hb-nav-num">4</span>The outside tools</a>
      <a class="hb-nav-link" href="#learned"><span class="hb-nav-num">5</span>What you've learned</a>
      <a class="hb-nav-link" href="#uiux"><span class="hb-nav-num">6</span>UI/UX &amp; design skill</a>

      <div class="hb-nav-group-label">The stack, in detail</div>
      <a class="hb-nav-link" href="#code"><span class="hb-nav-num">7</span>The code</a>
      <a class="hb-nav-link" href="#database"><span class="hb-nav-num">8</span>The database</a>
      <a class="hb-nav-link" href="#settings"><span class="hb-nav-num">9</span>The settings</a>

      <div class="hb-nav-group-label">Operating it</div>
      <a class="hb-nav-link" href="#breaks"><span class="hb-nav-num">10</span>When something breaks</a>
      <a class="hb-nav-link" href="#routines"><span class="hb-nav-num">11</span>The routines</a>
      <a class="hb-nav-link" href="#rebuild"><span class="hb-nav-num">12</span>If you rebuilt it</a>

      <div class="hb-nav-group-label">Reference</div>
      <a class="hb-nav-link" href="#next-skills"><span class="hb-nav-num">13</span>What to learn next</a>
      <a class="hb-nav-link" href="#words"><span class="hb-nav-num">14</span>Quick glossary</a>
      <a class="hb-nav-link" href="#next"><span class="hb-nav-num">15</span>What I'd do next</a>
    </nav>
  </aside>

  <main class="hb-main">

    <section class="hb-chapter hb-hero" id="what-is-this">
      <span class="hb-kicker">● Section 0</span>
      <h1>The Boost Web Digital<br>Systems Handbook</h1>
      <p class="hb-lede">
        boostwebdigital.com is a live website for a healthcare marketing agency in Amritsar, Punjab.
        You commissioned every piece of it — a Next.js site on Vercel, a WordPress blog on Hostinger,
        a small database, an email service — but you didn't write the code yourself. That's exactly what
        this handbook is for: not just a map of what exists, but a real record of what you've already
        learned building it, and where that knowledge takes you next.
      </p>
      <div class="hb-hero-meta">
        <span class="hb-meta-chip"><span class="hb-dot"></span> Live in production</span>
        <span class="hb-meta-chip">Amritsar, Punjab, India</span>
        <span class="hb-meta-chip">Next.js 16 · React 19 · Vercel</span>
        <span class="hb-meta-chip">52 commits so far</span>
      </div>
      <div class="hb-howto">
        <strong>How to read this:</strong> it's built to be jumped around, not read start to finish.
        Something broken right now? Go straight to <a href="#breaks">Section 10</a>.
        A word you don't recognise? <a href="#words">Section 14</a> defines it in plain English.
        Want to see what you've actually learned so far? <a href="#learned">Section 5</a> is written for exactly that.
      </div>
    </section>

    <section class="hb-chapter hb-wide" id="progress">
      <span class="hb-kicker">● Section 1</span>
      <h2>Your progress</h2>
      <p class="hb-lede">You've described this project as building a shop, step by step. That's the right way to think about it — so here's exactly where the shop stands today.</p>

      <div class="hb-track-wrap">
        <div class="hb-track">
          <div class="hb-step hb-done">
            <div class="hb-step-line"></div>
            <div class="hb-step-node">🔒</div>
            <div class="hb-step-num">STEP 1</div>
            <div class="hb-step-title">Locks on the Doors</div>
            <div class="hb-step-body">Every account protected, a leaked password rotated, WordPress locked down</div>
            <div class="hb-step-status"><span class="hb-status hb-ok"><span class="hb-dot"></span>Done</span></div>
          </div>
          <div class="hb-step hb-done">
            <div class="hb-step-line"></div>
            <div class="hb-step-node">📮</div>
            <div class="hb-step-num">STEP 2</div>
            <div class="hb-step-title">A Working Postbox</div>
            <div class="hb-step-body">Mail actually arrives — MX, SPF, DKIM, DMARC and Resend all connected</div>
            <div class="hb-step-status"><span class="hb-status hb-ok"><span class="hb-dot"></span>Done</span></div>
          </div>
          <div class="hb-step hb-done">
            <div class="hb-step-line"></div>
            <div class="hb-step-node">📝</div>
            <div class="hb-step-num">STEP 3</div>
            <div class="hb-step-title">A Comment Box</div>
            <div class="hb-step-body">The contact form: fixed, protected from spam, dressed in your brand</div>
            <div class="hb-step-status"><span class="hb-status hb-ok"><span class="hb-dot"></span>Done</span></div>
          </div>
          <div class="hb-step hb-progress">
            <div class="hb-step-line"></div>
            <div class="hb-step-node">👥</div>
            <div class="hb-step-num">STEP 4</div>
            <div class="hb-step-title">A Members List</div>
            <div class="hb-step-body">People can join, confirm and leave. Telling everyone when you publish is built, not yet proven live</div>
            <div class="hb-step-status"><span class="hb-status hb-warn"><span class="hb-dot"></span>Nearly there</span></div>
          </div>
          <div class="hb-step">
            <div class="hb-step-line"></div>
            <div class="hb-step-node">🎁</div>
            <div class="hb-step-num">STEP 5</div>
            <div class="hb-step-title">A Free Machine</div>
            <div class="hb-step-body">The AI Visibility Checker — a free tool designed to pull people in</div>
            <div class="hb-step-status"><span class="hb-status hb-todo"><span class="hb-dot"></span>Planned</span></div>
          </div>
          <div class="hb-step">
            <div class="hb-step-line"></div>
            <div class="hb-step-node">🚨</div>
            <div class="hb-step-num">STEP 6</div>
            <div class="hb-step-title">Fire Alarm + Insurance</div>
            <div class="hb-step-body">Monitoring, error alerts, backups, a spending ceiling on AI costs</div>
            <div class="hb-step-status"><span class="hb-status hb-todo"><span class="hb-dot"></span>Not started</span></div>
          </div>
          <div class="hb-step">
            <div class="hb-step-line"></div>
            <div class="hb-step-node">✅</div>
            <div class="hb-step-num">STEP 7</div>
            <div class="hb-step-title">Walk-Through</div>
            <div class="hb-step-body">One last checklist before you'd call this fully open for business</div>
            <div class="hb-step-status"><span class="hb-status hb-todo"><span class="hb-dot"></span>Not started</span></div>
          </div>
        </div>
      </div>
      <p class="hb-prose" style="margin-top:22px; font-size:0.92rem; color:var(--muted);">
        <strong>Why this order matters:</strong> you can't safely mail a membership list before the postbox works. The small,
        low-stakes contact form taught the exact safety patterns (rate limiting, spam-proofing, honest error messages) that
        the newsletter reused, and that the AI Checker will reuse again. Each step is deliberately built to make the next one easier, not harder.
      </p>
    </section>

    <section class="hb-chapter hb-wide" id="picture">
      <span class="hb-kicker">● Section 2</span>
      <h2>The one-page picture</h2>
      <p class="hb-lede">Ten boxes. Every one of them is a real account you own. Here's how they talk to each other.</p>

      <div class="hb-diagram-wrap">
        <div class="hb-diagram">
          <svg viewBox="0 0 1040 640" width="100%" role="img" aria-label="Architecture diagram showing how the visitor's browser, Vercel, WordPress, Neon, Resend, Upstash, Google Workspace and Namecheap DNS connect">
            <defs>
              <marker id="hbArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--faint)"></path></marker>
              <marker id="hbArrowAccent" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--accent)"></path></marker>
            </defs>
            <line x1="150" y1="90" x2="150" y2="150" stroke="var(--faint)" stroke-width="1.6" marker-end="url(#hbArrow)"></line>
            <line x1="420" y1="60" x2="330" y2="150" stroke="var(--faint)" stroke-width="1.6" marker-end="url(#hbArrow)"></line>
            <path d="M320,195 C440,195 440,195 540,195" stroke="var(--accent)" stroke-width="1.6" fill="none" marker-end="url(#hbArrowAccent)"></path>
            <text x="400" y="185" font-size="11" fill="var(--accent)">fetches posts</text>
            <path d="M540,230 C440,230 440,230 320,230" stroke="var(--warn)" stroke-width="1.6" stroke-dasharray="4 3" fill="none" marker-end="url(#hbArrow)"></path>
            <text x="378" y="248" font-size="11" fill="var(--warn)">publish ping ⚠</text>
            <line x1="240" y1="240" x2="240" y2="330" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#hbArrowAccent)"></line>
            <text x="248" y="290" font-size="11" fill="var(--accent)">read / write</text>
            <path d="M250,240 C400,300 480,330 540,355" stroke="var(--accent)" stroke-width="1.6" fill="none" marker-end="url(#hbArrowAccent)"></path>
            <path d="M150,240 C100,300 100,330 130,355" stroke="var(--accent)" stroke-width="1.6" fill="none" marker-end="url(#hbArrowAccent)"></path>
            <line x1="660" y1="400" x2="660" y2="470" stroke="var(--faint)" stroke-width="1.6" marker-end="url(#hbArrow)"></line>
            <path d="M870,80 C870,140 700,140 660,150" stroke="var(--faint)" stroke-width="1.2" stroke-dasharray="3 3" fill="none" marker-end="url(#hbArrow)"></path>
            <path d="M870,80 C870,140 560,180 560,190" stroke="var(--faint)" stroke-width="1.2" stroke-dasharray="3 3" fill="none" marker-end="url(#hbArrow)"></path>
            <path d="M870,80 C870,300 700,340 660,350" stroke="var(--faint)" stroke-width="1.2" stroke-dasharray="3 3" fill="none" marker-end="url(#hbArrow)"></path>
            <path d="M870,80 C870,400 700,460 670,468" stroke="var(--faint)" stroke-width="1.2" stroke-dasharray="3 3" fill="none" marker-end="url(#hbArrow)"></path>
            <text x="895" y="76" font-size="11" fill="var(--faint)">points DNS at ↓</text>

            <g><rect x="70" y="20" width="160" height="60" rx="10" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.4"></rect>
              <text x="150" y="45" font-size="13" font-weight="700" fill="var(--ink)" text-anchor="middle">Visitor's Browser</text>
              <text x="150" y="63" font-size="10.5" fill="var(--muted)" text-anchor="middle">a patient, a lead, you</text></g>
            <g><rect x="360" y="20" width="160" height="60" rx="10" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.4"></rect>
              <text x="440" y="45" font-size="13" font-weight="700" fill="var(--ink)" text-anchor="middle">GitHub</text>
              <text x="440" y="63" font-size="10.5" fill="var(--muted)" text-anchor="middle">stores every code change</text></g>
            <g><rect x="150" y="150" width="180" height="90" rx="12" fill="var(--accent-tint)" stroke="var(--accent)" stroke-width="1.8"></rect>
              <text x="240" y="180" font-size="14" font-weight="800" fill="var(--accent)" text-anchor="middle">Vercel</text>
              <text x="240" y="198" font-size="10.5" fill="var(--ink)" text-anchor="middle">runs the Next.js site</text>
              <text x="240" y="212" font-size="10.5" fill="var(--ink)" text-anchor="middle">+ every /api/ route</text></g>
            <g><rect x="540" y="165" width="180" height="80" rx="10" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.4"></rect>
              <text x="630" y="190" font-size="13" font-weight="700" fill="var(--ink)" text-anchor="middle">WordPress</text>
              <text x="630" y="207" font-size="10.5" fill="var(--muted)" text-anchor="middle">blog.boostwebdigital.com</text>
              <text x="630" y="221" font-size="10.5" fill="var(--muted)" text-anchor="middle">(Hostinger)</text></g>
            <g><rect x="150" y="330" width="180" height="80" rx="10" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.4"></rect>
              <text x="240" y="355" font-size="13" font-weight="700" fill="var(--ink)" text-anchor="middle">Neon</text>
              <text x="240" y="372" font-size="10.5" fill="var(--muted)" text-anchor="middle">Postgres database</text>
              <text x="240" y="386" font-size="10.5" fill="var(--muted)" text-anchor="middle">subscribers · sent_posts</text></g>
            <g><rect x="540" y="355" width="180" height="60" rx="10" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.4"></rect>
              <text x="630" y="380" font-size="13" font-weight="700" fill="var(--ink)" text-anchor="middle">Resend</text>
              <text x="630" y="397" font-size="10.5" fill="var(--muted)" text-anchor="middle">sends every email</text></g>
            <g><rect x="40" y="355" width="160" height="60" rx="10" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.4"></rect>
              <text x="120" y="380" font-size="13" font-weight="700" fill="var(--ink)" text-anchor="middle">Upstash</text>
              <text x="120" y="397" font-size="10.5" fill="var(--muted)" text-anchor="middle">rate-limit counter</text></g>
            <g><rect x="580" y="470" width="180" height="60" rx="10" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.4"></rect>
              <text x="670" y="495" font-size="13" font-weight="700" fill="var(--ink)" text-anchor="middle">Google Workspace</text>
              <text x="670" y="512" font-size="10.5" fill="var(--muted)" text-anchor="middle">ritik@ · contact@</text></g>
            <g><rect x="790" y="20" width="180" height="60" rx="10" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.4"></rect>
              <text x="880" y="45" font-size="13" font-weight="700" fill="var(--ink)" text-anchor="middle">Namecheap</text>
              <text x="880" y="63" font-size="10.5" fill="var(--muted)" text-anchor="middle">domain + DNS</text></g>
            <g><rect x="770" y="330" width="200" height="60" rx="10" fill="var(--surface)" stroke="var(--border)" stroke-width="1.2" stroke-dasharray="3 3"></rect>
              <text x="870" y="355" font-size="12" font-weight="700" fill="var(--muted)" text-anchor="middle">Google Analytics</text>
              <text x="870" y="372" font-size="10.5" fill="var(--faint)" text-anchor="middle">watches visitors only</text></g>
          </svg>
        </div>
      </div>

      <div class="hb-diagram-legend">
        <span><span class="hb-legend-line" style="background:var(--accent)"></span> a request your code makes</span>
        <span><span class="hb-legend-line" style="background:var(--warn); border-top:2px dashed var(--warn)"></span> not confirmed firing yet</span>
        <span><span class="hb-legend-line" style="background:var(--faint); border-top:1.5px dashed var(--faint)"></span> DNS pointing, or a plain link</span>
      </div>

      <h3>Every box's one job</h3>
      <div class="hb-box-jobs">
        <div class="hb-box-job"><b>Visitor's Browser</b><span>Loads pages, submits the contact form and the newsletter form.</span></div>
        <div class="hb-box-job"><b>Vercel</b><span>Runs the actual Next.js code — every page and every <code>/api/</code> route lives here.</span></div>
        <div class="hb-box-job"><b>GitHub</b><span>Stores every version of the code. Vercel deploys straight from it.</span></div>
        <div class="hb-box-job"><b>WordPress (Hostinger)</b><span>Where you write and publish blog posts. The Next.js site fetches them, it never stores them.</span></div>
        <div class="hb-box-job"><b>Neon</b><span>Remembers who subscribed to the newsletter, and which posts have already been emailed out.</span></div>
        <div class="hb-box-job"><b>Resend</b><span>Actually sends every email — contact replies, newsletter confirmations, new-post notices.</span></div>
        <div class="hb-box-job"><b>Upstash</b><span>A shared counter so one visitor can't submit a form 50 times in a minute.</span></div>
        <div class="hb-box-job"><b>Google Workspace</b><span>The real inbox behind ritik@ and contact@ — where replies actually land.</span></div>
        <div class="hb-box-job"><b>Namecheap</b><span>Owns the domain name and points every subdomain at the right service.</span></div>
        <div class="hb-box-job"><b>Google Analytics</b><span>Counts visitors. The only analytics tool actually wired in — see Section 4.</span></div>
      </div>
    </section>

    <section class="hb-chapter" id="story">
      <span class="hb-kicker">● Section 3</span>
      <h2>The story so far</h2>
      <p class="hb-lede">Every phase below is real, taken straight from <code class="mono">git log</code> — the project's own save history, oldest first.</p>

      <div class="hb-timeline">
        <div class="hb-t-phase">
          <span class="hb-t-num">PHASE 1</span>
          <h4>Foundation</h4>
          <p class="hb-t-body">The Next.js project is created and the first homepage goes up, along with the design system that every page since has followed — colours, type, spacing rules.</p>
          <div class="hb-t-commits"><span class="hb-t-commit">Initial commit</span><span class="hb-t-commit">homepage, design system, SEO foundation</span></div>
        </div>
        <div class="hb-t-phase">
          <span class="hb-t-num">PHASE 2</span>
          <h4>Blog and core pages</h4>
          <p class="hb-t-body">A blog system is built (writing posts as files in the project itself, called MDX — later replaced, see Phase 5), plus the blog archive, the contact page, and the main navigation.</p>
          <div class="hb-t-commits"><span class="hb-t-commit">dynamic blog system with MDX</span><span class="hb-t-commit">blog archive</span><span class="hb-t-commit">contact page</span><span class="hb-t-commit">nav restructure</span></div>
        </div>
        <div class="hb-t-phase">
          <span class="hb-t-num">PHASE 3</span>
          <h4>Pricing, Services, and a real debugging hunt</h4>
          <p class="hb-t-body">The pricing and services pages are built. A chunk of this phase is spent chasing a genuine mobile-performance bug — pages felt laggy on phones — eventually traced to one specific animation style and removed sitewide. This one comes back in Section 6, because it's a real UI/UX lesson, not just a code fix.</p>
          <div class="hb-t-commits"><span class="hb-t-commit">/pricing/ built</span><span class="hb-t-commit">mobile lag hunted + fixed</span><span class="hb-t-commit">blur removed sitewide</span><span class="hb-t-commit">/services/ built</span></div>
        </div>
        <div class="hb-t-phase">
          <span class="hb-t-num">PHASE 4</span>
          <h4>FAQ, legal pages, first SEO pass</h4>
          <p class="hb-t-body">An FAQ page and all five legal pages (terms, privacy, refund, disclaimer, cookies) go live. A full SEO/crawlability audit finds and fixes broken links and missing schema, and the site is verified with Google Search Console.</p>
          <div class="hb-t-commits"><span class="hb-t-commit">/faq/ built</span><span class="hb-t-commit">5 legal pages</span><span class="hb-t-commit">SEO/crawlability audit</span><span class="hb-t-commit">GSC verification file</span></div>
        </div>
        <div class="hb-t-phase">
          <span class="hb-t-num">PHASE 5</span>
          <h4>The move to headless WordPress</h4>
          <p class="hb-t-body">The blog's data source is switched from files stored inside the Next.js project to a real WordPress installation, reached over its REST API. A one-hour safety-net cache refresh is added in case the instant-update webhook (Section 2's dashed orange line) ever misses.</p>
          <div class="hb-t-commits"><span class="hb-t-commit">swap MDX → headless WordPress</span><span class="hb-t-commit">1-hour revalidate fallback</span></div>
        </div>
        <div class="hb-t-phase">
          <span class="hb-t-num">PHASE 6</span>
          <h4>Schema cleanup and a real Services page</h4>
          <p class="hb-t-body">The invisible "facts about the business" block search engines read gets cleaned up — a wrong claim about which country the agency serves is removed, real contact details added. The Services page is rebuilt with real service descriptions, and a full AI-visibility (GEO) landing page is built.</p>
          <div class="hb-t-commits"><span class="hb-t-commit">schema: address/email/sameAs fixed</span><span class="hb-t-commit">wrong areaServed removed</span><span class="hb-t-commit">/services/ rebuilt</span><span class="hb-t-commit">GEO landing page built</span></div>
        </div>
        <div class="hb-t-phase">
          <span class="hb-t-num">PHASE 7</span>
          <h4>The contact form is discovered broken — and fixed</h4>
          <p class="hb-t-body">On inspection, the contact form had <strong>never once sent a working email in production</strong>: wrong sender, wrong recipient, no API key configured. All three are fixed, rate limiting and an auto-reply are added, and the email is redesigned with real brand colours.</p>
          <div class="hb-t-commits"><span class="hb-t-commit">real sender/recipient</span><span class="hb-t-commit">rate limiting</span><span class="hb-t-commit">auto-reply</span><span class="hb-t-commit">branded email template</span></div>
          <div class="hb-t-note hb-warn">⚠ This is the kind of gap that looks fine on screen but was never actually delivering an email — worth remembering when something looks "done."</div>
        </div>
        <div class="hb-t-phase">
          <span class="hb-t-num">PHASE 8</span>
          <h4>The newsletter — subscribe, confirm, unsubscribe</h4>
          <p class="hb-t-body">A full double opt-in newsletter system is built from nothing: its own two-table database, a subscribe form in the footer, a confirmation email, and a proper one-click unsubscribe. Midway through, two machines diverge and a merge conflict has to be resolved by hand.</p>
          <div class="hb-t-commits"><span class="hb-t-commit">subscribe → confirm → unsubscribe loop</span><span class="hb-t-commit">merge conflict resolved</span></div>
        </div>
        <div class="hb-t-phase">
          <span class="hb-t-num">PHASE 9 — where things stand today</span>
          <h4>Blog-publish notifications</h4>
          <p class="hb-t-body">The last piece of the newsletter: when a post is published, every confirmed subscriber gets emailed automatically. Built and committed. <strong>Not yet confirmed working end-to-end</strong> — see the flag below.</p>
          <div class="hb-t-note hb-warn">⚠ <code class="mono">docs/08-CMS.md</code> says plainly: "the route exists; nothing calls it yet." WordPress's publish button has not been proven to actually ping this code — the 1-hour fallback (Phase 5) is what's really been keeping the blog visibly up to date.</div>
        </div>
      </div>

      <div class="hb-status-row">
        <div class="hb-status-block">
          <h4>Working right now</h4>
          <ul class="hb-status-list">
            <li>Site live on boostwebdigital.com <span class="hb-status hb-ok"><span class="hb-dot"></span>LIVE</span></li>
            <li>Blog live via WordPress <span class="hb-status hb-ok"><span class="hb-dot"></span>LIVE</span></li>
            <li>Contact form, rate-limited, branded <span class="hb-status hb-ok"><span class="hb-dot"></span>LIVE</span></li>
            <li>Newsletter subscribe/confirm/unsubscribe <span class="hb-status hb-ok"><span class="hb-dot"></span>LIVE</span></li>
          </ul>
        </div>
        <div class="hb-status-block">
          <h4>Not built yet</h4>
          <ul class="hb-status-list">
            <li>AI Visibility Checker (free tool) <span class="hb-status hb-todo"><span class="hb-dot"></span>PLANNED</span></li>
            <li>Monitoring / error alerts / backups <span class="hb-status hb-todo"><span class="hb-dot"></span>NOT STARTED</span></li>
            <li>Go-live checklist <span class="hb-status hb-todo"><span class="hb-dot"></span>NOT STARTED</span></li>
            <li>Your personal-brand-as-CEO plan <span class="hb-status hb-todo"><span class="hb-dot"></span>NO PLAN YET</span></li>
          </ul>
        </div>
      </div>
    </section>

    <section class="hb-chapter hb-wide" id="services">
      <span class="hb-kicker">● Section 4</span>
      <h2>The outside tools</h2>
      <p class="hb-lede">Every one of these is a separate account, outside this codebase, that the site depends on. Each one gets a plain definition and a real thing that actually happens on your site.</p>

      <div class="hb-card-grid">
        <div class="hb-card">
          <div class="hb-card-head"><div class="hb-card-head-icon"><span class="hb-card-icon">▲</span><h4>Vercel</h4></div><span class="hb-status hb-ok"><span class="hb-dot"></span>LIVE</span></div>
          <p class="hb-card-def"><strong>What it is:</strong> the computer that actually runs your website and hands it to visitors.</p>
          <dl>
            <div><dt>Its job here</dt><dd>Hosts the Next.js app and every <code class="mono">/api/</code> route; redeploys itself automatically on every GitHub push.</dd></div>
            <div><dt>Real example</dt><dd class="hb-example">You push a code change → Vercel notices in seconds, rebuilds the whole site, and swaps the live version in — usually under two minutes, with no downtime.</dd></div>
            <div><dt>Free tier</dt><dd>Hobby plan, currently in use — fine for a site this size.</dd></div>
            <div><dt>What breaks without it</dt><dd>Everything. The whole site goes down.</dd></div>
          </dl>
          <a class="hb-loginlink" href="https://vercel.com" target="_blank" rel="noopener">vercel.com →</a>
        </div>

        <div class="hb-card">
          <div class="hb-card-head"><div class="hb-card-head-icon"><span class="hb-card-icon">⌥</span><h4>GitHub</h4></div><span class="hb-status hb-ok"><span class="hb-dot"></span>LIVE</span></div>
          <p class="hb-card-def"><strong>What it is:</strong> where every version of the code is saved — a very detailed history you can always go back to.</p>
          <dl>
            <div><dt>Its job here</dt><dd>The single source of truth for the code. Vercel deploys straight from it.</dd></div>
            <div><dt>Real example</dt><dd class="hb-example">A Claude Code session finishes a feature and runs <code class="mono">git commit</code> (saved locally). You review it, then <code class="mono">git push</code> sends it to GitHub — that's the moment Vercel picks it up.</dd></div>
            <div><dt>Free tier</dt><dd>Free, for a private repository.</dd></div>
            <div><dt>What breaks without it</dt><dd>Nothing live — the site keeps running off its last deploy. But no new change can ever ship again.</dd></div>
          </dl>
          <a class="hb-loginlink" href="https://github.com/ritik2926/boostwebdigital" target="_blank" rel="noopener">github.com/ritik2926/boostwebdigital →</a>
        </div>

        <div class="hb-card">
          <div class="hb-card-head"><div class="hb-card-head-icon"><span class="hb-card-icon">◎</span><h4>Namecheap</h4></div><span class="hb-status hb-ok"><span class="hb-dot"></span>LIVE</span></div>
          <p class="hb-card-def"><strong>What it is:</strong> where the domain name itself is registered, and the phonebook (DNS) that says which server owns which name.</p>
          <dl>
            <div><dt>Its job here</dt><dd>Points boostwebdigital.com at Vercel, blog.boostwebdigital.com at Hostinger, and proves who's allowed to send mail as your domain.</dd></div>
            <div><dt>Real example</dt><dd class="hb-example">A DNS lookup run for this handbook confirms boostwebdigital.com currently resolves to a Vercel address, and blog.boostwebdigital.com to Hostinger's — see Section 9.</dd></div>
            <div><dt>Free tier</dt><dd>N/A — paid domain registration.</dd></div>
            <div><dt>What breaks without it</dt><dd>Everything. The domain stops pointing anywhere at all.</dd></div>
          </dl>
          <a class="hb-loginlink" href="https://namecheap.com" target="_blank" rel="noopener">namecheap.com →</a>
        </div>

        <div class="hb-card">
          <div class="hb-card-head"><div class="hb-card-head-icon"><span class="hb-card-icon">⛁</span><h4>Neon (Postgres)</h4></div><span class="hb-status hb-ok"><span class="hb-dot"></span>LIVE</span></div>
          <p class="hb-card-def"><strong>What it is:</strong> a database — a permanent, structured notebook the app writes to and reads from.</p>
          <dl>
            <div><dt>Its job here</dt><dd>Remembers every newsletter subscriber and their status, and which posts have already been emailed, so nobody gets double-emailed.</dd></div>
            <div><dt>Real example</dt><dd class="hb-example">Someone types their email into the footer form → <b>POST /api/newsletter/subscribe</b> writes one new row into the <code class="mono">subscribers</code> table with status <code class="mono">'pending'</code>.</dd></div>
            <div><dt>Free tier</dt><dd>Neon's free tier — chosen over Supabase specifically because Supabase's free tier pauses after a week of no traffic and needs a manual click to restart. Neon auto-resumes in about 300 milliseconds.</dd></div>
            <div><dt>What breaks without it</dt><dd>The entire newsletter system — signups, confirmations, unsubscribes, and post-notification emails all fail.</dd></div>
          </dl>
          <div class="hb-card-envs"><span class="hb-env-chip">DATABASE_URL</span></div>
          <a class="hb-loginlink" href="https://console.neon.tech" target="_blank" rel="noopener">console.neon.tech →</a>
        </div>

        <div class="hb-card">
          <div class="hb-card-head"><div class="hb-card-head-icon"><span class="hb-card-icon">✉</span><h4>Resend</h4></div><span class="hb-status hb-ok"><span class="hb-dot"></span>LIVE</span></div>
          <p class="hb-card-def"><strong>What it is:</strong> a service that sends email on your behalf — a website can't just email people directly.</p>
          <dl>
            <div><dt>Its job here</dt><dd>Sends every email the site sends: contact notifications + auto-reply, newsletter confirmation, and new-post notices.</dd></div>
            <div><dt>Real example</dt><dd class="hb-example">Dr. Sharma submits the contact form → <code class="mono">src/app/api/contact/route.ts</code> calls Resend twice: once to notify ritik@, once to auto-reply to Dr. Sharma.</dd></div>
            <div><dt>Free tier</dt><dd><strong>3,000 emails/month, capped at 100/day.</strong> The blog-notification code already caps a single send at the first 100 confirmed subscribers and logs a warning if there are more.</dd></div>
            <div><dt>What breaks without it</dt><dd>Contact form fails loudly instead of pretending to work; newsletter signups still save, but no confirmation email goes out.</dd></div>
          </dl>
          <div class="hb-card-envs"><span class="hb-env-chip">RESEND_API_KEY</span></div>
          <a class="hb-loginlink" href="https://resend.com" target="_blank" rel="noopener">resend.com →</a>
        </div>

        <div class="hb-card">
          <div class="hb-card-head"><div class="hb-card-head-icon"><span class="hb-card-icon">⚡</span><h4>Upstash (Redis)</h4></div><span class="hb-status hb-warn"><span class="hb-dot"></span>PARTIAL</span></div>
          <p class="hb-card-def"><strong>What it is:</strong> a very fast shared counter — a small database built specifically for counting things quickly.</p>
          <dl>
            <div><dt>Its job here</dt><dd>Rate limiting: stops one visitor (or a bot) submitting the contact form or newsletter signup more than 3 times an hour.</dd></div>
            <div><dt>Real example</dt><dd class="hb-example">Same visitor submits the contact form a 4th time in an hour → HTTP 429, "Too many messages. Please try again in an hour," instead of a 4th email going out.</dd></div>
            <div><dt>Free tier</dt><dd>Upstash's free tier (exact request quota lives in their dashboard, not in this code).</dd></div>
            <div><dt>What breaks without it</dt><dd>Nothing visible — it "fails open" on purpose. A missing/broken value means no rate limit at all, never a blocked visitor.</dd></div>
          </dl>
          <div class="hb-flag">⚠ Confirmed this session: the <strong>Development</strong> environment's Upstash URL is a placeholder, not a real value. Production is fine — see Section 9's trap box.</div>
          <div class="hb-card-envs"><span class="hb-env-chip">UPSTASH_REDIS_REST_URL</span><span class="hb-env-chip">UPSTASH_REDIS_REST_TOKEN</span></div>
          <a class="hb-loginlink" href="https://console.upstash.com" target="_blank" rel="noopener">console.upstash.com →</a>
        </div>

        <div class="hb-card">
          <div class="hb-card-head"><div class="hb-card-head-icon"><span class="hb-card-icon">✦</span><h4>Google Workspace</h4></div><span class="hb-status hb-ok"><span class="hb-dot"></span>LIVE</span></div>
          <p class="hb-card-def"><strong>What it is:</strong> the real mailbox software behind ritik@boostwebdigital.com — the paid version of Gmail for a custom domain.</p>
          <dl>
            <div><dt>Its job here</dt><dd>Where every email the site sends or receives actually lands and can be replied to.</dd></div>
            <div><dt>Real example</dt><dd class="hb-example">The contact form's notification email is addressed to ritik@boostwebdigital.com — a Google Workspace inbox that lives entirely outside this codebase.</dd></div>
            <div><dt>Free tier</dt><dd>N/A — paid, one user, with contact@ as a free alias on the same inbox.</dd></div>
            <div><dt>What breaks without it</dt><dd>Mail bounces. This actually happened for roughly a month when the site moved off old hosting and the mail-routing record was lost.</dd></div>
          </dl>
          <a class="hb-loginlink" href="https://admin.google.com" target="_blank" rel="noopener">admin.google.com →</a>
        </div>

        <div class="hb-card">
          <div class="hb-card-head"><div class="hb-card-head-icon"><span class="hb-card-icon">✎</span><h4>WordPress <span style="font-weight:500;color:var(--muted);font-size:0.8em;">(Hostinger)</span></h4></div><span class="hb-status hb-ok"><span class="hb-dot"></span>LIVE</span></div>
          <p class="hb-card-def"><strong>What it is:</strong> the familiar WordPress writing dashboard, running "headless" — only its data gets used, never its own visual theme.</p>
          <dl>
            <div><dt>Its job here</dt><dd>Where you write and publish posts. The Next.js site never stores blog content — it fetches it live over WordPress's own REST API.</dd></div>
            <div><dt>Real example</dt><dd class="hb-example">You click "Publish" on a new post → <code class="mono">src/lib/blog/wordpress.ts</code> fetches that post's title, body and image the next time <code class="mono">/blogs/</code> is visited.</dd></div>
            <div><dt>Free tier</dt><dd>N/A — paid Hostinger hosting.</dd></div>
            <div><dt>What breaks without it</dt><dd>The blog goes blank. <code class="mono">/blogs/</code> and every post page fail to load any content.</dd></div>
          </dl>
          <div class="hb-card-envs"><span class="hb-env-chip">WP_API_URL</span></div>
          <a class="hb-loginlink" href="https://blog.boostwebdigital.com/wp-admin" target="_blank" rel="noopener">wp-admin →</a>
        </div>

        <div class="hb-card">
          <div class="hb-card-head"><div class="hb-card-head-icon"><span class="hb-card-icon">📈</span><h4>Google Analytics (GA4)</h4></div><span class="hb-status hb-ok"><span class="hb-dot"></span>LIVE</span></div>
          <p class="hb-card-def"><strong>What it is:</strong> Google's free visitor-counting tool.</p>
          <dl>
            <div><dt>Its job here</dt><dd>Counts how many people visit, which pages, and roughly where from.</dd></div>
            <div><dt>Real example</dt><dd class="hb-example"><code class="mono">src/components/Analytics.tsx</code> loads Google's tracking script on every real visit — never on a local build or preview deploy.</dd></div>
            <div><dt>Free tier</dt><dd>Free — effectively unlimited for a site this size.</dd></div>
            <div><dt>What breaks without it</dt><dd>Nothing breaks. The site works identically — you just can't see visitor numbers.</dd></div>
          </dl>
          <div class="hb-flag">⚠ Your privacy and cookie-policy pages also mention "Microsoft Clarity and/or Hotjar" as session-recording tools. <strong>Neither exists anywhere in the code.</strong> Either install one, or soften the wording.</div>
          <div class="hb-card-envs"><span class="hb-env-chip">NEXT_PUBLIC_GA_ID</span></div>
          <a class="hb-loginlink" href="https://analytics.google.com" target="_blank" rel="noopener">analytics.google.com →</a>
        </div>

        <div class="hb-card">
          <div class="hb-card-head"><div class="hb-card-head-icon"><span class="hb-card-icon">🔎</span><h4>Search Console</h4></div><span class="hb-status hb-warn"><span class="hb-dot"></span>NEEDS WORK</span></div>
          <p class="hb-card-def"><strong>What it is:</strong> Google's free tool for telling it your site exists and watching how it performs in search.</p>
          <dl>
            <div><dt>Its job here</dt><dd>Confirms you own the domain, tracks which of your pages Google has actually indexed.</dd></div>
            <div><dt>Real example</dt><dd class="hb-example">Ownership is proven by a real file at <code class="mono">public/googlee0e7c245548e8b89.html</code> — verified present in the code.</dd></div>
            <div><dt>Free tier</dt><dd>Free, no limit.</dd></div>
            <div><dt>What breaks without it</dt><dd>Nothing breaks — but per the last working session's notes, only 1 of 9 real pages is indexed. Not re-checked for this handbook — verify in the dashboard.</dd></div>
          </dl>
          <a class="hb-loginlink" href="https://search.google.com/search-console" target="_blank" rel="noopener">search console →</a>
        </div>
      </div>
    </section>

    <section class="hb-chapter hb-wide" id="learned">
      <span class="hb-kicker">● Section 5</span>
      <h2>What you've learned</h2>
      <p class="hb-lede">You watched every one of these get built, break, and get fixed on your own project. This is real, grounded knowledge — not theory you skimmed once.</p>

      <div class="hb-learn-group">
        <div class="hb-learn-head"><span class="hb-learn-icon">✉</span><h3>Getting email to actually arrive</h3><span class="hb-learn-count">6 things</span></div>
        <div class="hb-learn-grid">
          <div class="hb-learn-card"><dt>MX record</dt><dd>The postal address for a domain — where mail for it should go.</dd><div class="hb-real"><b>On your site:</b> this record was missing for about a month after the WordPress move — every email bounced instead of queuing.</div></div>
          <div class="hb-learn-card"><dt>SPF</dt><dd>A public list of exactly who's allowed to send email as your domain.</dd><div class="hb-real"><b>On your site:</b> your root domain's SPF names Google; a separate one on the send. subdomain names Resend — two senders, two separate approvals.</div></div>
          <div class="hb-learn-card"><dt>DKIM</dt><dd>A digital wax seal on an email, proving it wasn't tampered with in transit.</dd><div class="hb-real"><b>On your site:</b> you have two DKIM records — one for Google Workspace's own mail, one for Resend's.</div></div>
          <div class="hb-learn-card"><dt>DMARC</dt><dd>The instruction for what happens when SPF or DKIM fails on an incoming check.</dd><div class="hb-real"><b>On your site:</b> currently set to just watch and report, not reject outright — a safe first step, tightened later on purpose.</div></div>
          <div class="hb-learn-card"><dt>Alias vs. a real user</dt><dd>An alias is a second nameplate on the same letterbox, free. A new user is a whole new inbox.</dd><div class="hb-real"><b>On your site:</b> contact@ is a free alias sitting on your one paid ritik@ inbox — not a second ₹150/month seat.</div></div>
          <div class="hb-learn-card"><dt>From vs. Reply-To</dt><dd>The sender's address and the address a reply goes to don't have to match.</dd><div class="hb-real"><b>On your site:</b> your contact auto-reply is FROM hello@, but replies TO ritik@ — so hitting reply reaches you, not a robot mailbox.</div></div>
        </div>
      </div>

      <div class="hb-learn-group">
        <div class="hb-learn-head"><span class="hb-learn-icon">🛡</span><h3>Keeping bots and abuse out</h3><span class="hb-learn-count">7 things</span></div>
        <div class="hb-learn-grid">
          <div class="hb-learn-card"><dt>Honeypot</dt><dd>An invisible form field a real person never sees — only a bot filling in every field trips it.</dd><div class="hb-real"><b>On your site:</b> the contact form and newsletter form both carry one; filling it returns a fake "success" so the bot's script learns nothing.</div></div>
          <div class="hb-learn-card"><dt>Rate limiting</dt><dd>Capping how many times something can happen in a stretch of time — protects capacity, not tidiness.</dd><div class="hb-real"><b>On your site:</b> 3 contact-form or newsletter attempts per IP, per hour.</div></div>
          <div class="hb-learn-card"><dt>Fail open</dt><dd>When a safety tool breaks, it lets everyone through rather than blocking everyone — a broken lock left open, never welded shut.</dd><div class="hb-real"><b>On your site:</b> a real bug was found and fixed this session where a broken Upstash setting was crashing requests instead of failing open as intended.</div></div>
          <div class="hb-learn-card"><dt>Sliding window</dt><dd>A rate limit that counts the last rolling hour, not a clock that resets exactly on the hour.</dd><div class="hb-real"><b>On your site:</b> your limiter uses this specifically so nobody can send 3, wait for a clean reset at the top of the hour, then send 3 more seconds later.</div></div>
          <div class="hb-learn-card"><dt>429</dt><dd>The web's standard code for "too many requests" — not a broken site, a deliberate stop sign.</dd><div class="hb-real"><b>On your site:</b> the exact response is "Too many messages. Please try again in an hour."</div></div>
          <div class="hb-learn-card"><dt>Enumeration protection</dt><dd>Giving the exact same response every time, so a form can never be used to test who's already on a list.</dd><div class="hb-real"><b>On your site:</b> subscribing a brand-new email and a long-confirmed one produce word-for-word identical success messages.</div></div>
          <div class="hb-learn-card"><dt>Link prefetching</dt><dd>Email apps automatically open links inside a message to scan them for safety — before a human ever clicks.</dd><div class="hb-real"><b>On your site:</b> this is exactly why unsubscribe opens a page with a button, not a plain link — a plain link would get silently clicked by the scanner and remove people who never asked to leave.</div></div>
        </div>
      </div>

      <div class="hb-learn-group">
        <div class="hb-learn-head"><span class="hb-learn-icon">⌨</span><h3>Working with code and Git like a developer does</h3><span class="hb-learn-count">5 things</span></div>
        <div class="hb-learn-grid">
          <div class="hb-learn-card"><dt>Idempotent</dt><dd>Running the same thing twice changes nothing beyond the first time.</dd><div class="hb-real"><b>On your site:</b> a post claims its own database row before any email goes out — so a second identical "publish" ping harmlessly does nothing instead of emailing everyone twice.</div></div>
          <div class="hb-learn-card"><dt>Commit vs. push</dt><dd>A commit saves a snapshot on your own machine. A push actually sends it to GitHub.</dd><div class="hb-real"><b>On your site:</b> Claude Code always commits; you decide when to push, by design.</div></div>
          <div class="hb-learn-card"><dt>Merge conflict</dt><dd>Two people (or machines) changed the exact same lines differently — Git refuses to guess, and asks a human to decide.</dd><div class="hb-real"><b>On your site:</b> this actually happened mid-way through building the newsletter, between two different PCs, and had to be resolved by hand.</div></div>
          <div class="hb-learn-card"><dt>Serverless</dt><dd>Your code doesn't live on one fixed machine — a different, temporary one might answer each visit.</dd><div class="hb-real"><b>On your site:</b> this is exactly why the rate-limit counter couldn't just live in a code variable — it had to live in Upstash, somewhere every temporary machine can share.</div></div>
          <div class="hb-learn-card"><dt>Stateless database calls</dt><dd>Instead of holding one long-open connection to a database, every single query is its own quick, separate round trip.</dd><div class="hb-real"><b>On your site:</b> Neon's driver was deliberately chosen this way, specifically because it matches how Vercel's temporary, serverless machines actually work.</div></div>
        </div>
      </div>
    </section>

    <section class="hb-chapter hb-wide" id="uiux">
      <span class="hb-kicker">● Section 6</span>
      <h2>UI/UX &amp; design skill</h2>
      <p class="hb-lede">Building the backend wasn't the only skill in play here. Every page you approved involved real design decisions — this is the vocabulary for talking about them.</p>

      <div class="hb-learn-grid" style="margin-top:28px;">
        <div class="hb-learn-card"><dt>Design tokens</dt><dd>One single, official list of allowed spacing, colour and size values, so nothing on the site is ever a random one-off number invented in the moment.</dd><div class="hb-real"><b>On your site:</b> <code class="mono">src/lib/tokens.ts</code> is the one file that decides every card's padding sitewide. Change it once, and it changes everywhere consistently — instead of hunting through dozens of pages by hand.</div></div>
        <div class="hb-learn-card"><dt>One typeface, not a mix</dt><dd>Hierarchy — what looks "bigger" or "more important" — comes from weight and size, not from stacking multiple font families together.</dd><div class="hb-real"><b>On your site:</b> Switzer is the one typeface, everywhere. This very handbook uses that same font, for that same reason.</div></div>
        <div class="hb-learn-card"><dt>A deliberate, permanent theme</dt><dd>One consistent visual mood, applied with real discipline — with exceptions only made on purpose and written down, never by accident.</dd><div class="hb-real"><b>On your site:</b> it's permanently dark, with exactly one documented exception (the homepage's "Why Choose Us" section flips to light on purpose) — a conscious, recorded decision, not a slip.</div></div>
        <div class="hb-learn-card"><dt>Motion as storytelling</dt><dd>Animation should explain something — draw the eye, show what changed — not just move because moving looks modern.</dd><div class="hb-real"><b>On your site:</b> the real mobile-lag bug from Phase 3 traced back to one specific blur-style animation phones struggled to render. A good-looking effect that performs badly is still a bad design choice.</div></div>
        <div class="hb-learn-card"><dt>One primary action per screen</dt><dd>A confident, solid button for the one thing you most want someone to do; a quieter outline button for everything else — never two loud buttons competing.</dd><div class="hb-real"><b>On your site:</b> the <code class="mono">.shiny-cta</code> (solid) and <code class="mono">.ghost-cta</code> (outline) button styles exist specifically to enforce this rule sitewide.</div></div>
        <div class="hb-learn-card"><dt>A named quality bar</dt><dd>Aiming at a specific, real standard of craft — not a vague "make it look nice."</dd><div class="hb-real"><b>On your site:</b> the target is explicitly "Awwards-tier" execution, with a written list of real reference sites to be measured against — see <code class="mono">docs/04-REFERENCES.md</code>.</div></div>
      </div>
    </section>

    <section class="hb-chapter hb-wide" id="code">
      <span class="hb-kicker">● Section 7</span>
      <h2>The code, in plain English</h2>
      <p class="hb-lede">No code is pasted below — just what each piece actually does, described in words.</p>

      <div class="hb-group-label">Pages you'd recognise</div>
      <div class="hb-table-wrap">
        <table>
          <thead><tr><th>Path</th><th>What it does</th><th>Real example</th></tr></thead>
          <tbody>
            <tr><td class="mono">src/app/page.tsx</td><td>The homepage</td><td class="hb-muted">What a Google search or a shared link opens first</td></tr>
            <tr><td class="mono">src/app/services/</td><td>The three core services, written out fully</td><td class="hb-muted">What a prospect reads before booking a call</td></tr>
            <tr><td class="mono">src/app/ai-visibility-geo/</td><td>The dedicated GEO landing page</td><td class="hb-muted">Where a paid-ad click for the AI-visibility pitch would land</td></tr>
            <tr><td class="mono">src/app/blogs/</td><td>The blog archive — every post, pulled live from WordPress</td><td class="hb-muted">Refreshes within an hour of publishing even if the instant ping never fires</td></tr>
            <tr><td class="mono">src/app/blog/[slug]/</td><td>One individual blog post</td><td class="hb-muted">e.g. <code class="mono">/blog/why-healthcare-...</code></td></tr>
            <tr><td class="mono">src/app/contact/</td><td>The contact form page</td><td class="hb-muted">—</td></tr>
            <tr><td class="mono">src/app/newsletter/confirmed/</td><td>What a subscriber sees after clicking confirm</td><td class="hb-muted">Also handles an expired-link message</td></tr>
            <tr><td class="mono">src/app/newsletter/unsubscribe/</td><td>The unsubscribe page, with its one button</td><td class="hb-muted">Deliberately a page + button, not a plain link</td></tr>
            <tr><td class="mono">5 legal pages</td><td>terms, privacy, refund-policy, disclaimer, cookie-policy</td><td class="hb-muted">Deliberately excluded from Google's search results</td></tr>
          </tbody>
        </table>
      </div>

      <div class="hb-group-label">API routes — URLs that DO things, not show pages</div>

      <div class="hb-route-card">
        <div class="hb-route-head"><span class="hb-route-method hb-post">POST</span><span class="hb-route-path">/api/contact</span></div>
        <dl class="hb-route-grid">
          <dt>Triggered by</dt><dd>Submitting the contact form</dd>
          <dt>Does</dt><dd>Checks it isn't a bot, checks rate limits, emails you the message, auto-replies to the visitor</dd>
          <dt>Returns</dt><dd>Success, or a specific error (bad fields, rate-limited, email service down)</dd>
          <dt>If it fails</dt><dd>The visitor sees a plain message telling them to email directly instead</dd>
        </dl>
      </div>
      <div class="hb-route-card">
        <div class="hb-route-head"><span class="hb-route-method hb-post">POST</span><span class="hb-route-path">/api/newsletter/subscribe</span></div>
        <dl class="hb-route-grid">
          <dt>Triggered by</dt><dd>The footer form, or the form under a blog post</dd>
          <dt>Does</dt><dd>Bot checks, rate limit, saves the email as 'pending', emails a confirm link</dd>
          <dt>Returns</dt><dd>The exact same message every time (enumeration protection — Section 5)</dd>
          <dt>If it fails</dt><dd>The row still saves; only the email is skipped, logged quietly</dd>
        </dl>
      </div>
      <div class="hb-route-card">
        <div class="hb-route-head"><span class="hb-route-method hb-get">GET</span><span class="hb-route-path">/api/newsletter/confirm</span></div>
        <dl class="hb-route-grid">
          <dt>Triggered by</dt><dd>Clicking the link in the confirmation email</dd>
          <dt>Does</dt><dd>Flips that subscriber to 'confirmed'</dd>
          <dt>Returns</dt><dd>Redirects to the confirmed page (or an expired-link version)</dd>
          <dt>If it fails</dt><dd>Shows the expired-link message — never a raw error</dd>
        </dl>
      </div>
      <div class="hb-route-card">
        <div class="hb-route-head"><span class="hb-route-method hb-post">POST</span><span class="hb-route-path">/api/newsletter/unsubscribe</span></div>
        <dl class="hb-route-grid">
          <dt>Triggered by</dt><dd>The unsubscribe page's button — or a mail app's built-in one-click unsubscribe</dd>
          <dt>Does</dt><dd>Marks that subscriber as 'unsubscribed'</dd>
          <dt>Returns</dt><dd>Always a clean success</dd>
          <dt>If it fails</dt><dd>It doesn't — built to never show an error</dd>
        </dl>
      </div>
      <div class="hb-route-card">
        <div class="hb-route-head"><span class="hb-route-method hb-post">POST</span><span class="hb-route-path">/api/newsletter/test-send</span></div>
        <dl class="hb-route-grid">
          <dt>Triggered by</dt><dd>You, manually — needs the same secret as revalidate below</dd>
          <dt>Does</dt><dd>Sends one preview email to one address you choose, identical to a real send</dd>
          <dt>Returns</dt><dd>Success, or 401 if the secret is wrong</dd>
          <dt>If it fails</dt><dd>Nothing is written anywhere — never touches real subscribers</dd>
        </dl>
      </div>
      <div class="hb-route-card">
        <div class="hb-route-head"><span class="hb-route-method hb-post">POST</span><span class="hb-route-path">/api/revalidate</span></div>
        <dl class="hb-route-grid">
          <dt>Triggered by</dt><dd>WordPress on publish (intended, unconfirmed) — or the 1-hour fallback, or manually</dd>
          <dt>Does</dt><dd>Clears the cached blog so a new post shows up immediately, then emails every confirmed subscriber</dd>
          <dt>Returns</dt><dd>A simple confirmation — the newsletter step can never make this fail</dd>
          <dt>If it fails</dt><dd>Cache-clearing still happens even if the email step errors — deliberate</dd>
        </dl>
      </div>

      <div class="hb-group-label">lib/ — the helpers every route shares</div>
      <div class="hb-table-wrap">
        <table>
          <thead><tr><th>File</th><th>What it does</th><th>Who calls it</th></tr></thead>
          <tbody>
            <tr><td class="mono">src/lib/db.ts</td><td>The one connection to the Neon database</td><td class="hb-muted">Every newsletter route, and only those</td></tr>
            <tr><td class="mono">src/lib/rate-limit.ts</td><td>The shared "too many requests" counter, backed by Upstash</td><td class="hb-muted">Contact form + newsletter subscribe</td></tr>
            <tr><td class="mono">src/lib/email/template.ts</td><td>The one email design every outgoing email uses</td><td class="hb-muted">Every email the site sends</td></tr>
            <tr><td class="mono">src/lib/email/disposable.ts</td><td>A list of throwaway email domains to reject at signup</td><td class="hb-muted">Newsletter subscribe</td></tr>
            <tr><td class="mono">src/lib/newsletter/notify.ts</td><td>The whole blog-publish notification, batched in groups of 100</td><td class="hb-muted">revalidate + test-send</td></tr>
            <tr><td class="mono">src/lib/blog/wordpress.ts</td><td>Fetches and reshapes posts from WordPress's API</td><td class="hb-muted">Every blog page</td></tr>
            <tr><td class="mono">src/lib/tokens.ts</td><td>The single list of allowed spacing/colour/animation values</td><td class="hb-muted">Every component — see Section 6</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="hb-chapter hb-wide" id="database">
      <span class="hb-kicker">● Section 8</span>
      <h2>The database</h2>
      <p class="hb-lede">Two tables, live in Neon right now. Every column below was checked directly against the real database for this handbook.</p>

      <h3>subscribers</h3>
      <div class="hb-table-wrap">
        <table>
          <thead><tr><th>Column</th><th>Type</th><th>What it holds</th><th>Sample value</th></tr></thead>
          <tbody>
            <tr><td class="mono">id</td><td class="mono hb-muted">uuid</td><td>A unique internal ID for the row</td><td class="mono hb-muted">3f2a91c4-…</td></tr>
            <tr><td class="mono">email</td><td class="mono hb-muted">text</td><td>The subscriber's address</td><td class="mono hb-muted">dr.sample@example.com</td></tr>
            <tr><td class="mono">status</td><td class="mono hb-muted">text</td><td>Where they are in the opt-in flow</td><td class="mono hb-muted">'pending' · 'confirmed' · 'unsubscribed'</td></tr>
            <tr><td class="mono">token</td><td class="mono hb-muted">text</td><td>Their private confirm/unsubscribe key — never shown on any page</td><td class="mono hb-muted">(hidden by design)</td></tr>
            <tr><td class="mono">source</td><td class="mono hb-muted">text</td><td>Which form they signed up through</td><td class="mono hb-muted">'footer' · 'blog-post'</td></tr>
            <tr><td class="mono">ip_hash</td><td class="mono hb-muted">text</td><td>A scrambled, unreadable version of their signup IP</td><td class="mono hb-muted">a1b2c3…</td></tr>
            <tr><td class="mono">created_at</td><td class="mono hb-muted">timestamptz</td><td>When they signed up</td><td class="mono hb-muted">2026-08-26 06:44</td></tr>
            <tr><td class="mono">confirmed_at</td><td class="mono hb-muted">timestamptz</td><td>When they clicked confirm</td><td class="mono hb-muted">2026-08-26 06:47</td></tr>
            <tr><td class="mono">unsubscribed_at</td><td class="mono hb-muted">timestamptz</td><td>When (if ever) they left</td><td class="mono hb-muted">null</td></tr>
          </tbody>
        </table>
      </div>

      <h3>sent_posts</h3>
      <div class="hb-table-wrap">
        <table>
          <thead><tr><th>Column</th><th>Type</th><th>What it holds</th><th>Sample value</th></tr></thead>
          <tbody>
            <tr><td class="mono">post_slug</td><td class="mono hb-muted">text (primary key)</td><td>The post's URL slug — the duplicate-send guard</td><td class="mono hb-muted">why-ai-search-matters</td></tr>
            <tr><td class="mono">sent_at</td><td class="mono hb-muted">timestamptz</td><td>When the notification run happened</td><td class="mono hb-muted">2026-08-26 09:12</td></tr>
            <tr><td class="mono">recipient_count</td><td class="mono hb-muted">integer</td><td>How many people were actually emailed</td><td class="mono hb-muted">2</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Questions you'd realistically ask it</h3>
      <div class="hb-prose">
        <p><strong>"How many confirmed subscribers do I have?"</strong> — count the rows in <code class="mono">subscribers</code> where status equals 'confirmed'.</p>
        <p><strong>"Did last week's post actually get emailed out?"</strong> — look up its slug in <code class="mono">sent_posts</code>; no row means it never sent.</p>
        <p><strong>"How many people unsubscribed this month?"</strong> — count rows where <code class="mono">unsubscribed_at</code> falls in that month.</p>
        <p><strong>"Is anyone stuck never confirming?"</strong> — count rows still 'pending' after several days — a sign the email might not be arriving.</p>
      </div>
    </section>

    <section class="hb-chapter hb-wide" id="settings">
      <span class="hb-kicker">● Section 9</span>
      <h2>The settings</h2>
      <p class="hb-lede">Two tables: the passwords and keys the app needs (never shown — just their names and purpose), and the DNS records that make the domain work.</p>

      <h3>Table A — Environment variables</h3>
      <div class="hb-table-wrap">
        <table>
          <thead><tr><th>Name</th><th>What it's for</th><th>Where the value comes from</th><th>What breaks if missing</th></tr></thead>
          <tbody>
            <tr><td class="mono">RESEND_API_KEY</td><td>Lets the app send email through Resend</td><td class="hb-muted">resend.com → API Keys</td><td class="hb-muted">Contact form fails loudly; newsletter emails silently skip sending</td></tr>
            <tr><td class="mono">DATABASE_URL</td><td>Connects to the Neon database</td><td class="hb-muted">Neon dashboard → Connection string</td><td class="hb-muted">Every newsletter route fails</td></tr>
            <tr><td class="mono">CONTACT_TO_EMAIL</td><td>Which inbox contact notifications go to</td><td class="hb-muted">You choose it — optional</td><td class="hb-muted">Falls back to ritik@boostwebdigital.com automatically</td></tr>
            <tr><td class="mono">UPSTASH_REDIS_REST_URL</td><td>Address of the rate-limit counter</td><td class="hb-muted">Upstash dashboard → REST API</td><td class="hb-muted">Rate limiting fails open — nothing else breaks</td></tr>
            <tr><td class="mono">UPSTASH_REDIS_REST_TOKEN</td><td>The password for that counter</td><td class="hb-muted">Same Upstash screen</td><td class="hb-muted">Same as above</td></tr>
            <tr><td class="mono">WP_API_URL</td><td>Where to fetch blog posts from</td><td class="hb-muted">Your WordPress REST root</td><td class="hb-muted">Blog pages show no posts</td></tr>
            <tr><td class="mono">REVALIDATE_SECRET</td><td>Proves a "post published" ping is real</td><td class="hb-muted">You invent it — any random string</td><td class="hb-muted">Anyone could trigger the notify system or clear the cache</td></tr>
            <tr><td class="mono">NEXT_PUBLIC_GA_ID</td><td>Your Google Analytics ID</td><td class="hb-muted">analytics.google.com → Data Streams</td><td class="hb-muted">No visitor tracking; site still works</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Table B — DNS records at Namecheap</h3>
      <p class="hb-prose" style="margin-top:-6px; font-size:0.88rem; color:var(--muted);">Looked up directly for this handbook, not guessed — confirm exact values in Namecheap before changing anything.</p>
      <div class="hb-table-wrap">
        <table>
          <thead><tr><th>Type</th><th>Host</th><th>Points to</th><th>Why it exists</th></tr></thead>
          <tbody>
            <tr><td class="hb-tag">A</td><td class="mono">@</td><td class="mono hb-muted">216.198.79.1</td><td>The main site — Vercel's address</td></tr>
            <tr><td class="hb-tag">A</td><td class="mono">blog</td><td class="mono hb-muted">178.16.136.160</td><td>The WordPress blog — Hostinger's address</td></tr>
            <tr><td class="hb-tag">MX</td><td class="mono">@</td><td class="mono hb-muted">smtp.google.com</td><td>Routes ritik@/contact@ mail to Google Workspace</td></tr>
            <tr><td class="hb-tag">TXT (SPF)</td><td class="mono">@</td><td class="mono hb-muted">v=spf1 include:_spf.google.com ~all</td><td>Google is allowed to send as your domain</td></tr>
            <tr><td class="hb-tag">TXT (SPF)</td><td class="mono">send</td><td class="mono hb-muted">v=spf1 include:amazonses.com ~all</td><td>Authorises Resend to send as hello@</td></tr>
            <tr><td class="hb-tag">MX</td><td class="mono">send</td><td class="mono hb-muted">feedback-smtp.ap-northeast-1&#8203;.amazonses.com</td><td>Handles Resend's bounce feedback</td></tr>
            <tr><td class="hb-tag">TXT (DKIM)</td><td class="mono">resend._domainkey</td><td class="mono hb-muted">present, verified</td><td>Seal proving a Resend email wasn't tampered with</td></tr>
            <tr><td class="hb-tag">TXT (DKIM)</td><td class="mono">google._domainkey</td><td class="mono hb-muted">present, verified</td><td>Same seal, for Workspace's own mail</td></tr>
            <tr><td class="hb-tag">TXT (DMARC)</td><td class="mono">_dmarc</td><td class="mono hb-muted">v=DMARC1; p=none; rua=mailto:ritik@…</td><td>What happens when SPF/DKIM fail — see below</td></tr>
          </tbody>
        </table>
      </div>
      <p class="hb-prose" style="margin-top:14px; font-size:0.88rem; color:var(--muted);">
        ⚠ <strong>One honest nuance:</strong> the DMARC record says <code class="mono">p=none</code> — <em>monitor-only</em> mode. It emails you a report but doesn't yet instruct other mail servers to reject spoofed mail. A safe first step, not a bug.
      </p>

      <div class="hb-trap-box">
        <h4>⚠ The trap that has caught you three times</h4>
        <p><strong>Vercel keeps a separate copy of every environment variable for Production, Preview, and Development.</strong> Setting one doesn't set the others.</p>
        <p><strong>Real example that actually happened:</strong> <code class="mono">WP_API_URL</code> was set only for Development. Production ran with no value — the live blog went blank — even though it worked perfectly on your own machine.</p>
        <p><strong>The fix, every time:</strong> tick all three environments unless you have a specific reason not to. <code class="mono">vercel env pull</code> only grabs Development by default.</p>
      </div>
    </section>

    <section class="hb-chapter hb-wide" id="breaks">
      <span class="hb-kicker">● Section 10</span>
      <h2>When something breaks</h2>
      <p class="hb-lede">Written in the words you'd actually use, not the technical name for the problem.</p>
      <div class="hb-table-wrap">
        <table>
          <thead><tr><th>What you'd notice</th><th>Most likely cause</th><th>How to check</th><th>How to fix</th></tr></thead>
          <tbody>
            <tr><td>Contact form emails aren't arriving</td><td class="hb-muted">Missing/expired Resend key</td><td class="hb-muted">Vercel → Settings → Env Vars → confirm RESEND_API_KEY for Production</td><td class="hb-muted">Refresh the key at resend.com, redeploy</td></tr>
            <tr><td>My emails land in spam</td><td class="hb-muted">SPF/DKIM/DMARC issue, or DMARC still monitor-only</td><td class="hb-muted">mail-tester.com — send a test and read the score</td><td class="hb-muted">Compare against Table B in Section 9</td></tr>
            <tr><td>A new blog post isn't showing</td><td class="hb-muted">1-hour cache hasn't refreshed, or the publish webhook never fired</td><td class="hb-muted">Wait an hour and recheck</td><td class="hb-muted">Call <code class="mono">POST /api/revalidate?secret=…</code> yourself with the slug</td></tr>
            <tr><td>Newsletter confirmation emails aren't arriving</td><td class="hb-muted">Same as contact-form email issues</td><td class="hb-muted">Check RESEND_API_KEY first</td><td class="hb-muted">Same fix; check Resend's dashboard for a bounce</td></tr>
            <tr><td>A new post didn't trigger any notification email</td><td class="hb-muted">Webhook unconfirmed, zero confirmed subscribers, or already sent once</td><td class="hb-muted">Vercel → Logs → search "newsletter"</td><td class="hb-muted">Use <code class="mono">/api/newsletter/test-send</code> to prove the email itself works</td></tr>
            <tr><td>"Database error" on a newsletter route</td><td class="hb-muted">DATABASE_URL missing/wrong, or Neon project paused</td><td class="hb-muted">console.neon.tech — confirm it's active</td><td class="hb-muted">Re-copy the connection string, update Vercel, redeploy</td></tr>
            <tr><td><code class="mono">npm run build</code> fails</td><td class="hb-muted">A real code error, or out-of-date dependencies</td><td class="hb-muted">Read the actual error text — it names the file</td><td class="hb-muted">Run <code class="mono">npm install</code> first; else paste the error into Claude Code</td></tr>
            <tr><td>The whole site is down</td><td class="hb-muted">A bad deploy</td><td class="hb-muted">Vercel → Deployments — latest one "Ready" or "Error"?</td><td class="hb-muted">Deployments → previous good one → <strong>Instant Rollback</strong></td></tr>
            <tr><td>You pushed a change but the site looks unchanged</td><td class="hb-muted">Vercel served a stale cached build</td><td class="hb-muted">Deployments → confirm a new one actually ran</td><td class="hb-muted">Redeploy with "Use existing Build Cache" unticked</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="hb-chapter" id="routines">
      <span class="hb-kicker">● Section 11</span>
      <h2>The routines</h2>
      <p class="hb-lede">Copy-pasteable, step by step, for the things you'll actually do again and again.</p>

      <div class="hb-routine">
        <h4>🔁 Switching between your two PCs</h4>
        <ol class="hb-steps">
          <li><strong>Before you stop working:</strong> <code>git push</code> — don't just commit, actually send it to GitHub.</li>
          <li>On the machine you're switching to: <code>cd</code> into the project folder.</li>
          <li>Run <code>git pull</code>.</li>
          <li>Run <code>npm install</code>.</li>
          <li>Run <code>git status -sb</code> — must say up to date with <code>origin/main</code>. If not, pull again before touching anything.</li>
        </ol>
      </div>
      <div class="hb-routine">
        <h4>📝 Publishing a blog post — what happens automatically</h4>
        <ol class="hb-steps">
          <li>Write and click Publish, as normal, inside WordPress.</li>
          <li>WordPress is meant to ping <code>/api/revalidate</code> immediately — not yet confirmed firing.</li>
          <li>Either way, the 1-hour fallback guarantees the post appears within an hour.</li>
          <li>The moment the cache clears, every confirmed subscriber gets emailed automatically.</li>
          <li>Nothing else needs touching — that's the entire point of the headless setup.</li>
        </ol>
      </div>
      <div class="hb-routine">
        <h4>🔑 Adding a new environment variable</h4>
        <ol class="hb-steps">
          <li>Vercel → your project → Settings → Environment Variables.</li>
          <li>Add the name and value — tick <strong>Production, Preview, and Development</strong> all three.</li>
          <li>Redeploy — a change doesn't apply to a deployment that already ran.</li>
          <li>Locally: <code>vercel env pull .env.local --yes</code>.</li>
          <li>Never paste the actual value into a chat, doc, or commit.</li>
        </ol>
      </div>
      <div class="hb-routine">
        <h4>🚀 Deploying a change</h4>
        <ol class="hb-steps">
          <li>Make the change (yourself, or via Claude Code).</li>
          <li>Confirm <code>npm run build</code> passes with no red errors.</li>
          <li><code>git add</code>, <code>git commit</code> with a real message.</li>
          <li><code>git push</code> — the actual "go live" moment.</li>
          <li>Open the live site and check the specific thing you changed.</li>
        </ol>
      </div>
      <div class="hb-routine">
        <h4>📬 Reading your leads</h4>
        <ol class="hb-steps">
          <li>Contact-form submissions land as an email to ritik@ (or contact@) — check that inbox first, always.</li>
          <li>Reply directly from there — the auto-reply already told the visitor you'll respond within one business day.</li>
        </ol>
      </div>
      <div class="hb-routine">
        <h4>✉️ Sending a test newsletter before the real one</h4>
        <ol class="hb-steps">
          <li>Call <code>POST /api/newsletter/test-send?secret=…</code> with a real slug and your own email.</li>
          <li>Check the subject, the logo, and that "Read the post" goes to <code>boostwebdigital.com/blog/…</code>, not WordPress's domain.</li>
          <li>Never touches the real subscriber list — safe to run as many times as you like.</li>
        </ol>
      </div>
      <div class="hb-routine">
        <h4>🔐 Rotating a leaked key</h4>
        <ol class="hb-steps">
          <li>Go to that service's dashboard and generate a new key.</li>
          <li>Update it in Vercel → Environment Variables, all three environments.</li>
          <li>Update local <code>.env.local</code> via <code>vercel env pull .env.local --yes</code>.</li>
          <li>Redeploy.</li>
          <li>Revoke the old key once the new one is confirmed working.</li>
        </ol>
      </div>
    </section>

    <section class="hb-chapter" id="rebuild">
      <span class="hb-kicker">● Section 12</span>
      <h2>If you had to rebuild it from zero</h2>
      <p class="hb-lede">Your insurance policy. The order to create every account in, so nothing depends on something that doesn't exist yet.</p>
      <ol class="hb-rebuild-list">
        <li>Register the domain at Namecheap.</li>
        <li>Create a GitHub account and a private repository for the code.</li>
        <li>Create a Vercel account, connect it to that repository, deploy once — it'll be broken, that's fine, it proves the pipe works.</li>
        <li>Point Namecheap's DNS at Vercel for the root domain.</li>
        <li>Set up Google Workspace, verify it with the MX record Namecheap needs.</li>
        <li>Create a Resend account, verify a sending subdomain, add its SPF/DKIM/MX records to Namecheap.</li>
        <li>Create a Neon account and database — copy its connection string into Vercel as <code class="mono">DATABASE_URL</code>.</li>
        <li>Create an Upstash Redis database — copy its two values into Vercel.</li>
        <li>Set up Hostinger, install WordPress, point <code class="mono">blog.</code> at it in Namecheap.</li>
        <li>Add every environment variable from Section 9, Table A, into Vercel — all three environments.</li>
        <li>Create a Google Analytics 4 property, add its ID.</li>
        <li>Verify the domain in Google Search Console and submit the sitemap.</li>
        <li>Redeploy — everything should now actually work end to end.</li>
      </ol>
    </section>

    <section class="hb-chapter hb-wide" id="next-skills">
      <span class="hb-kicker">● Section 13</span>
      <h2>What to learn next</h2>
      <p class="hb-lede">Every skill on this page connects to something bigger. Here's exactly how what you already know feeds the next piece of the shop.</p>

      <div class="hb-connect-list">
        <div class="hb-connect-item">
          <div class="hb-connect-know"><div class="hb-connect-eyebrow">You already know</div><div class="hb-connect-title">Rate limiting &amp; fail open</div><div class="hb-connect-body">From the contact form and newsletter — capping abuse without ever blocking a real visitor.</div></div>
          <div class="hb-connect-arrow">→</div>
          <div class="hb-connect-next"><div class="hb-connect-eyebrow">So next you can learn</div><div class="hb-connect-title">Spending caps on AI calls</div><div class="hb-connect-body">The AI Visibility Checker calls a paid AI service per visitor. The exact same capping instinct now protects your wallet, not just your inbox.</div></div>
        </div>
        <div class="hb-connect-item">
          <div class="hb-connect-know"><div class="hb-connect-eyebrow">You already know</div><div class="hb-connect-title">ip_hash on every subscriber</div><div class="hb-connect-body">Storing a scrambled visitor identifier instead of a raw, personal one.</div></div>
          <div class="hb-connect-arrow">→</div>
          <div class="hb-connect-next"><div class="hb-connect-eyebrow">So next you can learn</div><div class="hb-connect-title">Anonymous visitor sessions</div><div class="hb-connect-body">The Checker needs to remember a visitor briefly without ever asking them to log in — the same privacy-first habit, applied one level further.</div></div>
        </div>
        <div class="hb-connect-item">
          <div class="hb-connect-know"><div class="hb-connect-eyebrow">You already know</div><div class="hb-connect-title">Section 10's troubleshooting table</div><div class="hb-connect-body">What breaks, how you'd notice, how you'd check.</div></div>
          <div class="hb-connect-arrow">→</div>
          <div class="hb-connect-next"><div class="hb-connect-eyebrow">So next you can learn</div><div class="hb-connect-title">Monitoring &amp; alerts</div><div class="hb-connect-body">The same instinct, running automatically — so you're told before a customer ever has to.</div></div>
        </div>
        <div class="hb-connect-item">
          <div class="hb-connect-know"><div class="hb-connect-eyebrow">You already know</div><div class="hb-connect-title">Design tokens (Section 6)</div><div class="hb-connect-body">One file that controls spacing/colour everywhere, changed once.</div></div>
          <div class="hb-connect-arrow">→</div>
          <div class="hb-connect-next"><div class="hb-connect-eyebrow">So next you can learn</div><div class="hb-connect-title">Scaling to 100 pages</div><div class="hb-connect-body">The planned 100-URL content build leans entirely on this discipline — it's the only reason 100 pages can share one consistent look without fixing each by hand.</div></div>
        </div>
        <div class="hb-connect-item">
          <div class="hb-connect-know"><div class="hb-connect-eyebrow">A different kind of skill</div><div class="hb-connect-title">Everything above is technical</div><div class="hb-connect-body">Infrastructure, code, design systems.</div></div>
          <div class="hb-connect-arrow">→</div>
          <div class="hb-connect-next"><div class="hb-connect-eyebrow">So next you can learn</div><div class="hb-connect-title">Personal-brand-as-CEO</div><div class="hb-connect-body">Writing and presenting, not code — you named this as a real goal, and no amount of backend skill unlocks it on its own. Worth its own separate plan.</div></div>
        </div>
      </div>
    </section>

    <section class="hb-chapter hb-wide" id="words">
      <span class="hb-kicker">● Section 14</span>
      <h2>Quick glossary</h2>
      <p class="hb-lede">A fast lookup for any term used anywhere on this page — the deeper story for most of these is in Section 5.</p>
      <dl class="hb-glossary-grid">
        <div class="hb-g-term"><dt>API</dt><dd>A fixed way for two pieces of software to talk — like a restaurant menu: fixed options, predictable results.</dd></div>
        <div class="hb-g-term"><dt>API route</dt><dd>A URL on your site that does something instead of showing a page.</dd></div>
        <div class="hb-g-term"><dt>Environment variable</dt><dd>A setting or secret the code reads at run time, instead of being typed directly into the code.</dd></div>
        <div class="hb-g-term"><dt>Cache</dt><dd>A saved copy kept around so the real, slower source isn't re-fetched every time.</dd></div>
        <div class="hb-g-term"><dt>Revalidation</dt><dd>Deliberately throwing away a cached copy so the next visitor gets a fresh one.</dd></div>
        <div class="hb-g-term"><dt>Webhook</dt><dd>One system automatically pinging another the moment something happens.</dd></div>
        <div class="hb-g-term"><dt>Headless CMS</dt><dd>A writing/storage system used purely for its content — its own visual theme switched off, another site displays it.</dd></div>
        <div class="hb-g-term"><dt>ISR</dt><dd>Next.js quietly rebuilding one page in the background on a schedule, instead of the whole site.</dd></div>
        <div class="hb-g-term"><dt>Schema markup</dt><dd>Invisible structured facts about your business, written for machines to read.</dd></div>
        <div class="hb-g-term"><dt>Repository ("repo")</dt><dd>The whole project's code and its full history, in one place.</dd></div>
        <div class="hb-g-term"><dt>Pull</dt><dd>Downloading whatever changes exist on GitHub that your machine doesn't have yet.</dd></div>
        <div class="hb-g-term"><dt>Branch</dt><dd>A separate, safe parallel copy of the code to experiment on.</dd></div>
        <div class="hb-g-term"><dt>Batch send</dt><dd>Sending many emails in one request instead of one at a time.</dd></div>
        <div class="hb-g-term"><dt>Token</dt><dd>A long random string used as a private key.</dd></div>
        <div class="hb-g-term"><dt>Double opt-in</dt><dd>Type your email, click a confirm link — only then are you actually subscribed.</dd></div>
      </dl>
    </section>

    <section class="hb-chapter" id="next">
      <span class="hb-kicker">● Section 15</span>
      <h2>What I'd do next</h2>
      <p class="hb-lede">My honest opinion, ranked, having read the actual code and configuration rather than the plan for it.</p>
      <div class="hb-rank-list">
        <div class="hb-rank-item"><span class="hb-rank-num">1</span><div>
          <h4>Confirm the WordPress → revalidate webhook is really firing</h4>
          <p>The whole blog-publish notification system is running on an unproven connection — <code class="mono">docs/08-CMS.md</code> says outright "the route exists; nothing calls it yet." The 1-hour fallback is hiding the problem: the blog LOOKS instant because of it. A 15-minute check (publish a real post, watch Vercel's logs for a hit on <code class="mono">/api/revalidate</code> within seconds) closes the single biggest unknown in the system.</p>
        </div></div>
        <div class="hb-rank-item"><span class="hb-rank-num">2</span><div>
          <h4>Fix the Development-environment Upstash placeholder</h4>
          <p>Confirmed directly this session: rate limiting is silently disabled whenever local testing happens, because the Development copy of <code class="mono">UPSTASH_REDIS_REST_URL</code> in Vercel is a placeholder. Five minutes in Upstash's dashboard fixes it.</p>
        </div></div>
        <div class="hb-rank-item"><span class="hb-rank-num">3</span><div>
          <h4>Either wire up Microsoft Clarity, or stop claiming you have it</h4>
          <p>Your privacy and cookie policy pages disclose session tracking that doesn't exist in the code. A five-minute install, or a rewritten sentence — either closes a gap worth closing before someone else notices it first.</p>
        </div></div>
      </div>
      <p class="hb-prose" style="margin-top:26px; font-size:0.9rem; color:var(--muted);">
        Smaller things worth a look: only 1 of 9 real pages is indexed in Search Console per the last session's notes — worth re-checking; and the DMARC record is monitor-only (<code class="mono">p=none</code>), a safe start but not yet real protection against domain spoofing.
      </p>
    </section>

    <footer class="hb-end">
      Built from the real project — code, configuration, git history, and live DNS lookups. No invented numbers, no invented features. Where something couldn't be verified, it says so.
    </footer>

  </main>
</div>
</div>
`;

const SCRIPT_JS = `
  (function () {
    var toggle = document.getElementById('hbNavToggle');
    var sidebar = document.getElementById('hbSidebar');
    if (toggle) {
      toggle.addEventListener('click', function () {
        sidebar.classList.toggle('open');
      });
    }

    var links = Array.prototype.slice.call(document.querySelectorAll('.hb-nav-link'));
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
        l.classList.toggle('hb-active', l.getAttribute('href') === '#' + current.id);
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
