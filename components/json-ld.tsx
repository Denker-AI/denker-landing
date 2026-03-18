const SITE_URL = "https://www.denker.ai";
const DESCRIPTION =
  "A limitless canvas workspace where your AI agents research, write, code, and automate — all visible in real time. No black boxes. No config hell.";

const schema = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Denker AI",
      url: SITE_URL,
      logo: `${SITE_URL}/logo/symbol-dark-green.svg`,
      sameAs: ["https://linkedin.com/company/denkerai"],
      description: DESCRIPTION,
    },
    {
      "@type": "WebSite",
      name: "Denker",
      url: SITE_URL,
      description: DESCRIPTION,
      publisher: { "@type": "Organization", name: "Denker AI" },
    },
    {
      "@type": "SoftwareApplication",
      name: "Denker",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: DESCRIPTION,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        description: "Free tier — 5 projects, 5 workflows, basic memory",
      },
    },
  ],
});

/**
 * Structured data for search engines.
 * Content is a static compile-time string — no user input, safe to inject.
 */
// eslint-disable-next-line react/no-danger
export function JsonLd() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />;
}
