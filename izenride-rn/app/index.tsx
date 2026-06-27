import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, ChevronRight } from 'lucide-react-native';
import { Screen, Logo, Panel } from '@/components';
import { colors, fonts, radius } from '@/theme';
import { SCREENS, CATEGORIES } from '@/screens/manifest';

export default function Catalog() {
  const router = useRouter();
  const [q, setQ] = useState('');

  const sections = useMemo(() => {
    const query = q.trim().toLowerCase();
    return CATEGORIES.map((cat) => ({
      ...cat,
      items: SCREENS.filter(
        (s) => s.catKey === cat.key && (!query || s.title.toLowerCase().includes(query)),
      ),
    })).filter((c) => c.items.length > 0);
  }, [q]);

  return (
    <Screen scroll={false} edges={['top']}>
      {/* Header marque */}
      <View style={styles.header}>
        <Logo size={48} />
        <View style={{ flex: 1 }}>
          <Text style={styles.brand}>IzenRide</Text>
          <Text style={styles.sub}>{SCREENS.length} écrans · Paris</Text>
        </View>
      </View>

      {/* Recherche */}
      <Panel pad={0} style={styles.searchWrap} accent="rgba(77,143,255,0.25)">
        <Search size={18} color={colors.inkMute} style={{ marginLeft: 14 }} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Rechercher un écran…"
          placeholderTextColor={colors.inkMute}
          style={styles.search}
        />
      </Panel>

      <FlatList
        data={sections}
        keyExtractor={(s) => s.key}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: cat }) => (
          <View style={{ marginBottom: 18 }}>
            <Text style={styles.catLabel}>
              {cat.label} <Text style={styles.catCount}>· {cat.items.length}</Text>
            </Text>
            <Panel pad={4}>
              {cat.items.map((s, idx) => (
                <Pressable
                  key={s.id}
                  onPress={() => router.push(`/s/${s.id}`)}
                  style={({ pressed }) => [
                    styles.row,
                    idx > 0 && styles.rowBorder,
                    pressed && { backgroundColor: 'rgba(255,255,255,0.04)' },
                  ]}
                >
                  <Text style={styles.rowId}>{s.id}</Text>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {s.title}
                  </Text>
                  <ChevronRight size={18} color={colors.inkMute} />
                </Pressable>
              ))}
            </Panel>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 8, paddingBottom: 14 },
  brand: { fontFamily: fonts.bold, fontSize: 26, color: colors.ink, letterSpacing: -0.5 },
  sub: { fontFamily: fonts.mono, fontSize: 12, color: colors.neonBright, marginTop: 2 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, borderRadius: radius.lg },
  search: { flex: 1, paddingVertical: 14, paddingHorizontal: 10, fontFamily: fonts.regular, fontSize: 15, color: colors.ink },
  catLabel: { fontFamily: fonts.monoBold, fontSize: 12, color: colors.inkDim, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8, marginLeft: 4 },
  catCount: { color: colors.neonBright },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 12, borderRadius: radius.md },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  rowId: { fontFamily: fonts.monoBold, fontSize: 12, color: colors.neon, width: 30 },
  rowTitle: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
});
