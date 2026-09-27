import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import SortieProScreen from '@/screens/pro/SortieProScreen';

export default function PublicRideRoute() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>();
  return <SortieProScreen rideId={rideId} />;
}
