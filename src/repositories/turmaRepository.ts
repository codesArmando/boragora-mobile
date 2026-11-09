import { api } from '@/api/api';
import { buscarGrupo } from '@/repositories/grupoRepository';
import {
  atraso,
  conferirConflitoDeMotorista,
  motoristas,
  novoIdTurma,
  turmaPorId,
  turmas,
} from '@/repositories/mocks/gestao';
import { mocksAtivos } from '@/repositories/mocks/mocksAtivos';
import {
  turmaDetalheMock,
  turmaListaHojeMock,
  turmasGrupoHojeMock,
  turmasHojeMock,
} from '@/repositories/mocks/turmas';
import type {
  GrupoHoje,
  TurmaCriacaoRequisicao,
  TurmaDetalhe,
  TurmaEdicaoRequisicao,
  TurmaListaHoje,
  TurmaResumo,
} from '@/types/turma';

const USAR_MOCKS_TURMAS = true;
const USAR_MOCKS_GRUPO_HOJE = true;
const USAR_MOCKS_DETALHE_TURMA = true;

export async function listarTurmasDoMotorista(): Promise<TurmaResumo[]> {
  if (USAR_MOCKS_TURMAS) return turmasHojeMock;
  return api.get<TurmaResumo[]>('/motorista/turmas');
}

export async function buscarTurmaHoje(id: number): Promise<TurmaListaHoje> {
  if (USAR_MOCKS_TURMAS) return { ...turmaListaHojeMock, id };
  return api.get<TurmaListaHoje>(`/turmas/${id}/hoje`);
}

export async function buscarDetalheTurma(id: number): Promise<TurmaDetalhe> {
  if (USAR_MOCKS_DETALHE_TURMA) return { ...turmaDetalheMock, id };
  return api.get<TurmaDetalhe>(`/turmas/${id}`);
}

export async function buscarGrupoHoje(id: number): Promise<GrupoHoje> {
  if (USAR_MOCKS_GRUPO_HOJE) {
    const grupo = turmasGrupoHojeMock.find((item) => item.id === id);
    if (!grupo) throw new Error('Grupo não encontrado.');
    return grupo;
  }
  return api.get<GrupoHoje>(`/grupos/${id}/hoje`);
}

// Gestão de turmas pelo motorista-chefe (etapa 4 do backend): telas D4, D5, D5a e D6.
// Com `mocksAtivos.e4`, usa os dados falsos em memória de `mocks/gestao.ts`, para que o que uma
// tela cria ou altera apareça nas outras.

function motoristaDoMock(id: number) {
  const motorista = motoristas.find((m) => m.id === id);
  return { id, nome: motorista?.nome ?? 'Motorista' };
}

export function buscarTurma(id: number): Promise<TurmaDetalhe> {
  if (mocksAtivos.e4) {
    try {
      return atraso(turmaPorId(id));
    } catch (e) {
      return Promise.reject(e);
    }
  }
  return api.get<TurmaDetalhe>(`/turmas/${id}`);
}

export async function criarTurma(requisicao: TurmaCriacaoRequisicao): Promise<TurmaDetalhe> {
  if (mocksAtivos.e4) {
    // O grupo é o real (etapa 3); só a turma é falsa.
    const grupo = await buscarGrupo(requisicao.grupoId);
    conferirConflitoDeMotorista(grupo.id, requisicao.motoristaId);
    const turma: TurmaDetalhe = {
      id: novoIdTurma(),
      nome: requisicao.nome,
      numeroVan: requisicao.numeroVan,
      capacidade: requisicao.capacidade,
      grupo: {
        id: grupo.id,
        nome: grupo.nome,
        horarioSaidaIda: grupo.horarioSaidaIda,
        horarioSaidaVolta: grupo.horarioSaidaVolta,
      },
      motorista: motoristaDoMock(requisicao.motoristaId),
      alunos: [],
    };
    turmas.push(turma);
    return atraso(turma);
  }
  return api.post<TurmaDetalhe>('/admin/turmas', requisicao);
}

export function atualizarTurma(
  id: number,
  requisicao: TurmaEdicaoRequisicao,
): Promise<TurmaDetalhe> {
  if (mocksAtivos.e4) {
    try {
      const turma = turmaPorId(id);
      conferirConflitoDeMotorista(turma.grupo.id, requisicao.motoristaId, id);
      turma.nome = requisicao.nome;
      turma.numeroVan = requisicao.numeroVan;
      turma.capacidade = requisicao.capacidade;
      turma.motorista = motoristaDoMock(requisicao.motoristaId);
      return atraso(turma);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  return api.put<TurmaDetalhe>(`/admin/turmas/${id}`, requisicao);
}

export function excluirTurma(id: number): Promise<void> {
  if (mocksAtivos.e4) {
    try {
      turmaPorId(id);
      turmas.splice(
        turmas.findIndex((t) => t.id === id),
        1,
      );
      return atraso(undefined);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  return api.del(`/admin/turmas/${id}`);
}
