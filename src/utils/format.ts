import type { Locale, LocalizedText } from "../types";

export function localize(text: LocalizedText, locale: Locale) {
  return text[locale] || text.en || text.th;
}

export function money(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function shortTime(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
