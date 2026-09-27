import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import SuggestionScreen from '@/screens/groups/SuggestionScreen';

export default function SuggestionRoute() {
  const { groupId, suggestionId } = useLocalSearchParams<{ groupId: string; suggestionId: string }>();
  return <SuggestionScreen groupId={groupId} suggestionId={suggestionId} />;
}
