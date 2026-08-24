import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@/components/Analytics";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://boostwebdigital.com"),
  title: {
    default: "Boost Web Digital — Healthcare Marketing Agency",
    template: "%s | Boost Web Digital",
  },
  description:
    "Boost Web Digital is a healthcare-only marketing agency — SEO, Google Ads, and AI-search visibility for dental, dermatology, med spa, and hair restoration practices.",
};

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Switzer — the one sitewide typeface (replaces the earlier Fraunces/Geist
 * pairing, per explicit instruction, 2026-08-15). Hierarchy now comes from
 * weight/size/tracking contrast, not a serif/sans family contrast — see
 * docs/12-DESIGN-STANDARDS.md §2.2 and docs/02-BRAND.md. Geist Mono above
 * stays untouched as the separate technical/label register.
 */
const switzer = localFont({
  src: [
    { path: "../fonts/switzer/Switzer-Thin.woff2", weight: "100", style: "normal" },
    { path: "../fonts/switzer/Switzer-ThinItalic.woff2", weight: "100", style: "italic" },
    { path: "../fonts/switzer/Switzer-Extralight.woff2", weight: "200", style: "normal" },
    { path: "../fonts/switzer/Switzer-ExtralightItalic.woff2", weight: "200", style: "italic" },
    { path: "../fonts/switzer/Switzer-Light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/switzer/Switzer-LightItalic.woff2", weight: "300", style: "italic" },
    { path: "../fonts/switzer/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/switzer/Switzer-Italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/switzer/Switzer-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/switzer/Switzer-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../fonts/switzer/Switzer-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/switzer/Switzer-SemiboldItalic.woff2", weight: "600", style: "italic" },
    { path: "../fonts/switzer/Switzer-Bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/switzer/Switzer-BoldItalic.woff2", weight: "700", style: "italic" },
    { path: "../fonts/switzer/Switzer-Extrabold.woff2", weight: "800", style: "normal" },
    { path: "../fonts/switzer/Switzer-ExtraboldItalic.woff2", weight: "800", style: "italic" },
    { path: "../fonts/switzer/Switzer-Black.woff2", weight: "900", style: "normal" },
    { path: "../fonts/switzer/Switzer-BlackItalic.woff2", weight: "900", style: "italic" },
  ],
  variable: "--font-switzer",
  display: "swap",
  // Only the weights an individual page actually renders need to load —
  // `preload: true` (the default) force-preloads all 18 declared weight/
  // style files as render-blocking-priority requests on every single page,
  // competing with the page's own content for bandwidth. `swap` already
  // guarantees text is never invisible while a weight loads.
  preload: false,
});

/**
 * Preloads only the two weights every page actually needs above the fold —
 * Regular 400 (default body/paragraph text) and Medium 500 (the sticky
 * Navbar's CTA button, `.shiny-cta`/`.ghost-cta` in globals.css) — instead of
 * the ~230ms/70KB critical-chain cost of the browser discovering all of them
 * itself. Deliberately unused below: `localFont()`'s preload behavior is a
 * build-time side effect of the call itself, not of consuming its return
 * value, so this never touches `--font-switzer` or risks colliding with the
 * `switzer` object above — every other weight still loads exactly as before.
 */
const switzerCriticalPreload = localFont({
  src: [
    { path: "../fonts/switzer/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/switzer/Switzer-Medium.woff2", weight: "500", style: "normal" },
  ],
  preload: true,
});
void switzerCriticalPreload;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${switzer.variable} ${geistMono.variable}`}>
        {children}
        <Analytics />
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
