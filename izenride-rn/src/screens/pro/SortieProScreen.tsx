import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, MapPin, Users, Route, Info } from 'lucide-react-native';
import { Screen, AppBar, PrimaryButton, GhostButton } from '@/components';
import { GroupAvatar, LoadState, VerifiedBadge, EmptyState } from '@/components/groups';
import { dialog } from '@/components/Dialog';
import { colors, fonts } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { joinPublicRide, listPublicProRides, subscribePro } from '@/api/pro';
import { formatRideDate, LEVELS } from '@/api/payloads';

/**
 * Fiche publique d'une sortie pro promue dans Événements. Tout rider peut
 * s'inscrire ; il n'entre pas pour autant dans le groupe (privé).
 */
export default function SortieProScreen({ rideId }: { rideId: string }) {
  const rides = useQuery(listPublicProRides, [], subscribePro);
  if (!rides.data) {
    return (
      <Screen>
        <AppBar title="Sortie" />
        <LoadState loading={!rides.error} error={rides.error} onRetry={rides.reload} />
      </Screen>
    );
  }
  const r = rides.data.find((x) => x.id === rideId);
  if (!r) {
    return (
      <Screen>
        <AppBar title="Sortie" />
        <EmptyState icon={<Clock size={22} color={colors.neonBright} />} title="Sortie indisponible" text="Elle est passée, annulée ou réservée aux membres." />
      </Screen>
    );
  }
  const toggle = () => joinPublicRide(r.id, !r.going).catch(dialog.error('Inscription impossible'));
  return (
    <Screen>
      <AppBar title="Sortie" />
      <View style={styles.org}>
        <GroupAvatar name={r.groupName} kind="pro" size={44} verified={!!r.verifiedAt} />
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={styles.orgName}>{r.groupName}</Text>
          {r.verifiedAt ? <VerifiedBadge /> : <Text style={styles.muted}>Organisation non vérifiée</Text>}
        </View>
      </View>
      <Text style={styles.title}>{r.title}</Text>
      <View style={styles.box}>
        <Line icon={<Clock size={15} color={colors.inkDim} />} text={formatRideDate(r.startsAt)} />
        <Line icon={<MapPin size={15} color={colors.inkDim} />} text={`RDV ${r.meetingPoint}`} />
        {r.route ? <Line icon={<Route size={15} color={colors.inkDim} />} text={r.route} /> : null}
        <Line icon={<Users size={15} color={colors.inkDim} />} text={`${r.participants} inscrit${r.participants > 1 ? 's' : ''} · ${LEVELS.find((l) => l.key === r.level)?.label ?? ''}`} />
      </View>
      {r.going ? (
        <GhostButton label="Je ne viens plus" onPress={toggle} style={{ marginTop: 20 }} />
      ) : (
        <PrimaryButton label="Je m’inscris" onPress={toggle} style={{ marginTop: 20 }} />
      )}
      {!r.isMember && (
        <View style={styles.note}>
          <Info size={14} color={colors.inkDim} />
          <Text style={styles.noteTxt}>T’inscrire ne te fait pas entrer dans le groupe {r.groupName}, qui reste privé.</Text>
        </View>
      )}
    </Screen>
  );
}

const Line = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <View style={styles.line}>
    {icon}
    <Text style={styles.lineTxt}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  org: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  orgName: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  muted: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkMute },
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.ink, letterSpacing: -0.3, marginBottom: 14 },
  box: { padding: 14, borderRadius: 16, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, gap: 10 },
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  lineTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.ink, lineHeight: 20 },
  note: { flexDirection: 'row', gap: 8, marginTop: 14, paddingHorizontal: 4 },
  noteTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, lineHeight: 17 },
});
