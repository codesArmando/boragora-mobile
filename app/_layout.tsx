import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { SessaoProvider } from '@/contexts/SessaoContext';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontesCarregadas, erroFontes] = useFonts({
    Barlow_400Regular: require('../assets/fonts/Barlow_400Regular.ttf'),
    Barlow_500Medium: require('../assets/fonts/Barlow_500Medium.ttf'),
    Barlow_600SemiBold: require('../assets/fonts/Barlow_600SemiBold.ttf'),
    Barlow_700Bold: require('../assets/fonts/Barlow_700Bold.ttf'),
    Saira_700Bold: require('../assets/fonts/Saira_700Bold.ttf'),
    Saira_700Bold_Italic: require('../assets/fonts/Saira_700Bold_Italic.ttf'),
    Saira_800ExtraBold_Italic: require('../assets/fonts/Saira_800ExtraBold_Italic.ttf'),
  });

  useEffect(() => {
    if (fontesCarregadas || erroFontes) void SplashScreen.hideAsync();
  }, [fontesCarregadas, erroFontes]);

  if (!fontesCarregadas && !erroFontes) return null;

  return (
    <SessaoProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </SessaoProvider>
  );
}
