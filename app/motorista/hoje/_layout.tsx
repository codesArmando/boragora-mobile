import { Stack } from 'expo-router';

// Ao abrir uma tela pela notificação, voltar leva à tela inicial da aba (seção 2.2 do plano).
export const unstable_settings = { initialRouteName: 'index' };

export default function HojeMotoristaLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
