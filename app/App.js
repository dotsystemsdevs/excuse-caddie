import { useState, useRef, useCallback, useMemo, useEffect, Component } from 'react';
import {
  View, Text, Pressable, StyleSheet, Animated, Linking, Platform,
  AccessibilityInfo, Dimensions, Share, Image,
} from 'react-native';
import Svg, { Path, Defs, Filter, FeTurbulence, Rect, G } from 'react-native-svg';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import * as Updates from 'expo-updates';
import { Accelerometer } from 'expo-sensors';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';

import { CONFIG, PALETTE, CTA_FIRST, CTA_LABELS } from './src/constants';
import { EXCUSES, getDailyExcuse } from './src/excuses';
import { getExcuseText, pickDifferentWeighted } from './src/utils';
import { getExcuseId } from './src/excuse-ids';
import {
  fetchGeneratedTotal, trackGenerated, voteForExcuse, fetchLeaderboard,
} from './src/api';
import { playSplash } from './src/sounds';

const { width: SCREEN_W } = Dimensions.get('window');
const LOGO = require('./assets/logo.png');
const LEGAL_BASE_URL = 'https://dotsystemsdevs.github.io/app-legal-docs/app-golfexcuse';

// Type-style tokens — match webb/app/globals.css usage of Inter
const F = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
};

function pickRandomLabel(prev) {
  if (CTA_LABELS.length <= 1) return CTA_LABELS[0];
  let next;
  do { next = CTA_LABELS[Math.floor(Math.random() * CTA_LABELS.length)]; } while (next === prev);
  return next;
}

