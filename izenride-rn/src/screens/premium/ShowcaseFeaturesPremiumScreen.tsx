import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, NativeSyntheticEvent, NativeScrollEvent, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Crown, Heart, Star, Zap, Check, ChevronRight } from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, radius, shadow } from '@/theme';

const GOLD = '#FAC775';
const GOLD_DEEP = '#E89E4A';

type Feature = {
  tag: string;
  title: string;
  desc: string;
  bullets: string[];
  visual: React.ReactNode;
};

/** Showcase features Premium — carrousel des avantages (localisé Paris). */
export default function ShowcaseFeaturesPremiumScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const features: Feature[] = [
    {
      tag: 'Feature 1/4',
      title: 'Likes illimités',
      desc: 'Plus de limite quotidienne. Like tous les motards qui matchent ton style sans compter.',
      bullets: ['Multiplie tes chances de match par 5×', "Plus d'attente entre deux sessions de swipe"],
      visual: (
        <LinearGradient colors={['#1A1E28', '#10121A']} style={styles.visual}>
          <Text style={styles.infinity}>∞</Text>
          <Text style={styles.infinityLabel}>Likes par jour</Text>
          <Heart size={18} color="rgba(226,75,74,0.6)" fill="rgba(226,75,74,0.6)" style={{ position: 'absolute', top: '18%', left: '14%' }} />
          <Heart size={18} color="rgba(226,75,74,0.6)" fill="rgba(226,75,74,0.6)" style={{ position: 'absolute', top: '28%', right: '18%' }} />
          <Heart size={18} color="rgba(226,75,74,0.6)" fill="rgba(226,75,74,0.6)" style={{ position: 'absolute', bottom: '22%', left: '22%' }} />
        </LinearGradient>
      ),
    },
    {
      tag: 'Feature 2/4',
      title: "Vois qui t'a liké",
      desc: 'Découvre qui s\'intéresse à toi avant de swiper. Plus de hasard, que des matchs garantis.',
      bullets: ["Liste complète des profils qui t'ont liké", "Match instantané d'un simple tap"],
      visual: (
        <LinearGradient colors={['#1A1E28', '#10121A']} style={styles.visual}>
          <View style={styles.profileCard}>
            <View style={styles.pcAvatar}>
              <Text style={styles.pcAvatarTxt}>SP</Text>
            </View>
            <Text style={styles.pcName}>Sophie</Text>
            <Text style={styles.pcInfo}>28 · Paris 12e{'\n'}Yamaha MT-07</Text>
            <View style={styles.pcHeart}>
              <Heart size={14} color="#fff" fill="#fff" />
            </View>
          </View>
          <View style={styles.viewsCount}>
            <Text style={styles.viewsCountTxt}>
              <Text style={{ color: colors.purple }}>12 motards</Text> t'ont liké
            </Text>
          </View>
        </LinearGradient>
      ),
    },
    {
      tag: 'Feature 3/4',
      title: 'Super Likes',
      desc: 'Sors du lot. Notifie un motard que tu kiffes vraiment son profil avec un Super Like impossible à manquer.',
      bullets: ['3× plus de chances de matcher selon nos stats', 'Notification prioritaire au destinataire'],
      visual: (
        <LinearGradient colors={['#1A1E28', '#10121A']} style={styles.visual}>
          <LinearGradient colors={[colors.neon, '#3D7FBD']} style={styles.starIcon}>
            <Star size={44} color="#fff" fill="#fff" />
          </LinearGradient>
          <View style={[styles.viewsCount, { borderColor: 'rgba(74,156,232,0.3)' }]}>
            <Text style={styles.viewsCountTxt}>
              <Text style={{ color: colors.neon, fontSize: 14 }}>5</Text> Super Likes par semaine
            </Text>
          </View>
        </LinearGradient>
      ),
    },
    {
      tag: 'Feature 4/4',
      title: 'Boost ton profil',
      desc: 'Sois en tête de pile pendant 30 minutes et multiplie tes vues par 10. Idéal avant une sortie ou un événement.',
      bullets: ['1 Boost gratuit chaque mois inclus', 'Stats détaillées : vues, likes, conversions'],
      visual: (
        <LinearGradient colors={['#1A1E28', '#10121A']} style={styles.visual}>
          <View style={styles.boostStats}>
            <Text style={styles.boostStatsTxt}>+10× vues</Text>
          </View>
          <LinearGradient colors={[GOLD, GOLD_DEEP]} style={styles.rocketIcon}>
            <Zap size={36} color="#fff" fill="#fff" />
          </LinearGradient>
          <View style={styles.boostGraph}>
            {[25, 35, 28, 45, 70, 90, 100].map((h, i) => (
              <View key={i} style={[styles.boostBar, { height: `${h}%`, opacity: i >= 5 ? 1 : 0.7 }]} />
            ))}
          </View>
        </LinearGradient>
      ),
    },
  ];

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const p = Math.round(e.nativeEvent.contentOffset.x / width);
    if (p !== page) setPage(p);
  };

  const goTo = (i: number) => {
    scrollRef.current?.scrollTo({ x: i * width, animated: true });
    setPage(i);
  };

  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable style={styles.closeBtn} onPress={() => router.back()}>
          <X size={14} color={colors.inkDim} />
        </Pressable>
        <View style={styles.crownMini}>
          <Crown size={11} color={GOLD} fill={GOLD} />
          <Text style={styles.crownMiniTxt}>Premium</Text>
        </View>
      </View>

      {/* Dots */}
      <View style={styles.dots}>
        {features.map((_, i) => (
          <Pressable key={i} onPress={() => goTo(i)} style={[styles.dot, page === i && styles.dotActive]} />
        ))}
      </View>

      {/* Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {features.map((f) => (
          <View key={f.title} style={[styles.featurePage, { width }]}>
            {f.visual}
            <View style={styles.featTag}>
              <Crown size={10} color={GOLD} fill={GOLD} />
              <Text style={styles.featTagTxt}>{f.tag}</Text>
            </View>
            <Text style={styles.featTitle}>{f.title}</Text>
            <Text style={styles.featDesc}>{f.desc}</Text>
            <View style={{ gap: 7 }}>
              {f.bullets.map((b) => (
                <View key={b} style={styles.bullet}>
                  <LinearGradient colors={[GOLD, GOLD_DEEP]} style={styles.bulletCheck}>
                    <Check size={10} color="#fff" strokeWidth={3.5} />
                  </LinearGradient>
                  <Text style={styles.bulletTxt}>{b}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable>
          <LinearGradient colors={[GOLD, GOLD_DEEP]} style={styles.ctaBtn}>
            <Crown size={14} color={colors.izenDeep} fill={colors.izenDeep} />
            <Text style={styles.ctaTxt}>Découvrir tous les avantages Premium</Text>
          </LinearGradient>
        </Pressable>
        <View style={styles.swipeHint}>
          <Text style={styles.swipeHintTxt}>Swipe pour voir les autres features</Text>
          <ChevronRight size={11} color={colors.inkMute} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 6 },
  closeBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  crownMini: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9, backgroundColor: 'rgba(250,199,117,0.15)', borderWidth: 1, borderColor: 'rgba(250,199,117,0.3)' },
  crownMiniTxt: { fontFamily: fonts.bold, fontSize: 11, color: GOLD, textTransform: 'uppercase' },

  dots: { flexDirection: 'row', gap: 5, justifyContent: 'center', paddingVertical: 6 },
  dot: { width: 18, height: 4, borderRadius: 2, backgroundColor: 'rgba(42,53,69,0.6)' },
  dotActive: { width: 32, backgroundColor: GOLD },

  featurePage: { paddingHorizontal: 16, paddingTop: 6 },
  visual: { height: 220, borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },

  infinity: { fontFamily: fonts.bold, fontSize: 90, color: colors.danger, lineHeight: 92 },
  infinityLabel: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, marginTop: 8 },

  profileCard: { width: 110, height: 140, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.purple, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', ...shadow.card },
  pcAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: GOLD, alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  pcAvatarTxt: { fontFamily: fonts.bold, fontSize: 18, color: '#fff' },
  pcName: { fontFamily: fonts.bold, fontSize: 11, color: '#fff', marginBottom: 2 },
  pcInfo: { fontFamily: fonts.regular, fontSize: 9, color: '#fff', opacity: 0.8, textAlign: 'center', lineHeight: 11 },
  pcHeart: { position: 'absolute', top: 8, right: 8 },
  viewsCount: { position: 'absolute', bottom: 14, paddingHorizontal: 11, paddingVertical: 5, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderWidth: 1, borderColor: 'rgba(127,119,221,0.3)' },
  viewsCountTxt: { fontFamily: fonts.bold, fontSize: 11, color: '#fff' },

  starIcon: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', ...shadow.card },

  boostStats: { position: 'absolute', top: 18, right: 18, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 7, backgroundColor: 'rgba(250,199,117,0.15)', borderWidth: 1, borderColor: 'rgba(250,199,117,0.3)' },
  boostStatsTxt: { fontFamily: fonts.bold, fontSize: 10, color: GOLD, textTransform: 'uppercase' },
  rocketIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  boostGraph: { position: 'absolute', bottom: 16, left: 18, right: 18, height: 50, flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  boostBar: { flex: 1, backgroundColor: GOLD, borderTopLeftRadius: 3, borderTopRightRadius: 3 },

  featTag: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: 'rgba(250,199,117,0.12)', borderWidth: 1, borderColor: 'rgba(250,199,117,0.25)', marginBottom: 8 },
  featTagTxt: { fontFamily: fonts.bold, fontSize: 9.5, color: GOLD, textTransform: 'uppercase' },
  featTitle: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink, marginBottom: 6 },
  featDesc: { fontFamily: fonts.regular, fontSize: 13, color: colors.inkDim, lineHeight: 19, marginBottom: 12 },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: 9 },
  bulletCheck: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  bulletTxt: { flex: 1, fontFamily: fonts.medium, fontSize: 12, color: colors.ink, lineHeight: 17 },

  footer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 22 },
  ctaBtn: { height: 50, borderRadius: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...shadow.card },
  ctaTxt: { fontFamily: fonts.bold, fontSize: 14.5, color: colors.izenDeep },
  swipeHint: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 7 },
  swipeHintTxt: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.inkMute },
});
