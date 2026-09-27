import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings2, Users, Info, MapPin, ScrollText, LogOut, Lightbulb, Bell, ChevronRight } from 'lucide-react-native';
import { Panel, PrimaryButton, GhostButton, ListRow, Switch } from '@/components';
import { form } from '@/components/groups';
import { dialog } from '@/components/Dialog';
import { colors } from '@/theme';
import { can, updateGroup, leaveGroup, acceptableTypes, getNotificationPrefs, setNotificationPrefs } from '@/api/groups';
import { useQuery } from '@/api/useQuery';
import { groupRoutes } from '../routes';
import type { GroupBundle } from '@/api/types';
import { canManage, tabStyles as styles } from './shared';

const fail = dialog.error;

// ---------------------------------------------------------------------------
// Infos — édition en place si `group.edit`.
// ---------------------------------------------------------------------------
export default function InfosTab({ b, onManage, onLeft }: { b: GroupBundle; onManage: () => void; onLeft: () => void }) {
  const router = useRouter();
  const prefs = useQuery(getNotificationPrefs, []);
  const groupPref = prefs.data?.groups[b.group.id] ?? prefs.data?.global ?? { suggestions: true, outcome: true };
  const editable = can(b, 'group.edit');
  const [editing, setEditing] = useState(false);
  const fromGroup = () => ({ name: b.group.name, description: b.group.description ?? '', rules: b.group.rules ?? '', meetingPoint: b.group.meetingPoint ?? '' });
  const [draft, setDraft] = useState(fromGroup);
  const startEditing = () => {
    setDraft(fromGroup());
    setEditing(true);
  };

  const save = async () => {
    try {
      await updateGroup(b.group.id, draft);
      setEditing(false);
    } catch (e) {
      fail('Enregistrement impossible')(e);
    }
  };

  const leave = async () => {
    const ok = await dialog.confirm({
      title: 'Quitter le groupe ?',
      message: b.me.role.isFounder && b.members.length === 1 ? 'Tu es seul : le groupe sera supprimé.' : undefined,
      confirmLabel: 'Quitter',
      destructive: true,
    });
    if (ok) leaveGroup(b.group.id).then(onLeft).catch(fail('Impossible de quitter'));
  };

  const field = (key: keyof typeof draft, label: string, Icon: typeof Info, placeholder: string, multiline = false) => (
    <View style={{ marginBottom: 14 }}>
      <View style={styles.fieldHead}>
        <Icon size={14} color={colors.inkDim} />
        <Text style={styles.fieldLbl}>{label}</Text>
      </View>
      {editing ? (
        <TextInput
          value={draft[key]}
          onChangeText={(v) => setDraft((d) => ({ ...d, [key]: v }))}
          placeholder={placeholder}
          placeholderTextColor={colors.inkMute}
          multiline={multiline}
          style={[form.input, multiline && form.textarea]}
        />
      ) : (
        <Text style={[styles.fieldVal, !b.group[key] && { color: colors.inkMute }]}>{(b.group[key] as string | null) || placeholder}</Text>
      )}
    </View>
  );

  return (
    <View>
      <Panel pad={16}>
        {editing && field('name', 'Nom', Users, 'Nom du groupe')}
        {field('description', 'Description', Info, 'Pas encore de description', true)}
        {field('rules', 'Règles', ScrollText, 'Pas de règles pour l’instant', true)}
        {field('meetingPoint', 'Lieu de RDV habituel', MapPin, 'Non renseigné')}
        {editable &&
          (editing ? (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <GhostButton label="Annuler" onPress={() => setEditing(false)} style={{ flex: 1, height: 46 }} />
              <PrimaryButton label="Enregistrer" onPress={save} style={{ flex: 1 }} />
            </View>
          ) : (
            <GhostButton label="Modifier les infos" onPress={startEditing} style={{ height: 46 }} />
          ))}
      </Panel>

      <Panel pad={4} style={{ marginTop: 14 }}>
        <ListRow
          icon={<Lightbulb size={18} color={colors.neonBright} />}
          title="Mes suggestions"
          subtitle="Suivre, retirer mes propositions"
          right={<ChevronRight size={18} color={colors.inkMute} />}
          onPress={() => router.push(groupRoutes.mine(b.group.id))}
        />
        {acceptableTypes(b).length > 0 && prefs.data && (
          <ListRow
            icon={<Bell size={18} color={colors.neonBright} />}
            title="Notifier les suggestions"
            subtitle="Push quand un membre propose quelque chose"
            right={
              <Switch
                key={String(groupPref.suggestions)}
                value={groupPref.suggestions}
                onChange={(v) => setNotificationPrefs(b.group.id, v, groupPref.outcome).catch(fail('Réglage impossible'))}
              />
            }
          />
        )}
      </Panel>

      {canManage(b) && <GhostButton label="Gérer le groupe" icon={<Settings2 size={16} color={colors.ink} />} onPress={onManage} style={{ marginTop: 14 }} />}
      <Pressable onPress={leave} style={styles.leave}>
        <LogOut size={16} color={colors.danger} />
        <Text style={styles.leaveTxt}>Quitter le groupe</Text>
      </Pressable>
    </View>
  );
}

