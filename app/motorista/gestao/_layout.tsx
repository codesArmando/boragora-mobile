import { Stack } from 'expo-router';

// FND-07: recusar quem não é admin.

export default function GestaoLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
