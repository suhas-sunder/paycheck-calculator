/* eslint-disable react/no-unescaped-entities */

import * as React from "react";
import { Link } from "react-router";
import type { Route } from "./+types/cookies";

export const meta: Route.MetaFunction = () => [
  { title: "Cookie Policy | paycheckconverter.com" },
  {
    name: "description",
    content:
      "Read the paycheckconverter.com cookie policy. Learn how cookies and similar technologies are used on paycheckconverter.com, including analytics and advertising where applicable.",
  },
  {
    name: "keywords",
    content:
      "paycheckconverter cookie policy, cookies policy, cookies, analytics cookies, advertising cookies, tracking technologies, consent",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "paycheckconverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:site_name", content: "paycheckconverter.com" },
  { property: "og:title", content: "Cookie Policy | paycheckconverter.com" },
  {
    property: "og:description",
    content:
      "Learn how paycheckconverter.com uses cookies and similar technologies, including essential, analytics, and advertising cookies where applicable.",
  },
  { property: "og:url", content: "https://www.paycheckconverter.com/cookies" },
  { property: "og:image", content: "https://www.paycheckconverter.com/og-image.jpg" },
  { property: "og:image:alt", content: "paycheckconverter.com cookie policy" },
  { property: "og:locale", content: "en_US" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Cookie Policy | paycheckconverter.com" },
  {
    name: "twitter:description",
    content:
      "Learn how paycheckconverter.com uses cookies and similar technologies, including essential, analytics, and advertising cookies where applicable.",
  },
  { name: "twitter:image", content: "https://www.paycheckconverter.com/og-image.jpg" },

  { tagName: "link", rel: "canonical", href: "https://www.paycheckconverter.com/cookies" },
];

export default function CookiesPolicy() {
  const pageName = "Cookie Policy";

  
  const canonicalUrl = "https://www.paycheckconverter.com/cookies";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.paycheckconverter.com/",
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
    name: "paycheckconverter.com",
    url: "https://www.paycheckconverter.com/",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageName,
    url: canonicalUrl,
  };
return (
    <main className="bg-white text-slate-700 scroll-smooth antialiased">
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <header className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <nav className="text-sm text-slate-600 mb-4" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-md text-slate-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden className="opacity-60">
                /
              </li>
              <li aria-current="page" className="text-slate-800 font-semibold">
                {pageName}
              </li>
            </ol>
          </nav>

          <h1 className="text-4xl font-bold text-slate-900 mb-2">{pageName}</h1>
          <p className="text-sm text-slate-600">
            Last updated January 24, 2026
          </p>

          <div className="mt-5 space-y-4 text-slate-700 leading-relaxed">
            <p>
              This Cookie Policy explains how https://www.paycheckconverter.com
              ("Company", "we", "us", and "our") uses cookies and similar
              technologies to recognize you when you visit our website at
              https://www.paycheckconverter.com ("Website"). It explains what these
              technologies are and why we use them, as well as your choices to
              control our use of them.
            </p>

            <p>
              In some cases we may use cookies and similar technologies to
              collect personal information, or that becomes personal information
              if we combine it with other information. For more information
              about how we handle personal information, please see our Privacy
              Policy.
            </p>
          </div>
        </header>

        {/* Content */}
        <article className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="prose prose-slate max-w-none">
            <Section title="What are cookies?">
              <p>
                Cookies are small data files that are placed on your computer or
                mobile device when you visit a website. Cookies are widely used
                by website owners to make their websites work, or to work more
                efficiently, as well as to provide reporting information.
              </p>
              <p>
                Cookies set by the website owner (in this case,
                https://www.paycheckconverter.com) are called "first-party cookies."
                Cookies set by parties other than the website owner are called
                "third-party cookies." Third-party cookies enable third-party
                features or functionality to be provided on or through the
                website (for example, advertising, interactive content, and
                analytics). The parties that set these third-party cookies can
                recognize your device both when it visits the website in
                question and also when it visits certain other websites.
              </p>
            </Section>

            <Section title="Why do we use cookies?">
              <p>
                We use first- and third-party cookies for several reasons. Some
                cookies are required for technical reasons in order for our
                Website to operate, and we refer to these as "essential" or
                "strictly necessary" cookies. Other cookies enable us to
                understand how our Website is used and to improve performance
                and user experience. We may also use cookies for advertising
                purposes, including serving ads and measuring ad performance,
                where applicable.
              </p>
            </Section>

            <Section title="Analytics and performance cookies">
              <p>
                These cookies (and similar technologies) collect information
                that is used either in aggregate form to help us understand how
                our Website is being used, improve site performance, and help
                diagnose errors.
              </p>
              <p>
                We may use analytics tools that set cookies or use similar
                identifiers depending on your browser and our configuration.
              </p>
              <p>
                Note: The specific cookies and identifiers used can vary over
                time (for example, due to configuration changes or vendor
                updates).
              </p>
            </Section>

            <Section title="Advertising cookies">
              <p>
                We may display advertisements on our Website through Google
                AdSense and/or other advertising partners. Advertising providers
                may use cookies or similar technologies to serve ads, limit ad
                frequency, measure ad performance, and deliver ads that may be
                relevant to your interests.
              </p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">
                Google advertising cookies
              </h3>
              <p>
                Google uses cookies to help serve the ads it displays on the
                websites of its partners, such as websites displaying Google ads
                or participating in Google certified ad networks. When users
                visit a Google partner website, a cookie may be dropped on that
                user's browser.
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <a
                  href="https://policies.google.com/technologies/cookies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-900 hover:underline underline-offset-4"
                >
                  Find out how Google uses cookies...
                </a>
                <a
                  href="https://adssettings.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-900 hover:underline underline-offset-4"
                >
                  Manage Google Ads Settings...
                </a>
                <a
                  href="https://optout.aboutads.info/?c=2&lang=EN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-900 hover:underline underline-offset-4"
                >
                  Opt out via aboutads.info...
                </a>
              </div>
            </Section>

            <Section title="How can I control cookies?">
              <p>
                You have choices about whether to accept or reject cookies. You
                can usually exercise your cookie choices by adjusting your
                preferences in a cookie banner or consent manager (if we display
                one), or by changing your browser settings.
              </p>
              <p>
                Please note that essential cookies may be required for core site
                functionality. If you choose to reject cookies, you may still
                use our Website, though your access to some functionality and
                areas of our Website may be restricted.
              </p>
            </Section>

            <Section title="How can I control cookies on my browser?">
              <p>
                The ways you can refuse cookies through your browser controls
                vary from browser to browser, so you should visit your browser's
                help menu for more information.
              </p>
              <p>
                Useful starting points:
                <span className="block mt-2">
                  Chrome, Firefox, Safari, Edge, Opera
                </span>
              </p>
            </Section>

            <Section title="What about other tracking technologies, like web beacons?">
              <p>
                Cookies are not the only way to recognize or track visitors to a
                website. We may use other, similar technologies from time to
                time, like web beacons (sometimes called "tracking pixels" or
                "clear gifs"). These are tiny graphics files that contain a
                unique identifier that enables us to recognize when someone has
                visited our Website or interacted with our content. In many
                instances, these technologies rely on cookies to function
                properly, so declining cookies may impair their functioning.
              </p>
            </Section>

            <Section title="Do you use local storage or similar technologies?">
              <p>
                Some site features and third-party tools may use local storage
                (such as Local Storage, Session Storage, IndexedDB, or similar)
                to store information on your device. These technologies are used
                for purposes similar to cookies, such as remembering
                preferences, improving site performance, and measuring usage.
              </p>
              <p>
                You can typically clear or control local storage through your
                browser settings. Disabling or clearing it may impact certain
                website functionality.
              </p>
            </Section>

            <Section title="How often will you update this Cookie Policy?">
              <p>
                We may update this Cookie Policy from time to time to reflect
                changes to the cookies and technologies we use or for other
                operational, legal, or regulatory reasons. Please revisit this
                Cookie Policy regularly to stay informed about our use of
                cookies and related technologies.
              </p>
              <p>
                The date at the top of this Cookie Policy indicates when it was
                last updated.
              </p>
            </Section>

            <Section title="Where can I get further information?">
              <p>
                If you have any questions about our use of cookies or other
                technologies, please contact us at: admin@paycheckconverter.com.
              </p>
            </Section>
          </div>
        </article>

        <section className="mt-6">
          <p className="text-xs text-slate-600 leading-relaxed text-center">
            <em>
              Tools on this site are for budgeting and comparison. Always
              confirm payment schedules, fees, and lease terms in your rental
              agreement.
            </em>
          </p>
        </section>
      </div>

    
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="text-lg md:text-xl font-bold text-slate-900">{title}</h2>
      <div className="mt-3 text-sm md:text-base text-slate-700 leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
}
