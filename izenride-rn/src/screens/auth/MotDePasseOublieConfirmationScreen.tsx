import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Mail, Check, Clock, ChevronRight, FileText, RefreshCw } from 'lucide-react-native';
import { Screen, AppBar } from '@/components';
import { colors, fonts } from '@/theme';

/** Mot de passe oublié — confirmation : lien envoyé, vérifier sa boîte de réception. */
export default function MotDePasseOublieConfirmationScreen() {
  return (
    <Screen pad={0}>
      <View style={styles.headerWrap}>
        <AppBar title="Récupération" />
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Mail size={44} color={colors.success} strokeWidth={1.8} />
          <View style={styles.checkBadge}>
            <Check size={16} color="#08090E" strokeWidth={3.5} />
          </View>
        </View>
        <Text style={styles.title}>Vérifie ta boîte{'\n'}de réception</Text>
        <Text style={styles.subtitle}>
          On vient de t'envoyer un lien pour réinitialiser ton mot de passe.
        </Text>
      </View>

      {/* Chip email */}
      <View style={styles.chip}>
        <View style={styles.chipIcon}>
          <Mail size={18} color={colors.neon} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.chipLabel}>Envoyé à</Text>
          <Text style={styles.chipValue} numberOfLines={1}>christophe@izenride.com</Text>
        </View>
        <Pressable style={styles.chipEdit}>
          <Text style={styles.chipEditTxt}>Modifier</Text>
        </Pressable>
      </View>

      {/* Timer */}
      <View style={styles.timerPanel}>
        <View style={styles.timerIcon}>
          <Clock size={16} color={colors.warn} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.timerTxt}>
            Le lien expire dans <Text style={styles.timerStrong}>30 minutes</Text>.
          </Text>
          <Text style={styles.timerSub}>Utilisable une seule fois pour ta sécurité.</Text>
        </View>
      </View>

      {/* Que faire ensuite */}
      <View style={styles.nextSteps}>
        <Text style={styles.sectionLabel}>Que faire ensuite</Text>

        <Pressable style={styles.stepCard}>
          <View style={[styles.stepCardIcon, styles.iconBlue]}>
            <Mail size={20} color={colors.neon} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.stepCardTitle}>Ouvrir l'app Mail</Text>
            <Text style={styles.stepCardDesc}>Accéder directement à ta messagerie</Text>
          </View>
          <ChevronRight size={18} color={colors.inkMute} />
        </Pressable>

        <Pressable style={styles.stepCard}>
          <View style={[styles.stepCardIcon, styles.iconViolet]}>
            <FileText size={20} color={colors.purple} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.stepCardTitle}>Pas reçu après 2 min ?</Text>
            <Text style={styles.stepCardDesc}>Vérifie aussi les spams et indésirables</Text>
          </View>
          <ChevronRight size={18} color={colors.inkMute} />
        </Pressable>
      </View>

      {/* Renvoi */}
      <View style={styles.resend}>
        <Text style={styles.resendQuestion}>Toujours rien dans ta boîte ?</Text>
        <Pressable style={styles.resendBtn} disabled>
          <RefreshCw size={16} color={colors.inkMute} />
          <Text style={styles.resendBtnTxt}>Renvoyer dans</Text>
          <Text style={styles.countdown}>0:60</Text>
        </Pressable>
        <Pressable style={styles.backToLogin}>
          <Text style={styles.backToLoginTxt}>
            Retour à la <Text style={{ color: colors.neonBright, fontFamily: fonts.semibold }}>connexion</Text>
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: { paddingHorizontal: 18 },

  hero: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 28, alignItems: 'center' },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: 'rgba(74,202,165,0.16)',
    borderWidth: 1.5,
    borderColor: 'rgba(74,222,128,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  checkBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.ink, textAlign: 'center', marginBottom: 12, letterSpacing: -0.6, lineHeight: 32 },
  subtitle: { fontFamily: fonts.regular, fontSize: 15, color: colors.inkDim, textAlign: 'center', lineHeight: 22, maxWidth: 320 },

  chip: {
    marginHorizontal: 24,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chipIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(77,143,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLabel: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  chipValue: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  chipEdit: {
    backgroundColor: 'rgba(77,143,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.25)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipEditTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.neonBright },

  timerPanel: {
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: 'rgba(251,191,36,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.18)',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timerIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(251,191,36,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerTxt: { fontFamily: fonts.regular, fontSize: 13, color: colors.ink, lineHeight: 18 },
  timerStrong: { fontFamily: fonts.bold, color: colors.warn },
  timerSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, marginTop: 2 },

  nextSteps: { marginHorizontal: 24, marginTop: 22 },
  sectionLabel: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, paddingLeft: 4 },
  stepCard: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  stepCardIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  iconBlue: { backgroundColor: 'rgba(77,143,255,0.12)', borderColor: 'rgba(77,143,255,0.22)' },
  iconViolet: { backgroundColor: 'rgba(184,132,230,0.12)', borderColor: 'rgba(184,132,230,0.22)' },
  stepCardTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink, marginBottom: 2 },
  stepCardDesc: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim },

  resend: { marginTop: 'auto', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 12, alignItems: 'center' },
  resendQuestion: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkMute, marginBottom: 10 },
  resendBtn: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minWidth: 220,
  },
  resendBtnTxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.inkMute },
  countdown: { fontFamily: fonts.mono, fontSize: 14, color: colors.inkMute },
  backToLogin: { padding: 12, marginTop: 4 },
  backToLoginTxt: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkMute },
});
