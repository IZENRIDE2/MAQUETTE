import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import RolesDuGroupeScreen from '@/screens/groups/RolesDuGroupeScreen';

export default function RolesRoute() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  return <RolesDuGroupeScreen groupId={groupId} />;
}
