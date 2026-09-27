import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, Building2, Check, Lock } from 'lucide-react-native';
import { Screen, AppBar, Panel, PrimaryButton, SectionLabel } from '@/components';
import { colors, fonts, radius } from '@/theme';
import { createGroup } from '@/api/groups';
import type { GroupKind } from '@/api/types';
import { groupRoutes } from './routes';

const KINDS: { kind: GroupKind; title: string; text: string; Icon: typeof Users }[] = [
  {
    kind: 'friends',
    title: 'Groupe d’amis',
    text: 'Votre bande : chat, sorties privées, rôles pour s’organiser.',
    Icon: Users,
  },
  {
    kind: 'pro',
    title: 'Organisation pro',
    text: 'Concession, moto-école, asso : vos sorties sont promues dans Événements.',
    Icon: Building2,
  },
];

/** Création d'un groupe : type, nom, description. Rôles par défaut créés côté serveur. */
export default function CreerUnGroupeScreen() {
  const router = useRouter();
  const [kind, setKind] = useState<GroupKind>('friends');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const valid = name.trim().length >= 2;

  const submit = async () => {
    setBusy(true);
    try {
      const id = await createGroup(kind, name, description);
      router.replace(groupRoutes.home(id, 'membres'));
    } catch (e) {
      Alert.alert('Création impossible', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <AppBar title="Nouveau groupe" />

      <SectionLabel>Type de groupe</SectionLabel>
      {KINDS.map(({ kind: k, title, text, Icon }) => {
        const on = k === kind;
        return (
          <Pressable key={k} onPress={() => setKind(k)}>
            <Panel pad={14} accent={on ? colors.neon : undefined} style={styles.kind}>
              <View style={[styles.kindIcon, on && { backgroundColor: 'rgba(77,143,255,0.2)' }]}>
                <Icon size={20} color={on ? colors.neonBright : colors.inkDim} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.kindTitle}>{title}</Text>
                <Text style={styles.kindText}>{text}</Text>
              </View>
              <View style={[styles.radio, on && styles.radioOn]}>{on ? <Check size={12} color="#fff" /> : null}</View>
            </Panel>
          </Pressable>
        );
      })}

      <SectionLabel style={{ marginTop: 18 }}>Nom</SectionLabel>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder={kind === 'pro' ? 'Ex. Moto-école Bastille' : 'Ex. Night Riders Paris'}
        placeholderTextColor={colors.inkMute}
        maxLength={60}
        style={styles.input}
      />

      <SectionLabel style={{ marginTop: 18 }}>Description (optionnel)</SectionLabel>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Le style de sorties, le rythme, l’état d’esprit…"
        placeholderTextColor={colors.inkMute}
        maxLength={1000}
        multiline
        style={[styles.input, { minHeight: 96, textAlignVertical: 'top' }]}
      />

      <View style={styles.privacy}>
        <Lock size={14} color={colors.inkDim} />
        <Text style={styles.privacyTxt}>
          Groupe privé : invisible dans la recherche, on y entre uniquement sur invitation.
          {kind === 'pro' ? ' Les sorties que vous publiez apparaîtront dans Événements.' : ' Vos sorties restent entre vous.'}
        </Text>
      </View>

      <Text style={styles.rolesNote}>
        Rôles créés d’office : Fondateur (toi), Admin, {kind === 'pro' ? 'Gestionnaire' : 'Road captain'}, Membre. Tu pourras les
        modifier ensuite.
      </Text>

      <PrimaryButton label={busy ? 'Création…' : 'Créer le groupe'} onPress={submit} disabled={!valid || busy} style={{ marginTop: 20, opacity: valid ? 1 : 0.5 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  kind: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  kindIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kindTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  kindText: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, marginTop: 2, lineHeight: 17 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' },
  radioOn: { backgroundColor: colors.neon, borderColor: colors.neon },
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
  privacy: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: colors.line,
  },
  privacyTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, lineHeight: 18 },
  rolesNote: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, marginTop: 12, lineHeight: 18 },
});
