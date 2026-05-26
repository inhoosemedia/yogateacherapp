const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
  CAD: "C$",
  NZD: "NZ$",
  ZAR: "R",
  SGD: "S$",
  HKD: "HK$",
  JPY: "¥",
  AED: "AED ",
  CHF: "CHF ",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  MXN: "MX$",
  BRL: "R$",
  INR: "₹",
};

export function formatMoney(cents: number, currency: string) {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  // JPY has no minor units — display as whole yen.
  if (currency === "JPY") {
    return `${symbol}${Math.round(cents / 100).toLocaleString()}`;
  }
  return `${symbol}${(cents / 100).toFixed(2)}`;
}

export function currencySymbol(currency: string) {
  return CURRENCY_SYMBOLS[currency] ?? currency;
}

/**
 * Currencies offered in studio settings + onboarding. Order picks the
 * common-default-first heuristic. Code → display label.
 */
export const CURRENCY_OPTIONS: { code: string; label: string }[] = [
  { code: "USD", label: "US Dollar ($)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "GBP", label: "British Pound (£)" },
  { code: "AUD", label: "Australian Dollar (A$)" },
  { code: "CAD", label: "Canadian Dollar (C$)" },
  { code: "NZD", label: "New Zealand Dollar (NZ$)" },
  { code: "ZAR", label: "South African Rand (R)" },
  { code: "SGD", label: "Singapore Dollar (S$)" },
  { code: "HKD", label: "Hong Kong Dollar (HK$)" },
  { code: "JPY", label: "Japanese Yen (¥)" },
  { code: "AED", label: "UAE Dirham (AED)" },
  { code: "CHF", label: "Swiss Franc (CHF)" },
  { code: "SEK", label: "Swedish Krona (kr)" },
  { code: "NOK", label: "Norwegian Krone (kr)" },
  { code: "DKK", label: "Danish Krone (kr)" },
  { code: "MXN", label: "Mexican Peso (MX$)" },
  { code: "BRL", label: "Brazilian Real (R$)" },
  { code: "INR", label: "Indian Rupee (₹)" },
];

/**
 * Common IANA timezones offered in studio settings. Grouped by region for
 * scannability. Studio.timezone column stores the canonical IANA string.
 */
export const TIMEZONE_OPTIONS: {
  group: string;
  zones: { value: string; label: string }[];
}[] = [
  {
    group: "Africa",
    zones: [
      { value: "Africa/Johannesburg", label: "Johannesburg (SAST)" },
      { value: "Africa/Cairo", label: "Cairo (EET)" },
      { value: "Africa/Lagos", label: "Lagos (WAT)" },
      { value: "Africa/Nairobi", label: "Nairobi (EAT)" },
    ],
  },
  {
    group: "Americas",
    zones: [
      { value: "America/Los_Angeles", label: "Los Angeles (PT)" },
      { value: "America/Denver", label: "Denver (MT)" },
      { value: "America/Chicago", label: "Chicago (CT)" },
      { value: "America/New_York", label: "New York (ET)" },
      { value: "America/Toronto", label: "Toronto (ET)" },
      { value: "America/Mexico_City", label: "Mexico City (CST)" },
      { value: "America/Sao_Paulo", label: "São Paulo (BRT)" },
    ],
  },
  {
    group: "Europe",
    zones: [
      { value: "Europe/London", label: "London (GMT/BST)" },
      { value: "Europe/Dublin", label: "Dublin (GMT/IST)" },
      { value: "Europe/Lisbon", label: "Lisbon (WET)" },
      { value: "Europe/Paris", label: "Paris (CET)" },
      { value: "Europe/Berlin", label: "Berlin (CET)" },
      { value: "Europe/Amsterdam", label: "Amsterdam (CET)" },
      { value: "Europe/Madrid", label: "Madrid (CET)" },
      { value: "Europe/Rome", label: "Rome (CET)" },
      { value: "Europe/Athens", label: "Athens (EET)" },
      { value: "Europe/Stockholm", label: "Stockholm (CET)" },
      { value: "Europe/Zurich", label: "Zurich (CET)" },
    ],
  },
  {
    group: "Asia",
    zones: [
      { value: "Asia/Dubai", label: "Dubai (GST)" },
      { value: "Asia/Kolkata", label: "India (IST)" },
      { value: "Asia/Bangkok", label: "Bangkok (ICT)" },
      { value: "Asia/Singapore", label: "Singapore (SGT)" },
      { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)" },
      { value: "Asia/Tokyo", label: "Tokyo (JST)" },
      { value: "Asia/Seoul", label: "Seoul (KST)" },
      { value: "Asia/Shanghai", label: "Shanghai (CST)" },
    ],
  },
  {
    group: "Oceania",
    zones: [
      { value: "Australia/Perth", label: "Perth (AWST)" },
      { value: "Australia/Adelaide", label: "Adelaide (ACDT/ACST)" },
      { value: "Australia/Sydney", label: "Sydney (AEDT/AEST)" },
      { value: "Pacific/Auckland", label: "Auckland (NZDT/NZST)" },
    ],
  },
  {
    group: "UTC",
    zones: [{ value: "UTC", label: "UTC" }],
  },
];
