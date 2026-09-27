import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Users } from 'lucide-react-native';
import { GroupAvatar, RoleBadge, VerifiedBadge, EmptyState } from '@/components/groups';
import { PrimaryButton } from '@/components';
import { colors, fonts } from '@/theme';
import type { GroupSummary } from '@/api/types';
import { groupRoutes } from '@/screens/groups/routes';

/** Bandeau horizontal « Mes groupes » en haut de Messages. */
export function MyGroupsStrip({ groups }: { groups: GroupSummary[] }) {
  const router = useRouter();
  return (
    <View style={styles.section}>
      <View style={styles.head}>
        <View style={styles.titleRow}>
          <Users size={11} color={colors.neonBright} />
          <Text style={styles.title}>Mes groupes</Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.strip}>
        <Pressable onPress={() => router.push(groupRoutes.create())} style={styles.card}>
          <View style={styles.newAv}>
            <Plus size={22} color={colors.neonBright} />
          </View>
          <Text style={[styles.name, { color: colors.neonBright }]}>Créer</Text>
        </Pressable>
        {groups.map((g) => (
          <Pressable key={g.id} onPress={() => router.push(groupRoutes.home(g.id))} style={styles.card}>
            <GroupAvatar name={g.name} kind={g.kind} verified={!!g.verifiedAt} />
            <Text style={styles.name} numberOfLines={1}>
              {g.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

/** Liste affichée quand le filtre « Groupes » est actif. */
export function GroupConversations({ groups }: { groups: GroupSummary[] }) {
  const router = useRouter();
  if (groups.length === 0) {
    return (
      <EmptyState
        icon={<Users size={22} color={colors.neonBright} />}
        title="Aucun groupe pour l’instant"
        text="Crée le groupe de ta bande pour organiser vos sorties entre vous."
        action={<PrimaryButton label="Créer un groupe" onPress={() => router.push(groupRoutes.create())} />}
      />
    );
  }
  return (
    <View>
      <Text style={styles.sectionHead}>Groupes</Text>
      {groups.map((g) => (
        <Pressable key={g.id} onPress={() => router.push(groupRoutes.home(g.id))} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
          <GroupAvatar name={g.name} kind={g.kind} size={48} verified={!!g.verifiedAt} />
          <View style={{ flex: 1, gap: 4 }}>
            <View style={styles.rowTop}>
              <Text style={styles.rowName} numberOfLines={1}>
                {g.name}
              </Text>
              {g.verifiedAt ? <VerifiedBadge /> : null}
            </View>
            <View style={styles.rowTop}>
              <Text style={styles.rowSub}>
                {g.kind === 'pro' ? 'Organisation pro' : 'Groupe d’amis'} · {g.memberCount} membre{g.memberCount > 1 ? 's' : ''}
              </Text>
              <RoleBadge name={g.myRole.name} color={g.myRole.color} small />
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: colors.line },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  title: { fontFamily: fonts.bold, fontSize: 11, color: colors.inkDim, letterSpacing: 1.2, textTransform: 'uppercase' },
  strip: { gap: 14, paddingBottom: 10 },
  card: { width: 64, alignItems: 'center', gap: 6 },
  newAv: {
    width: 52,
    height: 52,
    borderRadius: 17,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(77,143,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkDim, maxWidth: 64 },
  sectionHead: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.inkDim,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 11 },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  rowName: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  rowSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, flexShrink: 1 },
});
