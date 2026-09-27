/** Chemins expo-router des écrans Groupes (voir app/groups/). */
export type GroupTab = 'chat' | 'sorties' | 'membres' | 'infos';

export const groupRoutes = {
  create: () => '/groups/new',
  home: (groupId: string, tab?: GroupTab) => (tab ? `/groups/${groupId}?tab=${tab}` : `/groups/${groupId}`),
  manage: (groupId: string) => `/groups/${groupId}/manage`,
  roles: (groupId: string) => `/groups/${groupId}/roles`,
  role: (groupId: string, roleId: string | 'new') => `/groups/${groupId}/roles/${roleId}`,
} as const;
