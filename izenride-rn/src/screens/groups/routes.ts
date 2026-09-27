/** Chemins expo-router des écrans Groupes (voir app/groups/). */
import type { SuggestionType } from '@/api/types';

export type GroupTab = 'chat' | 'sorties' | 'membres' | 'valider' | 'infos';

export const groupRoutes = {
  create: () => '/groups/new',
  home: (groupId: string, tab?: GroupTab) => (tab ? `/groups/${groupId}?tab=${tab}` : `/groups/${groupId}`),
  manage: (groupId: string) => `/groups/${groupId}/manage`,
  roles: (groupId: string) => `/groups/${groupId}/roles`,
  role: (groupId: string, roleId: string | 'new') => `/groups/${groupId}/roles/${roleId}`,
  /** Créer ou proposer ; avec `suggestionId` : modifier puis accepter. */
  propose: (groupId: string, type: SuggestionType, suggestionId?: string) =>
    `/groups/${groupId}/propose/${type}${suggestionId ? `?suggestion=${suggestionId}` : ''}`,
  suggestion: (groupId: string, suggestionId: string) => `/groups/${groupId}/suggestions/${suggestionId}`,
  mine: (groupId: string) => `/groups/${groupId}/mine`,
} as const;
