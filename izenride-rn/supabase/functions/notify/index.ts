// Edge Function `notify` — push Expo de l'univers Groupes.
//
// Déclenchée par des Database Webhooks Supabase, avec l'en-tête
// `x-webhook-secret: <NOTIFY_WEBHOOK_SECRET>` :
//   - group_suggestions INSERT : prévient les membres habilités à valider.
//   - group_suggestions UPDATE pending -> décidée : prévient l'auteur.
//   - friend_invites UPDATE -> claimed : « Léo vient d'arriver sur IzenRide ».
//   - direct_messages INSERT : message, « V » de motard ou sortie proposée.
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
type FriendInvite = { id: string; inviter_id: string; accepted_by: string | null; status: string };
type DirectMessage = { id: string; sender_id: string; recipient_id: string; kind: 'text' | 'wave' | 'ride'; body: string | null; payload: Record<string, unknown> | null };
type WebhookPayload<T> = { type: 'INSERT' | 'UPDATE' | 'DELETE'; table: string; record: T; old_record: T | null };
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

async function tokensOf(userId: string): Promise<Recipient[]> {
  const { data } = await supabase.rpc('user_push_tokens_of', { p_user: userId });
  return (data ?? []) as Recipient[];
}

async function onSuggestion(event: WebhookPayload<Suggestion>) {
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
}

async function onFriendInvite(event: WebhookPayload<FriendInvite>) {
  const f = event.record;
  if (event.type !== 'UPDATE' || event.old_record?.status !== 'pending' || f.status !== 'claimed' || !f.accepted_by) return;
  const friend = await displayName(f.accepted_by);
  await sendPush(
    await tokensOf(f.inviter_id),
    `${friend} vient d’arriver sur IzenRide 🎉`,
    'Souhaite-lui la bienvenue et ouvre-lui tes groupes en 1 tap.',
    { kind: 'friend_joined', inviteId: f.id, friendId: f.accepted_by },
  );
}

async function onDirectMessage(event: WebhookPayload<DirectMessage>) {
  const m = event.record;
  if (event.type !== 'INSERT') return;
  const sender = await displayName(m.sender_id);
  const body =
    m.kind === 'wave'
      ? 'T’envoie un V de motard 🤘'
      : m.kind === 'ride'
        ? `Te propose une sortie : ${String(m.payload?.title ?? '')}`
        : String(m.body ?? '').slice(0, 120);
  await sendPush(await tokensOf(m.recipient_id), sender, body, { kind: 'direct_message', fromId: m.sender_id });
}

Deno.serve(async (req) => {
  if (req.headers.get('x-webhook-secret') !== Deno.env.get('NOTIFY_WEBHOOK_SECRET')) {
    return new Response('forbidden', { status: 403 });
  }
  const event = (await req.json()) as WebhookPayload<unknown>;
  switch (event.table) {
    case 'group_suggestions':
      await onSuggestion(event as WebhookPayload<Suggestion>);
      break;
    case 'friend_invites':
      await onFriendInvite(event as WebhookPayload<FriendInvite>);
      break;
    case 'direct_messages':
      await onDirectMessage(event as WebhookPayload<DirectMessage>);
      break;
    default:
      return new Response('ignored');
  }
  return new Response('ok');
});
