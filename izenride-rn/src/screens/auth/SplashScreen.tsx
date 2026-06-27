import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Logo } from '@/components';
import { colors, fonts } from '@/theme';

/** Splash / lancement — logo IzenRide centré sur fond dégradé. */
export default function SplashScreen() {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#1a1d28', colors.bg, '#000000']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.center}>
        <Logo size={120} />
        <Text style={styles.name}>
          Izen<Text style={styles.nameAccent}>Ride</Text>
        </Text>
        <Text style={styles.tag}>Ride together</Text>
      </View>

      {/* Indicateur de chargement (statique) */}
      <View style={styles.loader}>
        <View style={styles.dot} />
        <View style={[styles.dot, { opacity: 0.55 }]} />
        <View style={[styles.dot, { opacity: 0.3 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center' },
  name: { fontFamily: fonts.bold, fontSize: 30, color: colors.ink, marginTop: 28, letterSpacing: -0.3 },
  nameAccent: { color: colors.neon },
  tag: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.inkMute,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  loader: { position: 'absolute', bottom: 70, flexDirection: 'row', gap: 7 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.neon },
});
