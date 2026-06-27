import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Calendar, Briefcase, Clock, Shield, Star, ArrowRight, Check } from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, radius } from '@/theme';

const pink = colors.danger;
const violet = colors.purple;

/** Filtres Match — bottom sheet de filtrage de découverte (localisé Paris). */
export default function MatchFiltersScreen() {
  return (
    <Screen scroll={false} pad={0} edges={['top', 'bottom']}>
      <View style={styles.head}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Filtres</Text>
          <Text style={styles.sub}>
            <Text style={styles.subNum}>128</Text> profils correspondent
          </Text>
        </View>
        <Text style={styles.reset}>Réinitialiser</Text>
      </View>

      <View style={styles.tabsWrap}>
        <View style={styles.tabs}>
          <View style={[styles.tab, styles.tabActive]}>
            <Heart size={13} color={pink} fill={pink} />
            <Text style={[styles.tabTxt, { color: colors.ink }]}>Match</Text>
          </View>
          <View style={styles.tab}>
            <Calendar size={13} color={colors.inkMute} />
            <Text style={styles.tabTxt}>Événements</Text>
          </View>
          <View style={styles.tab}>
            <Briefcase size={13} color={colors.inkMute} />
            <Text style={styles.tabTxt}>Pros</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 24 }}>
        <Group title="Je cherche" value="Femmes" valueColor={pink}>
          <View style={styles.row3}>
            <GenderPill label="Hommes" />
            <GenderPill label="Femmes" active />
            <GenderPill label="Tout" />
          </View>
        </Group>

        <Group title="Tranche d'âge" value="23 — 38 ans">
          <View style={styles.rangeDisplay}>
            <View>
              <Text style={styles.rangeLabel}>Min</Text>
              <Text style={styles.rangeValue}>
                23<Text style={styles.rangeUnit}> ans</Text>
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.rangeLabel}>Max</Text>
              <Text style={styles.rangeValue}>
                38<Text style={styles.rangeUnit}> ans</Text>
              </Text>
            </View>
          </View>
          <Slider fillColor={pink} left="22%" right="38%" handles={['22%', '62%']} />
        </Group>

        <Group title="Distance maximale" value="35 km" valueColor={violet}>
          <View style={styles.distRow}>
            <View style={styles.distDisplay}>
              <Text style={styles.distValue}>35</Text>
              <Text style={styles.distUnit}>km</Text>
            </View>
            <Slider fillColor={violet} left="0%" right="65%" handles={['35%']} />
          </View>
        </Group>

        <Group title="Style de moto" value="2 sélectionnés">
          <View style={styles.chips}>
            <Chip label="Routière" active />
            <Chip label="Sportive" />
            <Chip label="Trail" active />
            <Chip label="Cruiser" />
            <Chip label="Roadster" />
            <Chip label="Scooter" />
          </View>
        </Group>

        <Group title="Niveau de pratique" value="Intermédiaire +" valueColor={colors.success}>
          <View style={styles.segment}>
            <ExpPill label="Débutant" />
            <ExpPill label="Intermédiaire" active />
            <ExpPill label="Confirmé" active />
            <ExpPill label="Expert" active />
          </View>
        </Group>

        <Group title="Intention" value="2 sélectionnées" valueColor={violet}>
          <View style={styles.intentGrid}>
            <Intent icon={<Clock size={13} color={violet} />} label="Balades & amitiés" active />
            <Intent icon={<Heart size={13} color={violet} fill={violet} />} label="Plus si affinités" active />
            <Intent icon={<Briefcase size={13} color={colors.inkMute} />} label="Réseau pro" />
            <Intent icon={<Star size={13} color={colors.inkMute} />} label="Tout est ouvert" />
          </View>
        </Group>

        <Group title="Options avancées">
          <ToggleCard
            icon={<Shield size={13} color={colors.neon} />}
            title="Profils vérifiés uniquement"
            sub="Identité confirmée par badge bleu"
            on
          />
          <ToggleCard
            icon={<Star size={13} color={colors.warn} fill={colors.warn} />}
            title="En ligne récemment"
            pro
            sub="Actifs dans les 7 derniers jours"
          />
        </Group>
      </ScrollView>

      <View style={styles.cta}>
        <Pressable>
          <LinearGradient colors={[pink, violet]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.applyBtn}>
            <Text style={styles.applyTxt}>
              Voir <Text style={styles.applyCount}>128</Text> profils
            </Text>
            <ArrowRight size={15} color="#fff" strokeWidth={2.5} />
          </LinearGradient>
        </Pressable>
      </View>
    </Screen>
  );
}

