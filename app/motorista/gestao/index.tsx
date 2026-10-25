import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CartaoAtalho } from '@/components/CartaoAtalho';
import { TelaDados } from '@/components/TelaDados';

export default function Gestao() {
  return (
    <TelaDados
      carregar={async () => true}
      recarregarAoFocar={false}
      titulo="Gestão"
      subtitulo="Cadastros e vínculos do sistema."
      renderizar={() => (
        <View style={estilos.lista}>
          <CartaoAtalho
            titulo="Grupos"
            detalhe="Turnos e horários de saída"
            icone="◷"
            onPress={() => router.push('/motorista/gestao/grupos')}
          />
          <CartaoAtalho
            titulo="Turmas"
            detalhe="Van, motorista e alunos de cada grupo"
            icone="▣"
            onPress={() => router.push('/motorista/gestao/turmas')}
          />
          <CartaoAtalho
            titulo="Motoristas"
            detalhe="Contas de motorista"
            icone="♙"
            onPress={() => router.push('/motorista/gestao/motoristas')}
          />
          <CartaoAtalho
            titulo="Alunos"
            detalhe="Contas criadas e vínculo com turmas"
            icone="♧"
            onPress={() => router.push('/motorista/gestao/alunos')}
          />
        </View>
      )}
    />
  );
}

const estilos = StyleSheet.create({
  lista: { gap: 12 },
});
