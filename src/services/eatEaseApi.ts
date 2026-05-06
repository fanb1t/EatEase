import { mockCategories, mockMenuItems, mockTables } from "../lib/mockData";
import { hasSupabaseConfig } from "../lib/supabase";
import type {
  AdminDraftMenuItem,
  DiningTable,
  MenuCategory,
  MenuItem,
  MenuSnapshot,
  Order,
  OrderStatus,
} from "../types";
import type { OrderStatus as BackendOrderStatus } from "../types/database";
import type {
  DiningTable as BackendDiningTable,
  MenuCategory as BackendMenuCategory,
  MenuItem as BackendMenuItem,
  OrderWithItems,
} from "../types/eatease";
import { upsertDiningTable, upsertMenuCategory, upsertMenuItem } from "./adminService";
import { getMenu as getBackendMenu, getMenuItems } from "./menuService";
import { createOrder, getKitchenOrders, updateOrderStatus as updateBackendOrderStatus } from "./orderService";
import { subscribeToKitchenOrders } from "./realtimeService";
import { getTableBySlug as getBackendTableBySlug, getTables as getBackendTables } from "./tableService";

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

const defaultCategories = mockCategories.map(toUiCategory);
const defaultItems = mockMenuItems.map(toUiMenuItem);
const defaultTables = mockTables.map(toUiTable);

function initialStore(): Store {
  if (typeof localStorage === "undefined") {
    return { categories: defaultCategories, items: defaultItems, tables: defaultTables, orders: [] };
  }

  const raw = localStorage.getItem(storageKey);
  if (raw) return JSON.parse(raw) as Store;
  return { categories: defaultCategories, items: defaultItems, tables: defaultTables, orders: [] };
}

function readStore() {
  return initialStore();
}

function writeStore(store: Store) {
  if (typeof localStorage === "undefined") return;

  localStorage.setItem(storageKey, JSON.stringify(store));
  listeners.forEach((listener) => listener());
  channel?.postMessage("changed");
}

channel?.addEventListener("message", () => listeners.forEach((listener) => listener()));

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  return slug || createId();
}

function toUiTable(table: BackendDiningTable): DiningTable {
  return {
    id: table.id,
    slug: table.slug,
    number: table.table_number,
    label: table.display_name ? { th: table.display_name, en: table.display_name } : undefined,
    isActive: table.is_active,
  };
}

function toUiCategory(category: BackendMenuCategory): MenuCategory {
  return {
    id: category.id,
    name: { th: category.name_th, en: category.name_en },
    sortOrder: category.sort_order,
    isActive: category.is_active,
  };
}

function toUiMenuItem(item: BackendMenuItem): MenuItem {
  return {
    id: item.id,
    categoryId: item.category_id,
    name: { th: item.name_th, en: item.name_en },
    description: { th: item.description_th ?? "", en: item.description_en ?? "" },
    price: Number(item.price),
    imageUrl: item.image_url ?? undefined,
    thumbnailUrl: item.thumbnail_url ?? undefined,
    isAvailable: item.is_available,
  };
}

function toUiStatus(status: BackendOrderStatus): OrderStatus {
  return status;
}

function toUiOrder(order: OrderWithItems): Order {
  return {
    id: order.id,
    tableId: order.table_id,
    tableNumber: order.table_number,
    status: toUiStatus(order.status),
    items: order.items.map((item) => ({
      id: item.id,
      menuItemId: item.menu_item_id ?? "",
      name: { th: item.item_name_th, en: item.item_name_en },
      quantity: item.quantity,
      unitPrice: Number(item.unit_price),
      note: item.notes ?? undefined,
    })),
    total: Number(order.total),
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    customerNote: order.notes ?? undefined,
  };
}

