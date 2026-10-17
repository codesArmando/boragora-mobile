import { Redirect, Stack } from 'expo-router';

import { useSessao } from '@/contexts/SessaoContext';

// A1 e A2 só para quem não tem sessão. Depois de entrar ou cadastrar, o índice
// redireciona conforme o papel (FND-07).
export default function AuthLayout() {
  const { usuario } = useSessao();

  if (usuario !== null) {
    return <Redirect href="/" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
