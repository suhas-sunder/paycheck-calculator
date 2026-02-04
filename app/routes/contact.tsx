// routes/contact.tsx
import type { Route } from "./+types/contact";

export const meta: Route.MetaFunction = () => [
  { title: "Contact | PaycheckConverter.com" },
  {
    name: "description",
    content:
      "Contact PaycheckConverter.com for feedback, corrections, or questions about our paycheck conversion and take-home pay calculators, assumptions, and results.",
  },
  { name: "robots", content: "index,follow" },
  {
    tagName: "link",
    rel: "canonical",
    href: "https://www.paycheckconverter.com/contact",
  },

  // Open Graph
  { property: "og:type", content: "website" },
  { property: "og:title", content: "Contact | PaycheckConverter.com" },
  {
    property: "og:description",
    content:
      "Send feedback, corrections, or questions about our paycheck conversion and take-home pay calculators, assumptions, and results.",
  },
  { property: "og:url", content: "https://www.paycheckconverter.com/contact" },
  { property: "og:site_name", content: "PaycheckConverter.com" },

  // Twitter
  { name: "twitter:card", content: "summary" },
  { name: "twitter:title", content: "Contact | PaycheckConverter.com" },
  {
    name: "twitter:description",
    content:
      "Send feedback, corrections, or questions about our paycheck conversion and take-home pay calculators, assumptions, and results.",
  },
];

export default function Contact() {
  const pageName = "Contact";
  const canonicalUrl = "https://www.paycheckconverter.com/contact";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.paycheckconverter.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: pageName,
        item: canonicalUrl,
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PaycheckConverter.com",
    url: "https://www.paycheckconverter.com",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageName,
    url: canonicalUrl,
  };

  return (
    <main className="bg-white text-slate-700 antialiased min-h-screen">
      <section className="max-w-5xl mx-auto px-6 py-12 flex items-center">
        <div className="w-full">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight text-center">
            Contact
          </h1>

          <p className="mt-4 text-slate-700 text-center max-w-2xl mx-auto leading-relaxed">
            This page is for feedback and corrections. If something looks off in
            a result, include the pay amount, the source period, your pay
            frequency, and any assumptions you used.
          </p>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-slate-900">Email</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Send us a message at:
            </p>

            <p className="mt-4 text-base font-semibold text-slate-900">
              <a
                href="mailto:hello@paycheckconverter.com"
                className="cursor-pointer text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                hello@paycheckconverter.com
              </a>
            </p>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <h3 className="text-sm font-semibold text-slate-900">
                What to include
              </h3>
              <ul className="mt-2 list-disc ml-5 text-sm text-slate-700 space-y-1 leading-relaxed">
                <li>Pay amount and currency</li>
                <li>From period and to period</li>
                <li>Pay frequency (weekly, biweekly, etc.)</li>
                <li>Your expected result (and why)</li>
                <li>A screenshot or URL of the page (optional)</li>
              </ul>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <h3 className="text-sm font-semibold text-slate-900">Notes</h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                PaycheckConverter.com provides planning and comparison math
                based on your inputs and the assumptions shown on the page.
                Results do not model employer-specific payroll calendars, tax
                tables, or jurisdiction logic unless a tool explicitly says it
                does.
              </p>
            </div>
          </div>

          <p className="mt-10 text-xs text-slate-600 text-center leading-relaxed">
            Tools on this site are for informational, planning, and comparison
            purposes only. Results are estimates based on your inputs and the
            assumptions shown. This website does not provide financial, legal,
            or tax advice. Always confirm compensation terms, schedules, and
            policies in your offer letter, contract, or employer documentation.
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
    </main>
  );
}
