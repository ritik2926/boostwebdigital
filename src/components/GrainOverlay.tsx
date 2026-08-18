import { Z_INDEX } from "@/lib/tokens";

/**
 * Ambient background system — grain (validated in /design-lab §5 Background
 * System). Extracted out of HomePage.tsx (where it was originally defined
 * inline, unexported) into its own shared file so other pages/routes can
 * reuse the exact same overlay instead of a second copy — first reused by
 * /contact/.
 */
export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 opacity-[0.035]"
      style={{
        zIndex: Z_INDEX.ambient,
        animation: "grain-shift 8s steps(2) infinite",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}
