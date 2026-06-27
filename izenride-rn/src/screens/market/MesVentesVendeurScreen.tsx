import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  Search,
  ChevronDown,
  ArrowDown,
  BarChart3,
  ChevronsUp,
  BadgeCheck,
  Clock,
  Truck,
  Lock,
  Star,
  XCircle,
  AlertTriangle,
  MessageCircle,
  X,
} from 'lucide-react-native';
import { Screen, BottomTabBar } from '@/components';
import { colors, fonts } from '@/theme';

type Status = 'to-ship' | 'shipped' | 'in-escrow' | 'completed' | 'cancelled';

const STATUS_STYLE: Record<Status, { color: string; bg: string; border: string }> = {
  'to-ship': { color: colors.danger, bg: 'rgba(226,75,74,0.12)', border: 'rgba(226,75,74,0.3)' },
  shipped: { color: '#7F77DD', bg: 'rgba(127,119,221,0.12)', border: 'rgba(127,119,221,0.28)' },
  'in-escrow': { color: colors.neon, bg: 'rgba(74,156,232,0.12)', border: 'rgba(74,156,232,0.28)' },
  completed: { color: colors.success, bg: 'rgba(93,202,165,0.12)', border: 'rgba(93,202,165,0.28)' },
  cancelled: { color: colors.inkMute, bg: 'rgba(168,176,192,0.06)', border: 'rgba(168,176,192,0.18)' },
};

const TABS = [
  { label: 'Toutes', count: 14 },
  { label: 'À expédier', count: 2, urgent: true },
  { label: 'En cours', count: 3 },
  { label: 'Vendues', count: 8 },
  { label: 'Annulées', count: 1 },
];

