import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://svauvbwuwgohygknoqcg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2YXV2Ynd1d2dvaHlna25vcWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5ODExNjMsImV4cCI6MjA3NTU1NzE2M30.YWXmcXwHIV-QmUEySemMcYTgOR5NLHY48jkJOOdzFVg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
