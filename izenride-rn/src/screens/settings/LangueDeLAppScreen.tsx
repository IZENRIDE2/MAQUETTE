import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Globe, Smartphone, CreditCard, Calendar, SlidersHorizontal, Bell } from 'lucide-react-native';
import { Screen, AppBar, Switch, Divider } from '@/components';
import { colors, fonts, radius } from '@/theme';

type LangId = 'fr' | 'en' | 'nl' | 'de';

const LANGS: {
  id: LangId;
  name: string;
  native: string;
  code: string;
  badge?: string;
  flag: [string, string, string];
  flagDir: 'h' | 'v';
  coverage: string;
  coveragePct: number;
  coverageColor: string;
}[] = [
  { id: 'fr', name: 'Français', native: 'Français', code: 'FR', flag: ['#002654', '#FFFFFF', '#ED2939'], flagDir: 'h', coverage: 'Complet', coveragePct: 100, coverageColor: colors.successText },
  { id: 'en', name: 'English', native: 'English (UK · US)', code: 'EN', flag: ['#012169', '#FFFFFF', '#C8102E'], flagDir: 'h', coverage: 'Complete', coveragePct: 100, coverageColor: colors.successText },
  { id: 'nl', name: 'Nederlands', native: 'Nederland · België', code: 'NL', badge: 'Bêta', flag: ['#AE1C28', '#FFFFFF', '#21468B'], flagDir: 'v', coverage: '75% vertaald', coveragePct: 75, coverageColor: colors.warn },
  { id: 'de', name: 'Deutsch', native: 'Deutschland · Österreich', code: 'DE', badge: 'Beta', flag: ['#000000', '#DD0000', '#FFCE00'], flagDir: 'v', coverage: '80% übersetzt', coveragePct: 80, coverageColor: colors.warn },
];

const REGION = [
  { icon: <Globe size={14} color={colors.neon} />, label: 'Région', value: 'France 🇫🇷' },
  { icon: <CreditCard size={14} color={colors.neon} />, label: 'Devise', value: 'Euro · €' },
  { icon: <SlidersHorizontal size={14} color={colors.neon} />, label: 'Unités', value: 'km · °C' },
  { icon: <Calendar size={14} color={colors.neon} />, label: 'Format date', value: 'JJ/MM/AAAA' },
];

