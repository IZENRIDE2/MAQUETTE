import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, ArrowRight } from 'lucide-react-native';
import { Screen, AppBar, GhostButton } from '@/components';
import { EmptyState, LoadState, SectionTitle } from '@/components/groups';
import { colors, fonts } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { getGroupBundle, getGroupFeed, subscribeGroupFeed } from '@/api/groups';
import { formatRideDate } from '@/api/payloads';
import { groupRoutes } from './routes';
import { SuggestionCard } from './feed/cards';
import { makeCtx } from './feed/context';

/** Détail d'une suggestion : contenu complet, décision, lien vers le résultat. */
export default function SuggestionScreen({ groupId, suggestionId }: { groupId: string; suggestionId: string }) {
  const router = useRouter();
  const bundle = useQuery(() => getGroupBundle(groupId), [groupId]);
  const feed = useQuery(() => getGroupFeed(groupId), [groupId], (cb) => subscribeGroupFeed(groupId, cb));
  const ctx = useMemo(() => (bundle.data && feed.data ? makeCtx(bundle.data, feed.data) : null), [bundle.data, feed.data]);

  if (!ctx) {
    return (
      <Screen>
        <AppBar title="Suggestion" />
        <LoadState loading={!bundle.error && !feed.error} error={bundle.error ?? feed.error} onRetry={feed.reload} />
      </Screen>
    );
  }
  const s = ctx.feed.suggestions.find((x) => x.id === suggestionId);
  if (!s) {
    return (
      <Screen>
        <AppBar title="Suggestion" />
        <EmptyState icon={<Clock size={22} color={colors.neonBright} />} title="Suggestion introuvable" text="Elle a peut-être été supprimée." />
      </Screen>
    );
  }

  const accepted = s.status === 'accepted' || s.status === 'accepted_edited';
  const resultTab = s.type === 'ride' ? 'sorties' : s.type === 'member' ? 'membres' : 'chat';

  return (
    <Screen>
      <AppBar title="Suggestion" />
      <SuggestionCard ctx={ctx} s={s} />

      <SectionTitle style={{ marginTop: 22 }}>Suivi</SectionTitle>
      <View style={styles.timeline}>
        <Line label="Proposée" value={formatRideDate(s.createdAt)} />
        {s.status === 'pending' && <Line label="Expire" value={formatRideDate(s.expiresAt)} />}
        {s.decidedAt && <Line label={s.status === 'refused' ? 'Refusée' : 'Décidée'} value={`${formatRideDate(s.decidedAt)} · ${ctx.nameOf(s.decidedBy)}`} />}
        <Line label="Soutiens" value={`${s.votes} 👍`} />
      </View>

      {accepted && (
        <GhostButton
          label={s.type === 'ride' ? 'Voir la sortie' : s.type === 'member' ? 'Voir les membres' : 'Voir dans le chat'}
          icon={<ArrowRight size={16} color={colors.ink} />}
          onPress={() => router.push(groupRoutes.home(groupId, resultTab))}
          style={{ marginTop: 18 }}
        />
      )}
    </Screen>
  );
}

const Line = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.line}>
    <Text style={styles.lineLbl}>{label}</Text>
    <Text style={styles.lineVal}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  timeline: { borderWidth: 1, borderColor: colors.line, borderRadius: 14, backgroundColor: colors.panel, paddingHorizontal: 14 },
  line: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  lineLbl: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8 },
  lineVal: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
});
