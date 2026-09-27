import type { GroupBundle, GroupFeed } from '@/api/types';

/** Ce que les onglets et cartes d'un groupe partagent. */
export type GroupCtx = {
  b: GroupBundle;
  feed: GroupFeed;
  /** Nom d'un membre, d'un invité ou d'un ancien membre. */
  nameOf: (userId: string | null | undefined) => string;
};

export function makeCtx(b: GroupBundle, feed: GroupFeed): GroupCtx {
  const names = new Map<string, string>();
  b.members.forEach((m) => names.set(m.userId, m.profile.name));
  Object.values(feed.people).forEach((p) => names.set(p.id, p.name));
  return { b, feed, nameOf: (id) => (id ? names.get(id) ?? 'Un ancien membre' : 'Un ancien membre') };
}

/** « il y a 6 h », « hier », « il y a 3 j ». */
export function ago(iso: string): string {
  const min = Math.floor((Date.now() - Date.parse(iso)) / 6e4);
  if (min < 1) return 'à l’instant';
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'hier' : `il y a ${d} j`;
}
