import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Share2, Calendar, MapPin, Users, Check } from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, radius } from '@/theme';

const META = [
  { icon: Calendar, title: 'Samedi 14 juin · 09:00', sub: 'Durée estimée 5h · retour 14h' },
  { icon: MapPin, title: 'Départ Place de la Bastille', sub: 'Parking du port · 142 km de boucle' },
  { icon: Users, title: '12 participants · 8 places restantes', sub: 'Niveau intermédiaire · rythme tranquille' },
];

const PARTS: { letter: string; c: readonly [string, string] }[] = [
  { letter: 'L', c: ['#4A9CE8', '#7F77DD'] },
  { letter: 'M', c: ['#5DCAA5', '#3f9f82'] },
  { letter: 'T', c: ['#FAC775', '#d99b3c'] },
  { letter: 'K', c: ['#E24B4A', '#b03534'] },
  { letter: 'R', c: ['#7F77DD', '#5a52b5'] },
];

/** Fiche événement — balade moto à Fontainebleau, départ Paris (Bastille). */
export default function FicheEvenementScreen() {
  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <LinearGradient
          colors={['#1c3350', '#13233a', '#0a0c12']}
          start={{ x: 0.15, y: 0.1 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.cover}
        >
          <View style={styles.topbar}>
            <Pressable style={styles.iconBtnBlur}>
              <ChevronLeft size={18} color={colors.ink} />
            </Pressable>
            <Pressable style={styles.iconBtnBlur}>
              <Share2 size={18} color={colors.ink} />
            </Pressable>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagTxt}>Balade · Groupe</Text>
          </View>
          <Text style={styles.coverTitle}>Balade Forêt de Fontainebleau</Text>
        </LinearGradient>

        <View style={styles.body}>
          {/* Meta grid */}
          <View style={styles.metaGrid}>
            {META.map((m) => {
              const Icon = m.icon;
              return (
                <View key={m.title} style={styles.metaRow}>
                  <View style={styles.metaIcon}>
                    <Icon size={17} color={colors.neon} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.metaTitle}>{m.title}</Text>
                    <Text style={styles.metaSub}>{m.sub}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Description */}
          <Text style={styles.secTitle}>Description</Text>
          <Text style={styles.desc}>
            Une boucle mythique dans la Forêt de Fontainebleau : routes forestières, gorges et points
            de vue à couper le souffle. Pause déjeuner prévue à Provins. Pleins faits avant le départ. 🏍️
          </Text>

          {/* Participants */}
          <Text style={styles.secTitle}>Participants</Text>
          <View style={styles.parts}>
            {PARTS.map((p, i) => (
              <LinearGradient key={p.letter} colors={p.c} style={[styles.part, i === 0 && { marginLeft: 0 }]}>
                <Text style={styles.partTxt}>{p.letter}</Text>
              </LinearGradient>
            ))}
            <View style={[styles.part, styles.partMore]}>
              <Text style={styles.partMoreTxt}>+7</Text>
            </View>
          </View>

          {/* Organisateur */}
          <Text style={[styles.secTitle, { marginTop: 16 }]}>Organisé par</Text>
          <View style={styles.host}>
            <LinearGradient colors={[colors.success, '#3f9f82']} style={styles.hostAv}>
              <Text style={styles.hostAvTxt}>M</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.hostName}>Marc D.</Text>
              <Text style={styles.hostSub}>Organise 14 événements</Text>
            </View>
            <Text style={styles.hostBadge}>★ 4.9</Text>
          </View>

          {/* CTA */}
          <Pressable style={{ marginTop: 20 }}>
            <LinearGradient colors={['#4A9CE8', '#2E7FCC']} style={styles.cta}>
              <Check size={18} color="#fff" strokeWidth={2.5} />
              <Text style={styles.ctaTxt}>Rejoindre l'événement</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cover: { height: 200, justifyContent: 'flex-end' },
  topbar: { position: 'absolute', top: 10, left: 14, right: 14, flexDirection: 'row', justifyContent: 'space-between' },
  iconBtnBlur: { width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(8,9,14,0.55)', borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  tag: { position: 'absolute', bottom: 48, left: 18, backgroundColor: 'rgba(93,202,165,0.18)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.45)', borderRadius: radius.pill, paddingHorizontal: 11, paddingVertical: 5 },
  tagTxt: { fontFamily: fonts.bold, fontSize: 11, color: colors.success },
  coverTitle: { position: 'absolute', bottom: 16, left: 18, right: 18, fontFamily: fonts.bold, fontSize: 25, color: '#fff', lineHeight: 28 },

  body: { paddingHorizontal: 20, paddingTop: 16 },
  metaGrid: { gap: 11, marginBottom: 18 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metaIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  metaTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  metaSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, marginTop: 1 },

  secTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 10 },
  desc: { fontFamily: fonts.regular, fontSize: 14, color: colors.ink, lineHeight: 22, marginBottom: 18 },

  parts: { flexDirection: 'row', marginBottom: 6 },
  part: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: colors.bg, marginLeft: -8, alignItems: 'center', justifyContent: 'center' },
  partTxt: { fontFamily: fonts.bold, fontSize: 12, color: '#fff' },
  partMore: { backgroundColor: colors.panel, borderColor: colors.line },
  partMoreTxt: { fontFamily: fonts.bold, fontSize: 11, color: colors.inkDim },

  host: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12 },
  hostAv: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  hostAvTxt: { fontFamily: fonts.bold, fontSize: 16, color: '#fff' },
  hostName: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  hostSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginTop: 1 },
  hostBadge: { fontFamily: fonts.monoBold, fontSize: 10, color: colors.warn },

  cta: { height: 54, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  ctaTxt: { fontFamily: fonts.bold, fontSize: 16, color: '#fff' },
});
