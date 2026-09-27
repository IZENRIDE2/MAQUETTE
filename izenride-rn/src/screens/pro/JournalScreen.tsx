import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { History, Lock } from 'lucide-react-native';
import { Screen, AppBar } from '@/components';
import { EmptyState, LoadState } from '@/components/groups';
import { colors, fonts, radius } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { can, getGroupBundle, listActivity } from '@/api/groups';
import { formatRideDate } from '@/api/payloads';
import { describeActivity } from '@/screens/groups/GererLeGroupeScreen';

const CATEGORIES: { key: string; label: string; match: (action: string) => boolean }[] = [
  { key: 'all', label: 'Tout', match: () => true },
  { key: 'members', label: 'Membres', match: (a) => a.startsWith('member.') && a !== 'member.created' || a.startsWith('founder.') },
  { key: 'roles', label: 'Rôles', match: (a) => a.startsWith('role') },
  { key: 'suggestions', label: 'Suggestions', match: (a) => a.startsWith('suggestion.') },
  { key: 'content', label: 'Contenu', match: (a) => /^(ride|poll|announcement|member)\.created$/.test(a) },
  { key: 'group', label: 'Groupe', match: (a) => a.startsWith('group.') || a.startsWith('verification.') },
];

/** Journal d'activité (insights.view) : qui a fait quoi, filtrable, conservé 12 mois. */
export default function JournalScreen({ groupId }: { groupId: string }) {
  const bundle = useQuery(() => getGroupBundle(groupId), [groupId]);
  const log = useQuery(() => (bundle.data && can(bundle.data, 'insights.view') ? listActivity(groupId) : []), [groupId, !!bundle.data]);
  const [cat, setCat] = useState('all');
  const [actor, setActor] = useState<string | null>(null);

  const b = bundle.data;
  const nameOf = (id: string | null | undefined) => b?.members.find((m) => m.userId === id)?.profile.name ?? 'Un ancien membre';
  const actors = useMemo(() => [...new Set((log.data ?? []).map((e) => e.actorId).filter((x): x is string => !!x))], [log.data]);

  if (!b || !log.data) {
    return (
      <Screen>
        <AppBar title="Journal" />
        <LoadState loading={!bundle.error && !log.error} error={bundle.error ?? log.error} onRetry={log.reload} />
      </Screen>
    );
  }
  if (!can(b, 'insights.view')) {
    return (
      <Screen>
        <AppBar title="Journal" />
        <EmptyState icon={<Lock size={22} color={colors.inkMute} />} title="Accès réservé" text="Ton rôle ne permet pas de voir le journal." />
      </Screen>
    );
  }

  const match = CATEGORIES.find((c) => c.key === cat)!.match;
  const entries = log.data.filter((e) => match(e.action) && (!actor || e.actorId === actor));

  return (
    <Screen>
      <AppBar title="Journal d’activité" />
      <Text style={styles.lead}>Qui a fait quoi dans {b.group.name}. Conservé 12 mois.</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={{ flexGrow: 0 }}>
        {CATEGORIES.map((c) => (
          <Chip key={c.key} label={c.label} on={cat === c.key} onPress={() => setCat(c.key)} />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={{ flexGrow: 0 }}>
        <Chip label="Tout le monde" on={!actor} onPress={() => setActor(null)} />
        {actors.map((id) => (
          <Chip key={id} label={nameOf(id)} on={actor === id} onPress={() => setActor(id)} />
        ))}
      </ScrollView>

      {entries.length === 0 ? (
        <EmptyState icon={<History size={22} color={colors.neonBright} />} title="Rien à afficher" text="Aucune action pour ces filtres." />
      ) : (
        <View style={styles.list}>
          {entries.map((e, i) => (
            <View key={e.id} style={[styles.row, i > 0 && styles.sep]}>
              <History size={14} color={colors.inkMute} style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.txt}>{describeActivity(e, nameOf)}</Text>
                <Text style={styles.when}>{formatRideDate(e.createdAt)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

function Chip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, on && styles.chipOn]}>
      <Text style={[styles.chipTxt, on && { color: colors.bg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  lead: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim, marginBottom: 12 },
  chips: { gap: 8, paddingBottom: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkDim },
  list: { marginTop: 4, borderRadius: 16, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12 },
  row: { flexDirection: 'row', gap: 10, paddingVertical: 12 },
  sep: { borderTopWidth: 1, borderTopColor: colors.line },
  txt: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink, lineHeight: 18 },
  when: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginTop: 2 },
});
