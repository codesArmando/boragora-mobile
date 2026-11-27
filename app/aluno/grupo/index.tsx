import { useCallback } from 'react';

import { ListaMeusGrupos } from '@/components/ListaMeusGrupos';
import { TelaDados } from '@/components/TelaDados';
import { listarGrupos } from '@/repositories/grupoRepository';

export default function GruposAluno() {
  const carregar = useCallback(() => listarGrupos(), []);
  return (
    <TelaDados
      carregar={carregar}
      titulo="Grupos"
      subtitulo="Veja quem vai e quem volta em cada grupo. Aqui é só consulta."
      vazio={(grupos) => grupos.length === 0}
      mensagemVazia="Você ainda não está em nenhum grupo"
      renderizar={(grupos) => <ListaMeusGrupos grupos={grupos} papel="aluno" />}
    />
  );
}
