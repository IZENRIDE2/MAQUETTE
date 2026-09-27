import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import MesSuggestionsScreen from '@/screens/groups/MesSuggestionsScreen';

export default function MineRoute() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  return <MesSuggestionsScreen groupId={groupId} />;
}
