import React, { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components';
import { LoadState } from '@/components/groups';
import { supabase, isDemo } from '@/api/supabase';
import { claimFriendInvite, savePendingInviteCode } from '@/api/friends';
import { friendRoutes } from '@/screens/friends/routes';

/**
 * Lien d'invitation ouvert dans l'app (izenride://i/<CODE> ou
 * https://izenride.app/i/<CODE>). Connecté : rattachement immédiat.
 * Sinon : le code est gardé et pré-remplit l'inscription.
 */
export default function InviteLinkRoute() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const router = useRouter();
  useEffect(() => {
    (async () => {
      await savePendingInviteCode(code);
      const session = isDemo ? null : (await supabase!.auth.getSession()).data.session;
      if (session) {
        const r = await claimFriendInvite(code).catch(() => null);
        router.replace(r && r.status !== 'none' ? friendRoutes.onboarding() : '/');
      } else {
        router.replace('/s/006');
      }
    })();
  }, [code, router]);
  return (
    <Screen>
      <LoadState loading />
    </Screen>
  );
}
