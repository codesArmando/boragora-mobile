import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { TelaDados } from '@/components/TelaDados';
import { listarTurmasAdmin } from '@/repositories/gestaoConsultaRepository';
import { cores } from '@/theme/cores';

export default function Turmas() {
  const carregar = useCallback(() => listarTurmasAdmin(), []);
  return (
    <TelaDados
      carregar={carregar}
      titulo="Turmas"
      subtitulo="Cadastro das turmas da equipe."
      vazio={(turmas) => turmas.length === 0}
      mensagemVazia="Nenhuma turma cadastrada."
      renderizar={(turmas) => (
        <View style={estilos.lista}>
          {turmas.map((turma) => (
            <Cartao key={turma.id}>
              <Text style={estilos.nome}>
                {turma.grupo.nome} · {turma.nome}
              </Text>
              <Text style={estilos.detalhe}>Motorista · {turma.motorista.nome}</Text>
              <Text style={estilos.detalhe}>{turma.totalAlunos} alunos</Text>
            </Cartao>
          ))}
        </View>
      )}
    />
  );
}

const estilos = StyleSheet.create({
  lista: { gap: 12 },
  nome: { color: cores.texto, fontSize: 22, fontWeight: '700' },
  detalhe: { color: cores.textoSecundario, fontSize: 16 },
});
