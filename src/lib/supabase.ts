import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

type ViteEnv = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
};

const env = ((import.meta as unknown as { env?: ViteEnv }).env ?? {}) as ViteEnv;

export const supabaseUrl = env.VITE_SUPABASE_URL ?? '';
export const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY ?? '';
export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient<Database> | null = hasSupabaseConfig
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to use the remote backend.');
  }

  return supabase;
}
