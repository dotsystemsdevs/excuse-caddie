import { useState, useRef, useCallback, useMemo, useEffect, Component } from 'react';
import {
  View, Text, Pressable, StyleSheet, ScrollView, Animated, Image,
  Linking, Platform, AccessibilityInfo, Dimensions,
  ActivityIndicator, FlatList, Switch,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import * as StoreReview from 'expo-store-review';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { CONFIG, LOADING_MESSAGES, FONT, PALETTE } from './src/constants';
import { pickRandom, pickWeighted } from './src/utils';
import { EXCUSES, CATEGORIES } from './src/excuses';
import { Accelerometer } from 'expo-sensors';
import { supabase, voteForExcuse, fetchLeaderboard } from './src/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import * as Crypto from 'expo-crypto';
import TelemetryDeck from '@telemetrydeck/sdk';

Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false }) });

const RE_ENGAGE_MESSAGES = [
  { title: 'Bogey Blamer misses you!', body: "It's been a while. Come blame something for your last round." },
  { title: "Don't go blaming yourself now…", body: 'Open up and find the perfect excuse for your next bogey.' },
  { title: 'New excuses are waiting 🏌️', body: "You haven't blamed anything in a while. Time to fix that." },
];
const LB_MESSAGES = [
  { title: 'Leaderboard update 🏆', body: 'New top excuses are in — check what the community is voting for!' },
  { title: 'Top excuses this week', body: 'See which excuses are trending on the leaderboard.' },
];

async function scheduleAllNotifications() {
  try { await Notifications.cancelAllScheduledNotificationsAsync(); } catch (_) {}
  const excuse = getDailyExcuse(EXCUSES);
  const excuseText = typeof excuse === 'string' ? excuse : excuse?.text ?? '';
  // Daily excuse — 20:00 every evening (resets each app open, so only fires if you didn't open today)
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title: "Today's Excuse ⛳", body: excuseText },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: 20, minute: 0 },
    });
  } catch (_) {}
  // Re-engagement — 3 days from now
  const re3 = RE_ENGAGE_MESSAGES[Math.floor(Math.random() * RE_ENGAGE_MESSAGES.length)];
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title: re3.title, body: re3.body },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 3 * 24 * 60 * 60, repeats: false },
    });
  } catch (_) {}
  // Re-engagement — 7 days from now
  const re7 = RE_ENGAGE_MESSAGES[Math.floor(Math.random() * RE_ENGAGE_MESSAGES.length)];
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title: re7.title, body: re7.body },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 7 * 24 * 60 * 60, repeats: false },
    });
  } catch (_) {}
  // Leaderboard nudge — 2 days from now at a random-ish time
  const lb = LB_MESSAGES[Math.floor(Math.random() * LB_MESSAGES.length)];
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title: lb.title, body: lb.body },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 2 * 24 * 60 * 60, repeats: false },
    });
  } catch (_) {}
}

const LOGO = require('./assets/logo.png');
const { width } = Dimensions.get('window');

function getDailyExcuse(excuses) {
  const today = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = ((hash << 5) - hash) + today.charCodeAt(i);
    hash |= 0;
  }
  return excuses[Math.abs(hash) % excuses.length];
}

const TABS = [
  { key: 'home', icon: 'golf', label: 'Home' },
  { key: 'leaderboard', icon: 'trophy', label: 'Top' },
  { key: 'settings', icon: 'cog', label: 'Settings' },
];

