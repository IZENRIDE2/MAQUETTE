import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Image as ImageIcon,
  Edit3,
  TrendingUp,
  Zap,
  Plus,
  Check,
  Shield,
  Info,
} from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, radius, shadow } from '@/theme';

const INTERESTS = [
  { label: '🏔️ Cols & corniches', on: true },
  { label: '🌿 Trail technique', on: true },
  { label: '👥 Petits groupes', on: true },
  { label: '🏁 Circuit', on: false },
  { label: '🛣️ Routes sinueuses', on: true },
  { label: '📸 Pauses photo', on: false },
  { label: '☕ Café au sommet', on: true },
  { label: '🏕️ Bivouac', on: false },
  { label: '🌍 Road trip', on: false },
  { label: '🔧 Mécanique', on: false },
];

const LEVELS = ['Débutant', 'Intermédiaire', 'Confirmé', 'Expert'];

const PHOTOS = [
  { glyph: '🏔️', cover: true },
  { glyph: '🌅' },
  { glyph: '🏍️' },
  { glyph: '🛣️' },
];

/** Édition profil — photos, bio, centres d'intérêt, niveau (localisé Paris). */
export default function EditionProfilScreen() {
  const [level, setLevel] = useState(2);
  const [interests, setInterests] = useState(INTERESTS.map((i) => i.on));

  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Top nav */}
      <View style={styles.topnav}>
        <Pressable>
          <Text style={styles.cancel}>Annuler</Text>
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.navTitle}>Modifier mon profil</Text>
          <View style={styles.row6}>
            <View style={styles.unsavedDot} />
            <Text style={styles.navSub}>Modifications non enregistrées</Text>
          </View>
        </View>
        <Pressable style={styles.saveBtn}>
          <Text style={styles.saveTxt}>Enregistrer</Text>
        </Pressable>
      </View>

      {/* Score bar */}
      <View style={styles.scoreBar}>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>
            Profil <Text style={styles.scoreStrong}>76 %</Text> complet
          </Text>
          <Text style={styles.scorePct}>+24% à gagner</Text>
        </View>
        <View style={styles.scoreTrack}>
          <LinearGradient
            colors={[colors.neon, colors.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.scoreFill, { width: '76%' }]}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* PHOTOS */}
        <SectionHead
          icon={<ImageIcon size={12} color={colors.neon} />}
          bg="rgba(77,143,255,0.12)"
          title="Photos · 4 / 6"
          help="Maintenir pour réordonner"
        />
        <View style={styles.photosGrid}>
          {PHOTOS.map((p, i) => (
            <View key={i} style={styles.photoCell}>
              <Text style={styles.photoGlyph}>{p.glyph}</Text>
              {p.cover && (
                <View style={styles.coverBadge}>
                  <Text style={styles.coverTxt}>COUV.</Text>
                </View>
              )}
              <View style={styles.orderBadge}>
                <Text style={styles.orderTxt}>{i + 1}</Text>
              </View>
            </View>
          ))}
          {[0, 1].map((i) => (
            <Pressable key={`add${i}`} style={styles.photoAdd}>
              <Plus size={22} color={colors.inkMute} />
              <Text style={styles.addTxt}>AJOUTER</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.hint}>
          <Info size={12} color={colors.neon} />
          <Text style={styles.hintTxt}>
            La <Text style={styles.hintStrong}>première photo</Text> est votre image de couverture.
          </Text>
        </View>

        {/* BIO */}
        <SectionHead
          icon={<Edit3 size={12} color={colors.purple} />}
          bg="rgba(184,132,230,0.12)"
          title="À propos"
          help="Min. 50 caractères"
        />
        <View style={styles.bioWrap}>
          <Text style={styles.bioText}>
            Ingénieur le jour, motard le week-end. Toujours partant pour découvrir de nouvelles
            routes, en solo ou petit groupe. Préférence pour les cols, les trails techniques et les
            sorties d'une journée.
          </Text>
          <View style={styles.bioFoot}>
            <View style={styles.row4}>
              <Check size={10} color={colors.inkMute} />
              <Text style={styles.bioFootTxt}>Visible publiquement</Text>
            </View>
            <Text style={styles.bioCounter}>
              <Text style={{ color: colors.ink }}>218</Text> / 500
            </Text>
          </View>
        </View>

        {/* INTÉRÊTS */}
        <SectionHead
          icon={<TrendingUp size={12} color={colors.success} />}
          bg="rgba(74,222,128,0.12)"
          title="Centres d'intérêt · 5 / 8"
          help="Sélectionnez jusqu'à 8"
        />
        <Text style={styles.interestHelp}>
          Ce que vous aimez faire en moto · aide à trouver des riders compatibles.
        </Text>
        <View style={styles.pills}>
          {INTERESTS.map((it, i) => {
            const on = interests[i];
            return (
              <Pressable
                key={it.label}
                onPress={() => setInterests((p) => p.map((v, j) => (j === i ? !v : v)))}
                style={[styles.pill, on && styles.pillOn]}
              >
                {on && (
                  <View style={styles.pillCheck}>
                    <Check size={7} color="#fff" strokeWidth={3} />
                  </View>
                )}
                <Text style={[styles.pillTxt, on && { color: colors.neon }]}>{it.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* NIVEAU */}
        <SectionHead
          icon={<Zap size={12} color={colors.warn} />}
          bg="rgba(251,191,36,0.12)"
          title="Niveau d'expérience"
          help="Honnête, pas de jugement"
        />
        <View style={styles.segment}>
          {LEVELS.map((lbl, i) => {
            const active = level === i;
            return (
              <Pressable
                key={lbl}
                onPress={() => setLevel(i)}
                style={[styles.levelBtn, active && styles.levelBtnActive]}
              >
                <View style={styles.bars}>
                  {[5, 8, 11, 14].map((h, b) => (
                    <View
                      key={b}
                      style={[
                        styles.bar,
                        { height: h },
                        active && b <= i && { backgroundColor: colors.success },
                      ]}
                    />
                  ))}
                </View>
                <Text
                  style={[styles.levelLbl, active && { color: colors.ink, fontFamily: fonts.bold }]}
                >
                  {lbl}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.levelMeta}>
          <View style={styles.levelMetaIc}>
            <Shield size={11} color={colors.success} />
          </View>
          <Text style={styles.levelMetaTxt}>
            Niveau{' '}
            <Text style={{ color: colors.ink, fontFamily: fonts.semibold }}>auto-validé</Text> par
            votre activité IzenRide <Text style={styles.levelMetaEm}>· 12 480 km</Text>
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

function SectionHead({
  icon,
  bg,
  title,
  help,
}: {
  icon: React.ReactNode;
  bg: string;
  title: string;
  help: string;
}) {
  return (
    <View style={styles.sectionHead}>
      <View style={styles.sectionTitleRow}>
        <View style={[styles.sectionIcon, { backgroundColor: bg }]}>{icon}</View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionHelp}>{help}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topnav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  cancel: { fontFamily: fonts.medium, fontSize: 14, color: colors.inkDim },
  navTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  row6: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  unsavedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  navSub: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },
  saveBtn: { backgroundColor: colors.neon, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7 },
  saveTxt: { fontFamily: fonts.bold, fontSize: 13, color: '#fff' },

  scoreBar: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 },
  scoreLabel: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase' },
  scoreStrong: { color: colors.ink, fontFamily: fonts.monoBold },
  scorePct: { fontFamily: fonts.monoBold, fontSize: 13, color: colors.neon },
  scoreTrack: { height: 4, borderRadius: 2, backgroundColor: colors.bg2, overflow: 'hidden' },
  scoreFill: { height: 4, borderRadius: 2 },

  content: { paddingHorizontal: 14, paddingTop: 16, paddingBottom: 40 },

  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 18 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionIcon: { width: 22, height: 22, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  sectionHelp: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },

  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  photoCell: { width: '31.7%', aspectRatio: 4 / 5, borderRadius: 12, backgroundColor: colors.izenDeep, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  photoGlyph: { fontSize: 38, opacity: 0.7 },
  coverBadge: { position: 'absolute', top: 5, left: 5, backgroundColor: colors.neon, borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3 },
  coverTxt: { fontFamily: fonts.monoBold, fontSize: 9, color: '#fff' },
  orderBadge: { position: 'absolute', bottom: 5, left: 5, width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(8,9,14,0.85)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  orderTxt: { fontFamily: fonts.monoBold, fontSize: 9, color: colors.ink },
  photoAdd: { width: '31.7%', aspectRatio: 4 / 5, borderRadius: 12, backgroundColor: colors.bg2, borderWidth: 1.5, borderColor: colors.inkMute, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 6 },
  addTxt: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },

  hint: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, padding: 10, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 10 },
  hintTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute },
  hintStrong: { color: colors.ink, fontFamily: fonts.semibold },

  bioWrap: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 12, padding: 14 },
  bioText: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.ink },
  bioFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  row4: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bioFootTxt: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute },
  bioCounter: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },

  interestHelp: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginBottom: 10, lineHeight: 16 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.bg2, borderWidth: 1.5, borderColor: colors.line },
  pillOn: { backgroundColor: 'rgba(77,143,255,0.1)', borderColor: colors.neon },
  pillCheck: { width: 13, height: 13, borderRadius: 7, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center' },
  pillTxt: { fontFamily: fonts.medium, fontSize: 12, color: colors.ink },

  segment: { flexDirection: 'row', backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 12, padding: 4, gap: 2 },
  levelBtn: { flex: 1, height: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center', gap: 4 },
  levelBtnActive: { backgroundColor: colors.bg, ...shadow.card },
  bars: { flexDirection: 'row', gap: 1.5, alignItems: 'flex-end', height: 14 },
  bar: { width: 3, borderRadius: 1, backgroundColor: colors.inkMute },
  levelLbl: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkMute },
  levelMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, padding: 10, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 10 },
  levelMetaIc: { width: 22, height: 22, borderRadius: 6, backgroundColor: 'rgba(74,222,128,0.12)', alignItems: 'center', justifyContent: 'center' },
  levelMetaTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 11, color: colors.ink, lineHeight: 16 },
  levelMetaEm: { fontFamily: fonts.monoBold, fontSize: 10, color: colors.success },
});
