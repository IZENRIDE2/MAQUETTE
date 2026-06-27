import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Plus, Bike, MapPin, ArrowRight } from 'lucide-react-native';
import { Screen } from '@/components';
import { colors, fonts, radius, shadow } from '@/theme';

const CATS = ['Moto', 'Équipement', 'Pièces', 'Accessoires'];

/** Création d'annonce — Marketplace entre motards (localisé Paris / IDF). */
export default function CreationDAnnonceScreen() {
  const [cat, setCat] = useState('Moto');
  const [title, setTitle] = useState('Kawasaki Z650 2021');
  const [price, setPrice] = useState('6200');
  const [km, setKm] = useState('8400');
  const [desc, setDesc] = useState('Très bon état, entretien suivi en concession, pneus neufs. Visible à Paris 12e.');
  const [loc, setLoc] = useState('Paris 12e, Île-de-France');

  return (
    <Screen scroll pad={0} edges={['top']}>
      {/* Header */}
      <View style={styles.dhead}>
        <Pressable style={styles.iconBtn}>
          <X size={18} color={colors.ink} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.dheadTitle}>Nouvelle annonce</Text>
          <Text style={styles.dheadSub}>Marketplace · entre motards</Text>
        </View>
      </View>

      <View style={styles.form}>
        {/* Photos */}
        <View>
          <Text style={styles.flabel}>Photos · 1/8</Text>
          <View style={styles.photoUp}>
            <LinearGradient colors={['#1c3350', '#0f1726']} style={styles.ph}>
              <View style={styles.phPri}>
                <Text style={styles.phPriTxt}>Principale</Text>
              </View>
              <View style={styles.phX}>
                <X size={9} color="#fff" strokeWidth={2.5} />
              </View>
            </LinearGradient>
            <Pressable style={[styles.ph, styles.phAdd]}>
              <Plus size={22} color={colors.inkMute} />
            </Pressable>
          </View>
        </View>

        {/* Catégorie */}
        <View>
          <Text style={styles.flabel}>Catégorie</Text>
          <View style={styles.cats}>
            {CATS.map((c) => {
              const on = cat === c;
              return (
                <Pressable key={c} onPress={() => setCat(c)} style={[styles.cat, on && styles.catOn]}>
                  {c === 'Moto' && <Bike size={14} color={on ? colors.neon : colors.inkDim} />}
                  <Text style={[styles.catTxt, on && { color: colors.neon, fontFamily: fonts.semibold }]}>{c}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Titre */}
        <View>
          <Text style={styles.flabel}>Titre</Text>
          <View style={styles.inp}>
            <TextInput style={styles.inpInput} value={title} onChangeText={setTitle} placeholder="Ex : Kawasaki Z650 2021" placeholderTextColor={colors.inkMute} />
          </View>
        </View>

        {/* Prix + Kilométrage */}
        <View style={styles.row2}>
          <View style={{ flex: 1 }}>
            <Text style={styles.flabel}>Prix</Text>
            <View style={styles.inp}>
              <TextInput style={styles.inpInput} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.inkMute} />
              <Text style={styles.eur}>€</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.flabel}>Kilométrage</Text>
            <View style={styles.inp}>
              <TextInput style={styles.inpInput} value={km} onChangeText={setKm} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.inkMute} />
              <Text style={[styles.eur, { fontSize: 12 }]}>km</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View>
          <Text style={styles.flabel}>Description</Text>
          <View style={styles.inp}>
            <TextInput
              style={[styles.inpInput, styles.textarea]}
              multiline
              value={desc}
              onChangeText={setDesc}
              placeholder="Décris ton bien, son état, l'historique..."
              placeholderTextColor={colors.inkMute}
            />
          </View>
        </View>

        {/* Localisation */}
        <View>
          <Text style={styles.flabel}>Localisation</Text>
          <View style={styles.inp}>
            <MapPin size={18} color={colors.inkMute} style={{ marginRight: 10 }} />
            <TextInput style={styles.inpInput} value={loc} onChangeText={setLoc} placeholderTextColor={colors.inkMute} />
          </View>
        </View>

        {/* CTA */}
        <Pressable style={styles.ctaWrap}>
          <LinearGradient colors={[colors.neon, '#2E7FCC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cta}>
            <Text style={styles.ctaTxt}>Publier l'annonce</Text>
            <ArrowRight size={18} color="#fff" strokeWidth={2.5} />
          </LinearGradient>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  dhead: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  iconBtn: { width: 38, height: 38, borderRadius: 11, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  dheadTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  dheadSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginTop: 1 },

  form: { paddingHorizontal: 20, paddingTop: 14, gap: 16 },
  flabel: { fontFamily: fonts.semibold, fontSize: 11, color: colors.inkMute, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 },

  photoUp: { flexDirection: 'row', gap: 9, flexWrap: 'wrap' },
  ph: { width: 74, height: 74, borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panelSoft, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  phPri: { position: 'absolute', top: 4, left: 4, backgroundColor: colors.neon, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 5 },
  phPriTxt: { fontFamily: fonts.bold, fontSize: 8, color: '#fff' },
  phX: { position: 'absolute', top: 3, right: 3, width: 17, height: 17, borderRadius: 8.5, backgroundColor: 'rgba(8,9,14,0.8)', alignItems: 'center', justifyContent: 'center' },
  phAdd: { borderWidth: 1.5, borderColor: colors.inkMute, borderStyle: 'dashed', backgroundColor: 'transparent' },

  cats: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  cat: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 11, backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line },
  catOn: { backgroundColor: 'rgba(74,156,232,0.12)', borderColor: 'rgba(74,156,232,0.4)' },
  catTxt: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkDim },

  inp: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.line, borderRadius: 13, paddingHorizontal: 14 },
  inpInput: { flex: 1, paddingVertical: 14, fontFamily: fonts.regular, fontSize: 15, color: colors.ink },
  textarea: { minHeight: 78, textAlignVertical: 'top', lineHeight: 20 },
  eur: { fontFamily: fonts.bold, fontSize: 16, color: colors.inkMute },
  row2: { flexDirection: 'row', gap: 10 },

  ctaWrap: { marginTop: 6, marginBottom: 22 },
  cta: { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 16, ...shadow.neon },
  ctaTxt: { fontFamily: fonts.bold, fontSize: 16, color: '#fff' },
});
