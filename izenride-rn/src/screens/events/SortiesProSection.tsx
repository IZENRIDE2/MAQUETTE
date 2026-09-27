/** Agenda · sorties des groupes pro promues (lot 4). */
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { BadgeCheck, Clock, MapPin, Megaphone } from 'lucide-react-native';
import { colors, fonts, radius } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { listPublicProRides, subscribePro } from '@/api/pro';
import { formatRideDate } from '@/api/payloads';
import { proRoutes } from '@/screens/pro/routes';

export function SortiesProSection() {
  const router = useRouter();
  const rides = useQuery(listPublicProRides, [], subscribePro);
  if (!rides.data?.length) return null;
  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Megaphone size={12} color={colors.cyan} />
        <Text style={styles.title}>Sorties des pros</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.strip}>
        {rides.data.map((r) => (
          <Pressable key={r.id} onPress={() => router.push(proRoutes.publicRide(r.id))} style={styles.card}>
            <View style={styles.org}>
              <Text style={styles.orgName} numberOfLines={1}>
                {r.groupName}
              </Text>
              {r.verifiedAt ? <BadgeCheck size={13} color={colors.cyan} /> : null}
            </View>
            <Text style={styles.rideTitle} numberOfLines={2}>
              {r.title}
            </Text>
            <View style={styles.meta}>
              <Clock size={12} color={colors.inkMute} />
              <Text style={styles.metaTxt}>{formatRideDate(r.startsAt)}</Text>
            </View>
            <View style={styles.meta}>
              <MapPin size={12} color={colors.inkMute} />
              <Text style={styles.metaTxt} numberOfLines={1}>
                {r.meetingPoint}
              </Text>
            </View>
            <View style={[styles.pill, r.going && styles.pillOn]}>
              <Text style={[styles.pillTxt, r.going && { color: colors.success }]}>
                {r.going ? 'Inscrit' : `${r.participants} inscrit${r.participants > 1 ? 's' : ''}`}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 4, paddingBottom: 14 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 10 },
  title: { fontFamily: fonts.bold, fontSize: 11, color: colors.inkDim, letterSpacing: 1.2, textTransform: 'uppercase' },
  strip: { gap: 10 },
  card: { width: 230, padding: 14, borderRadius: 16, backgroundColor: colors.panel, borderWidth: 1, borderColor: 'rgba(34,211,238,0.3)', gap: 5 },
  org: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  orgName: { flexShrink: 1, fontFamily: fonts.semibold, fontSize: 12, color: colors.cyanLight },
  rideTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink, lineHeight: 20 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim },
  pill: { alignSelf: 'flex-start', marginTop: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.lineStrong },
  pillOn: { borderColor: 'rgba(74,222,128,0.5)' },
  pillTxt: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkDim },
});
