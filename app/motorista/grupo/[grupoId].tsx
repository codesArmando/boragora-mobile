import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BlocoHorarios } from '@/components/BlocoHorarios';
import { Cartao } from '@/components/Cartao';
import { Contadores } from '@/components/Contadores';
import { LinhaAluno } from '@/components/LinhaAluno';
import { Selo } from '@/components/Selo';
import { TelaDados } from '@/components/TelaDados';
import { buscarGrupoHoje } from '@/repositories/turmaRepository';
import { cores } from '@/theme/cores';

export default function GrupoMotorista() {
  const { grupoId } = useLocalSearchParams<{ grupoId: string }>();
  const id = Number(grupoId);
  const carregar = useCallback(() => buscarGrupoHoje(id), [id]);

  return (
    <TelaDados
      carregar={carregar}
      titulo="Grupo"
      subtitulo="Acompanhe a presença de hoje nas turmas."
      renderizar={(grupo) => (
        <View style={estilos.lista}>
          <Text style={estilos.nome}>{grupo.nome}</Text>
          <BlocoHorarios
            horarioSaidaIda={grupo.horarioSaidaIda}
            horarioSaidaVolta={grupo.horarioSaidaVolta}
          />
          {grupo.turmas.map((turma) => (
            <Cartao key={turma.id}>
              <View style={estilos.cabecalho}>
                <Text style={estilos.nomeTurma}>{turma.nome}</Text>
                {turma.minhaTurma && <Selo tipo="suaTurma" />}
              </View>
              <Contadores {...turma.contadores} />
              {turma.minhaTurma && (
                <View style={estilos.alunos}>
                  <Text style={estilos.rotulo}>ALUNOS DA SUA TURMA</Text>
                  {['Beatriz Souza', 'Camila Rocha', 'João Gabriel'].map((nome) => (
                    <LinhaAluno key={nome} nome={nome} />
                  ))}
                </View>
              )}
            </Cartao>
          ))}
        </View>
      )}
    />
  );
}

const estilos = StyleSheet.create({
  lista: { gap: 12 },
  nome: { color: cores.texto, fontSize: 26, fontWeight: '800', fontStyle: 'italic' },
  nomeTurma: { color: cores.texto, fontSize: 22, fontWeight: '700' },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  alunos: { gap: 4 },
  rotulo: { color: cores.textoApagado, fontSize: 13, fontWeight: '700' },
});
