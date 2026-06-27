import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import {
  ChevronLeft,
  Search,
  ShieldCheck,
  ChevronRight,
  BadgeCheck,
  Clock,
  Truck,
  CheckCircle2,
  Star,
  XCircle,
  MessageCircle,
  Check,
  FileText,
} from 'lucide-react-native';
import { Screen, BottomTabBar } from '@/components';
import { colors, fonts } from '@/theme';

type Status = 'delivered' | 'shipped' | 'paid' | 'completed' | 'cancelled';

const STATUS_STYLE: Record<Status, { color: string; bg: string; border: string }> = {
  paid: { color: colors.neon, bg: 'rgba(74,156,232,0.12)', border: 'rgba(74,156,232,0.25)' },
  shipped: { color: '#7F77DD', bg: 'rgba(127,119,221,0.12)', border: 'rgba(127,119,221,0.28)' },
  delivered: { color: colors.warn, bg: 'rgba(250,199,117,0.12)', border: 'rgba(250,199,117,0.3)' },
  completed: { color: colors.success, bg: 'rgba(93,202,165,0.12)', border: 'rgba(93,202,165,0.28)' },
  cancelled: { color: colors.inkMute, bg: 'rgba(168,176,192,0.06)', border: 'rgba(168,176,192,0.18)' },
};

const TABS = [
  { label: 'Tout', count: 12 },
  { label: 'En cours', count: 3, alert: true },
  { label: 'Livrées', count: 8 },
  { label: 'Annulées', count: 1 },
];

