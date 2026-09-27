import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Check, Trash2 } from 'lucide-react-native';
import { Screen, AppBar, Panel, PrimaryButton, SectionLabel, Switch } from '@/components';
import { LoadState, RoleBadge } from '@/components/groups';
import { colors, fonts, radius } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { getGroupBundle, upsertRole, deleteRole, can } from '@/api/groups';
import {
  Permission,
  PERMISSION_BLOCKS,
  PERMISSION_META,
  ROLE_COLORS,
  describeBlock,
  permissionsOfBlock,
} from '@/api/permissions';

/**
 * Éditeur de rôle : nom, couleur, permissions groupées en 4 blocs avec un
 * aperçu en une ligne par bloc. `roleId = 'new'` pour créer.
 */
export default function EditeurDeRoleScreen({ groupId, roleId }: { groupId: string; roleId: string }) {
  const router = useRouter();
  const { data: b, error, loading, reload } = useQuery(() => getGroupBundle(groupId), [groupId]);
  const isNew = roleId === 'new';
  const role = b?.roles.find((r) => r.id === roleId);

  const [name, setName] = useState('');
  const [color, setColor] = useState(ROLE_COLORS[3]!);
  const [perms, setPerms] = useState<Permission[]>([]);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!b || ready) return;
    if (role) {
      setName(role.name);
      setColor(role.color);
      setPerms(role.permissions);
    }
    setReady(true);
  }, [b, role, ready]);

  if (!b || !ready) {
    return (
      <Screen>
        <AppBar title="Rôle" />
        <LoadState loading={loading || !!b} error={error} onRetry={reload} />
      </Screen>
    );
  }

  if (!can(b, 'roles.manage') || (!isNew && (!role || role.isFounder || role.rank >= b.me.role.rank))) {
    return (
      <Screen>
        <AppBar title="Rôle" />
        <LoadState loading={false} error={{ message: 'Ton rôle ne permet pas de modifier celui-ci.' }} />
      </Screen>
    );
  }

  const toggle = (p: Permission, on: boolean) => setPerms((cur) => (on ? [...new Set([...cur, p])] : cur.filter((x) => x !== p)));

  // Nouveau rôle : placé juste au-dessus du rôle par défaut.
  const newRank = () => {
    const def = b.roles.find((r) => r.isDefault)!;
    const above = b.roles.filter((r) => r.rank > def.rank).map((r) => r.rank);
    const ceiling = Math.min(b.me.role.rank, ...above);
    return Math.max(def.rank + 1, Math.min(ceiling - 1, def.rank + Math.max(1, Math.floor((ceiling - def.rank) / 2))));
  };

  const save = async () => {
    setBusy(true);
    try {
      await upsertRole(groupId, { id: role?.id, name, color, rank: role?.rank ?? newRank(), permissions: perms });
      router.back();
    } catch (e) {
      Alert.alert('Enregistrement impossible', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = () => {
    if (!role) return;
    const count = b.members.filter((m) => m.roleId === role.id).length;
    const def = b.roles.find((r) => r.isDefault);
    Alert.alert(
      `Supprimer « ${role.name} » ?`,
      count ? `${count} membre${count > 1 ? 's' : ''} passeront en « ${def?.name} ».` : undefined,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () =>
            deleteRole(role.id)
              .then(() => router.back())
              .catch((e) => Alert.alert('Suppression impossible', (e as Error).message)),
        },
      ],
    );
  };

  const valid = name.trim().length > 0;

  return (
    <Screen>
      <AppBar title={isNew ? 'Nouveau rôle' : 'Modifier le rôle'} />

      <View style={styles.preview}>
        <RoleBadge name={name.trim() || 'Nom du rôle'} color={color} />
      </View>

      <SectionLabel>Nom</SectionLabel>
      <TextInput value={name} onChangeText={setName} maxLength={30} placeholder="Ex. Mécano, Photographe…" placeholderTextColor={colors.inkMute} style={styles.input} />

      <SectionLabel style={{ marginTop: 18 }}>Couleur</SectionLabel>
      <View style={styles.colors}>
        {ROLE_COLORS.map((c) => (
          <Pressable key={c} onPress={() => setColor(c)} style={[styles.color, { backgroundColor: c }, c === color && styles.colorOn]}>
            {c === color ? <Check size={14} color={colors.bg} /> : null}
          </Pressable>
        ))}
      </View>

      {PERMISSION_BLOCKS.map(({ key, label }) => (
        <View key={key} style={{ marginTop: 20 }}>
          <SectionLabel style={{ marginBottom: 4 }}>{label}</SectionLabel>
          <Text style={styles.blockSummary}>{describeBlock(key, perms)}</Text>
          <Panel pad={4}>
            {permissionsOfBlock(key).map((p, i) => (
              <View key={p} style={[styles.permRow, i > 0 && styles.sep]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.permLbl}>{PERMISSION_META[p].label}</Text>
                  <Text style={styles.permHint}>{PERMISSION_META[p].hint}</Text>
                </View>
                {/* key : force la resynchronisation du Switch (composant à état interne). */}
                <Switch key={`${p}-${perms.includes(p)}`} value={perms.includes(p)} onChange={(v) => toggle(p, v)} />
              </View>
            ))}
          </Panel>
        </View>
      ))}

      <PrimaryButton
        label={busy ? 'Enregistrement…' : isNew ? 'Créer le rôle' : 'Enregistrer'}
        onPress={save}
        disabled={!valid || busy}
        style={{ marginTop: 24, opacity: valid ? 1 : 0.5 }}
      />
      {role && !role.isDefault && (
        <Pressable onPress={remove} style={styles.delete}>
          <Trash2 size={16} color={colors.danger} />
          <Text style={styles.deleteTxt}>Supprimer ce rôle</Text>
        </Pressable>
      )}
      {role?.isDefault && <Text style={styles.defaultNote}>Rôle attribué aux nouveaux membres : il ne peut pas être supprimé.</Text>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  preview: { alignItems: 'center', paddingVertical: 12, marginBottom: 8 },
  input: {
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.ink,
  },
  colors: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  color: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  colorOn: { borderWidth: 3, borderColor: colors.ink },
  blockSummary: { fontFamily: fonts.medium, fontSize: 12, color: colors.neonBright, marginBottom: 8 },
  permRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 12 },
  sep: { borderTopWidth: 1, borderTopColor: colors.line },
  permLbl: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  permHint: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, marginTop: 2 },
  delete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, marginTop: 6 },
  deleteTxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.danger },
  defaultNote: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, textAlign: 'center', marginTop: 14 },
});
