import { destinoDaNotificacao } from '@/notificacoes/push';

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { executionEnvironment: 'storeClient', expoConfig: {} },
  ExecutionEnvironment: { StoreClient: 'storeClient' },
}));

describe('destinoDaNotificacao (seção 5.6 do plano)', () => {
  it('lembrete abre o plano de hoje da turma (B1)', () => {
    expect(destinoDaNotificacao({ tipo: 'LEMBRETE', turmaId: 4 })).toBe('/aluno/hoje/4');
  });

  it('cancelamento tardio abre a lista do dia da turma (C1)', () => {
    expect(destinoDaNotificacao({ tipo: 'CANCELAMENTO_TARDIO', turmaId: '4' })).toBe(
      '/motorista/hoje/4',
    );
  });

  it('sem data ou com tipo desconhecido, abre a tela inicial do papel', () => {
    expect(destinoDaNotificacao(undefined)).toBe('/');
    expect(destinoDaNotificacao({ tipo: 'OUTRO', turmaId: 4 })).toBe('/');
    expect(destinoDaNotificacao({ tipo: 'LEMBRETE' })).toBe('/');
  });
});
