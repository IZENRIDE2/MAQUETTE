/**
 * Rattachement automatique à la connexion (Supabase) : une fois par compte,
 * tente `claim_friend_invite` avec le code gardé depuis le lien (ou sans code :
 * le serveur cherche alors le téléphone / l'email vérifiés). Si un rattachement
 * a lieu, ouvre l'onboarding de l'ami invité.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { supabase, isDemo } from '@/api/supabase';
import { claimFriendInvite, readPendingInviteCode } from '@/api/friends';
import { friendRoutes } from '@/screens/friends/routes';

const checkedKey = (userId: string) => `izenride.claimChecked.${userId}`;

async function tryClaim(userId: string) {
  const code = await readPendingInviteCode();
  if (!code && (await AsyncStorage.getItem(checkedKey(userId)).catch(() => null))) return;
  const r = await claimFriendInvite(code).catch(() => null);
  if (!r) return;
  await AsyncStorage.setItem(checkedKey(userId), '1').catch(() => {});
  if (r.status === 'claimed') router.push(friendRoutes.onboarding());
}

export function startClaimOnSignIn(): () => void {
  if (isDemo) return () => {};
  const { data } = supabase!.auth.onAuthStateChange((event, session) => {
    if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) tryClaim(session.user.id);
  });
  return () => data.subscription.unsubscribe();
}
