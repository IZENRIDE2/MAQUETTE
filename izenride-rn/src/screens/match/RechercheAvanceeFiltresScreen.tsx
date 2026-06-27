import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { X, Search, Grid3x3, CreditCard, MapPin, Check, Bike, ChevronDown, Plus, Globe, ArrowRight } from 'lucide-react-native';
import { Screen, AppBar } from '@/components';
import { colors, fonts } from '@/theme';

const violet = colors.purple;
const amber = colors.warn;
const pink = colors.danger;

/** Recherche avancée + filtres marketplace (localisé Paris / IDF). */
export default function RechercheAvanceeFiltresScreen() {
  return (
    <Screen scroll={false} pad={0} edges={['top', 'bottom']}>
      <View style={{ paddingHorizontal: 16 }}>
        <AppBar title="Filtres" right={<Text style={styles.reset}>Réinitialiser</Text>} />
      </View>
      <Text style={styles.navSub}>
        <Text style={styles.navSubNum}>4</Text> filtres actifs
      </Text>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchInput}>
          <Search size={16} color={colors.inkMute} />
          <TextInput
            style={styles.searchTxt}
            defaultValue="casque shoei"
            placeholder="Casque, gants, GPS, MT-09…"
            placeholderTextColor={colors.inkMute}
          />
          <View style={styles.searchClear}>
            <X size={9} color={colors.ink} strokeWidth={3} />
          </View>
        </View>
      </View>

      {/* Active chips */}
      <View style={styles.activeFilters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {['Équipement', '150 € — 600 €', '≤ 50 km', 'Comme neuf, Bon état'].map((c) => (
            <View key={c} style={styles.activeChip}>
              <Text style={styles.activeChipTxt}>{c}</Text>
              <View style={styles.activeChipRemove}>
                <X size={7} color={colors.neon} strokeWidth={3} />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        {/* Catégorie */}
        <FilterSection icon={<Grid3x3 size={15} color={colors.neon} />} iconStyle={styles.fiCat} title="Catégorie" current="Équipement" hasValue>
          <View style={styles.catGrid}>
            <CatCard label="Motos" count="324" />
            <CatCard label="Équipement" count="1 248" active />
            <CatCard label="Pièces" count="562" />
            <CatCard label="Accessoires" count="487" />
          </View>
        </FilterSection>

        {/* Prix */}
        <FilterSection icon={<CreditCard size={15} color={amber} />} iconStyle={styles.fiPrice} title="Prix" current="150 € — 600 €" hasValue>
          <View style={styles.priceDisplay}>
            <View>
              <Text style={styles.priceLabel}>Min</Text>
              <Text style={styles.priceValue}>
                <Text style={styles.currency}>€</Text>150
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.priceLabel}>Max</Text>
              <Text style={styles.priceValue}>
                <Text style={styles.currency}>€</Text>600
              </Text>
            </View>
          </View>
          <View style={styles.sliderTrack}>
            <View style={styles.track} />
            <View style={[styles.fill, { left: '12%', right: '28%', backgroundColor: colors.neon }]} />
            <View style={[styles.handle, { left: '12%', borderColor: colors.neon }]} />
            <View style={[styles.handle, { left: '72%', borderColor: colors.neon }]} />
          </View>
          <View style={styles.presets}>
            <Preset label="< 100 €" />
            <Preset label="100 - 500 €" />
            <Preset label="150 - 600 €" active color={amber} />
            <Preset label="500 - 2k €" />
            <Preset label="> 2k €" />
          </View>
        </FilterSection>

        {/* Distance */}
        <FilterSection icon={<MapPin size={15} color={violet} />} iconStyle={styles.fiDist} title="Distance" current="Dans un rayon de 50 km" hasValue>
          <View style={styles.distDisplay}>
            <Text style={styles.distValue}>50</Text>
            <Text style={styles.distUnit}>km</Text>
          </View>
          <View style={styles.sliderTrack}>
            <View style={styles.track} />
            <View style={[styles.fill, { left: '0%', right: '50%', backgroundColor: violet }]} />
            <View style={[styles.handle, { left: '50%', borderColor: violet }]} />
          </View>
          <View style={styles.distPresets}>
            <Preset label="5 km" flexItem />
            <Preset label="25 km" flexItem />
            <Preset label="50 km" active color={violet} flexItem />
            <Preset label="100 km" flexItem />
            <Preset label="IDF" flexItem />
          </View>
          <View style={styles.geoloc}>
            <Globe size={12} color={violet} />
            <Text style={styles.geolocTxt}>
              Depuis <Text style={styles.geolocStrong}>Paris 12e</Text> · ta position actuelle
            </Text>
          </View>
        </FilterSection>

        {/* État */}
        <FilterSection icon={<Check size={15} color={colors.success} />} iconStyle={styles.fiCond} title="État du produit" current="2 sélectionnés" hasValue>
          <View style={styles.condChips}>
            <CondChip label="Neuf" />
            <CondChip label="Comme neuf" active />
            <CondChip label="Bon état" active />
            <CondChip label="Correct" />
            <CondChip label="Pour pièces" />
          </View>
        </FilterSection>

        {/* Compatibilité */}
        <FilterSection icon={<Bike size={15} color={pink} />} iconStyle={styles.fiBike} title="Compatible avec ma moto" current="MT-09 SP · 1 moto">
          <View style={styles.myBikeCard}>
            <View style={styles.myBikeIcon}>
              <Bike size={17} color={pink} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.myBikeLabel}>Ta moto</Text>
              <Text style={styles.myBikeName}>Yamaha MT-09 SP</Text>
            </View>
            <View style={styles.switch}>
              <View style={styles.knob} />
            </View>
          </View>
          <Text style={styles.otherBikesLabel}>Autres motos compatibles</Text>
          <Pressable style={styles.addBtn}>
            <Plus size={13} color={colors.inkDim} strokeWidth={2.4} />
            <Text style={styles.addBtnTxt}>Ajouter une moto</Text>
          </Pressable>
        </FilterSection>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={styles.applyBtn}>
          <Text style={styles.applyTxt}>
            Voir <Text style={styles.applyCount}>243</Text> résultats
          </Text>
          <ArrowRight size={15} color="#fff" strokeWidth={2.5} />
        </Pressable>
      </View>
    </Screen>
  );
}

function FilterSection({ icon, iconStyle, title, current, hasValue, children }: { icon: React.ReactNode; iconStyle: any; title: string; current: string; hasValue?: boolean; children: React.ReactNode }) {
  return (
    <View style={styles.filterSection}>
      <View style={styles.filterHead}>
        <View style={[styles.filterIcon, iconStyle]}>{icon}</View>
        <View style={{ flex: 1 }}>
          <Text style={styles.filterTitle}>{title}</Text>
          <Text style={[styles.filterCurrent, hasValue && { color: colors.neon, fontFamily: fonts.semibold }]}>{current}</Text>
        </View>
        <ChevronDown size={14} color={colors.inkMute} strokeWidth={2.4} />
      </View>
      <View style={styles.filterContent}>{children}</View>
    </View>
  );
}

function CatCard({ label, count, active }: { label: string; count: string; active?: boolean }) {
  return (
    <View style={[styles.catCard, active && styles.catCardActive]}>
      <View style={[styles.catCardIcon, active && { backgroundColor: 'rgba(77,143,255,0.15)' }]}>
        <Bike size={14} color={active ? colors.neon : colors.inkDim} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.catName}>{label}</Text>
        <Text style={styles.catCount}>{count}</Text>
      </View>
    </View>
  );
}

