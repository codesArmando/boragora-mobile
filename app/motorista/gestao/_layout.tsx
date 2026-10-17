import { Redirect, Stack } from 'expo-router';

import { useSessao } from '@/contexts/SessaoContext';

// A gestão é só do motorista-chefe. A aba já fica escondida para os demais; esta guarda
// recusa quem chega por um link direto. O backend também recusa (403) nas rotas /admin.
export default function GestaoLayout() {
  const { usuario } = useSessao();

  if (!usuario?.admin) {
    return <Redirect href="/motorista/hoje" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
