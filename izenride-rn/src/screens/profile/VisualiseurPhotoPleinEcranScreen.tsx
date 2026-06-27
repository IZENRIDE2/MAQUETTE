import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgGrad, RadialGradient, Stop, Rect, Circle, Path, Ellipse, G } from 'react-native-svg';
import {
  X,
  MoreVertical,
  Search,
  MapPin,
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { colors, fonts, radius } from '@/theme';

/** Visualiseur photo plein écran — photo communauté (localisé Forêt de Fontainebleau). */
export default function VisualiseurPhotoPleinEcranScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* Photo de fond (paysage moto / crépuscule) */}
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <SvgGrad id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#0a1424" />
            <Stop offset="35%" stopColor="#1a2848" />
            <Stop offset="60%" stopColor="#3d3a5e" />
            <Stop offset="80%" stopColor="#9c5a4a" />
            <Stop offset="100%" stopColor="#f4a574" />
          </SvgGrad>
          <RadialGradient id="sun" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#ffe4b5" stopOpacity="0.95" />
            <Stop offset="40%" stopColor="#f4a574" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#9c5a4a" stopOpacity="0" />
          </RadialGradient>
          <SvgGrad id="ground" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#161420" />
            <Stop offset="100%" stopColor="#08070d" />
          </SvgGrad>
        </Defs>
        <Rect width="390" height="844" fill="url(#sky)" />
        <Circle cx="280" cy="540" r="180" fill="url(#sun)" />
        <Circle cx="280" cy="540" r="38" fill="#fff5d6" opacity={0.85} />
        <Circle cx="280" cy="540" r="22" fill="#fffbf0" />
        <Path d="M 0 580 L 60 540 L 130 560 L 200 510 L 280 540 L 360 500 L 390 520 L 390 600 L 0 600 Z" fill="#3a2a48" opacity={0.7} />
        <Path d="M 0 700 L 40 650 L 100 680 L 170 640 L 240 670 L 310 630 L 390 660 L 390 720 L 0 720 Z" fill="#0e0c1a" />
        <Path d="M 0 720 L 0 844 L 390 844 L 390 690 L 320 700 L 240 720 L 180 705 L 100 730 Z" fill="url(#ground)" />
        <G transform="translate(155, 670)">
          <Ellipse cx="0" cy="42" rx="32" ry="3" fill="black" opacity={0.5} />
          <Circle cx="-22" cy="32" r="11" fill="#0a0a10" />
          <Circle cx="22" cy="32" r="11" fill="#0a0a10" />
          <Path d="M -22 32 L -8 14 L 8 12 L 22 32 Z" fill="#0c0c14" />
          <Circle cx="22" cy="14" r="6" fill="#fff5d6" opacity={0.4} />
          <Ellipse cx="6" cy="-22" rx="6" ry="7" fill="#0a0a10" />
        </G>
      </Svg>

      {/* Vignette */}
      <View pointerEvents="none" style={styles.vignette} />

      {/* Top bar */}
      <LinearGradient colors={['rgba(0,0,0,0.7)', 'transparent']} style={styles.topBar}>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <X size={18} color="#fff" />
        </Pressable>
        <View style={styles.topInfo}>
          <View style={styles.topSender}>
            <View style={styles.topAvatar}>
              <Text style={styles.topAvatarTxt}>L</Text>
            </View>
            <Text style={styles.topName}>Léa M.</Text>
          </View>
          <Text style={styles.topTime}>Aujourd'hui · 18:42</Text>
        </View>
        <Pressable style={styles.iconBtn}>
          <MoreVertical size={18} color="#fff" />
        </Pressable>
      </LinearGradient>

      {/* Counter + zoom pills */}
      <View style={styles.pillsRow}>
        <View style={styles.pill}>
          <Text style={styles.pillTxt}>
            2 <Text style={{ color: 'rgba(255,255,255,0.5)' }}>/</Text> 4
          </Text>
        </View>
        <View style={styles.pill}>
          <Search size={11} color="#fff" />
          <Text style={[styles.pillTxt, { color: colors.neon }]}>1.4×</Text>
        </View>
      </View>

      {/* Swipe arrows */}
      <Pressable style={[styles.swipeArrow, { left: 12 }]}>
        <ChevronLeft size={14} color="#fff" />
      </Pressable>
      <Pressable style={[styles.swipeArrow, { right: 12 }]}>
        <ChevronRight size={14} color="#fff" />
      </Pressable>

      {/* Caption */}
      <View style={styles.captionBar}>
        <Text style={styles.captionTxt}>
          Sunset au sommet de la Forêt de Fontainebleau 🌅 La meilleure récompense après 32 km de virages.
        </Text>
        <View style={styles.captionMeta}>
          <MapPin size={10} color="rgba(232,235,242,0.55)" />
          <Text style={styles.captionMetaTxt}>Fontainebleau</Text>
          <View style={styles.metaDot} />
          <Calendar size={10} color="rgba(232,235,242,0.55)" />
          <Text style={styles.captionMetaTxt}>28 avr · 18:38</Text>
          <View style={styles.metaDot} />
          <Text style={styles.captionMetaTxt}>4032 × 3024</Text>
        </View>
      </View>

      {/* Thumb dots */}
      <View style={styles.dots}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
        ))}
      </View>

      {/* Bottom action bar */}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.bottomBar}>
        <Action icon={<Heart size={20} color={colors.danger} fill={colors.danger} />} label="Aimer" />
        <Action icon={<MessageCircle size={20} color="#fff" />} label="Répondre" />
        <Action icon={<Share2 size={20} color="#fff" />} label="Partager" />
        <Action icon={<Download size={20} color={colors.neon} />} label="Sauvegarder" />
        <Action icon={<Trash2 size={20} color="#fff" />} label="Supprimer" />
      </LinearGradient>
    </View>
  );
}

function Action({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Pressable style={styles.action}>
      {icon}
      <Text style={styles.actionTxt}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  vignette: { ...StyleSheet.absoluteFillObject },

  topBar: { position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 54, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(20,22,30,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  topInfo: { flex: 1, alignItems: 'center', paddingHorizontal: 12 },
  topSender: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  topAvatar: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center' },
  topAvatarTxt: { fontFamily: fonts.bold, fontSize: 9, color: '#fff' },
  topName: { fontFamily: fonts.semibold, fontSize: 13, color: '#fff' },
  topTime: { fontFamily: fonts.mono, fontSize: 10, color: 'rgba(255,255,255,0.55)' },

  pillsRow: { position: 'absolute', top: 130, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: 'rgba(20,22,30,0.8)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  pillTxt: { fontFamily: fonts.mono, fontSize: 11, color: '#fff' },

  swipeArrow: { position: 'absolute', top: '50%', width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(20,22,30,0.65)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', opacity: 0.6 },

  captionBar: { position: 'absolute', bottom: 130, left: 12, right: 12, padding: 14, borderRadius: 14, backgroundColor: 'rgba(20,22,30,0.78)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  captionTxt: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: '#fff' },
  captionMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', flexWrap: 'wrap' },
  captionMetaTxt: { fontFamily: fonts.mono, fontSize: 10, color: 'rgba(232,235,242,0.55)' },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.25)' },

  dots: { position: 'absolute', bottom: 100, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { width: 24, borderRadius: 3, backgroundColor: '#fff' },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', paddingTop: 16, paddingBottom: 34, paddingHorizontal: 16 },
  action: { flex: 1, height: 50, alignItems: 'center', justifyContent: 'center', gap: 4 },
  actionTxt: { fontFamily: fonts.medium, fontSize: 10, color: '#fff' },
});
