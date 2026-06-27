import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RefreshCw, X, Star, Heart, Zap, Check, Bike } from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, shadow } from '@/theme';

/** Super Like — pile de cartes avec action Super Like mise en avant (localisé Paris). */
export default function SuperLikeAnimationScreen() {
  return (
    <Screen scroll={false} pad={0} edges={['top', 'bottom']}>
      {/* Header avec compteurs */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Découvrir</Text>
        <View style={styles.counterLike}>
          <Heart size={13} color={colors.danger} fill={colors.danger} />
          <Text style={styles.counterInfinity}>∞</Text>
        </View>
        <View style={styles.counterSuper}>
          <Star size={13} color={colors.neon} fill={colors.neon} />
          <Text style={styles.counterNum}>5/5</Text>
        </View>
      </View>

      {/* Zone cartes */}
      <View style={styles.cardArea}>
        <View style={[styles.card, styles.bgCard]}>
          <LinearGradient colors={['#2A3545', '#1A1E28', '#0C0E16']} style={StyleSheet.absoluteFill} />
          <View style={styles.riderPhoto}>
            <Text style={styles.riderInitials}>JD</Text>
          </View>
        </View>

        <View style={[styles.card, styles.frontCard]}>
          <LinearGradient colors={['#2A3545', '#1A1E28', '#0C0E16']} style={StyleSheet.absoluteFill} />
          <View style={styles.riderPhoto}>
            <Text style={styles.riderInitials}>SP</Text>
          </View>

          {/* Stamp Super Like (état au repos) */}
          <View style={styles.superStamp}>
            <Text style={styles.superStampTxt}>SUPER LIKE</Text>
          </View>

          {/* Infos */}
          <LinearGradient colors={['transparent', 'rgba(8,9,14,0.95)', colors.bgDeep]} style={styles.cardInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>Sophie</Text>
              <Text style={styles.age}>28</Text>
              <View style={styles.verified}>
                <Check size={11} color="#fff" strokeWidth={3.5} />
              </View>
            </View>
            <View style={styles.bikeRow}>
              <Bike size={13} color={colors.warn} />
              <Text style={styles.bikeTxt}>Yamaha MT-07 · Paris 12e</Text>
            </View>
            <View style={styles.tags}>
              <Tag label="🏔️ Vallée de Chevreuse" />
              <Tag label="☀️ Week-end" />
              <Tag label="⚡ Sportif" />
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <ActionBtn size={48}>
          <RefreshCw size={20} color={colors.warn} strokeWidth={2.5} />
        </ActionBtn>
        <ActionBtn size={56} borderColor="rgba(255,92,122,0.3)">
          <X size={26} color={colors.danger} strokeWidth={2.5} />
        </ActionBtn>
        <Pressable style={styles.superBtn}>
          <LinearGradient colors={[colors.neon, '#3D7FBD']} style={styles.superBtnInner}>
            <Star size={28} color="#fff" fill="#fff" />
          </LinearGradient>
          <View style={styles.superBadge}>
            <Text style={styles.superBadgeTxt}>5</Text>
          </View>
        </Pressable>
        <ActionBtn size={56} borderColor="rgba(74,222,128,0.3)">
          <Heart size={26} color={colors.success} fill={colors.success} />
        </ActionBtn>
        <ActionBtn size={48}>
          <Zap size={18} color={colors.purple} strokeWidth={2.2} />
        </ActionBtn>
      </View>
    </Screen>
  );
}

function ActionBtn({ children, size, borderColor }: { children: React.ReactNode; size: number; borderColor?: string }) {
  return (
    <View style={[styles.actionBtn, { width: size, height: size, borderRadius: size / 2 }, borderColor ? { borderColor } : null]}>
      {children}
    </View>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagTxt}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingTop: 6, paddingBottom: 10 },
  appTitle: { flex: 1, fontFamily: fonts.bold, fontSize: 22, color: colors.ink, letterSpacing: -0.7 },
  counterLike: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: 'rgba(255,92,122,0.1)', borderWidth: 1, borderColor: 'rgba(255,92,122,0.25)' },
  counterInfinity: { fontFamily: fonts.bold, fontSize: 16, color: colors.danger },
  counterSuper: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: 'rgba(77,143,255,0.12)', borderWidth: 1, borderColor: 'rgba(77,143,255,0.35)' },
  counterNum: { fontFamily: fonts.monoBold, fontSize: 12, color: colors.neon },

  cardArea: { flex: 1, paddingHorizontal: 16, paddingVertical: 8 },
  card: { position: 'absolute', left: 16, right: 16, top: 8, bottom: 8, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: colors.lineStrong },
  bgCard: { transform: [{ scale: 0.94 }, { translateY: 8 }], opacity: 0.6 },
  frontCard: { ...shadow.card },
  riderPhoto: { position: 'absolute', top: '22%', alignSelf: 'center', width: 130, height: 130, borderRadius: 65, alignItems: 'center', justifyContent: 'center' },
  riderInitials: { fontFamily: fonts.bold, fontSize: 52, color: '#fff' },

  superStamp: { position: 'absolute', bottom: 200, alignSelf: 'center', borderWidth: 4, borderColor: colors.neon, borderRadius: 12, paddingHorizontal: 18, paddingVertical: 10, backgroundColor: 'rgba(8,9,14,0.4)', transform: [{ rotate: '-8deg' }] },
  superStampTxt: { fontFamily: fonts.bold, fontSize: 26, color: colors.neon, letterSpacing: 1.5 },

  cardInfo: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 18, paddingTop: 50 },
  nameRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 5 },
  name: { fontFamily: fonts.bold, fontSize: 24, color: '#fff' },
  age: { fontFamily: fonts.semibold, fontSize: 19, color: 'rgba(255,255,255,0.9)' },
  verified: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  bikeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  bikeTxt: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkDim },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  tag: { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 7, paddingHorizontal: 8, paddingVertical: 4 },
  tagTxt: { fontFamily: fonts.semibold, fontSize: 10.5, color: '#fff' },

  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 16, paddingTop: 6, paddingBottom: 12 },
  actionBtn: { backgroundColor: colors.bg2, borderWidth: 1.5, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  superBtn: { width: 64, height: 64 },
  superBtnInner: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', ...shadow.neon },
  superBadge: { position: 'absolute', top: -2, right: -2, width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', borderWidth: 2, borderColor: colors.neon, alignItems: 'center', justifyContent: 'center' },
  superBadgeTxt: { fontFamily: fonts.bold, fontSize: 11, color: colors.neon },
});
