import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgGrad, RadialGradient, Stop, Rect, Circle, Path, Ellipse, G } from 'react-native-svg';
import {
  ChevronLeft,
  Crop,
  RefreshCw,
  Sun,
  Star,
  MoreVertical,
  Plus,
  MessageCircle,
  MapPin,
  Trash2,
  Check,
  ChevronRight,
} from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, radius, shadow } from '@/theme';

const GOLD = '#E8B547';

const TOOLS = [
  { icon: Crop, label: 'Recadrer', active: true },
  { icon: RefreshCw, label: 'Pivoter', active: false },
  { icon: Sun, label: 'Lumière', active: false },
  { icon: Star, label: 'Filtre', active: false },
];

const GALLERY = [
  { glyph: '🌅', editing: true, cover: true, c: ['#4a3050', '#0e0814'] as const },
  { glyph: '🏔️', order: 2, c: ['#2a3040', '#0e1422'] as const },
  { glyph: '🏍️', order: 3, c: [colors.purple, '#2a1f3d'] as const },
  { glyph: '🛣️', order: 4, c: [colors.neon, '#0a1428'] as const },
  { glyph: '🌿', order: 5, c: ['#5a4520', '#2a1f10'] as const },
];

/** Gestion photos détaillée — éditeur + galerie + actions rapides (localisé Fontainebleau). */
export default function GestionPhotosDetailleeScreen() {
  const [tool, setTool] = useState(0);

  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Top nav */}
      <View style={styles.topnav}>
        <Pressable style={styles.iconBtn}>
          <ChevronLeft size={16} color={colors.ink} />
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.navTitle}>Gestion photos</Text>
          <Text style={styles.navSub}>5 / 6 photos</Text>
        </View>
        <Pressable style={styles.doneBtn}>
          <Text style={styles.doneTxt}>Terminé</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Éditeur */}
        <View style={styles.editor}>
          <View style={styles.editorLabel}>
            <Crop size={11} color={colors.neon} />
            <Text style={styles.editorLabelTxt}>ÉDITION · PHOTO 1</Text>
            <Text style={styles.editorName}>IMG_4287.jpg · 4032 × 3024</Text>
          </View>

          <View style={styles.cropCanvas}>
            <Svg style={StyleSheet.absoluteFill} viewBox="0 0 360 220" preserveAspectRatio="xMidYMid slice">
              <Defs>
                <SvgGrad id="phSky" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#1a2848" />
                  <Stop offset="50%" stopColor="#3d3a5e" />
                  <Stop offset="100%" stopColor="#9c5a4a" />
                </SvgGrad>
                <RadialGradient id="phSun" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#ffe4b5" stopOpacity="0.9" />
                  <Stop offset="40%" stopColor="#f4a574" stopOpacity="0.4" />
                  <Stop offset="100%" stopColor="#9c5a4a" stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Rect width="360" height="220" fill="url(#phSky)" />
              <Circle cx="270" cy="125" r="60" fill="url(#phSun)" />
              <Circle cx="270" cy="125" r="22" fill="rgba(255,230,180,0.85)" />
              <Path d="M 0 145 L 60 110 L 130 130 L 200 100 L 280 130 L 360 110 L 360 220 L 0 220 Z" fill="#1a1828" opacity={0.85} />
              <Path d="M 0 175 L 360 165 L 360 220 L 0 220 Z" fill="#08070d" />
              <G transform="translate(180, 160)">
                <Ellipse cx="0" cy="32" rx="28" ry="3" fill="black" opacity={0.5} />
                <Circle cx="-20" cy="22" r="10" fill="#0a0a10" />
                <Circle cx="20" cy="22" r="10" fill="#0a0a10" />
                <Path d="M -20 22 L -7 6 L 7 4 L 20 22 Z" fill="#0c0c14" />
                <Ellipse cx="6" cy="-14" rx="5" ry="6" fill="#0a0a10" />
              </G>
            </Svg>
            <View style={styles.cropRatio}>
              <Text style={styles.cropRatioTxt}>4 : 5</Text>
            </View>
            <View style={styles.cropFrame} pointerEvents="none" />
          </View>

          <View style={styles.toolbar}>
            {TOOLS.map((t, i) => {
              const active = tool === i;
              const Icon = t.icon;
              return (
                <Pressable key={t.label} onPress={() => setTool(i)} style={[styles.toolBtn, active && styles.toolBtnActive]}>
                  <Icon size={14} color={active ? colors.neon : colors.ink} />
                  <Text style={[styles.toolTxt, active && { color: colors.neon }]}>{t.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Galerie */}
        <View style={styles.gallerySection}>
          <View style={styles.galleryHead}>
            <Text style={styles.galleryTitle}>Toutes les photos</Text>
            <Text style={styles.galleryMeta}>
              <Text style={{ color: colors.ink }}>5</Text> / 6 · maintenir pour réordonner
            </Text>
          </View>
          <View style={styles.galleryGrid}>
            {GALLERY.map((p, i) => (
              <LinearGradient key={i} colors={p.c} style={[styles.photo, p.editing && styles.photoEditing]}>
                <Text style={styles.photoGlyph}>{p.glyph}</Text>
                {p.cover ? (
                  <View style={styles.coverBadge}>
                    <Star size={8} color="#1a1408" fill="#1a1408" />
                    <Text style={styles.coverTxt}>COUV.</Text>
                  </View>
                ) : (
                  <View style={styles.orderBadge}>
                    <Text style={styles.orderTxt}>{p.order}</Text>
                  </View>
                )}
                {p.editing ? (
                  <View style={styles.editMark}>
                    <Crop size={9} color="#fff" />
                  </View>
                ) : (
                  <Pressable style={styles.quickBtn}>
                    <MoreVertical size={12} color="#fff" />
                  </Pressable>
                )}
              </LinearGradient>
            ))}
            <Pressable style={styles.photoAdd}>
              <Plus size={20} color={colors.inkMute} />
              <Text style={styles.addTxt}>AJOUTER</Text>
            </Pressable>
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.quickActions}>
          <View style={styles.qaHead}>
            <Text style={styles.qaHeadLabel}>ACTIONS RAPIDES</Text>
            <Text style={styles.qaPhotoName}>Photo 1</Text>
          </View>
          <QaRow icon={<Star size={12} color={GOLD} />} bg="rgba(232,181,71,0.12)" title="Photo de couverture" desc="Première vue · déjà active" right={<Check size={13} color={colors.success} />} />
          <QaRow icon={<MessageCircle size={12} color={colors.neon} />} bg="rgba(77,143,255,0.12)" title="Modifier la légende" desc="Aucune légende pour l'instant" right={<ChevronRight size={13} color={colors.inkMute} />} />
          <QaRow icon={<MapPin size={12} color={colors.purple} />} bg="rgba(184,132,230,0.12)" title="Géolocaliser" desc="Fontainebleau · masqué par défaut" right={<ChevronRight size={13} color={colors.inkMute} />} />
          <QaRow icon={<Trash2 size={12} color={colors.danger} />} bg="rgba(226,75,74,0.12)" title="Supprimer cette photo" titleDanger desc="Action irréversible" right={<ChevronRight size={13} color={colors.inkMute} />} last />
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.addFab}>
          <Plus size={18} color={colors.ink} />
        </Pressable>
        <Pressable style={{ flex: 1 }}>
          <LinearGradient colors={[colors.neon, colors.purple]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.applyBtn}>
            <Check size={14} color="#fff" />
            <Text style={styles.applyTxt}>Appliquer le recadrage</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </Screen>
  );
}

