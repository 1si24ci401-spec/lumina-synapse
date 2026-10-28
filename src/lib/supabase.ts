import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  'https://qjkzdvrpjmtvnqdigepf.supabase.co'

const SUPABASE_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
  'sb_publishable_9InKYExgIu7q7SjUleuHCw__dkYKi9p'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
