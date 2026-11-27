import { api } from '@/api/api';
import { planosDoDiaMock, turmasDoAlunoMock } from '@/repositories/mocks/plano';
import type { PlanoDoDia, StatusVolta, TurmaDoAluno, TurmaDoAlunoResposta } from '@/types/plano';

// A etapa E6 do backend está concluída; os dados falsos ficam só para testes sem a API.
const USAR_MOCKS = false;

export async function listarMinhasTurmas(): Promise<TurmaDoAluno[]> {
  if (USAR_MOCKS) return turmasDoAlunoMock;
  const resposta = await api.get<TurmaDoAlunoResposta[]>('/aluno/turmas');
  return resposta.map(({ turma, motorista, incluiIda, incluiVolta }) => ({
    ...turma,
    motorista,
    incluiIda,
    incluiVolta,
  }));
}

export async function buscarPlano(turmaId: number): Promise<PlanoDoDia> {
  if (USAR_MOCKS) {
    const plano = planosDoDiaMock.find((item) => item.turma.id === turmaId);
    if (!plano) throw new Error('Plano da turma não encontrado.');
    return plano;
  }
  return api.get<PlanoDoDia>(`/aluno/turmas/${turmaId}/plano`);
}

export async function alterarIda(turmaId: number, incluir: boolean): Promise<PlanoDoDia> {
  if (USAR_MOCKS)
    return atualizarMock(turmaId, (plano) => ({
      ...plano,
      incluiIda: incluir,
      cancelouAposSaida: !incluir && plano.idaSaiu && plano.incluiIda,
      acoes:
        !incluir && plano.idaSaiu
          ? {
              ...plano.acoes,
              podeCancelarIda: false,
              podeIncluirIda: false,
              cancelamentoIdaSeraTardio: false,
            }
          : plano.acoes,
    }));
  return api.put<PlanoDoDia>(`/aluno/turmas/${turmaId}/plano/ida`, { incluir });
}

export async function alterarVolta(turmaId: number, incluir: boolean): Promise<PlanoDoDia> {
  if (USAR_MOCKS) {
    return atualizarMock(turmaId, (plano) => ({
      ...plano,
      incluiVolta: incluir,
      statusVolta: incluir ? plano.statusVolta : 'EM_AULA',
    }));
  }
  return api.put<PlanoDoDia>(`/aluno/turmas/${turmaId}/plano/volta`, { incluir });
}

export async function alterarStatusVolta(
  turmaId: number,
  status: StatusVolta,
): Promise<PlanoDoDia> {
  if (USAR_MOCKS) return atualizarMock(turmaId, (plano) => ({ ...plano, statusVolta: status }));
  return api.put<PlanoDoDia>(`/aluno/turmas/${turmaId}/plano/status-volta`, { status });
}

function atualizarMock(turmaId: number, alterar: (plano: PlanoDoDia) => PlanoDoDia) {
  const indice = planosDoDiaMock.findIndex((item) => item.turma.id === turmaId);
  if (indice < 0) throw new Error('Plano da turma não encontrado.');
  const atualizado = alterar(planosDoDiaMock[indice]);
  planosDoDiaMock[indice] = atualizado;
  const resumo = turmasDoAlunoMock.find((item) => item.id === turmaId);
  if (resumo) {
    resumo.incluiIda = atualizado.incluiIda;
    resumo.incluiVolta = atualizado.incluiVolta;
  }
  return Promise.resolve(atualizado);
}
