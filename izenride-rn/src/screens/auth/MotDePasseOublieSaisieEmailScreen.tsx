import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Info, Clock, Send } from 'lucide-react-native';
import { Screen, AppBar } from '@/components';
import { colors, fonts } from '@/theme';

/** Mot de passe oublié — saisie de l'email pour recevoir le lien de réinitialisation. */
export default function MotDePasseOublieSaisieEmailScreen() {
  const [email, setEmail] = useState('');

  const infoSteps = [
    { title: 'Réception du lien', desc: 'Un email arrive dans ta boîte sous ~1 minute.' },
    { title: 'Lien sécurisé', desc: 'Valable 30 minutes, utilisable une seule fois.' },
    { title: 'Nouveau mot de passe', desc: 'Tu en choisis un nouveau et tu te reconnectes.' },
  ];

  return (
    <Screen pad={0}>
      <View style={styles.headerWrap}>
        <AppBar title="Récupération" />
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Mail size={38} color={colors.neon} />
        </View>
        <Text style={styles.title}>Mot de passe{'\n'}oublié ?</Text>
        <Text style={styles.subtitle}>
          Entre l'adresse email associée à ton compte. On t'envoie un lien pour créer un nouveau mot de passe.
        </Text>
      </View>

      {/* Formulaire */}
      <View style={styles.form}>
        <Text style={styles.fieldLabel}>Adresse email</Text>
        <View style={styles.inputWrap}>
          <View style={styles.inputIcon}>
            <Mail size={18} color={colors.inkMute} />
          </View>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="ton.email@izenride.com"
            placeholderTextColor="#4a5566"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.helperRow}>
          <Info size={14} color={colors.inkMute} />
          <Text style={styles.helperTxt}>
            Utilise l'adresse avec laquelle tu t'es inscrit. Si tu utilises Apple ou Google, reviens à l'écran de connexion.
          </Text>
        </View>

        {/* Panneau info */}
        <View style={styles.infoPanel}>
          <View style={styles.infoHeader}>
            <Clock size={16} color={colors.neon} />
            <Text style={styles.infoHeaderTxt}>Comment ça marche</Text>
          </View>
          {infoSteps.map((s, i) => (
            <View key={s.title} style={styles.infoStep}>
              <View style={styles.infoStepNum}>
                <Text style={styles.infoStepNumTxt}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoStepTitle}>{s.title}</Text>
                <Text style={styles.infoStepDesc}>{s.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <View style={styles.ctaZone}>
        <Pressable>
          <LinearGradient colors={[colors.neon, '#2E7FCC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaPrimary}>
            <Text style={styles.ctaPrimaryTxt}>Envoyer le lien</Text>
            <Send size={18} color="#fff" strokeWidth={2.5} />
          </LinearGradient>
        </Pressable>
        <Pressable style={styles.secondaryLink}>
          <Text style={styles.secondaryLinkTxt}>
            Tu te souviens ? <Text style={{ color: colors.neonBright, fontFamily: fonts.semibold }}>Se connecter</Text>
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: { paddingHorizontal: 18 },

  hero: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 28 },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 24,
    backgroundColor: 'rgba(77,143,255,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(77,143,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.ink, marginBottom: 12, letterSpacing: -0.6, lineHeight: 32 },
  subtitle: { fontFamily: fonts.regular, fontSize: 15, color: colors.inkDim, lineHeight: 22, maxWidth: 320 },

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
  inputIcon: { paddingHorizontal: 14 },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.ink, paddingVertical: 16, paddingRight: 14 },
  helperRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, paddingHorizontal: 4, paddingTop: 10 },
  helperTxt: { flex: 1, fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkMute, lineHeight: 18 },

  infoPanel: {
    marginTop: 24,
    backgroundColor: 'rgba(77,143,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.12)',
    borderRadius: 16,
    padding: 16,
  },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(77,143,255,0.1)' },
  infoHeaderTxt: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  infoStep: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  infoStepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(77,143,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(77,143,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoStepNumTxt: { fontFamily: fonts.bold, fontSize: 11, color: colors.neonBright },
  infoStepTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, marginBottom: 2 },
  infoStepDesc: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkDim, lineHeight: 17 },

  ctaZone: { marginTop: 'auto', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12 },
  ctaPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: 16,
  },
  ctaPrimaryTxt: { fontFamily: fonts.semibold, fontSize: 16, color: '#fff' },
  secondaryLink: { alignItems: 'center', paddingVertical: 14, marginTop: 4 },
  secondaryLinkTxt: { fontFamily: fonts.medium, fontSize: 14, color: colors.inkMute },
});
