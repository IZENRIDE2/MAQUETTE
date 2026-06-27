import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MapPin, Search, Users, Bike, Zap, Calendar, Check, X, Shield, BadgeCheck, Clock, Star, ChevronRight } from 'lucide-react-native';
import { Screen, AppBar } from '@/components';
import { colors, fonts } from '@/theme';

const violet = colors.purple;
const gold = colors.warn;

/** Filtres de matching — page de filtres riders (localisé Paris / IDF). */
export default function FiltresDeMatchingScreen() {
  return (
    <Screen scroll={false} pad={0} edges={['top', 'bottom']}>
      <View style={{ paddingHorizontal: 16 }}>
        <AppBar title="Filtres de matching" right={<Text style={styles.reset}>Réinitialiser</Text>} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Pill résultats */}
        <View style={styles.resultsPill}>
          <View style={styles.resultsIcon}>
            <Search size={16} color={colors.neon} strokeWidth={2.3} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.resultsCount}>
              142<Text style={styles.resultsUnit}> motards correspondent</Text>
            </Text>
            <Text style={styles.resultsLabel}>
              à vos critères dans un rayon de <Text style={styles.resultsStrong}>40 km</Text>
            </Text>
          </View>
        </View>

        {/* Distance */}
        <Section icon={<MapPin size={11} color={colors.neon} strokeWidth={2.2} />} iconBg="rgba(77,143,255,0.12)" title="Distance" value="2 → 40 km">
          <DoubleSlider fill1={colors.neon} fill2={violet} left="8%" right="35%" handleLeft="8%" handleRight="65%" colorL={colors.neon} colorR={violet} marks={['0', '25', '50', '75', '100+']} />
        </Section>

        {/* Âge */}
        <Section icon={<Users size={11} color={violet} strokeWidth={2.2} />} iconBg="rgba(184,132,230,0.12)" title="Âge" value="25 → 42 ans" valueColor={violet}>
          <DoubleSlider fill1={violet} fill2={colors.neon} left="12%" right="28%" handleLeft="12%" handleRight="72%" colorL={violet} colorR={colors.neon} marks={['18', '30', '45', '60', '65+']} />
        </Section>

        {/* Type de moto */}
        <Section icon={<Bike size={11} color={colors.success} strokeWidth={2.2} />} iconBg="rgba(74,222,128,0.12)" title="Type de moto" value="3 sélectionnés" valueColor={colors.success}>
          <View style={styles.motoGrid}>
            {[
              { g: '🏍️', l: 'Roadster', sel: true },
              { g: '🏁', l: 'Sportive' },
              { g: '⛰️', l: 'Trail', sel: true },
              { g: '🛵', l: 'Custom' },
              { g: '🛣️', l: 'GT', sel: true },
              { g: '⚡', l: 'Électrique' },
              { g: '🌿', l: 'Cross' },
              { g: '🔧', l: 'Vintage' },
            ].map((m) => (
              <View key={m.l} style={[styles.motoCard, m.sel && styles.motoCardSel]}>
                {m.sel ? (
                  <View style={styles.motoCheck}>
                    <Check size={9} color="#fff" strokeWidth={3} />
                  </View>
                ) : null}
                <Text style={styles.motoGlyph}>{m.g}</Text>
                <Text style={[styles.motoLabel, m.sel && { color: colors.ink }]}>{m.l}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* Niveau */}
        <Section icon={<Zap size={11} color={gold} strokeWidth={2.2} />} iconBg="rgba(251,191,36,0.12)" title="Niveau d'expérience" value="Intermédiaire+">
          <View style={styles.levelSeg}>
            <LevelBtn label="Débutant" />
            <LevelBtn label="Intermédiaire" active />
            <LevelBtn label="Confirmé" active />
            <LevelBtn label="Expert" />
          </View>
        </Section>

        {/* Fréquence */}
        <Section icon={<Calendar size={11} color={violet} strokeWidth={2.2} />} iconBg="rgba(184,132,230,0.12)" title="Fréquence de sortie" value="2 sélectionnés" valueColor={violet}>
          <View style={styles.freqPills}>
            <FreqPill label="Occasionnel" />
            <FreqPill label="Tous les week-ends" selected />
            <FreqPill label="Plusieurs fois / semaine" selected />
            <FreqPill label="Quotidien (trajet pro)" />
            <FreqPill label="Événements / road trips" />
          </View>
        </Section>

        {/* Préférences */}
        <Section icon={<Check size={11} color={colors.success} strokeWidth={2.2} />} iconBg="rgba(74,222,128,0.12)" title="Préférences">
          <View style={styles.toggleCard}>
            <ToggleRow icon={<Shield size={14} color={colors.success} />} iconBg="rgba(74,222,128,0.12)" title="Profils vérifiés uniquement" desc="Identité confirmée par IzenRide" />
            <ToggleRow icon={<BadgeCheck size={14} color={colors.success} />} iconBg="rgba(74,222,128,0.12)" title="A déjà roulé en groupe" desc="Au moins 1 sortie groupe enregistrée" />
            <ToggleRow icon={<Clock size={14} color={gold} />} iconBg="rgba(251,191,36,0.12)" title="Actifs récemment" desc="Connectés dans les 30 derniers jours" last />
          </View>
        </Section>

        {/* Premium */}
        <Pressable style={styles.premiumCard}>
          <View style={styles.premiumIcon}>
            <Star size={16} color="#1a1408" fill="#1a1408" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.premiumTitleRow}>
              <Text style={styles.premiumTitle}>Filtres avancés</Text>
              <Text style={styles.premiumPro}>PRO</Text>
            </View>
            <Text style={styles.premiumDesc}>Cylindrée · marque · gabarit moto · style de roulage…</Text>
          </View>
          <ChevronRight size={14} color={gold} strokeWidth={2.5} />
        </Pressable>

        {/* Reset banner */}
        <Pressable style={styles.resetBanner}>
          <View style={styles.resetIcon}>
            <Clock size={14} color={colors.danger} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.resetTitle}>Réinitialiser tous les filtres</Text>
            <Text style={styles.resetDesc}>Revenir aux paramètres par défaut</Text>
          </View>
          <ChevronRight size={14} color={colors.inkMute} />
        </Pressable>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.secondaryBtn}>
          <X size={14} color={colors.ink} />
          <Text style={styles.secondaryTxt}>Annuler</Text>
        </Pressable>
        <Pressable style={styles.primaryBtn}>
          <Text style={styles.primaryTxt}>Voir</Text>
          <Text style={styles.countPill}>142 motards</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

