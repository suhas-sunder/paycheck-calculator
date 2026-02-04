import { useMemo, useEffect, useState } from "react";
import type { Route } from "./+types/home";

export const meta: Route.MetaFunction = () => [
  {
    title: "Paycheck Calculator | Estimate Net Pay From Gross (User-Defined)",
  },
  {
    name: "description",
    content:
      "Estimate net pay per paycheck from a gross annual amount and pay frequency. Add optional withholding and deductions you control. Exact decimals, transparent math, and printable results.",
  },
  {
    name: "keywords",
    content:
      "paycheck calculator, gross to net paycheck, net pay estimator, biweekly paycheck, semi-monthly paycheck, monthly paycheck, withholding calculator, deductions calculator, take home pay estimate",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "PaycheckConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  // Open Graph
  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content: "Paycheck Calculator | Estimate Net Pay From Gross (User-Defined)",
  },
  {
    property: "og:description",
    content:
      "Estimate net pay per paycheck from gross income and pay frequency. Add optional withholding and deductions you control. Exact decimals and transparent math.",
  },
  { property: "og:url", content: "https://www.paycheckconverter.com" },
  { property: "og:site_name", content: "PaycheckConverter.com" },
  {
    property: "og:image",
    content: "https://www.paycheckconverter.com/og-image.jpg",
  },

  // Twitter
  { name: "twitter:card", content: "summary_large_image" },
  {
    name: "twitter:title",
    content: "Paycheck Calculator | Net Pay From Gross (User-Defined)",
  },
  {
    name: "twitter:description",
    content:
      "Estimate net pay per paycheck from gross income and pay frequency with optional withholding and deductions you control. Exact decimals and transparent math.",
  },
  {
    name: "twitter:image",
    content: "https://www.paycheckconverter.com/og-image.jpg",
  },
  {
    tagName: "link",
    rel: "canonical",
    href: "https://www.paycheckconverter.com",
  },
];

type Frequency =
  | "weekly"
  | "biweekly"
  | "semi_monthly"
  | "monthly"
  | "irregular";

const FREQUENCY_LABEL: Record<Frequency, string> = {
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  semi_monthly: "Semi-monthly",
  monthly: "Monthly",
  irregular: "Irregular",
};

const FREQUENCY_ORDER: Frequency[] = [
  "weekly",
  "biweekly",
  "semi_monthly",
  "monthly",
  "irregular",
];

const DEFAULT_PERIODS_PER_YEAR: Record<
  Exclude<Frequency, "irregular">,
  number
> = {
  weekly: 52,
  biweekly: 26,
  semi_monthly: 24,
  monthly: 12,
};

const CURRENCY_OPTIONS: Array<{ code: string; label: string }> = [
  { code: "USD", label: "USD" },
  { code: "CAD", label: "CAD" },
  { code: "EUR", label: "EUR" },
  { code: "GBP", label: "GBP" },
  { code: "AUD", label: "AUD" },
  { code: "NZD", label: "NZD" },
  { code: "JPY", label: "JPY" },
  { code: "CNY", label: "CNY" },
  { code: "HKD", label: "HKD" },
  { code: "SGD", label: "SGD" },
  { code: "INR", label: "INR" },
  { code: "KRW", label: "KRW" },
  { code: "CHF", label: "CHF" },
  { code: "SEK", label: "SEK" },
  { code: "NOK", label: "NOK" },
  { code: "DKK", label: "DKK" },
  { code: "MXN", label: "MXN" },
  { code: "BRL", label: "BRL" },
];

