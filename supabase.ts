import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace these with your actual Supabase URL and Anon Key
const supabaseUrl = 'https://fnlpcstifyjrjgluxvlf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZubHBjc3RpZnlqcmpnbHV4dmxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MDE4NzIsImV4cCI6MjA5MjQ3Nzg3Mn0.dr518VP_np01rxGPB4yy4aUbSLeQu6Wrm8KSuRSgZ-o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});