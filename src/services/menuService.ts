import { hasSupabaseConfig, requireSupabase } from '../lib/supabase';
import { mockCategories, mockMenuItems } from '../lib/mockData';
import type { MenuCategory, MenuCategoryWithItems, MenuItem } from '../types/eatease';

function bySortOrder<T extends { sort_order: number }>(left: T, right: T) {
  return left.sort_order - right.sort_order;
}

export async function getMenuCategories(): Promise<MenuCategory[]> {
  if (!hasSupabaseConfig) {
    return mockCategories.filter((category) => category.is_active).sort(bySortOrder);
  }

  const { data, error } = await requireSupabase()
    .from('menu_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getMenuItems(): Promise<MenuItem[]> {
  if (!hasSupabaseConfig) {
    return mockMenuItems.filter((item) => item.is_available).sort(bySortOrder);
  }

  const { data, error } = await requireSupabase()
    .from('menu_items')
    .select('*')
    .eq('is_available', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getMenu(): Promise<MenuCategoryWithItems[]> {
  const [categories, items] = await Promise.all([getMenuCategories(), getMenuItems()]);

  return categories.map((category) => ({
    ...category,
    items: items.filter((item) => item.category_id === category.id).sort(bySortOrder),
  }));
}

export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  if (!hasSupabaseConfig) {
    return mockMenuItems.find((item) => item.id === id && item.is_available) ?? null;
  }

  const { data, error } = await requireSupabase()
    .from('menu_items')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}
