import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import GererLeGroupeScreen from '@/screens/groups/GererLeGroupeScreen';

export default function ManageRoute() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  return <GererLeGroupeScreen groupId={groupId} />;
}