function Section({ icon, iconBg, title, value, valueColor, children }: { icon: React.ReactNode; iconBg: string; title: string; value?: string; valueColor?: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <View style={styles.sectionTitleRow}>
          <View style={[styles.sectionIcon, { backgroundColor: iconBg }]}>{icon}</View>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {value ? <Text style={[styles.sectionValue, valueColor ? { color: valueColor } : null]}>{value}</Text> : null}
      </View>
      {children}
    </View>
  );
}

function DoubleSlider({ fill1, fill2, left, right, handleLeft, handleRight, colorL, colorR, marks }: { fill1: string; fill2: string; left: string; right: string; handleLeft: string; handleRight: string; colorL: string; colorR: string; marks: string[] }) {
  return (
    <View style={{ paddingTop: 10 }}>
      <View style={styles.sliderBg}>
        <View style={[styles.sliderFill, { left: left as any, right: right as any, backgroundColor: fill1 }]} />
        <View style={[styles.sliderHandle, { left: handleLeft as any, borderColor: colorL }]} />
        <View style={[styles.sliderHandle, { left: handleRight as any, borderColor: colorR }]} />
      </View>
      <View style={styles.sliderMarks}>
        {marks.map((m) => (
          <Text key={m} style={styles.markTxt}>{m}</Text>
        ))}
      </View>
    </View>
  );
}

function LevelBtn({ label, active }: { label: string; active?: boolean }) {
  return (
    <View style={[styles.levelBtn, active && styles.levelBtnActive]}>
      <Text style={[styles.levelTxt, active && { color: colors.ink, fontFamily: fonts.semibold }]}>{label}</Text>
    </View>
  );
}

function FreqPill({ label, selected }: { label: string; selected?: boolean }) {
  return (
    <View style={[styles.freqPill, selected && styles.freqPillSel]}>
      {selected ? <Check size={10} color={violet} strokeWidth={3} /> : null}
      <Text style={[styles.freqTxt, selected && { color: violet }]}>{label}</Text>
    </View>
  );
}

