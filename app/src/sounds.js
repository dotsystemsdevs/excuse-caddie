// Mirror of webb/lib/sounds.js — picks a random clip from the bundled
// pool and plays it on each Mulligan. Files are bundled at build time so
// playback works offline. Uses expo-audio (Expo SDK 54+).
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MUTED_KEY = 'bb_muted';
let _muted = false;
let _lastIndex = -1;
let _players = null;
let _modeReady = false;

// Hardcoded list — RN can't readdir at runtime, but require() bundles each
// file into the binary so they're available offline.
const SOURCES = [
  require('../assets/sounds/freesound_community-golf-3-94168.mp3'),
  require('../assets/sounds/freesound_community-golf-4-94169.mp3'),
  require('../assets/sounds/freesound_community-golf-6-94170.mp3'),
  require('../assets/sounds/freesound_community-golf-9-94171.mp3'),
  require('../assets/sounds/freesound_community-golf-12-94166.mp3'),
  require('../assets/sounds/freesound_community-golf-13-94165.mp3'),
  require('../assets/sounds/freesound_community-golf-14-94167.mp3'),
  require('../assets/sounds/freesound_community-splash-6213.mp3'),
  require('../assets/sounds/freesound_community-water-splash-46402.mp3'),
  require('../assets/sounds/freesound_community-water-splash-80537.mp3'),
];

function ensurePlayers() {
  if (_players) return _players;
  _players = SOURCES.map((src) => {
    const p = createAudioPlayer(src);
    p.volume = 0.7;
    return p;
  });
  return _players;
}

async function ensureMode() {
  if (_modeReady) return;
  try {
    // Allow playback even when the phone's ringer is on silent (iOS).
    await setAudioModeAsync({ playsInSilentMode: true });
  } catch {}
  _modeReady = true;
}

(async () => {
  try {
    const v = await AsyncStorage.getItem(MUTED_KEY);
    if (v !== null) _muted = v === '1';
  } catch {}
})();

export function setMuted(value) {
  _muted = !!value;
  AsyncStorage.setItem(MUTED_KEY, _muted ? '1' : '0').catch(() => {});
}

export function isMuted() {
  return _muted;
}

function pickIndex(n) {
  if (n <= 1) return 0;
  let idx;
  do { idx = Math.floor(Math.random() * n); } while (idx === _lastIndex);
  _lastIndex = idx;
  return idx;
}

export async function playSplash() {
  if (_muted) return;
  try {
    await ensureMode();
    const players = ensurePlayers();
    const player = players[pickIndex(players.length)];
    player.seekTo(0);
    player.play();
  } catch {}
}
