import type { Locale } from "../types";

type Props = {
  locale: Locale;
  onChange: (locale: Locale) => void;
};

export function LocaleToggle({ locale, onChange }: Props) {
  return (
    <div className="segmented" aria-label="Language">
      <button className={locale === "th" ? "active" : ""} onClick={() => onChange("th")} type="button">
        TH
      </button>
      <button className={locale === "en" ? "active" : ""} onClick={() => onChange("en")} type="button">
        EN
      </button>
    </div>
  );
}
