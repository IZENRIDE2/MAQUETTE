import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Building2, CircleAlert, CircleHelp, CloudOff } from 'lucide-react-native';
import { colors, fonts } from '@/theme';
import { nameMatchesRegistry } from '@/api/siret';
import type { RegistryCheck, RegistryLookup } from '@/api/types';

/** « 2019-03-12 » → « 12/03/2019 » */
export const frDate = (iso: string | null) => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : '');

/** « BERCY MOTOS » → « Bercy Motos » (pour préremplir la raison sociale). */
export const titleCase = (s: string) => s.toLowerCase().replace(/(^|[\s'’-])(\p{L})/gu, (_, sep: string, c: string) => sep + c.toUpperCase());

const formatSiren = (s: string) => s.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3');

/**
 * Fiche du registre des entreprises pour un SIRET : établissement actif,
 * fermé ou introuvable, ou registre injoignable. `enteredName` compare la
 * raison sociale saisie à la dénomination et à l'enseigne.
 */
export function RegistryCard({
  loading,
  lookup,
  registry,
  enteredName,
  footer,
}: {
  loading?: boolean;
  lookup?: RegistryLookup | null;
  registry?: RegistryCheck | null;
  enteredName?: string;
  footer?: React.ReactNode;
}) {
  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="small" color={colors.neonBright} />
        <Text style={styles.muted}>Recherche au registre des entreprises…</Text>
      </View>
    );
  }
  const r = registry ?? (lookup && 'result' in lookup ? lookup.result : null);
  const error = lookup && 'error' in lookup ? lookup.error : null;

  if (!r) {
    const text =
      error === 'rate_limited'
        ? 'Trop de recherches en peu de temps : réessaie dans une heure. Tu peux quand même envoyer ta demande.'
        : lookup === undefined || lookup === null
          ? 'Pas encore consulté au registre des entreprises.'
          : 'Registre des entreprises injoignable pour l’instant : la demande sera vérifiée à la main.';
    return (
      <View style={styles.card}>
        {lookup ? <CloudOff size={16} color={colors.inkMute} /> : <CircleHelp size={16} color={colors.inkMute} />}
        <View style={styles.body}>
          <Text style={styles.muted}>{text}</Text>
          {footer}
        </View>
      </View>
    );
  }

  if (r.status === 'not_found') {
    return (
      <View style={[styles.card, styles.warnCard]}>
        <CircleAlert size={16} color={colors.warn} />
        <View style={styles.body}>
          <Text style={styles.title}>SIRET introuvable au registre</Text>
          <Text style={styles.line}>
            Vérifie le numéro sur le Kbis ou l’avis de situation INSEE. Une entreprise immatriculée ces derniers jours peut ne pas encore y figurer.
          </Text>
          <Source r={r} />
          {footer}
        </View>
      </View>
    );
  }

  const closed = r.status === 'closed';
  const mismatch = !!enteredName?.trim() && !nameMatchesRegistry(enteredName, r);
  return (
    <View style={[styles.card, closed ? styles.warnCard : styles.goodCard]}>
      {closed ? <CircleAlert size={16} color={colors.warn} /> : <Building2 size={16} color={colors.cyan} />}
      <View style={styles.body}>
        <Text style={styles.title}>
          {r.legalName ?? 'Entreprise'}
          {r.tradeName && r.tradeName.toLowerCase() !== r.legalName?.toLowerCase() ? <Text style={styles.trade}>  ·  {r.tradeName}</Text> : null}
        </Text>
        <Text style={[styles.state, { color: closed ? colors.warn : colors.cyan }]}>
          {closed ? `Établissement fermé${r.closedOn ? ` le ${frDate(r.closedOn)}` : ''}` : 'Établissement en activité'}
        </Text>
        {r.legalForm ? <Text style={styles.line}>{r.legalForm}</Text> : null}
        {r.nafLabel ? <Text style={styles.line}>{r.nafLabel}</Text> : null}
        {r.address ? <Text style={styles.line}>{r.address}</Text> : null}
        <Text style={styles.line}>
          {[r.siren ? `SIREN ${formatSiren(r.siren)}` : null, r.createdOn ? `créée le ${frDate(r.createdOn)}` : null].filter(Boolean).join(' · ')}
        </Text>
        {closed ? <Text style={styles.note}>Le badge est réservé aux organisations en activité.</Text> : null}
        {!closed && mismatch ? (
          <Text style={styles.note}>La raison sociale saisie (« {enteredName!.trim()} ») diffère du registre : le justificatif devra faire le lien.</Text>
        ) : null}
        <Source r={r} stale={!!lookup && 'stale' in lookup && !!lookup.stale} />
        {footer}
      </View>
    </View>
  );
}

const Source = ({ r, stale }: { r: RegistryCheck; stale?: boolean }) => (
  <Text style={styles.source}>
    Registre national des entreprises via Pappers · consulté le {frDate(r.checkedAt)}
    {stale ? ' (registre injoignable, dernier résultat connu)' : ''}
  </Text>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    marginTop: 10,
  },
  goodCard: { borderColor: 'rgba(34,211,238,0.35)' },
  warnCard: { borderColor: 'rgba(251,191,36,0.45)' },
  body: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.bold, fontSize: 13.5, color: colors.ink },
  trade: { fontFamily: fonts.medium, color: colors.inkDim },
  state: { fontFamily: fonts.semibold, fontSize: 12, marginBottom: 2 },
  line: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, lineHeight: 17 },
  note: { fontFamily: fonts.medium, fontSize: 12, color: colors.warn, marginTop: 4, lineHeight: 17 },
  muted: { flex: 1, fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkDim, lineHeight: 18 },
  source: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.inkMute, marginTop: 5 },
});
