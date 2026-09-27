import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import OnboardingInviteScreen from '@/screens/friends/OnboardingInviteScreen';

/** Onboarding de l'ami invité (après inscription / rattachement). */
export default function WelcomeRoute() {
  const { step } = useLocalSearchParams<{ step?: 'groupes' }>();
  return <OnboardingInviteScreen key={step ?? 'accueil'} step={step === 'groupes' ? 'groupes' : 'accueil'} />;
}
