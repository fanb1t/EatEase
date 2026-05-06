import { Plus, Star } from "lucide-react";
import { t } from "../i18n/messages";
import type { Locale, MenuItem } from "../types";
import { localize, money } from "../utils/format";

type Props = {
  item: MenuItem;
  locale: Locale;
  onAdd: (item: MenuItem) => void;
};

export function MenuItemCard({ item, locale, onAdd }: Props) {
  return (
    <article className={`menu-card ${!item.isAvailable ? "muted" : ""}`}>
      <img alt={localize(item.name, locale)} loading="lazy" src={item.thumbnailUrl || item.imageUrl} />
      <div className="menu-card-body">
        <div className="card-title-row">
          <h3>{localize(item.name, locale)}</h3>
          {item.isRecommended && (
            <span className="badge">
              <Star size={14} />
              {t(locale, "recommended")}
            </span>
          )}
        </div>
        <p>{localize(item.description, locale)}</p>
        <div className="card-actions">
          <strong>{money(item.price, locale)}</strong>
          <button className="primary small" disabled={!item.isAvailable} onClick={() => onAdd(item)} type="button">
            <Plus size={16} />
            <span>{item.isAvailable ? t(locale, "add") : t(locale, "unavailable")}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