/** Mes commandes (acheteur) — localisé Paris / Île-de-France. */
export default function MesCommandesAcheteurScreen() {
  const [tab, setTab] = useState(0);
  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Nav top */}
      <View style={styles.navTop}>
        <View style={styles.navBtn}>
          <ChevronLeft size={16} color={colors.inkDim} />
        </View>
        <Text style={styles.navTitle}>Mes commandes</Text>
        <View style={styles.navBtn}>
          <Search size={16} color={colors.inkDim} />
        </View>
      </View>

      {/* Tabs filtres */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs} style={{ flexGrow: 0 }}>
        {TABS.map((t, i) => {
          const on = i === tab;
          return (
            <Pressable key={t.label} onPress={() => setTab(i)} style={[styles.tab, on && styles.tabOn]}>
              <Text style={[styles.tabTxt, on && { color: colors.bg }]}>{t.label}</Text>
              <View style={[styles.tabCount, on && styles.tabCountOn, t.alert && styles.tabCountAlert]}>
                <Text style={[styles.tabCountTxt, on && { color: colors.bg }, t.alert && { color: colors.warn }]}>{t.count}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Action banner */}
        <Pressable style={styles.banner}>
          <View style={styles.bannerIcon}>
            <ShieldCheck size={14} color={colors.warn} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>1 commande à confirmer</Text>
            <Text style={styles.bannerSub}>Casque AGV livré · libère le paiement à Marc</Text>
          </View>
          <ChevronRight size={14} color={colors.warn} />
        </Pressable>

        {/* MAI 2026 */}
        <Text style={styles.monthHead}>Mai 2026</Text>

        {/* 1. Livré — à confirmer */}
        <View style={[styles.card, styles.cardAction]}>
          <View style={styles.top}>
            <Text style={styles.id}>IZR-2026-A4F8C2</Text>
            <StatusPill status="delivered" label="Livré · à confirmer" />
          </View>
          <OrderBody
            glyph="🪖"
            tint="rgba(74,156,232,0.7)"
            name="Casque AGV K6 noir mat — Taille L"
            seller="Marc D."
            verified
            price="284,50"
          >
            <View style={styles.trackingRow}>
              <CheckCircle2 size={11} color={colors.warn} />
              <Text style={styles.trackingTxt}>
                Livré <Text style={{ color: colors.warn, fontFamily: fonts.semibold }}>aujourd’hui · 11h24</Text>
              </Text>
            </View>
          </OrderBody>
          <View style={styles.cardActions}>
            <Pressable style={styles.actBtn}>
              <MessageCircle size={12} color={colors.inkDim} />
              <Text style={styles.actBtnTxt}>Contacter</Text>
            </Pressable>
            <Pressable style={[styles.actBtn, styles.actBtnPrimary]}>
              <Check size={12} color={colors.bg} />
              <Text style={[styles.actBtnTxt, { color: colors.bg, fontFamily: fonts.bold }]}>Confirmer la réception</Text>
            </Pressable>
          </View>
        </View>

        {/* 2. Expédié */}
        <View style={styles.card}>
          <View style={styles.top}>
            <Text style={styles.id}>IZR-2026-9D2E8B</Text>
            <StatusPill status="shipped" label="Expédié" />
          </View>
          <OrderBody glyph="🧤" tint="rgba(250,199,117,0.65)" name="Gants Alpinestars SP-8 v3" seller="Sophie L." price="89,90">
            <View style={styles.trackingRow}>
              <Truck size={11} color={colors.inkMute} />
              <Text style={styles.trackingTxt}>
                <Text style={{ color: '#7F77DD', fontFamily: fonts.semibold }}>9X02 1184 7263</Text> ·{' '}
                <Text style={{ color: '#7F77DD', fontFamily: fonts.semibold }}>livraison 13 mai</Text>
              </Text>
            </View>
          </OrderBody>
        </View>

        {/* 3. Payé */}
        <View style={styles.card}>
          <View style={styles.top}>
            <Text style={styles.id}>IZR-2026-6B1F44</Text>
            <StatusPill status="paid" label="Payé · vendeur prévenu" />
          </View>
          <OrderBody glyph="🧥" tint="rgba(127,119,221,0.7)" name="Blouson cuir Dainese Racing 4 — T52" seller="Pierre B." verified price="325,00">
            <View style={styles.trackingRow}>
              <Clock size={11} color={colors.inkMute} />
              <Text style={styles.trackingTxt}>Expédition prévue sous 24h</Text>
            </View>
          </OrderBody>
        </View>

        {/* AVRIL 2026 */}
        <Text style={styles.monthHead}>Avril 2026</Text>

        {/* 4. Terminé */}
        <View style={styles.card}>
          <View style={styles.top}>
            <Text style={styles.id}>IZR-2026-3A88E1</Text>
            <StatusPill status="completed" label="Terminé" />
          </View>
          <OrderBody glyph="🎧" tint="rgba(74,156,232,0.7)" name="Intercom Cardo Packtalk Edge" seller="Antoine P." price="319,00">
            <View style={styles.trackingRow}>
              <CheckCircle2 size={11} color={colors.success} />
              <Text style={[styles.trackingTxt, { color: colors.success, fontFamily: fonts.semibold }]}>Reçu et confirmé · 28 avr.</Text>
            </View>
          </OrderBody>
          <View style={styles.cardActions}>
            <Pressable style={styles.actBtn}>
              <FileText size={12} color={colors.inkDim} />
              <Text style={styles.actBtnTxt}>Facture</Text>
            </Pressable>
            <Pressable style={[styles.actBtn, styles.actBtnReview]}>
              <Star size={12} color={colors.success} fill={colors.success} />
              <Text style={[styles.actBtnTxt, { color: colors.success }]}>Laisser un avis</Text>
            </Pressable>
          </View>
        </View>

        {/* 5. Terminé — noté */}
        <View style={styles.card}>
          <View style={styles.top}>
            <Text style={styles.id}>IZR-2026-7C45D9</Text>
            <StatusPill status="completed" label="Terminé" />
          </View>
          <OrderBody glyph="🧤" tint="rgba(250,199,117,0.65)" name="Gants hiver Five WFX City" seller="Yamaha Paris" verified price="72,50">
            <View style={styles.trackingRow}>
              <Star size={11} color={colors.success} fill={colors.success} />
              <Text style={[styles.trackingTxt, { color: colors.success, fontFamily: fonts.semibold }]}>Noté 5/5 · « Top vendeur, top produit »</Text>
            </View>
          </OrderBody>
        </View>

        {/* 6. Annulé */}
        <View style={styles.card}>
          <View style={styles.top}>
            <Text style={styles.id}>IZR-2026-2F1E5C</Text>
            <StatusPill status="cancelled" label="Annulée · remboursée" />
          </View>
          <OrderBody glyph="🏍️" tint="rgba(93,202,165,0.65)" name="Sacoche réservoir Givi XS320" seller="Lucas T." price="54,00" struck>
            <View style={styles.trackingRow}>
              <XCircle size={11} color={colors.inkMute} />
              <Text style={styles.trackingTxt}>Remboursement reçu · 19 avr.</Text>
            </View>
          </OrderBody>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      <BottomTabBar active="shop" />
    </Screen>
  );
}

function StatusPill({ status, label }: { status: Status; label: string }) {
  const s = STATUS_STYLE[status];
  return (
    <View style={[styles.statusPill, { backgroundColor: s.bg, borderColor: s.border }]}>
      <View style={[styles.dot, { backgroundColor: s.color }]} />
      <Text style={[styles.statusTxt, { color: s.color }]}>{label}</Text>
    </View>
  );
}

function OrderBody({
  glyph,
  tint,
  name,
  seller,
  verified,
  price,
  struck,
  children,
}: {
  glyph: string;
  tint: string;
  name: string;
  seller: string;
  verified?: boolean;
  price: string;
  struck?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.body}>
      <View style={[styles.img, { backgroundColor: tint + '00' }]}>
        <Text style={styles.imgGlyph}>{glyph}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[styles.name, struck && styles.struck]} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.sellerRow}>
          <Text style={styles.sellerLbl}>par </Text>
          <Text style={styles.sellerName}>{seller}</Text>
          {verified && (
            <View style={styles.verified}>
              <BadgeCheck size={10} color="#fff" />
            </View>
          )}
        </View>
        {children}
      </View>
      <Text style={[styles.price, struck && styles.struck]}>
        <Text style={styles.priceCur}>€</Text>
        {price}
      </Text>
    </View>
  );
}

