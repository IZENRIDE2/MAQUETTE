/**
 * Cartes du fil d'un groupe : suggestion (avec Accepter / Modifier / Refuser
 * en 1 clic), sortie, sondage, annonce épinglée, ligne système.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Bike, BarChart3, Megaphone, UserPlus, ThumbsUp, Check, Pencil, X, MapPin, Users, Pin, Clock, Undo2 } from 'lucide-react-native';
import { Avatar } from '@/components';
import { dialog } from '@/components/Dialog';
import { form } from '@/components/groups';
import { colors, fonts, radius } from '@/theme';
import { canAccept, decideSuggestion, setRideParticipation, toggleSuggestionVote, votePoll, withdrawSuggestion } from '@/api/groups';
import { formatRideDate, LEVELS, TYPE_META } from '@/api/payloads';
import type { Announcement, PayloadOf, Poll, Ride, Suggestion, SuggestionStatus, SuggestionType } from '@/api/types';
import { groupRoutes } from '../routes';
import { ago, GroupCtx } from './context';

export const TYPE_ICON: Record<SuggestionType, typeof Bike> = { ride: Bike, poll: BarChart3, announcement: Megaphone, member: UserPlus };

const STATUS: Record<SuggestionStatus, { label: string; color: string }> = {
  pending: { label: 'En attente', color: colors.warn },
  accepted: { label: 'Acceptée', color: colors.success },
  accepted_edited: { label: 'Acceptée · modifiée', color: colors.success },
  refused: { label: 'Refusée', color: colors.inkDim },
  withdrawn: { label: 'Retirée', color: colors.inkMute },
  expired: { label: 'Expirée', color: colors.inkMute },
};

const isLive = (s: Suggestion) => s.status === 'pending' && Date.parse(s.expiresAt) > Date.now();

// ---------------------------------------------------------------------------
// Suggestion
// ---------------------------------------------------------------------------
export function SuggestionCard({ ctx, s, compact, pressable = true }: { ctx: GroupCtx; s: Suggestion; compact?: boolean; pressable?: boolean }) {
  const router = useRouter();
  const [refusing, setRefusing] = useState(false);
  const [busy, setBusy] = useState(false);
  const Icon = TYPE_ICON[s.type];
  const live = isLive(s);
  const status = live ? STATUS.pending : STATUS[s.status === 'pending' ? 'expired' : s.status];
  const reviewer = live && canAccept(ctx.b, s.type);
  const mine = s.authorId === ctx.b.me.userId;
  const payload = (s.editedPayload ?? s.payload) as never;

  const accept = async () => {
    setBusy(true);
    try {
      const r = await decideSuggestion(s.id, true);
      if (r.status === 'expired') await dialog.info('Suggestion expirée', 'Elle a dépassé sa date limite : rien n’a été créé.');
    } catch (e) {
      dialog.error('Acceptation impossible')(e);
    } finally {
      setBusy(false);
    }
  };

  const withdraw = async () => {
    const ok = await dialog.confirm({ title: 'Retirer ta suggestion ?', confirmLabel: 'Retirer', destructive: true });
    if (ok) withdrawSuggestion(s.id).catch(dialog.error('Retrait impossible'));
  };

  return (
    <Pressable
      disabled={!pressable}
      onPress={() => router.push(groupRoutes.suggestion(s.groupId, s.id))}
      style={[styles.card, live && styles.cardLive]}
    >
      <View style={styles.cardHead}>
        <View style={styles.typeChip}>
          <Icon size={13} color={colors.neonBright} />
          <Text style={styles.typeTxt}>Suggestion · {TYPE_META[s.type].label}</Text>
        </View>
        <View style={[styles.status, { borderColor: status.color + '66' }]}>
          <Text style={[styles.statusTxt, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <Text style={styles.by}>
        Proposée par <Text style={styles.byName}>{mine ? 'toi' : ctx.nameOf(s.authorId)}</Text> · {ago(s.createdAt)}
      </Text>

      <PayloadPreview ctx={ctx} type={s.type} payload={payload} compact={compact} />

      {!live && s.decidedBy && (s.status === 'accepted' || s.status === 'accepted_edited' || s.status === 'refused') && (
        <Text style={styles.outcome}>
          {s.status === 'refused' ? 'Refusée' : s.status === 'accepted_edited' ? 'Acceptée avec modifications' : 'Acceptée'} par{' '}
          {s.decidedBy === ctx.b.me.userId ? 'toi' : ctx.nameOf(s.decidedBy)}
          {s.status === 'refused' && s.refusalReason ? ` : « ${s.refusalReason} »` : ''}
        </Text>
      )}

      {live && (
        <View style={styles.footer}>
          <Pressable
            onPress={() => toggleSuggestionVote(s.id).catch(dialog.error('Action impossible'))}
            hitSlop={6}
            style={[styles.vote, s.votedByMe && styles.voteOn]}
          >
            <ThumbsUp size={13} color={s.votedByMe ? colors.bg : colors.inkDim} fill={s.votedByMe ? colors.bg : 'transparent'} />
            <Text style={[styles.voteTxt, s.votedByMe && { color: colors.bg }]}>{s.votes}</Text>
          </Pressable>
          <View style={{ flex: 1 }} />
          {reviewer ? (
            <>
              <Pressable onPress={() => setRefusing(true)} hitSlop={4} style={styles.iconAction} accessibilityLabel="Refuser">
                <X size={16} color={colors.inkDim} />
              </Pressable>
              <Pressable onPress={() => router.push(groupRoutes.propose(s.groupId, s.type, s.id))} hitSlop={4} style={styles.iconAction} accessibilityLabel="Modifier">
                <Pencil size={15} color={colors.inkDim} />
              </Pressable>
              <Pressable onPress={accept} disabled={busy} style={[styles.accept, busy && { opacity: 0.6 }]}>
                <Check size={15} color="#fff" />
                <Text style={styles.acceptTxt}>Accepter</Text>
              </Pressable>
            </>
          ) : mine ? (
            <Pressable onPress={withdraw} style={styles.ghostSmall}>
              <Undo2 size={14} color={colors.inkDim} />
              <Text style={styles.ghostSmallTxt}>Retirer</Text>
            </Pressable>
          ) : (
            <Text style={styles.waiting}>En attente d’un habilité</Text>
          )}
        </View>
      )}

      <RefuseSheet
        visible={refusing}
        onClose={() => setRefusing(false)}
        onRefuse={(reason) => decideSuggestion(s.id, false, null, reason).catch(dialog.error('Refus impossible'))}
      />
    </Pressable>
  );
}

/** Aperçu du contenu d'une suggestion, selon son type. */
export function PayloadPreview({ ctx, type, payload, compact }: { ctx: GroupCtx; type: SuggestionType; payload: never; compact?: boolean }) {
  switch (type) {
    case 'ride': {
      const r = payload as PayloadOf['ride'];
      return (
        <View style={styles.preview}>
          <Text style={styles.pTitle}>{r.title}</Text>
          <Meta icon={<Clock size={12} color={colors.inkMute} />} text={formatRideDate(r.starts_at)} />
          <Meta icon={<MapPin size={12} color={colors.inkMute} />} text={`RDV ${r.meeting_point}`} />
          {!compact && r.route ? <Text style={styles.pText}>{r.route}</Text> : null}
          <Text style={styles.pHint}>{LEVELS.find((l) => l.key === r.level)?.label ?? 'Tous niveaux'}</Text>
        </View>
      );
    }
    case 'poll': {
      const p = payload as PayloadOf['poll'];
      return (
        <View style={styles.preview}>
          <Text style={styles.pTitle}>{p.question}</Text>
          {p.options.map((o) => (
            <Text key={o} style={styles.pOption}>
              ○ {o}
            </Text>
          ))}
        </View>
      );
    }
    case 'announcement': {
      const a = payload as PayloadOf['announcement'];
      return (
        <View style={styles.preview}>
          <Text style={styles.pText} numberOfLines={compact ? 3 : undefined}>
            {a.body}
          </Text>
          <Text style={styles.pHint}>{a.pin_days > 0 ? `Épinglée ${a.pin_days} jour${a.pin_days > 1 ? 's' : ''}` : 'Sans épinglage'}</Text>
        </View>
      );
    }
    case 'member': {
      const m = payload as PayloadOf['member'];
      return (
        <View style={[styles.preview, styles.memberRow]}>
          <Avatar label={ctx.nameOf(m.user_id)[0]} size={34} />
          <View style={{ flex: 1 }}>
            <Text style={styles.pTitle}>Inviter {ctx.nameOf(m.user_id)}</Text>
            {m.intro ? <Text style={styles.pText}>« {m.intro} »</Text> : null}
          </View>
        </View>
      );
    }
  }
}

