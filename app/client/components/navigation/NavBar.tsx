import { Link } from "react-router";
import logo from "../../assets/images/paycheck-calculator-logo-final_minified.png";

export default function NavBar() {
  return (
    <header className="bg-sky-950 text-slate-200 border-b border-sky-900/60 shadow-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-1">
        <div className="flex items-center justify-between py-3">
          {/* Landing-page constraint: logo only, no navigation links */}
          <Link
            to="/"
            className="group flex items-center gap-3 cursor-pointer"
            aria-label="paycheckconverter home"
          >
            <img
              src={logo}
              alt="paycheckconverter"
              className="h-10 w-10 sm:h-11 sm:w-11 object-contain"
              loading="eager"
              decoding="async"
            />
            <div className="text-left leading-tight">
              <div className="text-base font-bold text-white tracking-tight group-hover:text-sky-200">
                PaycheckConverter<span className="text-sky-300">.com</span>
              </div>
              <div className="text-xs text-sky-200 font-semibold">
                Take-home pay per paycheck
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
