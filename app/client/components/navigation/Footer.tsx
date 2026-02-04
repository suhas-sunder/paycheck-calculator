import { Link } from "react-router";

type ToolLink = { label: string; to: string };
type ToolCategory = {
  title: string;
  items: ToolLink[];
  // optional: span control in the outer grid
  cardClassName?: string;
  // optional: list layout override
  listClassName?: string;
};

export default function Footer() {
  const year = 2026;

  // Landing-page constraint: no tool links yet.
  // Keep the same layout/card structure, but render non-navigating placeholders.
  const categories: ToolCategory[] = [
    {
      title: "Explore paycheck tools",
      cardClassName: "lg:col-span-2",
      listClassName: "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1",
      items: [],
    },
  ];

  return (
    <footer className="bg-sky-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-sky-900/60 bg-sky-950/30 p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base font-bold text-white">
              PaycheckConverter.com
            </h2>
            <span className="text-base text-slate-400">
              Take-home paycheck estimates
            </span>
          </div>

          {/* Cap at 3 columns so cards stay wide and readable */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.title}
                className={[
                  "rounded-xl border border-sky-900/40 bg-sky-950/15 p-4",
                  cat.cardClassName || "",
                ].join(" ")}
              >
                <div className="text-base font-bold uppercase tracking-wide text-slate-200">
                  {cat.title}
                </div>

                <ul
                  className={[
                    "mt-3 text-lg leading-snug",
                    cat.listClassName || "space-y-1",
                  ].join(" ")}
                >
                  {cat.items.length === 0 ? (
                    <li className="min-w-0">
                      {/* TO WIRE LATER: keep visual language, no navigation */}
                      <button
                        type="button"
                        className="block w-full text-left text-slate-300 hover:text-white hover:underline underline-offset-4 transition-colors cursor-pointer whitespace-normal break-words"
                        aria-disabled="true"
                        disabled
                      >
                        More tools coming soon
                      </button>
                    </li>
                  ) : (
                    cat.items.map((item) => (
                      <li key={item.label} className="min-w-0">
                        {/* TO WIRE LATER: keep visual language, no navigation */}
                        <button
                          type="button"
                          onClick={(e) => e.preventDefault()}
                          className="block w-full text-left text-slate-300 hover:text-white hover:underline underline-offset-4 transition-colors cursor-pointer whitespace-normal break-words"
                          aria-disabled="true"
                        >
                          {item.label}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 text-center">
          <nav aria-label="Footer links" className="text-base">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-white hover:underline underline-offset-4 cursor-pointer"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="hover:text-white hover:underline underline-offset-4 cursor-pointer"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="hover:text-white hover:underline underline-offset-4 cursor-pointer"
                >
                  Cookies
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white hover:underline underline-offset-4 cursor-pointer"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <p className="text-base text-slate-400">
            © {year} paycheckconverter.com • All rights reserved.
          </p>

          <p className="text-sm text-slate-400/90">
            Tools on this site are for informational, planning, and comparison
            purposes only. Results are estimates based on your inputs and the
            assumptions shown. This website does not provide financial, legal,
            or tax advice. Always confirm compensation terms, policies, and
            payroll practices in your offer letter, contract, or employer
            documentation.
          </p>
        </div>
      </div>
    </footer>
  );
}
