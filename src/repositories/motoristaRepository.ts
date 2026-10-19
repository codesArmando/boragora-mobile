import { api } from '@/api/api';
import { ErroApi } from '@/api/ErroApi';
import { atraso, motoristas, novoIdMotorista } from '@/repositories/mocks/gestao';
import { mocksAtivos } from '@/repositories/mocks/mocksAtivos';
import type { Motorista, MotoristaRequisicao } from '@/types/motorista';

// Motoristas (etapa 4 do backend). Com `mocksAtivos.e4`, devolve os dados falsos.
export function listarMotoristas(): Promise<Motorista[]> {
  if (mocksAtivos.e4) {
    return atraso(motoristas);
  }
  return api.get<Motorista[]>('/admin/motoristas');
}

export function criarMotorista(requisicao: MotoristaRequisicao): Promise<Motorista> {
  if (mocksAtivos.e4) {
    const email = requisicao.email.trim().toLowerCase();
    if (motoristas.some((m) => m.email.toLowerCase() === email)) {
      return Promise.reject(
        new ErroApi(409, 'EMAIL_JA_CADASTRADO', 'Já existe uma conta com este e-mail.', {
          email: 'Já existe uma conta com este e-mail.',
        }),
      );
    }
    const novo: Motorista = { id: novoIdMotorista(), nome: requisicao.nome, email };
    motoristas.push(novo);
    return atraso(novo);
  }
  return api.post<Motorista>('/admin/motoristas', requisicao);
}