function getExcuseNumber(text) {
  const i = EXCUSES.findIndex((e) => e.text === text);
  return i >= 0 ? i + 1 : null;
}

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, backgroundColor: PALETTE.fairway, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: PALETTE.cream, marginBottom: 8 }}>Something went wrong</Text>
          <Pressable onPress={() => this.setState({ hasError: false })} style={{ backgroundColor: PALETTE.yellow, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: PALETTE.fairwayDeep }}>Try Again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    // Mirror the splash bg so there's no flash
    return <View style={{ flex: 1, backgroundColor: PALETTE.fairway }} />;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const dailyExcuse = useMemo(() => getDailyExcuse(EXCUSES), []);

  const [excuse, setExcuse] = useState(null);
  const [currentExcuseId, setCurrentExcuseId] = useState(() => getExcuseId(dailyExcuse.text));
  const [vote, setVote] = useState(null);
  const [copied, setCopied] = useState(false);
  const [genCount, setGenCount] = useState(0);
  const [globalTotal, setGlobalTotal] = useState(null);
  const [ctaLabel, setCtaLabel] = useState(CTA_FIRST);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDownloading, setUpdateDownloading] = useState(false);

  const seenExcuses = useRef(new Set());
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const cardTranslate = useRef(new Animated.Value(0)).current;
  const thumbUpScale = useRef(new Animated.Value(1)).current;
  const thumbDnScale = useRef(new Animated.Value(1)).current;
  const copyTimeout = useRef(null);
  const storyCardRef = useRef(null);

  const cardText = excuse || dailyExcuse.text;

  // ── Effects ────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchGeneratedTotal().then((t) => setGlobalTotal(t > 0 ? t : 0)).catch(() => setGlobalTotal(0));
  }, []);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.().then(setReduceMotion).catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof __DEV__ !== 'undefined' && __DEV__) return;
    (async () => {
      try {
        const r = await Updates.checkForUpdateAsync();
        if (r?.isAvailable) setUpdateAvailable(true);
      } catch {}
    })();
  }, []);

  useEffect(() => () => {
    if (copyTimeout.current) clearTimeout(copyTimeout.current);
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────
  const haptic = useCallback((style) => {
    try {
      if (style === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      else if (style === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      else if (style === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  }, []);

  const handleGenerate = useCallback(() => {
    haptic('medium');
    playSplash();
    if (!reduceMotion) {
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 0.0, duration: 90, useNativeDriver: true }),
        Animated.timing(cardTranslate, { toValue: -3, duration: 90, useNativeDriver: true }),
      ]).start(() => {
        const picked = pickDifferentWeighted(EXCUSES, cardText, seenExcuses.current);
        const txt = getExcuseText(picked);
        setExcuse(txt);
        setCurrentExcuseId(getExcuseId(txt));
        setVote(null);
        setGenCount((c) => c + 1);
        setCtaLabel((prev) => pickRandomLabel(prev));
        setGlobalTotal((cur) => (cur == null ? cur : cur + 1));
        cardTranslate.setValue(3);
        Animated.parallel([
          Animated.timing(cardOpacity, { toValue: 1, duration: 240, useNativeDriver: true }),
          Animated.timing(cardTranslate, { toValue: 0, duration: 240, useNativeDriver: true }),
        ]).start(() => haptic('success'));
      });
    } else {
      const picked = pickDifferentWeighted(EXCUSES, cardText, seenExcuses.current);
      const txt = getExcuseText(picked);
      setExcuse(txt);
      setCurrentExcuseId(getExcuseId(txt));
      setVote(null);
      setGenCount((c) => c + 1);
      setCtaLabel((prev) => pickRandomLabel(prev));
      setGlobalTotal((cur) => (cur == null ? cur : cur + 1));
    }
    trackGenerated().then((t) => { if (typeof t === 'number' && t > 0) setGlobalTotal(t); });
  }, [cardText, reduceMotion, haptic, cardOpacity, cardTranslate]);

  const genRef = useRef(handleGenerate);
  useEffect(() => { genRef.current = handleGenerate; }, [handleGenerate]);

  // Shake-to-generate
  useEffect(() => {
    let last = 0;
    let sub;
    try {
      Accelerometer.setUpdateInterval(CONFIG.SHAKE_INTERVAL_MS);
      sub = Accelerometer.addListener(({ x, y, z }) => {
        const m = Math.sqrt(x * x + y * y + z * z);
        if (m > CONFIG.SHAKE_THRESHOLD && Date.now() - last > CONFIG.SHAKE_COOLDOWN_MS) {
          last = Date.now();
          genRef.current();
        }
      });
    } catch {}
    return () => { if (sub) sub.remove(); };
  }, []);

  const handleVote = useCallback(async (direction) => {
    haptic('light');
    const scaleAnim = direction === 'up' ? thumbUpScale : thumbDnScale;
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.22, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 140, useNativeDriver: true }),
    ]).start();

    setVote((prev) => prev === direction ? null : direction);
    if (currentExcuseId) {
      try {
        const res = await voteForExcuse(currentExcuseId, direction);
        if (res && 'vote' in res) setVote(res.vote);
      } catch {}
    }
  }, [currentExcuseId, haptic, thumbUpScale, thumbDnScale]);

  const excuseNumber = getExcuseNumber(cardText);
  const shareUrl = excuseNumber ? `${CONFIG.WEB_URL}/${excuseNumber}` : CONFIG.WEB_URL;

  // Capture the off-screen StoryShareCard view as a 1080×1920 PNG on
  // device. Works offline — no network roundtrip, no webb dependency.
  const captureStoryImage = useCallback(async () => {
    if (!storyCardRef.current) return null;
    try {
      const uri = await captureRef(storyCardRef, {
        format: 'png',
        quality: 1.0,
        result: 'tmpfile',
        width: 1080,
        height: 1350,
      });
      return uri;
    } catch {
      return null;
    }
  }, []);

  // Single share entry point. Captures a 1080×1920 story-format PNG
  // from the hidden StoryShareCard view and routes through the system
  // share sheet — the user picks the destination from there. URL goes
  // on the clipboard so apps that can only ingest one item still let
  // the user paste the link.
  const handleShare = useCallback(async () => {
    if (copyTimeout.current) clearTimeout(copyTimeout.current);
    haptic('light');
    const text = `"${cardText}" — Excuse Caddie\n${shareUrl}`;
    try { await Clipboard.setStringAsync(text); } catch {}

    const fileUri = await captureStoryImage();
    setCopied(true);
    copyTimeout.current = setTimeout(() => setCopied(false), CONFIG.COPY_RESET_MS);

    try {
      if (Platform.OS === 'ios' && fileUri) {
        // iOS treats {url, message} as two distinct activity items —
        // image-capable apps get both, text-only apps get the message.
        await Share.share({ url: fileUri, message: text });
        return;
      }
      if (fileUri) {
        // Android — Share.share doesn't accept file URIs reliably, so
        // we use expo-sharing for the image. Text is on the clipboard.
        await Sharing.shareAsync(fileUri, {
          mimeType: 'image/png',
          UTI: 'public.png',
          dialogTitle: `"${cardText}" — Excuse Caddie`,
        });
        return;
      }
      // Capture failed — text-only fallback so the button never feels
      // broken.
      await Share.share({ message: text });
    } catch {}
  }, [cardText, shareUrl, haptic, captureStoryImage]);

  const doUpdate = useCallback(async () => {
    setUpdateDownloading(true);
    try { await Updates.fetchUpdateAsync(); await Updates.reloadAsync(); }
    catch {} finally { setUpdateDownloading(false); }
  }, []);

  return (
    <AppShell
      updateAvailable={updateAvailable}
      updateDownloading={updateDownloading}
      doUpdate={doUpdate}
    >
      <View style={$.main}>
        <Image source={LOGO} style={$.logo} resizeMode="contain" accessibilityIgnoresInvertColors />
        <Text style={$.wordmark}>Excuse Caddie</Text>

        <View style={$.panelWrap}>
          <View style={$.panel}>
            {/* Cream paper grain overlay (matches webb's feTurbulence noise) */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <PaperGrain />
            </View>
            <Animated.Text
              key={genCount}
              style={[$.cardText, {
                opacity: cardOpacity,
                transform: [{ translateY: cardTranslate }],
              }]}
            >
              {cardText}
            </Animated.Text>
          </View>

          <View style={$.thumbsRow} pointerEvents="box-none">
            <ThumbButton
              direction="down"
              active={vote === 'down'}
              scale={thumbDnScale}
              onPress={() => handleVote('down')}
            />
            <ThumbButton
              direction="up"
              active={vote === 'up'}
              scale={thumbUpScale}
              onPress={() => handleVote('up')}
            />
          </View>
        </View>

        <View style={$.counterRow}>
          <CountUp value={globalTotal ?? 0} style={$.counterNum} duration={650} />
          <Text style={$.counterLabel}>ALIBIS ON THE CARD</Text>
        </View>

        <CTAButton label={ctaLabel} onPress={handleGenerate} />

        <View style={$.shareRow}>
          <SharePill
            bg={PALETTE.red}
            label={copied ? 'Shared' : 'Share'}
            icon={copied ? <CheckIcon /> : <ShareIcon />}
            onPress={handleShare}
          />
        </View>

        <View style={$.footer}>
          <Pressable
            onPress={() => Linking.openURL(`${LEGAL_BASE_URL}/privacy.html`)}
            hitSlop={10}
            accessibilityRole="link"
            accessibilityLabel="Privacy Policy"
          >
            <Text style={$.footerText}>Privacy</Text>
          </Pressable>
          <Text style={$.footerDot}>·</Text>
          <Pressable
            onPress={() => Linking.openURL(`${LEGAL_BASE_URL}/terms.html`)}
            hitSlop={10}
            accessibilityRole="link"
            accessibilityLabel="Terms of Service"
          >
            <Text style={$.footerText}>Terms</Text>
          </Pressable>
        </View>

        {/* Off-screen card used by Share — captured at 1080×1920. */}
        <StoryShareCard
          viewRef={storyCardRef}
          text={cardText}
          count={globalTotal ?? 0}
        />
      </View>
    </AppShell>
  );
}

