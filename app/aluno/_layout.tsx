import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';

import { iconeAba, opcoesAbas } from '@/components/opcoesAbas';
import { useSessao } from '@/contexts/SessaoContext';

// Abas do aluno: Hoje, Grupo e Conta. Quem não é aluno volta ao índice, que redireciona.
export default function AlunoLayout() {
  const { usuario, restaurando } = useSessao();

  if (restaurando) {
    return null;
  }
  if (usuario?.papel !== 'ALUNO') {
    return <Redirect href="/" />;
  }

  return (
    <Tabs screenOptions={opcoesAbas}>
      <Tabs.Screen name="hoje" options={{ title: 'Hoje', tabBarIcon: iconeAba('calendar') }} />
      <Tabs.Screen name="grupo" options={{ title: 'Grupo', tabBarIcon: iconeAba('users') }} />
      <Tabs.Screen name="conta" options={{ title: 'Conta', tabBarIcon: iconeAba('user') }} />
    </Tabs>
  );
}
