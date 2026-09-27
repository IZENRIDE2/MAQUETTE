import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ProposerScreen from '@/screens/groups/ProposerScreen';
import type { SuggestionType } from '@/api/types';

export default function ProposeRoute() {
  const { groupId, type, suggestion } = useLocalSearchParams<{ groupId: string; type: SuggestionType; suggestion?: string }>();
  return <ProposerScreen key={`${type}-${suggestion ?? ''}`} groupId={groupId} type={type} suggestionId={suggestion} />;
}
