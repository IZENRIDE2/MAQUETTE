import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import {
  CheckCircle, MessageSquare, Search, Heart, ShoppingCart, Users,
  Calendar, Check, CheckCheck,
} from 'lucide-react-native';
import { Screen, BottomTabBar } from '@/components';
import { colors, fonts, radius } from '@/theme';

const FILTERS = [
  { label: 'Tout', count: '12', dot: false },
  { label: 'Match', count: '5', dot: true },
  { label: 'Shop', count: '4', dot: false },
  { label: 'Événements', count: '3', dot: false },
];

const NEW_MATCHES = [
  { name: 'Léa', c: '#3a2c5e', isNew: true },
  { name: 'Sarah', c: '#5e2c44', isNew: true },
  { name: 'Marc', c: '#1f3858', isNew: false },
  { name: 'Antoine', c: '#1a4032', isNew: false },
  { name: 'Camille', c: '#4a3a1a', isNew: false },
];

/** Messages — liste des conversations (matchs / marketplace / événements / pro). */
export default function MessagesScreen() {
  const [active, setActive] = useState('Tout');
  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Nav top */}
      <View style={styles.navTop}>
        <Text style={styles.navTitle}>Messages</Text>
        <View style={styles.navActions}>
          <Pressable style={styles.navBtn}>
            <CheckCircle size={16} color={colors.inkDim} />
          </Pressable>
          <Pressable style={styles.navBtn}>
            <MessageSquare size={16} color={colors.inkDim} />
            <View style={styles.badgeDot} />
          </Pressable>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Search size={14} color={colors.inkMute} />
        <Text style={styles.searchPlaceholder}>Rechercher une conversation, un nom…</Text>
      </View>

      {/* Filtres */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        style={{ flexGrow: 0 }}
      >
        {FILTERS.map((f) => (
          <Pressable
            key={f.label}
            onPress={() => setActive(f.label)}
            style={[styles.ftab, active === f.label && styles.ftabOn]}
          >
            {f.dot && <View style={styles.unreadDot} />}
            <Text style={[styles.ftabTxt, active === f.label && { color: colors.bg }]}>{f.label}</Text>
            <View style={[styles.ftabCount, active === f.label && { backgroundColor: 'rgba(0,0,0,0.18)' }]}>
              <Text style={[styles.ftabCountTxt, active === f.label && { color: colors.bg }]}>{f.count}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Nouveaux matchs */}
        <View style={styles.nmSection}>
          <View style={styles.nmHead}>
            <View style={styles.nmTitleRow}>
              <Heart size={11} color={colors.danger} fill={colors.danger} />
              <Text style={styles.nmTitle}>Nouveaux matchs</Text>
              <View style={styles.nmPillCount}>
                <Text style={styles.nmPillCountTxt}>5</Text>
              </View>
            </View>
            <Text style={styles.nmAction}>Voir tous</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.nmStrip}>
            {/* Likes tease */}
            <View style={styles.nmCard}>
              <View style={[styles.nmAvatarWrap, { borderColor: colors.warn }]}>
                <View style={[styles.nmAvatar, { backgroundColor: 'rgba(245,199,107,0.1)' }]}>
                  <Heart size={24} color={colors.warn} fill={colors.warn} />
                </View>
                <View style={styles.likesPill}>
                  <Text style={styles.likesPillTxt}>12</Text>
                </View>
              </View>
              <Text style={[styles.nmName, { color: colors.warn }]}>Likes</Text>
            </View>
            {NEW_MATCHES.map((m) => (
              <View key={m.name} style={styles.nmCard}>
                <View style={[styles.nmAvatarWrap, { borderColor: colors.purple }]}>
                  {m.isNew && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeTxt}>New</Text>
                    </View>
                  )}
                  <View style={[styles.nmAvatar, { backgroundColor: m.c }]} />
                </View>
                <Text style={styles.nmName} numberOfLines={1}>{m.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Conversations */}
        <Text style={styles.sectionHead}>Conversations</Text>

        {/* 1. Match - non lu, en train d'écrire */}
        <View style={[styles.convRow, styles.convPinned]}>
          <View style={styles.convAvatar}>
            <View style={[styles.convAvatarImg, { backgroundColor: '#3a2c5e' }]} />
            <View style={styles.onlineDot} />
            <View style={[styles.typeBadge, { backgroundColor: colors.danger }]}>
              <Heart size={9} color="#fff" fill="#fff" />
            </View>
          </View>
          <View style={styles.convBody}>
            <View style={styles.convTopRow}>
              <Text style={styles.convName} numberOfLines={1}>Léa, 27</Text>
              <Text style={[styles.convTime, { color: colors.neon }]}>à l'instant</Text>
            </View>
            <View style={styles.convBottomRow}>
              <Text style={styles.convTyping} numberOfLines={1}>en train d'écrire…</Text>
              <View style={styles.unreadPill}><Text style={styles.unreadPillTxt}>2</Text></View>
            </View>
          </View>
        </View>

        {/* 2. Marketplace - non lu */}
        <View style={styles.convRow}>
          <View style={styles.convAvatar}>
            <View style={[styles.convAvatarImg, { backgroundColor: '#1f3858' }]} />
            <View style={[styles.typeBadge, { backgroundColor: colors.warn }]}>
              <ShoppingCart size={9} color={colors.bg} />
            </View>
          </View>
          <View style={styles.convBody}>
            <View style={styles.convTopRow}>
              <Text style={styles.convName} numberOfLines={1}>Marc D.</Text>
              <Text style={styles.convTime}>5 min</Text>
            </View>
            <View style={styles.convContextRow}>
              <Text style={styles.convContext} numberOfLines={1}>Casque AGV K6 noir mat</Text>
              <Text style={styles.convPrice}>280 €</Text>
            </View>
            <View style={styles.convBottomRow}>
              <Text style={[styles.convMessage, styles.convMessageUnread]} numberOfLines={1}>
                OK pour 260€ avec Colissimo offert ? 👍
              </Text>
              <View style={styles.unreadPill}><Text style={styles.unreadPillTxt}>3</Text></View>
            </View>
          </View>
        </View>

        {/* 3. Événement - groupe */}
        <View style={styles.convRow}>
          <View style={styles.convAvatar}>
            <View style={[styles.convAvatarImg, styles.eventAvatar]}>
              <Calendar size={22} color={colors.purple} />
            </View>
            <View style={[styles.typeBadge, { backgroundColor: colors.purple }]}>
              <Users size={9} color="#fff" />
            </View>
          </View>
          <View style={styles.convBody}>
            <View style={styles.convTopRow}>
              <Text style={styles.convName} numberOfLines={1}>Balade Forêt de Fontainebleau · 12 mai</Text>
              <Text style={styles.convTime}>12 min</Text>
            </View>
            <Text style={[styles.convContext, { color: colors.purple }]} numberOfLines={1}>
              14 participants · départ 8h Paris 12e
            </Text>
            <View style={styles.convBottomRow}>
              <Text style={[styles.convMessage, styles.convMessageUnread]} numberOfLines={1}>
                <Text style={styles.youMarker}>Antoine : </Text>Photo · « Itinéraire validé »
              </Text>
              <View style={styles.unreadPill}><Text style={styles.unreadPillTxt}>7</Text></View>
            </View>
          </View>
        </View>

        {/* 4. Pro vendor */}
        <View style={styles.convRow}>
          <View style={styles.convAvatar}>
            <View style={[styles.convAvatarImg, styles.proAvatar]}>
              <Text style={styles.proInitials}>YP</Text>
            </View>
            <View style={[styles.typeBadge, { backgroundColor: colors.neon }]}>
              <Check size={9} color="#fff" />
            </View>
          </View>
          <View style={styles.convBody}>
            <View style={styles.convTopRow}>
              <Text style={styles.convName} numberOfLines={1}>Yamaha Paris</Text>
              <Text style={styles.convTime}>1h</Text>
            </View>
            <View style={styles.convContextRow}>
              <Text style={styles.convContext} numberOfLines={1}>MT-09 SP 2024</Text>
              <Text style={styles.convPrice}>12 800 €</Text>
            </View>
            <View style={styles.convBottomRow}>
              <CheckCheck size={12} color={colors.neon} />
              <Text style={styles.convMessage} numberOfLines={1}>
                <Text style={styles.youMarker}>Vous : </Text>Parfait, je passe samedi à 14h pour l'essai
              </Text>
            </View>
          </View>
        </View>

        {/* 5. Match - lu */}
        <View style={styles.convRow}>
          <View style={styles.convAvatar}>
            <View style={[styles.convAvatarImg, { backgroundColor: '#5e2c44' }]} />
            <View style={styles.onlineDot} />
            <View style={[styles.typeBadge, { backgroundColor: colors.danger }]}>
              <Heart size={9} color="#fff" fill="#fff" />
            </View>
          </View>
          <View style={styles.convBody}>
            <View style={styles.convTopRow}>
              <Text style={styles.convName} numberOfLines={1}>Sarah, 29</Text>
              <Text style={styles.convTime}>2h</Text>
            </View>
            <View style={styles.convBottomRow}>
              <CheckCheck size={12} color={colors.neon} />
              <Text style={styles.convMessage} numberOfLines={1}>Yes top idée 😎 on se cale ça quand ?</Text>
            </View>
          </View>
        </View>

        {/* 6. Marketplace - lu */}
        <View style={styles.convRow}>
          <View style={styles.convAvatar}>
            <View style={[styles.convAvatarImg, { backgroundColor: '#1a4032' }]} />
            <View style={[styles.typeBadge, { backgroundColor: colors.warn }]}>
              <ShoppingCart size={9} color={colors.bg} />
            </View>
          </View>
          <View style={styles.convBody}>
            <View style={styles.convTopRow}>
              <Text style={styles.convName} numberOfLines={1}>Sophie L.</Text>
              <Text style={styles.convTime}>hier</Text>
            </View>
            <View style={styles.convContextRow}>
              <Text style={styles.convContext} numberOfLines={1}>Gants Alpinestars SP-8</Text>
              <Text style={styles.convPrice}>89 €</Text>
            </View>
            <View style={styles.convBottomRow}>
              <Text style={styles.convMessage} numberOfLines={1}>
                <Text style={styles.youMarker}>Vous : </Text>Top, bien reçus. Merci !
              </Text>
            </View>
          </View>
        </View>

        {/* 7. Match - silencieuse */}
        <View style={[styles.convRow, { borderBottomWidth: 0 }]}>
          <View style={styles.convAvatar}>
            <View style={[styles.convAvatarImg, { backgroundColor: '#4a3a1a' }]} />
            <View style={[styles.typeBadge, { backgroundColor: colors.danger }]}>
              <Heart size={9} color="#fff" fill="#fff" />
            </View>
          </View>
          <View style={styles.convBody}>
            <View style={styles.convTopRow}>
              <Text style={styles.convName} numberOfLines={1}>Camille, 31</Text>
              <Text style={styles.convTime}>3j</Text>
            </View>
            <View style={styles.convBottomRow}>
              <Text style={styles.convMessage} numberOfLines={1}>Match ! Dis-lui bonjour 👋</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomTabBar active="messages" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  navTop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, height: 56, borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  navTitle: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink },
  navActions: { flexDirection: 'row', gap: 8 },
  navBtn: {
    width: 36, height: 36, borderRadius: 11, backgroundColor: colors.panelSoft,
    borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center',
  },
  badgeDot: {
    position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: 4,
    backgroundColor: colors.danger, borderWidth: 2, borderColor: colors.panel,
  },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 9, marginHorizontal: 16, marginTop: 12,
    height: 38, paddingHorizontal: 12, backgroundColor: colors.panel,
    borderWidth: 1, borderColor: colors.line, borderRadius: 12,
  },
  searchPlaceholder: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkMute },

  filters: { paddingHorizontal: 16, gap: 6, paddingVertical: 11 },
  ftab: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7,
    backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill,
  },
  ftabOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  ftabTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkDim },
  ftabCount: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: radius.pill, paddingHorizontal: 5, paddingVertical: 1 },
  ftabCountTxt: { fontFamily: fonts.monoBold, fontSize: 9.5, color: colors.inkMute },
  unreadDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.danger },

  scroll: { paddingBottom: 100 },

  nmSection: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: colors.line },
  nmHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 },
  nmTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  nmTitle: { fontFamily: fonts.bold, fontSize: 11, color: colors.inkDim, letterSpacing: 1.2, textTransform: 'uppercase' },
  nmPillCount: { backgroundColor: 'rgba(255,92,122,0.12)', borderWidth: 1, borderColor: 'rgba(255,92,122,0.3)', borderRadius: radius.pill, paddingHorizontal: 6, paddingVertical: 1 },
  nmPillCountTxt: { fontFamily: fonts.monoBold, fontSize: 9.5, color: colors.danger },
  nmAction: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute },
  nmStrip: { gap: 12, paddingVertical: 2 },
  nmCard: { width: 64, alignItems: 'center' },
  nmAvatarWrap: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, padding: 2, marginBottom: 6 },
  nmAvatar: { flex: 1, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  newBadge: { position: 'absolute', top: -2, right: -2, zIndex: 5, backgroundColor: colors.danger, borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2, borderWidth: 2, borderColor: colors.bg },
  newBadgeTxt: { fontFamily: fonts.bold, fontSize: 8, color: '#fff', textTransform: 'uppercase' },
  likesPill: { position: 'absolute', bottom: 4, alignSelf: 'center', backgroundColor: colors.warn, borderRadius: radius.pill, paddingHorizontal: 6, borderWidth: 1.5, borderColor: colors.bg },
  likesPillTxt: { fontFamily: fonts.monoBold, fontSize: 9, color: colors.bg },
  nmName: { fontFamily: fonts.semibold, fontSize: 11, color: colors.ink },

  sectionHead: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, fontFamily: fonts.bold, fontSize: 10, color: colors.inkMute, letterSpacing: 1.4, textTransform: 'uppercase' },

  convRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line, position: 'relative' },
  convPinned: { borderLeftWidth: 3, borderLeftColor: colors.neon },
  convAvatar: { width: 50, height: 50 },
  convAvatarImg: { width: 50, height: 50, borderRadius: 25 },
  eventAvatar: { backgroundColor: 'rgba(184,132,230,0.12)', borderWidth: 1.5, borderColor: 'rgba(184,132,230,0.3)', alignItems: 'center', justifyContent: 'center' },
  proAvatar: { backgroundColor: '#1a3a5c', borderWidth: 1.5, borderColor: 'rgba(77,143,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  proInitials: { fontFamily: fonts.bold, fontSize: 16, color: colors.neon },
  onlineDot: { position: 'absolute', bottom: 1, right: 1, width: 13, height: 13, borderRadius: 6.5, backgroundColor: colors.success, borderWidth: 2.5, borderColor: colors.bg },
  typeBadge: { position: 'absolute', bottom: -3, right: -3, width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.bg, alignItems: 'center', justifyContent: 'center' },

  convBody: { flex: 1, minWidth: 0 },
  convTopRow: { flexDirection: 'row', alignItems: 'baseline', gap: 7, marginBottom: 3 },
  convName: { flex: 1, fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  convTime: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.inkMute },
  convContextRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  convContext: { fontFamily: fonts.semibold, fontSize: 10.5, color: colors.warn },
  convPrice: { fontFamily: fonts.monoBold, fontSize: 10.5, color: colors.inkMute },
  convBottomRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  convMessage: { flex: 1, fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkDim },
  convMessageUnread: { fontFamily: fonts.semibold, color: colors.ink },
  convTyping: { flex: 1, fontFamily: fonts.semibold, fontSize: 12.5, color: colors.success, fontStyle: 'italic' },
  youMarker: { fontFamily: fonts.semibold, color: colors.inkMute },
  unreadPill: { minWidth: 19, height: 19, paddingHorizontal: 5, borderRadius: radius.pill, backgroundColor: colors.neon, alignItems: 'center', justifyContent: 'center' },
  unreadPillTxt: { fontFamily: fonts.monoBold, fontSize: 10, color: '#fff' },
});
