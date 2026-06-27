import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Eye, Filter, Zap, Check, X, Sparkles } from 'lucide-react-native';
import { Screen, AppBar, PrimaryButton, Pill } from '@/components';
import { colors, fonts, radius } from '@/theme';

type LevelId = 'passive' | 'lexical' | 'ai';

const FEATURES = ['Signalement', 'Blocage', 'Filtrage mots', 'Détection IA'] as const;

const LEVELS: {
  id: LevelId;
  icon: React.ReactNode;
  name: string;
  tag: string;
  tagColor: string;
  tagBg: string;
  desc: string;
  active: number;
  recommended?: string;
}[] = [
  {
    id: 'passive',
    icon: <Eye size={16} color={colors.inkDim} />,
    name: 'Passif',
    tag: 'Minimal',
    tagColor: colors.inkDim,
    tagBg: 'rgba(168,176,192,0.12)',
    desc: 'Aucun filtrage automatique. Tu signales toi-même les comportements problématiques.',
    active: 2,
  },
  {
    id: 'lexical',
    icon: <Filter size={16} color={colors.neon} />,
    name: 'Filtrage lexical',
    tag: 'Recommandé',
    tagColor: colors.successText,
    tagBg: 'rgba(93,202,165,0.12)',
    desc: 'Les messages contenant des termes injurieux ou agressifs sont masqués automatiquement.',
    active: 3,
  },
  {
    id: 'ai',
    icon: <Sparkles size={16} color={colors.purple} />,
    name: 'Détection intelligente',
    tag: 'IA',
    tagColor: colors.purpleLight,
    tagBg: 'rgba(184,132,230,0.15)',
    desc: "Analyse contextuelle par l'API Perspective. Détecte la toxicité, le sarcasme et le harcèlement déguisé.",
    active: 4,
    recommended: 'Maximum',
  },
];

export default function NiveauDeProtectionHarcelementScreen() {
  const [selected, setSelected] = useState<LevelId>('ai');

  return (
    <Screen pad={16}>
      <AppBar
        title="Protection contre le harcèlement"
        right={<Pill label="À décider" color={colors.warn} bg="rgba(251,191,36,0.12)" border="rgba(251,191,36,0.25)" />}
      />

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Choisis ton niveau de protection</Text>
        <Text style={styles.heroDesc}>
          IzenRide modère les messages dans le chat et les commentaires d'événements selon la rigueur que tu choisis.
        </Text>
      </View>

      <Text style={styles.sectionLabel}>Niveau de modération</Text>

      {LEVELS.map((lvl) => {
        const on = selected === lvl.id;
        return (
          <Pressable key={lvl.id} onPress={() => setSelected(lvl.id)} style={[styles.card, on && styles.cardOn]}>
            {lvl.recommended && (
              <View style={styles.ribbon}>
                <Text style={styles.ribbonTxt}>{lvl.recommended}</Text>
              </View>
            )}
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>{lvl.icon}</View>
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.levelName}>{lvl.name}</Text>
                  <View style={[styles.tag, { backgroundColor: lvl.tagBg }]}>
                    <Text style={[styles.tagTxt, { color: lvl.tagColor }]}>{lvl.tag}</Text>
                  </View>
                </View>
                <Text style={styles.levelDesc}>{lvl.desc}</Text>
              </View>
              <View style={[styles.radio, on && styles.radioOn]}>
                {on && <Check size={11} color="#fff" strokeWidth={3.5} />}
              </View>
            </View>

            <View style={styles.features}>
              {FEATURES.map((f, i) => {
                const enabled = i < lvl.active;
                return (
                  <View key={f} style={styles.feature}>
                    <View style={[styles.featCheck, { backgroundColor: enabled ? 'rgba(93,202,165,0.15)' : 'rgba(94,100,120,0.2)' }]}>
                      {enabled ? (
                        <Check size={8} color={colors.successText} strokeWidth={3.5} />
                      ) : (
                        <X size={7} color={colors.inkMute} strokeWidth={3} />
                      )}
                    </View>
                    <Text style={[styles.featTxt, enabled && { color: colors.ink }]}>{f}</Text>
                  </View>
                );
              })}
            </View>

            {lvl.id === 'ai' && (
              <View style={styles.aiMeta}>
                <View style={styles.aiMetaIcon}>
                  <Zap size={11} color={colors.purple} />
                </View>
                <Text style={styles.aiMetaTxt}>
                  Latence ~ 200ms · <Text style={styles.aiMetaDim}>Coût estimé 0,02€/1000 messages analysés</Text>
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}

      <PrimaryButton label="Enregistrer ma préférence" icon={<Check size={15} color="#fff" strokeWidth={2.5} />} style={{ marginTop: 16 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { paddingVertical: 4, marginBottom: 12 },
  heroTitle: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink, marginBottom: 5, letterSpacing: -0.6 },
  heroDesc: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkDim, lineHeight: 17 },
  sectionLabel: { fontFamily: fonts.monoBold, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },

  card: { backgroundColor: 'rgba(16,18,26,0.6)', borderWidth: 1.5, borderColor: '#1A1E28', borderRadius: radius.md, padding: 12, marginBottom: 8, overflow: 'hidden' },
  cardOn: { borderColor: 'rgba(77,143,255,0.45)', backgroundColor: 'rgba(77,143,255,0.06)' },
  ribbon: { position: 'absolute', top: 0, right: 14, backgroundColor: colors.purple, paddingHorizontal: 8, paddingVertical: 3, borderBottomLeftRadius: 6, borderBottomRightRadius: 6 },
  ribbonTxt: { fontFamily: fonts.bold, fontSize: 8.5, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.6 },

  cardHeader: { flexDirection: 'row', gap: 10, marginBottom: 6 },
  cardIcon: { width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  levelName: { fontFamily: fonts.bold, fontSize: 14.5, color: colors.ink },
  tag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  tagTxt: { fontFamily: fonts.bold, fontSize: 9, textTransform: 'uppercase' },
  levelDesc: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkDim, lineHeight: 16 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#2A3545', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  radioOn: { borderColor: colors.neon, backgroundColor: colors.neon },

  features: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, rowGap: 6, marginTop: 7, paddingTop: 7, borderTopWidth: 1, borderTopColor: 'rgba(42,53,69,0.6)' },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 5, width: '46%' },
  featCheck: { width: 13, height: 13, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  featTxt: { fontFamily: fonts.medium, fontSize: 10, color: colors.inkMute },

  aiMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 7, padding: 8, backgroundColor: 'rgba(184,132,230,0.06)', borderWidth: 1, borderColor: 'rgba(184,132,230,0.15)', borderRadius: 9 },
  aiMetaIcon: { width: 22, height: 22, borderRadius: 6, backgroundColor: 'rgba(184,132,230,0.15)', alignItems: 'center', justifyContent: 'center' },
  aiMetaTxt: { flex: 1, fontFamily: fonts.medium, fontSize: 10, color: colors.ink, lineHeight: 14 },
  aiMetaDim: { fontFamily: fonts.regular, color: colors.inkDim },
});
