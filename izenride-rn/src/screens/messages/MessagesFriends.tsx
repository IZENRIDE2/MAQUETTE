/**
 * Messages · lot 3 : carte « X vient d'arriver » (inviteur), bandeau
 * « Julie t'a ouvert N groupes » (ami invité, 7 jours) et messages directs.
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { PartyPopper, X, Users, ChevronRight, MessageCircle } from 'lucide-react-native';
import { Avatar } from '@/components';
import { dialog } from '@/components/Dialog';
import { colors, fonts, radius } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { getMyInvitation, listDirectThreads, listMyFriendInvites, markFriendWelcomed, subscribeDirectMessages, subscribeFriends } from '@/api/friends';
import { ago } from '@/screens/groups/feed/context';
import { friendRoutes } from '@/screens/friends/routes';

const WEEK = 7 * 864e5;

export function FriendsSection() {
  const router = useRouter();
  const invites = useQuery(listMyFriendInvites, [], subscribeFriends);
  const mine = useQuery(getMyInvitation, [], subscribeFriends);
  const threads = useQuery(listDirectThreads, [], subscribeDirectMessages);

  const toWelcome = (invites.data ?? []).filter((i) => i.status === 'claimed' && !i.welcomedAt && i.friend);
  const inv = mine.data;
  const openGroups = inv && Date.now() - Date.parse(inv.claimedAt) < WEEK ? inv.groups.filter((g) => g.status === 'invited').length : 0;

  if (!toWelcome.length && !openGroups && !threads.data?.length) return null;

  return (
    <View style={styles.wrap}>
      {toWelcome.map((i) => (
        <View key={i.id} style={styles.welcome}>
          <Avatar label={i.friend!.name[0]} size={42} />
          <Pressable style={{ flex: 1 }} onPress={() => router.push(friendRoutes.welcome(i.id))}>
            <View style={styles.titleRow}>
              <PartyPopper size={13} color={colors.warn} />
              <Text style={styles.title}>{i.friend!.name} vient d’arriver</Text>
            </View>
            <Text style={styles.sub}>Souhaite-lui la bienvenue et ouvre-lui tes groupes · {i.claimedAt ? ago(i.claimedAt) : ''}</Text>
          </Pressable>
          <Pressable
            onPress={() => markFriendWelcomed(i.id).catch(dialog.error('Action impossible'))}
            hitSlop={8}
            style={styles.close}
            accessibilityLabel="Masquer"
          >
            <X size={14} color={colors.inkMute} />
          </Pressable>
        </View>
      ))}

      {inv && openGroups > 0 && (
        <Pressable onPress={() => router.push(friendRoutes.onboarding('groupes'))} style={styles.banner}>
          <Users size={16} color={colors.neonBright} />
          <Text style={styles.bannerTxt}>
            {inv.inviter.name} t’a ouvert {openGroups} groupe{openGroups > 1 ? 's' : ''}
          </Text>
          <ChevronRight size={16} color={colors.neonBright} />
        </Pressable>
      )}

      {!!threads.data?.length && (
        <>
          <View style={styles.headRow}>
            <MessageCircle size={11} color={colors.neonBright} />
            <Text style={styles.head}>Messages directs</Text>
          </View>
          {threads.data.map((t) => (
            <Pressable key={t.other.id} onPress={() => router.push(friendRoutes.dm(t.other.id))} style={styles.thread}>
              <Avatar label={t.other.name[0]} size={40} />
              <View style={{ flex: 1 }}>
                <Text style={styles.threadName}>{t.other.name}</Text>
                <Text style={styles.sub} numberOfLines={1}>
                  {t.last.kind === 'wave' ? '🤘 V de motard' : t.last.kind === 'ride' ? `🏍️ Sortie : ${t.last.payload?.title ?? ''}` : t.last.body}
                </Text>
              </View>
              <Text style={styles.when}>{ago(t.last.createdAt)}</Text>
            </Pressable>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6, gap: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  welcome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.35)',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  sub: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, marginTop: 2 },
  close: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(77,143,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.35)',
  },
  bannerTxt: { flex: 1, fontFamily: fonts.semibold, fontSize: 13, color: colors.neonBright },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 4 },
  head: { fontFamily: fonts.bold, fontSize: 11, color: colors.inkDim, letterSpacing: 1.2, textTransform: 'uppercase' },
  thread: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  threadName: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  when: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },
});
