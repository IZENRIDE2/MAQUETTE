import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronUp, ChevronDown, ChevronRight, Plus, Lock, Crown, UserCheck } from 'lucide-react-native';
import { Screen, AppBar, Panel, PrimaryButton } from '@/components';
import { LoadState, DemoUserSwitcher } from '@/components/groups';
import { colors, fonts, radius } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { getGroupBundle, can, reorderRoles } from '@/api/groups';
import { PERMISSIONS } from '@/api/permissions';
import { groupRoutes } from './routes';

/**
 * Liste des rôles, du plus haut au plus bas rang. Les flèches réordonnent
 * les rôles gérables (rang strictement inférieur au sien).
 */
export default function RolesDuGroupeScreen({ groupId }: { groupId: string }) {
  const router = useRouter();
  const { data: b, error, loading, reload } = useQuery(() => getGroupBundle(groupId), [groupId]);

  if (!b) {
    return (
      <Screen>
        <AppBar title="Rôles" />
        <LoadState loading={loading} error={error} onRetry={reload} />
      </Screen>
    );
  }

  const manage = can(b, 'roles.manage');
  const myRank = b.me.role.rank;
  const movable = b.roles.filter((r) => !r.isFounder && r.rank < myRank);
  const roleNameOf = (userId: string) => b.roles.find((r) => r.id === b.members.find((m) => m.userId === userId)?.roleId)?.name ?? '—';

  const move = (roleId: string, dir: -1 | 1) => {
    const ids = movable.map((r) => r.id);
    const i = ids.indexOf(roleId);
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j]!, ids[i]!];
    reorderRoles(groupId, ids).catch((e) => Alert.alert('Réordonnancement impossible', (e as Error).message));
  };

  return (
    <Screen>
      <AppBar title="Rôles et permissions" />
      <DemoUserSwitcher memberIds={b.members.map((m) => m.userId)} roleNameOf={roleNameOf} />
      <Text style={styles.lead}>
        Le rôle le plus haut l’emporte. On ne peut modifier, attribuer ou réordonner que les rôles situés sous le sien.
      </Text>

      <Panel pad={4}>
        {b.roles.map((r, i) => {
          const count = b.members.filter((m) => m.roleId === r.id).length;
          const perms = r.isFounder ? PERMISSIONS.length : r.permissions.length;
          const editable = manage && !r.isFounder && r.rank < myRank;
          const mi = movable.findIndex((x) => x.id === r.id);
          return (
            <View key={r.id} style={[styles.row, i > 0 && styles.sep]}>
              <Pressable
                disabled={!editable}
                onPress={() => router.push(groupRoutes.role(groupId, r.id))}
                style={({ pressed }) => [styles.main, pressed && { opacity: 0.7 }]}
              >
                <View style={[styles.swatch, { backgroundColor: r.color }]}>
                  {r.isFounder ? <Crown size={12} color={colors.bg} /> : r.isDefault ? <UserCheck size={12} color={colors.bg} /> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{r.name}</Text>
                  <Text style={styles.meta}>
                    {count} membre{count > 1 ? 's' : ''} · {perms}/{PERMISSIONS.length} permissions
                    {r.isDefault ? ' · nouveaux membres' : ''}
                  </Text>
                </View>
                {editable ? <ChevronRight size={18} color={colors.inkMute} /> : <Lock size={14} color={colors.inkMute} />}
              </Pressable>
              {manage && mi >= 0 && (
                <View style={styles.arrows}>
                  <Pressable disabled={mi === 0} onPress={() => move(r.id, -1)} hitSlop={6} style={[styles.arrow, mi === 0 && { opacity: 0.25 }]}>
                    <ChevronUp size={16} color={colors.ink} />
                  </Pressable>
                  <Pressable
                    disabled={mi === movable.length - 1}
                    onPress={() => move(r.id, 1)}
                    hitSlop={6}
                    style={[styles.arrow, mi === movable.length - 1 && { opacity: 0.25 }]}
                  >
                    <ChevronDown size={16} color={colors.ink} />
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
      </Panel>

      {manage ? (
        <PrimaryButton label="Créer un rôle" icon={<Plus size={18} color="#fff" />} onPress={() => router.push(groupRoutes.role(groupId, 'new'))} style={{ marginTop: 18 }} />
      ) : (
        <Text style={styles.readonly}>Ton rôle permet d’attribuer des rôles, pas de les modifier.</Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim, lineHeight: 19, marginBottom: 14 },
  row: { flexDirection: 'row', alignItems: 'center' },
  sep: { borderTopWidth: 1, borderTopColor: colors.line },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 12 },
  swatch: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  meta: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, marginTop: 2 },
  arrows: { paddingRight: 8, gap: 2 },
  arrow: { width: 30, height: 22, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  readonly: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, marginTop: 14, textAlign: 'center' },
});
