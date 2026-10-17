import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { setAuthToken, setUnauthorizedHandler } from '@/api/api';
import { ErroApi } from '@/api/ErroApi';
import * as authRepository from '@/repositories/authRepository';
import type { TokenResposta } from '@/types/auth';
import type { Usuario } from '@/types/usuario';

// Usuário logado e token (seção 2.2 do plano). O token fica no expo-secure-store e vale
// 1 dia, sem refresh: quando expira, a API devolve 401 e a sessão é encerrada aqui.

export const CHAVE_TOKEN = 'boragora.token';

type Sessao = {
  usuario: Usuario | null;
  // true enquanto o app confere, ao abrir, o token gravado com `GET /me`.
  restaurando: boolean;
  // Falha ao restaurar que não foi 401 (sem conexão, por exemplo). O token continua
  // gravado, e `restaurar` tenta de novo.
  erroRestauracao: ErroApi | null;
  // A sessão terminou por 401: a A1 mostra "Sua sessão expirou" até o próximo login.
  sessaoExpirada: boolean;
  entrar: (email: string, senha: string) => Promise<Usuario>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<Usuario>;
  sair: () => Promise<void>;
  restaurar: () => Promise<void>;
  recarregarUsuario: () => Promise<Usuario>;
};

const SessaoContext = createContext<Sessao | null>(null);

function lerTokenGravado() {
  return SecureStore.getItemAsync(CHAVE_TOKEN).catch(() => null);
}

export function SessaoProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [restaurando, setRestaurando] = useState(true);
  const [erroRestauracao, setErroRestauracao] = useState<ErroApi | null>(null);
  const [sessaoExpirada, setSessaoExpirada] = useState(false);
  // Evita encerrar duas vezes quando várias requisições recebem 401 ao mesmo tempo.
  const sessaoAtiva = useRef(false);

  const limpar = useCallback(async () => {
    sessaoAtiva.current = false;
    setAuthToken(null);
    setUsuario(null);
    await SecureStore.deleteItemAsync(CHAVE_TOKEN).catch(() => undefined);
  }, []);

  const iniciar = useCallback(async ({ token, usuario: novoUsuario }: TokenResposta) => {
    await SecureStore.setItemAsync(CHAVE_TOKEN, token);
    setAuthToken(token);
    sessaoAtiva.current = true;
    setUsuario(novoUsuario);
    setSessaoExpirada(false);
    return novoUsuario;
  }, []);

  const encerrarPorExpiracao = useCallback(() => {
    if (!sessaoAtiva.current) {
      return;
    }
    void limpar();
    setSessaoExpirada(true);
    // Sem usuário, as guardas das rotas (FND-07) levam à A1.
  }, [limpar]);

  // Confere com `GET /me` o token lido do expo-secure-store ao abrir o app.
  const conferirTokenGravado = useCallback(async (token: string | null) => {
    try {
      if (token === null) {
        return;
      }
      setAuthToken(token);
      sessaoAtiva.current = true;
      setUsuario(await authRepository.buscarUsuarioLogado());
    } catch (erro) {
      // O 401 já foi tratado por `encerrarPorExpiracao`.
      if (!(erro instanceof ErroApi && erro.status === 401)) {
        setErroRestauracao(erro instanceof ErroApi ? erro : ErroApi.semConexao());
      }
    } finally {
      setRestaurando(false);
    }
  }, []);

  const restaurar = useCallback(async () => {
    setRestaurando(true);
    setErroRestauracao(null);
    await conferirTokenGravado(await lerTokenGravado());
  }, [conferirTokenGravado]);

  useEffect(() => {
    setUnauthorizedHandler(encerrarPorExpiracao);
    void lerTokenGravado().then(conferirTokenGravado);
    return () => setUnauthorizedHandler(null);
  }, [encerrarPorExpiracao, conferirTokenGravado]);

  const entrar = useCallback(
    async (email: string, senha: string) => iniciar(await authRepository.entrar({ email, senha })),
    [iniciar],
  );

  const cadastrar = useCallback(
    async (nome: string, email: string, senha: string) =>
      iniciar(await authRepository.cadastrar({ nome, email, senha })),
    [iniciar],
  );

  const sair = useCallback(async () => {
    await limpar();
    setSessaoExpirada(false);
  }, [limpar]);

  const recarregarUsuario = useCallback(async () => {
    const atualizado = await authRepository.buscarUsuarioLogado();
    setUsuario(atualizado);
    return atualizado;
  }, []);

  const valor = useMemo(
    () => ({
      usuario,
      restaurando,
      erroRestauracao,
      sessaoExpirada,
      entrar,
      cadastrar,
      sair,
      restaurar,
      recarregarUsuario,
    }),
    [
      usuario,
      restaurando,
      erroRestauracao,
      sessaoExpirada,
      entrar,
      cadastrar,
      sair,
      restaurar,
      recarregarUsuario,
    ],
  );

  return <SessaoContext.Provider value={valor}>{children}</SessaoContext.Provider>;
}

export function useSessao() {
  const sessao = useContext(SessaoContext);
  if (sessao === null) {
    throw new Error('useSessao precisa estar dentro de SessaoProvider.');
  }
  return sessao;
}
