import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://visaozobhupplycvrvst.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpc2Fvem9iaHVwcGx5Y3ZydnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDY2MjgsImV4cCI6MjA4ODcyMjYyOH0.dhQ_4f7W2IH94o9eYXMveYQcKAKeFvdVtNlWgWeyQeY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

// ── Device ID (anonymous identity for voting) ───────────────────────────
const DEVICE_ID_KEY = '@bogey_blamer_device_id';

let cachedDeviceId = null;

export async function getDeviceId() {
  if (cachedDeviceId) return cachedDeviceId;
  try {
    let id = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = Crypto.randomUUID();
      await AsyncStorage.setItem(DEVICE_ID_KEY, id);
    }
    cachedDeviceId = id;
    return id;
  } catch {
    return Crypto.randomUUID();
  }
}

// ── API helpers ─────────────────────────────────────────────────────────

/** Fetch all active excuses */
export async function fetchExcuses() {
  const { data, error } = await supabase
    .from('excuses')
    .select('id, text, category')
    .eq('is_active', true);
  if (error) throw error;
  return data;
}

/** Fetch a random excuse, optionally filtered by category */
export async function fetchRandomExcuse(category) {
  let query = supabase
    .from('excuses')
    .select('id, text, category')
    .eq('is_active', true);
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  const { data, error } = await query;
  if (error) throw error;
  if (!data || data.length === 0) return null;
  return data[Math.floor(Math.random() * data.length)];
}

/** Vote for an excuse (1 per device) */
export async function voteForExcuse(excuseId) {
  const deviceId = await getDeviceId();
  const { error } = await supabase
    .from('excuse_votes')
    .insert({ excuse_id: excuseId, device_id: deviceId });
  if (error) {
    if (error.code === '23505') return { alreadyVoted: true };
    throw error;
  }
  return { alreadyVoted: false };
}

/** Check if device already voted for an excuse */
export async function hasVoted(excuseId) {
  const deviceId = await getDeviceId();
  const { data, error } = await supabase
    .from('excuse_votes')
    .select('id')
    .eq('excuse_id', excuseId)
    .eq('device_id', deviceId)
    .limit(1);
  if (error) throw error;
  return data && data.length > 0;
}

/** Fetch leaderboard */
export async function fetchLeaderboard(range = 'all') {
  const viewName =
    range === 'weekly' ? 'leaderboard_weekly' :
    range === 'monthly' ? 'leaderboard_monthly' :
    'leaderboard_all_time';
  const { data, error } = await supabase
    .from(viewName)
    .select('*')
    .limit(20);
  if (error) throw error;
  return data;
}

/** Submit a new excuse for review */
export async function submitExcuse(text) {
  const deviceId = await getDeviceId();

  // Check daily submission limit (max 3 per day)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { data: recent } = await supabase
    .from('excuse_submissions')
    .select('id')
    .eq('device_id', deviceId)
    .gte('created_at', today.toISOString());
  if (recent && recent.length >= 3) {
    return { limited: true };
  }

  const { error } = await supabase
    .from('excuse_submissions')
    .insert({ text, device_id: deviceId });
  if (error) throw error;
  return { limited: false };
}

/** Fetch this device's submissions with their review status */
export async function fetchMySubmissions() {
  const deviceId = await getDeviceId();
  const { data, error } = await supabase
    .from('excuse_submissions')
    .select('id, text, status, created_at, reviewed_at')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: false })
    .setHeader('x-device-id', deviceId);
  if (error) throw error;
  return data || [];
}
