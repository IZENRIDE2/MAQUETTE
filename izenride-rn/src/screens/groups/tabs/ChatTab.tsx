import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Send } from 'lucide-react-native';
import { Avatar } from '@/components';
import { ActionSheet } from '@/components/groups';
import { dialog } from '@/components/Dialog';
import { colors, fonts, radius } from '@/theme';
import { canCreate, postMessage } from '@/api/groups';
import { TYPE_META } from '@/api/payloads';
import type { ChatMessage, SuggestionType } from '@/api/types';
import { groupRoutes } from '../routes';
import { AnnouncementBanner, PollCard, RideCard, SuggestionCard, SystemLine, TYPE_ICON } from '../feed/cards';
import type { GroupCtx } from '../feed/context';
import { isMuted } from './shared';

const ORDER: SuggestionType[] = ['ride', 'poll', 'announcement', 'member'];

/** Chat du groupe : messages, cartes de suggestion, sorties, sondages, annonces. */
export default function ChatTab({ ctx }: { ctx: GroupCtx }) {
  const router = useRouter();
  const { b, feed } = ctx;
  const scroll = useRef<ScrollView>(null);
  const [text, setText] = useState('');
  const [menu, setMenu] = useState(false);
  const muted = isMuted(b.members.find((m) => m.userId === b.me.userId)!);
  const pinned = feed.announcements.filter((a) => a.pinnedUntil && Date.parse(a.pinnedUntil) > Date.now());

  const send = async () => {
    const body = text.trim();
    if (!body) return;
    setText('');
    try {
      await postMessage(b.group.id, body);
    } catch (e) {
      setText(body);
      dialog.error('Message non envoyé')(e);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {pinned.map((a) => (
        <AnnouncementBanner key={a.id} ctx={ctx} a={a} />
      ))}
      <ScrollView
        ref={scroll}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 12, gap: 10 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}
      >
        {feed.messages.length === 0 && <SystemLine text="Aucun message pour l’instant. Lance la discussion !" />}
        {feed.messages.map((m) => (
          <Message key={m.id} ctx={ctx} m={m} />
        ))}
      </ScrollView>

      <View style={styles.composer}>
        <Pressable onPress={() => setMenu(true)} style={styles.plus} accessibilityLabel="Proposer ou créer">
          <Plus size={18} color={colors.neonBright} />
        </Pressable>
        <TextInput
          value={text}
          onChangeText={setText}
          editable={!muted}
          placeholder={muted ? 'Tu es en sourdine dans ce groupe.' : 'Écrire au groupe…'}
          placeholderTextColor={colors.inkMute}
          onSubmitEditing={send}
          returnKeyType="send"
          style={styles.input}
        />
        <Pressable onPress={send} disabled={!text.trim()} style={[styles.send, !!text.trim() && { backgroundColor: colors.neon }]}>
          <Send size={16} color={text.trim() ? '#fff' : colors.inkMute} />
        </Pressable>
      </View>

      <ActionSheet
        visible={menu}
        title="Ajouter au groupe"
        subtitle="Ce que ton rôle ne publie pas directement part en suggestion"
        onClose={() => setMenu(false)}
        actions={ORDER.map((t) => {
          const Icon = TYPE_ICON[t];
          const direct = canCreate(b, t);
          return {
            label: direct ? TYPE_META[t].create : TYPE_META[t].propose,
            hint: direct ? 'Publié immédiatement' : 'Validé en 1 clic par un habilité',
            icon: <Icon size={18} color={colors.ink} />,
            onPress: () => router.push(groupRoutes.propose(b.group.id, t)),
          };
        })}
      />
    </View>
  );
}

function Message({ ctx, m }: { ctx: GroupCtx; m: ChatMessage }) {
  const { feed, b } = ctx;
  switch (m.kind) {
    case 'text': {
      const mine = m.authorId === b.me.userId;
      const name = ctx.nameOf(m.authorId);
      const signature = ctx.signature(m.authorId);
      return (
        <View style={[styles.row, mine && { justifyContent: 'flex-end' }]}>
          {!mine && <Avatar label={name[0]} size={28} />}
          <View style={[styles.bubble, mine ? styles.mine : styles.other]}>
            {!mine && <Text style={styles.who}>{signature}</Text>}
            <Text style={styles.txt}>{m.body}</Text>
          </View>
        </View>
      );
    }
    case 'suggestion': {
      const s = feed.suggestions.find((x) => x.id === m.refId);
      return s ? <SuggestionCard ctx={ctx} s={s} compact /> : null;
    }
    case 'ride': {
      const r = feed.rides.find((x) => x.id === m.refId);
      return r ? <RideCard ctx={ctx} ride={r} /> : null;
    }
    case 'poll': {
      const p = feed.polls.find((x) => x.id === m.refId);
      return p ? <PollCard ctx={ctx} poll={p} /> : null;
    }
    case 'announcement': {
      const a = feed.announcements.find((x) => x.id === m.refId);
      return a ? <SystemLine text={`📌 ${ctx.nameOf(a.authorId)} a publié une annonce : « ${a.body} »`} /> : null;
    }
    case 'invite': {
      const i = feed.invites.find((x) => x.id === m.refId);
      return i ? <SystemLine text={`${ctx.nameOf(i.invitedBy)} a invité ${ctx.nameOf(i.inviteeId)} · ${i.status === 'pending' ? 'en attente' : i.status === 'accepted' ? 'a rejoint' : 'a décliné'}`} /> : null;
    }
    case 'system':
      return <SystemLine text={`${ctx.nameOf(m.authorId)} a rejoint le groupe 👋`} />;
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  bubble: { maxWidth: '78%', paddingVertical: 9, paddingHorizontal: 12, borderRadius: radius.lg },
  other: { backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderBottomLeftRadius: 6 },
  mine: { backgroundColor: colors.neon, borderBottomRightRadius: 6 },
  who: { fontFamily: fonts.semibold, fontSize: 11, color: colors.neonBright, marginBottom: 2 },
  txt: { fontFamily: fonts.regular, fontSize: 14, color: colors.ink, lineHeight: 19 },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 8,
  },
  plus: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(77,143,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.35)',
  },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.ink, paddingVertical: 6 },
  send: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
});
