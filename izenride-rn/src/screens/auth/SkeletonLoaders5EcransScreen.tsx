import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '@/components';
import { colors, fonts, radius } from '@/theme';

const SKEL = '#14171F';

/** Bloc placeholder gris arrondi (état de chargement, animation au repos). */
function Skel({ style }: { style?: any }) {
  return <View style={[styles.skel, style]} />;
}

/** Étiquette de contexte avec pastille colorée. */
function CellLabel({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.cellLabel}>
      <View style={[styles.cellDot, { backgroundColor: color }]} />
      <Text style={styles.cellLabelTxt}>{label}</Text>
    </View>
  );
}

/** Tabbar skeleton (5 onglets). */
function TabbarSkel({ active }: { active: number }) {
  return (
    <View style={styles.tabbar}>
      {[0, 1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.tabSkel}>
          <View style={[styles.tabIcon, i === active && styles.tabActive]} />
          <View style={[styles.tabLabel, i === active && styles.tabActive]} />
        </View>
      ))}
    </View>
  );
}

/** Cadre de téléphone factice contenant un skeleton. */
function Phone({ children }: { children: React.ReactNode }) {
  return <View style={styles.phone}>{children}</View>;
}

function TopNav() {
  return (
    <View style={styles.topnav}>
      <Skel style={styles.navIcon} />
      <Skel style={styles.navTitle} />
      <Skel style={styles.navIcon} />
    </View>
  );
}

