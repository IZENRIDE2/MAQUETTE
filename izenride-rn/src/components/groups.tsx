/**
 * Briques d'interface des écrans Groupes : avatar de groupe, badge de rôle,
 * feuille d'actions, états vide / erreur, sélecteur d'utilisateur (démo).
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { BadgeCheck, Building2, Users, AlertTriangle, Eye } from 'lucide-react-native';
import { colors, fonts, radius } from '@/theme';
import { isDemo } from '@/api/supabase';
import { demoMe, demoProfiles, setDemoMe } from '@/api/demoStore';
import type { GroupKind } from '@/api/types';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');

/** Titre de section, au style des écrans existants (Réglages, Signalement…). */
export function SectionTitle({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[form.sectionTitle, style]}>{children}</Text>;
}

/** Styles de formulaire partagés, alignés sur Inscription / Paramètres du compte. */
export const form = StyleSheet.create({
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.inkMute,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  fieldLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.inkMute,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.ink,
  },
  textarea: { minHeight: 88, textAlignVertical: 'top', lineHeight: 20 },
  search: {
    flex: 1,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 11,
    paddingHorizontal: 14,
  },
  searchInput: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.ink },
});

/** Avatar carré arrondi d'un groupe : initiales + icône du type. */
export function GroupAvatar({
  name,
  kind,
  size = 52,
  verified,
  dot,
  style,
}: {
  name: string;
  kind: GroupKind;
  size?: number;
  verified?: boolean;
  /** Pastille orange : suggestions en attente (lot 2). */
  dot?: boolean;
  style?: ViewStyle;
}) {
  const bg = kind === 'pro' ? 'rgba(34,211,238,0.14)' : 'rgba(77,143,255,0.16)';
  const border = kind === 'pro' ? 'rgba(34,211,238,0.45)' : 'rgba(77,143,255,0.45)';
  const Icon = kind === 'pro' ? Building2 : Users;
  return (
    <View style={[{ width: size, height: size }, style]}>
      <View style={[styles.gAv, { width: size, height: size, borderRadius: size * 0.32, backgroundColor: bg, borderColor: border }]}>
        <Text style={[styles.gAvTxt, { fontSize: size * 0.34 }]}>{initials(name)}</Text>
      </View>
      <View style={[styles.gKind, { borderColor: colors.bg }]}>
        {verified ? <BadgeCheck size={12} color={colors.cyan} /> : <Icon size={11} color={colors.inkDim} />}
      </View>
      {dot ? <View style={styles.gDot} /> : null}
    </View>
  );
}

/** Pastille de rôle à la couleur du rôle. */
export function RoleBadge({ name, color, small }: { name: string; color: string; small?: boolean }) {
  return (
    <View style={[styles.role, { borderColor: color + '88', backgroundColor: color + '1f' }, small && { paddingVertical: 2, paddingHorizontal: 7 }]}>
      <View style={[styles.roleDot, { backgroundColor: color }]} />
      <Text style={[styles.roleTxt, { color }, small && { fontSize: 10 }]}>{name}</Text>
    </View>
  );
}

/** Badge « Vérifié » des groupes pro. */
export function VerifiedBadge() {
  return (
    <View style={styles.verified}>
      <BadgeCheck size={12} color={colors.cyan} />
      <Text style={styles.verifiedTxt}>Vérifié</Text>
    </View>
  );
}

export type SheetAction = {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  destructive?: boolean;
  hint?: string;
};

/** Feuille d'actions en bas d'écran (appui long sur un membre, etc.). */
export function ActionSheet({
  visible,
  title,
  subtitle,
  actions,
  onClose,
}: {
  visible: boolean;
  title?: string;
  subtitle?: string;
  actions: SheetAction[];
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.grip} />
        {title ? <Text style={styles.sheetTitle}>{title}</Text> : null}
        {subtitle ? <Text style={styles.sheetSub}>{subtitle}</Text> : null}
        {actions.map((a) => (
          <Pressable
            key={a.label}
            onPress={() => {
              onClose();
              // Laisse la feuille se fermer : iOS n'empile pas deux Modal en transition.
              setTimeout(a.onPress, 320);
            }}
            style={({ pressed }) => [styles.sheetRow, pressed && { backgroundColor: 'rgba(255,255,255,0.05)' }]}
          >
            {a.icon ? <View style={styles.sheetIcon}>{a.icon}</View> : null}
            <View style={{ flex: 1 }}>
              <Text style={[styles.sheetLbl, a.destructive && { color: colors.danger }]}>{a.label}</Text>
              {a.hint ? <Text style={styles.sheetHint}>{a.hint}</Text> : null}
            </View>
          </Pressable>
        ))}
        <Pressable onPress={onClose} style={styles.sheetCancel}>
          <Text style={styles.sheetCancelTxt}>Annuler</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

/** État vide centré. */
export function EmptyState({ icon, title, text, action }: { icon: React.ReactNode; title: string; text?: string; action?: React.ReactNode }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>{icon}</View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {text ? <Text style={styles.emptyTxt}>{text}</Text> : null}
      {action ? <View style={{ marginTop: 16, alignSelf: 'stretch' }}>{action}</View> : null}
    </View>
  );
}

