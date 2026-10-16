import type { ErroResposta } from '@/types/erro';

import { ErroApi } from './ErroApi';

// Único ponto do app que fala com o backend (seção 2.2 do plano): URL base, token,
// JSON, tempo limite, erros no formato padrão, falha de rede e aviso de 401.

const TIMEOUT_MS = 15_000;

let authToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

// A sessão (FND-06) informa o token ao entrar e passa `null` ao sair.
export function setAuthToken(token: string | null) {
  authToken = token;
}

// Ponto único de aviso do 401: chamado quando uma requisição feita com token recebe 401.
// Sem token (login com senha errada, por exemplo), o 401 só vira um ErroApi comum.
export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error('EXPO_PUBLIC_API_URL não definida. Copie .env.example para .env.');
  }

  const token = authToken;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let status: number;
  let ok: boolean;
  let text: string;
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token !== null && { Authorization: `Bearer ${token}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    status = response.status;
    ok = response.ok;
    text = await response.text();
  } catch {
    throw ErroApi.semConexao();
  } finally {
    clearTimeout(timer);
  }

  if (ok) {
    if (!text) {
      return undefined as T;
    }
    try {
      return JSON.parse(text) as T;
    } catch {
      throw ErroApi.respostaInesperada(status);
    }
  }

  if (status === 401 && token !== null) {
    unauthorizedHandler?.();
  }
  throw erroDaResposta(status, text);
}

function erroDaResposta(status: number, text: string): ErroApi {
  try {
    const erro = JSON.parse(text) as Partial<ErroResposta>;
    if (typeof erro.codigo === 'string' && typeof erro.mensagem === 'string') {
      return new ErroApi(status, erro.codigo, erro.mensagem, erro.campos ?? null);
    }
  } catch {
    // Corpo vazio ou que não é JSON: cai na resposta inesperada abaixo.
  }
  return ErroApi.respostaInesperada(status);
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  del: <T = void>(path: string) => request<T>('DELETE', path),
};
