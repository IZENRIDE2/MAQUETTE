import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Check, Clock, ChevronRight, Users } from 'lucide-react-native';
import { Screen, Avatar, PrimaryButton, GhostButton } from '@/components';
import { GroupAvatar, LoadState, VerifiedBadge, EmptyState } from '@/components/groups';
import { dialog } from '@/components/Dialog';
import { colors, fonts, radius } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { respondGroupInvite } from '@/api/groups';
import { getMyInvitation, subscribeFriends, unlinkFriendInvite } from '@/api/friends';
import { isDemo } from '@/api/supabase';
import { demoMe, setDemoMe } from '@/api/demoStore';
import type { MyInvitation } from '@/api/types';
import { groupRoutes } from '@/screens/groups/routes';

/** Écran qui suit l'onboarding existant (Onboarding-1 Bienvenue). */
const NEXT_ONBOARDING = '/s/001';

/**
 * Onboarding de l'ami invité, après la vérification SMS / email :
 * 1. « Julie t'a invité » ; 2. groupes ouverts par Julie, à rejoindre en 1 tap.
 * `demoAs` (mode démo) : l'écran est vu par ce compte.
 */
export default function OnboardingInviteScreen({ step = 'accueil', demoAs }: { step?: 'accueil' | 'groupes'; demoAs?: string }) {
  const router = useRouter();
  const [ready, setReady] = useState(!(isDemo && demoAs));
  useEffect(() => {
    if (isDemo && demoAs && demoMe() !== demoAs) setDemoMe(demoAs);
    setReady(true);
  }, [demoAs]);

  const [current, setCurrent] = useState(step);
  const inv = useQuery(() => (ready ? getMyInvitation() : undefined), [ready], subscribeFriends);

  if (!ready || inv.data === undefined) {
    return (
      <Screen>
        <LoadState loading={!inv.error} error={inv.error} onRetry={inv.reload} />
      </Screen>
    );
  }
  if (inv.data === null) {
    return (
      <Screen>
        <EmptyState
          icon={<Users size={22} color={colors.neonBright} />}
          title="Bienvenue sur IzenRide"
          text="Aucune invitation n’est rattachée à ton compte."
          action={<PrimaryButton label="Continuer" onPress={() => router.replace(NEXT_ONBOARDING)} />}
        />
      </Screen>
    );
  }

  return current === 'accueil' ? (
    <Accueil inv={inv.data} onNext={() => setCurrent('groupes')} onSkip={() => router.replace(NEXT_ONBOARDING)} />
  ) : (
    <Groupes inv={inv.data} onDone={() => router.replace(NEXT_ONBOARDING)} />
  );
}

