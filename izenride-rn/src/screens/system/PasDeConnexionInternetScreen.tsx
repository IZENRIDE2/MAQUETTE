import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  Settings,
  WifiOff,
  X,
  Check,
  RefreshCw,
  MapPin,
  Bookmark,
  Clock,
  MessageCircle,
  Calendar,
  ShoppingBag,
  Lock,
} from 'lucide-react-native';
import { colors, fonts, radius } from '@/theme';

/** Pas de connexion internet — état hors ligne (localisé Île-de-France). */
export default function PasDeConnexionInternetScreen() {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#0a1428', colors.bg, colors.bgDeep]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        {/* Top nav */}
        <View style={styles.topnav}>
          <Pressable style={styles.iconBtn}>
            <ChevronLeft size={18} color={colors.ink} />
          </Pressable>
          <Text style={styles.topTitle}>Hors ligne</Text>
          <Pressable style={styles.iconBtn}>
            <Settings size={18} color={colors.ink} />
          </Pressable>
        </View>

        {/* Bannière offline */}
        <View style={styles.banner}>
          <View style={styles.bannerDot} />
          <Text style={styles.bannerMsg}>
            Vous êtes <Text style={styles.bannerStrong}>hors ligne</Text> · les fonctionnalités cloud sont en pause.
          </Text>
          <Text style={styles.bannerTime}>9:41</Text>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.illu}>
            <View style={styles.orbit1} />
            <View style={styles.orbit2} />
            <View style={[styles.disrupt, { top: 8, right: 26 }]}>
              <X size={11} color={colors.danger} strokeWidth={3} />
            </View>
            <View style={[styles.disrupt, { bottom: 28, left: 14 }]}>
              <X size={11} color={colors.danger} strokeWidth={3} />
            </View>
            <View style={styles.cloudCircle}>
              <WifiOff size={50} color={colors.warn} strokeWidth={1.6} />
            </View>
          </View>

          <Text style={styles.title}>
            Pas de <Text style={styles.titleEm}>connexion</Text>
          </Text>
          <Text style={styles.desc}>
            Votre téléphone n'arrive pas à joindre les serveurs IzenRide. On retentera{' '}
            <Text style={styles.descStrong}>automatiquement</Text> dès que possible.
          </Text>
        </View>

        {/* Diagnostic */}
        <View style={styles.diag}>
          <DiagRow icon={<X size={12} color={colors.danger} strokeWidth={2.5} />} label="Données mobiles" value="Mode avion" valueColor={colors.danger} />
          <DiagRow icon={<X size={12} color={colors.danger} strokeWidth={2.5} />} label="Wi-Fi" value="Désactivé" valueColor={colors.danger} border />
          <DiagRow icon={<Check size={12} color={colors.successText} strokeWidth={2.5} />} label="GPS · Localisation" value="Actif" valueColor={colors.successText} border />
        </View>

        {/* Retry */}
        <View style={styles.retryWrap}>
          <Pressable>
            <LinearGradient colors={[colors.neon, colors.purple]} style={styles.retryBtn}>
              <RefreshCw size={16} color="#fff" />
              <Text style={styles.retryTxt}>Réessayer maintenant</Text>
            </LinearGradient>
          </Pressable>
          <Text style={styles.retryHelper}>
            Prochaine tentative auto · dans <Text style={styles.helperStrong}>12 s</Text>
          </Text>
        </View>

        {/* Disponibles hors ligne */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Toujours disponibles</Text>
          <View style={styles.sectionTag}>
            <Text style={styles.sectionTagTxt}>Hors ligne</Text>
          </View>
        </View>
        <View style={styles.actionsGrid}>
          <ActionCard bg="rgba(93,202,165,0.12)" icon={<MapPin size={16} color={colors.successText} />} name="Cartes Île-de-France" desc="156 Mo téléchargés" />
          <ActionCard bg="rgba(77,143,255,0.12)" icon={<RefreshCw size={16} color={colors.neon} />} name="Trajets enregistrés" desc="42 trajets · Lecture" />
          <ActionCard bg="rgba(127,119,221,0.12)" icon={<Bookmark size={16} color={colors.purple} />} name="Lieux favoris" desc="8 spots accessibles" />
          <ActionCard bg="rgba(250,199,117,0.12)" icon={<Clock size={16} color={colors.warn} />} name="Trajet en cours" desc="Buffer local actif" />
        </View>

        {/* En attente de connexion */}
        <View style={styles.disabledList}>
          <View style={styles.disabledHead}>
            <Lock size={11} color={colors.inkMute} />
            <Text style={styles.disabledHeadTxt}>En attente de connexion</Text>
          </View>
          <DisabledRow icon={<MessageCircle size={11} color={colors.inkDim} />} name="Messages & matchs" tag="3 en file" />
          <DisabledRow icon={<Calendar size={11} color={colors.inkDim} />} name="Événements & invitations" tag="Sync à venir" border />
          <DisabledRow icon={<ShoppingBag size={11} color={colors.inkDim} />} name="Marketplace" tag="Indispo" border />
        </View>
      </View>
    </View>
  );
}

