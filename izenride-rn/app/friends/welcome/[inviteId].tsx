import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import BienvenueAmiScreen from '@/screens/friends/BienvenueAmiScreen';

export default function WelcomeFriendRoute() {
  const { inviteId } = useLocalSearchParams<{ inviteId: string }>();
  return <BienvenueAmiScreen inviteId={inviteId} />;
}
