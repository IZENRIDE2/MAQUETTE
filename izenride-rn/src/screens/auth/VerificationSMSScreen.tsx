import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { Smartphone, RefreshCw, MessageCircle, Zap } from 'lucide-react-native';
import { Screen, AppBar } from '@/components';
import { colors, fonts, radius } from '@/theme';

/**
 * Vérification SMS — saisie du code OTP à 6 chiffres (localisé Paris, +33).
 * Étape 4/5 du parcours d'inscription.
 */
export default function VerificationSMSScreen() {
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/[^0-9]/g, '').slice(-1);
    setCode((prev) => prev.map((c, idx) => (idx === i ? d : c)));
  };

  return (
    <Screen pad={0}>
      <View style={styles.headerWrap}>
        <AppBar title="Vérification SMS" right={<View style={styles.stepBadge}><Text style={styles.stepTxt}>4 / 5</Text></View>} />
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Smartphone size={38} color={colors.neon} />
        </View>
        <Text style={styles.title}>Saisis le code reçu</Text>
        <Text style={styles.subtitle}>
          On vient d'envoyer un code à <Text style={styles.strong}>6 chiffres</Text> par SMS.
          Il est valable <Text style={styles.strong}>10 minutes</Text>.
        </Text>
      </View>

      {/* Chip numéro */}
      <View style={styles.chip}>
        <View style={styles.flag}>
          <View style={styles.flagBlue} />
          <View style={styles.flagWhite} />
          <View style={styles.flagRed} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.chipLabel}>Envoyé au</Text>
          <Text style={styles.chipValue}>+33 6 12 •• •• 89</Text>
        </View>
        <Pressable style={styles.chipEdit}>
          <Text style={styles.chipEditTxt}>Modifier</Text>
        </Pressable>
      </View>

      {/* OTP */}
      <View style={styles.otpSection}>
        <Text style={styles.otpLabel}>Code à 6 chiffres</Text>
        <View style={styles.otpRow}>
          {code.map((d, i) => (
            <TextInput
              key={i}
              style={[styles.otpCell, d ? styles.otpCellFilled : null]}
              value={d}
              onChangeText={(v) => setDigit(i, v)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>
      </View>

      {/* Astuce auto-fill */}
      <View style={styles.autofill}>
        <View style={styles.autofillIcon}>
          <Zap size={14} color={colors.purple} />
        </View>
        <Text style={styles.autofillTxt}>
          <Text style={styles.strong}>Saisie automatique : </Text>
          ton code peut apparaître au-dessus du clavier dès la réception du SMS.
        </Text>
      </View>

      {/* Renvoi */}
      <View style={styles.resend}>
        <Text style={styles.resendQuestion}>Tu n'as pas reçu le SMS ?</Text>
        <Pressable style={styles.resendBtn} disabled>
          <RefreshCw size={16} color={colors.inkMute} />
          <Text style={styles.resendBtnTxt}>Renvoyer dans</Text>
          <Text style={styles.countdown}>0:60</Text>
        </Pressable>
        <Pressable style={styles.channelAlt}>
          <MessageCircle size={14} color={colors.inkMute} />
          <Text style={styles.channelAltTxt}>
            Recevoir par <Text style={{ color: colors.neonBright, fontFamily: fonts.semibold }}>WhatsApp</Text>
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: { paddingHorizontal: 18 },
  stepBadge: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  stepTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkDim, letterSpacing: 0.4 },

  hero: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 22, alignItems: 'center' },
  iconCircle: {
    width: 78,
    height: 78,
    borderRadius: 22,
    backgroundColor: 'rgba(77,143,255,0.14)',
    borderWidth: 1.5,
    borderColor: 'rgba(77,143,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  title: { fontFamily: fonts.bold, fontSize: 26, color: colors.ink, textAlign: 'center', marginBottom: 10, letterSpacing: -0.5 },
  subtitle: { fontFamily: fonts.regular, fontSize: 14.5, color: colors.inkDim, textAlign: 'center', lineHeight: 22, maxWidth: 320 },
  strong: { fontFamily: fonts.semibold, color: colors.ink },

  chip: {
    marginHorizontal: 24,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flag: { width: 32, height: 32, borderRadius: 16, overflow: 'hidden', flexDirection: 'row', borderWidth: 1.5, borderColor: colors.line },
  flagBlue: { flex: 1, backgroundColor: '#002654' },
  flagWhite: { flex: 1, backgroundColor: '#ffffff' },
  flagRed: { flex: 1, backgroundColor: '#ED2939' },
  chipLabel: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.5 },
  chipValue: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink, letterSpacing: 0.3 },
  chipEdit: {
    backgroundColor: 'rgba(77,143,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.25)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipEditTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.neonBright },

  otpSection: { paddingHorizontal: 24, paddingTop: 24 },
  otpLabel: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.4, textAlign: 'center', marginBottom: 12 },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  otpCell: {
    flex: 1,
    maxWidth: 50,
    height: 60,
    backgroundColor: colors.bg2,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 14,
    color: colors.ink,
    fontFamily: fonts.monoBold,
    fontSize: 24,
    textAlign: 'center',
  },
  otpCellFilled: { borderColor: 'rgba(77,143,255,0.35)', backgroundColor: '#131622' },

  autofill: {
    marginHorizontal: 24,
    marginTop: 14,
    backgroundColor: 'rgba(184,132,230,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(184,132,230,0.15)',
    borderRadius: 14,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  autofillIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(184,132,230,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  autofillTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, lineHeight: 17 },

  resend: { marginTop: 'auto', paddingHorizontal: 24, paddingTop: 18, paddingBottom: 12, alignItems: 'center' },
  resendQuestion: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkMute, marginBottom: 10 },
  resendBtn: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minWidth: 240,
  },
  resendBtnTxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.inkMute },
  countdown: { fontFamily: fonts.mono, fontSize: 14, color: colors.inkMute },
  channelAlt: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, padding: 10 },
  channelAltTxt: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkMute },
});
