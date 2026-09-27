import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import EditeurDeRoleScreen from '@/screens/groups/EditeurDeRoleScreen';

export default function RoleRoute() {
  const { groupId, roleId } = useLocalSearchParams<{ groupId: string; roleId: string }>();
  return <EditeurDeRoleScreen key={roleId} groupId={groupId} roleId={roleId} />;
}
