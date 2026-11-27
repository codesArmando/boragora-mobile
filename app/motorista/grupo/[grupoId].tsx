import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { ListaDoGrupo } from '@/components/ListaDoGrupo';
import { TelaDados } from '@/components/TelaDados';
import { buscarGrupoHoje } from '@/repositories/turmaRepository';

export default function GrupoMotorista() {
  const { grupoId } = useLocalSearchParams<{ grupoId: string }>();
  const id = Number(grupoId);
  const carregar = useCallback(() => buscarGrupoHoje(id), [id]);

  return (
    <TelaDados
      carregar={carregar}
      titulo=""
      renderizar={(grupo) => <ListaDoGrupo grupo={grupo} papel="motorista" />}
    />
  );
}
