import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ConversationDirecteScreen from '@/screens/friends/ConversationDirecteScreen';

export default function DirectMessageRoute() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  return <ConversationDirecteScreen key={userId} userId={userId} />;
}
