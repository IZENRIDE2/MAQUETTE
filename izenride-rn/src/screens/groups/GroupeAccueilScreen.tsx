import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings2 } from 'lucide-react-native';
import { Screen, AppBar } from '@/components';
import { GroupAvatar, RoleBadge, VerifiedBadge, LoadState, DemoUserSwitcher } from '@/components/groups';
import { colors, fonts, radius } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { acceptableTypes, getGroupBundle, getGroupFeed, subscribeGroupFeed } from '@/api/groups';
import { groupRoutes, GroupTab } from './routes';
import { makeCtx } from './feed/context';
import ChatTab from './tabs/ChatTab';
import SortiesTab from './tabs/SortiesTab';
import MembresTab from './tabs/MembresTab';
import AValiderTab from './tabs/AValiderTab';
import InfosTab from './tabs/InfosTab';
import { canManage } from './tabs/shared';

/** Accueil d'un groupe : en-tête + onglets Chat, Sorties, Membres, À valider, Infos. */
export default function GroupeAccueilScreen({ groupId, initialTab = 'chat' }: { groupId: string; initialTab?: GroupTab }) {
  const router = useRouter();
  const [tab, setTab] = useState<GroupTab>(initialTab);
  const bundle = useQuery(() => getGroupBundle(groupId), [groupId]);
  const feed = useQuery(() => getGroupFeed(groupId), [groupId], (cb) => subscribeGroupFeed(groupId, cb));
  const b = bundle.data;
  const ctx = useMemo(() => (b && feed.data ? makeCtx(b, feed.data) : null), [b, feed.data]);

  if (!b || !ctx) {
    const error = bundle.error ?? feed.error;
    return (
      <Screen>
        <AppBar title="Groupe" />
        <LoadState loading={!error} error={error} onRetry={() => (bundle.reload(), feed.reload())} />
      </Screen>
    );
  }

  const { group } = b;
  const roleName = (userId: string) => b.roles.find((r) => r.id === b.members.find((m) => m.userId === userId)?.roleId)?.name ?? '—';
  const reviewer = acceptableTypes(b);
  const toValidate = ctx.feed.suggestions.filter(
    (s) => s.status === 'pending' && Date.parse(s.expiresAt) > Date.now() && reviewer.includes(s.type),
  ).length;

  const tabs: { key: GroupTab; label: string; badge?: number }[] = [
    { key: 'chat', label: 'Chat' },
    { key: 'sorties', label: 'Sorties' },
    { key: 'membres', label: 'Membres' },
    ...(reviewer.length ? [{ key: 'valider' as GroupTab, label: 'Valider', badge: toValidate }] : []),
    { key: 'infos', label: 'Infos' },
  ];
  const current = tabs.some((t) => t.key === tab) ? tab : 'chat';

  return (
    <Screen scroll={current !== 'chat'} edges={['top', 'bottom']}>
      <AppBar
        title={group.name}
        right={
          canManage(b) ? (
            <Pressable onPress={() => router.push(groupRoutes.manage(groupId))} style={styles.manageBtn} accessibilityLabel="Gérer le groupe">
              <Settings2 size={18} color={colors.ink} />
            </Pressable>
          ) : undefined
        }
      />
      <DemoUserSwitcher memberIds={b.members.map((m) => m.userId)} roleNameOf={roleName} />

      <View style={styles.hero}>
        <GroupAvatar name={group.name} kind={group.kind} size={52} verified={!!group.verifiedAt} />
        <View style={{ flex: 1, gap: 5 }}>
          <View style={styles.heroMeta}>
            <Text style={styles.heroKind}>{group.kind === 'pro' ? 'Organisation pro' : 'Groupe d’amis'}</Text>
            {group.verifiedAt ? <VerifiedBadge /> : null}
          </View>
          <View style={styles.heroMeta}>
            <Text style={styles.heroCount}>
              {b.members.length} membre{b.members.length > 1 ? 's' : ''} · privé
            </Text>
            <RoleBadge name={b.me.role.name} color={b.me.role.color} small />
          </View>
        </View>
      </View>

      <View style={styles.tabs}>
        {tabs.map(({ key, label, badge }) => {
          const on = key === current;
          return (
            <Pressable key={key} onPress={() => setTab(key)} style={[styles.tab, on && styles.tabOn]}>
              <Text style={[styles.tabTxt, on && { color: colors.bg }]} numberOfLines={1}>
                {label}
              </Text>
              {badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeTxt}>{badge}</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {current === 'chat' && <ChatTab ctx={ctx} />}
      {current === 'sorties' && <SortiesTab ctx={ctx} />}
      {current === 'membres' && <MembresTab b={b} />}
      {current === 'valider' && <AValiderTab ctx={ctx} />}
      {current === 'infos' && <InfosTab b={b} onManage={() => router.push(groupRoutes.manage(groupId))} onLeft={() => router.back()} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  manageBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroKind: { fontFamily: fonts.bold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1.2 },
  heroCount: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkDim },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.pill,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 9, borderRadius: radius.pill },
  tabOn: { backgroundColor: colors.ink },
  tabTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkDim, flexShrink: 1 },
  badge: { minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 4, backgroundColor: colors.warn, alignItems: 'center', justifyContent: 'center' },
  badgeTxt: { fontFamily: fonts.monoBold, fontSize: 9.5, color: colors.bg },
});