function Group({ title, value, valueColor, children }: { title: string; value?: string; valueColor?: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <View style={styles.groupHead}>
        <Text style={styles.groupTitle}>{title}</Text>
        {value ? <Text style={[styles.groupValue, valueColor ? { color: valueColor } : null]}>{value}</Text> : null}
      </View>
      {children}
    </View>
  );
}

function GenderPill({ label, active }: { label: string; active?: boolean }) {
  return (
    <View style={[styles.gpill, active && styles.gpillActive]}>
      <Text style={[styles.gpillTxt, active && { color: pink }]}>{label}</Text>
    </View>
  );
}

function Slider({ fillColor, left, right, handles }: { fillColor: string; left: string; right: string; handles: string[] }) {
  return (
    <View style={styles.sliderTrack}>
      <View style={styles.track} />
      <View style={[styles.fill, { left: left as any, right: right as any, backgroundColor: fillColor }]} />
      {handles.map((h, i) => (
        <View key={i} style={[styles.handle, { left: h as any, borderColor: fillColor }]} />
      ))}
    </View>
  );
}

function Chip({ label, active }: { label: string; active?: boolean }) {
  return (
    <View style={[styles.chip, active && styles.chipActive]}>
      {active ? <Check size={12} color={colors.neon} strokeWidth={3} /> : null}
      <Text style={[styles.chipTxt, active && { color: colors.neon }]}>{label}</Text>
    </View>
  );
}

function ExpPill({ label, active }: { label: string; active?: boolean }) {
  return (
    <View style={[styles.expPill, active && styles.expPillActive]}>
      <Text style={[styles.expTxt, active && { color: colors.success }]}>{label}</Text>
    </View>
  );
}

function Intent({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <View style={[styles.intentCard, active && styles.intentCardActive]}>
      <View style={[styles.intentIcon, active && { backgroundColor: 'rgba(184,132,230,0.15)' }]}>{icon}</View>
      <Text style={[styles.intentName, active && { color: violet }]}>{label}</Text>
    </View>
  );
}

