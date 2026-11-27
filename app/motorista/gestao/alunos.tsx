import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CampoBusca } from '@/components/CampoBusca';
import { LinhaPessoa } from '@/components/LinhaPessoa';
import { Selo } from '@/components/Selo';
import { TelaDados } from '@/components/TelaDados';
import { listarAlunosAdmin } from '@/repositories/gestaoConsultaRepository';
import { mocksAtivos } from '@/repositories/mocks/mocksAtivos';
import type { AlunoAdmin } from '@/types/consulta';
import { cores } from '@/theme/cores';
import { tipografia } from '@/theme/tipografia';

export default function AlunosAdmin() {
  const [busca, setBusca] = useState('');
  const carregar = useCallback(() => listarAlunosAdmin(), []);
  return (
    <TelaDados
      voltar
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
  const [resultadosMock, setResultadosMock] = useState<AlunoAdmin[]>(alunos);
  const filtrados = useMemo(() => {
    if (mocksAtivos.e5) return resultadosMock;
    const termo = busca.trim().toLocaleLowerCase('pt-BR');
    return alunos.filter((aluno) =>
      `${aluno.nome} ${aluno.email}`.toLocaleLowerCase('pt-BR').includes(termo),
    );
  }, [alunos, busca, resultadosMock]);

  useEffect(() => {
    if (!mocksAtivos.e5) return;
    const temporizador = setTimeout(() => {
      void listarAlunosAdmin(busca).then(setResultadosMock);
    }, 250);
    return () => clearTimeout(temporizador);
  }, [busca]);

  return (
    <View>
      <CampoBusca value={busca} onChangeText={setBusca} />
      <View style={estilos.cabecalho}>
        <Text style={estilos.total}>{filtrados.length} ALUNOS CADASTRADOS</Text>
      </View>
      {filtrados.map((aluno) => (
        <View key={aluno.id} style={estilos.linha}>
          {/* flex: 1 limita a linha ao espaço que sobra; sem isso o selo saía da tela. */}
          <View style={estilos.pessoa}>
            <LinhaPessoa nome={aluno.nome} email={aluno.email} mostrarIniciais={false} />
          </View>
          <Selo tipo={aluno.turmas.length > 0 ? 'vinculado' : 'semTurma'} />
        </View>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  cabecalho: { marginTop: 16, marginBottom: 4 },
  total: { fontFamily: tipografia.texto.negrito, color: cores.textoApagado, fontSize: 14 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pessoa: { flex: 1 },
});