// ── AppShell ───────────────────────────────────────────────────────────
// Wraps the screen so the dark fairway-deep band of the ticker extends
// all the way up through the status bar / notch area.
function AppShell({ children, updateAvailable, updateDownloading, doUpdate }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={$.root}>
      <StatusBar style="light" />

      <View style={[$.tickerWrap, { paddingTop: insets.top }]}>
        {updateAvailable && (
          <Pressable onPress={doUpdate} disabled={updateDownloading} style={$.updateBanner}>
            <Text style={$.updateText}>
              {updateDownloading ? 'Installing…' : 'Update available — tap to install'}
            </Text>
          </Pressable>
        )}
        <TopTicker />
      </View>

      <View style={[$.body, { paddingLeft: insets.left, paddingRight: insets.right }]}>
        {children}
      </View>
    </View>
  );
}

// ── CountUp ────────────────────────────────────────────────────────────
function CountUp({ value, duration = 650, style }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    fromRef.current = display;
    startRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const next = Math.round(fromRef.current + (value - fromRef.current) * eased);
      setDisplay(next);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <Text style={style}>{display.toLocaleString('en-US')}</Text>;
}

// ── PaperGrain (SVG noise overlay) ────────────────────────────────────
function PaperGrain() {
  return (
    <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none" opacity={0.08}>
      <Defs>
        <Filter id="grain" x="0" y="0" width="100%" height="100%">
          <FeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </Filter>
      </Defs>
      <G>
        <Rect width="100%" height="100%" fill="#000" filter="url(#grain)" />
      </G>
    </Svg>
  );
}

