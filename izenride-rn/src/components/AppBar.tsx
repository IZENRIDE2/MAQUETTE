import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { colors, fonts } from '@/theme';

type Props = {
  title?: string;
  /** Affiche la flèche retour (défaut: true) */
  back?: boolean;
  right?: React.ReactNode;
  onBack?: () => void;
};

/** Barre de navigation supérieure : retour + titre + action droite. */
export default function AppBar({ title, back = true, right, onBack }: Props) {
  const router = useRouter();
  const handleBack = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));
  return (
    <View style={styles.bar}>
      {back ? (
        <Pressable onPress={handleBack} style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}>
          <ChevronLeft size={22} color={colors.ink} />
        </Pressable>
      ) : (
        <View style={styles.iconBtn} />
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>{right ?? <View style={styles.iconBtn} />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  title: { flex: 1, textAlign: 'center', fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  right: { minWidth: 40, alignItems: 'flex-end' },
});
