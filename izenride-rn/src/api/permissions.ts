/**
 * Catalogue fermé des permissions de groupe.
 * Doit rester aligné sur `group_permission_catalog()` côté SQL.
 */
export const PERMISSIONS = [
  'ride.create',
  'member.invite',
  'member.remove',
  'member.assign_role',
  'content.announce',
  'content.moderate',
  'poll.create',
  'accept.ride',
  'accept.member',
  'accept.content',
  'accept.poll',
  'group.edit',
  'roles.manage',
  'insights.view',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export type PermissionBlock = 'rides' | 'members' | 'content' | 'group';

export const PERMISSION_META: Record<Permission, { label: string; hint: string; block: PermissionBlock }> = {
  'ride.create': { label: 'Publier des sorties', hint: 'Sans validation', block: 'rides' },
  'accept.ride': { label: 'Valider les sorties proposées', hint: 'Accepter en 1 clic', block: 'rides' },
  'poll.create': { label: 'Lancer des sondages', hint: 'Sans validation', block: 'rides' },
  'accept.poll': { label: 'Valider les sondages proposés', hint: 'Accepter en 1 clic', block: 'rides' },
  'member.invite': { label: 'Inviter directement', hint: 'Sinon l’invitation devient une suggestion', block: 'members' },
  'accept.member': { label: 'Valider les invitations proposées', hint: 'Accepter en 1 clic', block: 'members' },
  'member.remove': { label: 'Retirer ou mettre en sourdine', hint: 'Membres de rang inférieur', block: 'members' },
  'member.assign_role': { label: 'Changer le rôle des membres', hint: 'Vers un rôle de rang inférieur', block: 'members' },
  'content.announce': { label: 'Publier et épingler des annonces', hint: 'Sans validation', block: 'content' },
  'accept.content': { label: 'Valider les annonces proposées', hint: 'Accepter en 1 clic', block: 'content' },
  'content.moderate': { label: 'Supprimer messages et médias', hint: 'D’autres membres', block: 'content' },
  'group.edit': { label: 'Modifier le groupe', hint: 'Nom, photo, description, règles', block: 'group' },
  'roles.manage': { label: 'Gérer les rôles', hint: 'Créer, modifier, réordonner', block: 'group' },
  'insights.view': { label: 'Voir le journal et les stats', hint: 'Qui a fait quoi', block: 'group' },
};

export const PERMISSION_BLOCKS: { key: PermissionBlock; label: string }[] = [
  { key: 'rides', label: 'Sorties & sondages' },
  { key: 'members', label: 'Membres' },
  { key: 'content', label: 'Contenu' },
  { key: 'group', label: 'Groupe' },
];

export const permissionsOfBlock = (block: PermissionBlock) =>
  PERMISSIONS.filter((p) => PERMISSION_META[p].block === block);

/**
 * Aperçu en une ligne d'un bloc de permissions pour l'éditeur de rôle,
 * ex. « Peut proposer des sorties, pas les publier ».
 */
export function describeBlock(block: PermissionBlock, perms: readonly Permission[]): string {
  const has = (p: Permission) => perms.includes(p);
  switch (block) {
    case 'rides':
      if (has('ride.create')) return has('accept.ride') ? 'Publie et valide les sorties' : 'Publie des sorties';
      return has('accept.ride') ? 'Valide les sorties proposées' : 'Peut proposer des sorties, pas les publier';
    case 'members':
      if (has('member.invite')) return has('member.remove') ? 'Invite et modère les membres' : 'Invite directement';
      return has('accept.member') ? 'Valide les invitations proposées' : 'Peut proposer des membres, pas les inviter';
    case 'content':
      if (has('content.announce')) return has('content.moderate') ? 'Publie et modère le contenu' : 'Publie des annonces';
      return has('accept.content') ? 'Valide les annonces proposées' : 'Peut proposer des annonces';
    case 'group': {
      const n = ['group.edit', 'roles.manage', 'insights.view'].filter((p) => has(p as Permission)).length;
      return n === 0 ? 'Aucun accès aux réglages' : n === 3 ? 'Accès complet aux réglages' : 'Accès partiel aux réglages';
    }
  }
}

/** Nuancier proposé dans l'éditeur de rôle (couleurs du thème). */
export const ROLE_COLORS = ['#fbbf24', '#b884e6', '#22d3ee', '#4ade80', '#ff5c7a', '#4d8fff', '#7a92b8', '#f59e0b'];
