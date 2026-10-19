import { api } from '@/api/api';
import {
  atraso,
  conferirConflitoDeMotorista,
  motoristas,
  novoIdTurma,
  turmaPorId,
  turmas,
} from '@/repositories/mocks/gestao';
import { mocksAtivos } from '@/repositories/mocks/mocksAtivos';
import { buscarGrupo } from '@/repositories/grupoRepository';
import type { Turma, TurmaCriacaoRequisicao, TurmaEdicaoRequisicao } from '@/types/turma';

function motoristaDoMock(id: number) {
  const motorista = motoristas.find((m) => m.id === id);
  return { id, nome: motorista?.nome ?? 'Motorista' };
}

// Turmas (etapa 4 do backend). Com `mocksAtivos.e4`, devolve os dados falsos.
export function buscarTurma(id: number): Promise<Turma> {
  if (mocksAtivos.e4) {
    try {
      return atraso(turmaPorId(id));
    } catch (e) {
      return Promise.reject(e);
    }
  }
  return api.get<Turma>(`/turmas/${id}`);
}

export async function criarTurma(requisicao: TurmaCriacaoRequisicao): Promise<Turma> {
  if (mocksAtivos.e4) {
    // O grupo é o real (etapa 3); só a turma é falsa.
    const grupo = await buscarGrupo(requisicao.grupoId);
    conferirConflitoDeMotorista(grupo.id, requisicao.motoristaId);
    const turma: Turma = {
      id: novoIdTurma(),
      nome: requisicao.nome,
      numeroVan: requisicao.numeroVan,
      capacidade: requisicao.capacidade,
      grupo: {
        id: grupo.id,
        nome: grupo.nome,
        periodo: grupo.periodo,
        horarioSaidaIda: grupo.horarioSaidaIda,
        horarioSaidaVolta: grupo.horarioSaidaVolta,
      },
      motorista: motoristaDoMock(requisicao.motoristaId),
      alunos: [],
    };
    turmas.push(turma);
    return atraso(turma);
  }
  return api.post<Turma>('/admin/turmas', requisicao);
}

export function atualizarTurma(id: number, requisicao: TurmaEdicaoRequisicao): Promise<Turma> {
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
  return api.put<Turma>(`/admin/turmas/${id}`, requisicao);
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
