import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { REGISTRY } from '@/screens/registry';
import { Screen, AppBar } from '@/components';
import { colors, fonts } from '@/theme';

/** Route dynamique : rend l'écran correspondant à l'id du registre. */
export default function ScreenById() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const Comp = id ? REGISTRY[id] : undefined;

  if (!Comp) {
    return (
      <Screen>
        <AppBar title="Introuvable" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 80 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.ink }}>Écran #{id} introuvable</Text>
        </View>
      </Screen>
    );
  }
  return <Comp />;
}
