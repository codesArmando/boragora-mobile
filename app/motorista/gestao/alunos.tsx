import { useCallback, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { LinhaPessoa } from '@/components/LinhaPessoa';
import { Selo } from '@/components/Selo';
import type { AlunoAdmin } from '@/types/consulta';
import { TelaDados } from '@/components/TelaDados';
import { listarAlunosAdmin } from '@/repositories/gestaoConsultaRepository';
import { cores } from '@/theme/cores';

export default function AlunosAdmin() {
  const [busca, setBusca] = useState('');
  const carregar = useCallback(() => listarAlunosAdmin(), []);
  return (
    <TelaDados
      carregar={carregar}
      titulo="Alunos"
      subtitulo="Somente consulta. Os alunos criam a própria conta, e o vínculo é feito dentro de cada turma."
      vazio={(alunos) => alunos.length === 0}
      mensagemVazia="Nenhum aluno cadastrado."
      renderizar={(alunos) => <ListaAlunos alunos={alunos} busca={busca} setBusca={setBusca} />}
    />
  );
}

function ListaAlunos({
  alunos,
  busca,
  setBusca,
}: {
  alunos: AlunoAdmin[];
  busca: string;
  setBusca: Dispatch<SetStateAction<string>>;
}) {
  const filtrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase();
    return alunos.filter((aluno) =>
      `${aluno.nome} ${aluno.email}`.toLocaleLowerCase().includes(termo),
    );
  }, [alunos, busca]);
  return (
    <View>
      <TextInput
        value={busca}
        onChangeText={setBusca}
        placeholder="Buscar por nome ou e-mail"
        placeholderTextColor={cores.textoApagado}
        style={estilos.busca}
        accessibilityLabel="Buscar aluno por nome ou e-mail"
      />
      <View style={estilos.cabecalho}>
        <Text style={estilos.total}>{filtrados.length} ALUNOS CADASTRADOS</Text>
      </View>
      {filtrados.map((aluno) => (
        <View key={aluno.id} style={estilos.linha}>
          <LinhaPessoa nome={aluno.nome} email={aluno.email} mostrarIniciais={false} />
          <Selo tipo={aluno.turmas.length > 0 ? 'vinculado' : 'semTurma'} />
        </View>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  busca: {
    minHeight: 54,
    marginTop: 10,
    paddingHorizontal: 16,
    color: cores.texto,
    backgroundColor: cores.superficie,
    borderWidth: 1.5,
    borderColor: cores.borda,
    borderRadius: 12,
    fontSize: 16,
  },
  cabecalho: { marginTop: 16, marginBottom: 4 },
  total: { color: cores.textoApagado, fontSize: 14, fontWeight: '700' },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
