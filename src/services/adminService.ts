import { requireSupabase } from '../lib/supabase';
import type { Database } from '../types/database';

type CategoryInsert = Database['public']['Tables']['menu_categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['menu_categories']['Update'];
type ItemInsert = Database['public']['Tables']['menu_items']['Insert'];
type ItemUpdate = Database['public']['Tables']['menu_items']['Update'];

export async function upsertMenuCategory(category: CategoryInsert) {
  const { data, error } = await requireSupabase()
    .from('menu_categories')
    .upsert(category, { onConflict: 'slug' })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function updateMenuCategory(id: string, patch: CategoryUpdate) {
  const { data, error } = await requireSupabase()
    .from('menu_categories')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function upsertMenuItem(item: ItemInsert) {
  const { data, error } = await requireSupabase()
    .from('menu_items')
    .upsert(item, { onConflict: 'slug' })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function updateMenuItem(id: string, patch: ItemUpdate) {
  const { data, error } = await requireSupabase()
    .from('menu_items')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function uploadMenuImage(file: File, path: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.storage
    .from('menu-images')
    .upload(path, file, {
      cacheControl: '31536000',
      upsert: true,
    });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage.from('menu-images').getPublicUrl(data.path);
  return publicUrl.publicUrl;
}