/** Chargement ou erreur d'un écran de groupe. */
export function LoadState({ loading, error, onRetry }: { loading: boolean; error?: { message: string } | null; onRetry?: () => void }) {
  if (loading) {
    return (
      <View style={styles.empty}>
        <ActivityIndicator color={colors.neonBright} />
      </View>
    );
  }
  return (
    <EmptyState
      icon={<AlertTriangle size={22} color={colors.warn} />}
      title="Impossible d’afficher le groupe"
      text={error?.message}
      action={
        onRetry ? (
          <Pressable onPress={onRetry} style={styles.retry}>
            <Text style={styles.retryTxt}>Réessayer</Text>
          </Pressable>
        ) : undefined
      }
    />
  );
}

/**
 * Mode démo uniquement : change l'utilisateur courant pour voir l'app
 * avec d'autres droits (fondateur, admin, simple membre…).
 */
export function DemoUserSwitcher({ memberIds, roleNameOf }: { memberIds: string[]; roleNameOf: (userId: string) => string }) {
  if (!isDemo) return null;
  const people = demoProfiles().filter((p) => memberIds.includes(p.id));
  const me = demoMe();
  const current = people.find((p) => p.id === me);
  const next = () => {
    const i = people.findIndex((p) => p.id === me);
    setDemoMe(people[(i + 1) % people.length]!.id);
  };
  return (
    <Pressable onPress={next} style={styles.demo}>
      <Eye size={12} color={colors.warn} />
      <Text style={styles.demoTxt} numberOfLines={1}>
        Démo · vu par {current?.name ?? '—'} ({roleNameOf(me)}) · toucher pour changer
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gAv: { alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  gAvTxt: { fontFamily: fonts.bold, color: colors.ink },
  gKind: {
    position: 'absolute',
    right: -3,
    bottom: -3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.bg2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gDot: {
    position: 'absolute',
    right: -2,
    top: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.warn,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  role: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingVertical: 3,
    paddingHorizontal: 9,
    alignSelf: 'flex-start',
  },
  roleDot: { width: 6, height: 6, borderRadius: 3 },
  roleTxt: { fontFamily: fonts.semibold, fontSize: 11 },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(34,211,238,0.12)',
  },
  verifiedTxt: { fontFamily: fonts.semibold, fontSize: 10, color: colors.cyan },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: {
    backgroundColor: colors.bg2,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    paddingBottom: 32,
  },
  grip: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: colors.lineStrong, marginBottom: 12 },
  sheetTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink, textAlign: 'center' },
  sheetSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, textAlign: 'center', marginTop: 2, marginBottom: 8 },
  sheetRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 8, borderRadius: radius.md },
  sheetIcon: { width: 28, alignItems: 'center' },
  sheetLbl: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  sheetHint: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, marginTop: 1 },
  sheetCancel: { marginTop: 8, paddingVertical: 14, alignItems: 'center', borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.05)' },
  sheetCancelTxt: { fontFamily: fonts.semibold, fontSize: 15, color: colors.inkDim },
  empty: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(77,143,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink, textAlign: 'center' },
  emptyTxt: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim, textAlign: 'center', marginTop: 6, lineHeight: 19 },
  retry: { paddingVertical: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.lineStrong, alignItems: 'center' },
  retryTxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  demo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(251,191,36,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.35)',
    marginBottom: 8,
    maxWidth: '100%',
  },
  demoTxt: { fontFamily: fonts.medium, fontSize: 11, color: colors.warn, flexShrink: 1 },
});
