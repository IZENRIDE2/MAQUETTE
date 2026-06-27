import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Mail, Phone, Lock, Check, ChevronRight, Smartphone, Monitor, Tablet, LogOut, Ban, Trash2, AlertTriangle,
} from 'lucide-react-native';
import { Screen, AppBar, ListRow, Divider } from '@/components';
import { colors, fonts, radius } from '@/theme';

const SESSIONS = [
  { icon: <Smartphone size={16} color={colors.successText} />, title: 'Cet appareil', current: true, meta: 'iPhone 15 Pro · Paris 12e · maintenant' },
  { icon: <Monitor size={16} color={colors.ink} />, title: 'MacBook Pro', meta: 'Boulogne-Billancourt · il y a 3 heures' },
  { icon: <Tablet size={16} color={colors.ink} />, title: 'iPad Air', meta: 'Paris 12e · il y a 4 jours' },
];

export default function ParametresCompteScreen() {
  return (
    <Screen pad={16}>
      <AppBar title="Compte" />

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroRow}>
          <LinearGradient colors={[colors.neon, colors.success]} style={styles.heroAvatar}>
            <Text style={styles.heroAvatarTxt}>CB</Text>
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroName}>Christophe Bonnefont</Text>
            <Text style={styles.heroMeta}>ID · USR_8a2f9c1d</Text>
          </View>
        </View>
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatVal}>2 ans</Text>
            <Text style={styles.heroStatLabel}>Membre</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatVal}>147</Text>
            <Text style={styles.heroStatLabel}>Balades</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={[styles.heroStatVal, { color: colors.successText }]}>4,9</Text>
            <Text style={styles.heroStatLabel}>Note</Text>
          </View>
        </View>
      </View>

      {/* Identifiants */}
      <Text style={styles.sectionTitle}>Identifiants</Text>
      <View style={styles.card}>
        <FieldRow
          icon={<Mail size={11} color={colors.inkMute} />}
          label="Adresse email"
          value="christophe@izenride.com"
          verified
          meta="Sert également d'identifiant de connexion"
        />
        <Divider style={styles.divider} />
        <FieldRow
          icon={<Phone size={11} color={colors.inkMute} />}
          label="Numéro de téléphone"
          value="+33 6 12 ··· 89"
          verified
          meta="Utilisé pour la 2FA et les contacts d'urgence"
        />
        <Divider style={styles.divider} />
        <FieldRow
          icon={<Lock size={11} color={colors.inkMute} />}
          label="Mot de passe"
          value="···············"
          meta="Modifié il y a 2 mois · Force : élevée"
        />
      </View>
      <Text style={styles.footerTxt}>
        Modifier vos identifiants requiert une vérification par email ou SMS pour des raisons de sécurité.
      </Text>

      {/* Méthodes de connexion */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Méthodes de connexion</Text>
      <View style={styles.card}>
        <ListRow
          icon={<View style={[styles.rowIcon, { backgroundColor: 'rgba(77,143,255,0.15)' }]}><Text style={styles.gTxt}>G</Text></View>}
          title="Google"
          subtitle="christophe@gmail.com"
          right={<View style={styles.aside}><Text style={[styles.rowValue, { color: colors.successText }]}>Connecté</Text><ChevronRight size={14} color={colors.inkMute} /></View>}
        />
        <Divider style={styles.divider} />
        <ListRow
          icon={<View style={[styles.rowIcon, { backgroundColor: '#1A1E28' }]}><Text style={styles.gTxt}></Text></View>}
          title="Apple"
          subtitle="Non connecté"
          right={<View style={styles.aside}><Text style={styles.rowValue}>Connecter</Text><ChevronRight size={14} color={colors.inkMute} /></View>}
        />
      </View>

      {/* Sessions actives */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Sessions actives</Text>
      <View style={styles.card}>
        {SESSIONS.map((s, i) => (
          <View key={s.title}>
            <ListRow
              icon={<View style={[styles.rowIcon, { backgroundColor: s.current ? 'rgba(93,202,165,0.15)' : '#1A1E28' }]}>{s.icon}</View>}
              title={s.current ? 'Cet appareil · en cours' : s.title}
              subtitle={s.meta}
              right={<ChevronRight size={14} color={colors.inkMute} />}
            />
            {i < SESSIONS.length - 1 && <Divider style={styles.divider} />}
          </View>
        ))}
      </View>
      <Pressable>
        <Text style={[styles.footerTxt, styles.link]}>Déconnecter tous les autres appareils</Text>
      </Pressable>

      {/* Logout */}
      <Pressable style={styles.logoutBtn}>
        <LogOut size={16} color={colors.ink} />
        <Text style={styles.logoutTxt}>Se déconnecter de cet appareil</Text>
      </Pressable>

      {/* Danger zone */}
      <View style={styles.dangerZone}>
        <View style={styles.dangerTitleRow}>
          <AlertTriangle size={11} color={colors.danger} />
          <Text style={styles.dangerTitle}>Zone sensible</Text>
        </View>
        <View style={styles.dangerCard}>
          <DangerRow icon={<Ban size={14} color={colors.danger} />} title="Désactiver temporairement" sub="Masquer votre profil · Réversible à tout moment" />
          <Divider style={styles.dividerRed} />
          <DangerRow icon={<Trash2 size={14} color={colors.danger} />} title="Supprimer mon compte" sub="Action permanente · Suppression sous 30 jours" />
        </View>
      </View>
    </Screen>
  );
}

