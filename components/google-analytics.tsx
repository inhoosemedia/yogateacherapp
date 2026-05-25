import Script from "next/script";

/**
 * Google Ads / gtag.js loader. Renders the two script tags exactly the way
 * Google ships them, only when NEXT_PUBLIC_GOOGLE_ADS_ID is configured. Loads
 * with strategy="afterInteractive" so it never blocks initial render — page
 * views still fire because gtag('config', ID) sends the initial event when
 * the script executes.
 *
 * Supports either an AW- tag (Google Ads) or G- tag (GA4); they both consume
 * the same gtag.js bootstrap.
 *
 * After mount, fire custom conversions via `lib/gtag.ts`.
 */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  if (!id) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${id}', {
            send_page_view: true,
          });
        `}
      </Script>
    </>
  );
}