function ToggleRow({ icon, iconBg, title, desc, last }: { icon: React.ReactNode; iconBg: string; title: string; desc: string; last?: boolean }) {
  return (
    <View style={[styles.toggleRow, !last && { borderBottomWidth: 1, borderBottomColor: colors.line }]}>
      <View style={[styles.toggleIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleDesc}>{desc}</Text>
      </View>
      <View style={[styles.switch, styles.switchOn]}>
        <View style={[styles.knob, { transform: [{ translateX: 18 }] }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  reset: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkMute },

  resultsPill: { marginHorizontal: 16, marginTop: 4, padding: 12, backgroundColor: colors.bg2, borderWidth: 1, borderColor: 'rgba(77,143,255,0.25)', borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  resultsIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(77,143,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  resultsCount: { fontFamily: fonts.monoBold, fontSize: 22, color: colors.ink },
  resultsUnit: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute },
  resultsLabel: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginTop: 3 },
  resultsStrong: { fontFamily: fonts.semibold, color: colors.inkDim },

  section: { paddingHorizontal: 16, paddingTop: 22 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionIcon: { width: 22, height: 22, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  sectionValue: { fontFamily: fonts.monoBold, fontSize: 13, color: colors.neon },

  sliderBg: { height: 6, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 4, marginBottom: 14, justifyContent: 'center' },
  sliderFill: { position: 'absolute', top: -1, bottom: -1, borderRadius: 4 },
  sliderHandle: { position: 'absolute', width: 22, height: 22, marginLeft: -11, backgroundColor: colors.ink, borderWidth: 3, borderRadius: 11 },
  sliderMarks: { flexDirection: 'row', justifyContent: 'space-between' },
  markTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },

  motoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  motoCard: { width: '22.7%', paddingVertical: 12, backgroundColor: colors.bg2, borderWidth: 1.5, borderColor: colors.line, borderRadius: 12, alignItems: 'center' },
  motoCardSel: { backgroundColor: 'rgba(77,143,255,0.08)', borderColor: colors.neon },
  motoCheck: { position: 'absolute', top: 0, right: 0, width: 18, height: 18, backgroundColor: colors.neon, borderTopRightRadius: 11, borderBottomLeftRadius: 11, alignItems: 'center', justifyContent: 'center' },
  motoGlyph: { fontSize: 26, marginBottom: 6 },
  motoLabel: { fontFamily: fonts.medium, fontSize: 10, color: colors.inkDim },

  levelSeg: { flexDirection: 'row', gap: 2, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 12, padding: 4 },
  levelBtn: { flex: 1, height: 38, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  levelBtnActive: { backgroundColor: colors.bgDeep },
  levelTxt: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkMute },

  freqPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  freqPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: colors.bg2, borderWidth: 1.5, borderColor: colors.line, borderRadius: 999 },
  freqPillSel: { backgroundColor: 'rgba(184,132,230,0.1)', borderColor: violet },
  freqTxt: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkDim },

  toggleCard: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 14, overflow: 'hidden' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  toggleIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  toggleTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  toggleDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute },
  switch: { width: 44, height: 26, borderRadius: 13, backgroundColor: colors.line, padding: 2, justifyContent: 'center' },
  switchOn: { backgroundColor: colors.neon },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' },

  premiumCard: { marginHorizontal: 16, marginTop: 22, padding: 14, backgroundColor: colors.bg2, borderWidth: 1, borderColor: 'rgba(251,191,36,0.25)', borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  premiumIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: gold, alignItems: 'center', justifyContent: 'center' },
  premiumTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  premiumTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  premiumPro: { fontFamily: fonts.monoBold, fontSize: 8, color: '#1a1408', backgroundColor: gold, paddingHorizontal: 5, paddingVertical: 1, borderRadius: 3, overflow: 'hidden' },
  premiumDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute },

  resetBanner: { marginHorizontal: 16, marginTop: 12, padding: 12, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.lineStrong, borderStyle: 'dashed', borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  resetIcon: { width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(255,92,122,0.1)', alignItems: 'center', justifyContent: 'center' },
  resetTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  resetDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute },

  bottomBar: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, backgroundColor: 'rgba(8,9,14,0.96)', borderTopWidth: 1, borderTopColor: colors.line },
  secondaryBtn: { flex: 1, height: 50, borderRadius: 14, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  secondaryTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  primaryBtn: { flex: 2, height: 50, borderRadius: 14, backgroundColor: colors.neon, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
  countPill: { fontFamily: fonts.mono, fontSize: 11, color: '#fff', backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, overflow: 'hidden' },
});
