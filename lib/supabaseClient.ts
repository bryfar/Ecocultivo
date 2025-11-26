import { createClient } from '@supabase/supabase-js';

// Configuration based on your provided details
const supabaseUrl = 'https://jadtwmsgaufxnqbrsngk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphZHR3bXNnYXVmeG5xYnJzbmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNjc1ODUsImV4cCI6MjA3OTY0MzU4NX0.lm9nTVsnulrBVbrz1VZbpyAWVU7YmS8vJRlX55XHCqg';

export const supabase = createClient(supabaseUrl, supabaseKey);