import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import JournalScreen from '@/screens/pro/JournalScreen';

export default function JournalRoute() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  return <JournalScreen groupId={groupId} />;
}
