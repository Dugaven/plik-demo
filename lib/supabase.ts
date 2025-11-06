import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ljoaqydtlwcnwomepiif.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqb2FxeWR0bHdjbndvbWVwaWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDA2MDYsImV4cCI6MjA2NzQ3NjYwNn0.bJk4O-42MKUiedPmJQ08QzN3MXZf-m6Xbx-JsYiSXHE"

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