// ── TopTicker ──────────────────────────────────────────────────────────
function TopTicker() {
  const [items, setItems] = useState(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const translate = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchLeaderboard('all')
      .then((rows) => setItems((rows || []).slice(0, 20)))
      .catch(() => setItems([]));
  }, []);

  // Animate ticker once we know real width — ~65 px/sec (matches the web)
  useEffect(() => {
    if (!items || items.length === 0 || trackWidth === 0) return;
    translate.setValue(0);
    const duration = Math.max(6000, (trackWidth / 35) * 1000);
    const loop = Animated.loop(
      Animated.timing(translate, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [items, trackWidth, translate]);

  return (
    <View style={$.ticker}>
      {items === null ? (
        <Text style={$.tickerLoading}>Loading…</Text>
      ) : items.length === 0 ? (
        <View style={$.tickerEmpty}>
          <ThumbsUpInline color={PALETTE.cream} size={11} />
          <Text style={$.tickerEmptyText}>Be the first to vote</Text>
        </View>
      ) : (
        <View style={$.tickerMask}>
          <Animated.View
            style={[
              $.tickerRow,
              {
                transform: [{
                  translateX: translate.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -trackWidth],
                  }),
                }],
              },
            ]}
          >
            {/* First copy — measured */}
            <View
              style={$.tickerCopy}
              onLayout={(e) => {
                const w = e.nativeEvent.layout.width;
                if (w && Math.abs(w - trackWidth) > 1) setTrackWidth(w);
              }}
            >
              {items.map((item, idx) => (
                <TickerItem key={`a-${item.id}-${idx}`} item={item} rank={idx + 1} />
              ))}
            </View>
            {/* Second copy — invisible to onLayout, just for seamless loop */}
            <View style={$.tickerCopy}>
              {items.map((item, idx) => (
                <TickerItem key={`b-${item.id}-${idx}`} item={item} rank={idx + 1} />
              ))}
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

function TickerItem({ item, rank }) {
  return (
    <View style={$.tickerItem}>
      <Text style={$.tickerRank}>#{rank}</Text>
      <Text style={$.tickerText} numberOfLines={1}>{item.text}</Text>
      <View style={$.tickerVotes}>
        <ThumbsUpInline color="rgba(245,241,232,0.7)" size={10} />
        <Text style={$.tickerVoteNum}>{item.votes}</Text>
      </View>
      <Text style={$.tickerDot}>·</Text>
    </View>
  );
}

// ── CTAButton ──────────────────────────────────────────────────────────
function CTAButton({ label, onPress }) {
  // Two-layer approach to fake CSS inset shadow: outer = darker base,
  // inner = lighter on top, offset 3px → reveals dark "lip" at the bottom.
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={$.ctaOuter}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[$.ctaInner, pressed && $.ctaInnerPressed]}>
        <Text style={$.ctaLabel}>{label.toUpperCase()}</Text>
      </View>
    </Pressable>
  );
}

// ── ThumbButton ────────────────────────────────────────────────────────
function ThumbButton({ direction, active, scale, onPress }) {
  const isUp = direction === 'up';
  const baseColor = isUp ? PALETTE.green : PALETTE.red;
  const bg = active ? baseColor : mix(baseColor, '#FFFFFF', 0.62);
  const fg = active ? '#FFFFFF' : mix(baseColor, PALETTE.ink, 0.15);

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={isUp ? 'Pure' : 'Shanked'}
      accessibilityState={{ selected: !!active }}
      style={({ pressed }) => [
        $.thumb,
        { backgroundColor: bg, borderColor: active ? 'transparent' : 'rgba(26,25,22,0.16)' },
        pressed && $.thumbPressed,
      ]}
    >
      <Animated.View style={{ transform: [{ scale }, { rotate: isUp ? '0deg' : '180deg' }] }}>
        <ThumbIcon color={fg} size={20} />
      </Animated.View>
    </Pressable>
  );
}

