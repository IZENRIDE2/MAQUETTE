import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Bell,
  Mail,
  Heart,
  MessageCircle,
  Eye,
  Calendar,
  ShoppingBag,
  Moon,
  ChevronRight,
} from 'lucide-react-native';
import { Screen, AppBar, ListRow, Switch, SectionLabel } from '@/components';
import { colors, fonts, radius } from '@/theme';

function GroupIcon({ Icon, color, bg }: { Icon: any; color: string; bg: string }) {
  return (
    <View style={[styles.gi, { backgroundColor: bg }]}>
      <Icon size={17} color={color} />
    </View>
  );
}

/** Réglages notifications — canaux + activité sociale (localisé Paris). */
export default function ReglagesNotificationsScreen() {
  return (
    <Screen edges={['top']}>
      <AppBar title="Notifications" />
      <Text style={styles.headerSub}>Choisis ce que tu veux recevoir</Text>

      <SectionLabel>Canaux</SectionLabel>
      <View style={styles.group}>
        <ListRow
          icon={<GroupIcon Icon={Bell} color={colors.neon} bg="rgba(77,143,255,0.12)" />}
          title="Notifications push"
          subtitle="Sur cet appareil"
          right={<Switch value />}
        />
        <View style={styles.sep} />
        <ListRow
          icon={<GroupIcon Icon={Mail} color={colors.success} bg="rgba(74,222,128,0.12)" />}
          title="Email"
          subtitle="Résumés et alertes importantes"
          right={<Switch value />}
        />
      </View>

      <SectionLabel>Activité sociale</SectionLabel>
      <View style={styles.group}>
        <ListRow
          icon={<GroupIcon Icon={Heart} color={colors.neon} bg="rgba(77,143,255,0.12)" />}
          title="Nouveaux matchs"
          right={<Switch value />}
        />
        <View style={styles.sep} />
        <ListRow
          icon={<GroupIcon Icon={MessageCircle} color={colors.success} bg="rgba(74,222,128,0.12)" />}
          title="Messages"
          right={<Switch value />}
        />
        <View style={styles.sep} />
        <ListRow
          icon={<GroupIcon Icon={Eye} color={colors.danger} bg="rgba(255,92,122,0.12)" />}
          title="Qui m'a liké"
          subtitle="Réservé aux membres Premium"
          right={<Switch />}
        />
      </View>

      <SectionLabel>Événements & marketplace</SectionLabel>
      <View style={styles.group}>
        <ListRow
          icon={<GroupIcon Icon={Calendar} color={colors.purple} bg="rgba(184,132,230,0.12)" />}
          title="Rappels d'événements"
          right={<Switch value />}
        />
        <View style={styles.sep} />
        <ListRow
          icon={<GroupIcon Icon={ShoppingBag} color={colors.warn} bg="rgba(251,191,36,0.12)" />}
          title="Offres & ventes"
          subtitle="Messages d'acheteurs, baisses de prix"
          right={<Switch value />}
        />
      </View>

      <SectionLabel>Silence</SectionLabel>
      <View style={styles.group}>
        <ListRow
          icon={<GroupIcon Icon={Moon} color={colors.inkDim} bg="rgba(90,100,120,0.18)" />}
          title="Fenêtres silencieuses"
          subtitle="22:00 – 07:00"
          right={<ChevronRight size={16} color={colors.inkMute} />}
        />
      </View>

      <View style={{ height: 24 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginTop: -6, marginBottom: 4 },
  group: {
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    overflow: 'hidden',
  },
  gi: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sep: { height: 1, backgroundColor: colors.line },
});
