import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors, bgGradient } from '@/theme';

type Props = {
  children: React.ReactNode;
  /** Active un ScrollView interne (défaut: true) */
  scroll?: boolean;
  /** Padding horizontal interne (défaut: 18) */
  pad?: number;
  /** Edges de la safe-area à respecter */
  edges?: Edge[];
  contentStyle?: ViewStyle;
  style?: ViewStyle;
};

/**
 * Conteneur d'écran : fond dégradé ultra-dark + safe area.
 * Toutes les pages IzenRide partent de ce composant.
 */
export default function Screen({
  children,
  scroll = true,
  pad = 18,
  edges = ['top', 'bottom'],
  contentStyle,
  style,
}: Props) {
  return (
    <View style={[styles.root, style]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={bgGradient.colors}
        start={bgGradient.start}
        end={bgGradient.end}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe} edges={edges}>
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[{ paddingHorizontal: pad, paddingBottom: 32 }, contentStyle]}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex, { paddingHorizontal: pad }, contentStyle]}>{children}</View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1 },
  flex: { flex: 1 },
});
