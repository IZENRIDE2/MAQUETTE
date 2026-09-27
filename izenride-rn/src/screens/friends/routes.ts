/** Chemins expo-router des écrans Invitation d'amis (voir app/friends/, app/welcome.tsx, app/dm/). */
export const friendRoutes = {
  invite: (groupId?: string) => (groupId ? `/friends/invite?group=${groupId}` : '/friends/invite'),
  invites: () => '/friends/invites',
  welcome: (inviteId: string) => `/friends/welcome/${inviteId}`,
  onboarding: (step?: 'groupes') => (step ? `/welcome?step=${step}` : '/welcome'),
  dm: (userId: string) => `/dm/${userId}`,
} as const;
