import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { SessaoProvider } from '@/contexts/SessaoContext';

export default function RootLayout() {
  return (
    <SessaoProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </SessaoProvider>
  );
}
