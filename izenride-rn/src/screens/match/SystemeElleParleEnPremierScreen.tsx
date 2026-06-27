import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Lock, Clock, MessageCircle, Check } from 'lucide-react-native';
import { Screen, AppBar } from '@/components';
import { colors, fonts, shadow } from '@/theme';

const violet = colors.purple;

/** Système « Elle parle en premier » — réglage de matching mixte. */
export default function SystemeElleParleEnPremierScreen() {
  return (
    <Screen scroll={false} pad={0} edges={['top', 'bottom']}>
      <View style={{ paddingHorizontal: 16 }}>
        <AppBar
          title="Elle parle en premier"
          right={
            <View style={styles.draftBadge}>
              <Text style={styles.draftTxt}>À DÉCIDER</Text>
            </View>
          }
        />
      </View>

      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.hero}>
          <View style={styles.avatarPair}>
            <View style={styles.avatarFemale}>
              <LinearGradient colors={[violet, '#5D52C2']} style={styles.avatarInner}>
                <User size={38} color="#fff" fill="#fff" />
              </LinearGradient>
              <View style={styles.speechBubble}>
                <Text style={styles.speechTxt}>Hey 👋</Text>
              </View>
            </View>

            <View style={styles.avatarMale}>
              <User size={38} color={colors.inkMute} fill={colors.inkMute} />
              <View style={styles.lockOverlay}>
                <Lock size={11} color={colors.inkMute} />
              </View>
            </View>
          </View>
        </View>

        {/* Titre */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            Donne <Text style={styles.accent}>aux femmes</Text> le premier mot
          </Text>
          <Text style={styles.subtitle}>
            Lorsqu'un match est créé entre un homme et une femme, seule elle peut envoyer le premier message.
          </Text>
        </View>

        {/* Comment ça marche */}
        <View style={styles.howCard}>
          <View style={styles.howTitle}>
            <View style={styles.howIcon}>
              <Clock size={9} color={violet} strokeWidth={2.5} />
            </View>
            <Text style={styles.howTitleTxt}>COMMENT ÇA MARCHE</Text>
          </View>
          <View style={{ gap: 9 }}>
            <Step n="1">
              <Text style={styles.stepTxt}>Match créé entre un homme et une femme</Text>
            </Step>
            <Step n="2">
              <Text style={styles.stepTxt}>
                Elle a <Text style={styles.timer}>24 h</Text> pour <Text style={styles.stepStrong}>envoyer le 1er message</Text>
              </Text>
            </Step>
            <Step n="3">
              <Text style={styles.stepTxt}>Sans réponse, le match expire automatiquement</Text>
            </Step>
          </View>
        </View>

        {/* Toggle */}
        <View style={styles.toggleCard}>
          <LinearGradient colors={[violet, '#5D52C2']} style={styles.toggleIcon}>
            <MessageCircle size={18} color="#fff" />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleName}>Activer le système</Text>
            <Text style={styles.toggleDesc}>S'applique aux matches mixtes uniquement</Text>
          </View>
          <View style={[styles.switch, styles.switchOn]}>
            <View style={[styles.knob, { transform: [{ translateX: 20 }] }]} />
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable>
          <LinearGradient colors={[violet, '#5D52C2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.saveBtn}>
            <Check size={15} color="#fff" strokeWidth={2.5} />
            <Text style={styles.saveTxt}>Valider mes préférences</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </Screen>
  );
}

function Step({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepNum}>
        <Text style={styles.stepNumTxt}>{n}</Text>
      </View>
      <View style={{ flex: 1, paddingTop: 1 }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  draftBadge: { backgroundColor: 'rgba(251,191,36,0.12)', borderWidth: 1, borderColor: 'rgba(251,191,36,0.25)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  draftTxt: { fontFamily: fonts.bold, fontSize: 9.5, color: colors.warn, letterSpacing: 0.5 },

  content: { flex: 1, paddingHorizontal: 16 },
  hero: { paddingVertical: 14, alignItems: 'center' },
  avatarPair: { flexDirection: 'row', alignItems: 'center', gap: 60 },
  avatarFemale: { width: 72, height: 72, ...shadow.card },
  avatarInner: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  speechBubble: { position: 'absolute', top: -8, left: 56, backgroundColor: violet, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderBottomLeftRadius: 3, ...shadow.card },
  speechTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
  avatarMale: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#1A1E28', borderWidth: 1.5, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center', opacity: 0.85 },
  lockOverlay: { position: 'absolute', bottom: -3, right: -3, width: 24, height: 24, borderRadius: 12, backgroundColor: '#1A1E28', borderWidth: 2, borderColor: colors.bgDeep, alignItems: 'center', justifyContent: 'center' },

  titleSection: { paddingBottom: 14, alignItems: 'center' },
  title: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink, textAlign: 'center', lineHeight: 26, marginBottom: 6 },
  accent: { color: violet },
  subtitle: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkDim, textAlign: 'center', lineHeight: 18, maxWidth: 290 },

  howCard: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 14, padding: 14, marginBottom: 10 },
  howTitle: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  howIcon: { width: 16, height: 16, borderRadius: 5, backgroundColor: 'rgba(184,132,230,0.15)', alignItems: 'center', justifyContent: 'center' },
  howTitleTxt: { fontFamily: fonts.bold, fontSize: 11, color: violet, letterSpacing: 0.7 },
  step: { flexDirection: 'row', gap: 10 },
  stepNum: { width: 22, height: 22, borderRadius: 7, backgroundColor: 'rgba(184,132,230,0.12)', borderWidth: 1, borderColor: 'rgba(184,132,230,0.25)', alignItems: 'center', justifyContent: 'center' },
  stepNumTxt: { fontFamily: fonts.bold, fontSize: 11, color: violet },
  stepTxt: { fontFamily: fonts.medium, fontSize: 12, color: colors.ink, lineHeight: 17 },
  stepStrong: { fontFamily: fonts.bold, color: violet },
  timer: { fontFamily: fonts.bold, color: colors.warn },

  toggleCard: { backgroundColor: 'rgba(184,132,230,0.08)', borderWidth: 1, borderColor: 'rgba(184,132,230,0.25)', borderRadius: 14, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12 },
  toggleIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  toggleName: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, marginBottom: 2 },
  toggleDesc: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim },
  switch: { width: 48, height: 28, borderRadius: 14, backgroundColor: colors.lineStrong, padding: 2, justifyContent: 'center' },
  switchOn: { backgroundColor: violet },
  knob: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff' },

  footer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10 },
  saveBtn: { height: 50, borderRadius: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...shadow.card },
  saveTxt: { fontFamily: fonts.bold, fontSize: 14.5, color: '#fff' },
});
