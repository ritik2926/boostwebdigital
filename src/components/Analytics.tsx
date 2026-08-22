import Script from "next/script";

/**
 * Standard gtag.js snippet, nothing custom — no consent banner, no custom
 * events, no dataLayer abstraction (measurement first, refinement later).
 * Reads NEXT_PUBLIC_GA_ID (env var, not a literal, since the value differs
 * per environment) and renders nothing when it's unset, so preview deploys
 * and localhost don't pollute production analytics data.
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
