import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { Send, Bike, Clock, MapPin } from 'lucide-react-native';
import { Screen, AppBar } from '@/components';
import { LoadState } from '@/components/groups';
import { dialog } from '@/components/Dialog';
import { colors, fonts, radius } from '@/theme';
import { useQuery } from '@/api/useQuery';
import { currentUserId, getDirectThread, sendDirectMessage, subscribeDirectMessages } from '@/api/friends';
import { formatRideDate } from '@/api/payloads';
import type { DirectMessage } from '@/api/types';

/** Conversation 1-1 : messages, « V » de motard, sorties proposées. */
export default function ConversationDirecteScreen({ userId }: { userId: string }) {
  const thread = useQuery(async () => ({ me: await currentUserId(), ...(await getDirectThread(userId)) }), [userId], subscribeDirectMessages);
  const scroll = useRef<ScrollView>(null);
  const [text, setText] = useState('');

  if (!thread.data) {
    return (
      <Screen>
        <AppBar title="Conversation" />
        <LoadState loading={!thread.error} error={thread.error} onRetry={thread.reload} />
      </Screen>
    );
  }
  const { me, other, messages } = thread.data;

  const send = async () => {
    const body = text.trim();
    if (!body) return;
    setText('');
    try {
      await sendDirectMessage(userId, 'text', body);
    } catch (e) {
      setText(body);
      dialog.error('Message non envoyé')(e);
    }
  };

  return (
    <Screen scroll={false}>
      <AppBar title={other.name} />
      <ScrollView
        ref={scroll}
        style={{ flex: 1 }}
        contentContainerStyle={{ gap: 10, paddingBottom: 12 }}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}
      >
        {messages.length === 0 && <Text style={styles.empty}>Dis bonjour à {other.name} 👋</Text>}
        {messages.map((m) => (
          <Bubble key={m.id} m={m} mine={m.senderId === me} />
        ))}
      </ScrollView>
      <View style={styles.composer}>
        <TextInput value={text} onChangeText={setText} placeholder={`Écrire à ${other.name}…`} placeholderTextColor={colors.inkMute} onSubmitEditing={send} style={styles.input} />
        <Pressable onPress={send} disabled={!text.trim()} style={[styles.send, !!text.trim() && { backgroundColor: colors.neon }]} accessibilityLabel="Envoyer">
          <Send size={16} color={text.trim() ? '#fff' : colors.inkMute} />
        </Pressable>
      </View>
    </Screen>
  );
}

function Bubble({ m, mine }: { m: DirectMessage; mine: boolean }) {
  if (m.kind === 'wave') {
    return (
      <View style={[styles.row, mine && styles.right]}>
        <Text style={styles.wave}>🤘</Text>
      </View>
    );
  }
  if (m.kind === 'ride' && m.payload) {
    return (
      <View style={[styles.row, mine && styles.right]}>
        <View style={styles.ride}>
          <View style={styles.rideHead}>
            <Bike size={13} color={colors.neonBright} />
            <Text style={styles.rideKicker}>Sortie proposée</Text>
          </View>
          <Text style={styles.rideTitle}>{m.payload.title}</Text>
          <View style={styles.meta}>
            <Clock size={12} color={colors.inkMute} />
            <Text style={styles.metaTxt}>{formatRideDate(m.payload.starts_at)}</Text>
          </View>
          <View style={styles.meta}>
            <MapPin size={12} color={colors.inkMute} />
            <Text style={styles.metaTxt}>RDV {m.payload.meeting_point}</Text>
          </View>
        </View>
      </View>
    );
  }
  return (
    <View style={[styles.row, mine && styles.right]}>
      <View style={[styles.bubble, mine ? styles.mine : styles.other]}>
        <Text style={styles.txt}>{m.body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { alignSelf: 'center', fontFamily: fonts.regular, fontSize: 13, color: colors.inkMute, marginTop: 40 },
  row: { flexDirection: 'row' },
  right: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '80%', paddingVertical: 9, paddingHorizontal: 12, borderRadius: radius.lg },
  other: { backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderBottomLeftRadius: 6 },
  mine: { backgroundColor: colors.neon, borderBottomRightRadius: 6 },
  txt: { fontFamily: fonts.regular, fontSize: 14, color: colors.ink, lineHeight: 19 },
  wave: { fontSize: 44 },
  ride: { width: '80%', padding: 12, borderRadius: 16, backgroundColor: colors.panel, borderWidth: 1, borderColor: 'rgba(77,143,255,0.35)', gap: 4 },
  rideHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rideKicker: { fontFamily: fonts.bold, fontSize: 11, color: colors.neonBright, textTransform: 'uppercase', letterSpacing: 1 },
  rideTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaTxt: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingLeft: 16,
    paddingRight: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 8,
  },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.ink, paddingVertical: 6 },
  send: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
});