// ── SharePill ──────────────────────────────────────────────────────────
function SharePill({ bg, label, icon, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        $.pill,
        { backgroundColor: bg },
        pressed && $.pillPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={$.pillInner}>
        {icon}
        <Text style={$.pillLabel}>{label}</Text>
      </View>
    </Pressable>
  );
}

// ── StoryShareCard ─────────────────────────────────────────────────────
// Off-screen view that the Share button captures as a 1080×1920 PNG.
// Mirrors the app's home screen — same colors, fonts, proportions —
// just stretched to 9:16 so it feels like a screenshot of the app.
function StoryShareCard({ viewRef, text, count }) {
  return (
    <View ref={viewRef} collapsable={false} style={story.frame}>
      {/* Main column — reuses the app's hierarchy */}
      <View style={story.main}>
        <Image source={LOGO} style={story.logo} resizeMode="contain" />
        <Text style={story.wordmark}>Excuse Caddie</Text>

        <View style={story.panelWrap}>
          <View style={story.panel}>
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <PaperGrain />
            </View>
            <Text style={story.cardText}>{text}</Text>
          </View>
        </View>

        <View style={story.counterRow}>
          <Text style={story.counterNum}>{count.toLocaleString('en-US')}</Text>
          <Text style={story.counterLabel}>ALIBIS ON THE CARD</Text>
        </View>
      </View>

      {/* App-store badges — brutalist style like the Mulligan CTA */}
      <View style={story.storesRow}>
        <View style={story.storeOuter}>
          <View style={story.storeInner}>
            <AppleLogo color={PALETTE.fairwayDeep} />
            <View>
              <Text style={story.storeKicker}>Download on the</Text>
              <Text style={story.storeName}>App Store</Text>
            </View>
          </View>
        </View>
        <View style={story.storeOuter}>
          <View style={story.storeInner}>
            <PlayLogo color={PALETTE.fairwayDeep} />
            <View>
              <Text style={story.storeKicker}>GET IT ON</Text>
              <Text style={story.storeName}>Google Play</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function AppleLogo({ color = '#fff' }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M17.05 20.28c-.98.95-2.05.86-3.08.4-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
      />
    </Svg>
  );
}

function PlayLogo({ color = '#fff' }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path fill={color} d="M5 3.5v17l13.5-8.5z" />
    </Svg>
  );
}

