import { ErroApi } from '@/api/ErroApi';
import {
  buscarAlunosParaVincular,
  removerAluno,
  vincularAlunos,
} from '@/repositories/alunoRepository';
import { criarMotorista, listarMotoristas } from '@/repositories/motoristaRepository';
import { atualizarTurma, buscarTurma, excluirTurma } from '@/repositories/turmaRepository';

jest.mock('expo-constants', () => ({ __esModule: true, default: { expoConfig: {} } }));

async function capturarErro(promessa: Promise<unknown>): Promise<ErroApi> {
  try {
    await promessa;
  } catch (erro) {
    expect(erro).toBeInstanceOf(ErroApi);
    return erro as ErroApi;
  }
  throw new Error('A chamada deveria ter falhado');
}

describe('dados falsos da gestão', () => {
  it('D6: mostra conflito no grupo, turma de outro grupo e sem turma', async () => {
    const lista = await buscarAlunosParaVincular(2, '');
    const porNome = Object.fromEntries(lista.map((a) => [a.nome, a]));

    expect(porNome['Gustavo Nunes']).toMatchObject({
      situacao: 'CONFLITO_NO_GRUPO',
      turmaEmConflito: 'Van 1',
    });
    expect(porNome['Helena Castro']).toMatchObject({
      situacao: 'DISPONIVEL',
      turmas: ['Manhã · Van 2'],
    });
    expect(porNome['Vitor Sampaio']).toMatchObject({ situacao: 'DISPONIVEL', turmas: [] });
    // Quem já está na própria turma não aparece.
    expect(porNome['Beatriz Souza']).toBeUndefined();
  });

  it('D6: busca por nome ou e-mail', async () => {
    const porNome = await buscarAlunosParaVincular(2, 'vitor');
    expect(porNome.map((a) => a.nome)).toEqual(['Vitor Sampaio']);
    const porEmail = await buscarAlunosParaVincular(2, 'DIEGO.FARIAS');
    expect(porEmail.map((a) => a.nome)).toEqual(['Diego Farias']);
  });

  it('vínculo é tudo ou nada: um conflito no lote não vincula ninguém', async () => {
    const antes = (await buscarTurma(2)).alunos.length;
    // 1 = Ana Beatriz (disponível), 5 = Gustavo (conflito na Van 1 da Noite).
    const erro = await capturarErro(vincularAlunos(2, [1, 5]));
    expect(erro.codigo).toBe('CONFLITO_GRUPO_ALUNO');
    expect(erro.mensagem).toContain('Gustavo Nunes');
    expect((await buscarTurma(2)).alunos).toHaveLength(antes);
  });

  it('vincular e remover alunos reflete na turma, em ordem alfabética', async () => {
    await vincularAlunos(1, [2, 3]);
    const depois = await buscarTurma(1);
    expect(depois.alunos.map((a) => a.nome)).toEqual([
      'Diego Farias',
      'João Gabriel',
      'Vitor Sampaio',
    ]);

    await removerAluno(1, 2);
    await removerAluno(1, 3);
    expect((await buscarTurma(1)).alunos.map((a) => a.nome)).toEqual(['João Gabriel']);
  });

  it('motorista: e-mail repetido devolve 409 no campo de e-mail', async () => {
    const erro = await capturarErro(
      criarMotorista({ nome: 'Outro', email: 'CARLOS.MENEZES@email.com', senha: '123456' }),
    );
    expect(erro.codigo).toBe('EMAIL_JA_CADASTRADO');
    expect(erro.campos).toHaveProperty('email');
  });

  it('motorista novo aparece na lista', async () => {
    const antes = (await listarMotoristas()).length;
    await criarMotorista({ nome: 'Novo Motorista', email: 'novo@email.com', senha: '123456' });
    expect(await listarMotoristas()).toHaveLength(antes + 1);
  });

  it('RN08: trocar para motorista que já conduz outra turma do grupo devolve 409', async () => {
    const turma = await buscarTurma(2); // Noite, Vanderlei; Carlos conduz a Van 1 da Noite
    const erro = await capturarErro(
      atualizarTurma(2, {
        nome: turma.nome,
        numeroVan: turma.numeroVan,
        capacidade: turma.capacidade,
        motoristaId: 2,
      }),
    );
    expect(erro.codigo).toBe('CONFLITO_GRUPO_MOTORISTA');
    expect((await buscarTurma(2)).motorista.nome).toBe('Vanderlei Dias');
  });

  it('trocar para motorista de outro grupo funciona, e editar o nome reflete', async () => {
    const turma = await buscarTurma(4); // Manhã, Vanderlei; o chefe não conduz turma
    const atualizada = await atualizarTurma(4, {
      nome: 'Van da Zona Sul',
      numeroVan: turma.numeroVan,
      capacidade: turma.capacidade,
      motoristaId: 1,
    });
    expect(atualizada.motorista.id).toBe(1);
    expect((await buscarTurma(4)).nome).toBe('Van da Zona Sul');
  });

  it('excluir turma remove e depois ela não é encontrada', async () => {
    await excluirTurma(3);
    const erro = await capturarErro(buscarTurma(3));
    expect(erro.status).toBe(404);
  });
});
