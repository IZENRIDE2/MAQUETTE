import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, User, Calendar, Mail, Lock, Eye, EyeOff, Check, ArrowRight } from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, shadow } from '@/theme';

/** Inscription — étape 1/3 : création de compte (SSO + email). */
export default function InscriptionScreen() {
  const [reveal, setReveal] = useState(false);
  const [consent, setConsent] = useState(true);

  return (
    <Screen scroll pad={24} contentStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn}>
          <ChevronLeft size={20} color={colors.ink} strokeWidth={2.5} />
        </Pressable>
        <Text style={styles.stepPill}>ÉTAPE 1 / 3</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <User size={34} color={colors.neon} strokeWidth={2} />
        </View>
        <Text style={styles.title}>Crée ton compte{'\n'}de motard</Text>
        <Text style={styles.subtitle}>
          Rejoins la communauté IzenRide : rencontres, événements, trajets sécurisés et marketplace entre passionnés.
        </Text>
      </View>

      {/* SSO */}
      <View style={styles.sso}>
        <Pressable style={styles.ssoBtn}>
          <Text style={styles.googleG}>G</Text>
          <Text style={styles.ssoTxt}>Continuer avec Google</Text>
        </Pressable>
        <Pressable style={styles.ssoBtn}>
          <Text style={styles.appleLogo}></Text>
          <Text style={styles.ssoTxt}>Continuer avec Apple</Text>
        </Pressable>
      </View>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerTxt}>OU PAR EMAIL</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.row2}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Prénom</Text>
            <View style={styles.inputWrap}>
              <View style={styles.inputIcon}>
                <User size={18} color={colors.inkMute} />
              </View>
              <TextInput style={styles.input} placeholder="Alex" placeholderTextColor={colors.lineStrong} />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Âge</Text>
            <View style={styles.inputWrap}>
              <View style={styles.inputIcon}>
                <Calendar size={18} color={colors.inkMute} />
              </View>
              <TextInput style={styles.input} placeholder="18+" placeholderTextColor={colors.lineStrong} keyboardType="number-pad" />
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.fieldLabel}>Adresse email</Text>
          <View style={styles.inputWrap}>
            <View style={styles.inputIcon}>
              <Mail size={18} color={colors.inkMute} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="ton.email@exemple.com"
              placeholderTextColor={colors.lineStrong}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View>
          <Text style={styles.fieldLabel}>Mot de passe</Text>
          <View style={styles.inputWrap}>
            <View style={styles.inputIcon}>
              <Lock size={18} color={colors.inkMute} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="8 caractères minimum"
              placeholderTextColor={colors.lineStrong}
              secureTextEntry={!reveal}
              defaultValue="Moto2024"
            />
            <Pressable style={styles.reveal} onPress={() => setReveal((r) => !r)}>
              {reveal ? <EyeOff size={18} color={colors.inkMute} /> : <Eye size={18} color={colors.inkMute} />}
            </Pressable>
          </View>
          <View style={styles.strength}>
            <View style={[styles.strengthBar, { backgroundColor: colors.success }]} />
            <View style={[styles.strengthBar, { backgroundColor: colors.success }]} />
            <View style={[styles.strengthBar, { backgroundColor: colors.success }]} />
            <View style={styles.strengthBar} />
          </View>
          <Text style={styles.strengthTxt}>
            Solidité : <Text style={styles.strengthGood}>bonne</Text> — ajoute un caractère spécial pour atteindre « excellent ».
          </Text>
        </View>

        <Pressable style={styles.consent} onPress={() => setConsent((c) => !c)}>
          <View style={[styles.checkbox, consent && styles.checkboxOn]}>
            {consent && <Check size={12} color="#fff" strokeWidth={3} />}
          </View>
          <Text style={styles.consentTxt}>
            J'ai lu et j'accepte les <Text style={styles.link}>Conditions d'utilisation</Text> et la{' '}
            <Text style={styles.link}>Politique de confidentialité</Text>. J'ai au moins 18 ans.
          </Text>
        </Pressable>
      </View>

      {/* CTA */}
      <View style={styles.ctaZone}>
        <Pressable>
          <LinearGradient colors={['#4A9CE8', '#2E7FCC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cta}>
            <Text style={styles.ctaTxt}>Créer mon compte</Text>
            <ArrowRight size={18} color="#fff" strokeWidth={2.5} />
          </LinearGradient>
        </Pressable>
        <Pressable style={styles.loginLink}>
          <Text style={styles.loginLinkTxt}>
            Déjà un compte ? <Text style={styles.loginLinkAccent}>Se connecter</Text>
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  stepPill: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, letterSpacing: 0.8, textTransform: 'uppercase' },

  hero: { paddingTop: 18, paddingBottom: 20 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 22, marginBottom: 18,
    backgroundColor: 'rgba(74,143,255,0.12)', borderWidth: 1.5, borderColor: 'rgba(74,143,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontFamily: fonts.bold, fontSize: 27, color: colors.ink, lineHeight: 30, marginBottom: 10, letterSpacing: -0.4 },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.inkMute, lineHeight: 21, maxWidth: 320 },

  sso: { gap: 9 },
  ssoBtn: { height: 50, borderRadius: 14, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  ssoTxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  googleG: { fontFamily: fonts.bold, fontSize: 18, color: '#FFC107' },
  appleLogo: { fontSize: 18, color: colors.ink },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 18, paddingBottom: 6 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.line },
  dividerTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, letterSpacing: 1, textTransform: 'uppercase' },

  form: { paddingTop: 6, gap: 14 },
  row2: { flexDirection: 'row', gap: 10 },
  fieldLabel: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkMute, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 7, paddingLeft: 4 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 14 },
  inputIcon: { paddingHorizontal: 14 },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.ink, paddingVertical: 15, paddingRight: 14 },
  reveal: { paddingHorizontal: 14 },

  strength: { flexDirection: 'row', gap: 4, marginTop: 8, paddingHorizontal: 2 },
  strengthBar: { flex: 1, height: 3, borderRadius: 2, backgroundColor: colors.line },
  strengthTxt: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginTop: 6, paddingLeft: 2 },
  strengthGood: { fontFamily: fonts.semibold, color: colors.success },

  consent: { flexDirection: 'row', gap: 11, paddingTop: 4 },
  checkbox: { width: 22, height: 22, borderRadius: 7, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.panel, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkboxOn: { backgroundColor: colors.neon, borderColor: colors.neon },
  consentTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, lineHeight: 17 },
  link: { fontFamily: fonts.medium, color: colors.neon },

  ctaZone: { marginTop: 24, paddingHorizontal: 0 },
  cta: { borderRadius: 16, paddingVertical: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...shadow.neon },
  ctaTxt: { fontFamily: fonts.bold, fontSize: 16, color: '#fff', letterSpacing: 0.2 },
  loginLink: { alignItems: 'center', paddingVertical: 12 },
  loginLinkTxt: { fontFamily: fonts.regular, fontSize: 14, color: colors.inkMute },
  loginLinkAccent: { fontFamily: fonts.semibold, color: colors.neon },
});
