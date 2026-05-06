export type Locale = "th" | "en";

export type LocalizedText = {
  th: string;
  en: string;
};

export type OrderStatus =
  | "new"
  | "accepted"
  | "preparing"
  | "ready"
  | "served"
  | "cancelled";

export type DiningTable = {
  id: string;
  slug: string;
  number: string;
  label?: LocalizedText;
  isActive: boolean;
};

export type MenuCategory = {
  id: string;
  name: LocalizedText;
  sortOrder: number;
  isActive: boolean;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  isAvailable: boolean;
  isRecommended?: boolean;
};

export type CartLine = {
  item: MenuItem;
  quantity: number;
  note?: string;
};

export type OrderItem = {
  id: string;
  menuItemId: string;
  name: LocalizedText;
  quantity: number;
  unitPrice: number;
  note?: string;
};

export type Order = {
  id: string;
  tableId: string;
  tableNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
  customerNote?: string;
};

export type MenuSnapshot = {
  categories: MenuCategory[];
  items: MenuItem[];
};

export type AdminDraftMenuItem = Omit<MenuItem, "id"> & { id?: string };
