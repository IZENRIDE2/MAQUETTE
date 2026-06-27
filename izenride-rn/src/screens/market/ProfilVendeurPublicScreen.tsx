import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Share2,
  MoreVertical,
  BadgeCheck,
  MapPin,
  UserPlus,
  MessageCircle,
  Star,
  Shield,
  Heart,
} from 'lucide-react-native';
import { Screen, AppBar } from '@/components';
import { colors, fonts } from '@/theme';

const TABS = ['Tout · 23', 'Casques · 4', 'Blousons · 7', 'Pièces · 8', 'Vendus · 187'];

type Listing = {
  cat: string;
  title: string;
  price: string;
  state: string;
  glyph: string;
  badge?: { label: string; color: string; bg: string };
  fav?: boolean;
  c: [string, string];
};

const LISTINGS: Listing[] = [
  { cat: 'Casque · Intégral', title: 'Shoei NXR2 noir mat taille L', price: '340', state: 'Très bon état', glyph: '🪖', badge: { label: 'Nouveau', color: '#fff', bg: colors.neon }, c: ['#1a3a5e', '#0a1428'] },
  { cat: 'Blouson · Cuir', title: 'Dainese Racing 4 perforé taille 52', price: '420', state: 'Comme neuf', glyph: '🧥', fav: true, c: ['#2a1f3d', '#7F77DD'] },
  { cat: 'Bottes · Sport', title: 'Alpinestars SMX Plus pointure 44', price: '180', state: 'Bon état · portées 2 saisons', glyph: '🥾', badge: { label: 'Réservé', color: '#1a1408', bg: colors.warn }, c: ['#1a1e28', '#08090e'] },
  { cat: 'Gants · Été', title: 'Five RS3 Evo aérés taille M', price: '65', state: 'Neufs · jamais portés', glyph: '🧤', c: ['#5a4520', '#1a1408'] },
  { cat: 'Pièces · Échappement', title: 'Akrapovic slip-on MT-09 origine', price: '580', state: 'Démonté ce week-end', glyph: '⚙️', c: ['#0a1a2a', '#5DCAA5'] },
  { cat: 'Sacoche · Réservoir', title: 'Givi Tanklock 5L noire', price: '85', state: 'Vendu à L. · Paris 12e', glyph: '🎒', badge: { label: 'Vendu', color: colors.inkMute, bg: '#2A3545' }, c: ['#2a3040', '#1a1e28'] },
];

const REVIEWS = [
  { ini: 'CM', author: 'Camille M.', date: '12 avr. 2026', text: 'Casque parfait, exactement comme décrit. Thomas est très réactif et l’envoi a été ultra rapide. Je recommande sans hésiter !' },
  { ini: 'HD', author: 'Hugo D.', date: '28 mars 2026', text: 'Top vendeur, blouson dans un état impeccable. Essayage sur place, très sympa. À recommander pour la communauté IzenRide.' },
];

const TAGS = ['Pro de l’équipement', 'Réponse rapide', 'Envoi 24h'];