/** Skeleton loaders — 4 contextes (matchs, événements, marketplace, profil). */
export default function SkeletonLoaders5EcransScreen() {
  return (
    <Screen scroll pad={18} contentStyle={{ paddingBottom: 40, gap: 28 }}>
      <View style={styles.head}>
        <Text style={styles.headTitle}>Skeleton loaders · 4 contextes</Text>
        <Text style={styles.headSub}>shimmer · staggered · tints sémantiques</Text>
      </View>

      {/* 1. MATCHS GRID */}
      <View style={styles.cell}>
        <CellLabel color={colors.purple} label="Matchs · grille" />
        <Phone>
          <TopNav />
          <View style={styles.body}>
            <View style={styles.pillRow}>
              <Skel style={[styles.pill, { width: 70, backgroundColor: 'rgba(74,143,255,0.1)' }]} />
              <Skel style={[styles.pill, { width: 50 }]} />
              <Skel style={[styles.pill, { width: 50 }]} />
              <Skel style={[styles.pill, { width: 60 }]} />
            </View>
            <View style={styles.matchGrid}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <View key={i} style={styles.matchCard}>
                  <Skel style={styles.matchAvatar} />
                  <Skel style={styles.matchName} />
                  <Skel style={styles.matchMeta} />
                </View>
              ))}
            </View>
          </View>
          <TabbarSkel active={2} />
        </Phone>
      </View>

      {/* 2. EVENTS LIST */}
      <View style={styles.cell}>
        <CellLabel color={colors.purple} label="Événements · liste" />
        <Phone>
          <TopNav />
          <View style={styles.body}>
            <View style={styles.pillRow}>
              <Skel style={[styles.eventPill, { width: 70, backgroundColor: 'rgba(184,132,230,0.1)' }]} />
              <Skel style={[styles.eventPill, { width: 60 }]} />
              <Skel style={[styles.eventPill, { width: 60 }]} />
              <Skel style={[styles.eventPill, { width: 75 }]} />
            </View>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={styles.eventCard}>
                <Skel style={styles.eventThumb} />
                <View style={styles.eventInfo}>
                  <Skel style={[styles.line, { width: 70, height: 12 }]} />
                  <Skel style={[styles.line, { width: '90%', height: 13 }]} />
                  <Skel style={[styles.line, { width: '75%', height: 9 }]} />
                  <View style={styles.eventFoot}>
                    <View style={styles.miniAvatars}>
                      <Skel style={styles.miniAvatar} />
                      <Skel style={[styles.miniAvatar, { marginLeft: -5 }]} />
                      <Skel style={[styles.miniAvatar, { marginLeft: -5 }]} />
                    </View>
                    <Skel style={[styles.line, { flex: 1, height: 8 }]} />
                  </View>
                </View>
              </View>
            ))}
          </View>
          <TabbarSkel active={3} />
        </Phone>
      </View>

      {/* 3. MARKETPLACE */}
      <View style={styles.cell}>
        <CellLabel color={colors.neon} label="Marketplace · grille" />
        <Phone>
          <TopNav />
          <View style={styles.body}>
            <Skel style={styles.search} />
            <View style={styles.pillRow}>
              {[65, 50, 50, 60, 55].map((w, i) => (
                <Skel key={i} style={[styles.cat, { width: w }]} />
              ))}
            </View>
            <View style={styles.marketGrid}>
              {[0, 1, 2, 3].map((i) => (
                <View key={i} style={styles.marketCard}>
                  <Skel style={styles.marketImg} />
                  <View style={styles.marketCardBody}>
                    <Skel style={[styles.line, { width: '85%', height: 10 }]} />
                    <Skel style={[styles.line, { width: '60%', height: 10, marginBottom: 7 }]} />
                    <Skel style={[styles.line, { width: '50%', height: 13, backgroundColor: 'rgba(74,143,255,0.1)' }]} />
                    <View style={styles.marketMeta}>
                      <Skel style={[styles.line, { flex: 1, height: 8 }]} />
                      <Skel style={styles.marketPill} />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <TabbarSkel active={2} />
        </Phone>
      </View>

      {/* 4. PROFIL DÉTAIL */}
      <View style={styles.cell}>
        <CellLabel color={colors.success} label="Profil · détail" />
        <Phone>
          <TopNav />
          <View style={styles.profileBody}>
            <View style={styles.profileHero}>
              <Skel style={StyleSheet.absoluteFill} />
              <View style={styles.heroBottom}>
                <Skel style={[styles.line, { width: 80, height: 16, backgroundColor: '#1E2230' }]} />
                <Skel style={[styles.line, { width: 60, height: 9, backgroundColor: '#1E2230' }]} />
              </View>
            </View>
            <View style={styles.profileInner}>
              <View style={styles.compatCard}>
                <Skel style={styles.compatCircle} />
                <View style={styles.compatInfo}>
                  <Skel style={[styles.line, { width: '70%', height: 11 }]} />
                  <Skel style={[styles.line, { width: '90%', height: 8 }]} />
                </View>
              </View>
              <View style={{ marginBottom: 12 }}>
                <Skel style={[styles.line, { width: '100%', height: 9 }]} />
                <Skel style={[styles.line, { width: '90%', height: 9 }]} />
                <Skel style={[styles.line, { width: '65%', height: 9 }]} />
              </View>
              <View style={styles.specsGrid}>
                {[0, 1, 2, 3].map((i) => (
                  <View key={i} style={styles.specCell}>
                    <Skel style={[styles.line, { width: '50%', height: 7 }]} />
                    <Skel style={[styles.line, { width: '70%', height: 11, backgroundColor: 'rgba(74,143,255,0.1)' }]} />
                  </View>
                ))}
              </View>
              <View style={styles.profileTags}>
                {[60, 78, 50, 68, 78].map((w, i) => (
                  <Skel key={i} style={[styles.profileTag, { width: w }]} />
                ))}
              </View>
            </View>
          </View>
          <TabbarSkel active={4} />
        </Phone>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  skel: { backgroundColor: SKEL, borderRadius: 3 },

  head: { alignItems: 'center' },
  headTitle: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink, marginBottom: 4 },
  headSub: { fontFamily: fonts.mono, fontSize: 12, color: colors.inkMute, letterSpacing: 0.4 },

  cell: { alignItems: 'center', gap: 10 },
  cellLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill },
  cellDot: { width: 6, height: 6, borderRadius: 3 },
  cellLabelTxt: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkDim, letterSpacing: 0.4 },

  phone: { width: '100%', maxWidth: 320, backgroundColor: '#08090E', borderRadius: 28, borderWidth: 4, borderColor: '#000', overflow: 'hidden' },
  topnav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 11, borderBottomWidth: 1, borderBottomColor: colors.line },
  navIcon: { width: 28, height: 28, borderRadius: 8 },
  navTitle: { width: 90, height: 14, borderRadius: 4 },
  body: { padding: 11 },
  pillRow: { flexDirection: 'row', gap: 5, marginBottom: 12, overflow: 'hidden' },
  pill: { height: 22, borderRadius: radius.pill },
  eventPill: { height: 26, borderRadius: radius.pill },

  matchGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  matchCard: { width: '47%', backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 11, padding: 7 },
  matchAvatar: { aspectRatio: 1, borderRadius: 9, marginBottom: 7 },
  matchName: { height: 11, width: '75%', marginBottom: 4 },
  matchMeta: { height: 8, width: '55%' },

  line: { backgroundColor: SKEL, borderRadius: 3, marginBottom: 5 },
  eventCard: { flexDirection: 'row', gap: 10, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 12, padding: 11, marginBottom: 9 },
  eventThumb: { width: 64, height: 64, borderRadius: 10 },
  eventInfo: { flex: 1, minWidth: 0 },
  eventFoot: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  miniAvatars: { flexDirection: 'row' },
  miniAvatar: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: colors.panel, backgroundColor: SKEL },

  search: { height: 30, borderRadius: 10, marginBottom: 9 },
  cat: { height: 20, borderRadius: radius.pill },
  marketGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  marketCard: { width: '47%', backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 11, overflow: 'hidden' },
  marketImg: { width: '100%', aspectRatio: 4 / 3, backgroundColor: SKEL },
  marketCardBody: { padding: 8 },
  marketMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  marketPill: { width: 26, height: 14, borderRadius: 3, backgroundColor: SKEL },

  profileBody: { },
  profileHero: { height: 160, overflow: 'hidden', justifyContent: 'flex-end' },
  heroBottom: { padding: 11, gap: 5 },
  profileInner: { paddingHorizontal: 11 },
  compatCard: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: -22, padding: 11, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 13, marginBottom: 12 },
  compatCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: SKEL },
  compatInfo: { flex: 1, gap: 5 },
  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 6, marginBottom: 12 },
  specCell: { width: '48%', backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 9, padding: 8 },
  profileTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 16 },
  profileTag: { height: 18, borderRadius: radius.pill, backgroundColor: SKEL },

  tabbar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 6, paddingBottom: 14, backgroundColor: 'rgba(8,9,14,0.92)' },
  tabSkel: { flex: 1, alignItems: 'center', gap: 3 },
  tabIcon: { width: 18, height: 18, borderRadius: 5, backgroundColor: SKEL },
  tabLabel: { width: 28, height: 6, borderRadius: 3, backgroundColor: SKEL },
  tabActive: { backgroundColor: 'rgba(74,143,255,0.2)' },
});
