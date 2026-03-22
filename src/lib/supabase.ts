// --- CONFIGURACIÓN DE SUPABASE ---
// Este archivo inicializa la conexión con la base de datos de Supabase.
// Las credenciales (URL y Anon Key) se leen desde el archivo .env.local

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Función para validar que la URL tenga un formato correcto
const isValidUrl = (url: string | undefined) => url && (url.startsWith('http://') || url.startsWith('https://'));

// Inicialización del cliente de Supabase
// Si no hay credenciales válidas, devolverá null (evita que la app rompa)
export const supabase = isValidUrl(supabaseUrl) && supabaseAnonKey
  ? createClient(supabaseUrl!, supabaseAnonKey)
  : (null as any);
