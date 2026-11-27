# Roteiro de teste de ponta a ponta (`FEC-01`)

Cada pessoa da equipe executa o roteiro inteiro no celular (Expo Go ou development build) com o backend real, e marca a sua linha no `checklist-frontend.md`. Anote no grupo qualquer passo que não bater com o "Esperado".

## Preparação

1. Banco limpo com a carga de demonstração: em `boragora-api`, `docker compose down -v && docker compose up -d`.
2. API com o relógio parado antes da saída da ida (os passos de 1 a 7 usam 17:00):
   - Linux/macOS: `APP_RELOGIO_FIXO=2026-10-05T17:00 ./gradlew bootRun`
   - PowerShell: `$env:APP_RELOGIO_FIXO="2026-10-05T17:00"; .\gradlew.bat bootRun`
3. App: `npx expo start` em `boragora-mobile` e abrir no celular (veja o README).

Os nomes abaixo (grupo "Tarde", turma "Van 3", "Maria Teste") são sugestões; use os seus, mas mantenha os horários.

## Passos

| # | Quem | Ação | Esperado |
|---|---|---|---|
| 1 | Chefe (`admin@boragora.local` / `admin123`) | Gestão › Grupos › Novo grupo: "Tarde", período Tarde, ida **17:30**, volta **21:00** | Volta para a D8 com "Tarde · Ida 17:30 · Volta 21:00 · 0 turmas" |
| 2 | Chefe | Gestão › Motoristas › Novo motorista: "Motorista Teste", `motorista.teste@boragora.local`, senha `senha123` duas vezes | Volta para a D9 com o motorista novo. Senhas diferentes ou e-mail repetido mostram o erro no campo |
| 3 | Chefe | Gestão › Turmas › Nova turma: grupo "Tarde", nome "Van 3", motorista "Motorista Teste" | Abre a D5 da "Van 3 · Tarde" com 0 alunos |
| 4 | Aluno novo | Sair. Na A1, **Criar conta**: "Maria Teste", `maria.teste@boragora.local`, `senha123` | Entra direto e vê "Você ainda não está em uma van" com o e-mail (A3) |
| 5 | Chefe | Entrar de novo. Gestão › Alunos | "Maria Teste" aparece com o selo **Sem turma** (D10) |
| 6 | Chefe | Gestão › Turmas › Van 3 › Vincular: marcar "Maria Teste" › "Vincular 1 aluno" | Volta para a D5 com Maria na lista |
| 7 | Aluno (Maria) | Hoje › Tarde · Van 3 › marcar **Ida** e **Volta** | Cartões amarelos "Confirmada · sai às 17:30/21:00"; a tela inicial mostra "Hoje: ida e volta marcadas" |
| 8 | Motorista (`motorista.teste@boragora.local`) | Hoje | Cartão "Tarde · Van 3" com 1 vai na ida e 1 volta |
| 9 | — | Reiniciar a API com `APP_RELOGIO_FIXO=2026-10-05T18:00` (depois da saída da ida) | — |
| 10 | Aluno (Maria) | Plano de hoje › desmarcar a **Ida** › "Cancelar a ida" | Folha "Cancelar a ida depois da saída?"; depois, "Cancelada depois da saída" com cadeado e o aviso do WhatsApp (B5) |
| 11 | Motorista | Hoje › Van 3 (C1, trecho Ida) | Maria com "Cancelou depois da saída" e o selo **Cancelado**; o cartão da C0 mostra "1 aluno cancelou depois da saída" |
| 12 | Motorista (development build) | Receber a notificação "Maria Teste cancelou a ida..." e tocar nela | Abre a C1 da Van 3 no trecho Ida. **No Expo Go não há push**: pule este passo e registre "sem build" |

## Limpeza

Para voltar ao cenário de demonstração: `docker compose down -v && docker compose up -d` e suba a API de novo (sem `APP_RELOGIO_FIXO` para usar o relógio real).
