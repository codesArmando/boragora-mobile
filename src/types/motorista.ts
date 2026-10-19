// Formatos de motorista do backend (etapa 4 do plano do backend).
export interface Motorista {
  id: number;
  nome: string;
  email: string;
}

export interface MotoristaRequisicao {
  nome: string;
  email: string;
  senha: string;
}
