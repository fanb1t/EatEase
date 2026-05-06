import { emitMockEvent } from '../lib/mockRealtime';
import { mockMenuItems, mockOrders } from '../lib/mockData';
import { hasSupabaseConfig, requireSupabase } from '../lib/supabase';
import type { CreateOrderInput, OrderStatus, OrderWithItems, UpdateOrderStatusInput } from '../types/eatease';
import { getTableBySlug } from './tableService';

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function createOrder(input: CreateOrderInput): Promise<OrderWithItems> {
  if (input.items.length === 0) {
    throw new Error('Cannot create an order without items.');
  }

  const table = await getTableBySlug(input.tableSlug);
  if (!table) {
    throw new Error(`Table "${input.tableSlug}" was not found or is inactive.`);
  }

  if (!hasSupabaseConfig) {
    const now = new Date().toISOString();
    const orderId = createId('order');
    const items = input.items.map((line) => {
      const menuItem = mockMenuItems.find((item) => item.id === line.menuItemId && item.is_available);
      if (!menuItem) {
        throw new Error(`Menu item "${line.menuItemId}" was not found or is unavailable.`);
      }

      return {
        id: createId('order-item'),
        order_id: orderId,
        menu_item_id: menuItem.id,
        item_name_th: menuItem.name_th,
        item_name_en: menuItem.name_en,
        quantity: line.quantity,
        unit_price: menuItem.price,
        line_total: menuItem.price * line.quantity,
        notes: line.notes ?? null,
        created_at: now,
      };
    });

    const total = items.reduce((sum, item) => sum + item.line_total, 0);
    const order: OrderWithItems = {
      id: orderId,
      table_id: table.id,
      table_number: table.table_number,
      customer_name: input.customerName ?? null,
      status: 'new',
      notes: input.notes ?? null,
      subtotal: total,
      total,
      created_at: now,
      updated_at: now,
      items,
    };

    mockOrders.unshift(order);
    emitMockEvent('orders', { eventType: 'INSERT', new: order, old: null });
    emitMockEvent(`orders:table:${table.id}`, { eventType: 'INSERT', new: order, old: null });
    return order;
  }

  const supabase = requireSupabase();
  const itemIds = input.items.map((item) => item.menuItemId);
  const { data: menuItems, error: menuError } = await supabase
    .from('menu_items')
    .select('*')
    .in('id', itemIds)
    .eq('is_available', true);

  if (menuError) throw menuError;
  if (!menuItems || menuItems.length !== itemIds.length) {
    throw new Error('One or more menu items are unavailable.');
  }

  const subtotal = input.items.reduce((sum, line) => {
    const menuItem = menuItems.find((item) => item.id === line.menuItemId);
    return sum + (menuItem?.price ?? 0) * line.quantity;
  }, 0);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      table_id: table.id,
      table_number: table.table_number,
      customer_name: input.customerName ?? null,
      notes: input.notes ?? null,
      subtotal,
      total: subtotal,
    })
    .select('*')
    .single();

  if (orderError) throw orderError;

  const orderItems = input.items.map((line) => {
    const menuItem = menuItems.find((item) => item.id === line.menuItemId);
    if (!menuItem) {
      throw new Error(`Menu item "${line.menuItemId}" was not found.`);
    }

    return {
      order_id: order.id,
      menu_item_id: menuItem.id,
      item_name_th: menuItem.name_th,
      item_name_en: menuItem.name_en,
      quantity: line.quantity,
      unit_price: menuItem.price,
      line_total: menuItem.price * line.quantity,
      notes: line.notes ?? null,
    };
  });

  const { data: createdItems, error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)
    .select('*');

  if (itemsError) throw itemsError;

  return {
    ...order,
    items: createdItems ?? [],
  };
}

export async function getKitchenOrders(statuses: OrderStatus[] = ['new', 'accepted', 'preparing', 'ready']): Promise<OrderWithItems[]> {
  if (!hasSupabaseConfig) {
    return mockOrders.filter((order) => statuses.includes(order.status));
  }

  const { data: orders, error: ordersError } = await requireSupabase()
    .from('orders')
    .select('*')
    .in('status', statuses)
    .order('created_at', { ascending: false });

  if (ordersError) throw ordersError;
  if (!orders?.length) return [];

  const orderIds = orders.map((order) => order.id);
  const { data: items, error: itemsError } = await requireSupabase()
    .from('order_items')
    .select('*')
    .in('order_id', orderIds);

  if (itemsError) throw itemsError;

  return orders.map((order) => ({
    ...order,
    items: (items ?? []).filter((item) => item.order_id === order.id),
  }));
}

export async function updateOrderStatus(input: UpdateOrderStatusInput): Promise<void> {
  if (!hasSupabaseConfig) {
    const order = mockOrders.find((candidate) => candidate.id === input.orderId);
    if (!order) throw new Error(`Order "${input.orderId}" was not found.`);

    const oldOrder = { ...order };
    order.status = input.status;
    order.updated_at = new Date().toISOString();
    emitMockEvent('orders', { eventType: 'UPDATE', new: order, old: oldOrder });
    emitMockEvent(`orders:table:${order.table_id}`, { eventType: 'UPDATE', new: order, old: oldOrder });
    return;
  }

  const { error } = await requireSupabase()
    .from('orders')
    .update({ status: input.status })
    .eq('id', input.orderId);

  if (error) throw error;
}
