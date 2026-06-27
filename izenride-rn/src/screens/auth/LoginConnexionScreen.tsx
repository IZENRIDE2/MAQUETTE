import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { Screen, Logo } from '@/components';
import { colors, fonts, shadow } from '@/theme';

/** Connexion — retour des riders (email + SSO). */
export default function LoginConnexionScreen() {
  const [reveal, setReveal] = useState(false);

  return (
    <Screen scroll pad={24} contentStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn}>
          <ChevronLeft size={20} color={colors.ink} strokeWidth={2.5} />
        </Pressable>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.logoMark}>
          <LinearGradient colors={['#4A9CE8', '#2E7FCC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <Logo size={30} />
        </View>
        <Text style={styles.title}>Bon retour parmi{'\n'}les riders.</Text>
        <Text style={styles.subtitle}>Connecte-toi pour retrouver ta tribu et reprendre la route.</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Email</Text>
          <View style={styles.inputWrap}>
            <View style={styles.inputIcon}>
              <Mail size={18} color={colors.inkMute} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="ton.email@izenride.com"
              placeholderTextColor={colors.inkMute}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Mot de passe</Text>
          <View style={styles.inputWrap}>
            <View style={styles.inputIcon}>
              <Lock size={18} color={colors.inkMute} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="••••••••••"
              placeholderTextColor={colors.inkMute}
              secureTextEntry={!reveal}
            />
            <Pressable style={styles.inputAction} onPress={() => setReveal((r) => !r)}>
              {reveal ? <EyeOff size={20} color={colors.inkMute} /> : <Eye size={20} color={colors.inkMute} />}
            </Pressable>
          </View>
        </View>

        <View style={styles.forgotRow}>
          <Pressable>
            <Text style={styles.forgotLink}>Mot de passe oublié ?</Text>
          </Pressable>
        </View>

        <Pressable>
          <LinearGradient colors={['#4A9CE8', '#2E7FCC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cta}>
            <Text style={styles.ctaTxt}>Se connecter</Text>
            <ArrowRight size={18} color="#fff" strokeWidth={2.5} />
          </LinearGradient>
        </Pressable>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerTxt}>OU CONTINUER AVEC</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* SSO */}
        <View style={styles.ssoStack}>
          <Pressable style={styles.ssoBtn}>
            <Text style={styles.appleLogo}></Text>
            <Text style={styles.ssoTxt}>Continuer avec Apple</Text>
          </Pressable>
          <Pressable style={styles.ssoBtn}>
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.ssoTxt}>Continuer avec Google</Text>
          </Pressable>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerTxt}>
          Pas encore de compte ? <Text style={styles.footerLink}>S'inscrire</Text>
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 4 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },

  hero: { paddingTop: 24, paddingBottom: 28 },
  logoMark: { width: 56, height: 56, borderRadius: 16, marginBottom: 20, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', ...shadow.neon },
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.ink, lineHeight: 32, marginBottom: 8, letterSpacing: -0.6 },
  subtitle: { fontFamily: fonts.regular, fontSize: 15, color: colors.inkMute, lineHeight: 21 },

  form: {},
  field: { marginBottom: 14 },
  fieldLabel: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkMute, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 14 },
  inputIcon: { paddingHorizontal: 14 },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.ink, paddingVertical: 16 },
  inputAction: { paddingHorizontal: 14 },

  forgotRow: { alignItems: 'flex-end', marginTop: 10, marginBottom: 22 },
  forgotLink: { fontFamily: fonts.semibold, fontSize: 13, color: colors.neon, paddingVertical: 4, paddingHorizontal: 4 },

  cta: { borderRadius: 16, paddingVertical: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...shadow.neon },
  ctaTxt: { fontFamily: fonts.semibold, fontSize: 16, color: '#fff', letterSpacing: 0.2 },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 24, marginBottom: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.line },
  dividerTxt: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkMute, letterSpacing: 0.5, textTransform: 'uppercase' },

  ssoStack: { gap: 10 },
  ssoBtn: { height: 54, borderRadius: 16, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  ssoTxt: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  appleLogo: { fontSize: 20, color: colors.ink },
  googleG: { fontFamily: fonts.bold, fontSize: 20, color: '#4285F4' },

  footer: { marginTop: 24, alignItems: 'center' },
  footerTxt: { fontFamily: fonts.medium, fontSize: 14, color: colors.inkMute },
  footerLink: { fontFamily: fonts.bold, color: colors.neon },
});
