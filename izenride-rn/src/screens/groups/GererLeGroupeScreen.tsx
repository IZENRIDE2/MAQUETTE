import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Inbox, Users, Shield, Pencil, History, ChevronRight, Lock, BarChart3, BadgeCheck } from 'lucide-react-native';
import { proRoutes } from '@/screens/pro/routes';
import { Screen, AppBar, Panel } from '@/components';
import { LoadState, DemoUserSwitcher, SectionTitle } from '@/components/groups';
import { colors, fonts, radius } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { getGroupBundle, listActivity, listMyGroups, can } from '@/api/groups';
import type { ActivityEntry, GroupBundle } from '@/api/types';
import { groupRoutes } from './routes';

/** Phrase lisible pour une entrée du journal d'activité. */
export function describeActivity(e: ActivityEntry, nameOf: (id: string | null | undefined) => string): string {
  const t = e.target as Record<string, string | undefined>;
  const who = nameOf(e.actorId);
  switch (e.action) {
    case 'group.created':
      return `${who} a créé le groupe`;
    case 'group.updated':
      return `${who} a modifié les infos du groupe`;
    case 'role.created':
      return `${who} a créé le rôle « ${t.name} »`;
    case 'role.updated':
      return `${who} a modifié le rôle « ${t.name} »`;
    case 'role.deleted':
      return `${who} a supprimé le rôle « ${t.name} »`;
    case 'roles.reordered':
      return `${who} a réordonné les rôles`;
    case 'member.role_changed':
      return `${who} a passé ${nameOf(t.user_id)} en « ${t.role_name} »`;
    case 'member.removed':
      return `${who} a retiré ${nameOf(t.user_id)}`;
    case 'member.muted':
      return `${who} a mis ${nameOf(t.user_id)} en sourdine`;
    case 'member.unmuted':
      return `${who} a réactivé ${nameOf(t.user_id)}`;
    case 'member.left':
      return `${who} a quitté le groupe`;
    case 'member.joined':
      return `${nameOf(t.user_id)} a rejoint le groupe`;
    case 'suggestion.accepted':
      return `${who} a accepté une suggestion de ${nameOf(t.author_id)}`;
    case 'suggestion.accepted_edited':
      return `${who} a modifié puis accepté une suggestion de ${nameOf(t.author_id)}`;
    case 'suggestion.refused':
      return `${who} a refusé une suggestion de ${nameOf(t.author_id)}`;
    case 'ride.created':
      return `Nouvelle sortie publiée (${nameOf(t.author_id)})`;
    case 'poll.created':
      return `Nouveau sondage lancé (${nameOf(t.author_id)})`;
    case 'announcement.created':
      return `Nouvelle annonce publiée (${nameOf(t.author_id)})`;
    case 'member.created':
      return `${nameOf(t.author_id)} a invité un nouveau membre`;
    case 'verification.requested':
      return `${who} a demandé le badge vérifié`;
    case 'verification.approved':
      return 'L’équipe IzenRide a vérifié l’organisation';
    case 'verification.rejected':
      return 'L’équipe IzenRide a refusé la demande de badge';
    case 'verification.revoked':
      return 'L’équipe IzenRide a retiré le badge vérifié';
    case 'founder.transferred':
      return `${who} a transmis le rôle de fondateur à ${nameOf(t.user_id)}`;
    default:
      return `${who} · ${e.action}`;
  }
}

const ago = (iso: string) => {
  const h = Math.floor((Date.now() - Date.parse(iso)) / 36e5);
  if (h < 1) return 'à l’instant';
  if (h < 24) return `il y a ${h} h`;
  return `il y a ${Math.floor(h / 24)} j`;
};

