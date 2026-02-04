/* eslint-disable react/no-unescaped-entities */

import * as React from "react";
import { Link } from "react-router";
import type { Route } from "./+types/privacy-policy";

export const meta: Route.MetaFunction = () => [
  { title: "Privacy Policy | paycheckconverter.com" },
  {
    name: "description",
    content:
      "Read the paycheckconverter.com privacy policy. Learn what information we collect, how it is used, and what choices you have when using paycheckconverter.com tools.",
  },
  {
    name: "keywords",
    content:
      "paycheckconverter privacy policy, paycheckconverter.com privacy, rent calculator privacy, cookie policy, analytics, advertising, data processing",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "paycheckconverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:site_name", content: "paycheckconverter.com" },
  { property: "og:title", content: "Privacy Policy | paycheckconverter.com" },
  {
    property: "og:description",
    content:
      "Read the paycheckconverter.com privacy policy, including what we collect, how we use it, and your privacy choices.",
  },
  { property: "og:url", content: "https://www.paycheckconverter.com/privacy-policy" },
  { property: "og:image", content: "https://www.paycheckconverter.com/og-image.jpg" },
  { property: "og:image:alt", content: "paycheckconverter.com privacy policy" },
  { property: "og:locale", content: "en_US" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Privacy Policy | paycheckconverter.com" },
  {
    name: "twitter:description",
    content:
      "Read the paycheckconverter.com privacy policy, including what we collect, how we use it, and your privacy choices.",
  },
  { name: "twitter:image", content: "https://www.paycheckconverter.com/og-image.jpg" },

  { tagName: "link", rel: "canonical", href: "https://www.paycheckconverter.com/privacy-policy" },
];

export default function PrivacyPolicy() {
  const pageName = "Privacy Policy";
  const canonicalUrl = "https://www.paycheckconverter.com/privacy-policy";

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
      { "@type": "ListItem", position: 2, name: pageName, item: canonicalUrl },
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
    description:
      "Privacy policy describing how paycheckconverter.com collects, uses, and shares information and what choices users have.",
    url: canonicalUrl,
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth antialiased">
      <section className="max-w-6xl mx-auto px-6 pt-8">
        <nav className="text-sm text-slate-600 mb-4" aria-label="Breadcrumb">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md text-slate-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
          >
            Home
          </Link>{" "}
          / <span className="text-slate-800">{pageName}</span>
        </nav>

        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">{pageName}</h1>
          <p className="text-slate-600 text-sm">
            Last updated January 24, 2026
          </p>

          <div className="mt-5 space-y-4 text-slate-700 leading-relaxed">
            <p>
              This privacy notice for paycheckconverter.com ("we", "us", or "our")
              describes how and why we might collect, store, use, and/or share
              ("process") your information when you use our services
              ("Services"), such as when you:
            </p>

            <ul className="list-inside list-disc flex flex-col gap-2 pl-5">
              <li>
                Visit our website at https://www.paycheckconverter.com or any page that
                links to this privacy notice
              </li>
              <li>
                Use our rent conversion tools, calculators, and related features
              </li>
              <li>Contact us with questions, feedback, or support requests</li>
            </ul>

            <p>
              If you do not agree with our policies and practices, please do not
              use our Services.
            </p>

            <p className="space-y-1">
              <span className="block">
                Data controller: paycheckconverter.com is responsible for deciding
                how your personal information is processed for the purposes
                described in this privacy notice.
              </span>
              <span className="block">
                Contact: admin@paycheckconverter.com (Toronto, Ontario, Canada).
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-10 pt-6">
        <article className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="prose prose-slate max-w-none">
            <Section title="SUMMARY OF KEY POINTS">
              <p>
                This summary provides key points from our privacy notice. You
                can read the full details in the sections below.
              </p>
              <ul>
                <li>
                  <strong>What we collect:</strong> We may collect information
                  you provide (for example, an email if you contact us) and
                  information automatically collected (for example, IP address,
                  device details, and usage data).
                </li>
                <li>
                  <strong>How we use it:</strong> To provide and improve the
                  Services, keep the site secure, measure performance, and
                  support advertising where applicable.
                </li>
                <li>
                  <strong>Sharing:</strong> We may share data with service
                  providers (analytics, hosting, security) and advertising
                  partners, as described below.
                </li>
                <li>
                  <strong>Your choices:</strong> Depending on your location, you
                  may have rights to access, correct, or delete personal
                  information. You can also control cookies via browser
                  settings.
                </li>
              </ul>
            </Section>

            <Section title="1. WHAT INFORMATION DO WE COLLECT?">
              <h3 className="text-lg font-bold text-slate-900">
                Personal information you disclose to us
              </h3>
              <p>
                <strong>In Short:</strong> We collect personal information that
                you provide to us.
              </p>

              <p>
                We collect personal information that you voluntarily provide to
                us when you contact us (for example, by email) or when you
                otherwise communicate with us.
              </p>

              <p>
                <strong>Personal Information Provided by You</strong> may
                include:
              </p>
              <ul>
                <li>email address</li>
                <li>message content you send to us</li>
                <li>any other information you choose to include</li>
              </ul>

              <p>
                <strong>Sensitive Information:</strong> We do not intentionally
                collect or process sensitive information.
              </p>

              <h3 className="text-lg font-bold text-slate-900 mt-8">
                Information automatically collected
              </h3>
              <p>
                <strong>In Short:</strong> Some information, such as your IP
                address and/or browser and device characteristics, is collected
                automatically when you visit our Services.
              </p>

              <p>
                We automatically collect certain information when you visit,
                use, or navigate the Services. This information does not reveal
                your specific identity (like your name or contact information)
                but may include device and usage information, such as your IP
                address, browser and device characteristics, operating system,
                language preferences, referring URLs, country, approximate
                location (based on IP), information about how and when you use
                our Services, and other technical information. This information
                is primarily needed to maintain the security and operation of
                our Services, for analytics, and for advertising measurement and
                fraud prevention.
              </p>

              <ul>
                <li>
                  <strong>Log and Usage Data:</strong> diagnostic, usage, and
                  performance information recorded in logs (for example, pages
                  viewed, timestamps, and error reports).
                </li>
                <li>
                  <strong>Device Data:</strong> information about your device,
                  browser, operating system, and settings.
                </li>
                <li>
                  <strong>Location Data:</strong> approximate location based on
                  IP address. We do not require precise location to use core
                  tools.
                </li>
                <li>
                  <strong>Advertising and Measurement Data:</strong> if ads are
                  shown, ad networks and their partners may collect or receive
                  information (such as cookies, device identifiers, IP address,
                  and ad interaction events) to provide, measure, and improve
                  advertising and help detect fraud.
                </li>
              </ul>

              <p>
                <strong>Analytics:</strong> We may use analytics providers to
                understand usage and improve the Services. These providers may
                collect information such as device and browser details, pages
                viewed, interactions, and approximate location (based on IP).
              </p>
            </Section>

            <Section title="2. HOW DO WE PROCESS YOUR INFORMATION?">
              <p>
                <strong>In Short:</strong> We process your information to
                provide, improve, and administer our Services, communicate with
                you, for security and fraud prevention, and to comply with law.
                We may also process your information for other purposes with
                your consent where required.
              </p>

              <ul>
                <li>
                  To provide and improve the Services (including performance,
                  debugging, and feature improvements).
                </li>
                <li>To respond to user inquiries and offer support.</li>
                <li>
                  To monitor for security issues, prevent abuse, and detect
                  fraud.
                </li>
                <li>
                  To measure usage and improve content, layout, and tool
                  accuracy.
                </li>
                <li>
                  To deliver and measure advertising where applicable and where
                  permitted by law and settings.
                </li>
                <li>
                  To comply with legal obligations and enforce our rights.
                </li>
              </ul>
            </Section>

            <Section title="3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?">
              <p>
                <strong>In Short:</strong> We only process your personal
                information when we believe it is necessary and we have a valid
                legal reason to do so under applicable law, like with your
                consent, to comply with laws, to provide you with services, or
                to fulfill our legitimate interests.
              </p>

              <h3 className="text-lg font-bold text-slate-900">
                If you are located in the EU or UK
              </h3>
              <p>
                We may rely on one or more of the following legal bases,
                depending on the context:
              </p>
              <ul>
                <li>
                  <strong>Consent:</strong> you can withdraw consent at any time
                  where processing is based on consent.
                </li>
                <li>
                  <strong>Performance of a contract:</strong> to provide the
                  Services you request.
                </li>
                <li>
                  <strong>Legitimate interests:</strong> to operate, secure, and
                  improve the Services, where those interests do not override
                  your rights.
                </li>
                <li>
                  <strong>Legal obligations:</strong> to comply with applicable
                  laws.
                </li>
              </ul>

              <h3 className="text-lg font-bold text-slate-900 mt-6">
                If you are located in Canada
              </h3>
              <p>
                We may process your information with your express consent, or
                where consent can be inferred (implied consent), as permitted by
                applicable law.
              </p>
            </Section>

            <Section title="4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?">
              <p>
                <strong>In Short:</strong> We may share information in specific
                situations described in this section and/or with the following
                categories of third parties.
              </p>

              <ul>
                <li>
                  <strong>Service providers</strong> who help us operate the
                  site (hosting, security, customer support tools, email
                  providers).
                </li>
                <li>
                  <strong>Analytics providers</strong> to help us understand
                  usage and improve the Services.
                </li>
                <li>
                  <strong>Advertising networks and partners</strong> to display,
                  measure, and improve ads and limit ad frequency.
                </li>
              </ul>

              <p>We may also share information:</p>
              <ul>
                <li>
                  <strong>Business transfers:</strong> in connection with a
                  merger, sale, financing, or acquisition.
                </li>
                <li>
                  <strong>Legal requirements:</strong> if required by law, court
                  order, or governmental regulation, or when necessary to
                  protect rights and safety and prevent fraud or abuse.
                </li>
              </ul>
            </Section>

            <Section title="5. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES AND ADS?">
              <p>
                <strong>In Short:</strong> We are not responsible for the safety
                of any information that you share with third parties that we may
                link to or who advertise on our Services.
              </p>

              <p>
                The Services may include third-party websites, services, or
                advertisements. We do not control those third parties and are
                not responsible for their content, policies, or practices. You
                should review the privacy policies of any third-party services
                you interact with.
              </p>

              <h3 className="text-lg font-bold text-slate-900">
                Advertising (Google AdSense and other ad networks)
              </h3>
              <ul>
                <li>
                  Third-party vendors, including Google, may use cookies and/or
                  device identifiers to serve ads based on a user's prior visits
                  to this website or other websites.
                </li>
                <li>
                  Google’s use of advertising cookies enables it and its
                  partners to serve ads based on your visit to this site and/or
                  other sites on the Internet.
                </li>
                <li>
                  Where required by law, we will request consent for certain
                  cookies (including advertising cookies) before they are set.
                </li>
              </ul>
              <p>
                You can control cookies through your browser settings. You may
                also be able to manage ad personalization through provider
                controls.
              </p>
            </Section>

            <Section title="6. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?">
              <p>
                <strong>In Short:</strong> We may use cookies and similar
                technologies to collect and store information.
              </p>

              <p>
                Cookies help with basic site functionality, security, analytics,
                and (where applicable) advertising measurement. You can control
                cookies through your browser settings. If you choose to remove
                or reject cookies, this could affect certain features of the
                Services.
              </p>
            </Section>

            <Section title="7. HOW LONG DO WE KEEP YOUR INFORMATION?">
              <p>
                <strong>In Short:</strong> We keep your information for as long
                as necessary to fulfill the purposes outlined in this privacy
                notice unless otherwise required by law.
              </p>

              <p>
                We may retain certain information for security, fraud
                prevention, compliance, and legitimate business purposes. When
                we no longer need information, we take reasonable steps to
                delete it or de-identify it.
              </p>
            </Section>

            <Section title="8. DO WE COLLECT INFORMATION FROM MINORS?">
              <p>
                <strong>In Short:</strong> We do not knowingly collect personal
                information from children under 13 years of age.
              </p>

              <p>
                The Services are intended for a general audience and are not
                directed to children under 13. If you believe a child has
                provided personal information to us, contact us at
                admin@paycheckconverter.com and we will take appropriate steps.
              </p>
            </Section>

            <Section title="9. WHAT ARE YOUR PRIVACY RIGHTS?">
              <p>
                <strong>In Short:</strong> Depending on where you are located,
                you may have certain rights regarding your personal information.
              </p>

              <p>
                You can request access to, correction of, or deletion of your
                personal information by contacting us at
                admin@paycheckconverter.com. We may need to verify your identity
                before responding. Where applicable, you may also have the right
                to object to certain processing or request portability of your
                information.
              </p>
            </Section>

            <Section title="10. DO WE MAKE UPDATES TO THIS NOTICE?">
              <p>
                <strong>In Short:</strong> Yes, we will update this notice as
                necessary to reflect changes to our practices or for other
                operational, legal, or regulatory reasons.
              </p>

              <p>
                The updated version will be indicated by an updated "Last
                updated" date and will be effective as soon as it is accessible.
              </p>
            </Section>

            <Section title="11. CONTACT US">
              <p>
                If you have questions or comments about this notice, you may
                email us at admin@paycheckconverter.com.
              </p>
              <p>paycheckconverter.com</p>
              <p>Toronto, Ontario</p>
              <p>Canada</p>
            </Section>
          </div>
        </article>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-10">
        <p className="text-xs text-slate-600 text-center leading-relaxed">
          <em>
            Tools on this site are for budgeting and comparison. Always confirm
            payment schedules, fees, and lease terms in your rental agreement.
          </em>
        </p>
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