function QaRow({
  icon,
  bg,
  title,
  titleDanger,
  desc,
  right,
  last,
}: {
  icon: React.ReactNode;
  bg: string;
  title: string;
  titleDanger?: boolean;
  desc: string;
  right: React.ReactNode;
  last?: boolean;
}) {
  return (
    <View style={[styles.qaRow, last && { borderBottomWidth: 0 }]}>
      <View style={[styles.qaIcon, { backgroundColor: bg }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.qaTitle, titleDanger && { color: colors.danger }]}>{title}</Text>
        <Text style={styles.qaDesc}>{desc}</Text>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  topnav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  iconBtn: { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  navSub: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, marginTop: 1 },
  doneBtn: { backgroundColor: colors.neon, borderRadius: 9, paddingHorizontal: 14, paddingVertical: 8 },
  doneTxt: { fontFamily: fonts.bold, fontSize: 12, color: '#fff' },

  content: { paddingBottom: 110 },

  editor: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  editorLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  editorLabelTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.neon, letterSpacing: 0.6 },
  editorName: { marginLeft: 'auto', fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },
  cropCanvas: { height: 220, borderRadius: 14, overflow: 'hidden', backgroundColor: '#000' },
  cropRatio: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5, backgroundColor: 'rgba(8,9,14,0.85)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cropRatioTxt: { fontFamily: fonts.monoBold, fontSize: 9, color: colors.ink },
  cropFrame: { position: 'absolute', top: 12, bottom: 12, alignSelf: 'center', width: 158, borderWidth: 2, borderColor: '#fff', borderRadius: 4 },
  toolbar: { flexDirection: 'row', gap: 6, marginTop: 10 },
  toolBtn: { flex: 1, height: 42, borderRadius: 11, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', gap: 2 },
  toolBtnActive: { backgroundColor: 'rgba(77,143,255,0.08)', borderColor: 'rgba(77,143,255,0.4)' },
  toolTxt: { fontFamily: fonts.semibold, fontSize: 9, color: colors.ink },

  gallerySection: { paddingHorizontal: 14, paddingTop: 12 },
  galleryHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  galleryTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  galleryMeta: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute },
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  photo: { width: '31.7%', aspectRatio: 4 / 5, borderRadius: 11, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  photoEditing: { borderWidth: 2, borderColor: colors.neon },
  photoGlyph: { fontSize: 30, opacity: 0.7 },
  coverBadge: { position: 'absolute', top: 4, left: 4, flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: GOLD },
  coverTxt: { fontFamily: fonts.monoBold, fontSize: 8, color: '#1a1408' },
  orderBadge: { position: 'absolute', top: 4, left: 4, width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(8,9,14,0.85)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  orderTxt: { fontFamily: fonts.monoBold, fontSize: 9, color: colors.ink },
  editMark: { position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.neon, borderWidth: 1.5, borderColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  quickBtn: { position: 'absolute', bottom: 4, right: 4, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(8,9,14,0.7)', alignItems: 'center', justifyContent: 'center' },
  photoAdd: { width: '31.7%', aspectRatio: 4 / 5, borderRadius: 11, backgroundColor: colors.bg2, borderWidth: 1.5, borderColor: colors.inkMute, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 5 },
  addTxt: { fontFamily: fonts.mono, fontSize: 9, color: colors.inkMute },

  quickActions: { marginHorizontal: 14, marginTop: 12, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 12, overflow: 'hidden' },
  qaHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingTop: 9, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: colors.line },
  qaHeadLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, letterSpacing: 0.8 },
  qaPhotoName: { fontFamily: fonts.mono, fontSize: 11, color: colors.ink },
  qaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: colors.line },
  qaIcon: { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  qaTitle: { fontFamily: fonts.semibold, fontSize: 12, color: colors.ink },
  qaDesc: { fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute, marginTop: 1 },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 28, backgroundColor: 'rgba(8,9,14,0.96)', borderTopWidth: 1, borderTopColor: colors.line },
  addFab: { width: 50, height: 50, borderRadius: 14, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  applyBtn: { height: 50, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...shadow.neon },
  applyTxt: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
});
