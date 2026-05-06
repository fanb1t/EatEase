import { statusLabels } from "../i18n/messages";
import type { Locale, OrderStatus } from "../types";

type Props = {
  locale: Locale;
  status: OrderStatus;
};

export function StatusPill({ locale, status }: Props) {
  return <span className={`status-pill status-${status}`}>{statusLabels[locale][status]}</span>;
}
