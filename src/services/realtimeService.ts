import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { subscribeMockEvent } from '../lib/mockRealtime';
import { hasSupabaseConfig, requireSupabase } from '../lib/supabase';
import type { Database } from '../types/database';
import type { Order, RealtimeUnsubscribe } from '../types/eatease';

export type OrderChangePayload = RealtimePostgresChangesPayload<Database['public']['Tables']['orders']['Row']>;

export function subscribeToKitchenOrders(onChange: (payload: OrderChangePayload) => void): RealtimeUnsubscribe {
  if (!hasSupabaseConfig) {
    return subscribeMockEvent('orders', onChange as (payload: unknown) => void);
  }

  const channel = requireSupabase()
    .channel('kitchen-orders')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, onChange)
    .subscribe();

  return () => {
    void requireSupabase().removeChannel(channel);
  };
}

export function subscribeToTableOrders(tableId: string, onChange: (payload: OrderChangePayload) => void): RealtimeUnsubscribe {
  if (!hasSupabaseConfig) {
    return subscribeMockEvent(`orders:table:${tableId}`, onChange as (payload: unknown) => void);
  }

  const channel = requireSupabase()
    .channel(`table-orders-${tableId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `table_id=eq.${tableId}` }, onChange)
    .subscribe();

  return () => {
    void requireSupabase().removeChannel(channel);
  };
}

export function isOrderPayload(payload: OrderChangePayload): payload is OrderChangePayload & { new: Order } {
  return Boolean(payload.new && 'id' in payload.new);
}
