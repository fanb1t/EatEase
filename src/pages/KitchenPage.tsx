import { ChefHat } from "lucide-react";
import { useEffect, useState } from "react";
import { OrderCard } from "../components/OrderCard";
import { eatEaseApi } from "../services/eatEaseApi";
import { t } from "../i18n/messages";
import type { Locale, Order, OrderStatus } from "../types";

type Props = {
  locale: Locale;
};

export function KitchenPage({ locale }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function load() {
      setOrders(await eatEaseApi.getOrders());
    }
    load();
    return eatEaseApi.subscribe(load);
  }, []);

  async function updateStatus(orderId: string, status: OrderStatus) {
    await eatEaseApi.updateOrderStatus(orderId, status);
    setOrders(await eatEaseApi.getOrders());
  }

  const activeOrders = orders.filter((order) => order.status !== "served" && order.status !== "cancelled");
  const completedOrders = orders.filter((order) => order.status === "served" || order.status === "cancelled");

  return (
    <main className="page-grid">
      <section className="page-title">
        <div>
          <span className="eyebrow">{t(locale, "orders")}</span>
          <h1>
            <ChefHat size={34} />
            {t(locale, "kitchen")}
          </h1>
        </div>
      </section>
      {orders.length === 0 && <div className="center-state"><p>{t(locale, "noOrders")}</p></div>}
      <section className="order-board">
        {activeOrders.map((order) => (
          <OrderCard key={order.id} locale={locale} onStatusChange={updateStatus} order={order} />
        ))}
      </section>
      {completedOrders.length > 0 && (
        <section className="compact-list">
          <h2>Done</h2>
          {completedOrders.slice(0, 8).map((order) => (
            <OrderCard key={order.id} locale={locale} order={order} />
          ))}
        </section>
      )}
    </main>
  );
}
