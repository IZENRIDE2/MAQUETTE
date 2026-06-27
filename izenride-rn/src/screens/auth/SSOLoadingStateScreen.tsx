import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Shield } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { Screen, Logo } from '@/components';
import { colors, fonts, radius, shadow } from '@/theme';

/**
 * SSO Loading State — initialisation de la connexion OAuth (Google).
 * État "au repos" du spinner ; étapes de progression statiques.
 */
export default function SSOLoadingStateScreen() {
  const steps = [
    { label: 'Établissement de la connexion', state: 'active' as const },
    { label: 'Redirection vers Google', state: 'pending' as const },
    { label: 'Vérification du profil', state: 'pending' as const },
  ];

  return (
    <Screen scroll={false} pad={0}>
      {/* Logo en filigrane */}
      <View style={styles.watermark}>
        <Logo size={22} />
        <Text style={styles.watermarkTxt}>
          IZEN<Text style={{ color: colors.neonBright }}>RIDE</Text>
        </Text>
      </View>

      <View style={styles.center}>
        {/* Icône provider + spinner */}
        <View style={styles.iconWrap}>
          <View style={styles.glow} />
          <ActivityIndicator size="large" color={colors.neon} style={styles.spinner} />
          <View style={styles.logoBox}>
            <GoogleG />
          </View>
        </View>

        <Text style={styles.title}>Connexion à Google</Text>
        <Text style={styles.subtitle}>
          Préparation de l'authentification sécurisée OAuth 2.0…
        </Text>

        {/* Étapes de progression */}
        <View style={styles.steps}>
          {steps.map((s) => (
            <View key={s.label} style={[styles.step, s.state === 'pending' && { opacity: 0.35 }]}>
              <View
                style={[
                  styles.dot,
                  s.state === 'active' ? styles.dotActive : styles.dotPending,
                ]}
              >
                {s.state === 'active' ? <View style={styles.dotActiveCore} /> : null}
              </View>
              <Text style={styles.stepTxt}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Trust badge */}
      <View style={styles.trustBadge}>
        <Shield size={12} color={colors.success} />
        <Text style={styles.trustTxt}>Chiffrement TLS 1.3 · OAuth 2.0</Text>
      </View>

      {/* Annuler */}
      <Pressable style={styles.cancel}>
        <Text style={styles.cancelTxt}>Annuler</Text>
      </Pressable>
    </Screen>
  );
}

function GoogleG() {
  return (
    <Svg width={40} height={40} viewBox="0 0 48 48">
      <Path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <Path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <Path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <Path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  watermark: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    opacity: 0.5,
  },
  watermarkTxt: { fontFamily: fonts.bold, fontSize: 13, color: colors.inkMute, letterSpacing: 1 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  iconWrap: { width: 110, height: 110, alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  glow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(77,143,255,0.18)',
  },
  spinner: { position: 'absolute', transform: [{ scale: 1.8 }] },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },

  title: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink, textAlign: 'center', marginBottom: 8 },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.inkMute,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 280,
    marginBottom: 32,
  },

  steps: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    padding: 18,
    gap: 14,
  },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  dotActive: { backgroundColor: colors.bg2, borderWidth: 2, borderColor: colors.neon },
  dotActiveCore: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.neon },
  dotPending: { backgroundColor: colors.bg2, borderWidth: 2, borderColor: colors.inkMute },
  stepTxt: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink, flex: 1 },

  trustBadge: {
    position: 'absolute',
    bottom: 110,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
  },
  trustTxt: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkMute, letterSpacing: 0.3 },

  cancel: { position: 'absolute', bottom: 50, alignSelf: 'center', paddingVertical: 12, paddingHorizontal: 24 },
  cancelTxt: { fontFamily: fonts.medium, fontSize: 14, color: colors.inkMute },
});
