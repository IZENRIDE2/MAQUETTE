import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Bike, Megaphone, ChevronDown, ChevronUp } from 'lucide-react-native';
import { PrimaryButton } from '@/components';
import { EmptyState, SectionTitle } from '@/components/groups';
import { colors } from '@/theme';
import { canCreate } from '@/api/groups';
import { TYPE_META } from '@/api/payloads';
import { groupRoutes } from '../routes';
import { RideCard, SuggestionCard } from '../feed/cards';
import type { GroupCtx } from '../feed/context';
import { tabStyles as styles } from './shared';

/** Sorties du groupe : à venir, proposées (en attente), passées. */
export default function SortiesTab({ ctx }: { ctx: GroupCtx }) {
  const router = useRouter();
  const { b, feed } = ctx;
  const [showPast, setShowPast] = useState(false);
  const direct = canCreate(b, 'ride');
  const nowMs = Date.now();
  const upcoming = feed.rides.filter((r) => Date.parse(r.startsAt) >= nowMs);
  const past = feed.rides.filter((r) => Date.parse(r.startsAt) < nowMs).reverse();
  const proposed = feed.suggestions.filter((s) => s.type === 'ride' && s.status === 'pending' && Date.parse(s.expiresAt) > nowMs);

  return (
    <View>
      <PrimaryButton
        label={direct ? TYPE_META.ride.create : TYPE_META.ride.propose}
        icon={<Plus size={18} color="#fff" />}
        onPress={() => router.push(groupRoutes.propose(b.group.id, 'ride'))}
      />
      {!direct && <Text style={styles.hint}>Ton rôle ne publie pas directement : ta sortie sera validée en 1 clic par un habilité.</Text>}
      {b.group.kind === 'pro' && (
        <View style={styles.proNote}>
          <Megaphone size={14} color={colors.cyan} />
          <Text style={styles.proNoteTxt}>Les sorties de l’organisation sont aussi promues dans Événements, sauf si « Réservée aux membres ».</Text>
        </View>
      )}

      <SectionTitle style={{ marginTop: 22 }}>À venir</SectionTitle>
      {upcoming.length ? (
        <View style={{ gap: 10 }}>
          {upcoming.map((r) => (
            <RideCard key={r.id} ctx={ctx} ride={r} />
          ))}
        </View>
      ) : (
        <EmptyState
          icon={<Bike size={22} color={colors.neonBright} />}
          title="Aucune sortie prévue"
          text={b.group.kind === 'pro' ? undefined : 'Les sorties du groupe restent visibles des seuls membres.'}
        />
      )}

      {proposed.length > 0 && (
        <>
          <SectionTitle style={{ marginTop: 22 }}>Proposées · en attente</SectionTitle>
          <View style={{ gap: 10 }}>
            {proposed.map((s) => (
              <SuggestionCard key={s.id} ctx={ctx} s={s} compact />
            ))}
          </View>
        </>
      )}

      {past.length > 0 && (
        <>
          <Pressable onPress={() => setShowPast((v) => !v)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 22 }}>
            <SectionTitle style={{ marginBottom: 0 }}>Passées ({past.length})</SectionTitle>
            {showPast ? <ChevronUp size={14} color={colors.inkMute} /> : <ChevronDown size={14} color={colors.inkMute} />}
          </Pressable>
          {showPast && (
            <View style={{ gap: 10, marginTop: 10 }}>
              {past.map((r) => (
                <RideCard key={r.id} ctx={ctx} ride={r} />
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
}
