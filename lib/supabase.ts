import { createClient } from '@supabase/supabase-js'

// Pega as variáveis que você acabou de criar no .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cria e exporta o cliente para ser usado em qualquer lugar do projeto
export const supabase = createClient(supabaseUrl, supabaseKey)