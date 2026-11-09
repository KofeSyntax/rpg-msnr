import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const chave = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Sem as variáveis o site continua funcionando salvando no navegador (modo local).
export const temSupabase = Boolean(url && chave);
export const supabase = temSupabase ? createClient(url, chave) : null;
