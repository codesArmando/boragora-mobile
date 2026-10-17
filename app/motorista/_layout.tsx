import { Redirect, useSegments } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';

import { iconeAba, opcoesAbas } from '@/components/opcoesAbas';
import { useSessao } from '@/contexts/SessaoContext';

// Abas do motorista: Hoje, Grupo e Conta. O chefe (MOTORISTA com `admin`) usa as mesmas
// rotas e ganha a aba Gestão (decisão 4 do plano). Quem não é motorista volta ao índice.
export default function MotoristaLayout() {
  const { usuario, restaurando } = useSessao();
  const segmentos = useSegments().filter((segmento) => segmento !== 'index');

  if (restaurando) {
    return null;
  }
  if (usuario?.papel !== 'MOTORISTA') {
    return <Redirect href="/" />;
  }

  // As listas da gestão (D1, D3, D8, D9 e D10) ficam em até dois níveis abaixo de
  // `motorista/`; os formulários (D2, D2b, D4, D5a, D6 e D7) e a D5 ficam mais fundo
  // e escondem a barra, como no protótipo.
  const formularioDaGestao = segmentos[1] === 'gestao' && segmentos.length >= 4;

  return (
    <Tabs screenOptions={opcoesAbas}>
      <Tabs.Screen name="hoje" options={{ title: 'Hoje', tabBarIcon: iconeAba('calendar') }} />
      <Tabs.Screen name="grupo" options={{ title: 'Grupo', tabBarIcon: iconeAba('users') }} />
      <Tabs.Screen
        name="gestao"
        options={{
          title: 'Gestão',
          tabBarIcon: iconeAba('sliders'),
          href: usuario.admin ? undefined : null,
          tabBarStyle: formularioDaGestao ? { display: 'none' } : opcoesAbas.tabBarStyle,
        }}
      />
      <Tabs.Screen name="conta" options={{ title: 'Conta', tabBarIcon: iconeAba('user') }} />
    </Tabs>
  );
}