function Flag({ colors: c, dir, size = 44 }: { colors: [string, string, string]; dir: 'h' | 'v'; size?: number }) {
  return (
    <View style={[styles.flag, { width: size, height: size }]}>
      <LinearGradient
        colors={c}
        start={dir === 'h' ? { x: 0, y: 0 } : { x: 0, y: 0 }}
        end={dir === 'h' ? { x: 1, y: 0 } : { x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

export default function LangueDeLAppScreen() {
  const [selected, setSelected] = useState<LangId>('fr');
  const current = LANGS.find((l) => l.id === selected) ?? LANGS[0];

  return (
    <Screen pad={16}>
      <AppBar title="Langue de l'app" right={<Globe size={18} color={colors.neon} />} />
      <Text style={styles.headerSub}>Choisissez votre langue préférée</Text>

      {/* Current language */}
      <View style={styles.currentCard}>
        <Text style={styles.currentLabel}>● Langue actuelle</Text>
        <View style={styles.currentRow}>
          <Flag colors={current.flag} dir={current.flagDir} size={52} />
          <View style={{ flex: 1 }}>
            <Text style={styles.currentName}>{current.name}</Text>
            <Text style={styles.currentNative}>France · Belgique · Suisse</Text>
            <View style={styles.currentStat}>
              <Check size={11} color={colors.successText} strokeWidth={2.5} />
              <Text style={styles.currentStatTxt}>100% traduit · vérifié par l'équipe</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Available languages */}
      <Text style={styles.sectionTitle}>Langues disponibles</Text>
      <View style={styles.card}>
        {LANGS.map((l, i) => {
          const on = selected === l.id;
          return (
            <View key={l.id}>
              <Pressable onPress={() => setSelected(l.id)} style={[styles.langRow, on && styles.langRowOn]}>
                {on && <View style={styles.langBar} />}
                <Flag colors={l.flag} dir={l.flagDir} />
                <View style={{ flex: 1 }}>
                  <View style={styles.langNameRow}>
                    <Text style={[styles.langName, on && { color: colors.neon }]}>{l.name}</Text>
                    {l.badge && (
                      <View style={styles.langBadge}>
                        <Text style={styles.langBadgeTxt}>{l.badge}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.langNativeRow}>
                    <Text style={styles.langNative}>{l.native}</Text>
                    <Text style={styles.langCode}>{l.code}</Text>
                  </View>
                  <View style={styles.coverageLine}>
                    <View style={styles.coverageBar}>
                      <View style={[styles.coverageFill, { width: `${l.coveragePct}%`, backgroundColor: l.coverageColor }]} />
                    </View>
                    <Text style={[styles.coverageTxt, { color: l.coverageColor }]}>{l.coverage}</Text>
                  </View>
                </View>
                <View style={[styles.radio, on && styles.radioOn]}>
                  {on && <Check size={13} color="#fff" strokeWidth={3.5} />}
                </View>
              </Pressable>
              {i < LANGS.length - 1 && <Divider style={styles.divider} />}
            </View>
          );
        })}
      </View>

      <Pressable style={styles.systemOption}>
        <View style={styles.systemIcon}>
          <Smartphone size={18} color={colors.purple} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.systemTitle}>Suivre la langue du système</Text>
          <Text style={styles.systemDesc}>L'app utilisera automatiquement la langue de votre iPhone</Text>
        </View>
        <Switch />
      </Pressable>

      {/* Coming soon */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Bientôt disponible</Text>
      <View style={styles.comingSoon}>
        <View style={{ flex: 1 }}>
          <Text style={styles.csTitle}>Italiano · Español · Português</Text>
          <Text style={styles.csDesc}>Prévu pour la v3.2 — automne 2026</Text>
        </View>
        <View style={styles.csLink}>
          <Text style={styles.csLinkTxt}>Notif</Text>
          <Bell size={11} color={colors.purple} />
        </View>
      </View>

      {/* Region */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Paramètres régionaux</Text>
      <View style={styles.regionCard}>
        {REGION.map((r, i) => (
          <View key={r.label} style={[styles.regionRow, i === REGION.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.regionLabelWrap}>
              <View style={styles.regionIcon}>{r.icon}</View>
              <Text style={styles.regionLabel}>{r.label}</Text>
            </View>
            <Text style={styles.regionValue}>{r.value}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.helpFooter}>
        Une traduction incorrecte ? <Text style={styles.helpLink}>Aidez-nous à améliorer</Text> ou rejoignez le programme de
        bêta-testeurs linguistiques
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerSub: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkMute, marginTop: -4, marginBottom: 8 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: 4, marginBottom: 12 },

  flag: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },

  currentCard: { backgroundColor: '#10121A', borderWidth: 1, borderColor: 'rgba(77,143,255,0.25)', borderRadius: 20, padding: 18, marginBottom: 24 },
  currentLabel: { fontFamily: fonts.bold, fontSize: 10, color: colors.neon, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  currentRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  currentName: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink, marginBottom: 2, letterSpacing: -0.4 },
  currentNative: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.inkMute },
  currentStat: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  currentStatTxt: { fontFamily: fonts.semibold, fontSize: 11, color: colors.successText },

  card: { backgroundColor: '#10121A', borderWidth: 1, borderColor: '#1A1E28', borderRadius: 18, overflow: 'hidden' },
  divider: { marginVertical: 0, marginHorizontal: 0, height: 1, backgroundColor: 'rgba(26,30,40,0.6)' },
  langRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16 },
  langRowOn: { backgroundColor: 'rgba(77,143,255,0.06)' },
  langBar: { position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderTopRightRadius: 2, borderBottomRightRadius: 2, backgroundColor: colors.neon },
  langNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  langName: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink, letterSpacing: -0.2 },
  langBadge: { backgroundColor: 'rgba(251,191,36,0.12)', borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)', borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 },
  langBadgeTxt: { fontFamily: fonts.bold, fontSize: 9, color: colors.warn, textTransform: 'uppercase', letterSpacing: 0.5 },
  langNativeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  langNative: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkMute },
  langCode: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.inkMute, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: '#1A1E28', borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2, textTransform: 'uppercase' },
  coverageLine: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  coverageBar: { width: 60, height: 3, borderRadius: 2, backgroundColor: colors.bgDeep, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(26,30,40,0.6)' },
  coverageFill: { height: '100%', borderRadius: 2 },
  coverageTxt: { fontFamily: fonts.bold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: '#2A3545', backgroundColor: colors.bgDeep, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.neon, backgroundColor: colors.neon },

  systemOption: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, padding: 14, backgroundColor: '#10121A', borderWidth: 1, borderColor: '#1A1E28', borderRadius: 14 },
  systemIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(184,132,230,0.12)', alignItems: 'center', justifyContent: 'center' },
  systemTitle: { fontFamily: fonts.bold, fontSize: 13.5, color: colors.ink, marginBottom: 2 },
  systemDesc: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.inkMute, lineHeight: 16 },

  comingSoon: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: 'rgba(184,132,230,0.04)', borderWidth: 1, borderColor: 'rgba(184,132,230,0.2)', borderStyle: 'dashed', borderRadius: 14 },
  csTitle: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.ink, marginBottom: 2 },
  csDesc: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkMute },
  csLink: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  csLinkTxt: { fontFamily: fonts.bold, fontSize: 11, color: colors.purple },

  regionCard: { backgroundColor: '#10121A', borderWidth: 1, borderColor: '#1A1E28', borderRadius: radius.md, padding: 14 },
  regionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(26,30,40,0.5)' },
  regionLabelWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  regionIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.bgDeep, alignItems: 'center', justifyContent: 'center' },
  regionLabel: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.ink },
  regionValue: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.inkMute },

  helpFooter: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkMute, lineHeight: 17, textAlign: 'center', marginTop: 24 },
  helpLink: { fontFamily: fonts.semibold, color: colors.neon },
});
