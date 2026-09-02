"use client";

/**
 * PART 5 — no PDF library, no headless browser. window.print() plus the
 * print stylesheet (.checker-report-print-doc in globals.css) does the
 * work; the visitor's own browser "Save as PDF" turns that into a file.
 * The only reason this is a client component at all — everything else on
 * the report page is server-rendered.
 */
export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="shiny-cta print:hidden">
      <span>Download PDF</span>
    </button>
  );
}
