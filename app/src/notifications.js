// Twice-weekly notifications: Thursday evening (pre-weekend) + Sunday morning (peak golf day).
// Picks a random excuse from a curated "top" list each fire, with rotated titles.

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { EXCUSES } from './excuses';

const TOP_EXCUSE_POOL_SIZE = 30;

// Day numbers in expo-notifications WEEKLY trigger: 1 = Sunday, 5 = Thursday
const THURSDAY_HOUR = 18; // 6 pm
const THURSDAY_MINUTE = 0;
const SUNDAY_HOUR = 10; // 10 am
const SUNDAY_MINUTE = 0;

const THURSDAY_TITLES = [
  '🏌️ Heading out tomorrow?',
  '🏌️ Pre-game alibi',
  '🏌️ Save this for Saturday',
];

const SUNDAY_TITLES = [
  '🏌️ Today\'s alibi',
  '🏌️ For the front nine',
  '🏌️ Just in case',
];

// Curated top picks — the first 30 by category mix (good Sunday material).
function getTopExcuses() {
  // Hand-picked vibe-y ones from across categories
  const tops = [
    "Leg day.",
    "Two hours of sleep.",
    "Sun was in my eyes.",
    "New clubs.",
    "Wind shifted mid-swing.",
    "Caddie distracted me.",
    "Greens were too fast.",
    "Course was too long today.",
    "Bad back.",
    "Hands shaky from coffee.",
    "Tee time was too early.",
    "Birds were loud.",
    "Phone buzzed mid-swing.",
    "New gloves, no grip.",
    "Ball had a manufacturing defect.",
    "I'm rebuilding my swing.",
    "Lost focus thinking about lunch.",
    "Forgot how to golf.",
    "It's not my course.",
    "Ground was too soft.",
    "Tree wasn't there last week.",
    "The slope is the slope.",
    "Bunker had bad sand.",
    "Played too many holes yesterday.",
    "Foursome ahead is too slow.",
    "Group behind is too close.",
    "Hadn't had my coffee.",
    "Too much coffee.",
    "Yardage book is wrong.",
    "It's a practice round, technically.",
  ];
  // Cross-reference with actual EXCUSES array; fall back to any excuse if not found.
  const filtered = tops.filter((t) => EXCUSES.some((e) => e.text === t));
  return filtered.length > 0 ? filtered : EXCUSES.slice(0, TOP_EXCUSE_POOL_SIZE).map((e) => e.text);
}

function pickExcuse() {
  const pool = getTopExcuses();
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickTitle(titles) {
  return titles[Math.floor(Math.random() * titles.length)];
}

export async function requestPermission() {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function hasPermission() {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

// Schedule TWO recurring weekly notifications:
//   - Thursday 18:00 local (pre-weekend prep)
//   - Sunday 10:00 local (peak golf day)
export async function scheduleWeeklySunday() {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('weekly-alibi', {
      name: 'Weekly Alibi',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250],
      lightColor: '#508560',
    });
  }

  // Thursday 18:00 — "Heading out tomorrow?"
  await Notifications.scheduleNotificationAsync({
    identifier: 'weekly-thursday-alibi',
    content: {
      title: pickTitle(THURSDAY_TITLES),
      body: pickExcuse(),
      sound: false,
      ...(Platform.OS === 'android' ? { channelId: 'weekly-alibi' } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 5, // Thursday
      hour: THURSDAY_HOUR,
      minute: THURSDAY_MINUTE,
    },
  });

  // Sunday 10:00 — "Today's alibi"
  await Notifications.scheduleNotificationAsync({
    identifier: 'weekly-sunday-alibi',
    content: {
      title: pickTitle(SUNDAY_TITLES),
      body: pickExcuse(),
      sound: false,
      ...(Platform.OS === 'android' ? { channelId: 'weekly-alibi' } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 1, // Sunday
      hour: SUNDAY_HOUR,
      minute: SUNDAY_MINUTE,
    },
  });
}

export async function cancelAllScheduled() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
