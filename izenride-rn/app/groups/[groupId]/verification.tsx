import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import DemandeBadgeScreen from '@/screens/pro/DemandeBadgeScreen';

export default function VerificationRoute() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  return <DemandeBadgeScreen groupId={groupId} />;
}
