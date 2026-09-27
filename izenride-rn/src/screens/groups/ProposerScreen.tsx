import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Trash2, Check, Search, Info } from 'lucide-react-native';
import { Screen, AppBar, Avatar, PrimaryButton, Switch } from '@/components';
import { LoadState, form } from '@/components/groups';
import { dialog } from '@/components/Dialog';
import { colors, fonts, radius } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { canAccept, canCreate, decideSuggestion, getGroupBundle, getGroupFeed, groupAction, searchProfiles } from '@/api/groups';
import { FieldErrors, LEVELS, normalizePayload, parseFrenchDateTime, PayloadError, splitFrenchDateTime, TYPE_META } from '@/api/payloads';
import type { GroupBundle, PayloadOf, Profile, RideLevel, Suggestion, SuggestionType } from '@/api/types';
import { friendRoutes } from '@/screens/friends/routes';

type Draft = {
  title: string;
  date: string;
  time: string;
  meetingPoint: string;
  route: string;
  level: RideLevel;
  membersOnly: boolean;
  question: string;
  options: string[];
  endsInDays: number | null;
  body: string;
  pinDays: number;
  userId: string | null;
  intro: string;
};

const PIN_CHOICES = [0, 1, 3, 7, 14, 30];
const POLL_END_CHOICES: (number | null)[] = [null, 1, 3, 7];

function emptyDraft(b: GroupBundle): Draft {
  return {
    title: '',
    date: '',
    time: '',
    meetingPoint: b.group.meetingPoint ?? '',
    route: '',
    level: 'tous',
    membersOnly: b.group.kind !== 'pro',
    question: '',
    options: ['', ''],
    endsInDays: null,
    body: '',
    pinDays: 7,
    userId: null,
    intro: '',
  };
}

/** Pré-remplit le formulaire depuis une suggestion (mode « modifier puis accepter »). */
function draftFrom(b: GroupBundle, s: Suggestion): Draft {
  const d = emptyDraft(b);
  const p = (s.editedPayload ?? s.payload) as Record<string, any>;
  switch (s.type) {
    case 'ride': {
      const { date, time } = splitFrenchDateTime(p.starts_at);
      return { ...d, title: p.title, date, time, meetingPoint: p.meeting_point, route: p.route ?? '', level: p.level ?? 'tous', membersOnly: p.members_only ?? true };
    }
    case 'poll':
      return { ...d, question: p.question, options: [...p.options], endsInDays: p.ends_at ? Math.max(1, Math.round((Date.parse(p.ends_at) - Date.now()) / 864e5)) : null };
    case 'announcement':
      return { ...d, body: p.body, pinDays: p.pin_days };
    case 'member':
      return { ...d, userId: p.user_id, intro: p.intro ?? '' };
  }
}

function toPayload(type: SuggestionType, d: Draft): Partial<PayloadOf[SuggestionType]> {
  switch (type) {
    case 'ride':
      return {
        title: d.title,
        starts_at: parseFrenchDateTime(d.date, d.time) ?? 'invalide',
        meeting_point: d.meetingPoint,
        route: d.route,
        level: d.level,
        members_only: d.membersOnly,
      };
    case 'poll':
      return { question: d.question, options: d.options, ends_at: d.endsInDays ? new Date(Date.now() + d.endsInDays * 864e5).toISOString() : null };
    case 'announcement':
      return { body: d.body, pin_days: d.pinDays };
    case 'member':
      return { user_id: d.userId ?? '', intro: d.intro };
  }
}

/**
 * Formulaire unique pour créer, proposer, ou modifier une suggestion avant de
 * l'accepter. Le serveur décide « créé » ou « proposé » selon le rôle.
 */