export const eatEaseApi = {
  async getMenu(): Promise<MenuSnapshot> {
    if (hasSupabaseConfig) {
      const [categories, items] = await Promise.all([getBackendMenu(), getMenuItems()]);
      return {
        categories: categories.map(toUiCategory),
        items: items.map(toUiMenuItem),
      };
    }

    const store = readStore();
    return {
      categories: store.categories.filter((category) => category.isActive).sort((a, b) => a.sortOrder - b.sortOrder),
      items: store.items,
    };
  },

  async getTables(): Promise<DiningTable[]> {
    if (hasSupabaseConfig) {
      return (await getBackendTables()).map(toUiTable);
    }

    return readStore().tables;
  },

  async getTableBySlug(slug: string): Promise<DiningTable | undefined> {
    if (hasSupabaseConfig) {
      const table = await getBackendTableBySlug(slug);
      return table ? toUiTable(table) : undefined;
    }

    return readStore().tables.find((table) => table.slug === slug && table.isActive);
  },

  async submitOrder(input: {
    tableId: string;
    customerNote?: string;
    items: Array<{ menuItemId: string; quantity: number; note?: string }>;
  }): Promise<Order> {
    if (hasSupabaseConfig) {
      const table = (await getBackendTables()).find((entry) => entry.id === input.tableId);
      if (!table) throw new Error("Unknown table");

      const order = await createOrder({
        tableSlug: table.slug,
        notes: input.customerNote,
        items: input.items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          notes: item.note,
        })),
      });

      return toUiOrder(order);
    }

    const store = readStore();
    const table = store.tables.find((entry) => entry.id === input.tableId);
    if (!table) throw new Error("Unknown table");

    const orderItems = input.items.map((line) => {
      const item = store.items.find((entry) => entry.id === line.menuItemId);
      if (!item) throw new Error("Unknown menu item");
      return {
        id: createId(),
        menuItemId: item.id,
        name: item.name,
        quantity: line.quantity,
        unitPrice: item.price,
        note: line.note,
      };
    });

    const now = new Date().toISOString();
    const order: Order = {
      id: createId(),
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
    if (hasSupabaseConfig) {
      const orders = await getKitchenOrders(["new", "accepted", "preparing", "ready", "served", "cancelled"]);
      return orders.filter((order) => !tableId || order.table_id === tableId).map(toUiOrder);
    }

    const orders = readStore().orders;
    return tableId ? orders.filter((order) => order.tableId === tableId) : orders;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    if (hasSupabaseConfig) {
      await updateBackendOrderStatus({ orderId, status });
      const order = (await getKitchenOrders(["new", "accepted", "preparing", "ready", "served", "cancelled"]))
        .find((candidate) => candidate.id === orderId);

      if (!order) throw new Error("Unknown order");
      return toUiOrder(order);
    }

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
    if (hasSupabaseConfig) {
      const saved = await upsertMenuCategory({
        id: category.id || undefined,
        slug: slugify(category.name.en || category.name.th),
        name_th: category.name.th,
        name_en: category.name.en,
        sort_order: category.sortOrder,
        is_active: category.isActive,
      });

      return toUiCategory(saved);
    }

    const store = readStore();
    const categories = store.categories.some((entry) => entry.id === category.id)
      ? store.categories.map((entry) => (entry.id === category.id ? category : entry))
      : [...store.categories, { ...category, id: createId() }];
    writeStore({ ...store, categories });
    return category;
  },

  async saveMenuItem(item: AdminDraftMenuItem): Promise<MenuItem> {
    if (hasSupabaseConfig) {
      const saved = await upsertMenuItem({
        id: item.id,
        category_id: item.categoryId,
        slug: slugify(item.name.en || item.name.th),
        name_th: item.name.th,
        name_en: item.name.en,
        description_th: item.description.th,
        description_en: item.description.en,
        price: item.price,
        image_url: item.imageUrl || null,
        thumbnail_url: item.thumbnailUrl || item.imageUrl || null,
        is_available: item.isAvailable,
      });

      return toUiMenuItem(saved);
    }

    const store = readStore();
    const nextItem: MenuItem = { ...item, id: item.id ?? createId() };
    const items = store.items.some((entry) => entry.id === nextItem.id)
      ? store.items.map((entry) => (entry.id === nextItem.id ? nextItem : entry))
      : [nextItem, ...store.items];
    writeStore({ ...store, items });
    return nextItem;
  },

  async saveTable(table: DiningTable): Promise<DiningTable> {
    if (hasSupabaseConfig) {
      const saved = await upsertDiningTable({
        id: table.id || undefined,
        slug: table.slug,
        table_number: table.number,
        display_name: table.label?.en ?? null,
        is_active: table.isActive,
      });

      return toUiTable(saved);
    }

    const store = readStore();
    const tables = store.tables.some((entry) => entry.id === table.id)
      ? store.tables.map((entry) => (entry.id === table.id ? table : entry))
      : [...store.tables, { ...table, id: createId() }];
    writeStore({ ...store, tables });
    return table;
  },

  subscribe(listener: Listener) {
    if (hasSupabaseConfig) {
      return subscribeToKitchenOrders(() => listener());
    }

    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