function safeJsonParseBoolean(value: string | null, fallback: boolean) {
  if (value === null) return fallback;
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "boolean" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function safeFrequency(value: string | null, fallback: Frequency): Frequency {
  if (!value) return fallback;
  const v = value as Frequency;
  return FREQUENCY_ORDER.includes(v) ? v : fallback;
}

function safeCurrency(value: string | null, fallback: string): string {
  if (!value) return fallback;
  const v = value.toUpperCase();
  return CURRENCY_OPTIONS.some((c) => c.code === v) ? v : fallback;
}

function safeDisplayDecimals(value: string | null, fallback: 0 | 2 | 4 | 6) {
  if (value === null) return fallback;
  const n = Number(value);
  if (n === 0 || n === 2 || n === 4 || n === 6) return n as 0 | 2 | 4 | 6;
  return fallback;
}

/**
 * Decimal-safe math (no float drift in computation).
 * We parse user input to a scaled integer (micro-units) and keep all conversions as rational BigInt.
 */
const SCALE = 1_000_000n; // 6 decimal places preserved end-to-end

function gcdBigInt(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x === 0n ? 1n : x;
}

type Rational = { n: bigint; d: bigint }; // n/d

function normRational(r: Rational): Rational {
  if (r.d === 0n) return { n: 0n, d: 1n };
  let n = r.n;
  let d = r.d;
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const g = gcdBigInt(n, d);
  return { n: n / g, d: d / g };
}

function addR(a: Rational, b: Rational): Rational {
  return normRational({ n: a.n * b.d + b.n * a.d, d: a.d * b.d });
}

function subR(a: Rational, b: Rational): Rational {
  return normRational({ n: a.n * b.d - b.n * a.d, d: a.d * b.d });
}

function mulR(a: Rational, b: Rational): Rational {
  return normRational({ n: a.n * b.n, d: a.d * b.d });
}

function divR(a: Rational, b: Rational): Rational {
  if (b.n === 0n) return { n: 0n, d: 1n };
  return normRational({ n: a.n * b.d, d: a.d * b.n });
}

function fromScaledUnits(scaled: bigint): Rational {
  return { n: scaled, d: SCALE };
}

function toScaledUnits(r: Rational): bigint {
  const rr = normRational(r);
  return (rr.n * SCALE) / rr.d;
}

function absBigInt(x: bigint) {
  return x < 0n ? -x : x;
}

function roundScaledToDigits(scaled: bigint, digits: number): bigint {
  const d = Math.max(0, Math.min(6, digits));
  const drop = 6 - d;
  const factor = 10n ** BigInt(drop);
  const half = factor / 2n;

  const neg = scaled < 0n;
  const x = absBigInt(scaled);
  const rounded = (x + half) / factor;
  const back = rounded * factor;
  return neg ? -back : back;
}

function scaledToDecimalString(
  scaled: bigint,
  digits: number,
  opts?: { fixed?: boolean; trimTrailingZeros?: boolean },
): string {
  const d = Math.max(0, Math.min(6, digits));
  const neg = scaled < 0n;
  const x = absBigInt(scaled);

  const intPart = x / SCALE;
  const fracPart = x % SCALE;

  const fracStr6 = fracPart.toString().padStart(6, "0");
  const fracStr = d === 0 ? "" : fracStr6.slice(0, d);

  let out = d === 0 ? intPart.toString() : `${intPart.toString()}.${fracStr}`;

  if (opts?.trimTrailingZeros && d > 0) {
    out = out.replace(/(\.\d*?[1-9])0+$/u, "$1").replace(/\.0+$/u, "");
  }

  if (opts?.fixed && d > 0) {
    const m = out.match(/^(-?\d+)(?:\.(\d+))?$/u);
    if (m) {
      const a = m[1];
      const b = (m[2] ?? "").padEnd(d, "0").slice(0, d);
      out = `${a}.${b}`;
    }
  }

  return neg ? `-${out}` : out;
}

/**
 * Robust money/decimal parsing.
 * Rules:
 * - Keep the raw string until validated
 * - Accept: "$1,234.56", "1 234.56", "1250.50", ".5", "12."
 * - Accept comma-decimal ONLY when it is clearly a decimal (exactly 2 digits after comma), like "1250,50"
 * - Reject ambiguous comma usage like "1,2" or "1,234,56"
 * - Reject negatives
 */
function parseMoneyToScaled(input: string): {
  ok: boolean;
  scaled?: bigint;
  normalized?: string;
  error?: string;
} {
  const raw = input.trim();
  if (!raw) return { ok: false, error: "Enter an amount." };

  const sanitized = raw.replace(/[^\d.,+\-()\s$€£¥₹₩₽₫₴₱₦₲₵₡₺₸]/g, "");

  const isParenNeg =
    sanitized.includes("(") &&
    sanitized.includes(")") &&
    !sanitized.includes("-");
  const noParens = sanitized.replace(/[()]/g, "");

  const s0 = noParens.replace(/[$€£¥₹₩₽₫₴₱₦₲₵₡₺₸]/g, "").replace(/\s+/g, "");

  if (!s0) return { ok: false, error: "Enter an amount." };

  const signCount = (s0.match(/[+\-]/g) ?? []).length;
  if (signCount > 1) {
    return {
      ok: false,
      error: "That number format looks unclear. Remove extra + or - signs.",
    };
  }

  let s = s0;
  const hasMinus = s.includes("-");
  s = s.replace(/[+\-]/g, "");
  const isNegative = isParenNeg || hasMinus;

  if (isNegative) {
    return { ok: false, error: "Amount cannot be negative." };
  }

  if (!s) {
    return {
      ok: false,
      error: "That number format looks unclear. Try 1250.50 or 1,250.50.",
    };
  }

  const lastDot = s.lastIndexOf(".");
  const lastComma = s.lastIndexOf(",");
  if (lastDot !== -1 && lastComma !== -1) {
    const decimalSep = lastDot > lastComma ? "." : ",";
    const thousandsSep = decimalSep === "." ? "," : ".";
    s = s.split(thousandsSep).join("");
    if (decimalSep === ",") s = s.replace(",", ".");
    if ((s.match(/\./g) ?? []).length > 1) {
      return {
        ok: false,
        error:
          "That number format is ambiguous. Use only one decimal separator (like 1250.50).",
      };
    }
  } else if (lastComma !== -1 && lastDot === -1) {
    const commaCount = (s.match(/,/g) ?? []).length;
    if (commaCount !== 1) {
      return {
        ok: false,
        error:
          "That comma format is ambiguous. Use a dot for decimals (example: 1250.50).",
      };
    }
    const parts = s.split(",");
    const right = parts[1] ?? "";
    if (right.length !== 2) {
      return {
        ok: false,
        error:
          "That comma-decimal format is ambiguous. Use 2 digits after the comma (example: 1250,50) or use a dot (1250.50).",
      };
    }
    s = `${parts[0]}.${right}`;
  } else {
    if ((s.match(/\./g) ?? []).length > 1) {
      return {
        ok: false,
        error: "That number format looks unclear. Try 1250.50 or 1,250.50.",
      };
    }
    s = s.replace(/,/g, "");
  }

  if (s.startsWith(".")) s = `0${s}`;
  if (s.endsWith(".")) s = `${s}0`;

  if (!/^\d+(\.\d+)?$/u.test(s)) {
    return {
      ok: false,
      error:
        "That number format looks unclear. Try 1250.50 or 1,250.50 (and avoid mixed separators).",
    };
  }

  const [intStr, fracStrRaw = ""] = s.split(".");
  const fracStr = fracStrRaw.slice(0, 6);
  const fracPadded = fracStr.padEnd(6, "0");

  const intPart = BigInt(intStr || "0");
  const fracPart = BigInt(fracPadded || "0");

  const scaled = intPart * SCALE + fracPart;

  const maxScaled = 1_000_000_000n * SCALE;
  if (scaled > maxScaled) {
    return {
      ok: false,
      error:
        "That value is extremely large. Please enter a smaller amount (under 1,000,000,000).",
    };
  }

  return { ok: true, scaled, normalized: s };
}

function formatMoneyFromDecimalString(
  decimalStr: string,
  currency: string,
  opts: { minimumFractionDigits: number; maximumFractionDigits: number },
) {
  const n = Number(decimalStr);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: opts.minimumFractionDigits,
    maximumFractionDigits: opts.maximumFractionDigits,
  }).format(n);
}

function formatGroupedNumberFromDecimalString(
  decimalStr: string,
  opts: { minimumFractionDigits: number; maximumFractionDigits: number },
) {
  const n = Number(decimalStr);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat(undefined, {
    useGrouping: true,
    minimumFractionDigits: opts.minimumFractionDigits,
    maximumFractionDigits: opts.maximumFractionDigits,
  }).format(n);
}

function safeEnvIsDev(): boolean {
  try {
    const v = (import.meta as any)?.env?.DEV;
    return Boolean(v);
  } catch {
    return false;
  }
}

