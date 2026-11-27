import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { ListaDoGrupo } from '@/components/ListaDoGrupo';
import { TelaDados } from '@/components/TelaDados';
import { buscarGrupoHojeAluno } from '@/repositories/turmaRepository';

export default function GrupoAluno() {
  const { grupoId } = useLocalSearchParams<{ grupoId: string }>();
  const id = Number(grupoId);
  const carregar = useCallback(() => buscarGrupoHojeAluno(id), [id]);
  return (
    <TelaDados
      voltar
      carregar={carregar}
      titulo=""
      subtitulo=""
      renderizar={(grupo) => <ListaDoGrupo grupo={grupo} papel="aluno" />}
    />
  );
}