function Accueil({ inv, onNext, onSkip }: { inv: MyInvitation; onNext: () => void; onSkip: () => void }) {
  const open = inv.groups.filter((g) => g.status !== 'none').length;
  const notMe = async () => {
    const ok = await dialog.confirm({
      title: `Tu ne connais pas ${inv.inviter.name} ?`,
      message: 'Le rattachement sera annulé et les invitations de groupe retirées.',
      confirmLabel: 'Ce n’est pas moi',
      destructive: true,
    });
    if (ok) unlinkFriendInvite().then(onSkip).catch(dialog.error('Action impossible'));
  };
  return (
    <Screen scroll={false} edges={['top', 'bottom']}>
      <View style={styles.center}>
        <Avatar label={inv.inviter.name[0]} size={104} ring />
        <Text style={styles.kicker}>BIENVENUE SUR IZENRIDE</Text>
        <Text style={styles.title}>{inv.inviter.name} t’a invité 👋</Text>
        <Text style={styles.text}>
          Ton arrivée vient d’être signalée à {inv.inviter.name}. Vous pouvez désormais vous écrire et rouler ensemble.
        </Text>
        {open > 0 && (
          <View style={styles.teaser}>
            <Users size={16} color={colors.neonBright} />
            <Text style={styles.teaserTxt}>
              {inv.inviter.name} t’ouvre {open} groupe{open > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
      <PrimaryButton label={open ? 'Voir ses groupes' : 'Continuer'} onPress={open ? onNext : onSkip} />
      <Pressable onPress={notMe} style={styles.notMe}>
        <Text style={styles.notMeTxt}>Ce n’est pas moi</Text>
      </Pressable>
    </Screen>
  );
}

function Groupes({ inv, onDone }: { inv: MyInvitation; onDone: () => void }) {
  const router = useRouter();
  const invited = inv.groups.filter((g) => g.status === 'invited' && g.inviteId);
  const join = (inviteId: string) => respondGroupInvite(inviteId, true).catch(dialog.error('Impossible de rejoindre'));
  const joinAll = async () => {
    for (const g of invited) await respondGroupInvite(g.inviteId!, true).catch(() => {});
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <Text style={styles.kicker}>ÉTAPE 2 · TES GROUPES</Text>
      <Text style={[styles.title, { textAlign: 'left' }]}>{inv.inviter.name} t’ouvre ses groupes</Text>
      <Text style={[styles.text, { textAlign: 'left', marginBottom: 16 }]}>Rejoins-les en 1 tap. Tu pourras les quitter quand tu veux.</Text>

      <View style={{ gap: 10 }}>
        {inv.groups.map((g) => (
          <View key={g.groupId} style={styles.card}>
            <GroupAvatar name={g.name} kind={g.kind} size={48} verified={!!g.verifiedAt} />
            <View style={{ flex: 1, gap: 3 }}>
              <View style={styles.row}>
                <Text style={styles.name} numberOfLines={1}>
                  {g.name}
                </Text>
                {g.verifiedAt ? <VerifiedBadge /> : null}
              </View>
              <Text style={styles.meta}>
                {g.kind === 'pro' ? 'Organisation pro' : 'Groupe d’amis'} · {g.memberCount} membre{g.memberCount > 1 ? 's' : ''}
              </Text>
              {g.status === 'pending_approval' && (
                <View style={styles.pending}>
                  <Clock size={12} color={colors.warn} />
                  <Text style={styles.pendingTxt}>Demande envoyée</Text>
                </View>
              )}
            </View>
            {g.status === 'invited' && g.inviteId ? (
              <Pressable onPress={() => join(g.inviteId!)} style={styles.join}>
                <Text style={styles.joinTxt}>Rejoindre</Text>
              </Pressable>
            ) : g.status === 'member' ? (
              <Pressable onPress={() => router.push(groupRoutes.home(g.groupId))} style={styles.member}>
                <Check size={14} color={colors.success} />
                <ChevronRight size={14} color={colors.inkMute} />
              </Pressable>
            ) : g.status === 'none' ? (
              <Text style={styles.meta}>Indisponible</Text>
            ) : null}
          </View>
        ))}
      </View>
      {inv.groups.some((g) => g.status === 'pending_approval') && (
        <Text style={styles.hint}>Pour ces groupes, un membre habilité doit d’abord accepter ton arrivée. Tu seras prévenu.</Text>
      )}

      <View style={{ flex: 1 }} />
      {invited.length > 1 && <PrimaryButton label={`Tout rejoindre (${invited.length})`} onPress={joinAll} style={{ marginTop: 20 }} />}
      <GhostButton label={invited.length ? 'Plus tard' : 'Continuer'} onPress={onDone} style={{ marginTop: 10 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 24 },
  kicker: { fontFamily: fonts.bold, fontSize: 11, color: colors.inkMute, letterSpacing: 1.6, marginTop: 14 },
  title: { fontFamily: fonts.bold, fontSize: 26, color: colors.ink, textAlign: 'center', letterSpacing: -0.3, marginTop: 4 },
  text: { fontFamily: fonts.regular, fontSize: 14, color: colors.inkDim, textAlign: 'center', lineHeight: 20, marginTop: 4 },
  teaser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(77,143,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.35)',
  },
  teaserTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.neonBright },
  notMe: { alignSelf: 'center', paddingVertical: 16 },
  notMeTxt: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkMute, textDecorationLine: 'underline' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { flexShrink: 1, fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  meta: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim },
  join: { height: 34, paddingHorizontal: 14, borderRadius: radius.pill, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center' },
  joinTxt: { fontFamily: fonts.bold, fontSize: 13, color: '#fff' },
  member: { flexDirection: 'row', alignItems: 'center', gap: 2, padding: 6 },
  pending: { flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, borderWidth: 1, borderColor: 'rgba(251,191,36,0.4)', marginTop: 3 },
  pendingTxt: { fontFamily: fonts.semibold, fontSize: 11, color: colors.warn },
  hint: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, marginTop: 12, lineHeight: 17 },
});
