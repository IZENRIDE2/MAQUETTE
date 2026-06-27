import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Heart, Star, MapPin } from 'lucide-react-native';
import { Screen, BottomTabBar, Tag, Logo } from '@/components';
import { colors, fonts, radius, shadow } from '@/theme';

/** Swipe stack — découverte de profils motards (localisé Paris). */
export default function SwipeStackScreen() {
  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* En-tête */}
      <View style={styles.header}>
        <Logo size={36} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Découverte</Text>
          <Text style={styles.sub}>Profils motards · Paris</Text>
        </View>
        <Tag label="Style : Tous" />
      </View>

      {/* Pile de cartes */}
      <View style={styles.stack}>
        <View style={[styles.card, styles.cardBack2]} />
        <View style={[styles.card, styles.cardBack1]} />
        <View style={[styles.card, styles.cardFront]}>
          <LinearGradient colors={[colors.izenDeep, '#0a0e15']} style={StyleSheet.absoluteFill} />
          {/* Badges swipe */}
          <View style={[styles.swipeBadge, styles.likeBadge]}>
            <Text style={[styles.swipeTxt, { color: colors.success }]}>LIKE</Text>
          </View>
          <View style={[styles.swipeBadge, styles.nopeBadge]}>
            <Text style={[styles.swipeTxt, { color: colors.danger }]}>NOPE</Text>
          </View>

          {/* Infos profil (bas de carte) */}
          <LinearGradient
            colors={['transparent', 'rgba(7,9,15,0.95)']}
            style={styles.cardInfo}
          >
            <View style={styles.nameRow}>
              <Text style={styles.name}>Léa</Text>
              <Text style={styles.age}>27</Text>
            </View>
            <View style={styles.metaRow}>
              <MapPin size={14} color={colors.neonBright} />
              <Text style={styles.meta}>3,8 km · Paris 11e</Text>
            </View>
            <View style={styles.tags}>
              <Tag label="Routier" />
              <Tag label="2 ans permis" />
              <Tag label="Yamaha MT-07" />
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Actions swipe */}
      <View style={styles.actions}>
        <ActionBtn color={colors.danger}>
          <X size={28} color={colors.danger} strokeWidth={3} />
        </ActionBtn>
        <ActionBtn color={colors.neon} big>
          <Star size={26} color={colors.neonBright} fill={colors.neon} />
        </ActionBtn>
        <ActionBtn color={colors.success}>
          <Heart size={28} color={colors.success} fill={colors.success} />
        </ActionBtn>
      </View>

      <BottomTabBar active="match" />
    </Screen>
  );
}

function ActionBtn({ children, color, big }: { children: React.ReactNode; color: string; big?: boolean }) {
  const size = big ? 56 : 64;
  return (
    <Pressable
      style={[
        styles.actionBtn,
        { width: size, height: size, borderRadius: size / 2, borderColor: color },
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingVertical: 12 },
  title: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink },
  sub: { fontFamily: fonts.mono, fontSize: 11, color: colors.neonBright, marginTop: 2 },

  stack: { flex: 1, marginHorizontal: 18, marginBottom: 8 },
  card: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: radius.xxl, overflow: 'hidden' },
  cardBack2: { transform: [{ scale: 0.9 }, { translateY: -24 }], backgroundColor: colors.bg2, opacity: 0.5 },
  cardBack1: { transform: [{ scale: 0.95 }, { translateY: -12 }], backgroundColor: colors.izenDeep, opacity: 0.7 },
  cardFront: { borderWidth: 1, borderColor: colors.lineStrong, ...shadow.card },

  swipeBadge: { position: 'absolute', top: 28, borderWidth: 3, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 6 },
  likeBadge: { left: 22, borderColor: colors.success, transform: [{ rotate: '-12deg' }] },
  nopeBadge: { right: 22, borderColor: colors.danger, transform: [{ rotate: '12deg' }] },
  swipeTxt: { fontFamily: fonts.bold, fontSize: 22, letterSpacing: 2 },

  cardInfo: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 20, paddingTop: 60 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  name: { fontFamily: fonts.bold, fontSize: 30, color: colors.ink },
  age: { fontFamily: fonts.regular, fontSize: 24, color: colors.inkDim, marginBottom: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, marginBottom: 12 },
  meta: { fontFamily: fonts.medium, fontSize: 14, color: colors.inkDim },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 22, paddingVertical: 16 },
  actionBtn: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.panel, borderWidth: 2, ...shadow.card },
});