function Preset({ label, active, color, flexItem }: { label: string; active?: boolean; color?: string; flexItem?: boolean }) {
  return (
    <View style={[styles.preset, flexItem && { flex: 1 }, active && { backgroundColor: 'rgba(184,132,230,0.1)', borderColor: color }]}>
      <Text style={[styles.presetTxt, active && color ? { color } : null]}>{label}</Text>
    </View>
  );
}

function CondChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <View style={[styles.condChip, active && styles.condChipActive]}>
      {active ? <Check size={11} color={colors.success} strokeWidth={3} /> : null}
      <Text style={[styles.condTxt, active && { color: colors.success }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  reset: { fontFamily: fonts.semibold, fontSize: 12, color: colors.neon },
  navSub: { textAlign: 'center', fontFamily: fonts.regular, fontSize: 10, color: colors.inkMute, marginTop: -6, marginBottom: 6 },
  navSubNum: { fontFamily: fonts.monoBold, color: colors.neon },

  searchWrap: { paddingHorizontal: 16, paddingBottom: 12 },
  searchInput: { height: 44, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 13, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14 },
  searchTxt: { flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink, padding: 0 },
  searchClear: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' },

  activeFilters: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  activeChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingLeft: 11, paddingRight: 6, paddingVertical: 6, backgroundColor: 'rgba(77,143,255,0.1)', borderWidth: 1, borderColor: 'rgba(77,143,255,0.3)', borderRadius: 100 },
  activeChipTxt: { fontFamily: fonts.semibold, fontSize: 11.5, color: colors.neon },
  activeChipRemove: { width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(77,143,255,0.2)', alignItems: 'center', justifyContent: 'center' },

  filterSection: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 14, marginBottom: 10, overflow: 'hidden' },
  filterHead: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 13 },
  filterIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  fiCat: { backgroundColor: 'rgba(77,143,255,0.12)', borderColor: 'rgba(77,143,255,0.25)' },
  fiPrice: { backgroundColor: 'rgba(251,191,36,0.12)', borderColor: 'rgba(251,191,36,0.25)' },
  fiDist: { backgroundColor: 'rgba(184,132,230,0.12)', borderColor: 'rgba(184,132,230,0.25)' },
  fiCond: { backgroundColor: 'rgba(74,222,128,0.12)', borderColor: 'rgba(74,222,128,0.25)' },
  fiBike: { backgroundColor: 'rgba(255,92,122,0.12)', borderColor: 'rgba(255,92,122,0.25)' },
  filterTitle: { fontFamily: fonts.bold, fontSize: 13.5, color: colors.ink },
  filterCurrent: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkMute, marginTop: 1 },
  filterContent: { paddingHorizontal: 14, paddingBottom: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.line },

  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catCard: { width: '48.5%', flexDirection: 'row', alignItems: 'center', gap: 10, padding: 11, backgroundColor: colors.bg2, borderWidth: 1.5, borderColor: colors.line, borderRadius: 12 },
  catCardActive: { borderColor: colors.neon, backgroundColor: 'rgba(77,143,255,0.06)' },
  catCardIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#181C26', alignItems: 'center', justifyContent: 'center' },
  catName: { fontFamily: fonts.semibold, fontSize: 12, color: colors.ink },
  catCount: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.inkMute, marginTop: 1 },

  priceDisplay: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  priceLabel: { fontFamily: fonts.semibold, fontSize: 10, color: colors.inkMute, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 3 },
  priceValue: { fontFamily: fonts.monoBold, fontSize: 18, color: colors.ink },
  currency: { fontFamily: fonts.semibold, fontSize: 13, color: colors.inkDim },

  sliderTrack: { height: 28, justifyContent: 'center', marginBottom: 14 },
  track: { position: 'absolute', left: 0, right: 0, height: 4, backgroundColor: colors.line, borderRadius: 2 },
  fill: { position: 'absolute', height: 4, borderRadius: 2 },
  handle: { position: 'absolute', width: 22, height: 22, marginLeft: -11, backgroundColor: colors.ink, borderRadius: 11, borderWidth: 1.5 },

  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  distPresets: { flexDirection: 'row', gap: 5 },
  preset: { paddingHorizontal: 11, paddingVertical: 6, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 100, alignItems: 'center' },
  presetTxt: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkDim },

  distDisplay: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 6, marginBottom: 12, paddingVertical: 6 },
  distValue: { fontFamily: fonts.monoBold, fontSize: 28, color: violet },
  distUnit: { fontFamily: fonts.semibold, fontSize: 14, color: colors.inkDim },
  geoloc: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, paddingHorizontal: 11, paddingVertical: 8, backgroundColor: 'rgba(184,132,230,0.05)', borderWidth: 1, borderColor: 'rgba(184,132,230,0.18)', borderRadius: 10 },
  geolocTxt: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.inkDim },
  geolocStrong: { fontFamily: fonts.semibold, color: colors.ink },

  condChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  condChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 13, paddingVertical: 8, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.line, borderRadius: 100 },
  condChipActive: { backgroundColor: 'rgba(74,222,128,0.1)', borderColor: colors.success },
  condTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkDim },

  myBikeCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: colors.bg2, borderWidth: 1.5, borderColor: 'rgba(255,92,122,0.25)', borderRadius: 13, marginBottom: 10 },
  myBikeIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,92,122,0.12)', borderWidth: 1, borderColor: 'rgba(255,92,122,0.3)', alignItems: 'center', justifyContent: 'center' },
  myBikeLabel: { fontFamily: fonts.bold, fontSize: 9.5, color: colors.inkMute, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
  myBikeName: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  switch: { width: 42, height: 24, borderRadius: 12, backgroundColor: colors.line, padding: 2, justifyContent: 'center' },
  knob: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.inkMute },
  otherBikesLabel: { fontFamily: fonts.bold, fontSize: 10, color: colors.inkMute, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 10, borderWidth: 1.5, borderColor: colors.lineStrong, borderStyle: 'dashed', borderRadius: 12 },
  addBtnTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkDim },

  bottomBar: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, backgroundColor: 'rgba(8,9,14,0.97)', borderTopWidth: 1, borderTopColor: colors.line },
  applyBtn: { height: 52, borderRadius: 14, backgroundColor: colors.neon, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  applyTxt: { fontFamily: fonts.bold, fontSize: 14.5, color: '#fff' },
  applyCount: { fontFamily: fonts.monoBold },
});
