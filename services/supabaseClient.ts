import { createClient } from '@supabase/supabase-js';

// --- Supabase Client Initialization ---
// The Supabase URL is specific to your project.
const supabaseUrl = 'https://cjufjlnrmbwmqyezfxls.supabase.co';

// The user has provided the anon key directly, so it's hardcoded here to establish the connection.
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqdWZqbG5ybWJ3bXF5ZXpmeGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDY5MzYsImV4cCI6MjA3MzcyMjkzNn0.ThMHvh1ly4RuHH2OrcZdln7SXy5sYCcE-RIIl_IeBtE';

// @ts-ignore - createClient is available via the importmap in index.html
// This single client instance is stateful and manages the user's session.
// It should be imported and used across the entire application.
export const supabase = createClient(supabaseUrl, supabaseKey);
