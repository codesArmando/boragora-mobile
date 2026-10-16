import { Tabs } from 'expo-router/js-tabs';

import { cores } from '@/theme/cores';

// Abas mínimas do esqueleto (FND-01). A FND-07 acrescenta ícones, a guarda por papel
// e esconde a barra nos formulários da gestão.
export default function AlunoLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: cores.fundo, borderTopColor: cores.borda },
        tabBarActiveTintColor: cores.destaque,
        tabBarInactiveTintColor: cores.textoApagado,
      }}
    >
      <Tabs.Screen name="hoje" options={{ title: 'Hoje' }} />
      <Tabs.Screen name="grupo" options={{ title: 'Grupo' }} />
      <Tabs.Screen name="conta" options={{ title: 'Conta' }} />
    </Tabs>
  );
}
