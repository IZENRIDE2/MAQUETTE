import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Heart, Calendar, MessageCircle, Bike } from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, shadow } from '@/theme';

const pink = colors.danger;
const violet = colors.purple;

/** Match success — overlay « C'est un match ! » (localisé Paris). */
export default function MatchSuccessScreen() {
  return (
    <Screen scroll={false} pad={0} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['#1a0c1e', '#0f0712', colors.bgDeep]}
        style={StyleSheet.absoluteFill}
      />

      {/* Bouton fermer */}
      <Pressable style={styles.closeBtn}>
        <X size={14} color="rgba(255,255,255,0.8)" strokeWidth={2.4} />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Titre */}
        <Text style={styles.eyebrow}>★ MUTUAL MATCH ★</Text>
        <Text style={styles.title}>C'est un match !</Text>
        <Text style={styles.subtitle}>
          <Text style={styles.subtitleStrong}>Léa</Text> et toi vous êtes likés. Lance la conversation maintenant ?
        </Text>

        {/* Portraits */}
        <View style={styles.portraits}>
          <View style={[styles.portraitWrap, { transform: [{ rotate: '-8deg' }], marginRight: -22, zIndex: 2 }]}>
            <LinearGradient colors={[pink, violet]} style={styles.portraitRing}>
              <LinearGradient colors={['#4a3a6e', '#1a1230']} style={styles.portrait} />
            </LinearGradient>
            <View style={[styles.bikeBadge, { right: -10 }]}>
              <Bike size={10} color={colors.neon} />
              <Text style={styles.bikeBadgeTxt}>MT-09</Text>
            </View>
          </View>

          <View style={styles.centerHeart}>
            <Heart size={26} color="#fff" fill="#fff" />
          </View>

          <View style={[styles.portraitWrap, { transform: [{ rotate: '8deg' }], marginLeft: -22, zIndex: 1 }]}>
            <LinearGradient colors={[pink, violet]} style={styles.portraitRing}>
              <LinearGradient colors={['#5e2c44', '#301220']} style={styles.portrait} />
            </LinearGradient>
            <View style={[styles.bikeBadge, { left: -10 }]}>
              <Bike size={10} color={colors.neon} />
              <Text style={styles.bikeBadgeTxt}>Z650</Text>
            </View>
          </View>
        </View>

        {/* Contexte commun */}
        <View style={styles.commonContext}>
          <View style={styles.commonIcon}>
            <Calendar size={14} color={violet} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.commonLabel}>Centre d'intérêt commun</Text>
            <Text style={styles.commonText}>Vous êtes inscrits à la balade Forêt de Fontainebleau · 12 mai</Text>
          </View>
        </View>

        {/* Icebreakers */}
        <View style={styles.icebreaker}>
          <Text style={styles.icebreakerLabel}>Icebreakers suggérés</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
            {['👋 Salut Léa, on se croise sur la balade ?', '🏍️ Belle Z650 ! Depuis quand ?', '☕ Café motards samedi ?'].map((c) => (
              <View key={c} style={styles.iceChip}>
                <Text style={styles.iceChipTxt}>{c}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable>
          <LinearGradient colors={[pink, violet]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btnPrimary}>
            <MessageCircle size={16} color="#fff" />
            <Text style={styles.btnPrimaryTxt}>Envoyer un message à Léa</Text>
          </LinearGradient>
        </Pressable>
        <Pressable style={styles.btnSecondary}>
          <Text style={styles.btnSecondaryTxt}>Continuer à swiper</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  closeBtn: { position: 'absolute', top: 8, right: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(20,23,31,0.6)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  scroll: { paddingHorizontal: 24, paddingTop: 70, alignItems: 'center' },

  eyebrow: { fontFamily: fonts.monoBold, fontSize: 11, letterSpacing: 4, color: pink, marginBottom: 8 },
  title: { fontFamily: fonts.bold, fontSize: 38, color: '#fff', letterSpacing: -1, textAlign: 'center' },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim, marginTop: 10, textAlign: 'center', maxWidth: 280, lineHeight: 18 },
  subtitleStrong: { fontFamily: fonts.semibold, color: colors.ink },

  portraits: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 36, marginBottom: 8, height: 150 },
  portraitWrap: { position: 'relative' },
  portraitRing: { width: 140, height: 140, borderRadius: 70, padding: 3, ...shadow.card },
  portrait: { flex: 1, borderRadius: 70, borderWidth: 3, borderColor: colors.bgDeep },
  bikeBadge: { position: 'absolute', bottom: 8, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(8,9,14,0.92)', borderWidth: 1.5, borderColor: 'rgba(77,143,255,0.5)', borderRadius: 100, paddingLeft: 6, paddingRight: 8, paddingVertical: 4, zIndex: 5 },
  bikeBadgeTxt: { fontFamily: fonts.monoBold, fontSize: 9.5, color: colors.neon },
  centerHeart: { position: 'absolute', zIndex: 5, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: violet, borderWidth: 5, borderColor: 'rgba(8,9,14,0.95)' },

  commonContext: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 28, backgroundColor: 'rgba(184,132,230,0.12)', borderWidth: 1, borderColor: 'rgba(184,132,230,0.35)', borderRadius: 14, padding: 11, alignSelf: 'stretch' },
  commonIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(184,132,230,0.2)', borderWidth: 1, borderColor: 'rgba(184,132,230,0.4)', alignItems: 'center', justifyContent: 'center' },
  commonLabel: { fontFamily: fonts.bold, fontSize: 9, color: violet, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 1 },
  commonText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.ink, lineHeight: 16 },

  icebreaker: { marginTop: 12, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 12, alignSelf: 'stretch' },
  icebreakerLabel: { fontFamily: fonts.bold, fontSize: 9.5, color: colors.inkMute, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, paddingHorizontal: 4 },
  iceChip: { paddingHorizontal: 11, paddingVertical: 7, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 100 },
  iceChipTxt: { fontFamily: fonts.semibold, fontSize: 11.5, color: colors.inkDim },

  actions: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 10, gap: 10 },
  btnPrimary: { height: 54, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...shadow.card },
  btnPrimaryTxt: { fontFamily: fonts.bold, fontSize: 15, color: '#fff' },
  btnSecondary: { height: 44, borderRadius: 14, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  btnSecondaryTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.inkDim },
});
