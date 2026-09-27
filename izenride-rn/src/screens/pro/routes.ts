/** Chemins expo-router des écrans Groupes pro (lot 4). */
export const proRoutes = {
  verification: (groupId: string) => `/groups/${groupId}/verification`,
  stats: (groupId: string) => `/groups/${groupId}/stats`,
  journal: (groupId: string) => `/groups/${groupId}/journal`,
  moderation: () => '/moderation',
  publicRide: (rideId: string) => `/events/pro/${rideId}`,
} as const;
