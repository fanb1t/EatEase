import { ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MenuItemCard } from "../components/MenuItemCard";
import { OrderCard } from "../components/OrderCard";
import { QuantityStepper } from "../components/QuantityStepper";
import { eatEaseApi } from "../services/eatEaseApi";
import { t } from "../i18n/messages";
import type { CartLine, DiningTable, Locale, MenuCategory, MenuItem, Order } from "../types";
import { localize, money } from "../utils/format";

type Props = {
  locale: Locale;
  tableSlug: string;
};

export function CustomerPage({ locale, tableSlug }: Props) {
  const [table, setTable] = useState<DiningTable>();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const [tableResult, menu] = await Promise.all([eatEaseApi.getTableBySlug(tableSlug), eatEaseApi.getMenu()]);
      if (!mounted) return;
      setTable(tableResult);
      setCategories(menu.categories);
      setItems(menu.items.filter((item) => item.isAvailable));
      if (tableResult) setOrders(await eatEaseApi.getOrders(tableResult.id));
      setLoading(false);
    }
    load();
    const unsubscribe = eatEaseApi.subscribe(load);
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [tableSlug]);

  const visibleItems = useMemo(
    () => items.filter((item) => activeCategory === "all" || item.categoryId === activeCategory),
    [activeCategory, items]
  );

  const subtotal = cart.reduce((sum, line) => sum + line.item.price * line.quantity, 0);

  function addToCart(item: MenuItem) {
    setCart((current) => {
      const existing = current.find((line) => line.item.id === item.id);
      if (existing) {
        return current.map((line) => (line.item.id === item.id ? { ...line, quantity: line.quantity + 1 } : line));
      }
      return [...current, { item, quantity: 1 }];
    });
  }

  function updateQuantity(itemId: string, quantity: number) {
    setCart((current) =>
      quantity === 0
        ? current.filter((line) => line.item.id !== itemId)
        : current.map((line) => (line.item.id === itemId ? { ...line, quantity } : line))
    );
  }

  async function submitOrder() {
    if (!table || cart.length === 0) return;
    const order = await eatEaseApi.submitOrder({
      tableId: table.id,
      customerNote: note,
      items: cart.map((line) => ({ menuItemId: line.item.id, quantity: line.quantity, note: line.note })),
    });
    setOrders((current) => [order, ...current]);
    setCart([]);
    setNote("");
  }

  if (loading) return <main className="page-grid"><div className="skeleton hero-skeleton" /></main>;

  if (!table) {
    return (
      <main className="center-state">
        <h1>Table not found</h1>
        <p>Please ask staff to check the QR code.</p>
      </main>
    );
  }

  return (
    <main className="page-grid customer-layout">
      <section className="menu-pane">
        <div className="page-title">
          <div>
            <span className="eyebrow">{t(locale, "table")} {table.number}</span>
            <h1>{t(locale, "appName")}</h1>
            <p>{t(locale, "customerSubtitle")}</p>
          </div>
        </div>
        <div className="category-strip">
          <button className={activeCategory === "all" ? "active" : ""} onClick={() => setActiveCategory("all")} type="button">
            {t(locale, "all")}
          </button>
          {categories.map((category) => (
            <button
              className={activeCategory === category.id ? "active" : ""}
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              type="button"
            >
              {localize(category.name, locale)}
            </button>
          ))}
        </div>
        <div className="menu-grid">
          {visibleItems.map((item) => (
            <MenuItemCard item={item} key={item.id} locale={locale} onAdd={addToCart} />
          ))}
        </div>
      </section>

      <aside className="cart-panel">
        <div className="panel-title">
          <ShoppingBag size={20} />
          <h2>{t(locale, "cart")}</h2>
        </div>
        {cart.length === 0 && <p className="empty">{t(locale, "emptyCart")}</p>}
        {cart.map((line) => (
          <div className="cart-line" key={line.item.id}>
            <div>
              <strong>{localize(line.item.name, locale)}</strong>
              <span>{money(line.item.price, locale)}</span>
            </div>
            <QuantityStepper value={line.quantity} onChange={(quantity) => updateQuantity(line.item.id, quantity)} />
          </div>
        ))}
        <label className="field">
          <span>{t(locale, "customerNote")}</span>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} />
        </label>
        <div className="cart-total">
          <span>{t(locale, "subtotal")}</span>
          <strong>{money(subtotal, locale)}</strong>
        </div>
        <button className="primary wide" disabled={cart.length === 0} onClick={submitOrder} type="button">
          {t(locale, "submitOrder")}
        </button>

        <div className="stack-section">
          <h2>{t(locale, "yourOrder")}</h2>
          {orders.slice(0, 3).map((order) => (
            <OrderCard key={order.id} locale={locale} order={order} />
          ))}
        </div>
      </aside>
    </main>
  );
}
