import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Plus, Clock, MapPin, Check } from 'lucide-react-native';
import { Screen, BottomTabBar } from '@/components';
import { colors, fonts, radius } from '@/theme';

const SEGMENTS = ['À venir', 'Mes events', 'Explorer'];

/** Agenda — événements à venir près de Paris / Île-de-France (onglet Agenda). */
export default function AgendaAccueilScreen() {
  const [seg, setSeg] = useState('À venir');
  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Header */}
      <View style={styles.head}>
        <View>
          <Text style={styles.title}>Agenda</Text>
          <Text style={styles.subtitle}>3 ÉVÉNEMENTS À VENIR PRÈS DE TOI</Text>
        </View>
        <View style={styles.headActions}>
          <Pressable style={styles.iconBtn}>
            <Search size={19} color={colors.ink} />
            <View style={styles.iconDot} />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Plus size={19} color={colors.ink} />
          </Pressable>
        </View>
      </View>

      {/* Segmented */}
      <View style={styles.seg}>
        {SEGMENTS.map((s) => (
          <Pressable key={s} onPress={() => setSeg(s)} style={[styles.segBtn, seg === s && styles.segBtnOn]}>
            <Text style={[styles.segTxt, seg === s && { color: colors.neon }]}>{s}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Event 1 — inscrit */}
        <View style={styles.evCard}>
          <LinearGradient
            colors={['#1c3350', '#0f1726', '#0a0c12']}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 0.9, y: 1 }}
            style={styles.evHero}
          >
            <View style={styles.evDate}>
              <Text style={styles.evDateNum}>14</Text>
              <Text style={styles.evDateMonth}>JUIN</Text>
            </View>
            <View style={styles.evTag}>
              <Text style={styles.evTagTxt}>Inscrit</Text>
            </View>
          </LinearGradient>
          <View style={styles.evBody}>
            <Text style={styles.evTitle}>Balade Forêt de Fontainebleau</Text>
            <View style={styles.evMeta}>
              <View style={styles.evMetaItem}>
                <Clock size={13} color={colors.inkMute} />
                <Text style={styles.evMetaTxt}>09:00</Text>
              </View>
              <View style={styles.evMetaItem}>
                <MapPin size={13} color={colors.inkMute} />
                <Text style={styles.evMetaTxt}>Départ Place de la Bastille</Text>
              </View>
            </View>
            <View style={styles.evFoot}>
              <View style={styles.avstack}>
                <LinearGradient colors={['#4A9CE8', '#7F77DD']} style={[styles.av, { marginLeft: 0 }]}><Text style={styles.avTxt}>L</Text></LinearGradient>
                <LinearGradient colors={['#5DCAA5', '#3f9f82']} style={styles.av}><Text style={styles.avTxt}>M</Text></LinearGradient>
                <LinearGradient colors={['#FAC775', '#d99b3c']} style={styles.av}><Text style={styles.avTxt}>T</Text></LinearGradient>
                <View style={[styles.av, styles.avMore]}><Text style={styles.avMoreTxt}>+9</Text></View>
              </View>
              <View style={[styles.joinBtn, styles.joinIn]}>
                <Check size={13} color={colors.success} strokeWidth={3} />
                <Text style={styles.joinInTxt}>Inscrit</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Event 2 — à rejoindre */}
        <View style={styles.evCard}>
          <LinearGradient
            colors={['#2a2347', '#13101f', '#0a0c12']}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 0.9, y: 1 }}
            style={styles.evHero}
          >
            <View style={styles.evDate}>
              <Text style={styles.evDateNum}>21</Text>
              <Text style={styles.evDateMonth}>JUIN</Text>
            </View>
          </LinearGradient>
          <View style={styles.evBody}>
            <Text style={styles.evTitle}>Café motards · Place de la Bastille</Text>
            <View style={styles.evMeta}>
              <View style={styles.evMetaItem}>
                <Clock size={13} color={colors.inkMute} />
                <Text style={styles.evMetaTxt}>18:30</Text>
              </View>
              <View style={styles.evMetaItem}>
                <MapPin size={13} color={colors.inkMute} />
                <Text style={styles.evMetaTxt}>Le Marais</Text>
              </View>
            </View>
            <View style={styles.evFoot}>
              <View style={styles.avstack}>
                <LinearGradient colors={['#4A9CE8', '#7F77DD']} style={[styles.av, { marginLeft: 0 }]}><Text style={styles.avTxt}>K</Text></LinearGradient>
                <LinearGradient colors={['#E24B4A', '#b03534']} style={styles.av}><Text style={styles.avTxt}>R</Text></LinearGradient>
                <View style={[styles.av, styles.avMore]}><Text style={styles.avMoreTxt}>+5</Text></View>
              </View>
              <Pressable>
                <LinearGradient colors={['#4A9CE8', '#2E7FCC']} style={styles.joinBtn}>
                  <Text style={styles.joinTxt}>Rejoindre</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomTabBar active="agenda" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8 },
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.ink },
  subtitle: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, letterSpacing: 0.8, marginTop: 2 },
  headActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  iconDot: { position: 'absolute', top: 9, right: 9, width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.danger, borderWidth: 2, borderColor: colors.bg },

  seg: { flexDirection: 'row', gap: 6, paddingHorizontal: 20, paddingBottom: 12 },
  segBtn: { flex: 1, paddingVertical: 9, borderRadius: 11, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, alignItems: 'center' },
  segBtnOn: { backgroundColor: 'rgba(74,156,232,0.12)', borderColor: 'rgba(74,156,232,0.4)' },
  segTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkMute },

  scroll: { paddingHorizontal: 20, paddingBottom: 100 },
  evCard: { marginBottom: 12, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, overflow: 'hidden' },
  evHero: { height: 120 },
  evDate: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(8,9,14,0.8)', borderWidth: 1, borderColor: colors.line, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, alignItems: 'center' },
  evDateNum: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink, lineHeight: 20 },
  evDateMonth: { fontFamily: fonts.mono, fontSize: 9, color: colors.neon, textTransform: 'uppercase', letterSpacing: 0.6 },
  evTag: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(93,202,165,0.15)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.4)', borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 4 },
  evTagTxt: { fontFamily: fonts.bold, fontSize: 10, color: colors.success },

  evBody: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 14 },
  evTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink, marginBottom: 5 },
  evMeta: { flexDirection: 'row', gap: 14, marginBottom: 12 },
  evMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  evMetaTxt: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute },
  evFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avstack: { flexDirection: 'row' },
  av: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: colors.panel, marginLeft: -8, alignItems: 'center', justifyContent: 'center' },
  avTxt: { fontFamily: fonts.bold, fontSize: 11, color: '#fff' },
  avMore: { backgroundColor: '#2A3545', alignItems: 'center', justifyContent: 'center' },
  avMoreTxt: { fontFamily: fonts.bold, fontSize: 10, color: colors.inkDim },
  joinBtn: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
  joinTxt: { fontFamily: fonts.bold, fontSize: 13, color: '#fff' },
  joinIn: { backgroundColor: colors.panel, borderWidth: 1, borderColor: 'rgba(93,202,165,0.4)' },
  joinInTxt: { fontFamily: fonts.bold, fontSize: 13, color: colors.success },
});
