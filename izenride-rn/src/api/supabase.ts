import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Client Supabase. Configuré par `.env` (voir `.env.example`) :
 *   EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY
 * Sans ces variables, l'app tourne en mode démo (données locales, voir demoStore).
 */
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;

export const isDemo = supabase === null;

/** Table et colonnes des profils existants (à confirmer sur le projet). */
export const PROFILES_TABLE = process.env.EXPO_PUBLIC_SUPABASE_PROFILES_TABLE ?? 'profiles';
