import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Smartphone, Type as TypeIcon, Contrast, RefreshCw } from 'lucide-react-native';
import { Screen, AppBar, Switch, Divider } from '@/components';
import { colors, fonts, radius } from '@/theme';

type ThemeId = 'auto' | 'dark' | 'light';

const THEMES: { id: ThemeId; name: string; desc: string; locked?: boolean }[] = [
  { id: 'auto', name: 'Auto', desc: 'Suit le système', locked: true },
  { id: 'dark', name: 'Sombre', desc: 'Économise la batterie' },
  { id: 'light', name: 'Clair', desc: 'Lisible plein jour', locked: true },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const TOGGLES = [
  { title: 'Suivre la taille du système', desc: 'Utilise les Réglages → Affichage de l\'iPhone', on: false },
  { title: 'Texte en gras', desc: 'Améliore la lisibilité du texte', on: false },
  { title: 'Contraste élevé', desc: 'Renforce les bordures et textes secondaires', on: false },
  { title: 'Réduire les animations', desc: 'Désactive les transitions et effets visuels', on: false },
];

export default function ApparenceScreen() {
  const [theme, setTheme] = useState<ThemeId>('dark');
  const [size, setSize] = useState(2);

  return (
    <Screen pad={16}>
      <AppBar title="Apparence" />
      <Text style={styles.headerSub}>Personnalisez votre expérience visuelle</Text>

      {/* Thème */}
      <Text style={styles.sectionTitle}>Thème</Text>
      <View style={styles.themeGrid}>
        {THEMES.map((t) => {
          const on = theme === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => !t.locked && setTheme(t.id)}
              style={[styles.themeCard, on && styles.themeCardOn, t.locked && styles.themeCardLocked]}
            >
              {t.locked && (
                <View style={styles.lockBadge}>
                  <Text style={styles.lockBadgeTxt}>Bientôt</Text>
                </View>
              )}
              {on && (
                <View style={styles.themeCheck}>
                  <Check size={11} color="#fff" strokeWidth={3.5} />
                </View>
              )}
              <View
                style={[
                  styles.themePreview,
                  { backgroundColor: t.id === 'light' ? '#F5F6FA' : '#08090E' },
                ]}
              >
                {t.id === 'auto' && (
                  <LinearGradient colors={['#08090E', '#F5F6FA']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
                )}
              </View>
              <Text style={[styles.themeName, on && { color: colors.neon }]}>{t.name}</Text>
              <Text style={styles.themeDesc}>{t.desc}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.csNotice}>
        <Text style={styles.csTxt}>
          Le mode <Text style={styles.csStrong}>Clair</Text> et <Text style={styles.csStrong}>Auto</Text> arrivent dans la{' '}
          <Text style={styles.csStrong}>v3.1</Text>. Pour l'instant, IzenRide est en sombre — pensé pour les rides nocturnes 🏍️
        </Text>
      </View>

      {/* Taille du texte */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Taille du texte</Text>
      <View style={styles.textSizeCard}>
        <View style={styles.previewCard}>
          <Text style={styles.previewLabel}>APERÇU</Text>
          <View style={styles.previewMsg}>
            <View style={styles.previewAvatar}>
              <Text style={styles.previewAvatarTxt}>FB</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.previewName}>Florian Bianchi</Text>
              <Text style={styles.previewMeta}>Montmartre · Hier</Text>
              <Text style={styles.previewText}>Génial ce ride ! 🏍️ On remet ça samedi ?</Text>
              <View style={styles.previewBtn}>
                <Text style={styles.previewBtnTxt}>Répondre</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sizeLabels}>
          {SIZES.map((s, i) => (
            <Pressable key={s} onPress={() => setSize(i)} style={styles.sizeLabelItem}>
              <Text style={[styles.sizeLabelA, { fontSize: 11 + i * 2 }, i === size && { color: colors.neon }]}>A</Text>
              <Text style={[styles.sizeLabelName, i === size && { color: colors.neon }]}>{s}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sliderTrack}>
          <View style={styles.sliderLine} />
          <View style={[styles.sliderFill, { width: `${(size / 4) * 100}%` }]} />
          {SIZES.map((s, i) => (
            <View key={s} style={[styles.sliderTick, { left: `${(i / 4) * 100}%` }, i <= size && styles.sliderTickOn]} />
          ))}
          <View style={[styles.sliderThumb, { left: `${(size / 4) * 100}%` }]} />
        </View>

        <Pressable style={styles.resetLink}>
          <RefreshCw size={11} color={colors.neon} />
          <Text style={styles.resetLinkTxt}>Réinitialiser à la taille par défaut</Text>
        </Pressable>
      </View>

      {/* Accessibilité */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Accessibilité</Text>
      <View style={styles.card}>
        {TOGGLES.map((t, i) => (
          <View key={t.title}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleIcon}>
                {i === 0 ? <Smartphone size={16} color={colors.neon} /> : i === 2 ? <Contrast size={16} color={colors.inkMute} /> : <TypeIcon size={16} color={colors.inkMute} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>{t.title}</Text>
                <Text style={styles.toggleDesc}>{t.desc}</Text>
              </View>
              <Switch value={t.on} />
            </View>
            {i < TOGGLES.length - 1 && <Divider style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* Reset all */}
      <View style={styles.resetFooter}>
        <Pressable style={styles.resetAllBtn}>
          <RefreshCw size={11} color={colors.inkMute} />
          <Text style={styles.resetAllTxt}>Réinitialiser tous les paramètres d'apparence</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerSub: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkMute, marginTop: -4, marginBottom: 8 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: 4, marginBottom: 12 },

  themeGrid: { flexDirection: 'row', gap: 8 },
  themeCard: { flex: 1, backgroundColor: '#10121A', borderWidth: 1, borderColor: '#1A1E28', borderRadius: radius.md, padding: 10, paddingTop: 14, overflow: 'hidden' },
  themeCardOn: { borderColor: colors.neon, backgroundColor: 'rgba(77,143,255,0.06)' },
  themeCardLocked: { opacity: 0.6 },
  lockBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(8,9,14,0.8)', borderWidth: 1, borderColor: 'rgba(251,191,36,0.25)', borderRadius: 5, paddingHorizontal: 6, paddingVertical: 3, zIndex: 2 },
  lockBadgeTxt: { fontFamily: fonts.bold, fontSize: 8.5, color: colors.warn, textTransform: 'uppercase' },
  themeCheck: { position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  themePreview: { height: 90, borderRadius: 10, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)' },
  themeName: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, textAlign: 'center', marginBottom: 2 },
  themeDesc: { fontFamily: fonts.medium, fontSize: 10, color: colors.inkMute, textAlign: 'center', lineHeight: 13 },

  csNotice: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, padding: 12, backgroundColor: 'rgba(251,191,36,0.05)', borderWidth: 1, borderColor: 'rgba(251,191,36,0.15)', borderRadius: 12 },
  csTxt: { flex: 1, fontFamily: fonts.medium, fontSize: 11.5, color: colors.ink, lineHeight: 16, opacity: 0.85 },
  csStrong: { fontFamily: fonts.bold, color: colors.warn },

  textSizeCard: { backgroundColor: '#10121A', borderWidth: 1, borderColor: '#1A1E28', borderRadius: 18, padding: 16 },
  previewCard: { backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: '#1A1E28', borderRadius: 14, padding: 14, marginBottom: 16 },
  previewLabel: { position: 'absolute', top: -8, left: 14, backgroundColor: colors.bgDeep, paddingHorizontal: 8, fontFamily: fonts.bold, fontSize: 9.5, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8 },
  previewMsg: { flexDirection: 'row', gap: 10 },
  previewAvatar: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center' },
  previewAvatarTxt: { fontFamily: fonts.bold, fontSize: 13, color: '#fff' },
  previewName: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, marginBottom: 2 },
  previewMeta: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginBottom: 6 },
  previewText: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.ink, lineHeight: 20 },
  previewBtn: { alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.neon, borderRadius: 8 },
  previewBtnTxt: { fontFamily: fonts.bold, fontSize: 12, color: '#fff' },

  sizeLabels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  sizeLabelItem: { flex: 1, alignItems: 'center', gap: 4 },
  sizeLabelA: { fontFamily: fonts.bold, color: colors.inkMute },
  sizeLabelName: { fontFamily: fonts.bold, fontSize: 9, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.5 },

  sliderTrack: { height: 32, marginHorizontal: 8, justifyContent: 'center' },
  sliderLine: { position: 'absolute', left: 0, right: 0, height: 4, borderRadius: 2, backgroundColor: '#1A1E28' },
  sliderFill: { position: 'absolute', left: 0, height: 4, borderRadius: 2, backgroundColor: colors.neon },
  sliderTick: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: '#1A1E28', borderWidth: 2, borderColor: colors.bgDeep, marginLeft: -4 },
  sliderTickOn: { backgroundColor: colors.neon },
  sliderThumb: { position: 'absolute', width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', marginLeft: -12 },

  resetLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 14 },
  resetLinkTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.neon },

  card: { backgroundColor: '#10121A', borderWidth: 1, borderColor: '#1A1E28', borderRadius: 14, overflow: 'hidden' },
  divider: { marginVertical: 0, marginHorizontal: 16, height: 1, backgroundColor: 'rgba(26,30,40,0.6)' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  toggleIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.bgDeep, alignItems: 'center', justifyContent: 'center' },
  toggleTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink, marginBottom: 2 },
  toggleDesc: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.inkMute, lineHeight: 16 },

  resetFooter: { alignItems: 'center', marginVertical: 20 },
  resetAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#1A1E28', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16 },
  resetAllTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkMute },
});