const story = StyleSheet.create({
  // 4:5 portrait — Instagram's current recommended feed-post size.
  // Logical 540×675 → captured as 1080×1350 PNG.
  frame: {
    position: 'absolute',
    left: -10000,
    top: 0,
    width: 540,
    height: 675,
    backgroundColor: PALETTE.fairway,
  },
  main: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 68,
    paddingBottom: 110,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    width: 92,
    height: 92,
    marginBottom: 14,
  },
  wordmark: {
    fontSize: 52,
    lineHeight: 52,
    color: PALETTE.cream,
    letterSpacing: -1.6,
    textAlign: 'center',
    fontFamily: F.extra,
  },
  panelWrap: {
    width: '100%',
    marginTop: 28,
    position: 'relative',
  },
  panel: {
    width: '100%',
    backgroundColor: PALETTE.panelCream,
    borderRadius: 22,
    paddingHorizontal: 36,
    paddingVertical: 48,
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(26,25,22,0.10)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.28,
    shadowRadius: 22,
    elevation: 12,
  },
  cardText: {
    color: PALETTE.ink,
    fontSize: 34,
    lineHeight: 42,
    fontFamily: F.bold,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  counterRow: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  counterNum: {
    color: PALETTE.yellow,
    fontSize: 30,
    fontFamily: F.bold,
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.2,
  },
  counterLabel: {
    color: 'rgba(245,241,232,0.65)',
    fontSize: 15,
    fontFamily: F.semi,
    letterSpacing: 2.6,
  },
  storesRow: {
    position: 'absolute',
    bottom: 22,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  // Two-layer brutalist button — outer is darker base, inner sits 3px
  // above to reveal the bottom "lip". Mirrors the Mulligan CTA.
  storeOuter: {
    backgroundColor: PALETTE.yellowDark,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 8,
  },
  storeInner: {
    backgroundColor: PALETTE.yellow,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  storeKicker: {
    fontSize: 10,
    fontFamily: F.semi,
    color: PALETTE.fairwayDeep,
    opacity: 0.75,
    letterSpacing: 0.5,
    lineHeight: 12,
  },
  storeName: {
    fontSize: 17,
    fontFamily: F.extra,
    color: PALETTE.fairwayDeep,
    letterSpacing: -0.3,
    lineHeight: 20,
  },
});

// ── Helpers ────────────────────────────────────────────────────────────
function mix(hex1, hex2, t) {
  const a = hexToRgb(hex1), b = hexToRgb(hex2);
  const r = Math.round(a.r * t + b.r * (1 - t));
  const g = Math.round(a.g * t + b.g * (1 - t));
  const bl = Math.round(a.b * t + b.b * (1 - t));
  return `rgb(${r},${g},${bl})`;
}
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

// ── Icons (SVG) ────────────────────────────────────────────────────────
function ThumbIcon({ color = '#fff', size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M2 11v9a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1zm20.5-1.5h-6.65l.6-3.16c.04-.21.06-.42.06-.64 0-.4-.16-.78-.44-1.06L15.17 4l-6.59 6.59c-.36.36-.58.86-.58 1.41v8c0 1.1.9 2 2 2h8.51c.71 0 1.37-.39 1.71-1.02l3.18-7.42c.07-.16.1-.34.1-.52v-1.96c0-.83-.67-1.5-1.5-1.5z"
      />
    </Svg>
  );
}
function ThumbsUpInline({ color = '#fff', size = 11 }) {
  return <ThumbIcon color={color} size={size} />;
}
function ShareIcon() {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24">
      <Path
        d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6L12 2M12 2L8 6M12 2v13"
        stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </Svg>
  );
}
function CheckIcon() {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24">
      <Path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}
// ── Styles ─────────────────────────────────────────────────────────────
const $ = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PALETTE.fairway,
  },
  tickerWrap: {
    backgroundColor: PALETTE.fairwayDeep,
  },
  body: {
    flex: 1,
  },

  updateBanner: {
    backgroundColor: PALETTE.green,
    paddingVertical: 8,
    alignItems: 'center',
  },
  updateText: { fontSize: 13, color: '#fff', fontWeight: '600', fontFamily: F.semi },

  // Top ticker
  ticker: {
    backgroundColor: PALETTE.fairwayDeep,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    overflow: 'hidden',
    minHeight: 36,
    justifyContent: 'center',
  },
  tickerLoading: { color: 'rgba(245,241,232,0.6)', fontSize: 11, textAlign: 'center', fontFamily: F.medium },
  tickerEmpty: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
  tickerEmptyText: { color: 'rgba(245,241,232,0.75)', fontSize: 12, fontFamily: F.medium },
  tickerMask: { overflow: 'hidden' },
  tickerRow: { flexDirection: 'row', alignItems: 'center' },
  tickerCopy: { flexDirection: 'row', alignItems: 'center' },
  tickerItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10 },
  tickerRank: { color: PALETTE.yellow, fontSize: 12, fontFamily: F.bold },
  tickerText: { color: 'rgba(245,241,232,0.95)', fontSize: 12, fontFamily: F.medium, maxWidth: 240 },
  tickerVotes: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  tickerVoteNum: { color: 'rgba(245,241,232,0.7)', fontSize: 12, fontFamily: F.medium, fontVariant: ['tabular-nums'] },
  tickerDot: { color: 'rgba(245,241,232,0.2)', fontSize: 14, paddingHorizontal: 4 },

  // Main column — anchored near the top so logo + wordmark sit close to
  // the ticker instead of floating mid-screen.
  main: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 28,
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%',
  },

  logo: {
    width: 56,
    height: 56,
    marginBottom: 12,
  },
  wordmark: {
    fontSize: 34,
    lineHeight: 34,
    color: PALETTE.cream,
    letterSpacing: -1.1,
    textAlign: 'center',
    fontFamily: F.extra,
  },

  counterRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  counterNum: {
    color: PALETTE.yellow,
    fontSize: 18,
    fontFamily: F.bold,
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.2,
  },
  counterLabel: {
    color: 'rgba(245,241,232,0.55)',
    fontSize: 12,
    fontFamily: F.semi,
    letterSpacing: 2.0,
  },

  // Excuse panel
  panelWrap: {
    width: '100%',
    marginTop: 28,
    position: 'relative',
  },
  panel: {
    backgroundColor: PALETTE.panelCream,
    borderRadius: 18,
    paddingHorizontal: 26,
    paddingVertical: 32,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(26,25,22,0.10)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 10,
  },
  cardText: {
    color: PALETTE.ink,
    fontSize: 22,
    lineHeight: 30,
    fontFamily: F.bold,
    textAlign: 'center',
    letterSpacing: -0.2,
  },

  thumbsRow: {
    position: 'absolute',
    top: -16,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 4,
  },
  thumbPressed: { transform: [{ translateY: 2 }] },

  // CTA — two-layer to fake the inset bottom shadow
  ctaOuter: {
    marginTop: 'auto',
    width: '100%',
    backgroundColor: PALETTE.yellowDark,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 10,
  },
  ctaInner: {
    backgroundColor: PALETTE.yellow,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaInnerPressed: {
    marginBottom: 0,
    marginTop: 3,
    paddingVertical: 18,
  },
  ctaLabel: {
    color: PALETTE.fairwayDeep,
    fontSize: 16,
    fontFamily: F.extra,
    letterSpacing: 1.6,
  },

  // Share row
  shareRow: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.22)',
  },
  pillPressed: { transform: [{ translateY: 1 }], borderBottomWidth: 1 },
  pillInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pillLabel: { color: '#fff', fontSize: 14, fontFamily: F.bold },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingHorizontal: 20,
    gap: 16,
  },
  footerLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { color: 'rgba(245,241,232,0.85)', fontSize: 12, fontFamily: F.bold },
  footerDot: { color: 'rgba(245,241,232,0.4)', fontSize: 14 },
});
