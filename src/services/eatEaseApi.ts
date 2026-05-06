import type {
  AdminDraftMenuItem,
  DiningTable,
  MenuCategory,
  MenuItem,
  MenuSnapshot,
  Order,
  OrderStatus,
} from "../types";

const defaultCategories: MenuCategory[] = [
  { id: "cat-drinks", name: { th: "เครื่องดื่ม", en: "Drinks" }, sortOrder: 1, isActive: true },
  { id: "cat-mains", name: { th: "อาหารจานหลัก", en: "Mains" }, sortOrder: 2, isActive: true },
  { id: "cat-snacks", name: { th: "ของทานเล่น", en: "Snacks" }, sortOrder: 3, isActive: true },
  { id: "cat-roti", name: { th: "โรตี", en: "Roti" }, sortOrder: 4, isActive: true },
  { id: "cat-bread", name: { th: "ขนมปัง", en: "Toast" }, sortOrder: 5, isActive: true },
  { id: "cat-yum", name: { th: "ยำ", en: "Spicy Salads" }, sortOrder: 6, isActive: true },
];

const defaultItems: MenuItem[] = [
  {
    id: "item-thai-tea",
    categoryId: "cat-drinks",
    name: { th: "ชาไทยเย็น", en: "Thai Iced Tea" },
    description: { th: "ชาไทยเข้มข้น หวานมัน", en: "Strong Thai tea with creamy milk" },
    price: 55,
    imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=320&q=70",
    isAvailable: true,
    isRecommended: true,
  },
  {
    id: "item-krapao",
    categoryId: "cat-mains",
    name: { th: "กะเพราไก่ไข่ดาว", en: "Chicken Basil Rice" },
    description: { th: "ผัดกะเพราหอม ๆ เสิร์ฟพร้อมไข่ดาว", en: "Fragrant basil stir-fry with crispy fried egg" },
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=320&q=70",
    isAvailable: true,
    isRecommended: true,
  },
  {
    id: "item-roti",
    categoryId: "cat-roti",
    name: { th: "โรตีกล้วยช็อกโกแลต", en: "Banana Chocolate Roti" },
    description: { th: "โรตีกรอบนอกนุ่มใน ราดช็อกโกแลต", en: "Crispy roti with banana and chocolate drizzle" },
    price: 69,
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=320&q=70",
    isAvailable: true,
  },
  {
    id: "item-yum",
    categoryId: "cat-yum",
    name: { th: "ยำวุ้นเส้นทะเล", en: "Seafood Glass Noodle Salad" },
    description: { th: "เปรี้ยว เผ็ด สดชื่น", en: "Bright, spicy, and refreshing" },
    price: 129,
    imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=320&q=70",
    isAvailable: true,
  },
];

const defaultTables: DiningTable[] = [
  { id: "table-1", slug: "a1", number: "1", isActive: true },
  { id: "table-2", slug: "a2", number: "2", isActive: true },
  { id: "table-3", slug: "vip", number: "VIP", isActive: true },
];

type Store = {
  categories: MenuCategory[];
  items: MenuItem[];
  tables: DiningTable[];
  orders: Order[];
};

type Listener = () => void;

const storageKey = "eatease-demo-store";
const listeners = new Set<Listener>();
const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("eatease-demo") : null;

function initialStore(): Store {
  const raw = localStorage.getItem(storageKey);
  if (raw) return JSON.parse(raw) as Store;
  return { categories: defaultCategories, items: defaultItems, tables: defaultTables, orders: [] };
}

function readStore() {
  return initialStore();
}

function writeStore(store: Store) {
  localStorage.setItem(storageKey, JSON.stringify(store));
  listeners.forEach((listener) => listener());
  channel?.postMessage("changed");
}

channel?.addEventListener("message", () => listeners.forEach((listener) => listener()));

export const eatEaseApi = {
  async getMenu(): Promise<MenuSnapshot> {
    const store = readStore();
    return {
      categories: store.categories.filter((category) => category.isActive).sort((a, b) => a.sortOrder - b.sortOrder),
      items: store.items,
    };
  },

  async getTables(): Promise<DiningTable[]> {
    return readStore().tables;
  },

  async getTableBySlug(slug: string): Promise<DiningTable | undefined> {
    return readStore().tables.find((table) => table.slug === slug && table.isActive);
  },

  async submitOrder(input: {
    tableId: string;
    customerNote?: string;
    items: Array<{ menuItemId: string; quantity: number; note?: string }>;
  }): Promise<Order> {
    const store = readStore();
    const table = store.tables.find((entry) => entry.id === input.tableId);
    if (!table) throw new Error("Unknown table");

    const orderItems = input.items.map((line) => {
      const item = store.items.find((entry) => entry.id === line.menuItemId);
      if (!item) throw new Error("Unknown menu item");
      return {
        id: crypto.randomUUID(),
        menuItemId: item.id,
        name: item.name,
        quantity: line.quantity,
        unitPrice: item.price,
        note: line.note,
      };
    });

    const now = new Date().toISOString();
    const order: Order = {
      id: crypto.randomUUID(),
      tableId: table.id,
      tableNumber: table.number,
      status: "new",
      items: orderItems,
      total: orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
      createdAt: now,
      updatedAt: now,
      customerNote: input.customerNote,
    };
    writeStore({ ...store, orders: [order, ...store.orders] });
    return order;
  },

  async getOrders(tableId?: string): Promise<Order[]> {
    const orders = readStore().orders;
    return tableId ? orders.filter((order) => order.tableId === tableId) : orders;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const store = readStore();
    let updated: Order | undefined;
    const orders = store.orders.map((order) => {
      if (order.id !== orderId) return order;
      updated = { ...order, status, updatedAt: new Date().toISOString() };
      return updated;
    });
    if (!updated) throw new Error("Unknown order");
    writeStore({ ...store, orders });
    return updated;
  },

  async saveCategory(category: MenuCategory): Promise<MenuCategory> {
    const store = readStore();
    const categories = store.categories.some((entry) => entry.id === category.id)
      ? store.categories.map((entry) => (entry.id === category.id ? category : entry))
      : [...store.categories, { ...category, id: crypto.randomUUID() }];
    writeStore({ ...store, categories });
    return category;
  },

  async saveMenuItem(item: AdminDraftMenuItem): Promise<MenuItem> {
    const store = readStore();
    const nextItem: MenuItem = { ...item, id: item.id ?? crypto.randomUUID() };
    const items = store.items.some((entry) => entry.id === nextItem.id)
      ? store.items.map((entry) => (entry.id === nextItem.id ? nextItem : entry))
      : [nextItem, ...store.items];
    writeStore({ ...store, items });
    return nextItem;
  },

  async saveTable(table: DiningTable): Promise<DiningTable> {
    const store = readStore();
    const tables = store.tables.some((entry) => entry.id === table.id)
      ? store.tables.map((entry) => (entry.id === table.id ? table : entry))
      : [...store.tables, { ...table, id: crypto.randomUUID() }];
    writeStore({ ...store, tables });
    return table;
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