const PANEL = '#10121A';
const PANEL3 = '#181C26';
const BORDER = '#1A1E28';

const styles = StyleSheet.create({
  navTop: { height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: BORDER },
  navBtn: { width: 36, height: 36, borderRadius: 11, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },

  tabs: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, gap: 6 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 100 },
  tabOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  tabTxt: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.inkDim },
  tabCount: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.1)' },
  tabCountOn: { backgroundColor: 'rgba(0,0,0,0.15)' },
  tabCountAlert: { backgroundColor: 'rgba(250,199,117,0.18)' },
  tabCountTxt: { fontFamily: fonts.monoBold, fontSize: 10, color: colors.inkMute },

  scroll: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 90 },

  banner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(250,199,117,0.08)', borderWidth: 1, borderColor: 'rgba(250,199,117,0.3)', borderRadius: 14, paddingHorizontal: 13, paddingVertical: 11, marginBottom: 14 },
  bannerIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(250,199,117,0.15)', borderWidth: 1, borderColor: 'rgba(250,199,117,0.4)', alignItems: 'center', justifyContent: 'center' },
  bannerTitle: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.ink, marginBottom: 1 },
  bannerSub: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.inkDim },

  monthHead: { fontFamily: fonts.bold, fontSize: 10, color: colors.inkMute, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 18, marginBottom: 8, marginHorizontal: 4 },

  card: { backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 16, padding: 12, paddingHorizontal: 14, marginBottom: 10 },
  cardAction: { borderColor: 'rgba(250,199,117,0.4)' },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 },
  id: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, letterSpacing: 0.4 },

  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 100, borderWidth: 1 },
  dot: { width: 5, height: 5, borderRadius: 2.5 },
  statusTxt: { fontFamily: fonts.bold, fontSize: 10.5, letterSpacing: 0.4 },

  body: { flexDirection: 'row', gap: 11, alignItems: 'flex-start' },
  img: { width: 62, height: 62, borderRadius: 12, borderWidth: 1, borderColor: BORDER, backgroundColor: '#12161f', alignItems: 'center', justifyContent: 'center' },
  imgGlyph: { fontSize: 30 },
  name: { fontFamily: fonts.bold, fontSize: 13.5, color: colors.ink, marginBottom: 3 },
  struck: { textDecorationLine: 'line-through', color: colors.inkMute },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  sellerLbl: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.inkMute },
  sellerName: { fontFamily: fonts.semibold, fontSize: 10.5, color: colors.inkDim },
  verified: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center' },
  trackingRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  trackingTxt: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.inkDim, flex: 1 },
  price: { fontFamily: fonts.monoBold, fontSize: 14.5, color: colors.ink, paddingTop: 2 },
  priceCur: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkDim },

  cardActions: { flexDirection: 'row', gap: 6, marginTop: 11, paddingTop: 11, borderTopWidth: 1, borderTopColor: BORDER },
  actBtn: { flex: 1, height: 34, backgroundColor: PANEL3, borderWidth: 1, borderColor: BORDER, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  actBtnTxt: { fontFamily: fonts.semibold, fontSize: 11.5, color: colors.inkDim },
  actBtnPrimary: { backgroundColor: colors.warn, borderColor: colors.warn },
  actBtnReview: { borderColor: 'rgba(93,202,165,0.3)' },
});
