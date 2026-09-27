// Edge Function `notify` — push Expo pour les suggestions de groupe.
//
// Déclenchée par un Database Webhook Supabase sur `public.group_suggestions`
// (INSERT et UPDATE), avec l'en-tête `x-webhook-secret: <NOTIFY_WEBHOOK_SECRET>`.
//   - INSERT  : prévient les membres habilités à valider (préférences respectées).
//   - UPDATE pending -> accepté/refusé : prévient l'auteur de l'issue.
// Les boutons Accepter / Refuser de la notification sont traités par l'app
// (catégorie `group_suggestion`, voir src/notifications.ts).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type Suggestion = {
  id: string;
  group_id: string;
  author_id: string;
  type: 'ride' | 'member' | 'announcement' | 'poll';
  payload: Record<string, unknown>;
  edited_payload: Record<string, unknown> | null;
  status: string;
  refusal_reason: string | null;
};
type WebhookPayload = { type: 'INSERT' | 'UPDATE' | 'DELETE'; table: string; record: Suggestion; old_record: Suggestion | null };
type Recipient = { user_id: string; token: string; platform: string };

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const PROFILES_TABLE = Deno.env.get('PROFILES_TABLE') ?? 'profiles';

const TYPE_LABEL: Record<Suggestion['type'], string> = {
  ride: 'Sortie',
  member: 'Nouveau membre',
  announcement: 'Annonce',
  poll: 'Sondage',
};

function summary(s: Suggestion): string {
  const p = s.edited_payload ?? s.payload;
  switch (s.type) {
    case 'ride':
      return String(p.title ?? '');
    case 'poll':
      return String(p.question ?? '');
    case 'announcement':
      return String(p.body ?? '').slice(0, 90);
    case 'member':
      return String(p.intro ?? 'Invitation d’un nouveau membre');
  }
}

async function displayName(userId: string): Promise<string> {
  const { data } = await supabase.from(PROFILES_TABLE).select('*').eq('id', userId).maybeSingle();
  return (data?.display_name ?? data?.username ?? data?.first_name ?? data?.name ?? 'Un membre') as string;
}

async function sendPush(recipients: Recipient[], title: string, body: string, data: Record<string, unknown>, categoryId?: string) {
  if (!recipients.length) return;
  const messages = recipients.map((r) => ({ to: r.token, title, body, data, sound: 'default', ...(categoryId ? { categoryId } : {}) }));
  // L'API Expo accepte 100 messages par requête.
  for (let i = 0; i < messages.length; i += 100) {
    const res = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(messages.slice(i, i + 100)),
    });
    const json = await res.json().catch(() => ({}));
    // Jetons révoqués : on les oublie.
    const tickets: { status: string; details?: { error?: string } }[] = json?.data ?? [];
    const dead = tickets
      .map((t, j) => (t.details?.error === 'DeviceNotRegistered' ? messages[i + j]!.to : null))
      .filter((t): t is string => !!t);
    if (dead.length) await supabase.from('user_push_tokens').delete().in('token', dead);
  }
}

Deno.serve(async (req) => {
  if (req.headers.get('x-webhook-secret') !== Deno.env.get('NOTIFY_WEBHOOK_SECRET')) {
    return new Response('forbidden', { status: 403 });
  }
  const event = (await req.json()) as WebhookPayload;
  if (event.table !== 'group_suggestions') return new Response('ignored');
  const s = event.record;

  const { data: group } = await supabase.from('groups').select('name').eq('id', s.group_id).maybeSingle();
  const groupName = group?.name ?? 'Ton groupe';
  const data = { kind: 'group_suggestion', suggestionId: s.id, groupId: s.group_id };

  if (event.type === 'INSERT' && s.status === 'pending') {
    const { data: reviewers } = await supabase.rpc('suggestion_reviewers', { p_suggestion: s.id });
    const author = await displayName(s.author_id);
    await sendPush(
      (reviewers ?? []) as Recipient[],
      `${groupName} · suggestion de ${author}`,
      `${TYPE_LABEL[s.type]} : ${summary(s)}`,
      data,
      'group_suggestion',
    );
  }

  const decided = ['accepted', 'accepted_edited', 'refused'];
  if (event.type === 'UPDATE' && event.old_record?.status === 'pending' && decided.includes(s.status)) {
    const { data: author } = await supabase.rpc('suggestion_author_tokens', { p_suggestion: s.id });
    const label = TYPE_LABEL[s.type].toLowerCase();
    const body =
      s.status === 'refused'
        ? `Refusée : ${s.refusal_reason ?? ''}`
        : s.status === 'accepted_edited'
          ? `Acceptée avec quelques modifications — ${summary(s)}`
          : `Acceptée — ${summary(s)}`;
    await sendPush((author ?? []) as Recipient[], `${groupName} · ta suggestion (${label})`, body, data);
  }

  return new Response('ok');
});
