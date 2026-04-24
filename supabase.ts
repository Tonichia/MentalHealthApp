import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { storage } from './storage';

const supabaseStorage = {
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value ?? null);
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

// Replace these with your actual Supabase URL and Anon Key
const supabaseUrl = 'https://fnlpcstifyjrjgluxvlf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZubHBjc3RpZnlqcmpnbHV4dmxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MDE4NzIsImV4cCI6MjA5MjQ3Nzg3Mn0.dr518VP_np01rxGPB4yy4aUbSLeQu6Wrm8KSuRSgZ-o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});