/** Tableau de bord « Gérer » : raccourcis vers tout ce que le rôle permet. */
export default function GererLeGroupeScreen({ groupId }: { groupId: string }) {
  const router = useRouter();
  const { data: b, error, loading, reload } = useQuery(() => getGroupBundle(groupId), [groupId]);
  const { data: groups } = useQuery(listMyGroups, []);

  if (!b) {
    return (
      <Screen>
        <AppBar title="Gérer" />
        <LoadState loading={loading} error={error} onRetry={reload} />
      </Screen>
    );
  }

  const nameOf = (id: string | null | undefined) => b.members.find((m) => m.userId === id)?.profile.name ?? 'Un ancien membre';
  const roleNameOf = (userId: string) => b.roles.find((r) => r.id === b.members.find((m) => m.userId === userId)?.roleId)?.name ?? '—';
  const recent = [...b.members].sort((x, y) => y.joinedAt.localeCompare(x.joinedAt)).slice(0, 3);
  const canValidate = b.me.permissions.some((p) => p.startsWith('accept.'));
  const toValidate = groups?.find((g) => g.id === groupId)?.toValidate ?? 0;

  const tiles = [
    {
      key: 'inbox',
      show: canValidate,
      Icon: Inbox,
      title: 'À valider',
      sub: toValidate ? `${toValidate} suggestion${toValidate > 1 ? 's' : ''} en attente` : 'Rien en attente',
      onPress: (() => router.push(groupRoutes.home(groupId, 'valider'))) as (() => void) | undefined,
    },
    {
      key: 'members',
      show: true,
      Icon: Users,
      title: 'Membres',
      sub: `${b.members.length} membres · ${recent.map((m) => m.profile.name).join(', ')} récemment`,
      onPress: () => router.push(groupRoutes.home(groupId, 'membres')),
    },
    {
      key: 'roles',
      show: can(b, 'roles.manage') || can(b, 'member.assign_role'),
      Icon: Shield,
      title: 'Rôles et permissions',
      sub: `${b.roles.length} rôles`,
      onPress: () => router.push(groupRoutes.roles(groupId)),
    },
    {
      key: 'infos',
      show: can(b, 'group.edit'),
      Icon: Pencil,
      title: 'Infos du groupe',
      sub: 'Nom, description, règles, lieu de RDV',
      onPress: () => router.push(groupRoutes.home(groupId, 'infos')),
    },
    {
      key: 'stats',
      show: can(b, 'insights.view'),
      Icon: BarChart3,
      title: 'Statistiques',
      sub: 'Membres, engagement, sorties, suggestions',
      onPress: () => router.push(proRoutes.stats(groupId)),
    },
    {
      key: 'journal',
      show: can(b, 'insights.view'),
      Icon: History,
      title: 'Journal complet',
      sub: 'Filtrable par type et par personne',
      onPress: () => router.push(proRoutes.journal(groupId)),
    },
    {
      key: 'badge',
      show: b.group.kind === 'pro' && (b.me.role.isFounder || can(b, 'group.edit')),
      Icon: BadgeCheck,
      title: 'Badge vérifié',
      sub: b.group.verifiedAt ? 'Organisation vérifiée' : 'Faire vérifier l’organisation',
      onPress: () => router.push(proRoutes.verification(groupId)),
    },
  ].filter((t) => t.show);

  return (
    <Screen>
      <AppBar title="Gérer le groupe" />
      <DemoUserSwitcher memberIds={b.members.map((m) => m.userId)} roleNameOf={roleNameOf} />
      <Text style={styles.groupName}>{b.group.name}</Text>

      <Panel pad={4}>
        {tiles.map(({ key, Icon, title, sub, onPress }, i) => (
          <Pressable
            key={key}
            disabled={!onPress}
            onPress={onPress}
            style={({ pressed }) => [styles.tile, i > 0 && styles.sep, pressed && { opacity: 0.7 }]}
          >
            <View style={styles.tileIcon}>
              <Icon size={18} color={colors.neonBright} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.tileTitle, !onPress && { color: colors.inkDim }]}>{title}</Text>
              <Text style={styles.tileSub} numberOfLines={1}>
                {sub}
              </Text>
            </View>
            {onPress ? <ChevronRight size={18} color={colors.inkMute} /> : null}
          </Pressable>
        ))}
      </Panel>

      <SectionTitle style={{ marginTop: 22 }}>Journal d’activité</SectionTitle>
      {can(b, 'insights.view') ? <ActivityList b={b} nameOf={nameOf} /> : <LockedLog />}
    </Screen>
  );
}

function ActivityList({ b, nameOf }: { b: GroupBundle; nameOf: (id: string | null | undefined) => string }) {
  const { data } = useQuery(() => listActivity(b.group.id), [b.group.id]);
  if (!data) return null;
  return (
    <Panel pad={4}>
      {data.slice(0, 12).map((e, i) => (
        <View key={e.id} style={[styles.logRow, i > 0 && styles.sep]}>
          <History size={14} color={colors.inkMute} style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.logTxt}>{describeActivity(e, nameOf)}</Text>
            <Text style={styles.logWhen}>{ago(e.createdAt)}</Text>
          </View>
        </View>
      ))}
      {data.length === 0 && <Text style={[styles.logTxt, { padding: 12, color: colors.inkMute }]}>Rien pour l’instant.</Text>}
    </Panel>
  );
}

function LockedLog() {
  return (
    <View style={styles.locked}>
      <Lock size={14} color={colors.inkMute} />
      <Text style={styles.lockedTxt}>Réservé aux rôles qui peuvent voir le journal.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  groupName: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink, marginBottom: 14 },
  tile: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 12 },
  sep: { borderTopWidth: 1, borderTopColor: colors.line },
  tileIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(77,143,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  tileSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, marginTop: 2 },
  logRow: { flexDirection: 'row', gap: 10, paddingVertical: 11, paddingHorizontal: 12 },
  logTxt: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink, lineHeight: 18 },
  logWhen: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginTop: 2 },
  locked: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  lockedTxt: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute },
});
