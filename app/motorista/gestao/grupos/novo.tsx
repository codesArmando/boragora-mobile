import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Cabecalho } from '@/components/Cabecalho';
import { FormularioGrupo } from '@/components/FormularioGrupo';
import { criarGrupo } from '@/repositories/grupoRepository';
import { cores } from '@/theme/cores';

// D2: novo grupo. Ao salvar, volta para a D8, que se atualiza sozinha ao ganhar o foco.
export default function NovoGrupo() {
  return (
    <SafeAreaView style={estilos.tela}>
      <Cabecalho titulo="Novo grupo" />
      <FormularioGrupo
        rotuloSalvar="Salvar grupo"
        onSalvar={async (requisicao) => {
          await criarGrupo(requisicao);
          router.back();
        }}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
});