function BottomTabs({ active, onChange }) {
  const { bottom } = useSafeAreaInsets();
  const pad = Math.max(bottom, Platform.OS === 'android' ? 20 : 8);
  return (
    <View style={[$.tabBar, { paddingBottom: pad }]}>
      {TABS.map((t) => {
        const on = active === t.key;
        const name = on ? t.icon : `${t.icon}-outline`;
        const color = on ? PALETTE.greenPale : 'rgba(255,255,255,0.35)';
        return (
          <Pressable key={t.key} style={$.tabItem} onPress={() => onChange(t.key)}
            accessibilityRole="tab" accessibilityState={{ selected: on }}>
            <Ionicons name={name} size={21} color={color} />
            <Text style={[$.tabText, { color }]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const tdCrypto = {
  async digest(_algo, buffer) {
    const text = new TextDecoder().decode(buffer);
    const hex = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text);
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    return bytes.buffer;
  }
};
const td = new TelemetryDeck({ appID: 'B4D67B25-CBCA-4066-B9ED-353AA2560A99', clientUser: 'anonymous', subtleCrypto: tdCrypto });

const _tdReady = (async () => {
  try {
    let id = await AsyncStorage.getItem('td_anon_id');
    if (!id) { id = Crypto.randomUUID(); await AsyncStorage.setItem('td_anon_id', id); }
    td.clientUser = id;
  } catch (_) {}
})();

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, backgroundColor: PALETTE.homeBg, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 8 }}>Something went wrong</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 24 }}>Please restart the app and try again.</Text>
          <Pressable onPress={() => this.setState({ hasError: false })} style={{ backgroundColor: PALETTE.activeGreen, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>Try Again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return <ErrorBoundary><AppContent /></ErrorBoundary>;
}

function AppContent() {

  const [activeTab, setActiveTab] = useState('home');
  const [excuse, setExcuse] = useState(null);
  const [currentExcuseId, setCurrentExcuseId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(() => LOADING_MESSAGES?.[0] ?? 'Loading…');
  const [generateCount, setGenerateCount] = useState(0);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [hasAskedReview, setHasAskedReview] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDownloading, setUpdateDownloading] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [dailyNotif, setDailyNotif] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [hasVotedCurrent, setHasVotedCurrent] = useState(false);
  const [voteAnimation] = useState(new Animated.Value(1));
  const excuseIdMap = useRef(new Map());
  const segWidthRef = useRef(0);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [leaderboardRange, setLeaderboardRange] = useState('weekly');
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const segSlide = useRef(new Animated.Value(0)).current;
  const loadingOpacity = useRef(new Animated.Value(1)).current;
  const splashOpacity = useRef(new Animated.Value(0.5)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const genTimeout = useRef(null);
  const copyTimeout = useRef(null);
  const seenExcuses = useRef(new Set());
  const dailyExcuse = useMemo(() => getDailyExcuse(EXCUSES), []);

  useEffect(() => { _tdReady.then(() => td.signal('app_opened')); const t = setTimeout(() => setIsAppReady(true), CONFIG.SPLASH_MIN_MS ?? 1000); return () => clearTimeout(t); }, []);
  useEffect(() => { if (isAppReady) return; const p = Animated.loop(Animated.sequence([Animated.timing(splashOpacity, { toValue: 1, duration: 500, useNativeDriver: true }), Animated.timing(splashOpacity, { toValue: 0.4, duration: 500, useNativeDriver: true })])); p.start(); return () => p.stop(); }, [isAppReady, splashOpacity]);
  useEffect(() => { (async () => { try { const v = await AsyncStorage.getItem(CONFIG.STORAGE_KEY_ASKED_REVIEW); if (v === 'true') setHasAskedReview(true); } catch (_) {} })(); }, []);
  useEffect(() => { (async () => { try { const v = await AsyncStorage.getItem('app_haptics_enabled'); if (v !== null) setHapticsEnabled(v === 'true'); } catch (_) {} })(); }, []);
  useEffect(() => { (async () => { try { const v = await AsyncStorage.getItem('app_daily_notif'); if (v !== null) setDailyNotif(v === 'true'); } catch (_) {} })(); }, []);
  useEffect(() => { if (typeof __DEV__ !== 'undefined' && __DEV__) return; (async () => { try { const r = await Updates.checkForUpdateAsync(); if (r?.isAvailable) setUpdateAvailable(true); } catch (_) {} })(); }, []);
  useEffect(() => { (async () => { try { const { data } = await supabase.from('excuses').select('id, text').eq('is_active', true); if (data) { const m = new Map(); for (const r of data) m.set(r.text, r.id); excuseIdMap.current = m; } } catch (_) {} })(); }, []);
  useEffect(() => () => { if (genTimeout.current) clearTimeout(genTimeout.current); if (copyTimeout.current) clearTimeout(copyTimeout.current); }, []);
  useEffect(() => { AccessibilityInfo.isReduceMotionEnabled?.().then(setReduceMotion).catch(() => {}); }, []);

  const hapticsRef = useRef(hapticsEnabled);
  useEffect(() => { hapticsRef.current = hapticsEnabled; }, [hapticsEnabled]);
  const haptic = useCallback((fn) => { if (hapticsRef.current) { try { fn(); } catch (_) {} } }, []);
  const toggleHaptics = useCallback(async (val) => { setHapticsEnabled(val); td.signal('setting_changed', { setting: 'haptics', enabled: String(val) }); try { await AsyncStorage.setItem('app_haptics_enabled', String(val)); } catch (_) {} if (val) try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch (_) {} }, []);
  const toggleDailyNotif = useCallback(async (val) => {
    setDailyNotif(val);
    td.signal('setting_changed', { setting: 'notifications', enabled: String(val) });
    try { await AsyncStorage.setItem('app_daily_notif', String(val)); } catch (_) {}
    if (val) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') { setDailyNotif(false); try { await AsyncStorage.setItem('app_daily_notif', 'false'); } catch (_) {} return; }
      await scheduleAllNotifications();
    } else {
      try { await Notifications.cancelAllScheduledNotificationsAsync(); } catch (_) {}
    }
  }, []);
  // On every app open: reschedule all notifications (cancels old ones first, so daily excuse only fires if you don't open the app)
  useEffect(() => { (async () => { try { const v = await AsyncStorage.getItem('app_daily_notif'); if (v === 'true') { const { status } = await Notifications.getPermissionsAsync(); if (status === 'granted') await scheduleAllNotifications(); } } catch (_) {} })(); }, []);

  const filtered = useMemo(() => activeCategory === 'all' ? EXCUSES : EXCUSES.filter((e) => e.tags?.includes(activeCategory)), [activeCategory]);
  useEffect(() => { seenExcuses.current.clear(); }, [activeCategory]);

  const handleGenerate = useCallback(() => {
    if (isGenerating) return;
    if (genTimeout.current) clearTimeout(genTimeout.current);
    haptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
    setLoadingMsg(pickRandom(LOADING_MESSAGES) || 'Loading…');
    setIsGenerating(true); setHasVotedCurrent(false); loadingOpacity.setValue(1);
    if (!reduceMotion) { Animated.sequence([Animated.timing(cardScale, { toValue: 0.97, duration: 60, useNativeDriver: true }), Animated.timing(cardScale, { toValue: 1, duration: 180, useNativeDriver: true })]).start(); }
    const picked = pickWeighted(filtered, seenExcuses.current);
    const txt = typeof picked === 'string' ? picked : picked?.text ?? '';
    genTimeout.current = setTimeout(() => { genTimeout.current = null; loadingOpacity.setValue(1); setExcuse(txt || null); setCurrentExcuseId(excuseIdMap.current.get(txt) || null); setIsGenerating(false); setGenerateCount((c) => c + 1); haptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)); td.signal('excuse_generated', { category: activeCategory }); }, CONFIG.GENERATE_DELAY_MS ?? 1100);
  }, [isGenerating, filtered, reduceMotion, haptic, activeCategory]);

  const genRef = useRef(handleGenerate);
  useEffect(() => { genRef.current = handleGenerate; }, [handleGenerate]);
  useEffect(() => { if (!isAppReady) return; let last = 0; let sub; try { Accelerometer.setUpdateInterval(CONFIG.SHAKE_INTERVAL_MS ?? 150); sub = Accelerometer.addListener(({ x, y, z }) => { if (Math.sqrt(x*x+y*y+z*z) > (CONFIG.SHAKE_THRESHOLD ?? 2.5) && Date.now()-last > (CONFIG.SHAKE_COOLDOWN_MS ?? 1500)) { last = Date.now(); genRef.current(); } }); } catch (_) {} return () => { if (sub) sub.remove(); }; }, [isAppReady]);
  useEffect(() => { if (generateCount > 0 && generateCount % (CONFIG.REVIEW_PROMPT_EVERY_N ?? 5) === 0 && !hasAskedReview) setShowReviewPrompt(true); }, [generateCount, hasAskedReview]);
  useEffect(() => { if (!isGenerating || reduceMotion) return; const p = Animated.loop(Animated.sequence([Animated.timing(loadingOpacity, { toValue: 0.4, duration: 400, useNativeDriver: true }), Animated.timing(loadingOpacity, { toValue: 1, duration: 400, useNativeDriver: true })])); p.start(); return () => p.stop(); }, [isGenerating, reduceMotion]);

  const display = !isGenerating && excuse ? excuse : null;

  const handleCopy = useCallback(async () => { if (!display) return; if (copyTimeout.current) clearTimeout(copyTimeout.current); try { await Clipboard.setStringAsync(display); setCopied(true); haptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)); td.signal('excuse_copied'); copyTimeout.current = setTimeout(() => { copyTimeout.current = null; setCopied(false); }, CONFIG.COPY_RESET_MS ?? 1800); } catch (_) {} }, [display, haptic]);
  const handleVote = useCallback(async () => { haptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)); setHasVotedCurrent((prev) => !prev); td.signal('excuse_voted'); Animated.sequence([Animated.timing(voteAnimation, { toValue: 1.3, duration: 120, useNativeDriver: true }), Animated.timing(voteAnimation, { toValue: 1, duration: 120, useNativeDriver: true })]).start(); if (currentExcuseId) { try { await voteForExcuse(currentExcuseId); } catch (_) {} } }, [currentExcuseId, voteAnimation, haptic]);
  const loadLB = useCallback(async (range) => { setLeaderboardLoading(true); try { setLeaderboardData((await fetchLeaderboard(range)) || []); } catch (_) { setLeaderboardData([]); } setLeaderboardLoading(false); }, []);
  const SEG_KEYS = ['weekly', 'monthly', 'all'];
  const handleSegChange = useCallback((key) => { setLeaderboardRange(key); const idx = SEG_KEYS.indexOf(key); Animated.spring(segSlide, { toValue: idx, useNativeDriver: true, friction: 20, tension: 170 }).start(); }, [segSlide]);
  useEffect(() => { if (activeTab === 'leaderboard') { loadLB(leaderboardRange); td.signal('leaderboard_viewed', { range: leaderboardRange }); } }, [activeTab, leaderboardRange]);
  const storeUrl = useCallback(() => { const i = CONFIG.APP_STORE_URL, a = CONFIG.PLAY_STORE_URL; return Platform.OS === 'ios' ? (i||a||'') : (a||i||''); }, []);
  const doReview = useCallback(async () => { setShowReviewPrompt(false); setHasAskedReview(true); td.signal('review_accepted'); try { await AsyncStorage.setItem(CONFIG.STORAGE_KEY_ASKED_REVIEW, 'true'); } catch (_) {} try { if (await StoreReview.hasAction()) await StoreReview.requestReview(); else { const u = storeUrl(); if (u) Linking.openURL(u); } } catch (_) {} }, [storeUrl]);
  const skipReview = useCallback(() => { setShowReviewPrompt(false); td.signal('review_skipped'); }, []);
  const doUpdate = useCallback(async () => { setUpdateDownloading(true); try { await Updates.fetchUpdateAsync(); await Updates.reloadAsync(); } catch (_) {} finally { setUpdateDownloading(false); } }, []);
  const open = (url) => Linking.openURL(url).catch(() => {});

  if (!isAppReady) {
    return (
      <SafeAreaProvider><StatusBar style="light" />
        <View style={$.splash}>
          <View style={$.splashLogoW}><Image source={LOGO} style={$.fill} resizeMode="cover" /></View>
          <Text style={$.splashName}>Bogey Blamer</Text>
          <Text style={$.splashTag}>Blame anything but yourself.</Text>
          <View style={$.splashBarW}><Animated.View style={[$.splashBarFill, { opacity: splashOpacity }]} /></View>
        </View>
      </SafeAreaProvider>
    );
  }

  const isHome = activeTab === 'home';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={$.root} edges={['top','left','right']}>
        <StatusBar style="light" />

        {updateAvailable && <Pressable onPress={doUpdate} disabled={updateDownloading} style={$.banner}><Text style={$.bannerText}>{updateDownloading ? 'Installing…' : 'Update available — tap to install'}</Text></Pressable>}

        {isHome && (
          <View style={$.home}>
            <View style={$.homeTop}>
              <View style={$.logoW}><Image source={LOGO} style={$.fill} resizeMode="cover" /></View>
              <Text style={$.homeName}>Bogey Blamer</Text>
              <Text style={$.homeTag}>Blame anything but yourself.</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={$.catsScroll} contentContainerStyle={$.catsRow}>
              {CATEGORIES.map((c) => { const on = activeCategory === c.key; return (
                <Pressable key={c.key} onPress={() => { setActiveCategory(c.key); haptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)); td.signal('category_changed', { category: c.key }); }} style={[$.cat, $.catOutline, on && $.catOn]}>
                  <Text style={[$.catText, on && $.catTextOn]}>{c.label}</Text>
                </Pressable>
              ); })}
            </ScrollView>
            <View style={$.cardWrap}>
              <Animated.View style={{ transform: [{ scale: cardScale }], flex: 1 }}>
                <Pressable onPress={handleGenerate} disabled={isGenerating} style={({ pressed }) => [pressed && !isGenerating && $.cardPress]} accessible accessibilityRole="button">
                  <LinearGradient colors={[PALETTE.cardTop, PALETTE.cardMid, PALETTE.cardBot]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={$.card}>
                    {isGenerating ? (
                      <Animated.View style={[$.cardCenter, { opacity: loadingOpacity }]}>
                        <ActivityIndicator size="small" color="rgba(255,255,255,0.5)" />
                        <Text style={$.cardLoading}>{loadingMsg}</Text>
                      </Animated.View>
                    ) : (
                      <View style={$.cardCenter}>
                        <Text style={$.cardExcuse}>{display || dailyExcuse.text}</Text>
                        {!display && <Text style={$.cardSub}>Today's excuse</Text>}
                      </View>
                    )}
                    {display && (
                      <Pressable onPress={handleVote} style={[$.cardLike, hasVotedCurrent && $.cardLikeOn]} hitSlop={8} accessibilityLabel={hasVotedCurrent ? 'Röstad' : 'Rösta'} accessibilityState={{ selected: hasVotedCurrent }}>
                        <Animated.View style={[$.cardLikeInner, { transform: [{ scale: voteAnimation }] }]}>
                          <Text style={$.cardLikeEmoji}>🐯</Text>
                          {hasVotedCurrent && <Text style={$.cardLikeCheck}>✓</Text>}
                        </Animated.View>
                      </Pressable>
                    )}
                    {display && (
                      <Pressable onPress={handleCopy} style={$.cardCopyBR} hitSlop={8}>
                        <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={16} color={copied ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)'} />
                      </Pressable>
                    )}
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            </View>
            {!display && <Text style={$.homeHint}>Shake your phone or tap the card</Text>}
            {showReviewPrompt && (
              <View style={$.reviewBox}>
                <Text style={$.reviewQ}>Enjoying the app?</Text>
                <View style={$.reviewBtns}>
                  <Pressable onPress={doReview} style={$.reviewY}><Text style={$.reviewYT}>Rate</Text></Pressable>
                  <Pressable onPress={skipReview} style={$.reviewN}><Text style={$.reviewNT}>Later</Text></Pressable>
                </View>
              </View>
            )}
          </View>
        )}

        {activeTab === 'leaderboard' && (
          <View style={$.page}>
            <View style={$.lbHeader}>
              <View style={$.lbTitleRow}>
                <View style={$.lbIcon}>
                  <Ionicons name="trophy" size={20} color="#fff" />
                </View>
                <Text style={$.lbTitle}>Leaderboard</Text>
              </View>
              <Text style={$.lbSub}>Voted by the community</Text>
            </View>
            <View style={$.segRow} onLayout={(e) => { if (!segWidthRef.current) segWidthRef.current = (e.nativeEvent.layout.width - 6) / 3; }}>
              <Animated.View style={[$.segSlider, { transform: [{ translateX: segSlide.interpolate({ inputRange: [0, 1, 2], outputRange: [3, (width - 40 - 6) / 3 + 3, 2 * (width - 40 - 6) / 3 + 3] }) }], width: (width - 40 - 6) / 3 }]} />
              {[{k:'weekly',l:'Week'},{k:'monthly',l:'Month'},{k:'all',l:'All Time'}].map((t) => { const on = leaderboardRange === t.k; return (
                <Pressable key={t.k} style={[$.seg, on && $.segOn]} onPress={() => handleSegChange(t.k)}><Text style={[$.segLabel, on && $.segLabelOn]}>{t.l}</Text></Pressable>
              ); })}
            </View>
            {leaderboardLoading ? <View style={$.mid}><ActivityIndicator color="rgba(255,255,255,0.5)" /></View>
            : leaderboardData.length === 0 ? (
              <View style={$.mid}>
                <Ionicons name="golf-outline" size={32} color="rgba(255,255,255,0.2)" />
                <Text style={[$.midText, { marginTop: 10 }]}>No votes yet</Text>
                <Text style={$.midHint}>Vote on the home screen to get started</Text>
              </View>
            ) : <FlatList data={leaderboardData} keyExtractor={(i) => i.id} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}
                renderItem={({ item, index }) => {
                  const MEDAL_COLORS = [
                    ['#D4A017', '#B8860B', '#8B6914'],
                    ['#B0B0B8', '#8A8D92', '#62656A'],
                    ['#CD7F32', '#A0653C', '#7A4A2A'],
                  ];
                  const colors = index < 3 ? MEDAL_COLORS[index] : null;
                  const Wrap = colors ? LinearGradient : View;
                  const wrapProps = colors ? { colors, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } } : {};
                  return (
                    <Wrap {...wrapProps} style={[$.lbRow, index < 3 && $.lbMedal]}>
                      <View style={$.lbNumWrap}>
                        <Text style={[$.lbNumText, index < 3 && { color: '#fff' }]}>#{index+1}</Text>
                      </View>
                      <Text style={$.lbExcuse} numberOfLines={2}>{item.text}</Text>
                      <View style={$.lbVotesWrap}>
                        <Text style={{ fontSize: 11 }}>🐯</Text>
                        <Text style={[$.lbVotes, index < 3 && { color: 'rgba(255,255,255,0.8)' }]}>{item.votes}</Text>
                      </View>
                    </Wrap>
                  );
                }} />}
          </View>
        )}

        {activeTab === 'settings' && (
          <ScrollView style={$.sPage} showsVerticalScrollIndicator={false} contentContainerStyle={$.sScroll}>
            <View style={$.sHero}>
              <View style={$.sLogoW}><Image source={LOGO} style={$.fill} resizeMode="cover" /></View>
              <Text style={$.sHeroName}>Bogey Blamer</Text>
              <Text style={$.sHeroVer}>Version {Constants.expoConfig?.version ?? '1.3.0'}</Text>
              <View style={$.sHeroDivider} />
            </View>

            <Text style={$.sSec} accessibilityRole="header">Preferences</Text>
            <View style={$.sGroup}>
              <View style={$.sRow} accessible accessibilityRole="switch" accessibilityLabel="Haptics" accessibilityState={{ checked: hapticsEnabled }}>
                <View style={[$.sIcon, { backgroundColor: '#19C66D' }]}><Ionicons name="hand-left" size={18} color="#fff" /></View>
                <View style={$.sRowContent}>
                  <Text style={$.sRowText}>Haptics</Text>
                  <Text style={$.sRowSub}>Vibration feedback on actions</Text>
                </View>
                <Switch value={hapticsEnabled} onValueChange={toggleHaptics} trackColor={{ false: 'rgba(255,255,255,0.28)', true: '#34C759' }} thumbColor="#fff" ios_backgroundColor="rgba(255,255,255,0.28)" />
              </View>
              <View style={$.sDivider} />
              <View style={$.sRow} accessible accessibilityRole="switch" accessibilityLabel="Notifications" accessibilityState={{ checked: dailyNotif }}>
                <View style={[$.sIcon, { backgroundColor: PALETTE.accent }]}><Ionicons name="notifications-outline" size={18} color="#fff" /></View>
                <View style={$.sRowContent}>
                  <Text style={$.sRowText}>Notifications</Text>
                  <Text style={$.sRowSub}>Daily excuse & re-engagement</Text>
                </View>
                <Switch value={dailyNotif} onValueChange={toggleDailyNotif} trackColor={{ false: 'rgba(255,255,255,0.28)', true: '#34C759' }} thumbColor="#fff" ios_backgroundColor="rgba(255,255,255,0.28)" />
              </View>
            </View>

            <Text style={$.sSec} accessibilityRole="header">Support</Text>
            <View style={$.sGroup}>
              <Pressable style={({ pressed }) => [$.sRow, pressed && $.sRowPress]} onPress={() => { const u = storeUrl(); if (u) open(u); }} hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }} accessibilityRole="button" accessibilityLabel="Rate the app">
                <View style={[$.sIcon, { backgroundColor: '#FFB800' }]}><Ionicons name="star-outline" size={18} color="#fff" /></View>
                <View style={$.sRowContent}>
                  <Text style={$.sRowText}>Rate the app</Text>
                  <Text style={$.sRowSub}>{Platform.OS === 'ios' ? 'Rate us on the App Store' : 'Rate us on the Play Store'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.25)" />
              </Pressable>
              <View style={$.sDivider} />
              <Pressable style={({ pressed }) => [$.sRow, pressed && $.sRowPress]} onPress={() => open('https://instagram.com/app_mulligan')} hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }} accessibilityRole="link" accessibilityLabel="Instagram">
                <View style={[$.sIcon, { backgroundColor: '#E14B91' }]}><Ionicons name="logo-instagram" size={18} color="#fff" /></View>
                <View style={$.sRowContent}>
                  <Text style={$.sRowText}>Instagram</Text>
                  <Text style={$.sRowSub}>Send in your golf excuse</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.25)" />
              </Pressable>
            </View>

            <Text style={$.sSec} accessibilityRole="header">Legal</Text>
            <View style={$.sGroup}>
              <Pressable style={({ pressed }) => [$.sRow, pressed && $.sRowPress]} onPress={() => open(`${CONFIG.LEGAL_BASE_URL}/privacy.html`)} hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }} accessibilityRole="link" accessibilityLabel="Privacy Policy">
                <View style={[$.sIcon, { backgroundColor: '#6B7D8E' }]}><Ionicons name="lock-closed-outline" size={18} color="#fff" /></View>
                <View style={$.sRowContent}>
                  <Text style={$.sRowText}>Privacy Policy</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.25)" />
              </Pressable>
              <View style={$.sDivider} />
              <Pressable style={({ pressed }) => [$.sRow, pressed && $.sRowPress]} onPress={() => open(`${CONFIG.LEGAL_BASE_URL}/terms.html`)} hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }} accessibilityRole="link" accessibilityLabel="Terms of Service">
                <View style={[$.sIcon, { backgroundColor: '#6B7D8E' }]}><Ionicons name="document-text-outline" size={18} color="#fff" /></View>
                <View style={$.sRowContent}>
                  <Text style={$.sRowText}>Terms of Service</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.25)" />
              </Pressable>
            </View>

            <View style={$.sFooterWrap}>
              <Text style={$.sFooter}>Version {Constants.expoConfig?.version ?? '1.3.0'}</Text>
            </View>
          </ScrollView>
        )}

        <BottomTabs active={activeTab} onChange={(tab) => { setActiveTab(tab); td.signal('tab_changed', { tab }); }} isHome={isHome} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const $ = StyleSheet.create({
  fill: { width: '100%', height: '100%' },
  splash: { flex: 1, backgroundColor: PALETTE.homeBg, justifyContent: 'center', alignItems: 'center' },
  splashLogoW: { width: 80, height: 80, borderRadius: 20, overflow: 'hidden', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', marginBottom: 20 },
  splashName: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  splashTag: { fontSize: 13, color: 'rgba(255,255,255,0.50)', marginTop: 6, letterSpacing: 0.2 },
  splashBarW: { width: 44, height: 2, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.10)', marginTop: 32, overflow: 'hidden' },
  splashBarFill: { ...StyleSheet.absoluteFillObject, backgroundColor: PALETTE.greenPale },
  root: { flex: 1, backgroundColor: PALETTE.homeBg },
  banner: { backgroundColor: PALETTE.activeGreen, paddingVertical: 8, alignItems: 'center' },
  bannerText: { fontSize: FONT.sm, color: '#fff', fontWeight: '600' },
  tabBar: { flexDirection: 'row', backgroundColor: PALETTE.greenDark, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.10)', paddingTop: 10 },
  tabItem: { flex: 1, alignItems: 'center', gap: 2 },
  tabText: { fontSize: 10, fontWeight: '600' },
  home: { flex: 1, paddingHorizontal: 20 },
  homeTop: { alignItems: 'center', paddingTop: 32, paddingBottom: 32 },
  logoW: { width: 80, height: 80, borderRadius: 22, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 8 },
  homeName: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.5, marginTop: 16, textAlign: 'center' },
  homeTag: { fontSize: 13, color: 'rgba(255,255,255,0.40)', marginTop: 5, letterSpacing: 0.2, fontWeight: '400' },
  catsScroll: { flexGrow: 0, marginBottom: 40, marginHorizontal: -20 },
  catsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 4 },
  cat: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24, borderWidth: 1.5 },
  catOutline: { borderColor: 'rgba(255,255,255,0.20)' },
  catOn: { backgroundColor: PALETTE.greenPale, borderColor: PALETTE.greenPale },
  catText: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.55)', letterSpacing: 0.5, textTransform: 'uppercase' },
  catTextOn: { color: PALETTE.greenDark, fontWeight: '700' },
  cardWrap: { flex: 1, justifyContent: 'center', paddingBottom: 32 },
  card: { borderRadius: 20, paddingHorizontal: 24, paddingVertical: 32, minHeight: 160, justifyContent: 'center', position: 'relative', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.20, shadowRadius: 20, elevation: 10, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.18)', overflow: 'hidden' },
  cardCopyBR: { position: 'absolute', bottom: 12, right: 12, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.10)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  cardLike: { position: 'absolute', bottom: 12, left: 12, minWidth: 44, height: 36, paddingHorizontal: 8, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.10)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, zIndex: 2 },
  cardLikeOn: { backgroundColor: 'rgba(255,255,255,0.28)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.45)' },
  cardLikeInner: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardLikeEmoji: { fontSize: 18 },
  cardLikeCheck: { fontSize: 14, color: '#fff', fontWeight: '700' },
  cardPress: { opacity: 0.93 },
  cardCenter: { alignItems: 'center', gap: 8 },
  cardExcuse: { fontSize: 20, lineHeight: 30, color: '#fff', textAlign: 'center', fontWeight: '700' },
  cardSub: { fontSize: 10, color: 'rgba(255,255,255,0.40)', letterSpacing: 2, textTransform: 'uppercase', fontWeight: '500' },
  cardLoading: { fontSize: FONT.body, color: 'rgba(255,255,255,0.50)', marginTop: 8 },
  homeHint: { fontSize: FONT.sm, color: 'rgba(255,255,255,0.35)', textAlign: 'center', paddingBottom: 8, marginTop: 12 },
  reviewBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  reviewQ: { fontSize: FONT.label, fontWeight: '600', color: '#fff' },
  reviewBtns: { flexDirection: 'row', gap: 10 },
  reviewY: { backgroundColor: PALETTE.activeGreen, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 14 },
  reviewYT: { fontSize: FONT.caption, fontWeight: '700', color: '#fff' },
  reviewN: { paddingVertical: 6, paddingHorizontal: 8 },
  reviewNT: { fontSize: FONT.caption, color: 'rgba(255,255,255,0.45)' },
  page: { flex: 1, paddingHorizontal: 20, paddingTop: 28 },
  lbHeader: { paddingTop: 16, paddingBottom: 20 },
  lbTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  lbIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.08)' },
  lbTitle: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.4 },
  lbSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 6, letterSpacing: 0.2 },
  segRow: { flexDirection: 'row', marginBottom: 24, borderRadius: 14, padding: 4, position: 'relative', backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  segSlider: { position: 'absolute', top: 4, bottom: 4, borderRadius: 10, backgroundColor: '#fff' },
  seg: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  segOn: {},
  segLabel: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5, textTransform: 'uppercase' },
  segLabelOn: { color: PALETTE.greenDark, fontWeight: '700' },
  mid: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  midText: { fontSize: FONT.body, color: 'rgba(255,255,255,0.45)' },
  midHint: { fontSize: FONT.sm, color: 'rgba(255,255,255,0.30)', marginTop: 4 },
  lbMedal: { borderWidth: 0, overflow: 'hidden' },
  lbRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, marginBottom: 8, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  lbNumWrap: { width: 28, alignItems: 'center', marginRight: 12 },
  lbNumText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.40)' },
  lbExcuse: { flex: 1, fontSize: 15, color: '#fff', lineHeight: 22, fontWeight: '500' },
  lbVotesWrap: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 12 },
  lbVotes: { fontSize: 13, fontWeight: '700', color: PALETTE.greenPale },
  sPage: { flex: 1 },
  sScroll: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 100, flexGrow: 1 },
  sHero: { alignItems: 'center', marginBottom: 28, paddingTop: 8 },
  sLogoW: { width: 60, height: 60, borderRadius: 16, overflow: 'hidden', marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 },
  sHeroName: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  sHeroVer: { fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4, fontWeight: '500' },
  sHeroDivider: { width: 40, height: 1, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginTop: 20 },
  sSec: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.45)', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 10, marginLeft: 4, marginTop: 4 },
  sGroup: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  sRow: { flexDirection: 'row', alignItems: 'center', minHeight: 56, paddingVertical: 14, paddingHorizontal: 16, gap: 14 },
  sRowPress: { backgroundColor: 'rgba(255,255,255,0.04)' },
  sIcon: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  sRowContent: { flex: 1, justifyContent: 'center', minHeight: 40 },
  sRowText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  sRowSub: { fontSize: 13, color: 'rgba(255,255,255,0.48)', marginTop: 2, lineHeight: 18, fontWeight: '400' },
  sDivider: { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.08)', marginLeft: 66 },
  sFooterWrap: { marginTop: 16, paddingVertical: 16, alignItems: 'center' },
  sFooter: { fontSize: 12, color: 'rgba(255,255,255,0.22)', fontWeight: '500' },
});