function FieldRow({ icon, label, value, verified, meta }: { icon: React.ReactNode; label: string; value: string; verified?: boolean; meta: string }) {
  return (
    <Pressable style={styles.fieldRow}>
      <View style={styles.fieldHeader}>
        <View style={styles.fieldLabelRow}>
          {icon}
          <Text style={styles.fieldLabel}>{label}</Text>
        </View>
        <Text style={styles.editBtn}>Modifier</Text>
      </View>
      <View style={styles.fieldValueRow}>
        <Text style={styles.fieldValue} numberOfLines={1}>{value}</Text>
        {verified && (
          <View style={styles.verifiedBadge}>
            <Check size={9} color={colors.successText} strokeWidth={3.5} />
            <Text style={styles.verifiedTxt}>VÉRIFIÉ</Text>
          </View>
        )}
      </View>
      <Text style={styles.fieldMeta}>{meta}</Text>
    </Pressable>
  );
}

function DangerRow({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <Pressable style={styles.dangerRow}>
      <View style={styles.dangerRowIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.dangerRowTitle}>{title}</Text>
        <Text style={styles.dangerRowSub}>{sub}</Text>
      </View>
      <ChevronRight size={14} color="rgba(226,75,74,0.4)" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: 'rgba(77,143,255,0.08)', borderWidth: 1, borderColor: '#1A1E28', borderRadius: 18, padding: 18, marginBottom: 20 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  heroAvatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  heroAvatarTxt: { fontFamily: fonts.bold, fontSize: 20, color: colors.bgDeep },
  heroName: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink, marginBottom: 2 },
  heroMeta: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
  heroStats: { flexDirection: 'row', gap: 12, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#1A1E28' },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatVal: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, marginBottom: 2 },
  heroStatLabel: { fontFamily: fonts.semibold, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.6 },

  sectionTitle: { fontFamily: fonts.bold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1.5, paddingHorizontal: 4, marginBottom: 10 },
  card: { backgroundColor: '#10121A', borderWidth: 1, borderColor: '#1A1E28', borderRadius: radius.md, overflow: 'hidden' },
  divider: { marginVertical: 0, marginHorizontal: 16, height: 1, backgroundColor: '#1A1E28' },
  dividerRed: { marginVertical: 0, marginHorizontal: 16, height: 1, backgroundColor: 'rgba(226,75,74,0.12)' },
  footerTxt: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, paddingHorizontal: 4, paddingTop: 8, lineHeight: 16 },
  link: { color: colors.neon, fontFamily: fonts.medium },

  fieldRow: { paddingVertical: 14, paddingHorizontal: 16 },
  fieldHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  fieldLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  fieldLabel: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8 },
  editBtn: { fontFamily: fonts.medium, fontSize: 13, color: colors.neon },
  fieldValueRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fieldValue: { flex: 1, fontFamily: fonts.medium, fontSize: 15, color: colors.ink },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: 'rgba(93,202,165,0.12)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.25)', borderRadius: radius.pill },
  verifiedTxt: { fontFamily: fonts.semibold, fontSize: 10, color: colors.successText },
  fieldMeta: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginTop: 4 },

  rowIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  gTxt: { fontFamily: fonts.bold, fontSize: 14, color: colors.neon },
  aside: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowValue: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkMute },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, backgroundColor: '#10121A', borderWidth: 1, borderColor: '#1A1E28', borderRadius: radius.md, marginTop: 16 },
  logoutTxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },

  dangerZone: { marginTop: 32, paddingTop: 24, borderTopWidth: 1, borderTopColor: '#1A1E28' },
  dangerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 4, marginBottom: 10 },
  dangerTitle: { fontFamily: fonts.bold, fontSize: 11, color: colors.danger, textTransform: 'uppercase', letterSpacing: 1.5 },
  dangerCard: { backgroundColor: 'rgba(226,75,74,0.04)', borderWidth: 1, borderColor: 'rgba(226,75,74,0.18)', borderRadius: radius.md, overflow: 'hidden' },
  dangerRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16 },
  dangerRowIcon: { width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(226,75,74,0.12)', alignItems: 'center', justifyContent: 'center' },
  dangerRowTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.danger },
  dangerRowSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginTop: 2 },
});
