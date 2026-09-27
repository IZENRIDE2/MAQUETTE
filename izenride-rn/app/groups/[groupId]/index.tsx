import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import GroupeAccueilScreen from '@/screens/groups/GroupeAccueilScreen';
import type { GroupTab } from '@/screens/groups/routes';

export default function GroupRoute() {
  const { groupId, tab } = useLocalSearchParams<{ groupId: string; tab?: GroupTab }>();
  return <GroupeAccueilScreen key={`${groupId}-${tab ?? ''}`} groupId={groupId} initialTab={tab} />;
}
