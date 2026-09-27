/** Utilitaires et styles communs aux onglets d'un groupe. */
import { StyleSheet } from 'react-native';
import { colors, fonts, radius } from '@/theme';
import { can } from '@/api/groups';
import type { GroupBundle, GroupMember } from '@/api/types';

/** Permissions qui donnent accès au tableau de bord « Gérer ». */
const MANAGE_PERMS = ['group.edit', 'roles.manage', 'member.remove', 'member.assign_role', 'insights.view'] as const;
export const canManage = (b: GroupBundle) => MANAGE_PERMS.some((p) => can(b, p));

export const since = (iso: string) => {
  const d = Math.floor((Date.now() - Date.parse(iso)) / 864e5);
  if (d < 1) return 'aujourd’hui';
  if (d < 30) return `il y a ${d} j`;
  const m = Math.floor(d / 30);
  return m < 12 ? `il y a ${m} mois` : `il y a ${Math.floor(m / 12)} an${m >= 24 ? 's' : ''}`;
};
export const isMuted = (m: GroupMember) => !!m.mutedUntil && Date.parse(m.mutedUntil) > Date.now();

export const tabStyles = StyleSheet.create({
  manageBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroKind: { fontFamily: fonts.bold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1.2 },
  heroCount: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkDim },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.pill,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 9, borderRadius: radius.pill },
  tabOn: { backgroundColor: colors.ink },
  tabTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkDim },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 10 },
  bubble: { maxWidth: '78%', paddingVertical: 9, paddingHorizontal: 12, borderRadius: radius.lg },
  bubbleOther: { backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderBottomLeftRadius: 6 },
  bubbleMine: { backgroundColor: colors.neon, borderBottomRightRadius: 6 },
  bubbleWho: { fontFamily: fonts.semibold, fontSize: 11, color: colors.neonBright, marginBottom: 2 },
  bubbleTxt: { fontFamily: fonts.regular, fontSize: 14, color: colors.ink, lineHeight: 19 },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 8,
  },
  composerTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.inkMute },
  sendBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  hint: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, marginTop: 8, textAlign: 'center' },
  proNote: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: 'rgba(34,211,238,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.25)',
  },
  proNoteTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.cyanLight, lineHeight: 17 },
  rideTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  rideMeta: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, marginTop: 4 },
  memberTools: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  inviteBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, height: 38, borderRadius: 11, backgroundColor: colors.neon },
  inviteTxt: { fontFamily: fonts.bold, fontSize: 13, color: '#fff' },
  roleHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  roleCount: { fontFamily: fonts.monoBold, fontSize: 12, color: colors.inkMute },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 10 },
  memberSep: { borderTopWidth: 1, borderTopColor: colors.line },
  memberName: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  me: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute },
  memberSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, marginTop: 2 },
  more: { fontFamily: fonts.bold, fontSize: 14, color: colors.inkMute, letterSpacing: 1, paddingHorizontal: 4 },
  swatch: { width: 14, height: 14, borderRadius: 7 },
  fieldHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  fieldLbl: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8 },
  fieldVal: { fontFamily: fonts.regular, fontSize: 14, color: colors.ink, lineHeight: 20 },
  leave: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, marginTop: 8 },
  leaveTxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.danger },
});
