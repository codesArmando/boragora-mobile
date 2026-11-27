import { alunos, motoristas, turmas } from '@/repositories/mocks/gestao';
import type { AlunoAdmin, Motorista, TurmaCadastro } from '@/types/consulta';

export const motoristasMock: Motorista[] = motoristas.map(({ id, nome, email }) => ({
  id,
  nome,
  email,
}));

export const alunosMock: AlunoAdmin[] = alunos
  .map((aluno) => ({
    ...aluno,
    turmas: turmas
      .filter((turma) => turma.alunos.some((vinculado) => vinculado.id === aluno.id))
      .map((turma) => ({ id: turma.id, nome: turma.nome })),
  }))
  .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

export const turmasCadastroMock: TurmaCadastro[] = turmas
  .map((turma) => ({
    id: turma.id,
    nome: turma.nome,
    numeroVan: turma.numeroVan,
    capacidade: turma.capacidade,
    grupo: {
      id: turma.grupo.id,
      nome: turma.grupo.nome,
      periodo:
        turma.grupo.nome === 'Manhã'
          ? ('MANHA' as const)
          : turma.grupo.nome === 'Tarde'
            ? ('TARDE' as const)
            : ('NOITE' as const),
      horarioSaidaIda: turma.grupo.horarioSaidaIda,
      horarioSaidaVolta: turma.grupo.horarioSaidaVolta,
    },
    motorista: turma.motorista,
    totalAlunos: turma.alunos.length,
  }))
  .sort(
    (a, b) =>
      a.grupo.nome.localeCompare(b.grupo.nome, 'pt-BR') || a.nome.localeCompare(b.nome, 'pt-BR'),
  );
