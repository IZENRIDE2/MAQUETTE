import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ShieldCheck,
  Download,
  Pause,
  X,
  RefreshCw,
  MoreVertical,
  Wifi,
  Map as MapIcon,
  Plus,
} from 'lucide-react-native';
import { Screen, AppBar } from '@/components';
import { colors, fonts, radius, shadow } from '@/theme';

/**
 * Mode hors-ligne — cartes téléchargées, stockage, téléchargement en cours.
 * Localisé Paris / Île-de-France (Vallée de Chevreuse, Fontainebleau, Vexin).
 */
export default function ModeHorsLigneScreen() {
  const zones = [
    { name: 'Île-de-France', status: 'À jour', tint: colors.success, size: '412 Mo', version: 'v2026.04', age: 'il y a 3 j', update: false },
    { name: 'Forêt de Fontainebleau', status: 'MAJ dispo', tint: colors.warn, size: '318 Mo', version: 'v2026.02', age: 'il y a 2 mois', update: true },
    { name: 'Vallée de Chevreuse', status: 'À jour', tint: colors.success, size: '378 Mo', version: 'v2026.04', age: 'il y a 1 sem', update: false },
  ];

  return (
    <Screen pad={0}>
      <View style={{ paddingHorizontal: 16 }}>
        <AppBar title="Hors-ligne" right={<MoreVertical size={18} color={colors.ink} />} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Cartes hors-ligne</Text>
        <Text style={styles.headerSub}>Roulez sans connexion · navigation et lieux</Text>
      </View>

      {/* Status banner */}
      <View style={styles.statusCard}>
        <View style={styles.statusIcon}>
          <ShieldCheck size={20} color={colors.success} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.statusTitleRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusTitle}>Mode hors-ligne prêt</Text>
          </View>
          <Text style={styles.statusDesc}>
            <Text style={styles.statusStrong}>3 zones</Text> téléchargées ·{' '}
            <Text style={styles.statusStrong}>1,2 Go</Text> · navigation sans data
          </Text>
        </View>
        <View style={[styles.toggle, styles.toggleOn]}>
          <View style={[styles.knob, { transform: [{ translateX: 18 }] }]} />
        </View>
      </View>

      {/* Storage */}
      <View style={styles.storage}>
        <View style={styles.storageRow}>
          <Text style={styles.storageLabel}>Espace cartes</Text>
          <Text style={styles.storageValues}>
            <Text style={styles.storageStrong}>1,2 Go</Text> / 15 Go
          </Text>
        </View>
        <View style={styles.storageBar}>
          <LinearGradient
            colors={[colors.neon, colors.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: '8%', height: '100%', borderRadius: 3 }}
          />
        </View>
        <View style={styles.storageMeta}>
          <View style={styles.legend}>
            <View style={[styles.legendDot, { backgroundColor: colors.neon }]} />
            <Text style={styles.storageMetaTxt}>Cartes téléchargées</Text>
          </View>
          <Text style={styles.storageMetaTxt}>13,8 Go libres</Text>
        </View>
      </View>

      {/* Téléchargement en cours */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Téléchargement en cours</Text>
        <Text style={styles.sectionLink}>Pause tout</Text>
      </View>

      <View style={styles.heroZone}>
        <LinearGradient colors={['#0e1422', '#070910']} style={styles.heroMap}>
          <View style={styles.regionTag}>
            <Text style={styles.regionTagTxt}>FR · Région</Text>
          </View>
          <View style={styles.downloadPill}>
            <Download size={11} color={colors.neon} />
            <Text style={styles.downloadPillTxt}>Téléchargement</Text>
          </View>
          <MapIcon size={56} color="rgba(77,143,255,0.25)" />
        </LinearGradient>

        <View style={styles.heroBody}>
          <Text style={styles.heroName}>Vexin français</Text>
          <View style={styles.heroMetaRow}>
            <Text style={styles.heroMeta}>485 Mo</Text>
            <View style={styles.metaDot} />
            <Text style={styles.heroMeta}>Routes + lieux + relief</Text>
            <View style={styles.metaDot} />
            <Text style={styles.heroMeta}>v2026.04</Text>
          </View>

          <View style={styles.progressSection}>
            <Text style={styles.progressInfo}>
              <Text style={styles.progressStrong}>325 Mo</Text> sur 485 Mo · ~1 min restant
            </Text>
            <Text style={styles.progressPct}>67%</Text>
          </View>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={[colors.neon, colors.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: '67%', height: '100%', borderRadius: 3 }}
            />
          </View>

          <View style={styles.progressActions}>
            <Pressable style={styles.progressBtn}>
              <Pause size={12} color={colors.ink} />
              <Text style={styles.progressBtnTxt}>Pause</Text>
            </Pressable>
            <Pressable style={[styles.progressBtn, styles.progressBtnDanger]}>
              <X size={12} color={colors.danger} />
              <Text style={[styles.progressBtnTxt, { color: colors.danger }]}>Annuler</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Zones téléchargées */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Zones téléchargées · 3</Text>
        <Text style={styles.sectionLink}>Gérer</Text>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 8, marginBottom: 18 }}>
        {zones.map((z) => (
          <View key={z.name} style={styles.zone}>
            <LinearGradient colors={['#0e1422', '#070910']} style={styles.zoneThumb}>
              <MapIcon size={20} color={z.tint} />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <View style={styles.zoneRow1}>
                <Text style={styles.zoneName} numberOfLines={1}>
                  {z.name}
                </Text>
                <View style={[styles.statusPill, { borderColor: z.tint, backgroundColor: z.update ? 'rgba(251,191,36,0.12)' : 'rgba(74,222,128,0.15)' }]}>
                  <Text style={[styles.statusPillTxt, { color: z.tint }]}>{z.status}</Text>
                </View>
              </View>
              <View style={styles.zoneMeta}>
                <Text style={styles.zoneMetaTxt}>{z.size}</Text>
                <View style={styles.metaDot} />
                <Text style={[styles.zoneMetaTxt, { color: z.update ? colors.warn : colors.success }]}>{z.version}</Text>
                <View style={styles.metaDot} />
                <Text style={styles.zoneMetaTxt}>{z.age}</Text>
              </View>
            </View>
            <Pressable style={[styles.zoneAction, z.update && styles.zoneActionUpdate]}>
              {z.update ? <RefreshCw size={14} color={colors.warn} /> : <MoreVertical size={14} color={colors.ink} />}
            </Pressable>
          </View>
        ))}
      </View>

      {/* Paramètres */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Paramètres</Text>
      </View>

      <View style={styles.settings}>
        <View style={styles.settingRow}>
          <View style={[styles.settingIcon, { backgroundColor: 'rgba(77,143,255,0.12)' }]}>
            <Wifi size={14} color={colors.neon} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Téléchargement uniquement en Wi-Fi</Text>
            <Text style={styles.settingDesc}>Préserve votre forfait mobile</Text>
          </View>
          <View style={[styles.toggle, styles.toggleOn]}>
            <View style={[styles.knob, { transform: [{ translateX: 18 }] }]} />
          </View>
        </View>
        <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
          <View style={[styles.settingIcon, { backgroundColor: 'rgba(184,132,230,0.12)' }]}>
            <RefreshCw size={14} color={colors.purple} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Mises à jour automatiques</Text>
            <Text style={styles.settingDesc}>
              Tous les <Text style={styles.statusStrong}>7 jours</Text> · prochaine MAJ vendredi
            </Text>
          </View>
          <View style={[styles.toggle, styles.toggleOn]}>
            <View style={[styles.knob, { transform: [{ translateX: 18 }] }]} />
          </View>
        </View>
      </View>

      {/* FAB ajouter une zone */}
      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <Pressable>
          <LinearGradient
            colors={[colors.neon, colors.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fab}
          >
            <Plus size={14} color="#fff" strokeWidth={2.5} />
            <Text style={styles.fabTxt}>Ajouter une zone</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 12 },
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.ink, letterSpacing: -0.5, marginBottom: 4 },
  headerSub: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim },

  statusCard: {
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.3)',
    borderRadius: radius.lg,
  },
  statusIcon: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: 'rgba(74,222,128,0.18)', alignItems: 'center', justifyContent: 'center' },
  statusTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  statusTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  statusDesc: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkDim, lineHeight: 15 },
  statusStrong: { fontFamily: fonts.semibold, color: colors.ink },

  toggle: { width: 44, height: 26, borderRadius: 13, backgroundColor: colors.lineStrong, padding: 2, justifyContent: 'center' },
  toggleOn: { backgroundColor: colors.success },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' },

  storage: {
    marginHorizontal: 16,
    marginBottom: 22,
    padding: 14,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
  },
  storageRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  storageLabel: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 0.8 },
  storageValues: { fontFamily: fonts.mono, fontSize: 12, color: colors.inkDim },
  storageStrong: { fontFamily: fonts.monoBold, color: colors.ink },
  storageBar: { height: 6, borderRadius: 3, backgroundColor: colors.bgDeep, overflow: 'hidden', marginBottom: 8 },
  storageMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 2 },
  storageMetaTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkDim },

  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 16, paddingBottom: 12 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink, letterSpacing: -0.2 },
  sectionLink: { fontFamily: fonts.medium, fontSize: 12, color: colors.neonBright },

  heroZone: {
    marginHorizontal: 16,
    marginBottom: 18,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  heroMap: { height: 160, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: colors.line },
  regionTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(10,14,21,0.85)',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
  },
  regionTagTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 0.6 },
  downloadPill: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(77,143,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.4)',
    borderRadius: radius.pill,
  },
  downloadPillTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.neonBright },
  heroBody: { padding: 16 },
  heroName: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink, letterSpacing: -0.4, marginBottom: 4 },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  heroMeta: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkDim },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.inkMute },
  progressSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  progressInfo: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkDim },
  progressStrong: { fontFamily: fonts.monoBold, color: colors.ink },
  progressPct: { fontFamily: fonts.monoBold, fontSize: 14, color: colors.neonBright },
  progressBar: { height: 6, borderRadius: 3, backgroundColor: colors.bgDeep, overflow: 'hidden', marginBottom: 12 },
  progressActions: { flexDirection: 'row', gap: 8 },
  progressBtn: {
    flex: 1,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.bgDeep,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  progressBtnDanger: { borderColor: 'rgba(255,92,122,0.2)' },
  progressBtnTxt: { fontFamily: fonts.medium, fontSize: 12, color: colors.ink },

  zone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
  },
  zoneThumb: { width: 48, height: 48, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line },
  zoneRow1: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  zoneName: { flex: 1, fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  statusPill: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4, borderWidth: 1 },
  statusPillTxt: { fontFamily: fonts.monoBold, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.4 },
  zoneMeta: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  zoneMetaTxt: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkDim },
  zoneAction: { width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  zoneActionUpdate: { backgroundColor: 'rgba(251,191,36,0.12)', borderColor: 'rgba(251,191,36,0.3)' },

  settings: {
    marginHorizontal: 16,
    marginBottom: 18,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  settingIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  settingTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, marginBottom: 1 },
  settingDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim },

  fab: {
    height: 48,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...shadow.neon,
  },
  fabTxt: { fontFamily: fonts.semibold, fontSize: 13, color: '#fff' },
});
