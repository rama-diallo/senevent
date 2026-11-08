import {
  createClient,
  SupabaseClient,
  SupabaseClientOptions,
} from "@supabase/supabase-js";
import type { Database } from "./database.types";

let client: SupabaseClient<Database> | null = null;

// Initialise le client une seule fois, avec les cles fournies
// par l'application (web ou mobile) et les options eventuelles (ex: storage AsyncStorage).
export function initSupabase(
  url: string,
  anonKey: string,
  options?: SupabaseClientOptions<"public">
): SupabaseClient<Database> {
  if (!client) {
    client = createClient<Database>(url, anonKey, options);
  }
  return client;
}

// Recupere le client deja initialise.
export function getSupabase(): SupabaseClient<Database> {
  if (!client) {
    throw new Error(
      "Supabase non initialise. Appelez initSupabase(url, key) au demarrage."
    );
  }
  return client;
}
