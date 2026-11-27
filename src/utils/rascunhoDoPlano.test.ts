import type { PlanoDoDia } from '@/types/plano';

import { alteracoesDoRascunho, rascunhoDe, temAlteracoes } from './rascunhoDoPlano';

function plano(campos: Partial<PlanoDoDia>): PlanoDoDia {
  return {
    data: '2026-10-05',
    turma: {
      id: 1,
      nome: 'Van 2',
      grupo: {
        id: 1,
        nome: 'Noite',
        periodo: 'NOITE',
        horarioSaidaIda: '18:10',
        horarioSaidaVolta: '22:30',
      },
    },
    incluiIda: false,
    incluiVolta: false,
    statusVolta: 'EM_AULA',
    cancelouAposSaida: false,
    idaSaiu: false,
    voltaSaiu: false,
    acoes: {
      podeIncluirIda: true,
      podeCancelarIda: false,
      cancelamentoIdaSeraTardio: false,
      podeAlterarVolta: true,
      podeAlterarStatusVolta: false,
    },
    ...campos,
  };
}

describe('alteracoesDoRascunho', () => {
  it('não tem alterações quando o rascunho é igual ao salvo', () => {
    const salvo = plano({ incluiIda: true, incluiVolta: true, statusVolta: 'LIBERADO' });
    expect(temAlteracoes(alteracoesDoRascunho(salvo, rascunhoDe(salvo)))).toBe(false);
  });

  it('envia só o que mudou', () => {
    const salvo = plano({ incluiIda: true });
    expect(alteracoesDoRascunho(salvo, { ...rascunhoDe(salvo), incluiIda: false })).toEqual({
      ida: false,
    });
  });

  it('ao marcar a volta como liberado, envia a volta e depois o status', () => {
    const salvo = plano({});
    expect(
      alteracoesDoRascunho(salvo, { incluiIda: false, incluiVolta: true, statusVolta: 'LIBERADO' }),
    ).toEqual({ volta: true, statusVolta: 'LIBERADO' });
  });

  it('ao marcar a volta em aula, não envia o status, que a API já grava assim', () => {
    const salvo = plano({});
    expect(
      alteracoesDoRascunho(salvo, { incluiIda: false, incluiVolta: true, statusVolta: 'EM_AULA' }),
    ).toEqual({ volta: true });
  });

  it('ao desmarcar a volta, ignora o status', () => {
    const salvo = plano({ incluiVolta: true, statusVolta: 'EM_AULA' });
    expect(
      alteracoesDoRascunho(salvo, {
        incluiIda: false,
        incluiVolta: false,
        statusVolta: 'LIBERADO',
      }),
    ).toEqual({ volta: false });
  });

  it('com a volta já salva, envia só a troca de status', () => {
    const salvo = plano({ incluiVolta: true, statusVolta: 'EM_AULA' });
    expect(alteracoesDoRascunho(salvo, { ...rascunhoDe(salvo), statusVolta: 'LIBERADO' })).toEqual({
      statusVolta: 'LIBERADO',
    });
  });
});
