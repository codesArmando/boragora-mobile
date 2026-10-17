import Constants from 'expo-constants';

import { api, setAuthToken, setUnauthorizedHandler, urlBase } from './api';
import { ErroApi } from './ErroApi';

jest.mock('expo-constants', () => ({ __esModule: true, default: { expoConfig: {} } }));

type RespostaFalsa = { status: number; corpo?: string };

const fetchFalso = jest.fn();

function responder({ status, corpo = '' }: RespostaFalsa) {
  fetchFalso.mockResolvedValueOnce({
    status,
    ok: status >= 200 && status < 300,
    text: async () => corpo,
  });
}

async function capturarErro(promessa: Promise<unknown>): Promise<ErroApi> {
  try {
    await promessa;
  } catch (erro) {
    expect(erro).toBeInstanceOf(ErroApi);
    return erro as ErroApi;
  }
  throw new Error('A chamada deveria ter falhado');
}

beforeEach(() => {
  process.env.EXPO_PUBLIC_API_URL = 'http://api.teste';
  globalThis.fetch = fetchFalso;
  fetchFalso.mockReset();
  setAuthToken(null);
  setUnauthorizedHandler(null);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('resposta de sucesso', () => {
  it('devolve o JSON da resposta 200', async () => {
    responder({ status: 200, corpo: '{"status":"UP"}' });

    await expect(api.get('/health')).resolves.toEqual({ status: 'UP' });
    expect(fetchFalso).toHaveBeenCalledWith(
      'http://api.teste/health',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('devolve undefined na resposta sem corpo (204)', async () => {
    responder({ status: 204 });

    await expect(api.del('/admin/grupos/1')).resolves.toBeUndefined();
  });

  it('envia o corpo em JSON', async () => {
    responder({ status: 200, corpo: '{}' });

    await api.post('/auth/login', { email: 'a@b.com', senha: '123456' });

    const [, init] = fetchFalso.mock.calls[0];
    expect(init.method).toBe('POST');
    expect(init.body).toBe('{"email":"a@b.com","senha":"123456"}');
    expect(init.headers['Content-Type']).toBe('application/json');
  });

  it('envia o token no cabeçalho Authorization só quando há sessão', async () => {
    responder({ status: 200, corpo: '{}' });
    responder({ status: 200, corpo: '{}' });

    await api.get('/me');
    setAuthToken('abc');
    await api.get('/me');

    expect(fetchFalso.mock.calls[0][1].headers.Authorization).toBeUndefined();
    expect(fetchFalso.mock.calls[1][1].headers.Authorization).toBe('Bearer abc');
  });
});

describe('erro no formato padrão', () => {
  it('vira ErroApi com status, código, mensagem e campos', async () => {
    responder({
      status: 400,
      corpo: JSON.stringify({
        codigo: 'VALIDACAO',
        mensagem: 'Dados inválidos.',
        campos: { horarioIda: 'A ida precisa ser antes da volta.' },
      }),
    });

    const erro = await capturarErro(api.post('/admin/grupos', {}));

    expect(erro.status).toBe(400);
    expect(erro.codigo).toBe('VALIDACAO');
    expect(erro.mensagem).toBe('Dados inválidos.');
    expect(erro.campos).toEqual({ horarioIda: 'A ida precisa ser antes da volta.' });
  });

  it('usa campos nulo quando o backend não manda campos', async () => {
    responder({
      status: 409,
      corpo: '{"codigo":"GRUPO_COM_TURMAS","mensagem":"Exclua as turmas antes.","campos":null}',
    });

    const erro = await capturarErro(api.del('/admin/grupos/1'));

    expect(erro.codigo).toBe('GRUPO_COM_TURMAS');
    expect(erro.campos).toBeNull();
  });
});

describe('erro fora do formato', () => {
  it('corpo HTML vira RESPOSTA_INESPERADA com o status recebido', async () => {
    responder({ status: 502, corpo: '<html>Bad Gateway</html>' });

    const erro = await capturarErro(api.get('/grupos'));

    expect(erro.status).toBe(502);
    expect(erro.codigo).toBe('RESPOSTA_INESPERADA');
  });

  it('corpo vazio vira RESPOSTA_INESPERADA', async () => {
    responder({ status: 500 });

    const erro = await capturarErro(api.get('/grupos'));

    expect(erro.codigo).toBe('RESPOSTA_INESPERADA');
  });

  it('JSON sem codigo e mensagem vira RESPOSTA_INESPERADA', async () => {
    responder({ status: 500, corpo: '{"error":"Internal Server Error"}' });

    const erro = await capturarErro(api.get('/grupos'));

    expect(erro.codigo).toBe('RESPOSTA_INESPERADA');
  });

  it('resposta 200 que não é JSON vira RESPOSTA_INESPERADA', async () => {
    responder({ status: 200, corpo: 'ok' });

    const erro = await capturarErro(api.get('/health'));

    expect(erro.codigo).toBe('RESPOSTA_INESPERADA');
  });
});

describe('falha de rede', () => {
  it('fetch rejeitado vira SEM_CONEXAO', async () => {
    fetchFalso.mockRejectedValueOnce(new TypeError('Network request failed'));

    const erro = await capturarErro(api.get('/grupos'));

    expect(erro.status).toBe(0);
    expect(erro.codigo).toBe('SEM_CONEXAO');
    expect(erro.mensagem).toBe('Sem conexão com o servidor.');
  });

  it('tempo limite esgotado vira SEM_CONEXAO', async () => {
    jest.useFakeTimers();
    fetchFalso.mockImplementationOnce(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(new Error('Aborted')));
        }),
    );

    const chamada = capturarErro(api.get('/grupos'));
    jest.advanceTimersByTime(15_000);
    const erro = await chamada;

    expect(erro.codigo).toBe('SEM_CONEXAO');
  });
});

describe('aviso de 401 para a sessão', () => {
  it('avisa a sessão quando a requisição com token recebe 401', async () => {
    const aviso = jest.fn();
    setUnauthorizedHandler(aviso);
    setAuthToken('expirado');
    responder({
      status: 401,
      corpo: '{"codigo":"NAO_AUTENTICADO","mensagem":"Sessão expirada.","campos":null}',
    });

    const erro = await capturarErro(api.get('/me'));

    expect(aviso).toHaveBeenCalledTimes(1);
    expect(erro.codigo).toBe('NAO_AUTENTICADO');
  });

  it('não avisa a sessão no 401 do login com senha errada (sem token)', async () => {
    const aviso = jest.fn();
    setUnauthorizedHandler(aviso);
    responder({
      status: 401,
      corpo:
        '{"codigo":"CREDENCIAIS_INVALIDAS","mensagem":"E-mail ou senha inválidos.","campos":null}',
    });

    const erro = await capturarErro(api.post('/auth/login', {}));

    expect(aviso).not.toHaveBeenCalled();
    expect(erro.codigo).toBe('CREDENCIAIS_INVALIDAS');
  });

  it('não avisa a sessão em outros erros', async () => {
    const aviso = jest.fn();
    setUnauthorizedHandler(aviso);
    setAuthToken('abc');
    responder({
      status: 403,
      corpo: '{"codigo":"ACESSO_NEGADO","mensagem":"Sem permissão.","campos":null}',
    });

    await capturarErro(api.get('/admin/motoristas'));

    expect(aviso).not.toHaveBeenCalled();
  });
});

describe('URL base', () => {
  const expoConfig = Constants.expoConfig as { hostUri?: string };

  afterEach(() => {
    delete expoConfig.hostUri;
  });

  it('usa EXPO_PUBLIC_API_URL quando definida', () => {
    expoConfig.hostUri = '10.0.0.5:8081';

    expect(urlBase()).toBe('http://api.teste');
  });

  it('sem EXPO_PUBLIC_API_URL, usa o IP do Metro na porta da API', () => {
    delete process.env.EXPO_PUBLIC_API_URL;
    expoConfig.hostUri = '10.0.0.5:8081';

    expect(urlBase()).toBe('http://10.0.0.5:8080');
  });

  it('sem EXPO_PUBLIC_API_URL e sem hostUri, falha com mensagem clara', () => {
    delete process.env.EXPO_PUBLIC_API_URL;

    expect(() => urlBase()).toThrow('Defina EXPO_PUBLIC_API_URL no .env');
  });
});
