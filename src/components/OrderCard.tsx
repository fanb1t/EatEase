import { CheckCircle2, Clock, CookingPot, XCircle } from "lucide-react";
import { StatusPill } from "./StatusPill";
import { statusLabels } from "../i18n/messages";
import type { Locale, Order, OrderStatus } from "../types";
import { localize, money, shortTime } from "../utils/format";

const nextStatuses: OrderStatus[] = ["accepted", "preparing", "ready", "served", "cancelled"];

const icons: Record<OrderStatus, typeof Clock> = {
  new: Clock,
  accepted: CheckCircle2,
  preparing: CookingPot,
  ready: CheckCircle2,
  served: CheckCircle2,
  cancelled: XCircle,
};

type Props = {
  order: Order;
  locale: Locale;
  onStatusChange?: (orderId: string, status: OrderStatus) => void;
};

export function OrderCard({ order, locale, onStatusChange }: Props) {
  const Icon = icons[order.status];
  return (
    <article className="order-card">
      <div className="order-card-head">
        <div>
          <span className="eyebrow">#{order.id.slice(0, 8)}</span>
          <h3>
            <Icon size={20} />
            Table {order.tableNumber}
          </h3>
        </div>
        <div className="order-meta">
          <StatusPill locale={locale} status={order.status} />
          <span>{shortTime(order.createdAt, locale)}</span>
        </div>
      </div>
      <div className="order-lines">
        {order.items.map((item) => (
          <div key={item.id}>
            <span>
              {item.quantity}x {localize(item.name, locale)}
            </span>
            <strong>{money(item.unitPrice * item.quantity, locale)}</strong>
          </div>
        ))}
      </div>
      {order.customerNote && <p className="note">{order.customerNote}</p>}
      <div className="order-footer">
        <strong>{money(order.total, locale)}</strong>
        {onStatusChange && (
          <div className="status-actions">
            {nextStatuses.map((status) => (
              <button key={status} onClick={() => onStatusChange(order.id, status)} type="button">
                {statusLabels[locale][status]}
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
