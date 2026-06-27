import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bike,
  Box,
  Image as ImageIcon,
  Star,
  Check,
  Calendar,
  Circle,
  Plus,
} from 'lucide-react-native';
import { Screen, Switch } from '@/components';
import { colors, fonts, radius, shadow } from '@/theme';

const TYPES = [
  { glyph: '🏍️', label: 'Roadster' },
  { glyph: '🏁', label: 'Sportive' },
  { glyph: '⛰️', label: 'Trail' },
  { glyph: '🛵', label: 'Custom' },
  { glyph: '🛣️', label: 'GT' },
  { glyph: '⚡', label: 'Électrique' },
  { glyph: '🌿', label: 'Cross' },
  { glyph: '🔧', label: 'Vintage' },
];

const BRANDS = ['Yamaha', 'Honda', 'Kawasaki', 'BMW', 'Suzuki'];

/** Ajouter une autre moto — profil multi-motos (étape 2/3). */
export default function AjouterUneAutreMotoScreen() {
  const [type, setType] = useState(1);
  const [brand, setBrand] = useState('Yamaha');

  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Top nav */}
      <View style={styles.topnav}>
        <Pressable>
          <Text style={styles.cancel}>Annuler</Text>
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.navTitle}>Ajouter une moto</Text>
          <Text style={styles.navSub}>2ᵉ moto · profil multi-motos</Text>
        </View>
        <Pressable style={styles.addBtn}>
          <Text style={styles.addBtnTxt}>Ajouter</Text>
        </Pressable>
      </View>

      {/* Step progress */}
      <View style={styles.stepBar}>
        <View style={styles.stepRow}>
          <Text style={styles.stepLabel}>
            Étape <Text style={styles.stepStrong}>2</Text> sur 3 · Caractéristiques
          </Text>
          <Text style={styles.stepPct}>66%</Text>
        </View>
        <View style={styles.stepTrack}>
          <View style={[styles.stepSeg, { backgroundColor: colors.success }]} />
          <LinearGradient colors={[colors.neon, colors.purple]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.stepSeg} />
          <View style={[styles.stepSeg, { backgroundColor: colors.bg2 }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Garage */}
        <View style={styles.existing}>
          <View style={styles.existingHead}>
            <Text style={styles.existingTitle}>MON GARAGE</Text>
            <Text style={styles.existingMeta}>1 + 1 en cours</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            <View style={styles.motoThumb}>
              <View style={styles.tag}>
                <Star size={7} color="#1a1408" fill="#1a1408" />
                <Text style={styles.tagTxt}>Principale</Text>
              </View>
              <View style={styles.thumbImg}>
                <Text style={styles.thumbEmoji}>🏍️</Text>
              </View>
              <View style={styles.thumbInfo}>
                <Text style={styles.thumbName} numberOfLines={1}>BMW R 1250 GS</Text>
                <Text style={styles.thumbMeta}>1254 cc · Trail · 2024</Text>
              </View>
            </View>
            <View style={[styles.motoThumb, styles.motoThumbAdding]}>
              <View style={[styles.thumbImg, { backgroundColor: 'transparent' }]}>
                <Text style={[styles.thumbEmoji, { opacity: 0.5 }]}>🏁</Text>
              </View>
              <View style={styles.thumbInfo}>
                <Text style={[styles.thumbName, { color: colors.neon }]} numberOfLines={1}>Yamaha R6</Text>
                <Text style={styles.thumbMeta}>en cours d'ajout…</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Type */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionIcon, { backgroundColor: 'rgba(74,222,128,0.12)' }]}>
                <Bike size={12} color={colors.success} />
              </View>
              <Text style={styles.sectionTitle}>Type</Text>
            </View>
            <Text style={[styles.sectionHelp, { color: colors.warn }]}>requis</Text>
          </View>
          <View style={styles.typeGrid}>
            {TYPES.map((t, i) => {
              const sel = type === i;
              return (
                <Pressable key={t.label} onPress={() => setType(i)} style={[styles.typeCard, sel && styles.typeCardSel]}>
                  {sel && (
                    <View style={styles.typeCheck}>
                      <Check size={9} color="#fff" strokeWidth={3} />
                    </View>
                  )}
                  <Text style={styles.typeGlyph}>{t.glyph}</Text>
                  <Text style={styles.typeLabel}>{t.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Marque & modèle */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionIcon, { backgroundColor: 'rgba(77,143,255,0.12)' }]}>
                <Box size={12} color={colors.neon} />
              </View>
              <Text style={styles.sectionTitle}>Marque & modèle</Text>
            </View>
          </View>

          <View style={styles.field}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>MARQUE</Text>
              <Text style={styles.fieldMeta}>✓ détectée</Text>
            </View>
            <View style={[styles.input, styles.inputOk]}>
              <Check size={14} color={colors.success} />
              <Text style={styles.inputValue}>{brand}</Text>
            </View>
            <View style={styles.chips}>
              {BRANDS.map((b) => (
                <Pressable key={b} onPress={() => setBrand(b)} style={[styles.chip, brand === b && styles.chipOn]}>
                  <Text style={[styles.chipTxt, brand === b && { color: colors.neon }]}>{b}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.field}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>MODÈLE</Text>
              <Text style={styles.fieldMeta}>✓ catalogue 2024</Text>
            </View>
            <View style={[styles.input, styles.inputOk]}>
              <Check size={14} color={colors.success} />
              <Text style={styles.inputValue}>YZF-R6</Text>
            </View>
          </View>

          <View style={styles.row2}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>ANNÉE</Text>
              <View style={[styles.input, styles.inputOk]}>
                <Calendar size={14} color={colors.success} />
                <Text style={styles.inputValue}>2019</Text>
              </View>
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>CYLINDRÉE</Text>
              <View style={[styles.input, styles.inputOk]}>
                <Circle size={14} color={colors.success} />
                <Text style={[styles.inputValue, { flex: 1 }]}>599</Text>
                <Text style={styles.inputSuffix}>CC</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Photos */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionIcon, { backgroundColor: 'rgba(184,132,230,0.12)' }]}>
                <ImageIcon size={12} color={colors.purple} />
              </View>
              <Text style={styles.sectionTitle}>Photos · 1 / 3</Text>
            </View>
            <Text style={styles.sectionHelp}>facultatif</Text>
          </View>
          <View style={styles.photoRow}>
            <View style={styles.photoFilled}>
              <Text style={styles.photoEmoji}>🏁</Text>
            </View>
            {[0, 1].map((i) => (
              <Pressable key={i} style={styles.photoSlot}>
                <Plus size={18} color={colors.inkMute} />
                <Text style={styles.addTxt}>AJOUTER</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Statut */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionIcon, { backgroundColor: 'rgba(251,191,36,0.12)' }]}>
                <Star size={12} color={colors.warn} />
              </View>
              <Text style={styles.sectionTitle}>Statut</Text>
            </View>
          </View>
          <View style={styles.mainToggle}>
            <View style={styles.toggleIcon}>
              <Star size={16} color="#1a1408" fill="#1a1408" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>Définir comme moto principale</Text>
              <Text style={styles.toggleDesc}>
                Affichée <Text style={{ color: colors.ink, fontFamily: fonts.semibold }}>en premier</Text> sur votre profil · matchs basés sur elle.
              </Text>
            </View>
            <Switch />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topnav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  cancel: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkDim },
  navTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  navSub: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, marginTop: 1 },
  addBtn: { backgroundColor: colors.neon, borderRadius: 9, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnTxt: { fontFamily: fonts.bold, fontSize: 12, color: '#fff' },

  stepBar: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  stepRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 },
  stepLabel: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase' },
  stepStrong: { color: colors.ink, fontFamily: fonts.monoBold },
  stepPct: { fontFamily: fonts.monoBold, fontSize: 13, color: colors.neon },
  stepTrack: { flexDirection: 'row', gap: 3, height: 4 },
  stepSeg: { flex: 1, height: 4, borderRadius: 2 },

  content: { paddingBottom: 40 },

  existing: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  existingHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  existingTitle: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute, letterSpacing: 1 },
  existingMeta: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },
  motoThumb: { width: 130, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 12, overflow: 'hidden' },
  motoThumbAdding: { borderWidth: 2, borderColor: colors.neon, borderStyle: 'dashed', backgroundColor: 'rgba(77,143,255,0.04)' },
  tag: { position: 'absolute', top: 6, left: 6, zIndex: 2, flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: colors.warn },
  tagTxt: { fontFamily: fonts.monoBold, fontSize: 8, color: '#1a1408', textTransform: 'uppercase' },
  thumbImg: { height: 60, backgroundColor: '#14182a', alignItems: 'center', justifyContent: 'center' },
  thumbEmoji: { fontSize: 28 },
  thumbInfo: { padding: 9 },
  thumbName: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink, marginBottom: 2 },
  thumbMeta: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },

  section: { paddingHorizontal: 14, paddingTop: 18 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionIcon: { width: 22, height: 22, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  sectionHelp: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },

  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  typeCard: { width: '23.5%', paddingVertical: 9, alignItems: 'center', backgroundColor: colors.bg2, borderWidth: 1.5, borderColor: colors.line, borderRadius: 11 },
  typeCardSel: { backgroundColor: 'rgba(74,222,128,0.08)', borderColor: colors.success },
  typeCheck: { position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  typeGlyph: { fontSize: 22, marginBottom: 4 },
  typeLabel: { fontFamily: fonts.semibold, fontSize: 9, color: colors.ink },

  field: { marginBottom: 10 },
  fieldLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 },
  fieldLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, letterSpacing: 0.4, marginBottom: 5 },
  fieldMeta: { fontFamily: fonts.semibold, fontSize: 9, color: colors.success },
  input: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.bg2, borderWidth: 1.5, borderColor: colors.line, borderRadius: 11, paddingHorizontal: 12, height: 44 },
  inputOk: { borderColor: 'rgba(74,222,128,0.3)' },
  inputValue: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
  inputSuffix: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },
  row2: { flexDirection: 'row', gap: 8 },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line },
  chipOn: { backgroundColor: 'rgba(77,143,255,0.08)', borderColor: colors.neon },
  chipTxt: { fontFamily: fonts.medium, fontSize: 10, color: colors.ink },

  photoRow: { flexDirection: 'row', gap: 6 },
  photoFilled: { flex: 1, aspectRatio: 4 / 3, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.izenDeep },
  photoEmoji: { fontSize: 28, opacity: 0.7 },
  photoSlot: { flex: 1, aspectRatio: 4 / 3, borderRadius: 11, backgroundColor: colors.bg2, borderWidth: 1.5, borderColor: colors.inkMute, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 4 },
  addTxt: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },

  mainToggle: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: colors.bg2, borderWidth: 1, borderColor: 'rgba(251,191,36,0.25)', borderRadius: 14 },
  toggleIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.warn, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  toggleTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  toggleDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, lineHeight: 15 },
});
