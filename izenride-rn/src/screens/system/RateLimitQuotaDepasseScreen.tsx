import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  AlertTriangle,
  Heart,
  Clock,
  Star,
  Check,
  MessageCircle,
  Calendar,
} from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, radius } from '@/theme';

const GOLD = '#E8B547';
const GOLD_DEEP = '#B8862E';

/** Rate limit / quota dépassé — limite de likes quotidienne atteinte (feuille basse). */
export default function RateLimitQuotaDepasseScreen() {
  return (
    <Screen scroll={false} pad={0} edges={['bottom']} style={styles.dim}>
      {/* Scrim */}
      <View style={styles.scrim} />

      {/* Bottom sheet */}
      <View style={styles.sheet}>
        <View style={styles.grab} />

        {/* Head */}
        <View style={styles.head}>
          <Pressable style={styles.closeBtn}>
            <X size={13} color={colors.ink} strokeWidth={2.5} />
          </Pressable>
          <View style={styles.headIcon}>
            <Heart size={26} color={colors.danger} />
          </View>
          <View style={styles.headTag}>
            <AlertTriangle size={9} color={colors.danger} />
            <Text style={styles.headTagTxt}>Limite quotidienne atteinte</Text>
          </View>
          <Text style={styles.headTitle}>
            Plus de likes <Text style={styles.headTitleEm}>aujourd'hui</Text>
          </Text>
          <Text style={styles.headDesc}>
            Vous avez utilisé vos 20 likes gratuits. Ils repartent à zéro à minuit.
          </Text>
        </View>

        {/* Usage meter */}
        <View style={styles.meterCard}>
          <View style={styles.meterHead}>
            <View style={styles.meterLabelRow}>
              <Heart size={10} color={colors.danger} fill={colors.danger} />
              <Text style={styles.meterLabel}>Likes utilisés</Text>
            </View>
            <Text style={styles.meterCount}>
              20 <Text style={styles.meterTotal}>/ 20</Text>
            </Text>
          </View>
          <View style={styles.meterBar}>
            <LinearGradient colors={[colors.danger, '#c43d3c']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.meterFill} />
          </View>
          <View style={styles.meterFoot}>
            <Text style={styles.meterFootTxt}>
              <Text style={styles.meterFootStrong}>100 %</Text> consommé
            </Text>
            <Text style={styles.meterFootTxt}>
              Reset · <Text style={styles.meterFootStrong}>00:00</Text>
            </Text>
          </View>
        </View>

        {/* Countdown */}
        <View style={styles.countdown}>
          <View style={styles.countdownIcon}>
            <Clock size={20} color={colors.neon} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.countdownLabel}>Recharge automatique dans</Text>
            <Text style={styles.countdownTime}>
              14<Text style={styles.countdownUnit}>h</Text> 19<Text style={styles.countdownUnit}>min</Text>
            </Text>
            <Text style={styles.countdownMeta}>
              Aujourd'hui à <Text style={styles.countdownMetaStrong}>00:00</Text> · 29 avr
            </Text>
          </View>
        </View>

        {/* Pro card */}
        <View style={styles.proCard}>
          <View style={styles.proHead}>
            <LinearGradient colors={[GOLD, GOLD_DEEP]} style={styles.proIcon}>
              <Star size={18} color="#1a1408" fill="#1a1408" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <View style={styles.proTag}>
                <Text style={styles.proTagTxt}>IzenRide Pro</Text>
              </View>
              <Text style={styles.proTitle}>
                Likez <Text style={styles.proTitleStrong}>sans limite</Text>
              </Text>
            </View>
          </View>

          <View style={styles.proBenefits}>
            <Benefit text="Likes illimités par jour ×∞" />
            <Benefit text="Voir qui vous a liké en premier" />
            <Benefit text="Boost mensuel offert" />
          </View>

          <View style={styles.proPriceRow}>
            <View>
              <Text style={styles.proPriceLabel}>À partir de</Text>
              <Text style={styles.proPriceValue}>
                7,99 €<Text style={styles.proPricePer}> / mois</Text>
              </Text>
            </View>
            <View style={styles.proTrial}>
              <Text style={styles.proTrialTxt}>Essai 7 j</Text>
            </View>
          </View>

          <Pressable>
            <LinearGradient colors={[GOLD, GOLD_DEEP]} style={styles.proBtn}>
              <Star size={14} color="#1a1408" fill="#1a1408" />
              <Text style={styles.proBtnTxt}>Passer Pro · 7 jours gratuits</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Alt ways */}
        <View style={styles.altSection}>
          <View style={styles.altHeadRow}>
            <Text style={styles.altHead}>Ou en attendant</Text>
            <View style={styles.altHeadLine} />
          </View>
          <View style={styles.altRow}>
            <View style={styles.altCard}>
              <View style={[styles.altIcon, { backgroundColor: 'rgba(127,119,221,0.12)' }]}>
                <MessageCircle size={13} color={colors.purple} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.altName}>Mes matchs</Text>
                <Text style={styles.altDesc}>Continuer à chatter</Text>
              </View>
            </View>
            <View style={styles.altCard}>
              <View style={[styles.altIcon, { backgroundColor: 'rgba(93,202,165,0.12)' }]}>
                <Calendar size={13} color={colors.successText} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.altName}>Événements</Text>
                <Text style={styles.altDesc}>3 sorties cette semaine</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.modalActions}>
          <Pressable style={styles.secondaryBtn}>
            <Text style={styles.secondaryTxt}>J'attendrai demain</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <View style={styles.benefit}>
      <View style={styles.benefitCheck}>
        <Check size={9} color={GOLD} strokeWidth={3} />
      </View>
      <Text style={styles.benefitTxt}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dim: { backgroundColor: '#000' },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },

  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '92%',
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingBottom: 8,
  },
  grab: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.inkMute, alignSelf: 'center', marginTop: 8 },

  head: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, alignItems: 'center' },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(226,75,74,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(226,75,74,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 3,
    backgroundColor: 'rgba(226,75,74,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(226,75,74,0.3)',
    borderRadius: radius.pill,
    marginBottom: 8,
  },
  headTagTxt: { fontFamily: fonts.monoBold, fontSize: 9, color: colors.danger, textTransform: 'uppercase', letterSpacing: 0.8 },
  headTitle: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink, textAlign: 'center', marginBottom: 4 },
  headTitleEm: { color: colors.danger },
  headDesc: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 17, color: colors.inkMute, textAlign: 'center', maxWidth: 280 },

  meterCard: { marginHorizontal: 16, marginTop: 14, padding: 14, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm },
  meterHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 },
  meterLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  meterLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8 },
  meterCount: { fontFamily: fonts.monoBold, fontSize: 13, color: colors.danger },
  meterTotal: { color: colors.inkMute, fontFamily: fonts.mono },
  meterBar: { height: 8, backgroundColor: colors.bg, borderRadius: 4, overflow: 'hidden' },
  meterFill: { height: '100%', width: '100%', borderRadius: 4 },
  meterFoot: { marginTop: 7, flexDirection: 'row', justifyContent: 'space-between' },
  meterFootTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },
  meterFootStrong: { fontFamily: fonts.monoBold, color: colors.ink },

  countdown: {
    marginHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.25)',
    borderRadius: radius.sm,
  },
  countdownIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(77,143,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  countdownLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
  countdownTime: { fontFamily: fonts.monoBold, fontSize: 22, color: colors.ink, marginBottom: 3 },
  countdownUnit: { fontFamily: fonts.mono, fontSize: 13, color: colors.inkMute },
  countdownMeta: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },
  countdownMetaStrong: { fontFamily: fonts.monoBold, color: colors.neonBright },

  proCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: 'rgba(232,181,71,0.35)',
    borderRadius: radius.md,
  },
  proHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  proIcon: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  proTag: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 1, backgroundColor: GOLD, borderRadius: 3, marginBottom: 3 },
  proTagTxt: { fontFamily: fonts.monoBold, fontSize: 8, color: '#1a1408', textTransform: 'uppercase', letterSpacing: 0.8 },
  proTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  proTitleStrong: { color: GOLD },
  proBenefits: { gap: 7, marginBottom: 14 },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  benefitCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(232,181,71,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(232,181,71,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.ink },

  proPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(8,9,14,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(232,181,71,0.2)',
    borderRadius: 11,
    marginBottom: 10,
  },
  proPriceLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8 },
  proPriceValue: { fontFamily: fonts.monoBold, fontSize: 17, color: colors.ink },
  proPricePer: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
  proTrial: { paddingHorizontal: 9, paddingVertical: 4, backgroundColor: 'rgba(93,202,165,0.12)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.3)', borderRadius: radius.pill },
  proTrialTxt: { fontFamily: fonts.monoBold, fontSize: 9, color: colors.successText, textTransform: 'uppercase', letterSpacing: 0.6 },
  proBtn: { height: 50, borderRadius: radius.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  proBtnTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#1a1408' },

  altSection: { paddingHorizontal: 16, paddingTop: 18 },
  altHeadRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  altHead: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1 },
  altHeadLine: { flex: 1, height: 1, backgroundColor: colors.line },
  altRow: { flexDirection: 'row', gap: 8 },
  altCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
  },
  altIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  altName: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  altDesc: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute, marginTop: 1 },

  modalActions: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
  secondaryBtn: {
    height: 44,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.inkMute },
});
