/**
 * Notifications push des suggestions de groupe (Expo).
 * - Enregistre le jeton Expo de l'appareil (RPC register_push_token).
 * - Déclare la catégorie `group_suggestion` : boutons Accepter / Refuser…
 *   directement dans la notification.
 * - Accepter : décide en 1 clic puis ouvre la suggestion ; Refuser… ouvre la
 *   suggestion pour saisir le motif (obligatoire).
 * Inactif sur le web et en mode démo. Nécessite un projectId EAS
 * (app.json → extra.eas.projectId) pour obtenir un jeton.
 */
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { isDemo } from '@/api/supabase';
import { decideSuggestion, registerPushToken } from '@/api/groups';
import { dialog } from '@/components/Dialog';
import { groupRoutes } from '@/screens/groups/routes';
import { friendRoutes } from '@/screens/friends/routes';

export const SUGGESTION_CATEGORY = 'group_suggestion';

type SuggestionData = { kind?: string; suggestionId?: string; groupId?: string; inviteId?: string; fromId?: string };

async function registerDevice() {
  let { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') status = (await Notifications.requestPermissionsAsync()).status;
  if (status !== 'granted') return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'IzenRide',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  const projectId = (Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined)?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) return;
  const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
  await registerPushToken(data, Platform.OS === 'ios' ? 'ios' : 'android');
}

const handled = new Set<string>();

async function onResponse(response: Notifications.NotificationResponse) {
  const id = response.notification.request.identifier + response.actionIdentifier;
  if (handled.has(id)) return;
  handled.add(id);

  const d = response.notification.request.content.data as SuggestionData;
  // Lot 3 : ami arrivé -> écran de bienvenue ; message 1-1 -> conversation.
  if (d?.kind === 'friend_joined' && d.inviteId) return void router.push(friendRoutes.welcome(d.inviteId));
  if (d?.kind === 'direct_message' && d.fromId) return void router.push(friendRoutes.dm(d.fromId));
  if (d?.kind !== 'group_suggestion' || !d.suggestionId || !d.groupId) return;

  if (response.actionIdentifier === 'accept') {
    try {
      const r = await decideSuggestion(d.suggestionId, true);
      await dialog.info(r.status === 'expired' ? 'Suggestion expirée' : 'Suggestion acceptée', r.status === 'expired' ? 'Rien n’a été créé.' : undefined);
    } catch (e) {
      await dialog.error('Acceptation impossible')(e);
    }
  }
  router.push(groupRoutes.suggestion(d.groupId, d.suggestionId));
}

/** À appeler une fois au démarrage ; renvoie la fonction de nettoyage. */
export async function initNotifications(): Promise<() => void> {
  if (Platform.OS === 'web' || isDemo) return () => {};

  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: true }),
  });
  await Notifications.setNotificationCategoryAsync(SUGGESTION_CATEGORY, [
    { identifier: 'accept', buttonTitle: 'Accepter', options: { opensAppToForeground: true } },
    { identifier: 'refuse', buttonTitle: 'Refuser…', options: { opensAppToForeground: true } },
  ]);

  const sub = Notifications.addNotificationResponseReceivedListener(onResponse);
  registerDevice().catch(() => {});
  // Application ouverte depuis une notification (démarrage à froid).
  const last = await Notifications.getLastNotificationResponseAsync();
  if (last) onResponse(last);
  return () => sub.remove();
}
