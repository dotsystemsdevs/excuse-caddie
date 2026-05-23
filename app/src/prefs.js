// User preferences persisted to AsyncStorage.
// All keys live under @excuseCaddie/ namespace.

import AsyncStorage from '@react-native-async-storage/async-storage';

export const PREF_KEYS = {
  notificationsEnabled: '@excuseCaddie/prefs/notifications',
  soundEnabled: '@excuseCaddie/prefs/sound',
  onboardingSeen: '@excuseCaddie/prefs/onboardingSeen',
};

// Default values when nothing stored yet.
const DEFAULTS = {
  [PREF_KEYS.notificationsEnabled]: 'false', // off until user opts in
  [PREF_KEYS.soundEnabled]: 'true',          // on by default
  [PREF_KEYS.onboardingSeen]: 'false',
};

export async function getPref(key) {
  try {
    const v = await AsyncStorage.getItem(key);
    if (v === null) return DEFAULTS[key];
    return v;
  } catch {
    return DEFAULTS[key];
  }
}

export async function setPref(key, value) {
  try {
    await AsyncStorage.setItem(key, String(value));
  } catch {}
}

export async function getBoolPref(key) {
  const v = await getPref(key);
  return v === 'true';
}

export async function setBoolPref(key, value) {
  await setPref(key, value ? 'true' : 'false');
}
