import { Stack } from 'expo-router';

// Ao abrir um grupo por link direto, voltar leva à lista de grupos da aba.
export const unstable_settings = { initialRouteName: 'index' };

export default function GrupoAlunoLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
