import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, UserPlus, VolumeX, Volume2, UserMinus, Crown, Shield } from 'lucide-react-native';
import { Panel, Avatar } from '@/components';
import { RoleBadge, ActionSheet, SheetAction, EmptyState, form } from '@/components/groups';
import { dialog } from '@/components/Dialog';
import { colors } from '@/theme';
import { can, canActOn, manageableRoles, assignRole, muteMember, removeMember, transferFounder } from '@/api/groups';
import type { GroupBundle, GroupMember } from '@/api/types';
import { groupRoutes } from '../routes';
import { isMuted, since, tabStyles as styles } from './shared';

const fail = dialog.error;

// ---------------------------------------------------------------------------
// Membres — groupés par rôle, actions par appui long selon le rang.
// ---------------------------------------------------------------------------
export default function MembresTab({ b }: { b: GroupBundle }) {
  const [q, setQ] = useState('');
  const [target, setTarget] = useState<GroupMember | null>(null);
  const [rolePicker, setRolePicker] = useState<GroupMember | null>(null);
  const gid = b.group.id;

  const sections = useMemo(() => {
    const query = q.trim().toLowerCase();
    return b.roles
      .map((role) => ({
        role,
        members: b.members
          .filter((m) => m.roleId === role.id && (!query || m.profile.name.toLowerCase().includes(query)))
          .sort((x, y) => x.profile.name.localeCompare(y.profile.name)),
      }))
      .filter((s) => s.members.length > 0);
  }, [b, q]);

  const actionsFor = (m: GroupMember): SheetAction[] => {
    const acts: SheetAction[] = [];
    if (canActOn(b, m.userId, 'member.assign_role') && manageableRoles(b).length > 1) {
      acts.push({ label: 'Changer de rôle', icon: <Shield size={18} color={colors.ink} />, onPress: () => setRolePicker(m) });
    }
    if (canActOn(b, m.userId, 'member.remove')) {
      if (isMuted(m)) {
        acts.push({ label: 'Réactiver', icon: <Volume2 size={18} color={colors.ink} />, onPress: () => muteMember(gid, m.userId, null).catch(fail('Action impossible')) });
      } else {
        acts.push({
          label: 'Sourdine 24 h',
          hint: 'Ne peut plus écrire dans le chat',
          icon: <VolumeX size={18} color={colors.ink} />,
          onPress: () => muteMember(gid, m.userId, new Date(Date.now() + 864e5).toISOString()).catch(fail('Action impossible')),
        });
        acts.push({
          label: 'Sourdine 7 jours',
          icon: <VolumeX size={18} color={colors.ink} />,
          onPress: () => muteMember(gid, m.userId, new Date(Date.now() + 7 * 864e5).toISOString()).catch(fail('Action impossible')),
        });
      }
      acts.push({
        label: 'Retirer du groupe',
        destructive: true,
        icon: <UserMinus size={18} color={colors.danger} />,
        onPress: async () => {
          const ok = await dialog.confirm({
            title: `Retirer ${m.profile.name} ?`,
            message: 'Il ne verra plus le groupe. Tu pourras le réinviter.',
            confirmLabel: 'Retirer',
            destructive: true,
          });
          if (ok) removeMember(gid, m.userId).catch(fail('Retrait impossible'));
        },
      });
    }
    if (b.me.role.isFounder && m.userId !== b.me.userId) {
      acts.push({
        label: 'Transférer le rôle de fondateur',
        hint: 'Tu deviendras le rôle juste en dessous',
        icon: <Crown size={18} color={colors.warn} />,
        onPress: async () => {
          const ok = await dialog.confirm({
            title: `Faire de ${m.profile.name} le fondateur ?`,
            message: 'Il aura tous les droits, et toi ceux du rôle juste en dessous.',
            confirmLabel: 'Transférer',
          });
          if (ok) transferFounder(gid, m.userId).catch(fail('Transfert impossible'));
        },
      });
    }
    return acts;
  };

  const router = useRouter();
  const inviteDirect = can(b, 'member.invite');
  // Sans droit d'inviter, le même formulaire crée une suggestion « Membre ».
  const invite = () => router.push(groupRoutes.propose(gid, 'member'));

  const targetActions = target ? actionsFor(target) : [];

  return (
    <View>
      <View style={styles.memberTools}>
        <View style={form.search}>
          <Search size={14} color={colors.inkMute} />
          <TextInput value={q} onChangeText={setQ} placeholder="Rechercher un membre" placeholderTextColor={colors.inkMute} style={form.searchInput} />
        </View>
        <Pressable onPress={invite} style={styles.inviteBtn}>
          <UserPlus size={16} color="#fff" />
          <Text style={styles.inviteTxt}>{inviteDirect ? 'Inviter' : 'Proposer'}</Text>
        </Pressable>
      </View>

      {sections.map(({ role, members }) => (
        <View key={role.id} style={{ marginTop: 16 }}>
          <View style={styles.roleHead}>
            <RoleBadge name={role.name} color={role.color} />
            <Text style={styles.roleCount}>{members.length}</Text>
          </View>
          <Panel pad={4}>
            {members.map((m, i) => {
              const acts = actionsFor(m);
              return (
                <Pressable
                  key={m.userId}
                  onPress={() => acts.length && setTarget(m)}
                  onLongPress={() => acts.length && setTarget(m)}
                  style={({ pressed }) => [styles.memberRow, i > 0 && styles.memberSep, pressed && acts.length > 0 && { opacity: 0.7 }]}
                >
                  <Avatar label={m.profile.name[0]} size={38} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.memberName}>
                      {m.profile.name}
                      {m.userId === b.me.userId ? <Text style={styles.me}>  · toi</Text> : null}
                    </Text>
                    <Text style={styles.memberSub}>A rejoint {since(m.joinedAt)}</Text>
                  </View>
                  {isMuted(m) ? <VolumeX size={16} color={colors.inkMute} /> : null}
                  {acts.length > 0 ? <Text style={styles.more}>•••</Text> : null}
                </Pressable>
              );
            })}
          </Panel>
        </View>
      ))}
      {sections.length === 0 && <EmptyState icon={<Search size={22} color={colors.neonBright} />} title="Aucun membre trouvé" />}

      <ActionSheet
        visible={!!target}
        title={target?.profile.name}
        subtitle={target ? `Rôle actuel : ${b.roles.find((r) => r.id === target.roleId)?.name}` : undefined}
        actions={targetActions}
        onClose={() => setTarget(null)}
      />
      <ActionSheet
        visible={!!rolePicker}
        title={rolePicker ? `Rôle de ${rolePicker.profile.name}` : undefined}
        subtitle="Seuls les rôles de rang inférieur au tien sont proposés"
        actions={manageableRoles(b)
          .filter((r) => r.id !== rolePicker?.roleId)
          .map((r) => ({
            label: r.name,
            icon: <View style={[styles.swatch, { backgroundColor: r.color }]} />,
            onPress: () => rolePicker && assignRole(gid, rolePicker.userId, r.id).catch(fail('Changement impossible')),
          }))}
        onClose={() => setRolePicker(null)}
      />
    </View>
  );
}

