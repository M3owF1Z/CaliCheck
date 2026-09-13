import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null

/**
 * Expected table (create it once in the Supabase SQL editor, see README):
 *
 * create table profiles (
 *   id text primary key,
 *   data jsonb not null,
 *   updated_at timestamptz default now()
 * );
 * alter table profiles enable row level security;
 * create policy "public read" on profiles for select using (true);
 * create policy "public write" on profiles for insert with check (true);
 * create policy "public update" on profiles for update using (true);
 * create policy "public delete" on profiles for delete using (true);
 *
 * NOTE: these policies are intentionally open (no auth) to keep this demo
 * project simple and free-tier friendly. Anyone with the anon key can write
 * to the table. Do NOT put sensitive data in it. For a production app add
 * proper Supabase Auth + row-level security scoped to the user.
 */
export const PROFILES_TABLE = 'profiles'
