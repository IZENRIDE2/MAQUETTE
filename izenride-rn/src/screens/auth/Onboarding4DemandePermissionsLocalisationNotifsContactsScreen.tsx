import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ChevronLeft, Shield, MapPin, Bell, Users, Lock, ArrowRight } from 'lucide-react-native';
import { Screen, PrimaryButton } from '@/components';
import { colors, fonts } from '@/theme';

type PermKey = 'location' | 'notif' | 'contacts';

/** Onboarding 4/4 — demande de permissions (localisation, notifications, contacts). */
export default function Onboarding4DemandePermissionsLocalisationNotifsContactsScreen() {
  const [granted, setGranted] = useState<Record<PermKey, boolean>>({
    location: true,
    notif: true,
    contacts: false,
  });

  const toggle = (key: PermKey, locked?: boolean) => {
    if (locked) return;
    setGranted((g) => ({ ...g, [key]: !g[key] }));
  };

  const PERMS = [
    {
      key: 'location' as PermKey,
      title: 'Localisation',
      tag: 'Requis',
      tagColor: colors.neon,
      tagBg: 'rgba(74,143,255,0.14)',
      tagBorder: 'rgba(74,143,255,0.3)',
      locked: true,
      iconBg: 'rgba(74,143,255,0.12)',
      iconBorder: 'rgba(74,143,255,0.25)',
      iconColor: colors.neon,
      Icon: MapPin,
      desc: (
        <>
          Pour la <Text style={styles.descStrong}>safety zone</Text>, les <Text style={styles.descStrong}>croisements</Text> et la navigation. Ton domicile reste invisible.
        </>
      ),
    },
    {
      key: 'notif' as PermKey,
      title: 'Notifications',
      tag: 'Conseillé',
      tagColor: colors.purple,
      tagBg: 'rgba(184,132,230,0.12)',
      tagBorder: 'rgba(184,132,230,0.3)',
      locked: false,
      iconBg: 'rgba(184,132,230,0.12)',
      iconBorder: 'rgba(184,132,230,0.25)',
      iconColor: colors.purple,
      Icon: Bell,
      desc: (
        <>
          Matchs, messages, alertes sécurité, événements. <Text style={styles.descStrong}>Tu choisis quoi recevoir</Text>.
        </>
      ),
    },
    {
      key: 'contacts' as PermKey,
      title: 'Contacts',
      tag: 'Optionnel',
      tagColor: colors.inkMute,
      tagBg: 'rgba(168,176,192,0.06)',
      tagBorder: 'rgba(168,176,192,0.2)',
      locked: false,
      iconBg: 'rgba(251,191,36,0.1)',
      iconBorder: 'rgba(251,191,36,0.22)',
      iconColor: colors.warn,
      Icon: Users,
      desc: (
        <>
          Pour <Text style={styles.descStrong}>inviter des potes</Text> et retrouver tes contacts sur IzenRide. Aucun envoi automatique.
        </>
      ),
    },
  ];

  return (
    <Screen scroll pad={24} contentStyle={{ paddingBottom: 40 }}>
      {/* Top bar : retour + indicateurs de pages */}
      <View style={styles.topBar}>
        <Pressable hitSlop={8} style={styles.backBtn}>
          <ChevronLeft size={14} color={colors.inkMute} />
          <Text style={styles.backTxt}>Retour</Text>
        </Pressable>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotDone]} />
          <View style={[styles.dot, styles.dotDone]} />
          <View style={[styles.dot, styles.dotDone]} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Shield size={22} color={colors.neon} />
        </View>
        <Text style={styles.headerTitle}>Quelques permissions{'\n'}pour bien démarrer</Text>
        <Text style={styles.headerSub}>
          IzenRide a besoin de ces accès pour fonctionner. Tu gardes le contrôle, tout est modifiable plus tard.
        </Text>
      </View>

      {/* Permission cards */}
      <View style={styles.perms}>
        {PERMS.map((p) => {
          const on = granted[p.key];
          return (
            <Pressable
              key={p.key}
              onPress={() => toggle(p.key, p.locked)}
              style={[styles.permCard, on && styles.permCardOn]}
            >
              <View style={[styles.permIcon, { backgroundColor: p.iconBg, borderColor: p.iconBorder }]}>
                <p.Icon size={20} color={p.iconColor} />
              </View>
              <View style={styles.permBody}>
                <View style={styles.permTitleRow}>
                  <Text style={styles.permTitle}>{p.title}</Text>
                  <View style={[styles.tag, { backgroundColor: p.tagBg, borderColor: p.tagBorder }]}>
                    {p.locked && <Lock size={8} color={p.tagColor} />}
                    <Text style={[styles.tagTxt, { color: p.tagColor }]}>{p.tag}</Text>
                  </View>
                </View>
                <Text style={styles.permDesc}>{p.desc}</Text>
              </View>
              <View style={[styles.toggle, on && styles.toggleOn]}>
                <View style={[styles.knob, on && styles.knobOn]} />
              </View>
            </Pressable>
          );
        })}
      </View>

      <PrimaryButton
        label="C'est parti"
        icon={<ArrowRight size={18} color="#fff" strokeWidth={2.5} />}
        style={{ marginTop: 20 }}
      />

      {/* Privacy note */}
      <View style={styles.privacy}>
        <Lock size={14} color={colors.inkMute} />
        <Text style={styles.privacyTxt}>
          <Text style={styles.privacyStrong}>Tes données restent à toi.</Text> Aucune n'est partagée à des tiers. Modifiable à tout moment dans les Réglages.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backTxt: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkMute },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.lineStrong },
  dotDone: { backgroundColor: colors.inkMute },
  dotActive: { width: 22, borderRadius: 3, backgroundColor: colors.neon },

  header: { alignItems: 'center', marginBottom: 24 },
  headerIcon: {
    width: 48, height: 48, borderRadius: 14, marginBottom: 12,
    backgroundColor: 'rgba(74,143,255,0.12)', borderWidth: 1, borderColor: 'rgba(74,143,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.ink, textAlign: 'center', lineHeight: 24, marginBottom: 6 },
  headerSub: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkDim, textAlign: 'center', lineHeight: 18, maxWidth: 290 },

  perms: { gap: 10 },
  permCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 13 },
  permCardOn: { borderColor: 'rgba(74,222,128,0.35)', backgroundColor: 'rgba(74,222,128,0.04)' },
  permIcon: { width: 40, height: 40, borderRadius: 11, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  permBody: { flex: 1, minWidth: 0 },
  permTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  permTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
  tagTxt: { fontFamily: fonts.monoBold, fontSize: 8, letterSpacing: 0.8, textTransform: 'uppercase' },
  permDesc: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkDim, lineHeight: 16 },
  descStrong: { fontFamily: fonts.semibold, color: colors.ink },

  toggle: { width: 44, height: 26, borderRadius: 13, backgroundColor: colors.line, borderWidth: 1, borderColor: colors.lineStrong, justifyContent: 'center', paddingHorizontal: 2 },
  toggleOn: { backgroundColor: colors.success, borderColor: colors.success },
  knob: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.inkMute },
  knobOn: { backgroundColor: '#fff', transform: [{ translateX: 18 }] },

  privacy: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginTop: 18, paddingHorizontal: 4 },
  privacyTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 10.5, color: colors.inkMute, lineHeight: 15 },
  privacyStrong: { fontFamily: fonts.semibold, color: colors.inkDim },
});