function ToggleCard({ icon, title, sub, on, pro }: { icon: React.ReactNode; title: string; sub: string; on?: boolean; pro?: boolean }) {
  return (
    <View style={[styles.toggleCard, pro && styles.toggleCardPremium]}>
      <View style={[styles.toggleIcon, pro && { backgroundColor: 'rgba(251,191,36,0.12)', borderColor: 'rgba(251,191,36,0.3)' }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <View style={styles.toggleTitleRow}>
          <Text style={styles.toggleTitle}>{title}</Text>
          {pro ? <Text style={styles.proTag}>Pro</Text> : null}
        </View>
        <Text style={styles.toggleSub}>{sub}</Text>
      </View>
      <View style={[styles.switch, on && styles.switchOn]}>
        <View style={[styles.knob, on && { transform: [{ translateX: 16 }] }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  sub: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginTop: 2 },
  subNum: { fontFamily: fonts.monoBold, color: pink },
  reset: { fontFamily: fonts.semibold, fontSize: 12, color: pink },

  tabsWrap: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.line },
  tabs: { flexDirection: 'row', gap: 4, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, padding: 4, borderRadius: 11 },
  tab: { flex: 1, height: 32, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  tabActive: { backgroundColor: '#181C26' },
  tabTxt: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkMute },

  groupHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 },
  groupTitle: { fontFamily: fonts.bold, fontSize: 11, color: colors.inkDim, letterSpacing: 1.2, textTransform: 'uppercase' },
  groupValue: { fontFamily: fonts.monoBold, fontSize: 12, color: colors.ink },

  row3: { flexDirection: 'row', gap: 6 },
  gpill: { flex: 1, height: 42, backgroundColor: colors.bg2, borderWidth: 1.5, borderColor: colors.line, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  gpillActive: { backgroundColor: 'rgba(255,92,122,0.08)', borderColor: pink },
  gpillTxt: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.inkDim },

  rangeDisplay: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  rangeLabel: { fontFamily: fonts.semibold, fontSize: 9.5, color: colors.inkMute, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 3 },
  rangeValue: { fontFamily: fonts.monoBold, fontSize: 22, color: colors.ink },
  rangeUnit: { fontFamily: fonts.semibold, fontSize: 13, color: colors.inkDim },

  distRow: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 13, padding: 14 },
  distDisplay: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 6, marginBottom: 8 },
  distValue: { fontFamily: fonts.monoBold, fontSize: 22, color: violet },
  distUnit: { fontFamily: fonts.semibold, fontSize: 13, color: colors.inkDim },

  sliderTrack: { height: 28, justifyContent: 'center', marginBottom: 4 },
  track: { position: 'absolute', left: 0, right: 0, height: 4, backgroundColor: colors.line, borderRadius: 2 },
  fill: { position: 'absolute', height: 4, borderRadius: 2 },
  handle: { position: 'absolute', width: 22, height: 22, marginLeft: -11, backgroundColor: colors.ink, borderRadius: 11, borderWidth: 1.5 },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill },
  chipActive: { backgroundColor: 'rgba(77,143,255,0.08)', borderColor: colors.neon },
  chipTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkDim },

  segment: { flexDirection: 'row', gap: 4, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 11, padding: 4 },
  expPill: { flex: 1, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  expPillActive: { backgroundColor: 'rgba(74,222,128,0.12)' },
  expTxt: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkMute },

  intentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  intentCard: { width: '48.5%', flexDirection: 'row', alignItems: 'center', gap: 9, padding: 10, backgroundColor: colors.bg2, borderWidth: 1.5, borderColor: colors.line, borderRadius: 12 },
  intentCardActive: { backgroundColor: 'rgba(184,132,230,0.08)', borderColor: violet },
  intentIcon: { width: 26, height: 26, borderRadius: 8, backgroundColor: '#181C26', alignItems: 'center', justifyContent: 'center' },
  intentName: { flex: 1, fontFamily: fonts.semibold, fontSize: 11.5, color: colors.ink },

  toggleCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 13, padding: 12, marginBottom: 8 },
  toggleCardPremium: { borderColor: 'rgba(251,191,36,0.2)' },
  toggleIcon: { width: 30, height: 30, borderRadius: 9, backgroundColor: 'rgba(77,143,255,0.12)', borderWidth: 1, borderColor: 'rgba(77,143,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  toggleTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  toggleTitle: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.ink },
  proTag: { fontFamily: fonts.monoBold, fontSize: 8.5, color: colors.bg, backgroundColor: colors.warn, paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4, overflow: 'hidden', textTransform: 'uppercase' },
  toggleSub: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute, marginTop: 1 },
  switch: { width: 38, height: 22, borderRadius: 11, backgroundColor: colors.line, padding: 2, justifyContent: 'center' },
  switchOn: { backgroundColor: colors.success },
  knob: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.inkMute },

  cta: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.bgDeep },
  applyBtn: { height: 50, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  applyTxt: { fontFamily: fonts.bold, fontSize: 14.5, color: '#fff' },
  applyCount: { fontFamily: fonts.monoBold },
});
