import { useCallback } from 'react';
import { View } from 'react-native';

import { ListaMeusGrupos } from '@/components/ListaMeusGrupos';
import { TelaDados } from '@/components/TelaDados';
import { listarGrupos } from '@/repositories/grupoRepository';
import { cores } from '@/theme/cores';

export default function GruposMotorista() {
  const carregar = useCallback(() => listarGrupos(), []);
  return (
    <View style={estilos.tela}>
      <TelaDados
        carregar={carregar}
        titulo="Grupos"
        subtitulo="Acompanhe as outras turmas dos grupos em que você atua."
        vazio={(grupos) => grupos.length === 0}
        renderizar={(grupos) => <ListaMeusGrupos grupos={grupos} papel="motorista" />}
      />
    </View>
  );
}

const estilos = { tela: { flex: 1, backgroundColor: cores.fundo } };