const Meta = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <View style={styles.meta}>
    {icon}
    <Text style={styles.metaTxt}>{text}</Text>
  </View>
);

// ---------------------------------------------------------------------------
// Refus avec motif
// ---------------------------------------------------------------------------
const REASONS = ['Doublon', 'Date déjà prise', 'Hors sujet', 'Trop tôt pour en parler'];

export function RefuseSheet({ visible, onClose, onRefuse }: { visible: boolean; onClose: () => void; onRefuse: (reason: string) => void }) {
  const [reason, setReason] = useState('');
  const submit = () => {
    const r = reason.trim();
    if (!r) return;
    onClose();
    setReason('');
    onRefuse(r);
  };
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <Text style={styles.sheetTitle}>Pourquoi refuser ?</Text>
        <Text style={styles.sheetSub}>L’auteur verra ce motif.</Text>
        <View style={styles.reasons}>
          {REASONS.map((r) => (
            <Pressable key={r} onPress={() => setReason(r)} style={[styles.reason, reason === r && styles.reasonOn]}>
              <Text style={[styles.reasonTxt, reason === r && { color: colors.bg }]}>{r}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          value={reason}
          onChangeText={setReason}
          placeholder="Ou écris ton motif…"
          placeholderTextColor={colors.inkMute}
          maxLength={200}
          style={form.input}
        />
        <View style={styles.sheetActions}>
          <Pressable onPress={onClose} style={[styles.sheetBtn, styles.sheetBtnGhost]}>
            <Text style={styles.sheetBtnGhostTxt}>Annuler</Text>
          </Pressable>
          <Pressable onPress={submit} disabled={!reason.trim()} style={[styles.sheetBtn, styles.sheetBtnPrimary, !reason.trim() && { opacity: 0.5 }]}>
            <Text style={styles.sheetBtnTxt}>Refuser</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Sortie
// ---------------------------------------------------------------------------
export function RideCard({ ctx, ride }: { ctx: GroupCtx; ride: Ride }) {
  const going = ride.participants.includes(ctx.b.me.userId);
  const past = Date.parse(ride.startsAt) < Date.now();
  const level = LEVELS.find((l) => l.key === ride.level)?.label;
  const toggle = () => setRideParticipation(ride.id, !going).catch(dialog.error('Action impossible'));
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <View style={styles.typeChip}>
          <Bike size={13} color={colors.neonBright} />
          <Text style={styles.typeTxt}>Sortie</Text>
        </View>
        {ctx.b.group.kind === 'pro' && !ride.membersOnly ? (
          <View style={[styles.status, { borderColor: colors.cyan + '66' }]}>
            <Text style={[styles.statusTxt, { color: colors.cyan }]}>Promue · Événements</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.pTitle}>{ride.title}</Text>
      <Meta icon={<Clock size={12} color={colors.inkMute} />} text={formatRideDate(ride.startsAt)} />
      <Meta icon={<MapPin size={12} color={colors.inkMute} />} text={`RDV ${ride.meetingPoint}`} />
      {ride.route ? <Text style={styles.pText}>{ride.route}</Text> : null}
      <View style={styles.footer}>
        <Users size={13} color={colors.inkDim} />
        <Text style={styles.metaTxt}>
          {ride.participants.length} inscrit{ride.participants.length > 1 ? 's' : ''}
          {level ? ` · ${level}` : ''}
        </Text>
        <View style={{ flex: 1 }} />
        {!past && (
          <Pressable onPress={toggle} style={going ? styles.ghostSmall : styles.accept}>
            {going ? <Check size={14} color={colors.success} /> : null}
            <Text style={going ? [styles.ghostSmallTxt, { color: colors.success }] : styles.acceptTxt}>{going ? 'J’y vais' : 'Je viens'}</Text>
          </Pressable>
        )}
      </View>
      {ride.fromSuggestionId ? <Text style={styles.origin}>Proposée par {ctx.nameOf(ride.createdBy)}</Text> : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Sondage
// ---------------------------------------------------------------------------
export function PollCard({ ctx, poll }: { ctx: GroupCtx; poll: Poll }) {
  const total = poll.counts.reduce((a, b) => a + b, 0);
  const closed = !!poll.endsAt && Date.parse(poll.endsAt) <= Date.now();
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <View style={styles.typeChip}>
          <BarChart3 size={13} color={colors.neonBright} />
          <Text style={styles.typeTxt}>Sondage</Text>
        </View>
        <Text style={styles.pHint}>{closed ? 'Clos' : poll.endsAt ? `Fin ${formatRideDate(poll.endsAt)}` : ''}</Text>
      </View>
      <Text style={styles.pTitle}>{poll.question}</Text>
      {poll.options.map((o, i) => {
        const pct = total ? Math.round((poll.counts[i]! / total) * 100) : 0;
        const mine = poll.myVote === i;
        return (
          <Pressable
            key={o}
            disabled={closed}
            onPress={() => votePoll(poll.id, i).catch(dialog.error('Vote impossible'))}
            style={[styles.option, mine && styles.optionMine]}
          >
            <View style={[styles.optionBar, { width: `${pct}%` }, mine && { backgroundColor: 'rgba(77,143,255,0.28)' }]} />
            <Text style={[styles.optionTxt, mine && { fontFamily: fonts.bold }]}>
              {mine ? '✓ ' : ''}
              {o}
            </Text>
            <Text style={styles.optionPct}>{pct} %</Text>
          </Pressable>
        );
      })}
      <Text style={styles.pHint}>
        {total} vote{total > 1 ? 's' : ''} · lancé par {ctx.nameOf(poll.createdBy)}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Annonce épinglée
// ---------------------------------------------------------------------------
export function AnnouncementBanner({ ctx, a }: { ctx: GroupCtx; a: Announcement }) {
  return (
    <View style={styles.banner}>
      <Pin size={14} color={colors.warn} />
      <View style={{ flex: 1 }}>
        <Text style={styles.bannerTxt}>{a.body}</Text>
        <Text style={styles.bannerBy}>Épinglée par {ctx.nameOf(a.authorId)}</Text>
      </View>
    </View>
  );
}

export function SystemLine({ text }: { text: string }) {
  return <Text style={styles.system}>{text}</Text>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  cardLive: { borderColor: 'rgba(251,191,36,0.35)' },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  typeChip: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  typeTxt: { fontFamily: fonts.bold, fontSize: 11, color: colors.neonBright, textTransform: 'uppercase', letterSpacing: 1 },
  status: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2 },
  statusTxt: { fontFamily: fonts.semibold, fontSize: 10.5 },
  by: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute },
  byName: { fontFamily: fonts.semibold, color: colors.inkDim },
  preview: { gap: 4, marginTop: 2 },
  pTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  pText: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim, lineHeight: 18 },
  pHint: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute },
  pOption: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaTxt: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim },
  outcome: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkDim, marginTop: 2 },
  origin: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  vote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    height: 30,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  voteOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  voteTxt: { fontFamily: fonts.monoBold, fontSize: 12, color: colors.inkDim },
  iconAction: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
  },
  accept: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 34, paddingHorizontal: 14, borderRadius: radius.pill, backgroundColor: colors.neon },
  acceptTxt: { fontFamily: fonts.bold, fontSize: 13, color: '#fff' },
  ghostSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  ghostSmallTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.inkDim },
  waiting: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute },
  option: {
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panelSoft,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    overflow: 'hidden',
    marginTop: 4,
  },
  optionMine: { borderColor: 'rgba(77,143,255,0.55)' },
  optionBar: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.06)' },
  optionTxt: { flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
  optionPct: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.inkDim },
  banner: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(251,191,36,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.3)',
    marginBottom: 10,
  },
  bannerTxt: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink, lineHeight: 18 },
  bannerBy: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginTop: 3 },
  system: { alignSelf: 'center', fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, marginVertical: 6, textAlign: 'center' },
  backdrop: { flex: 1, backgroundColor: 'rgba(7,9,15,0.6)' },
  sheet: {
    backgroundColor: colors.bg2,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
    paddingBottom: 32,
    gap: 12,
  },
  sheetTitle: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink },
  sheetSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, marginTop: -6 },
  reasons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  reason: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  reasonOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  reasonTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkDim },
  sheetActions: { flexDirection: 'row', gap: 10 },
  sheetBtn: { flex: 1, height: 46, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  sheetBtnGhost: { borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: colors.panelSoft },
  sheetBtnGhostTxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.inkDim },
  sheetBtnPrimary: { backgroundColor: colors.neon },
  sheetBtnTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
});
