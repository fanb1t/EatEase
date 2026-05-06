import { hasSupabaseConfig, requireSupabase } from '../lib/supabase';
import { mockTables } from '../lib/mockData';
import type { DiningTable } from '../types/eatease';

export async function getTableBySlug(tableSlug: string): Promise<DiningTable | null> {
  if (!hasSupabaseConfig) {
    return mockTables.find((table) => table.slug === tableSlug && table.is_active) ?? null;
  }

  const { data, error } = await requireSupabase()
    .from('tables')
    .select('*')
    .eq('slug', tableSlug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getTables(): Promise<DiningTable[]> {
  if (!hasSupabaseConfig) {
    return mockTables.filter((table) => table.is_active);
  }

  const { data, error } = await requireSupabase()
    .from('tables')
    .select('*')
    .eq('is_active', true)
    .order('table_number', { ascending: true });

  if (error) throw error;
  return data ?? [];
}