/** Mes ventes (vendeur) — Stripe Connect, localisé Paris / Île-de-France. */
export default function MesVentesVendeurScreen() {
  const [tab, setTab] = useState(0);
  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Nav top */}
      <View style={styles.navTop}>
        <View style={styles.navBtn}>
          <ChevronLeft size={16} color={colors.inkDim} />
        </View>
        <Text style={styles.navTitle}>Mes ventes</Text>
        <View style={styles.navBtn}>
          <Search size={16} color={colors.inkDim} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Earnings dashboard */}
        <LinearGradient colors={['rgba(93,202,165,0.1)', 'rgba(63,160,128,0.04)']} style={styles.earnings}>
          <View style={styles.earnHead}>
            <Text style={styles.earnLabel}>Solde Stripe Connect</Text>
            <View style={styles.earnPeriod}>
              <Text style={styles.earnPeriodTxt}>30 jours</Text>
              <ChevronDown size={9} color={colors.inkMute} />
            </View>
          </View>
          <Text style={styles.earnBalance}>
            <Text style={styles.earnCur}>€</Text>1 247,80
          </Text>
          <View style={styles.earnSub}>
            <ChevronsUp size={11} color={colors.success} />
            <Text style={styles.earnSubTxt}>
              <Text style={styles.earnSubStrong}>+22%</Text> vs mois dernier · <Text style={styles.earnSubStrong}>8 ventes</Text>
            </Text>
          </View>

          <View style={styles.earnGrid}>
            <View style={styles.earnPill}>
              <Text style={styles.earnPillLabel}>À expédier</Text>
              <Text style={[styles.earnPillValue, { color: colors.warn }]}>
                <Text style={styles.earnPillCur}>€</Text>325,00
              </Text>
            </View>
            <View style={styles.earnPill}>
              <Text style={styles.earnPillLabel}>En séquestre</Text>
              <Text style={[styles.earnPillValue, { color: colors.neon }]}>
                <Text style={styles.earnPillCur}>€</Text>287,30
              </Text>
            </View>
            <View style={styles.earnPill}>
              <Text style={styles.earnPillLabel}>Disponible</Text>
              <Text style={[styles.earnPillValue, { color: colors.success }]}>
                <Text style={styles.earnPillCur}>€</Text>635,50
              </Text>
            </View>
          </View>

          <View style={styles.earnCta}>
            <Pressable style={[styles.earnBtn, styles.earnBtnPrimary]}>
              <ArrowDown size={13} color={colors.bg} />
              <Text style={[styles.earnBtnTxt, { color: colors.bg }]}>Retirer sur mon compte</Text>
            </Pressable>
            <Pressable style={[styles.earnBtn, styles.earnBtnSecondary]}>
              <BarChart3 size={13} color={colors.success} />
              <Text style={[styles.earnBtnTxt, { color: colors.success }]}>Stats</Text>
            </Pressable>
          </View>
        </LinearGradient>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs} style={{ flexGrow: 0, marginBottom: 14 }}>
          {TABS.map((t, i) => {
            const on = i === tab;
            return (
              <Pressable key={t.label} onPress={() => setTab(i)} style={[styles.tab, on && styles.tabOn]}>
                <Text style={[styles.tabTxt, on && { color: colors.bg }]}>{t.label}</Text>
                <View style={[styles.tabCount, on && styles.tabCountOn, t.urgent && styles.tabCountUrgent]}>
                  <Text style={[styles.tabCountTxt, on && { color: colors.bg }, t.urgent && { color: colors.danger }]}>{t.count}</Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* MAI 2026 */}
        <Text style={styles.monthHead}>Mai 2026</Text>

        {/* 1. À expédier urgent */}
        <View style={[styles.card, styles.cardAction]}>
          <View style={styles.top}>
            <Text style={styles.id}>IZR-2026-6B1F44</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <StatusPill status="to-ship" label="À expédier" />
              <View style={styles.deadline}>
                <Clock size={10} color={colors.danger} />
                <Text style={styles.deadlineTxt}>14h restantes</Text>
              </View>
            </View>
          </View>
          <SaleBody glyph="🧥" name="Blouson cuir Dainese Racing 4 — T52" buyer="Antoine M." verified city="Paris 12e" net="305,75" gross="325,00 €">
            <View style={styles.ctxRow}>
              <AlertTriangle size={11} color={colors.danger} />
              <Text style={styles.ctxTxt}>
                Payé hier · <Text style={{ color: colors.danger, fontFamily: fonts.bold }}>expédie sous 24h</Text>
              </Text>
            </View>
          </SaleBody>
          <View style={styles.saleActions}>
            <Pressable style={styles.saleBtn}>
              <MessageCircle size={12} color={colors.inkDim} />
              <Text style={styles.saleBtnTxt}>Contacter</Text>
            </Pressable>
            <Pressable style={[styles.saleBtn, styles.saleBtnPrimary]}>
              <Truck size={12} color="#fff" />
              <Text style={[styles.saleBtnTxt, { color: '#fff', fontFamily: fonts.bold }]}>Marquer expédié</Text>
            </Pressable>
            <Pressable style={[styles.saleBtn, styles.saleBtnDanger]}>
              <X size={12} color={colors.danger} />
            </Pressable>
          </View>
        </View>

        {/* 2. À expédier */}
        <View style={styles.card}>
          <View style={styles.top}>
            <Text style={styles.id}>IZR-2026-7F3C19</Text>
            <StatusPill status="to-ship" label="À expédier" />
          </View>
          <SaleBody glyph="🪖" name="Casque Shoei NXR2 — Taille M" buyer="Léa B." city="Boulogne-Billancourt" net="235,80" gross="250,00 €">
            <View style={styles.ctxRow}>
              <Clock size={11} color={colors.inkMute} />
              <Text style={styles.ctxTxt}>
                Payé à l’instant · <Text style={{ color: colors.neon, fontFamily: fonts.semibold }}>2 jours pour expédier</Text>
              </Text>
            </View>
          </SaleBody>
          <View style={styles.saleActions}>
            <Pressable style={styles.saleBtn}>
              <MessageCircle size={12} color={colors.inkDim} />
              <Text style={styles.saleBtnTxt}>Contacter</Text>
            </Pressable>
            <Pressable style={[styles.saleBtn, styles.saleBtnPrimary]}>
              <Truck size={12} color="#fff" />
              <Text style={[styles.saleBtnTxt, { color: '#fff', fontFamily: fonts.bold }]}>Marquer expédié</Text>
            </Pressable>
          </View>
        </View>

        {/* 3. Expédié */}
        <View style={styles.card}>
          <View style={styles.top}>
            <Text style={styles.id}>IZR-2026-9D2E8B</Text>
            <StatusPill status="shipped" label="Expédié" />
          </View>
          <SaleBody glyph="🧤" name="Gants Alpinestars SP-8 v3" buyer="Karim T." city="Montreuil" net="84,80" gross="89,90 €">
            <View style={styles.ctxRow}>
              <Truck size={11} color={colors.inkMute} />
              <Text style={styles.ctxTxt}>
                <Text style={{ color: '#7F77DD', fontFamily: fonts.semibold }}>9X02 1184 7263</Text> ·{' '}
                <Text style={{ color: '#7F77DD', fontFamily: fonts.semibold }}>livraison 13 mai</Text>
              </Text>
            </View>
          </SaleBody>
        </View>

        {/* 4. Livré en escrow */}
        <View style={styles.card}>
          <View style={styles.top}>
            <Text style={styles.id}>IZR-2026-A4F8C2</Text>
            <StatusPill status="in-escrow" label="Livré · attente confirmation" />
          </View>
          <SaleBody glyph="🪖" name="Casque AGV K6 noir mat — Taille L" buyer="Antoine M." verified city="Paris 12e" net="267,84" gross="284,50 €">
            <View style={styles.ctxRow}>
              <Lock size={11} color={colors.neon} />
              <Text style={styles.ctxTxt}>
                Fonds libérés <Text style={{ color: colors.neon, fontFamily: fonts.semibold }}>sous 13 jours</Text> ou à confirmation
              </Text>
            </View>
          </SaleBody>
        </View>

        {/* AVRIL 2026 */}
        <Text style={styles.monthHead}>Avril 2026</Text>

        {/* 5. Vendu avec avis */}
        <View style={styles.card}>
          <View style={styles.top}>
            <Text style={styles.id}>IZR-2026-3A88E1</Text>
            <StatusPill status="completed" label="Vendu · payé" />
          </View>
          <SaleBody glyph="🎧" name="Intercom Cardo Packtalk Edge" buyer="Sophie L." city="Vincennes" net="300,46" gross="319,00 €">
            <View style={styles.ctxRow}>
              <Star size={11} color={colors.success} fill={colors.success} />
              <Text style={styles.ctxTxt}>
                <Text style={{ color: colors.success, fontFamily: fonts.semibold }}>Avis 5/5</Text> · « Vendeur top, colis nickel »
              </Text>
            </View>
          </SaleBody>
        </View>

        {/* 6. Annulé */}
        <View style={styles.card}>
          <View style={styles.top}>
            <Text style={styles.id}>IZR-2026-2F1E5C</Text>
            <StatusPill status="cancelled" label="Annulée par l’acheteur" />
          </View>
          <SaleBody glyph="🏍️" name="Sacoche réservoir Givi XS320" buyer="Thomas R." net="50,76" gross="54,00 €" struck>
            <View style={styles.ctxRow}>
              <XCircle size={11} color={colors.inkMute} />
              <Text style={styles.ctxTxt}>Remboursé · 19 avr. — annonce remise en ligne</Text>
            </View>
          </SaleBody>
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

function SaleBody({
  glyph,
  name,
  buyer,
  verified,
  city,
  net,
  gross,
  struck,
  children,
}: {
  glyph: string;
  name: string;
  buyer: string;
  verified?: boolean;
  city?: string;
  net: string;
  gross: string;
  struck?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.body}>
      <View style={styles.img}>
        <Text style={styles.imgGlyph}>{glyph}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[styles.name, struck && styles.struck]} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.buyerRow}>
          <View style={styles.buyerAvatar} />
          <Text style={styles.buyerName}>{buyer}</Text>
          {verified && (
            <View style={styles.verified}>
              <BadgeCheck size={10} color="#fff" />
            </View>
          )}
          {city && <Text style={styles.buyerCity}>· {city}</Text>}
        </View>
        {children}
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.priceNet, struck && styles.struck]}>
          <Text style={styles.priceCur}>€</Text>
          {net}
        </Text>
        <Text style={styles.priceGross}>{gross}</Text>
      </View>
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

  scroll: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 90 },

  earnings: { borderWidth: 1, borderColor: 'rgba(93,202,165,0.25)', borderRadius: 18, padding: 16, marginBottom: 14 },
  earnHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  earnLabel: { fontFamily: fonts.semibold, fontSize: 10, color: colors.success, letterSpacing: 1.2, textTransform: 'uppercase' },
  earnPeriod: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  earnPeriodTxt: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.inkMute },
  earnBalance: { fontFamily: fonts.monoBold, fontSize: 32, color: colors.ink, marginBottom: 4 },
  earnCur: { fontFamily: fonts.mono, fontSize: 20, color: colors.inkDim },
  earnSub: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 14 },
  earnSubTxt: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim },
  earnSubStrong: { fontFamily: fonts.bold, color: colors.success },

  earnGrid: { flexDirection: 'row', gap: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(93,202,165,0.15)' },
  earnPill: { flex: 1, alignItems: 'center' },
  earnPillLabel: { fontFamily: fonts.semibold, fontSize: 9, color: colors.inkMute, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 },
  earnPillValue: { fontFamily: fonts.monoBold, fontSize: 14 },
  earnPillCur: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkDim },

  earnCta: { flexDirection: 'row', gap: 8, marginTop: 14 },
  earnBtn: { flex: 1, height: 38, borderRadius: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  earnBtnPrimary: { backgroundColor: colors.success },
  earnBtnSecondary: { backgroundColor: 'rgba(93,202,165,0.08)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.25)' },
  earnBtnTxt: { fontFamily: fonts.bold, fontSize: 12 },

  tabs: { gap: 6, paddingBottom: 4 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 100 },
  tabOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  tabTxt: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.inkDim },
  tabCount: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.1)' },
  tabCountOn: { backgroundColor: 'rgba(0,0,0,0.15)' },
  tabCountUrgent: { backgroundColor: 'rgba(226,75,74,0.18)' },
  tabCountTxt: { fontFamily: fonts.monoBold, fontSize: 10, color: colors.inkMute },

  monthHead: { fontFamily: fonts.bold, fontSize: 10, color: colors.inkMute, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 14, marginBottom: 8, marginHorizontal: 4 },

  card: { backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 16, padding: 12, paddingHorizontal: 14, marginBottom: 10 },
  cardAction: { borderColor: 'rgba(226,75,74,0.4)' },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 },
  id: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, letterSpacing: 0.4 },
  deadline: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 6 },
  deadlineTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.danger },

  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 100, borderWidth: 1 },
  dot: { width: 5, height: 5, borderRadius: 2.5 },
  statusTxt: { fontFamily: fonts.bold, fontSize: 10.5, letterSpacing: 0.4 },

  body: { flexDirection: 'row', gap: 11, alignItems: 'flex-start' },
  img: { width: 62, height: 62, borderRadius: 12, borderWidth: 1, borderColor: BORDER, backgroundColor: '#12161f', alignItems: 'center', justifyContent: 'center' },
  imgGlyph: { fontSize: 30 },
  name: { fontFamily: fonts.bold, fontSize: 13.5, color: colors.ink, marginBottom: 3 },
  struck: { textDecorationLine: 'line-through', color: colors.inkMute },
  buyerRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
  buyerAvatar: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#2a3550' },
  buyerName: { fontFamily: fonts.semibold, fontSize: 10.5, color: colors.inkDim },
  buyerCity: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.inkMute },
  verified: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center' },
  ctxRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  ctxTxt: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.inkDim, flex: 1 },
  priceNet: { fontFamily: fonts.monoBold, fontSize: 14.5, color: colors.success, marginBottom: 2 },
  priceCur: { fontFamily: fonts.mono, fontSize: 11, color: 'rgba(93,202,165,0.7)' },
  priceGross: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.inkMute, textDecorationLine: 'line-through' },

  saleActions: { flexDirection: 'row', gap: 6, marginTop: 11, paddingTop: 11, borderTopWidth: 1, borderTopColor: BORDER },
  saleBtn: { flex: 1, height: 36, backgroundColor: PANEL3, borderWidth: 1, borderColor: BORDER, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  saleBtnTxt: { fontFamily: fonts.semibold, fontSize: 11.5, color: colors.inkDim },
  saleBtnPrimary: { backgroundColor: colors.neon, borderColor: colors.neon },
  saleBtnDanger: { flex: 0, width: 36, borderColor: 'rgba(226,75,74,0.2)', backgroundColor: 'transparent' },
});