export default function ProposerScreen({ groupId, type, suggestionId }: { groupId: string; type: SuggestionType; suggestionId?: string }) {
  const router = useRouter();
  const bundle = useQuery(() => getGroupBundle(groupId), [groupId]);
  const feed = useQuery(() => (suggestionId ? getGroupFeed(groupId) : null), [groupId, suggestionId]);
  const b = bundle.data;
  const suggestion = suggestionId ? feed.data?.suggestions.find((s) => s.id === suggestionId) : undefined;

  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!b || draft) return;
    if (suggestionId && !suggestion) return;
    setDraft(suggestion ? draftFrom(b, suggestion) : emptyDraft(b));
  }, [b, suggestion, suggestionId, draft]);

  if (!b || !draft) {
    return (
      <Screen>
        <AppBar title={TYPE_META[type]?.label ?? 'Proposer'} />
        <LoadState loading={!bundle.error && !feed.error} error={bundle.error ?? feed.error} onRetry={bundle.reload} />
      </Screen>
    );
  }

  const editing = !!suggestion;
  if (editing && (!canAccept(b, type) || suggestion!.status !== 'pending')) {
    return (
      <Screen>
        <AppBar title="Modifier" />
        <LoadState loading={false} error={{ message: suggestion!.status !== 'pending' ? 'Cette suggestion a déjà été traitée.' : 'Ton rôle ne permet pas de valider ce type de suggestion.' }} />
      </Screen>
    );
  }

  const direct = canCreate(b, type);
  const title = editing ? 'Modifier puis accepter' : direct ? TYPE_META[type].create : TYPE_META[type].propose;
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setDraft((d) => ({ ...d!, [k]: v }));
    setErrors((e) => ({ ...e, [fieldOf(k)]: undefined }));
  };

  const submit = async () => {
    let payload: PayloadOf[SuggestionType];
    try {
      payload = normalizePayload(type, toPayload(type, draft), b.group.kind);
    } catch (e) {
      if (e instanceof PayloadError) return setErrors(e.fields);
      throw e;
    }
    setBusy(true);
    try {
      if (editing) {
        const r = await decideSuggestion(suggestion!.id, true, payload);
        if (r.status === 'expired') await dialog.info('Suggestion expirée', 'Elle a dépassé sa date limite : rien n’a été créé.');
      } else {
        const r = await groupAction(groupId, type, payload);
        if (r.mode === 'suggested') {
          await dialog.info('Proposition envoyée', 'Un membre habilité pourra l’accepter en 1 clic. Tu seras prévenu de sa décision.');
        }
      }
      router.back();
    } catch (e) {
      dialog.error(editing ? 'Acceptation impossible' : 'Envoi impossible')(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <AppBar title={title} />
      {editing ? (
        <Note text="Tes modifications seront appliquées puis la suggestion acceptée. L’auteur verra ce qui a changé." />
      ) : !direct ? (
        <Note text="Ton rôle ne publie pas directement : ta proposition sera validée en 1 clic par un membre habilité." />
      ) : null}

      {type === 'ride' && <RideFields b={b} d={draft} set={set} errors={errors} />}
      {type === 'poll' && <PollFields d={draft} set={set} errors={errors} />}
      {type === 'announcement' && <AnnouncementFields d={draft} set={set} errors={errors} />}
      {type === 'member' && <MemberFields b={b} d={draft} set={set} errors={errors} initial={draft.userId ? feed.data?.people[draft.userId] : undefined} />}

      <PrimaryButton
        label={busy ? 'Envoi…' : editing ? 'Accepter avec ces modifications' : direct ? 'Publier' : 'Envoyer la proposition'}
        onPress={submit}
        disabled={busy}
        style={{ marginTop: 24 }}
      />
    </Screen>
  );
}

/** Champ du formulaire correspondant à une clé du brouillon (pour effacer son erreur). */
const fieldOf = (k: keyof Draft): string =>
  ({ date: 'starts_at', time: 'starts_at', meetingPoint: 'meeting_point', endsInDays: 'ends_at', pinDays: 'pin_days', userId: 'user_id' } as Record<string, string>)[k] ?? k;

type FieldsProps = { d: Draft; set: <K extends keyof Draft>(k: K, v: Draft[K]) => void; errors: FieldErrors };

function Note({ text }: { text: string }) {
  return (
    <View style={styles.note}>
      <Info size={14} color={colors.neonBright} />
      <Text style={styles.noteTxt}>{text}</Text>
    </View>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={[form.fieldLabel, { marginBottom: 7, paddingLeft: 4 }]}>{label}</Text>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function Chips<T>({ items, value, onChange, label }: { items: T[]; value: T; onChange: (v: T) => void; label: (v: T) => string }) {
  return (
    <View style={styles.chips}>
      {items.map((it) => {
        const on = it === value;
        return (
          <Pressable key={String(it)} onPress={() => onChange(it)} style={[styles.chip, on && styles.chipOn]}>
            <Text style={[styles.chipTxt, on && { color: colors.bg }]}>{label(it)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function RideFields({ b, d, set, errors }: FieldsProps & { b: GroupBundle }) {
  return (
    <>
      <Field label="Titre" error={errors.title}>
        <TextInput value={d.title} onChangeText={(v) => set('title', v)} placeholder="Ex. Night ride Montmartre" placeholderTextColor={colors.inkMute} maxLength={80} style={form.input} />
      </Field>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1.3 }}>
          <Field label="Date" error={errors.starts_at}>
            <TextInput value={d.date} onChangeText={(v) => set('date', v)} placeholder="JJ/MM" placeholderTextColor={colors.inkMute} style={form.input} />
          </Field>
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Heure">
            <TextInput value={d.time} onChangeText={(v) => set('time', v)} placeholder="21:30" placeholderTextColor={colors.inkMute} style={form.input} />
          </Field>
        </View>
      </View>
      <Field label="Point de rendez-vous" error={errors.meeting_point}>
        <TextInput value={d.meetingPoint} onChangeText={(v) => set('meetingPoint', v)} placeholder="Ex. Place de la Bastille" placeholderTextColor={colors.inkMute} style={form.input} />
      </Field>
      <Field label="Itinéraire (optionnel)" error={errors.route}>
        <TextInput value={d.route} onChangeText={(v) => set('route', v)} placeholder="Étapes, routes, pauses…" placeholderTextColor={colors.inkMute} multiline maxLength={500} style={[form.input, form.textarea]} />
      </Field>
      <Field label="Niveau">
        <Chips items={LEVELS.map((l) => l.key)} value={d.level} onChange={(v) => set('level', v)} label={(k) => LEVELS.find((l) => l.key === k)!.label} />
      </Field>
      {b.group.kind === 'pro' && (
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchTitle}>Réservée aux membres</Text>
            <Text style={styles.switchSub}>Sinon, la sortie est promue dans l’onglet Événements.</Text>
          </View>
          <Switch key={String(d.membersOnly)} value={d.membersOnly} onChange={(v) => set('membersOnly', v)} />
        </View>
      )}
    </>
  );
}

function PollFields({ d, set, errors }: FieldsProps) {
  const setOption = (i: number, v: string) => set('options', d.options.map((o, j) => (j === i ? v : o)));
  return (
    <>
      <Field label="Question" error={errors.question}>
        <TextInput value={d.question} onChangeText={(v) => set('question', v)} placeholder="Ex. On part où dimanche ?" placeholderTextColor={colors.inkMute} maxLength={200} style={form.input} />
      </Field>
      <Field label="Réponses" error={errors.options}>
        <View style={{ gap: 8 }}>
          {d.options.map((o, i) => (
            <View key={i} style={styles.optionRow}>
              <TextInput value={o} onChangeText={(v) => setOption(i, v)} placeholder={`Réponse ${i + 1}`} placeholderTextColor={colors.inkMute} maxLength={80} style={[form.input, { flex: 1 }]} />
              {d.options.length > 2 && (
                <Pressable onPress={() => set('options', d.options.filter((_, j) => j !== i))} style={styles.iconBtn} accessibilityLabel="Retirer la réponse">
                  <Trash2 size={16} color={colors.inkDim} />
                </Pressable>
              )}
            </View>
          ))}
          {d.options.length < 6 && (
            <Pressable onPress={() => set('options', [...d.options, ''])} style={styles.addOption}>
              <Plus size={16} color={colors.neonBright} />
              <Text style={styles.addOptionTxt}>Ajouter une réponse</Text>
            </Pressable>
          )}
        </View>
      </Field>
      <Field label="Fin du sondage" error={errors.ends_at}>
        <Chips items={POLL_END_CHOICES} value={d.endsInDays} onChange={(v) => set('endsInDays', v)} label={(v) => (v === null ? 'Sans fin' : `${v} j`)} />
      </Field>
    </>
  );
}

function AnnouncementFields({ d, set, errors }: FieldsProps) {
  return (
    <>
      <Field label="Annonce" error={errors.body}>
        <TextInput value={d.body} onChangeText={(v) => set('body', v)} placeholder="Ce que tout le groupe doit savoir…" placeholderTextColor={colors.inkMute} multiline maxLength={1000} style={[form.input, form.textarea]} />
      </Field>
      <Field label="Épingler en haut du chat" error={errors.pin_days}>
        <Chips items={PIN_CHOICES} value={d.pinDays} onChange={(v) => set('pinDays', v)} label={(v) => (v === 0 ? 'Non' : `${v} j`)} />
      </Field>
    </>
  );
}

function MemberFields({ b, d, set, errors, initial }: FieldsProps & { b: GroupBundle; initial?: Profile }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<Profile | null>(initial ?? null);

  useEffect(() => {
    let alive = true;
    searchProfiles(q, b.group.id, b.members.map((m) => m.userId))
      .then((r) => alive && setResults(r))
      .catch(() => alive && setResults([]));
    return () => {
      alive = false;
    };
  }, [q, b]);

  useEffect(() => {
    if (d.userId && !selected) {
      const p = results.find((r) => r.id === d.userId);
      if (p) setSelected(p);
    }
  }, [d.userId, results, selected]);

  const pick = (p: Profile) => {
    setSelected(p);
    set('userId', p.id);
  };

  return (
    <>
      <Field label="Rider à inviter" error={errors.user_id}>
        {selected ? (
          <View style={styles.selected}>
            <Avatar label={selected.name[0]} size={34} />
            <Text style={[styles.personName, { flex: 1 }]}>{selected.name}</Text>
            <Pressable
              onPress={() => {
                setSelected(null);
                set('userId', null);
              }}
            >
              <Text style={styles.change}>Changer</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={form.search}>
              <Search size={14} color={colors.inkMute} />
              <TextInput value={q} onChangeText={setQ} placeholder="Rechercher un rider IzenRide" placeholderTextColor={colors.inkMute} style={form.searchInput} />
            </View>
            <View style={{ marginTop: 8 }}>
              {results.map((p) => (
                <Pressable key={p.id} onPress={() => pick(p)} style={styles.person}>
                  <Avatar label={p.name[0]} size={34} />
                  <Text style={[styles.personName, { flex: 1 }]}>{p.name}</Text>
                  <Check size={16} color={colors.inkMute} />
                </Pressable>
              ))}
              {results.length === 0 && <Text style={styles.switchSub}>{q.trim().length < 2 ? 'Tape au moins 2 lettres.' : 'Aucun rider trouvé.'}</Text>}
              <Pressable onPress={() => router.push(friendRoutes.invite(b.group.id))} style={styles.person}>
                <Text style={[styles.change, { flex: 1 }]}>Pas encore sur IzenRide ? Invite-le par lien ou QR code</Text>
              </Pressable>
            </View>
          </>
        )}
      </Field>
      <Field label="Un mot pour le groupe (optionnel)" error={errors.intro}>
        <TextInput value={d.intro} onChangeText={(v) => set('intro', v)} placeholder="Ex. On s’est croisés à Vincennes, il roule en MT-07" placeholderTextColor={colors.inkMute} multiline maxLength={200} style={[form.input, form.textarea]} />
      </Field>
    </>
  );
}

const styles = StyleSheet.create({
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
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkDim },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 18, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  switchTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  switchSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, marginTop: 2 },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { width: 42, height: 42, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panelSoft },
  addOption: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 4 },
  addOptionTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.neonBright },
  person: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, paddingHorizontal: 4 },
  personName: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  selected: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(77,143,255,0.4)', backgroundColor: colors.panel },
  change: { fontFamily: fonts.semibold, fontSize: 13, color: colors.neonBright },
});
