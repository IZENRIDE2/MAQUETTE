/**
 * Dialogues aux couleurs IzenRide, à la place des alertes système
 * (claires sur iOS/web, hors charte). Un seul <DialogHost/> est monté
 * dans app/_layout.tsx ; les écrans appellent `dialog.confirm` / `dialog.info`.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { colors, fonts, radius, shadow } from '@/theme';

type Request = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string | null;
  destructive?: boolean;
  resolve: (ok: boolean) => void;
};

let push: ((r: Request) => void) | null = null;
const queue: Request[] = [];

function open(r: Omit<Request, 'resolve'>): Promise<boolean> {
  return new Promise((resolve) => {
    const req = { ...r, resolve };
    if (push) push(req);
    else queue.push(req);
  });
}

export const dialog = {
  /** Demande une confirmation ; résout `true` si l'utilisateur confirme. */
  confirm: (opts: { title: string; message?: string; confirmLabel?: string; destructive?: boolean }) =>
    open({ cancelLabel: 'Annuler', confirmLabel: 'Confirmer', ...opts }),
  /** Message d'information (un seul bouton). */
  info: (title: string, message?: string) => open({ title, message, confirmLabel: 'OK', cancelLabel: null }).then(() => undefined),
  /** Affiche une erreur (message déjà traduit par l'API). */
  error: (title: string) => (e: unknown) => open({ title, message: (e as Error)?.message, confirmLabel: 'OK', cancelLabel: null }),
};

export function DialogHost() {
  const [current, setCurrent] = useState<Request | null>(null);
  const [pending, setPending] = useState<Request[]>([]);

  useEffect(() => {
    push = (r) => setPending((p) => [...p, r]);
    if (queue.length) setPending(queue.splice(0));
    return () => {
      push = null;
    };
  }, []);

  useEffect(() => {
    if (!current && pending.length) {
      setCurrent(pending[0]!);
      setPending((p) => p.slice(1));
    }
  }, [current, pending]);

  const close = (ok: boolean) => {
    current?.resolve(ok);
    setCurrent(null);
  };

  return (
    <Modal visible={!!current} transparent animationType="fade" onRequestClose={() => close(false)}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{current?.title}</Text>
          {current?.message ? <Text style={styles.message}>{current.message}</Text> : null}
          <View style={styles.actions}>
            {current?.cancelLabel ? (
              <Pressable onPress={() => close(false)} style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && { opacity: 0.7 }]}>
                <Text style={styles.btnGhostTxt}>{current.cancelLabel}</Text>
              </Pressable>
            ) : null}
            <Pressable
              onPress={() => close(true)}
              style={({ pressed }) => [styles.btn, current?.destructive ? styles.btnDanger : styles.btnPrimary, pressed && { opacity: 0.8 }]}
            >
              <Text style={[styles.btnTxt, current?.destructive && { color: colors.danger }]}>{current?.confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(7,9,15,0.78)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    borderRadius: radius.xl,
    padding: 20,
    ...shadow.card,
  },
  title: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink },
  message: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim, lineHeight: 19, marginTop: 8 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  btn: { flex: 1, height: 46, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  btnGhost: { borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: colors.panelSoft },
  btnGhostTxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.inkDim },
  btnPrimary: { backgroundColor: colors.neon },
  btnDanger: { backgroundColor: 'rgba(255,92,122,0.12)', borderWidth: 1, borderColor: 'rgba(255,92,122,0.45)' },
  btnTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
});
