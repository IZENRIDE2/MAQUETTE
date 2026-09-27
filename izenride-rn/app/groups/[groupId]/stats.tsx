import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import StatsScreen from '@/screens/pro/StatsScreen';

export default function StatsRoute() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  return <StatsScreen groupId={groupId} />;
}
