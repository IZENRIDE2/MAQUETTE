import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard, AlertTriangle, RefreshCw } from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, radius } from '@/theme';

/** Paiement échoué — transaction Stripe refusée par la banque. */
export default function PaiementEchoueScreen() {
  return (
    <Screen scroll={false} pad={0}>
      <View style={styles.content}>
        {/* Hero centré */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <CreditCard size={46} color={colors.danger} />
          </View>
          <Text style={styles.title}>Paiement refusé</Text>
          <Text style={styles.sub}>Ta banque a refusé la transaction. Aucun montant n'a été débité.</Text>
        </View>

        {/* Raison */}
        <View style={styles.reason}>
          <AlertTriangle size={18} color={colors.danger} />
          <Text style={styles.reasonTxt}>
            <Text style={styles.reasonStrong}>Carte refusée (code 51)</Text> — provision insuffisante ou plafond
            atteint. Essaie une autre carte ou contacte ta banque.
          </Text>
        </View>

        {/* Détails */}
        <View style={styles.errCard}>
          <ErrRow k="Abonnement" v="Premium · mensuel" />
          <ErrRow k="Montant" v="9,99 €" border />
          <ErrRow k="Moyen" v="Visa •••• 4242" border />
          <ErrRow k="Statut" v="Échec" red border />
        </View>

        {/* CTA */}
        <View style={styles.ctaZone}>
          <Pressable>
            <LinearGradient colors={[colors.neon, '#2E7FCC']} style={styles.primaryBtn}>
              <RefreshCw size={18} color="#fff" />
              <Text style={styles.primaryTxt}>Réessayer le paiement</Text>
            </LinearGradient>
          </Pressable>
          <Pressable style={styles.ghostBtn}>
            <Text style={styles.ghostTxt}>Changer de moyen de paiement</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

function ErrRow({ k, v, red, border }: { k: string; v: string; red?: boolean; border?: boolean }) {
  return (
    <View style={[styles.errRow, border && styles.errBorder]}>
      <Text style={styles.errK}>{k}</Text>
      <Text style={[styles.errV, red && { color: colors.danger }]}>{v}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center' },

  hero: { alignItems: 'center', paddingHorizontal: 30, paddingBottom: 8 },
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: 30,
    backgroundColor: 'rgba(226,75,74,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(226,75,74,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.ink, textAlign: 'center', marginBottom: 12 },
  sub: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 23, color: colors.inkDim, textAlign: 'center', maxWidth: 310 },

  reason: {
    flexDirection: 'row',
    gap: 11,
    marginHorizontal: 24,
    marginBottom: 4,
    paddingVertical: 13,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(226,75,74,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(226,75,74,0.25)',
    borderRadius: radius.md,
  },
  reasonTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 12, lineHeight: 17, color: colors.ink },
  reasonStrong: { fontFamily: fonts.bold, color: colors.danger },

  errCard: {
    marginHorizontal: 24,
    marginTop: 12,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  errRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  errBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  errK: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim },
  errV: { fontFamily: fonts.monoBold, fontSize: 13, color: colors.ink },

  ctaZone: { paddingHorizontal: 24, paddingTop: 20, gap: 10 },
  primaryBtn: { height: 54, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryTxt: { fontFamily: fonts.bold, fontSize: 16, color: '#fff' },
  ghostBtn: {
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostTxt: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
});
