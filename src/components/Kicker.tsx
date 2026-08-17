import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The one eyebrow/label treatment sitewide: a small capsule badge before a
 * heading. A single well-placed pill here is a normal editorial device —
 * not the "pills everywhere" pattern `feedback_avoid_ai_generated_look`
 * warns against (no glowing dots, no checkmark-in-pill chips, no fake
 * dashboards — that memory's broader points still stand).
 */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5", className)}>
      <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/85">{children}</span>
    </span>
  );
}