/** Profil vendeur public (localisé Paris / Île-de-France). */
export default function ProfilVendeurPublicScreen() {
  const [tab, setTab] = useState(0);
  return (
    <Screen pad={0} edges={['top']}>
      <View style={{ paddingHorizontal: 16 }}>
        <AppBar
          title="PROFIL VENDEUR"
          right={
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={styles.iconBtn}>
                <Share2 size={18} color={colors.ink} />
              </View>
              <View style={styles.iconBtn}>
                <MoreVertical size={18} color={colors.ink} />
              </View>
            </View>
          }
        />
      </View>

      {/* HERO */}
      <View style={styles.hero}>
        <View style={styles.avatarRow}>
          <LinearGradient colors={[colors.neon, '#7F77DD']} style={styles.avatar}>
            <Text style={styles.avatarTxt}>T</Text>
            <View style={styles.avatarStatus} />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.vendorName}>Thomas L.</Text>
              <BadgeCheck size={18} color={colors.neon} />
            </View>
            <Text style={styles.handle}>@thomas_moto75</Text>
            <View style={styles.locRow}>
              <MapPin size={12} color={colors.inkMute} />
              <Text style={styles.locTxt}>Paris · 12 km</Text>
            </View>
          </View>
        </View>

        <Text style={styles.bio}>
          Motard depuis 18 ans, je revends régulièrement mon équipement après upgrade. Tout est testé, en bon état, vendu
          avec photos détaillées. Possibilité d’essayage sur place ou point relais Mondial Relay.
        </Text>

        <View style={styles.tagsRow}>
          {TAGS.map((t, i) => (
            <View key={t} style={[styles.tag, i === 0 && styles.tagPrimary]}>
              <Text style={[styles.tagTxt, i === 0 && { color: colors.neon }]}>{t}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Pressable style={[styles.btn, styles.btnPrimary]}>
            <UserPlus size={16} color="#fff" />
            <Text style={styles.btnPrimaryTxt}>Suivre</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnSecondary]}>
            <MessageCircle size={16} color={colors.ink} />
            <Text style={styles.btnSecondaryTxt}>Message</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnSecondary, { width: 44, flex: 0 }]}>
            <MoreVertical size={16} color={colors.ink} />
          </Pressable>
        </View>
      </View>

      {/* STATS */}
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Note</Text>
          <Text style={[styles.statValue, { color: colors.warn }]}>
            4,9<Text style={styles.statUnit}>/5</Text>
          </Text>
          <View style={styles.starsRow}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={9} color={colors.warn} fill={colors.warn} />
            ))}
          </View>
          <Text style={styles.statExtra}>214 avis</Text>
        </View>
        <View style={[styles.stat, styles.statBorder]}>
          <Text style={styles.statLabel}>Ancienneté</Text>
          <Text style={styles.statValue}>
            5<Text style={styles.statUnit}>ans</Text>
          </Text>
          <View style={styles.seniorityBar}>
            <View style={styles.seniorityFill} />
          </View>
          <Text style={styles.statExtra}>Depuis nov. 2020</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Vendus</Text>
          <Text style={styles.statValue}>187</Text>
          <Text style={[styles.statExtra, { marginTop: 13 }]}>+8 ce mois</Text>
        </View>
      </View>

      {/* TRUST */}
      <View style={styles.trust}>
        <View style={styles.trustIcon}>
          <Shield size={16} color={colors.success} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.trustStrong}>Vendeur de confiance</Text>
          <Text style={styles.trustDim}>Identité vérifiée · Paiement sécurisé IzenRide</Text>
        </View>
      </View>

      {/* ANNONCES */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Annonces · 23</Text>
        <Text style={styles.sectionLink}>Voir tout →</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabs}>
        {TABS.map((t, i) => (
          <Pressable key={t} onPress={() => setTab(i)} style={[styles.ftab, tab === i && styles.ftabOn]}>
            <Text style={[styles.ftabTxt, tab === i && { color: colors.bg }]}>{t}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.listings}>
        {LISTINGS.map((it) => (
          <View key={it.title} style={styles.card}>
            <LinearGradient colors={it.c} style={styles.cardImg}>
              {it.badge && (
                <View style={[styles.cardBadge, { backgroundColor: it.badge.bg }]}>
                  <Text style={[styles.cardBadgeTxt, { color: it.badge.color }]}>{it.badge.label}</Text>
                </View>
              )}
              <View style={styles.cardFav}>
                <Heart
                  size={12}
                  color={it.fav ? colors.danger : '#fff'}
                  fill={it.fav ? colors.danger : 'transparent'}
                />
              </View>
              <Text style={styles.cardGlyph}>{it.glyph}</Text>
            </LinearGradient>
            <View style={styles.cardBody}>
              <Text style={styles.cardCat}>{it.cat}</Text>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {it.title}
              </Text>
              <View style={styles.cardBottom}>
                <Text style={styles.cardPrice}>
                  {it.price}
                  <Text style={styles.cardCurrency}>€</Text>
                </Text>
                <Text style={styles.cardState} numberOfLines={2}>
                  {it.state}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* AVIS */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Derniers avis</Text>
        <Text style={styles.sectionLink}>Voir tout →</Text>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        {REVIEWS.map((r) => (
          <View key={r.author} style={styles.reviewCard}>
            <View style={styles.reviewHead}>
              <LinearGradient colors={[colors.success, colors.neon]} style={styles.reviewAvatar}>
                <Text style={styles.reviewIni}>{r.ini}</Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={styles.reviewAuthor}>{r.author}</Text>
                <Text style={styles.reviewDate}>{r.date}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 1 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={11} color={colors.warn} fill={colors.warn} />
                ))}
              </View>
            </View>
            <Text style={styles.reviewText}>{r.text}</Text>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </View>
    </Screen>
  );
}

const PANEL = '#10121A';
const BORDER = '#1A1E28';

const styles = StyleSheet.create({
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },

  hero: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 4 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontFamily: fonts.bold, fontSize: 30, color: '#fff' },
  avatarStatus: { position: 'absolute', bottom: 2, right: 2, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.success, borderWidth: 3, borderColor: colors.bg },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  vendorName: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink },
  handle: { fontFamily: fonts.mono, fontSize: 13, color: colors.inkMute, marginBottom: 8 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locTxt: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute },

  bio: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 22, color: '#E8EBF2', marginTop: 18 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 14 },
  tag: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 8 },
  tagPrimary: { backgroundColor: 'rgba(77,143,255,0.12)', borderColor: 'rgba(77,143,255,0.4)' },
  tagTxt: { fontFamily: fonts.medium, fontSize: 11, color: '#E8EBF2' },

  actions: { flexDirection: 'row', gap: 8, marginTop: 18 },
  btn: { height: 44, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, flex: 1 },
  btnPrimary: { backgroundColor: colors.neon },
  btnPrimaryTxt: { fontFamily: fonts.semibold, fontSize: 14, color: '#fff' },
  btnSecondary: { backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER },
  btnSecondaryTxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },

  stats: { marginHorizontal: 16, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 16, flexDirection: 'row', overflow: 'hidden' },
  stat: { flex: 1, paddingVertical: 16, paddingHorizontal: 12, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: BORDER },
  statLabel: { fontFamily: fonts.medium, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  statValue: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink },
  statUnit: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkMute },
  statExtra: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute, marginTop: 4 },
  starsRow: { flexDirection: 'row', gap: 1, marginTop: 4 },
  seniorityBar: { marginTop: 8, height: 3, width: '100%', backgroundColor: BORDER, borderRadius: 2, overflow: 'hidden' },
  seniorityFill: { height: '100%', width: '78%', backgroundColor: colors.neon, borderRadius: 2 },

  trust: { marginHorizontal: 16, marginTop: 12, padding: 12, backgroundColor: 'rgba(93,202,165,0.06)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.2)', borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  trustIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(93,202,165,0.16)', alignItems: 'center', justifyContent: 'center' },
  trustStrong: { fontFamily: fonts.semibold, fontSize: 12, color: colors.success },
  trustDim: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkMute, marginTop: 1 },

  sectionHeader: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  sectionLink: { fontFamily: fonts.medium, fontSize: 12, color: colors.neon },

  filterTabs: { paddingHorizontal: 16, gap: 6, paddingBottom: 12 },
  ftab: { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 999 },
  ftabOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  ftabTxt: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkMute },

  listings: { paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 14, overflow: 'hidden', marginBottom: 10 },
  cardImg: { aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  cardGlyph: { fontSize: 50 },
  cardBadge: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  cardBadgeTxt: { fontFamily: fonts.semibold, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardFav: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  cardBody: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 12 },
  cardCat: { fontFamily: fonts.medium, fontSize: 9, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  cardTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, lineHeight: 16, marginBottom: 8, minHeight: 32 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardPrice: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  cardCurrency: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkMute },
  cardState: { fontFamily: fonts.regular, fontSize: 9, color: colors.inkMute, textAlign: 'right', maxWidth: 70 },

  reviewCard: { padding: 14, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 14, marginBottom: 10 },
  reviewHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  reviewAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  reviewIni: { fontFamily: fonts.semibold, fontSize: 12, color: colors.bg },
  reviewAuthor: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  reviewDate: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkMute },
  reviewText: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: '#E8EBF2' },
});
