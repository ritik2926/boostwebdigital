"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

// lucide-react dropped brand/social marks a while back — inline paths for
// the three platforms this rail links to, matched to its 18px icon scale.
function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.9 2H22l-7.6 8.7L23.3 22H16.6l-5.2-6.8L5.4 22H2.3l8.1-9.3L1.7 2h6.9l4.7 6.2L18.9 2Zm-1.2 18.2h1.7L7.4 3.7H5.6l12.1 16.5Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.5 21.5v-8.2h2.75l.41-3.19h-3.16V8.1c0-.92.26-1.55 1.58-1.55h1.68V3.7c-.29-.04-1.29-.13-2.45-.13-2.43 0-4.09 1.48-4.09 4.2v2.34H7.47v3.19h2.75v8.2h3.28Z" />
    </svg>
  );
}

// h-11/w-11 (44px) rather than the spec's literal 40px — 12-DESIGN-STANDARDS.md
// §9's 44×44px touch-target floor is a locked, no-exceptions rule; the icon
// itself stays 18px so the visual weight barely changes.
const ICON_BUTTON = "flex h-11 w-11 items-center justify-center rounded-full border border-white/8 text-white/60 transition-colors hover:border-white/25 hover:bg-white/5 hover:text-white";

export function ShareRail({ url, title, className }: { url: string; title: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className={cn("flex items-center gap-3 xl:flex-col", className)}>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={ICON_BUTTON}
      >
        <XIcon />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={ICON_BUTTON}
      >
        <LinkedInIcon />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className={ICON_BUTTON}
      >
        <FacebookIcon />
      </a>
      <button onClick={handleCopy} aria-label={copied ? "Link copied" : "Copy link"} className={cn(ICON_BUTTON, "relative")}>
        {copied ? <Check className="h-[18px] w-[18px] text-accent" aria-hidden /> : <Link2 className="h-[18px] w-[18px]" aria-hidden />}
        {copied && (
          <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/8 bg-[#0b0b0f] px-2 py-1 text-xs text-white/80 xl:left-full xl:top-1/2 xl:mt-0 xl:ml-2 xl:-translate-x-0 xl:-translate-y-1/2">
            Copied
          </span>
        )}
      </button>
    </div>
  );
}
