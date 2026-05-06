import type { Database, OrderStatus as DatabaseOrderStatus } from './database';

export type OrderStatus = DatabaseOrderStatus;

export type DiningTable = Database['public']['Tables']['tables']['Row'];
export type MenuCategory = Database['public']['Tables']['menu_categories']['Row'];
export type MenuItem = Database['public']['Tables']['menu_items']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];

export type MenuCategoryWithItems = MenuCategory & {
  items: MenuItem[];
};

export type OrderWithItems = Order & {
  items: OrderItem[];
};

export type CartLineInput = {
  menuItemId: string;
  quantity: number;
  notes?: string;
};

export type CreateOrderInput = {
  tableSlug: string;
  customerName?: string;
  notes?: string;
  items: CartLineInput[];
};

export type UpdateOrderStatusInput = {
  orderId: string;
  status: OrderStatus;
};

export type RealtimeUnsubscribe = () => void;
