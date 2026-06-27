import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Map, Heart, MessageCircle, Calendar, User, ShoppingBag } from 'lucide-react-native';
import { colors, fonts } from '@/theme';

const TABS = [
  { key: 'map', label: 'Map', id: '016', Icon: Map },
  { key: 'match', label: 'Match', id: '024', Icon: Heart },
  { key: 'messages', label: 'Messages', id: '035', Icon: MessageCircle },
  { key: 'agenda', label: 'Agenda', id: '040', Icon: Calendar },
  { key: 'profil', label: 'Profil', id: '057', Icon: User },
  { key: 'shop', label: 'Shop', id: '047', Icon: ShoppingBag },
] as const;

/** Barre d'onglets principale (6 sections). `active` = clé de l'onglet courant. */
export default function BottomTabBar({ active }: { active?: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {TABS.map(({ key, label, id, Icon }) => {
        const on = key === active;
        return (
          <Pressable key={key} onPress={() => router.push(`/s/${id}`)} style={styles.tab}>
            <Icon size={22} color={on ? colors.neonBright : colors.inkMute} />
            <Text style={[styles.lbl, { color: on ? colors.neonBright : colors.inkMute }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10,14,21,0.96)',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 10,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  lbl: { fontFamily: fonts.medium, fontSize: 10 },
});