function DiagRow({
  icon,
  label,
  value,
  valueColor,
  border,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor: string;
  border?: boolean;
}) {
  return (
    <View style={[styles.diagRow, border && styles.diagBorder]}>
      {icon}
      <Text style={styles.diagLabel}>{label}</Text>
      <Text style={[styles.diagValue, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

function ActionCard({ bg, icon, name, desc }: { bg: string; icon: React.ReactNode; name: string; desc: string }) {
  return (
    <View style={styles.actionCard}>
      <View style={[styles.actionIcon, { backgroundColor: bg }]}>{icon}</View>
      <Text style={styles.actionName}>{name}</Text>
      <Text style={styles.actionDesc}>{desc}</Text>
    </View>
  );
}

function DisabledRow({ icon, name, tag, border }: { icon: React.ReactNode; name: string; tag: string; border?: boolean }) {
  return (
    <View style={[styles.disabledRow, border && styles.diagBorder]}>
      <View style={styles.disabledIcon}>{icon}</View>
      <Text style={styles.disabledName}>{name}</Text>
      <Text style={styles.disabledTag}>{tag}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, paddingTop: 56 },

  topnav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },

  banner: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(250,199,117,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(250,199,117,0.3)',
    borderRadius: 11,
  },
  bannerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.warn },
  bannerMsg: { flex: 1, fontFamily: fonts.regular, fontSize: 11, color: colors.ink, lineHeight: 15 },
  bannerStrong: { fontFamily: fonts.bold, color: colors.warn },
  bannerTime: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },

  hero: { paddingHorizontal: 24, paddingBottom: 22, alignItems: 'center' },
  illu: { width: 200, height: 200, marginTop: 8, marginBottom: 22, alignItems: 'center', justifyContent: 'center' },
  orbit1: { position: 'absolute', top: 14, left: 14, right: 14, bottom: 14, borderRadius: 100, borderWidth: 1.5, borderColor: 'rgba(250,199,117,0.18)', borderStyle: 'dashed' },
  orbit2: { position: 'absolute', top: 38, left: 38, right: 38, bottom: 38, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(250,199,117,0.12)', borderStyle: 'dashed' },
  disrupt: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.bg,
    backgroundColor: 'rgba(226,75,74,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  cloudCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(250,199,117,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(250,199,117,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.ink, textAlign: 'center', marginBottom: 8 },
  titleEm: { color: colors.warn },
  desc: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.inkDim, textAlign: 'center', maxWidth: 320 },
  descStrong: { fontFamily: fonts.semibold, color: colors.ink },

  diag: {
    marginHorizontal: 16,
    paddingVertical: 5,
    paddingHorizontal: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
  },
  diagRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 },
  diagBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  diagLabel: { flex: 1, fontFamily: fonts.medium, fontSize: 12, color: colors.ink },
  diagValue: { fontFamily: fonts.monoBold, fontSize: 11 },

  retryWrap: { paddingHorizontal: 16, paddingTop: 16 },
  retryBtn: { height: 50, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  retryTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
  retryHelper: { marginTop: 8, fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute, textAlign: 'center' },
  helperStrong: { fontFamily: fonts.monoBold, color: colors.ink },

  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingTop: 22, paddingBottom: 12 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  sectionTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    backgroundColor: 'rgba(93,202,165,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(93,202,165,0.3)',
    borderRadius: 4,
  },
  sectionTagTxt: { fontFamily: fonts.monoBold, fontSize: 8, color: colors.successText, textTransform: 'uppercase', letterSpacing: 0.8 },

  actionsGrid: { marginHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actionCard: {
    width: '47.5%',
    flexGrow: 1,
    padding: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 13,
    gap: 8,
  },
  actionIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  actionName: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  actionDesc: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },

  disabledList: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
  },
  disabledHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  disabledHeadTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8 },
  disabledRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6, opacity: 0.6 },
  disabledIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledName: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim },
  disabledTag: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, textTransform: 'uppercase' },
});
