// Formatos de motorista do backend (etapa 4 do plano do backend). O formato da resposta já
// existe em `types/consulta.ts` (convenção 9: um formato da API é declarado uma vez só).
export type { Motorista } from '@/types/consulta';

export interface MotoristaRequisicao {
  nome: string;
  email: string;
  senha: string;
}
