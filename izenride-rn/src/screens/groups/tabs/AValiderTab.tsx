import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Check, X, Inbox, CheckCheck } from 'lucide-react-native';
import { EmptyState, SectionTitle } from '@/components/groups';
import { dialog } from '@/components/Dialog';
import { colors, fonts, radius } from '@/theme';
import { acceptableTypes, decideSuggestion } from '@/api/groups';
import { TYPE_META } from '@/api/payloads';
import type { Suggestion, SuggestionType } from '@/api/types';
import { RefuseSheet, SuggestionCard } from '../feed/cards';
import type { GroupCtx } from '../feed/context';

/**
 * Boîte « À valider » : suggestions que l'utilisateur peut traiter, les plus
 * anciennes d'abord. Glisser à droite = accepter, à gauche = refuser.
 */
export default function AValiderTab({ ctx }: { ctx: GroupCtx }) {
  const types = acceptableTypes(ctx.b);
  const nowMs = Date.now();
  const pending = ctx.feed.suggestions
    .filter((s) => s.status === 'pending' && Date.parse(s.expiresAt) > nowMs && types.includes(s.type))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  if (!pending.length) {
    return <EmptyState icon={<Inbox size={22} color={colors.neonBright} />} title="Rien à valider" text="Les propositions des membres apparaîtront ici." />;
  }

  const byType = (Object.keys(TYPE_META) as SuggestionType[])
    .map((t) => ({ type: t, items: pending.filter((s) => s.type === t) }))
    .filter((g) => g.items.length > 0);

  const acceptAll = async (type: SuggestionType, items: Suggestion[]) => {
    const ok = await dialog.confirm({
      title: `Accepter ${items.length} suggestions ?`,
      message: `Toutes les propositions « ${TYPE_META[type].label.toLowerCase()} » en attente seront appliquées telles quelles.`,
      confirmLabel: 'Tout accepter',
    });
    if (!ok) return;
    let failed = 0;
    for (const s of items) {
      await decideSuggestion(s.id, true).catch(() => failed++);
    }
    if (failed) dialog.info('Acceptation partielle', `${failed} suggestion${failed > 1 ? 's n’ont' : ' n’a'} pas pu être appliquée${failed > 1 ? 's' : ''}.`);
  };

  return (
    <View>
      <Text style={styles.lead}>Glisse vers la droite pour accepter, vers la gauche pour refuser.</Text>
      {byType.map(({ type, items }) => (
        <View key={type} style={{ marginTop: 16 }}>
          <View style={styles.groupHead}>
            <SectionTitle style={{ marginBottom: 0 }}>
              {TYPE_META[type].label} · {items.length}
            </SectionTitle>
            {items.length > 1 && (
              <Pressable onPress={() => acceptAll(type, items)} style={styles.all}>
                <CheckCheck size={14} color={colors.neonBright} />
                <Text style={styles.allTxt}>Tout accepter</Text>
              </Pressable>
            )}
          </View>
          <View style={{ gap: 10, marginTop: 10 }}>
            {items.map((s) => (
              <SwipeRow key={s.id} ctx={ctx} s={s} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function SwipeRow({ ctx, s }: { ctx: GroupCtx; s: Suggestion }) {
  const ref = useRef<React.ElementRef<typeof Swipeable>>(null);
  const [refusing, setRefusing] = useState(false);

  const onOpen = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      decideSuggestion(s.id, true)
        .then((r) => r.status === 'expired' && dialog.info('Suggestion expirée', 'Rien n’a été créé.'))
        .catch(dialog.error('Acceptation impossible'))
        .finally(() => ref.current?.close());
    } else {
      setRefusing(true);
      ref.current?.close();
    }
  };

  return (
    <>
      <Swipeable
        ref={ref}
        friction={1.6}
        leftThreshold={70}
        rightThreshold={70}
        overshootLeft={false}
        overshootRight={false}
        onSwipeableOpen={onOpen}
        renderLeftActions={() => (
          <View style={[styles.action, styles.actionAccept]}>
            <Check size={20} color="#fff" />
            <Text style={styles.actionTxt}>Accepter</Text>
          </View>
        )}
        renderRightActions={() => (
          <View style={[styles.action, styles.actionRefuse]}>
            <X size={20} color={colors.ink} />
            <Text style={styles.actionTxt}>Refuser</Text>
          </View>
        )}
      >
        {/* Fond opaque : les actions ne transparaissent pas au repos. Pas de tap : il entrerait en conflit avec le glissement. */}
        <View style={styles.opaque}>
          <SuggestionCard ctx={ctx} s={s} pressable={false} />
        </View>
      </Swipeable>
      <RefuseSheet
        visible={refusing}
        onClose={() => setRefusing(false)}
        onRefuse={(reason) => decideSuggestion(s.id, false, null, reason).catch(dialog.error('Refus impossible'))}
      />
    </>
  );
}

const styles = StyleSheet.create({
  lead: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, textAlign: 'center' },
  groupHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  all: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 5, paddingHorizontal: 10, borderRadius: radius.pill, borderWidth: 1, borderColor: 'rgba(77,143,255,0.4)' },
  allTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.neonBright },
  action: { width: 110, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 4 },
  actionAccept: { backgroundColor: colors.neon, marginRight: 8 },
  actionRefuse: { backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.lineStrong, marginLeft: 8 },
  actionTxt: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  opaque: { backgroundColor: colors.bg, borderRadius: 16 },
});
