import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Eye, EyeOff, Shield, Check, AlertTriangle } from 'lucide-react-native';
import { Screen, AppBar } from '@/components';
import { colors, fonts } from '@/theme';

const CRITERIA = [
  { key: 'length', label: '8 caractères min.', test: (v: string) => v.length >= 8 },
  { key: 'upper', label: '1 majuscule', test: (v: string) => /[A-Z]/.test(v) },
  { key: 'lower', label: '1 minuscule', test: (v: string) => /[a-z]/.test(v) },
  { key: 'digit', label: '1 chiffre', test: (v: string) => /[0-9]/.test(v) },
  { key: 'special', label: '1 caractère spécial', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
  { key: 'diff', label: '≠ ancien MDP', test: (v: string) => v.length > 0 && v !== 'AncienMDP123!' },
];

const LEVELS = [
  { cls: '', label: '—', color: colors.inkMute },
  { cls: 'weak', label: 'Faible', color: colors.danger },
  { cls: 'fair', label: 'Moyen', color: colors.warn },
  { cls: 'good', label: 'Bon', color: colors.cyan },
  { cls: 'strong', label: 'Solide', color: colors.success },
];

/** Réinitialisation — création d'un nouveau mot de passe (force + critères). */
export default function ResetPasswordNouveauMotDePasseScreen() {
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);

  const validCount = useMemo(() => CRITERIA.filter((c) => c.test(pwd)).length, [pwd]);

  const strength = useMemo(() => {
    if (pwd.length === 0) return { level: 0, ...LEVELS[0] };
    if (validCount <= 1) return { level: 1, ...LEVELS[1] };
    if (validCount <= 3) return { level: 2, ...LEVELS[2] };
    if (validCount <= 4) return { level: 3, ...LEVELS[3] };
    return { level: 4, ...LEVELS[4] };
  }, [pwd, validCount]);

  const matches = confirm.length > 0 && pwd === confirm;
  const allValid = CRITERIA.every((c) => c.test(pwd));
  const canSubmit = allValid && matches;
  const showMatch = confirm.length > 0;

  return (
    <Screen pad={0}>
      <View style={styles.headerWrap}>
        <AppBar title="Réinitialisation" />
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Lock size={36} color={colors.neon} />
        </View>
        <Text style={styles.title}>Crée un nouveau{'\n'}mot de passe</Text>
        <Text style={styles.subtitle}>
          Choisis un mot de passe <Text style={styles.strong}>solide et unique</Text> pour sécuriser ton compte rider.
        </Text>
      </View>

      {/* Formulaire */}
      <View style={styles.form}>
        {/* Nouveau MDP */}
        <Text style={styles.fieldLabel}>Nouveau mot de passe</Text>
        <View style={styles.inputWrap}>
          <View style={styles.inputIcon}>
            <Lock size={18} color={colors.inkMute} />
          </View>
          <TextInput
            style={styles.input}
            value={pwd}
            onChangeText={setPwd}
            placeholder="••••••••••"
            placeholderTextColor="#4a5566"
            secureTextEntry={!show}
            autoCapitalize="none"
          />
          <Pressable style={styles.inputAction} onPress={() => setShow((s) => !s)}>
            {show ? <EyeOff size={20} color={colors.inkMute} /> : <Eye size={20} color={colors.inkMute} />}
          </Pressable>
        </View>

        {/* Barre de force */}
        <View style={styles.strengthRow}>
          <View style={styles.strengthTrack}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.strengthSeg,
                  i < strength.level && { backgroundColor: strength.color },
                ]}
              />
            ))}
          </View>
          <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
        </View>

        {/* Critères */}
        <View style={styles.criteria}>
          <View style={styles.criteriaHeader}>
            <Shield size={13} color={colors.inkMute} />
            <Text style={styles.criteriaHeaderTxt}>Critères de sécurité</Text>
          </View>
          <View style={styles.criteriaList}>
            {CRITERIA.map((c) => {
              const valid = c.test(pwd);
              return (
                <View key={c.key} style={styles.criterion}>
                  <View style={[styles.criterionIcon, valid && styles.criterionIconOn]}>
                    {valid ? <Check size={11} color="#08090E" strokeWidth={3.5} /> : null}
                  </View>
                  <Text style={[styles.criterionTxt, valid && { color: colors.ink }]}>{c.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Confirmation */}
        <Text style={[styles.fieldLabel, { marginTop: 18 }]}>Confirmer le mot de passe</Text>
        <View
          style={[
            styles.inputWrap,
            showMatch && (matches ? styles.wrapOk : styles.wrapError),
          ]}
        >
          <View style={styles.inputIcon}>
            <Lock size={18} color={showMatch ? (matches ? colors.success : colors.danger) : colors.inkMute} />
          </View>
          <TextInput
            style={styles.input}
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Retape le même mot de passe"
            placeholderTextColor="#4a5566"
            secureTextEntry={!show}
            autoCapitalize="none"
          />
          {showMatch ? (
            <View style={styles.matchIndicator}>
              {matches ? (
                <Check size={16} color={colors.success} strokeWidth={2.5} />
              ) : (
                <AlertTriangle size={16} color={colors.danger} />
              )}
              <Text style={[styles.matchTxt, { color: matches ? colors.success : colors.danger }]}>
                {matches ? 'Correspond' : 'Différent'}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Note sécurité */}
      <View style={styles.securityNote}>
        <View style={styles.securityIcon}>
          <AlertTriangle size={16} color={colors.purple} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.securityStrong}>Tu seras déconnecté de tous tes appareils.</Text>
          <Text style={styles.securitySub}>
            Pour ta sécurité, toutes les sessions actives sur d'autres appareils seront fermées.
          </Text>
        </View>
      </View>

      {/* CTA */}
      <View style={styles.ctaZone}>
        <Pressable disabled={!canSubmit} style={{ opacity: canSubmit ? 1 : 0.4 }}>
          <LinearGradient
            colors={canSubmit ? [colors.neon, '#2E7FCC'] : [colors.inkMute, colors.inkMute]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaPrimary}
          >
            <Text style={styles.ctaPrimaryTxt}>Mettre à jour le mot de passe</Text>
            <Check size={18} color="#fff" strokeWidth={2.5} />
          </LinearGradient>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: { paddingHorizontal: 18 },

  hero: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: 'rgba(77,143,255,0.14)',
    borderWidth: 1.5,
    borderColor: 'rgba(77,143,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  title: { fontFamily: fonts.bold, fontSize: 26, color: colors.ink, marginBottom: 10, letterSpacing: -0.5, lineHeight: 30 },
  subtitle: { fontFamily: fonts.regular, fontSize: 14.5, color: colors.inkDim, lineHeight: 22, maxWidth: 320 },
  strong: { fontFamily: fonts.semibold, color: colors.ink },

  form: { paddingHorizontal: 24 },
  fieldLabel: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8, paddingLeft: 4 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
  },
  wrapOk: { borderColor: 'rgba(74,222,128,0.5)' },
  wrapError: { borderColor: 'rgba(255,92,122,0.5)' },
  inputIcon: { paddingHorizontal: 14 },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.ink, paddingVertical: 16 },
  inputAction: { paddingHorizontal: 14, paddingVertical: 16 },
  matchIndicator: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14 },
  matchTxt: { fontFamily: fonts.semibold, fontSize: 12 },

  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, paddingHorizontal: 4 },
  strengthTrack: { flex: 1, flexDirection: 'row', gap: 3, height: 5 },
  strengthSeg: { flex: 1, borderRadius: 2, backgroundColor: colors.inkMute, opacity: 0.4 },
  strengthLabel: { fontFamily: fonts.bold, fontSize: 12, minWidth: 60, textAlign: 'right', letterSpacing: 0.3 },

  criteria: {
    marginTop: 14,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 12,
  },
  criteriaHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.line },
  criteriaHeaderTxt: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.6 },
  criteriaList: { flexDirection: 'row', flexWrap: 'wrap' },
  criterion: { width: '50%', flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  criterionIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.inkMute,
    alignItems: 'center',
    justifyContent: 'center',
  },
  criterionIconOn: { backgroundColor: colors.success, borderColor: colors.success },
  criterionTxt: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkDim },

  securityNote: {
    marginHorizontal: 24,
    marginTop: 18,
    backgroundColor: 'rgba(184,132,230,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(184,132,230,0.15)',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    gap: 11,
    alignItems: 'flex-start',
  },
  securityIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(184,132,230,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(184,132,230,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityStrong: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, lineHeight: 18 },
  securitySub: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, marginTop: 2, lineHeight: 17 },

  ctaZone: { marginTop: 'auto', paddingHorizontal: 24, paddingTop: 18, paddingBottom: 12 },
  ctaPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: 16,
  },
  ctaPrimaryTxt: { fontFamily: fonts.semibold, fontSize: 16, color: '#fff' },
});