function parsePercentToScaled(
  input: string,
  label: string,
): {
  ok: boolean;
  scaled?: bigint;
  error?: string;
} {
  const raw = input.trim();
  if (!raw) return { ok: true, scaled: 0n };

  const p = parseMoneyToScaled(raw);
  if (!p.ok || p.scaled === undefined) {
    return { ok: false, error: p.error ?? `Enter a valid ${label}.` };
  }

  if (p.scaled < 0n)
    return { ok: false, error: `${label} cannot be negative.` };

  // 0 to 100 inclusive
  const hundred = 100n * SCALE;
  if (p.scaled > hundred) {
    return { ok: false, error: `${label} must be 0 to 100.` };
  }

  return { ok: true, scaled: p.scaled };
}

function percentScaledToRatioR(pScaled: bigint): Rational {
  // pScaled is percent in micro units (e.g., 12.5% => 12.5 * 1e6)
  return normRational({ n: pScaled, d: 100n * SCALE });
}

function isZeroString(s: string) {
  return s.trim() === "" || /^0+(?:\.0+)?$/u.test(s.trim());
}

export default function Home() {
  const [annualGross, setAnnualGross] = useState<string>(() => {
    if (typeof window === "undefined") return "80000";
    return localStorage.getItem("pc_amount") ?? "80000";
  });

  const [annualGrossFocused, setAnnualGrossFocused] = useState<boolean>(false);

  const [frequency, setFrequency] = useState<Frequency>(() => {
    if (typeof window === "undefined") return "biweekly";
    return safeFrequency(localStorage.getItem("pc_frequency"), "biweekly");
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "USD";
    return safeCurrency(localStorage.getItem("pc_currency"), "USD");
  });

  const [roundForDisplay, setRoundForDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeJsonParseBoolean(localStorage.getItem("pc_rounding"), true);
  });

  const [displayDecimals, setDisplayDecimals] = useState<0 | 2 | 4 | 6>(() => {
    if (typeof window === "undefined") return 2;
    return safeDisplayDecimals(localStorage.getItem("pc_display_decimals"), 2);
  });

  // Advanced (hidden by default)
  const [periodsPerYear, setPeriodsPerYear] = useState<string>(() => {
    if (typeof window === "undefined") return "26";
    return localStorage.getItem("pc_periods_per_year") ?? "26";
  });

  const [withholdPct, setWithholdPct] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("pc_withhold_pct") ?? "";
  });

  const [withholdFixedAnnual, setWithholdFixedAnnual] = useState<string>(() => {
    if (typeof window === "undefined") return "0";
    return localStorage.getItem("pc_withhold_fixed_annual") ?? "0";
  });

  const [pretaxPct, setPretaxPct] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("pc_pretax_pct") ?? "";
  });

  const [pretaxFixedAnnual, setPretaxFixedAnnual] = useState<string>(() => {
    if (typeof window === "undefined") return "0";
    return localStorage.getItem("pc_pretax_fixed_annual") ?? "0";
  });

  const [posttaxPct, setPosttaxPct] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("pc_posttax_pct") ?? "";
  });

  const [posttaxFixedAnnual, setPosttaxFixedAnnual] = useState<string>(() => {
    if (typeof window === "undefined") return "0";
    return localStorage.getItem("pc_posttax_fixed_annual") ?? "0";
  });

  const [extraGrossThisPaycheck, setExtraGrossThisPaycheck] = useState<string>(
    () => {
      if (typeof window === "undefined") return "0";
      return localStorage.getItem("pc_extra_gross_this_paycheck") ?? "0";
    },
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem("pc_amount", annualGross);
    localStorage.setItem("pc_frequency", frequency);
    localStorage.setItem("pc_currency", currency);
    localStorage.setItem("pc_rounding", JSON.stringify(roundForDisplay));
    localStorage.setItem("pc_display_decimals", String(displayDecimals));

    localStorage.setItem("pc_periods_per_year", periodsPerYear);
    localStorage.setItem("pc_withhold_pct", withholdPct);
    localStorage.setItem("pc_withhold_fixed_annual", withholdFixedAnnual);
    localStorage.setItem("pc_pretax_pct", pretaxPct);
    localStorage.setItem("pc_pretax_fixed_annual", pretaxFixedAnnual);
    localStorage.setItem("pc_posttax_pct", posttaxPct);
    localStorage.setItem("pc_posttax_fixed_annual", posttaxFixedAnnual);
    localStorage.setItem(
      "pc_extra_gross_this_paycheck",
      extraGrossThisPaycheck,
    );
  }, [
    annualGross,
    frequency,
    currency,
    roundForDisplay,
    displayDecimals,
    periodsPerYear,
    withholdPct,
    withholdFixedAnnual,
    pretaxPct,
    pretaxFixedAnnual,
    posttaxPct,
    posttaxFixedAnnual,
    extraGrossThisPaycheck,
  ]);

  const hasInput = useMemo(() => annualGross.trim().length > 0, [annualGross]);

  const grossParsed = useMemo(
    () => parseMoneyToScaled(annualGross),
    [annualGross],
  );

  const frequencyPeriods = useMemo(() => {
    if (frequency !== "irregular") {
      return DEFAULT_PERIODS_PER_YEAR[frequency];
    }
    return NaN;
  }, [frequency]);

  const periodsParsed = useMemo(() => {
    if (frequency !== "irregular") {
      return { ok: true, scaled: BigInt(frequencyPeriods) * SCALE };
    }

    const p = parseMoneyToScaled(periodsPerYear);
    if (!p.ok || p.scaled === undefined) {
      return { ok: false, error: p.error ?? "Enter pay periods per year." };
    }

    if (p.scaled === 0n)
      return {
        ok: false,
        error: "Pay periods per year must be greater than 0.",
      };
    if (p.scaled < 0n)
      return { ok: false, error: "Pay periods per year cannot be negative." };

    // Require an integer-ish value to avoid weird fractional pay periods.
    if (p.scaled % SCALE !== 0n) {
      return {
        ok: false,
        error: "Pay periods per year must be a whole number.",
      };
    }

    const n = Number(p.scaled / SCALE);
    if (!Number.isFinite(n) || n < 1 || n > 366) {
      return {
        ok: false,
        error: "Pay periods per year looks unusual. Check the value.",
      };
    }

    return { ok: true, scaled: p.scaled };
  }, [frequency, periodsPerYear, frequencyPeriods]);

  const withholdPctParsed = useMemo(
    () => parsePercentToScaled(withholdPct, "Withholding %"),
    [withholdPct],
  );

  const pretaxPctParsed = useMemo(
    () => parsePercentToScaled(pretaxPct, "Pre-tax %"),
    [pretaxPct],
  );

  const posttaxPctParsed = useMemo(
    () => parsePercentToScaled(posttaxPct, "Post-tax %"),
    [posttaxPct],
  );

  const withholdFixedParsed = useMemo(() => {
    if (isZeroString(withholdFixedAnnual))
      return { ok: true, scaled: 0n as bigint };
    return parseMoneyToScaled(withholdFixedAnnual);
  }, [withholdFixedAnnual]);

  const pretaxFixedParsed = useMemo(() => {
    if (isZeroString(pretaxFixedAnnual))
      return { ok: true, scaled: 0n as bigint };
    return parseMoneyToScaled(pretaxFixedAnnual);
  }, [pretaxFixedAnnual]);

  const posttaxFixedParsed = useMemo(() => {
    if (isZeroString(posttaxFixedAnnual))
      return { ok: true, scaled: 0n as bigint };
    return parseMoneyToScaled(posttaxFixedAnnual);
  }, [posttaxFixedAnnual]);

  const extraGrossParsed = useMemo(() => {
    if (isZeroString(extraGrossThisPaycheck))
      return { ok: true, scaled: 0n as bigint };
    return parseMoneyToScaled(extraGrossThisPaycheck);
  }, [extraGrossThisPaycheck]);

  const advancedOk = useMemo(() => {
    return (
      periodsParsed.ok &&
      withholdPctParsed.ok &&
      pretaxPctParsed.ok &&
      posttaxPctParsed.ok &&
      (withholdFixedParsed.ok ?? false) &&
      (pretaxFixedParsed.ok ?? false) &&
      (posttaxFixedParsed.ok ?? false) &&
      (extraGrossParsed.ok ?? false)
    );
  }, [
    periodsParsed.ok,
    withholdPctParsed.ok,
    pretaxPctParsed.ok,
    posttaxPctParsed.ok,
    withholdFixedParsed.ok,
    pretaxFixedParsed.ok,
    posttaxFixedParsed.ok,
    extraGrossParsed.ok,
  ]);

  const advancedMessage = useMemo(() => {
    if (!periodsParsed.ok)
      return (periodsParsed as any).error ?? "Fix pay periods per year.";
    if (!withholdPctParsed.ok)
      return withholdPctParsed.error ?? "Fix withholding %.";
    if (!pretaxPctParsed.ok) return pretaxPctParsed.error ?? "Fix pre-tax %.";
    if (!posttaxPctParsed.ok)
      return posttaxPctParsed.error ?? "Fix post-tax %.";

    const moneyErr = (p: any) =>
      !p.ok ? (p.error ?? "Enter a valid amount.") : "";
    if (!withholdFixedParsed.ok) return moneyErr(withholdFixedParsed);
    if (!pretaxFixedParsed.ok) return moneyErr(pretaxFixedParsed);
    if (!posttaxFixedParsed.ok) return moneyErr(posttaxFixedParsed);
    if (!extraGrossParsed.ok) return moneyErr(extraGrossParsed);

    return "";
  }, [
    periodsParsed,
    withholdPctParsed.ok,
    withholdPctParsed.error,
    pretaxPctParsed.ok,
    pretaxPctParsed.error,
    posttaxPctParsed.ok,
    posttaxPctParsed.error,
    withholdFixedParsed.ok,
    withholdFixedParsed.error,
    pretaxFixedParsed.ok,
    pretaxFixedParsed.error,
    posttaxFixedParsed.ok,
    posttaxFixedParsed.error,
    extraGrossParsed.ok,
    extraGrossParsed.error,
  ]);

  const validation = useMemo(() => {
    if (!hasInput)
      return { ok: false, message: "Enter a gross annual amount." as string };
    if (!grossParsed.ok)
      return {
        ok: false,
        message: grossParsed.error ?? "Enter a valid amount.",
      };
    if (!advancedOk)
      return {
        ok: false,
        message: advancedMessage || "Fix advanced settings to see results.",
      };
    if (grossParsed.scaled === 0n) {
      return {
        ok: true,
        message:
          "A value of 0 converts to 0. If that is not what you intend, enter your gross pay above.",
      };
    }
    return { ok: true, message: "" };
  }, [
    hasInput,
    grossParsed.ok,
    grossParsed.error,
    grossParsed.scaled,
    advancedOk,
    advancedMessage,
  ]);

  const annualGrossR: Rational | null = useMemo(() => {
    if (!validation.ok || !grossParsed.ok || grossParsed.scaled === undefined)
      return null;
    return fromScaledUnits(grossParsed.scaled);
  }, [validation.ok, grossParsed.ok, grossParsed.scaled]);

  const periodsPerYearR: Rational | null = useMemo(() => {
    if (
      !advancedOk ||
      !periodsParsed.ok ||
      (periodsParsed as any).scaled === undefined
    )
      return null;
    return fromScaledUnits((periodsParsed as any).scaled);
  }, [advancedOk, periodsParsed]);

  const calc = useMemo(() => {
    if (!annualGrossR || !periodsPerYearR) return null;

    const grossPerPaycheck = divR(annualGrossR, periodsPerYearR);

    const pretaxFixedR = fromScaledUnits(
      (pretaxFixedParsed as any).scaled ?? 0n,
    );
    const pretaxPctR = percentScaledToRatioR(
      (pretaxPctParsed.scaled ?? 0n) as bigint,
    );
    const pretaxAnnual = addR(pretaxFixedR, mulR(annualGrossR, pretaxPctR));
    const pretaxPerPaycheck = divR(pretaxAnnual, periodsPerYearR);

    const taxableBase = subR(grossPerPaycheck, pretaxPerPaycheck);

    const withholdFixedR = fromScaledUnits(
      (withholdFixedParsed as any).scaled ?? 0n,
    );
    const withholdFixedPerPaycheck = divR(withholdFixedR, periodsPerYearR);
    const withholdPctR = percentScaledToRatioR(
      (withholdPctParsed.scaled ?? 0n) as bigint,
    );
    const withholdPctPerPaycheck = mulR(taxableBase, withholdPctR);
    const withholdingPerPaycheck = addR(
      withholdFixedPerPaycheck,
      withholdPctPerPaycheck,
    );

    const posttaxFixedR = fromScaledUnits(
      (posttaxFixedParsed as any).scaled ?? 0n,
    );
    const posttaxFixedPerPaycheck = divR(posttaxFixedR, periodsPerYearR);
    const posttaxPctR = percentScaledToRatioR(
      (posttaxPctParsed.scaled ?? 0n) as bigint,
    );
    const posttaxPctPerPaycheck = mulR(grossPerPaycheck, posttaxPctR);
    const posttaxPerPaycheck = addR(
      posttaxFixedPerPaycheck,
      posttaxPctPerPaycheck,
    );

    const extraGrossR = fromScaledUnits((extraGrossParsed as any).scaled ?? 0n);

    const netPerPaycheck = addR(
      subR(
        subR(subR(grossPerPaycheck, pretaxPerPaycheck), withholdingPerPaycheck),
        posttaxPerPaycheck,
      ),
      extraGrossR,
    );

    const annualNet = mulR(netPerPaycheck, periodsPerYearR);
    const monthlyNet = divR(annualNet, { n: 12n, d: 1n });

    const totalDeductionsPerPaycheck = subR(
      addR(addR(pretaxPerPaycheck, withholdingPerPaycheck), posttaxPerPaycheck),
      { n: 0n, d: 1n },
    );

    return {
      grossPerPaycheck,
      pretaxPerPaycheck,
      taxableBase,
      withholdingPerPaycheck,
      posttaxPerPaycheck,
      extraGrossR,
      totalDeductionsPerPaycheck,
      netPerPaycheck,
      annualNet,
      monthlyNet,
    };
  }, [
    annualGrossR,
    periodsPerYearR,
    pretaxFixedParsed,
    pretaxPctParsed.scaled,
    withholdFixedParsed,
    withholdPctParsed.scaled,
    posttaxFixedParsed,
    posttaxPctParsed.scaled,
    extraGrossParsed,
  ]);

  const netIsNegative = useMemo(() => {
    if (!calc) return false;
    return toScaledUnits(calc.netPerPaycheck) < 0n;
  }, [calc]);

  const formatting = useMemo(() => {
    function formatRationalMoney(r: Rational | null) {
      if (!r) return "—";
      const scaled = toScaledUnits(r);

      const roundedScaled = roundForDisplay
        ? roundScaledToDigits(scaled, displayDecimals)
        : scaled;

      const dec = scaledToDecimalString(roundedScaled, 6, {
        fixed: roundForDisplay ? displayDecimals > 0 : false,
        trimTrailingZeros: !roundForDisplay,
      });

      return formatMoneyFromDecimalString(dec, currency, {
        minimumFractionDigits: roundForDisplay ? displayDecimals : 0,
        maximumFractionDigits: roundForDisplay ? displayDecimals : 12,
      });
    }

    return { formatRationalMoney };
  }, [roundForDisplay, displayDecimals, currency]);

  const inputGroupedDisplay = useMemo(() => {
    if (annualGrossFocused) return annualGross;
    if (!hasInput) return annualGross;
    if (!grossParsed.ok || grossParsed.scaled === undefined) return annualGross;

    const dec = scaledToDecimalString(grossParsed.scaled, 6, {
      trimTrailingZeros: true,
    });

    return formatGroupedNumberFromDecimalString(dec, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  }, [
    annualGrossFocused,
    annualGross,
    hasInput,
    grossParsed.ok,
    grossParsed.scaled,
  ]);

  useEffect(() => {
    if (!safeEnvIsDev()) return;

    const cases = [
      ".5",
      "12.",
      "1,234.56",
      "$1,234.56",
      "1250,50",
      "0.1",
      "12.345",
      "999999999.999999",
    ];

    for (const c of cases) {
      const p = parseMoneyToScaled(c);
      if (!p.ok || p.scaled === undefined) {
        // eslint-disable-next-line no-console
        console.warn("[DEV] Parse failed unexpectedly:", c, p.error);
      }
    }
  }, []);

  const faqData = [
    {
      q: "What does this paycheck calculator estimate?",
      a: "It estimates net pay per paycheck from a gross annual amount and pay frequency. You can optionally add withholding and deductions you control in Advanced settings. It does not apply tax tables or location rules.",
    },
    {
      q: "Does it calculate real taxes?",
      a: "No. This is math-only and assumption-driven. If you add a withholding percentage, it is treated as an estimate you provide, not a jurisdiction-based tax calculation.",
    },
    {
      q: "What does “pre-tax” mean here?",
      a: "Pre-tax deductions reduce the base used for the withholding percentage in this tool. They are user-defined and may represent things like retirement contributions or benefit premiums, depending on your situation.",
    },
    {
      q: "Is rounding applied to the math?",
      a: "No. The calculator parses and computes using decimal-safe math (not floating point). Optional rounding is display-only and clearly labeled.",
    },
    {
      q: "Can I save the results?",
      a: "Yes. Use Print / Save PDF to save a copy from your browser.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
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
    name: "Paycheck Calculator: Estimate Net Pay From Gross",
    description:
      "Estimate net pay per paycheck from a gross annual amount and pay frequency. Add optional withholding and deductions you control with exact decimals.",
    url: "https://www.paycheckconverter.com",
  };

  const amountHelpId = "gross-annual-help";
  const amountStatusId = "gross-annual-status";
  const resultRegionId = "paycheck-results-region";
  const decimalsHelpId = "display-decimals-help";
  const advancedHelpId = "advanced-help";

  return (
    <main className="bg-white text-slate-700 scroll-smooth antialiased">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              a[href]:after { content: ""; }
              #top-links, #bottom-nav, #export-controls { display: none !important; }
              #converter { padding-bottom: 0 !important; }
              .shadow-sm { box-shadow: none !important; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          `,
        }}
      />

      <section
        id="converter"
        className="mx-auto max-w-6xl px-6 pb-8 mt-4 sm:mt-8 sm:pb-12"
      >
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 pt-2">
          <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-center sm:text-left text-2xl sm:text-4xl capitalize font-bold text-sky-800 tracking-tight">
              Paycheck Calculator
            </h1>

            <div
              id="export-controls"
              className="mt-3 hidden sm:flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
            >
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window === "undefined") return;
                    window.print();
                  }}
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7fbff]"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>

          <p id={decimalsHelpId} className="sr-only">
            Controls how many decimals to show when rounding is enabled.
          </p>

          <p id={advancedHelpId} className="sr-only">
            Advanced settings are optional and only affect this estimate. No tax
            tables are applied.
          </p>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Gross income
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={inputGroupedDisplay}
                  onFocus={() => setAnnualGrossFocused(true)}
                  onBlur={() => setAnnualGrossFocused(false)}
                  onChange={(e) => setAnnualGross(e.target.value)}
                  placeholder="e.g. 80000"
                  className="w-full min-w-0 rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                  aria-invalid={!validation.ok}
                  aria-describedby={`${amountHelpId} ${amountStatusId}`}
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                  aria-label="Currency"
                >
                  {CURRENCY_OPTIONS.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {!validation.ok ? (
                <p
                  id={amountStatusId}
                  className="mt-2 text-sm text-rose-700"
                  role="alert"
                  aria-live="polite"
                >
                  {validation.message}
                </p>
              ) : validation.message ? (
                <p
                  id={amountStatusId}
                  className="mt-2 text-sm text-slate-600"
                  aria-live="polite"
                >
                  {validation.message}
                </p>
              ) : (
                <></>
              )}
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Pay frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Frequency)}
                className="cursor-pointer w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                aria-label="Pay frequency"
              >
                {FREQUENCY_ORDER.map((f) => (
                  <option key={f} value={f}>
                    {FREQUENCY_LABEL[f]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <details className="mt-5 group rounded-2xl border border-slate-200 bg-white shadow-sm">
            <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between hover:bg-sky-50 transition">
              <div className="text-sm font-semibold text-slate-900">
                Advanced settings{" "}
                <span className="text-slate-500">(optional)</span>
              </div>
              <span className="ml-4 text-slate-400 transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>

            <div className="px-5 pb-5 pt-3 space-y-6">
              {frequency === "irregular" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Pay periods per year
                    </label>
                    <input
                      inputMode="numeric"
                      value={periodsPerYear}
                      onChange={(e) => setPeriodsPerYear(e.target.value)}
                      placeholder="e.g. 26"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                      aria-describedby={advancedHelpId}
                    />
                    <div className="mt-2 text-xs text-slate-600">
                      Required when frequency is irregular.
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                <div className="text-sm font-bold text-slate-900">
                  Estimated withholding (user-defined)
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Withholding %
                    </label>
                    <input
                      inputMode="decimal"
                      value={withholdPct}
                      onChange={(e) => setWithholdPct(e.target.value)}
                      placeholder="e.g. 18"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                      aria-describedby={advancedHelpId}
                    />
                    <div className="mt-2 text-xs text-slate-600">
                      Applied to (gross per paycheck − pre-tax per paycheck).
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Fixed withholding (annual)
                    </label>
                    <input
                      inputMode="decimal"
                      value={withholdFixedAnnual}
                      onChange={(e) => setWithholdFixedAnnual(e.target.value)}
                      placeholder="e.g. 0"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                      aria-describedby={advancedHelpId}
                    />
                    <div className="mt-2 text-xs text-slate-600">
                      Split evenly across paychecks.
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                <div className="text-sm font-bold text-slate-900">
                  Pre-tax deductions (user-defined)
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Pre-tax %
                    </label>
                    <input
                      inputMode="decimal"
                      value={pretaxPct}
                      onChange={(e) => setPretaxPct(e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                      aria-describedby={advancedHelpId}
                    />
                    <div className="mt-2 text-xs text-slate-600">
                      Calculated from annual gross, then split per paycheck.
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Fixed pre-tax (annual)
                    </label>
                    <input
                      inputMode="decimal"
                      value={pretaxFixedAnnual}
                      onChange={(e) => setPretaxFixedAnnual(e.target.value)}
                      placeholder="e.g. 6000"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                      aria-describedby={advancedHelpId}
                    />
                    <div className="mt-2 text-xs text-slate-600">
                      Split evenly across paychecks.
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                <div className="text-sm font-bold text-slate-900">
                  Post-tax deductions (user-defined)
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Post-tax %
                    </label>
                    <input
                      inputMode="decimal"
                      value={posttaxPct}
                      onChange={(e) => setPosttaxPct(e.target.value)}
                      placeholder="e.g. 2"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                      aria-describedby={advancedHelpId}
                    />
                    <div className="mt-2 text-xs text-slate-600">
                      Applied to gross per paycheck.
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Fixed post-tax (annual)
                    </label>
                    <input
                      inputMode="decimal"
                      value={posttaxFixedAnnual}
                      onChange={(e) => setPosttaxFixedAnnual(e.target.value)}
                      placeholder="e.g. 0"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                      aria-describedby={advancedHelpId}
                    />
                    <div className="mt-2 text-xs text-slate-600">
                      Split evenly across paychecks.
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                <div className="text-sm font-bold text-slate-900">
                  Extra gross per paycheck (optional)
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Extra gross per paycheck
                    </label>
                    <input
                      inputMode="decimal"
                      value={extraGrossThisPaycheck}
                      onChange={(e) =>
                        setExtraGrossThisPaycheck(e.target.value)
                      }
                      placeholder="e.g. 0"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                      aria-describedby={advancedHelpId}
                    />
                    <div className="mt-2 text-xs text-slate-600">
                      Added to gross each paycheck before equivalents are
                      calculated.
                    </div>
                  </div>
                </div>
              </div>

              {!advancedOk ? (
                <p className="text-sm text-rose-700" role="alert">
                  {advancedMessage}
                </p>
              ) : (
                <></>
              )}
            </div>
          </details>

          <div
            id={resultRegionId}
            className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 shadow-sm relative"
            role="region"
            aria-label="Paycheck results"
            aria-live="polite"
          >
            <div className="absolute inset-x-0 top-0 h-0.5 bg-sky-200 rounded-t-2xl" />

            {netIsNegative ? (
              <p className="text-sm text-rose-700" role="alert">
                Net pay is negative with these settings. Reduce withholding or
                deductions to see results.
              </p>
            ) : null}

            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full bg-sky-600"
                aria-hidden="true"
              />
              <div className="text-sm font-semibold text-slate-800">
                Net pay per paycheck
              </div>
            </div>

            <div className="mt-2 flex flex-col">
              <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tabular-nums leading-none min-h-[3.25rem] sm:min-h-[4rem]">
                {validation.ok && !netIsNegative && calc
                  ? formatting.formatRationalMoney(calc.netPerPaycheck)
                  : "—"}
              </div>
            </div>

            <div className="mt-1 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  [
                    "Gross per paycheck",
                    calc?.grossPerPaycheck ?? null,
                    "gross",
                  ],
                  ["Pre-tax", calc?.pretaxPerPaycheck ?? null, "pretax"],
                  [
                    "Withholding",
                    calc?.withholdingPerPaycheck ?? null,
                    "withhold",
                  ],
                  ["Post-tax", calc?.posttaxPerPaycheck ?? null, "posttax"],
                  ["Extra gross", calc?.extraGrossR ?? null, "extra"],
                  [
                    "Total deductions",
                    calc?.totalDeductionsPerPaycheck ?? null,
                    "total",
                  ],
                ] as const
              ).map(([label, val, key]) => (
                <div
                  key={key}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="text-xs font-medium text-slate-600">
                    {label}
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap overflow-hidden text-ellipsis">
                    {validation.ok && !netIsNegative
                      ? formatting.formatRationalMoney(val)
                      : "—"}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div className="text-xs font-medium text-slate-600">
                  Monthly equivalent (estimated)
                </div>
                <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums">
                  {validation.ok && !netIsNegative && calc
                    ? formatting.formatRationalMoney(calc.monthlyNet)
                    : "—"}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div className="text-xs font-medium text-slate-600">
                  Annual equivalent (estimated)
                </div>
                <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums">
                  {validation.ok && !netIsNegative && calc
                    ? formatting.formatRationalMoney(calc.annualNet)
                    : "—"}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6 sm:mt-6">
              <div
                id="export-controls"
                className="mb-3 sm:hidden flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
              >
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window === "undefined") return;
                      window.print();
                    }}
                    className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7fbff]"
                  >
                    Print / Save PDF
                  </button>
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={roundForDisplay}
                  onChange={(e) => setRoundForDisplay(e.target.checked)}
                  className="cursor-pointer h-4 w-4 rounded border-slate-300 text-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                />
                Round results for display
              </label>

              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 select-none">
                <span className="sr-only">Display decimals</span>
                <select
                  value={displayDecimals}
                  onChange={(e) =>
                    setDisplayDecimals(safeDisplayDecimals(e.target.value, 2))
                  }
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                  aria-describedby={decimalsHelpId}
                  aria-label="Display decimals"
                >
                  <option value={0}>0 decimals</option>
                  <option value={2}>2 decimals</option>
                  <option value={4}>4 decimals</option>
                  <option value={6}>6 decimals</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-3 mb-4 rounded-xl bg-emerald-50 p-4">
            <div className="text-sm text-slate-600 leading-relaxed">
              <span className="font-medium text-slate-700">Assumptions:</span>{" "}
              gross is treated as annual. Pay frequency divides the annual
              amount into paychecks. No tax tables or jurisdiction logic are
              applied.
            </div>

            <div className="mt-3 text-sm text-slate-600 leading-relaxed">
              <span className="font-medium text-slate-700">
                What is included:
              </span>{" "}
              math-only net pay estimates using the optional withholding and
              deduction inputs you provide in Advanced settings.
            </div>

            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              <span className="font-medium text-slate-700">Disclaimer:</span>{" "}
              Tools on this site are for informational, planning, and comparison
              purposes only. Results are estimates based on your inputs and the
              assumptions shown. This website does not provide financial, legal,
              or tax advice. Always confirm compensation terms, schedules, and
              policies in your offer letter, contract, or employer
              documentation.
            </p>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-sm"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-slate-100/70 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-10">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-center sm:text-left text-3xl sm:text-4xl font-extrabold text-sky-800 tracking-tight leading-tight">
                    How the paycheck calculator works
                  </h2>
                  <p className="text-center sm:text-left mt-2 text-slate-600 leading-7 max-w-2xl">
                    This tool estimates take-home pay per paycheck from your
                    gross amount and pay frequency, using a simple,
                    user-controlled model for withholdings and deductions. It is
                    designed for quick planning and direct comparison. You enter
                    your gross, choose the pay schedule, and get net per
                    paycheck plus monthly and annual equivalents with a clear
                    breakdown.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Paycheck-based model
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Decimals preserved
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    INPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Gross + frequency
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    MODEL
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Split per paycheck
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    OUTPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Net + breakdown
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    CONTROL
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Advanced settings
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
              {/* SectionCard: What it does */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 7h16M4 12h12M4 17h14"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                        What this paycheck tool gives you
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      This page estimates your{" "}
                      <span className="font-semibold text-slate-900">
                        take-home pay per paycheck
                      </span>{" "}
                      using the most common planning question: “If my gross is X
                      and I’m paid on this schedule, what will I actually see
                      deposited?” The result is meant to be practical and easy
                      to verify. You get a single headline net paycheck amount
                      and a breakdown showing how it was computed.
                    </p>

                    <p>
                      The calculator is intentionally not a full tax engine. It
                      does not fetch government tables, apply jurisdiction
                      rules, or guess your filing situation. Instead, it uses a{" "}
                      <span className="font-semibold text-slate-900">
                        user-defined withholding model
                      </span>{" "}
                      plus optional deductions to produce an estimate that
                      matches the numbers you want to plan with. If your paystub
                      is already withholding around 18% and you contribute
                      $6,000/year pre-tax, you can mirror those assumptions and
                      get a comparable paycheck estimate without needing a
                      complex tax simulation.
                    </p>

                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Net pay per paycheck with a visible breakdown (gross,
                        pre-tax, withholding, post-tax, adjustments)
                      </li>
                      <li>
                        Monthly and annual equivalents derived from the same
                        paycheck math, so the totals stay consistent
                      </li>
                      <li>
                        Advanced settings hidden by default, so the base tool
                        stays fast but power users can model real-world
                        scenarios
                      </li>
                      <li>
                        Display rounding that can be enabled for readability
                        without altering the underlying calculation
                      </li>
                    </ul>

                    <p>
                      The breakdown is designed to be a sanity check. If a
                      result looks wrong, you can usually spot why by looking at
                      the parts: a withholding rate that’s too high, a deduction
                      entered as annual when it should be per paycheck, or an
                      irregular schedule missing the correct pay-period count.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: Base inputs */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 6h16M9 6v12m6-12v12"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                        Base inputs and accepted formats
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      Start with your gross pay amount and pay frequency. The
                      gross input is read as the source value for the selected
                      frequency. If you enter a number and select “Annual,” the
                      tool treats it as annual gross and divides it into
                      paychecks. If you select “Weekly,” it treats it as weekly
                      gross and annualizes it for equivalents.
                    </p>

                    <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Examples of valid input
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>80000</li>
                        <li>5,000</li>
                        <li>5000.25</li>
                        <li>$5,000.25</li>
                        <li>.5 (interpreted as 0.5)</li>
                      </ul>
                    </div>

                    <p>
                      Currency selection controls formatting only. The
                      calculator does not perform exchange-rate conversion. That
                      keeps the tool predictable when you are comparing offers
                      or planning within a single currency.
                    </p>

                    <p>
                      If you choose{" "}
                      <span className="font-semibold text-slate-900">
                        Irregular
                      </span>
                      , the calculator needs one extra input:{" "}
                      <span className="font-semibold text-slate-900">
                        pay periods per year
                      </span>
                      . This is the simplest way to model nonstandard pay
                      schedules (13 paychecks, 20 draws, contract milestones)
                      without inventing calendar logic.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: Advanced settings */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v12m-6-6h12"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                        Advanced settings are optional on purpose
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      Many paycheck calculators fail because they assume too
                      much. To keep this tool usable for most people, advanced
                      inputs are hidden by default. You only expand them when
                      you need to reflect what your paystub already shows.
                    </p>

                    <p>
                      Advanced settings are grouped by how payroll math usually
                      works. Each category is applied in a predictable order so
                      you can reason about the result:
                    </p>

                    <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Calculation order
                      </div>
                      <ol className="mt-2 list-decimal pl-5 space-y-2">
                        <li>
                          Convert your gross to{" "}
                          <span className="font-semibold text-slate-900">
                            gross per paycheck
                          </span>{" "}
                          based on pay frequency (or your irregular pay-period
                          count).
                        </li>
                        <li>
                          Subtract{" "}
                          <span className="font-semibold text-slate-900">
                            pre-tax deductions
                          </span>{" "}
                          (percent or fixed annual, split across paychecks).
                        </li>
                        <li>
                          Apply{" "}
                          <span className="font-semibold text-slate-900">
                            withholding
                          </span>{" "}
                          (percent and/or fixed annual, split across paychecks).
                        </li>
                        <li>
                          Subtract{" "}
                          <span className="font-semibold text-slate-900">
                            post-tax deductions
                          </span>{" "}
                          (percent or fixed annual, split across paychecks).
                        </li>
                        <li>
                          Add optional{" "}
                          <span className="font-semibold text-slate-900">
                            extra gross per paycheck
                          </span>{" "}
                          (recurring).
                        </li>
                      </ol>
                    </div>

                    <p>
                      Withholding is labeled “estimated” because it is a
                      planning input. Use the percentage from your recent
                      paystub if you want the estimate to match what you
                      typically see. If you are trying to test scenarios (new
                      benefits, higher pre-tax contribution, a bonus), keep your
                      withholding assumption consistent so you can isolate what
                      changed.
                    </p>

                    <p>
                      Fixed annual deduction fields exist because some values
                      are naturally annual (for example, a yearly benefit
                      premium or a planned annual contribution). The tool splits
                      these evenly across paychecks using the same pay-period
                      model as the gross. That keeps the per-paycheck estimate
                      aligned with the selected pay schedule and ensures the
                      annual equivalent reconciles with the sum of paychecks.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: Outputs + equivalents */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 7h10v10H7z"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                        Output you get and how rounding is handled
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      The main result is{" "}
                      <span className="font-semibold text-slate-900">
                        net pay per paycheck
                      </span>
                      . Under it, the calculator shows the parts that created
                      that net: gross per paycheck, pre-tax deductions,
                      withholding, post-tax deductions, and any extra gross per
                      paycheck. This breakdown is the core of the tool because
                      it makes the estimate easy to verify.
                    </p>

                    <p>
                      The monthly and annual equivalents are derived from the
                      net paycheck amount and the selected pay-period model.
                      They are labeled “estimated” because they assume the same
                      inputs repeat consistently across the year. If you have
                      variable hours, irregular commissions, or seasonal
                      deductions, the per-paycheck view remains useful, but
                      annualizing it becomes more scenario-based.
                    </p>

                    <p>
                      Rounding is display-only. Internally, the calculator
                      preserves decimals through all steps, then formats the
                      final presentation for readability. If you enable
                      rounding, it changes how numbers look, not the underlying
                      computation.
                    </p>

                    <div className="mt-4 rounded-2xl bg-sky-50 ring-1 ring-sky-200/70 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Common interpretation mistake
                      </div>
                      <p className="mt-2">
                        Make sure the gross input matches the selected
                        frequency. A “$5,000 gross” value can mean annual,
                        monthly, or per paycheck depending on the context. The
                        tool will still produce internally consistent results
                        even if the wrong frequency is selected, but it will
                        represent a different scenario.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dark callout block like the reference file */}
              <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-7">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                >
                  <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-sky-500 blur-3xl opacity-20" />
                  <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-slate-500 blur-3xl opacity-30" />
                </div>

                <div className="relative">
                  <div className="text-sm font-semibold text-sky-300">
                    Utility note
                  </div>
                  <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                    Estimates are math-based, not payroll promises
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    This calculator estimates take-home pay using your inputs
                    and a user-defined withholding and deductions model. It does
                    not apply jurisdiction tax rules, filing status logic,
                    employer policy, or pay-date calendars. For the most
                    accurate estimate, mirror the rates and deduction amounts
                    shown on a recent paystub and adjust only what you want to
                    test.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="max-w-5xl mx-auto pb-16 px-6 pt-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-sky-800 tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-slate-200">
          {faqData.map((f, i) => (
            <details key={i} className="group py-4">
              <summary className="cursor-pointer list-none font-semibold text-lg text-sky-800 flex items-center justify-between hover:text-sky-900">
                <span>{f.q}</span>
                <span className="ml-4 text-slate-400 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <div className="mt-2 text-slate-700 leading-relaxed max-w-prose">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
