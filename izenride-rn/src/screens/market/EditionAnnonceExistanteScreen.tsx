import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import {
  ChevronLeft,
  Eye,
  Bike,
  Check,
  MessageCircle,
  Plus,
  X,
  ChevronRight,
  Truck,
  AlertTriangle,
  Trash2,
  Archive,
} from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, radius, shadow } from '@/theme';

const PHOTO_COLORS = ['rgba(74,156,232,0.5)', 'rgba(127,119,221,0.5)', 'rgba(250,199,117,0.5)', 'rgba(93,202,165,0.5)'];
const CONDITIONS = ['Neuf', 'Comme neuf', 'Bon état', 'Correct', 'Pour pièces'];

/** Édition annonce existante — réutilise create-listing + zone sensible (localisé Paris / IDF). */
export default function EditionAnnonceExistanteScreen() {
  const [title, setTitle] = useState('Yamaha MT-09 SP 2024 — Comme neuve');
  const [cond, setCond] = useState('Comme neuf');
  const [desc, setDesc] = useState(
    "MT-09 SP 2024 acquise neuve en mars, 3 200 km parcourus. Carnet d'entretien à jour, suspensions Öhlins d'origine, pot Akrapovic homologué. Vendue avec 2 clés, manuel et facture. Visible à Paris 12e, essai possible."
  );
  const [price, setPrice] = useState('12 800');
  const [delivery, setDelivery] = useState(true);
  const [negotiable, setNegotiable] = useState(true);

  return (
    <Screen scroll={false} pad={0} edges={['top']}>
      {/* Nav top */}
      <View style={styles.navTop}>
        <Pressable style={styles.navBack}>
          <ChevronLeft size={16} color={colors.inkDim} />
        </Pressable>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={styles.navTitle}>Modifier l'annonce</Text>
          <Text style={styles.navSubtitle}>IZR-LIST-9F8C2A</Text>
        </View>
        <Pressable style={styles.navPreview}>
          <Eye size={12} color={colors.inkDim} />
          <Text style={styles.navPreviewTxt}>Aperçu</Text>
        </Pressable>
      </View>

      {/* Status strip */}
      <View style={styles.statusStrip}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>
          En ligne · <Text style={styles.statusStat}>
            <Text style={styles.statusNum}>3 824</Text> vues · <Text style={styles.statusNum}>18</Text> messages
          </Text>
        </Text>
        <Pressable style={styles.pauseLink}>
          <Text style={styles.pauseTxt}>Pause</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Photos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Photos <Text style={styles.req}>*</Text>
          </Text>
          <View style={styles.photosGrid}>
            {PHOTO_COLORS.map((c, i) => (
              <View key={i} style={styles.photoCell}>
                <View style={styles.photoBg}>
                  {i === 2 ? <Check size={22} color={c} /> : i === 3 ? <MessageCircle size={22} color={c} /> : <Bike size={22} color={c} />}
                </View>
                {i === 0 && (
                  <View style={styles.mainTag}>
                    <Text style={styles.mainTagTxt}>★ Cover</Text>
                  </View>
                )}
                <View style={styles.deleteBtn}>
                  <X size={9} color={colors.ink} strokeWidth={3} />
                </View>
              </View>
            ))}
            <Pressable style={[styles.photoCell, styles.photoAdd]}>
              <Plus size={22} color={colors.inkMute} />
            </Pressable>
          </View>
        </View>

        {/* Détails */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails</Text>

          <View style={styles.field}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>
                Titre de l'annonce <Text style={styles.req}>*</Text>
              </Text>
              <Text style={styles.counter}>38 / 80</Text>
            </View>
            <TextInput style={styles.fieldInput} value={title} onChangeText={setTitle} />
          </View>

          <View style={styles.fieldRow}>
            <Pressable style={[styles.field, styles.selectField, { flex: 1 }]}>
              <View>
                <Text style={[styles.fieldLabel, { marginBottom: 2 }]}>Catégorie</Text>
                <Text style={styles.selectValue}>Moto</Text>
              </View>
              <ChevronRight size={14} color={colors.inkMute} />
            </Pressable>
            <Pressable style={[styles.field, styles.selectField, { flex: 1 }]}>
              <View>
                <Text style={[styles.fieldLabel, { marginBottom: 2 }]}>Sous-catégorie</Text>
                <Text style={styles.selectValue}>Roadster</Text>
              </View>
              <ChevronRight size={14} color={colors.inkMute} />
            </Pressable>
          </View>

          {/* État chips */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>État</Text>
            <View style={styles.chips}>
              {CONDITIONS.map((c) => {
                const on = cond === c;
                return (
                  <Pressable key={c} onPress={() => setCond(c)} style={[styles.chip, on && styles.chipOn]}>
                    <Text style={[styles.chipTxt, on && { color: colors.neon }]}>{c}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Description */}
          <View style={styles.field}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>Description</Text>
              <Text style={styles.counter}>186 / 2000</Text>
            </View>
            <TextInput style={[styles.fieldInput, styles.textarea]} multiline value={desc} onChangeText={setDesc} />
          </View>
        </View>

        {/* Prix et livraison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prix et livraison</Text>

          <View style={[styles.field, styles.prefixField]}>
            <Text style={styles.prefix}>€</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { marginBottom: 1 }]}>Prix de vente</Text>
              <TextInput style={styles.prefixInput} value={price} onChangeText={setPrice} />
            </View>
          </View>

          {/* Toggles */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleIcon}>
              <Truck size={14} color={colors.neon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>Livraison disponible</Text>
              <Text style={styles.toggleSub}>Colissimo · à partir de 8,90 €</Text>
            </View>
            <Pressable onPress={() => setDelivery((v) => !v)} style={[styles.toggleSwitch, delivery && styles.toggleSwitchOn]}>
              <View style={[styles.toggleKnob, delivery && styles.toggleKnobOn]} />
            </Pressable>
          </View>

          <View style={styles.toggleRow}>
            <View style={[styles.toggleIcon, styles.toggleIconAmber]}>
              <MessageCircle size={14} color={colors.warn} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>Prix négociable</Text>
              <Text style={styles.toggleSub}>Les acheteurs peuvent te faire des offres</Text>
            </View>
            <Pressable onPress={() => setNegotiable((v) => !v)} style={[styles.toggleSwitch, negotiable && styles.toggleSwitchOn]}>
              <View style={[styles.toggleKnob, negotiable && styles.toggleKnobOn]} />
            </Pressable>
          </View>
        </View>

        {/* Localisation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localisation</Text>
          <Pressable style={[styles.field, styles.selectField]}>
            <View>
              <Text style={[styles.fieldLabel, { marginBottom: 2 }]}>Ville</Text>
              <Text style={styles.selectValue}>Paris 12e, 75012</Text>
            </View>
            <ChevronRight size={14} color={colors.inkMute} />
          </Pressable>
        </View>

        {/* Zone sensible */}
        <View style={styles.dangerZone}>
          <View style={styles.dangerTitleRow}>
            <AlertTriangle size={12} color={colors.danger} />
            <Text style={styles.dangerTitle}>Zone sensible</Text>
          </View>
          <Text style={styles.dangerSub}>Actions sur le cycle de vie de l'annonce</Text>

          <Pressable style={styles.dangerBtn}>
            <View style={[styles.dangerBtnIcon, styles.archiveIcon]}>
              <Archive size={16} color={colors.warn} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dangerBtnTitle}>Archiver l'annonce</Text>
              <Text style={styles.dangerBtnSub}>Retire l'annonce du shop public, mais garde tout (photos, prix, stats). Réversible.</Text>
            </View>
            <ChevronRight size={14} color={colors.inkMute} />
          </Pressable>

          <Pressable style={styles.dangerBtn}>
            <View style={[styles.dangerBtnIcon, styles.deleteIcon]}>
              <Trash2 size={16} color={colors.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.dangerBtnTitle, { color: colors.danger }]}>Supprimer définitivement</Text>
              <Text style={styles.dangerBtnSub}>Effacement complet et irréversible. L'annonce, les stats et l'historique sont perdus.</Text>
            </View>
            <ChevronRight size={14} color={colors.inkMute} />
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.btnCancel}>
          <X size={16} color={colors.inkDim} />
        </Pressable>
        <Pressable style={styles.btnSave}>
          <Check size={15} color="#fff" strokeWidth={2.5} />
          <Text style={styles.btnSaveTxt}>Enregistrer les modifications</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  navTop: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  navBack: { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  navSubtitle: { fontFamily: fonts.mono, fontSize: 10, color: colors.inkMute, marginTop: 1 },
  navPreview: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 32, paddingHorizontal: 11, borderRadius: 9, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line },
  navPreviewTxt: { fontFamily: fonts.semibold, fontSize: 11.5, color: colors.inkDim },

  statusStrip: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'rgba(93,202,165,0.04)', borderBottomWidth: 1, borderColor: 'rgba(93,202,165,0.15)' },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  statusText: { flex: 1, fontFamily: fonts.semibold, fontSize: 12, color: colors.ink },
  statusStat: { fontFamily: fonts.medium, color: colors.inkMute },
  statusNum: { fontFamily: fonts.monoBold, color: colors.neon },
  pauseLink: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7 },
  pauseTxt: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkMute },

  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 },
  section: { marginBottom: 18 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 11, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10, paddingLeft: 4 },
  req: { color: colors.danger },

  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  photoCell: { width: '23%', aspectRatio: 1, borderRadius: 11, overflow: 'hidden', backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  photoBg: { ...StyleSheet.absoluteFillObject, backgroundColor: '#14181f', alignItems: 'center', justifyContent: 'center' },
  mainTag: { position: 'absolute', top: 5, left: 5, backgroundColor: '#F5C76B', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  mainTagTxt: { fontFamily: fonts.bold, fontSize: 8, color: colors.bg, textTransform: 'uppercase', letterSpacing: 0.4 },
  deleteBtn: { position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  photoAdd: { borderWidth: 1.5, borderColor: colors.inkMute, borderStyle: 'dashed', backgroundColor: 'transparent' },

  field: { backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: 13, padding: 12, marginBottom: 8 },
  fieldLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  fieldLabel: { fontFamily: fonts.semibold, fontSize: 10, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.8 },
  counter: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.inkMute },
  fieldInput: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink, padding: 0 },
  textarea: { minHeight: 70, textAlignVertical: 'top', fontFamily: fonts.regular, lineHeight: 19 },

  fieldRow: { flexDirection: 'row', gap: 8 },
  selectField: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectValue: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line },
  chipOn: { backgroundColor: 'rgba(74,156,232,0.1)', borderColor: colors.neon },
  chipTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkDim },

  prefixField: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  prefix: { fontFamily: fonts.monoBold, fontSize: 18, color: colors.inkMute },
  prefixInput: { fontFamily: fonts.monoBold, fontSize: 18, color: colors.ink, padding: 0 },

  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: 13, padding: 12, marginBottom: 8 },
  toggleIcon: { width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(74,156,232,0.1)', borderWidth: 1, borderColor: 'rgba(74,156,232,0.25)', alignItems: 'center', justifyContent: 'center' },
  toggleIconAmber: { backgroundColor: 'rgba(250,199,117,0.1)', borderColor: 'rgba(250,199,117,0.25)' },
  toggleTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, marginBottom: 1 },
  toggleSub: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.inkMute },
  toggleSwitch: { width: 42, height: 24, borderRadius: 12, backgroundColor: colors.line, borderWidth: 1, borderColor: colors.lineStrong, padding: 1, justifyContent: 'center' },
  toggleSwitchOn: { backgroundColor: colors.success, borderColor: colors.success },
  toggleKnob: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.inkMute },
  toggleKnobOn: { backgroundColor: '#fff', transform: [{ translateX: 18 }] },

  dangerZone: { marginTop: 6, paddingTop: 18, borderTopWidth: 1, borderTopColor: colors.lineStrong, borderStyle: 'dashed' },
  dangerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4, paddingLeft: 4 },
  dangerTitle: { fontFamily: fonts.bold, fontSize: 11, color: colors.danger, textTransform: 'uppercase', letterSpacing: 1.2 },
  dangerSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginBottom: 12, paddingLeft: 4 },
  dangerBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: 13, padding: 12, marginBottom: 8 },
  dangerBtnIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  archiveIcon: { backgroundColor: 'rgba(250,199,117,0.1)', borderWidth: 1, borderColor: 'rgba(250,199,117,0.25)' },
  deleteIcon: { backgroundColor: 'rgba(226,75,74,0.1)', borderWidth: 1, borderColor: 'rgba(226,75,74,0.3)' },
  dangerBtnTitle: { fontFamily: fonts.bold, fontSize: 13.5, color: colors.ink, marginBottom: 2 },
  dangerBtnSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkDim, lineHeight: 15 },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, backgroundColor: colors.panelDeep, borderTopWidth: 1, borderTopColor: colors.line },
  btnCancel: { width: 50, height: 50, borderRadius: 14, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  btnSave: { flex: 1, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.neon, borderRadius: 14, ...shadow.neon },
  btnSaveTxt: { fontFamily: fonts.bold, fontSize: 14.5, color: '#fff' },
});
