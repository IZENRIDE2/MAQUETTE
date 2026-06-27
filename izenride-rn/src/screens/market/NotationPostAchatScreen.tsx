import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { Check, X, Star, Mic, Send } from 'lucide-react-native';
import { Screen, Switch } from '@/components';
import { colors, fonts } from '@/theme';

const FEEDBACK: Record<number, { text: string; color: string }> = {
  0: { text: '', color: colors.ink },
  1: { text: 'Très décevant', color: colors.danger },
  2: { text: 'Décevant', color: '#E37B4A' },
  3: { text: 'Correct', color: colors.warn },
  4: { text: 'Très bien', color: '#A8D78A' },
  5: { text: 'Excellent — Je recommande !', color: colors.success },
};

const CRITERIA = [
  'Conforme à la description',
  'Envoi rapide',
  'Bon emballage',
  'Vendeur réactif',
  'Bon prix',
  'Article comme neuf',
];

/** Modal de notation post-achat (étoiles + critères + commentaire) — Paris. */
export default function NotationPostAchatScreen() {
  const [rating, setRating] = useState(5);
  const [selected, setSelected] = useState<number[]>([0, 1, 3]);
  const [comment, setComment] = useState('');

  const toggleCriteria = (i: number) =>
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  const fb = FEEDBACK[rating];

  return (
    <Screen scroll={false} pad={0} edges={['top']} style={{ justifyContent: 'flex-end' }}>
      <View style={styles.scrim} />
      <View style={styles.sheet}>
        <Pressable style={styles.closeBtn}>
          <X size={14} color="#E8EBF2" />
        </Pressable>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.pillSuccess}>
              <Check size={12} color={colors.success} />
              <Text style={styles.pillSuccessTxt}>Livré le 26 avril</Text>
            </View>
            <Text style={styles.title}>Comment s’est passé{'\n'}votre achat ?</Text>
            <Text style={styles.subtitle}>Votre avis aide la communauté IzenRide{'\n'}à choisir des vendeurs fiables.</Text>
          </View>

          {/* Order preview */}
          <View style={styles.orderCard}>
            <View style={styles.orderThumb}>
              <Text style={styles.orderGlyph}>🪖</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.orderTitle} numberOfLines={1}>
                Shoei NXR2 noir mat taille L
              </Text>
              <View style={styles.orderMeta}>
                <Text style={styles.orderMetaTxt}>Thomas L.</Text>
                <View style={styles.metaDot} />
                <Text style={styles.orderMetaTxt}>Cmd #4827</Text>
              </View>
            </View>
            <Text style={styles.orderPrice}>
              340<Text style={styles.orderCur}>€</Text>
            </Text>
          </View>

          {/* Stars */}
          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Touchez pour noter le vendeur</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((v) => (
                <Pressable key={v} onPress={() => setRating(v)} style={styles.starBtn}>
                  <Star
                    size={38}
                    color={v <= rating ? colors.warn : '#2A3545'}
                    fill={v <= rating ? colors.warn : '#2A3545'}
                  />
                </Pressable>
              ))}
            </View>
            <Text style={[styles.feedback, { color: fb.color }]}>{fb.text}</Text>
          </View>

          {/* Criteria */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Qu’est-ce qui s’est bien passé ?</Text>
            <Text style={styles.sectionHint}>Sélectionnez plusieurs critères (optionnel)</Text>
            <View style={styles.chips}>
              {CRITERIA.map((c, i) => {
                const on = selected.includes(i);
                return (
                  <Pressable key={c} onPress={() => toggleCriteria(i)} style={[styles.chip, on && styles.chipSel]}>
                    {on && (
                      <View style={styles.chipCheck}>
                        <Check size={8} color="#fff" strokeWidth={3} />
                      </View>
                    )}
                    <Text style={[styles.chipTxt, on && { color: colors.neon }]}>{c}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Comment */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Votre commentaire</Text>
            <Text style={styles.sectionHint}>Décrivez votre expérience (optionnel)</Text>
            <View style={styles.textareaWrap}>
              <TextInput
                value={comment}
                onChangeText={(t) => t.length <= 500 && setComment(t)}
                placeholder="Casque parfait, exactement comme décrit. Thomas a été très réactif et l'envoi a été ultra rapide..."
                placeholderTextColor={colors.inkMute}
                multiline
                style={styles.textarea}
              />
              <View style={styles.textareaFooter}>
                <Pressable style={styles.voiceBtn}>
                  <Mic size={12} color={colors.inkMute} />
                  <Text style={styles.voiceTxt}>Dicter</Text>
                </Pressable>
                <Text style={styles.charCount}>{comment.length} / 500</Text>
              </View>
            </View>
          </View>

          {/* Toggle public */}
          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.toggleTitle}>Avis public</Text>
              <Text style={styles.toggleDesc}>Visible sur le profil de Thomas L.</Text>
            </View>
            <Switch value />
          </View>

          {/* Actions */}
          <Pressable style={[styles.btn, styles.btnPrimary]}>
            <Send size={16} color="#fff" />
            <Text style={styles.btnPrimaryTxt}>Publier mon avis</Text>
          </Pressable>
          <Pressable style={styles.btnText}>
            <Text style={styles.btnTextTxt}>Plus tard</Text>
          </Pressable>
        </ScrollView>
      </View>
    </Screen>
  );
}

const PANEL = '#10121A';
const BORDER = '#1A1E28';

const styles = StyleSheet.create({
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.62)' },
  sheet: { backgroundColor: '#08090E', borderTopLeftRadius: 28, borderTopRightRadius: 28, borderTopWidth: 1, borderTopColor: BORDER, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, maxHeight: '92%' },
  handle: { width: 36, height: 4, backgroundColor: '#2A3545', borderRadius: 2, alignSelf: 'center', marginTop: 6, marginBottom: 18 },
  closeBtn: { position: 'absolute', top: 18, right: 18, width: 32, height: 32, borderRadius: 16, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center', zIndex: 10 },

  header: { alignItems: 'center', marginBottom: 22, paddingHorizontal: 20 },
  pillSuccess: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 5, backgroundColor: 'rgba(93,202,165,0.12)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.3)', borderRadius: 999, marginBottom: 14 },
  pillSuccessTxt: { fontFamily: fonts.semibold, fontSize: 11, color: colors.success, letterSpacing: 0.4, textTransform: 'uppercase' },
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.ink, textAlign: 'center', lineHeight: 28, marginBottom: 6 },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.inkMute, textAlign: 'center', lineHeight: 20 },

  orderCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 14, padding: 12, marginBottom: 24 },
  orderThumb: { width: 56, height: 56, borderRadius: 10, backgroundColor: '#14253a', alignItems: 'center', justifyContent: 'center' },
  orderGlyph: { fontSize: 28 },
  orderTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink, marginBottom: 4 },
  orderMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  orderMetaTxt: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#2A3545' },
  orderPrice: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  orderCur: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkMute },

  ratingSection: { alignItems: 'center', marginBottom: 26 },
  ratingLabel: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkMute, marginBottom: 14 },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  starBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  feedback: { fontFamily: fonts.semibold, fontSize: 14, height: 20 },

  section: { marginBottom: 24 },
  sectionLabel: { fontFamily: fonts.semibold, fontSize: 12, color: colors.ink, marginBottom: 4 },
  sectionHint: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 999 },
  chipSel: { backgroundColor: 'rgba(74,156,232,0.12)', borderColor: 'rgba(74,156,232,0.5)' },
  chipCheck: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center' },
  chipTxt: { fontFamily: fonts.medium, fontSize: 12, color: '#E8EBF2' },

  textareaWrap: { backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 14 },
  textarea: { minHeight: 92, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, fontFamily: fonts.regular, fontSize: 14, color: colors.ink, lineHeight: 20, textAlignVertical: 'top' },
  textareaFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 10 },
  voiceBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  voiceTxt: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute },
  charCount: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },

  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 14, marginBottom: 22 },
  toggleTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  toggleDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, lineHeight: 15 },

  btn: { height: 52, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnPrimary: { backgroundColor: colors.neon },
  btnPrimaryTxt: { fontFamily: fonts.semibold, fontSize: 15, color: '#fff' },
  btnText: { height: 44, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  btnTextTxt: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkMute },
});
