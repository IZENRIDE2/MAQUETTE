/** Briques partagées des écrans Invitation d'amis. */
import React from 'react';
import { View, Text, StyleSheet, Pressable, Share, Platform } from 'react-native';
import { Check, Lock } from 'lucide-react-native';
import { GroupAvatar } from '@/components/groups';
import { dialog } from '@/components/Dialog';
import { colors, fonts, radius } from '@/theme';
import { inviteUrl } from '@/api/contacts';
import type { GroupSummary } from '@/api/types';

/** Partage natif du lien ; sur le web sans partage natif, affiche le lien. */
export async function shareInvite(code: string, inviterName?: string) {
  const url = inviteUrl(code);
  const message = `${inviterName ? `${inviterName} t’invite` : 'Rejoins-moi'} sur IzenRide, l’app des motards 🏍️ ${url}\nCode d’invitation : ${code}`;
  try {
    if (Platform.OS === 'web' && !(globalThis as { navigator?: { share?: unknown } }).navigator?.share) throw new Error('no-share');
    await Share.share({ message, url });
  } catch {
    await dialog.info('Ton lien d’invitation', `${url}\n\nCode : ${code}`);
  }
}

/** Liste de groupes à cocher ; ceux où l'on ne peut pas inviter passent en suggestion. */
export function GroupChecklist({
  groups,
  selected,
  onToggle,
  locked = [],
  lockedLabel = 'invité',
}: {
  groups: GroupSummary[];
  selected: string[];
  onToggle: (groupId: string) => void;
  /** Groupes déjà ouverts (non modifiables). */
  locked?: string[];
  lockedLabel?: string;
}) {
  return (
    <View style={styles.list}>
      {groups.map((g, i) => {
        const isLocked = locked.includes(g.id);
        const on = isLocked || selected.includes(g.id);
        const direct = g.myPermissions.includes('member.invite');
        return (
          <Pressable
            key={g.id}
            disabled={isLocked}
            onPress={() => onToggle(g.id)}
            style={[styles.row, i > 0 && styles.sep]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on, disabled: isLocked }}
          >
            <GroupAvatar name={g.name} kind={g.kind} size={38} verified={!!g.verifiedAt} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{g.name}</Text>
              <Text style={[styles.hint, !direct && !isLocked && { color: colors.warn }]}>
                {isLocked ? lockedLabel : direct ? 'Invitation directe' : 'Soumis à validation d’un habilité'}
              </Text>
            </View>
            <View style={[styles.box, on && styles.boxOn, isLocked && styles.boxLocked]}>
              {isLocked ? <Lock size={11} color={colors.inkDim} /> : on ? <Check size={13} color="#fff" /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 14, paddingHorizontal: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11 },
  sep: { borderTopWidth: 1, borderTopColor: colors.line },
  name: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  hint: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkMute, marginTop: 2 },
  box: { width: 22, height: 22, borderRadius: 7, borderWidth: 1.5, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: colors.neon, borderColor: colors.neon },
  boxLocked: { backgroundColor: 'rgba(255,255,255,0.06)', borderColor: colors.line },
});

export const friendStyles = StyleSheet.create({
  note: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(77,143,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.25)',
  },
  noteTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.izenLight, lineHeight: 17 },
  error: { fontFamily: fonts.medium, fontSize: 12, color: colors.warn, marginTop: 6, paddingLeft: 4 },
  pill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill, borderWidth: 1 },
  pillTxt: { fontFamily: fonts.semibold, fontSize: 10.5 },
});
