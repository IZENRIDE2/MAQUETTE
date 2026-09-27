import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Lightbulb } from 'lucide-react-native';
import { Screen, AppBar, PrimaryButton } from '@/components';
import { EmptyState, LoadState, SectionTitle } from '@/components/groups';
import { colors } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { getGroupBundle, getGroupFeed, subscribeGroupFeed } from '@/api/groups';
import { groupRoutes } from './routes';
import { SuggestionCard } from './feed/cards';
import { makeCtx } from './feed/context';

/** Mes suggestions dans un groupe : en attente (retirables), puis traitées. */
export default function MesSuggestionsScreen({ groupId }: { groupId: string }) {
  const router = useRouter();
  const bundle = useQuery(() => getGroupBundle(groupId), [groupId]);
  const feed = useQuery(() => getGroupFeed(groupId), [groupId], (cb) => subscribeGroupFeed(groupId, cb));
  const ctx = useMemo(() => (bundle.data && feed.data ? makeCtx(bundle.data, feed.data) : null), [bundle.data, feed.data]);

  if (!ctx) {
    return (
      <Screen>
        <AppBar title="Mes suggestions" />
        <LoadState loading={!bundle.error && !feed.error} error={bundle.error ?? feed.error} onRetry={feed.reload} />
      </Screen>
    );
  }

  const nowMs = Date.now();
  const mine = ctx.feed.suggestions
    .filter((s) => s.authorId === ctx.b.me.userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const pending = mine.filter((s) => s.status === 'pending' && Date.parse(s.expiresAt) > nowMs);
  const done = mine.filter((s) => !pending.includes(s));

  return (
    <Screen>
      <AppBar title="Mes suggestions" />
      {mine.length === 0 ? (
        <EmptyState
          icon={<Lightbulb size={22} color={colors.neonBright} />}
          title="Aucune suggestion"
          text="Propose une sortie, un sondage, une annonce ou un membre : un habilité l’acceptera en 1 clic."
          action={<PrimaryButton label="Proposer une sortie" onPress={() => router.push(groupRoutes.propose(groupId, 'ride'))} />}
        />
      ) : (
        <>
          {pending.length > 0 && (
            <>
              <SectionTitle>En attente · {pending.length}/5</SectionTitle>
              <View style={{ gap: 10 }}>
                {pending.map((s) => (
                  <SuggestionCard key={s.id} ctx={ctx} s={s} compact />
                ))}
              </View>
            </>
          )}
          {done.length > 0 && (
            <>
              <SectionTitle style={{ marginTop: 22 }}>Traitées</SectionTitle>
              <View style={{ gap: 10 }}>
                {done.map((s) => (
                  <SuggestionCard key={s.id} ctx={ctx} s={s} compact />
                ))}
              </View>
            </>
          )}
        </>
      )}
    </Screen>
  );
}
