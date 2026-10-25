import { StyleSheet, Text } from 'react-native';

import { cores } from '@/theme/cores';

export type TipoSelo =
  'voce' | 'suaTurma' | 'cancelado' | 'liberado' | 'emAula' | 'vinculado' | 'semTurma';

const rotulos: Record<TipoSelo, string> = {
  voce: 'Você',
  suaTurma: 'Sua turma',
  cancelado: 'Cancelado',
  liberado: 'Liberado',
  emAula: 'Em aula',
  vinculado: 'Vinculado',
  semTurma: 'Sem turma',
};

export function Selo({ tipo, rotulo }: { tipo: TipoSelo; rotulo?: string }) {
  return (
    <Text
      style={[
        estilos.selo,
        tipo === 'liberado' && estilos.liberado,
        tipo === 'cancelado' && estilos.cancelado,
        tipo === 'semTurma' && estilos.semTurma,
      ]}
    >
      {rotulo ?? rotulos[tipo]}
    </Text>
  );
}

const estilos = StyleSheet.create({
  selo: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: cores.texto,
    backgroundColor: cores.borda,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '700',
  },
  liberado: { color: cores.liberadoTexto, backgroundColor: cores.liberadoFundo },
  cancelado: { color: cores.textoSobrePerigo, backgroundColor: cores.perigo },
  semTurma: {
    color: cores.textoSecundario,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: cores.bordaBotaoSecundario,
  },
});
