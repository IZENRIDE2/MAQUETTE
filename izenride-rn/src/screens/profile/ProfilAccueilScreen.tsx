import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Edit3,
  Settings,
  Check,
  Star,
  User,
  ShoppingBag,
  Bike,
  HelpCircle,
  ChevronRight,
} from 'lucide-react-native';
import { Screen, BottomTabBar } from '@/components';
import { colors, fonts } from '@/theme';

const STATS = [
  { value: '48', label: 'Matchs' },
  { value: '7', label: 'Events' },
  { value: '1 240', label: 'km' },
];

const MENU = [
  { Icon: User, label: 'Éditer mon profil' },
  { Icon: ShoppingBag, label: 'Mes annonces & ventes' },
  { Icon: Bike, label: 'Mes motos' },
  { Icon: Settings, label: 'Paramètres' },
  { Icon: HelpCircle, label: 'Aide & support' },
];

/** Profil — accueil (onglet principal), localisé Paris. */
export default function ProfilAccueilScreen() {
  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header actions */}
        <View style={styles.head}>
          <View style={styles.iconBtn}>
            <Edit3 size={19} color="#E8EBF2" />
          </View>
          <View style={styles.iconBtn}>
            <Settings size={19} color="#E8EBF2" />
          </View>
        </View>

        {/* Identity */}
        <View style={styles.top}>
          <LinearGradient colors={[colors.neon, '#7F77DD']} style={styles.avatar}>
            <Text style={styles.avatarTxt}>A</Text>
            <View style={styles.vbadge}>
              <Check size={12} color="#fff" strokeWidth={3} />
            </View>
          </LinearGradient>
          <View style={styles.nameRow}>
            <Text style={styles.name}>Alex</Text>
            <Text style={styles.age}>· 29</Text>
          </View>
          <Text style={styles.handle}>@alex_ride · Paris</Text>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          {STATS.map((s, i) => (
            <View key={s.label} style={[styles.stat, i > 0 && styles.statBorder]}>
              <Text style={styles.statVal}>{s.value}</Text>
              <Text style={styles.statLbl}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Premium */}
        <LinearGradient colors={['rgba(250,199,117,0.14)', 'rgba(250,199,117,0.04)']} style={styles.premium}>
          <View style={styles.premiumIcon}>
            <Star size={19} color={colors.warn} fill={colors.warn} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.premiumTitle}>Passe à IzenRide Premium</Text>
            <Text style={styles.premiumSub}>Likes illimités, Boost, qui t’a liké…</Text>
          </View>
          <Text style={styles.premiumGo}>Voir</Text>
        </LinearGradient>

        {/* Menu */}
        <View style={styles.menu}>
          {MENU.map(({ Icon, label }, i) => (
            <Pressable key={label} style={[styles.mrow, i > 0 && styles.mrowBorder]}>
              <View style={styles.mi}>
                <Icon size={17} color={colors.neon} />
              </View>
              <Text style={styles.mlabel}>{label}</Text>
              <ChevronRight size={16} color="#2A3545" />
            </Pressable>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      <BottomTabBar active="profil" />
    </Screen>
  );
}

const PANEL = '#10121A';
const BORDER = '#1A1E28';

const styles = StyleSheet.create({
  scroll: { paddingBottom: 80 },

  head: { paddingHorizontal: 20, paddingTop: 8, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },

  top: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 4, paddingBottom: 18 },
  avatar: { width: 92, height: 92, borderRadius: 46, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  avatarTxt: { fontFamily: fonts.bold, fontSize: 36, color: '#fff' },
  vbadge: { position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: 13, backgroundColor: colors.neon, borderWidth: 3, borderColor: '#08090E', alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink },
  age: { fontFamily: fonts.semibold, fontSize: 18, color: colors.inkMute },
  handle: { fontFamily: fonts.mono, fontSize: 12, color: colors.inkMute, marginTop: 3 },

  stats: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 16, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 16, overflow: 'hidden' },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statBorder: { borderLeftWidth: 1, borderLeftColor: BORDER },
  statVal: { fontFamily: fonts.bold, fontSize: 19, color: colors.ink },
  statLbl: { fontFamily: fonts.semibold, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },

  premium: { flexDirection: 'row', alignItems: 'center', gap: 13, marginHorizontal: 20, marginBottom: 16, borderRadius: 16, padding: 14, paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(250,199,117,0.3)' },
  premiumIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(250,199,117,0.15)', alignItems: 'center', justifyContent: 'center' },
  premiumTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  premiumSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginTop: 1 },
  premiumGo: { fontFamily: fonts.bold, fontSize: 12, color: colors.warn },

  menu: { marginHorizontal: 20, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 16, overflow: 'hidden' },
  mrow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 16, paddingVertical: 14 },
  mrowBorder: { borderTopWidth: 1, borderTopColor: BORDER },
  mi: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#08090E', borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
  mlabel: { flex: 1, fontFamily: fonts.medium, fontSize: 14, color: '#E8EBF2' },
});
