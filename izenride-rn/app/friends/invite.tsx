import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import InviterUnAmiScreen from '@/screens/friends/InviterUnAmiScreen';

export default function InviteFriendRoute() {
  const { group } = useLocalSearchParams<{ group?: string }>();
  return <InviterUnAmiScreen presetGroupId={group} />;
}
