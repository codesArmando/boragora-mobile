# Plano de Implementação do Frontend
## Boragora Viagens — App de Controle de Passageiros de Van

**Base:** documento de escopo v7, plano de implementação do backend v4, `checklist-backend.md` (situação em 2026-10-08: etapas 0 a 3 concluídas) e protótipo de telas "Boragora Viagens — Marca e app", revisado em 2026-10-13.

**Para que serve:** guiar a construção do app entrega por entrega (inclusive pelo Claude Code), dividir o trabalho entre os 4 integrantes e deixar claro o que precisa estar pronto no backend para cada entrega ser concluída.

**Versão:** 3 — todas as decisões fechadas, protótipo revisado e pastas do repositório definidas (ver changelogs no final).

**Acompanhamento:** o progresso é registrado em `checklist-frontend.md`.

**Como ler:** a seção 1 registra as decisões da equipe. A seção 2 fixa as decisões técnicas. A seção 3 mostra a divisão entre as 4 pessoas e a ordem geral. A seção 4 responde "o que do backend precisa estar pronto". A seção 5 traz as entregas, uma a uma. As seções 6 e 7 servem para conferir a cobertura. A seção 9 traz as instruções para a execução com o Claude Code.

**Identificação:** cada entrega tem um código de trilha e número (`FND-01`, `ALU-03`...). Os códigos de tela (A1, B3, D5...) são os do protótipo. As etapas do backend aparecem como E0 a E9.

---

## 1. Decisões da equipe

### 1.1 Decisões sobre telas e navegação

| # | Ponto | Decisão | Efeito no backend (plano v4) |
|---|---|---|---|
| 1 | Atalho "Alunos" da gestão | Listagem geral somente leitura de todos os alunos (D10): nome, e-mail e se está ou não vinculado. O vínculo é feito só dentro da turma (D5 → D6). | `GET /admin/alunos` sem `turmaId` (E5, ponto 11) |
| 2 | Toque na notificação | Lembrete → plano de hoje da turma (B1), na aba Hoje do aluno; voltar leva à tela inicial do aluno. Cancelamento tardio → lista da ida da turma do aluno (C1). | Campo `data` com `tipo` e `turmaId` (E8, ponto 12) |
| 3 | Conta do motorista e do chefe | Aba Conta (C6), no mesmo modelo da B9. | Nenhum |
| 4 | Navegação do motorista-chefe | Mesmas abas e telas do motorista, mais a aba Gestão. Ordem das abas: **Hoje, Grupo, Gestão, Conta**. A aba "Turmas" deixou de existir. | Nenhuma rota nova; `GET /admin/turmas/hoje` removido (E7, ponto 13) |
| 5 | Tela de gestão (D1) | Quatro cartões independentes: Grupos, Turmas, Motoristas e Alunos. "Novo grupo" fica só na tela de grupos (D8). | Nenhum |
| 6 | Cartão "Motoristas" | Abre a lista de motoristas (D9), com o botão "Novo motorista" (D7). | Nenhum (`GET /admin/motoristas` já previsto) |
| 7 | Tela de turmas (D3) | Lista cadastral (turma, motorista e número de alunos), sem contadores do dia. O chefe acompanha o dia pela aba Grupo. | `GET /admin/turmas` (E4, ponto 14) |
| 8 | Editar e excluir | Grupo: tela D2b (editar e excluir). Turma: tela D5a (nome, número da van, capacidade e excluir). A troca de motorista fica na D5. | Nenhum |
| 9 | Cadastro de motorista | A D7 tem o campo "Confirmar senha". A conferência é feita só no app; o backend continua recebendo `nome`, `email` e `senha`. | Nenhum |

**Fluxo da aba Gestão:**

| Cartão da D1 | Abre | Ações |
|---|---|---|
| Grupos | D8 | "Novo grupo" → D2; tocar em um grupo → D2b |
| Turmas | D3 | "Nova turma" → D4; tocar em uma turma → D5 ("Trocar" motorista, "Editar" → D5a, "Vincular" → D6, remover aluno) |
| Motoristas | D9 | "Novo motorista" → D7 |
| Alunos | D10 | Nenhuma (somente leitura) |

**O chefe nas telas do motorista:**

| Tela | Para o motorista | Para o chefe |
|---|---|---|
| C0 Hoje | Turmas que ele conduz | Igual. Sem turma: tela C0b ("Você não conduz nenhuma turma"). |
| C3a Grupos | Grupos em que atua | **Todos** os grupos (RN12). "Sua turma: …" só onde ele conduz turma. |
| C3 Grupo | A turma dele recolhida, como atalho; as demais abertas | Igual; todas abertas nos grupos em que não conduz turma. É por aqui que ele acompanha o dia de qualquer turma (RF04). |
| C6 Conta | Perfil, minhas turmas e "Sair" | Igual; sem turma, "Minhas turmas" não aparece. |

### 1.2 Decisões técnicas e de organização

| # | Ponto | Decisão |
|---|---|---|
| 10 | Arquitetura | Tela → repositório → api, sem camada de hooks e sem biblioteca de busca de dados. Tipagem em `types/`. |
| 11 | Seletores (grupo e motorista na D4, "Trocar" na D5) | Um único componente `SeletorModal`: lista em modal, um toque para escolher. |
| 12 | Horários da D2 e da D2b | Campo de texto com máscara `HH:mm`, sem biblioteca de seletor de hora. |
| 13 | Atualização das listas | Recarregar ao voltar para a tela (`useFocusEffect`) e ao puxar para baixo. Sem tempo real. |
| 14 | Dados falsos | Enquanto o endpoint não existe, a função do repositório devolve um objeto fixo de `repositories/mocks/`. Quando a etapa fecha, a troca pela chamada real é uma linha. |
| 15 | Repositório | Dois repositórios Git separados, `boragora-api` e `boragora-mobile`, clonados lado a lado em uma pasta local `Boragora/`, que não é versionada. Cada repositório guarda os próprios documentos em `docs/` e tem o próprio `CLAUDE.md` (seção 2.2). |

### 1.3 Protótipo

O protótipo foi revisado em 2026-10-13 e reflete todas as decisões acima. Telas novas: C0b (Hoje do chefe sem turma), C6 (Conta do motorista e do chefe), D2b (Editar grupo), D5a (Editar turma), D8 (Grupos), D9 (Motoristas) e D10 (Alunos). Telas alteradas: D1, D3, D4 (campo "Nome da turma"), D5, D7 e as abas de todas as telas do motorista e do chefe. A B5 e a B6 já não têm o botão "Abrir WhatsApp".

---

## 2. Decisões técnicas

### 2.1 Stack

| Item | Escolha |
|---|---|
| Base | React Native com Expo (SDK estável atual) e TypeScript |
| Rotas | expo-router (RNF01) |
| Dados | Tela → repositório → api (RNF02). Estado da tela com `useState` e `useEffect`; recarga ao focar com `useFocusEffect` |
| HTTP | `fetch`, encapsulado em um único `api.ts` (sem axios) |
| Sessão | Token JWT guardado com `expo-secure-store`; usuário em um contexto React |
| Formulários | `useState`, sem biblioteca (os formulários têm de 2 a 5 campos) |
| Fontes | Barlow e Saira, por `@expo-google-fonts/barlow` e `@expo-google-fonts/saira` |
| Ícones | Feather, de `@expo/vector-icons` (é o mesmo conjunto usado no protótipo) |
| Push | `expo-notifications`, `expo-constants` e `expo-device` |
| Testes | `jest-expo` para as funções puras (`api.ts`, `estadoDoPlano`, máscaras e formatação) |

Durante quase todo o desenvolvimento o app roda no Expo Go. A exceção é a trilha de notificações, que exige um development build (seção 8).

### 2.2 Estrutura de pastas

```
Boragora/                  pasta local, não versionada
  boragora-api/            repositório do backend (Spring Boot)
    CLAUDE.md
    docs/                  escopo, MER, plano e checklist do backend
  boragora-mobile/         repositório do app (este plano)
    CLAUDE.md
    .claude/settings.json  dá ao Claude Code acesso de leitura a ../boragora-api/docs
    docs/                  plano e checklist do frontend, e prototipo/ (telas, logo e ícones)
    app/                   telas (expo-router); cada arquivo é a tela inteira
    assets/                logo, ícones e fontes copiados de docs/prototipo/
    src/
      api/             api.ts: URL base, token no cabeçalho, erros e falha de rede
      repositories/    um arquivo por recurso, mais a pasta mocks/
      types/           tipagem das respostas e dos corpos da API
      components/      componentes visuais compartilhados
      contexts/        SessaoContext (usuário logado e token)
      theme/           cores, fontes e medidas
      utils/           datas, máscaras e estadoDoPlano
```

A pasta `api/` ocupa o lugar que o database teria em um app com banco local: é a única que sabe falar com o backend.

**Dois repositórios, uma fonte para cada documento.** Cada documento fica no repositório a que pertence, sem cópias: escopo, MER, plano e checklist do backend em `boragora-api/docs/`; plano e checklist do frontend e o protótipo em `boragora-mobile/docs/`. O app consulta os documentos do backend pelo caminho `../boragora-api/docs/`. Por isso, **cada integrante clona os dois repositórios lado a lado na mesma pasta** (`Boragora/boragora-api` e `Boragora/boragora-mobile`) e mantém o `boragora-api` atualizado (`git pull`) para ver o progresso real do backend.

| Camada | Faz | Não faz |
|---|---|---|
| Tela (`app/`) | Chama o repositório, guarda carregando/erro/dados em `useState`, desenha e navega | Não chama `fetch`, não monta URL, não decide regra de negócio |
| Repositório (`repositories/`) | Uma função por endpoint (`listarGrupos`, `criarTurma`...), com tipos de entrada e saída | Não guarda estado, não monta URL base nem cabeçalho de token |
| api (`api/api.ts`) | `get`, `post`, `put` e `del`; URL base, token, JSON, `ErroApi`, 401 global e falha de rede | Não conhece nenhum recurso do domínio |
| Tipos (`types/`) | `type` e `interface` com os formatos do backend, um arquivo por recurso | Sem classes e sem lógica |

**Nomes:** pastas e funções de infraestrutura em inglês, como acima; nomes do domínio em português, iguais aos do backend: `repositories/grupoRepository.ts`, `types/grupo.ts`, `listarGrupos()`, `Grupo`, `incluiIda`.

**Rotas:**

```
app/
  _layout.tsx                      fontes e SessaoProvider
  index.tsx                        redireciona conforme a sessão e o papel
  (auth)/entrar.tsx                A1
  (auth)/criar-conta.tsx           A2
  aluno/
    _layout.tsx                    abas: Hoje | Grupo | Conta
    hoje/_layout.tsx               pilha, com initialRouteName "index"
    hoje/index.tsx                 Tela inicial do aluno e A3
    hoje/[turmaId].tsx             B1 a B7
    grupo/index.tsx                B8a
    grupo/[grupoId].tsx            B8 e B8b
    conta.tsx                      B9
  motorista/                       motorista e motorista-chefe
    _layout.tsx                    abas: Hoje | Grupo | Gestão | Conta (Gestão só para admin)
    hoje/_layout.tsx               pilha, com initialRouteName "index"
    hoje/index.tsx                 C0 e C0b
    hoje/[turmaId]/index.tsx       C1, C2 e C5
    hoje/[turmaId]/alunos.tsx      C4
    grupo/index.tsx                C3a
    grupo/[grupoId].tsx            C3
    conta.tsx                      C6
    gestao/_layout.tsx             pilha; recusa quem não é admin
    gestao/index.tsx               D1
    gestao/grupos/index.tsx        D8
    gestao/grupos/novo.tsx         D2
    gestao/grupos/[grupoId].tsx    D2b
    gestao/turmas/index.tsx        D3
    gestao/turmas/nova.tsx         D4
    gestao/turmas/[turmaId]/index.tsx     D5
    gestao/turmas/[turmaId]/editar.tsx    D5a
    gestao/turmas/[turmaId]/vincular.tsx  D6
    gestao/motoristas/index.tsx    D9
    gestao/motoristas/novo.tsx     D7
    gestao/alunos.tsx              D10
```

O chefe usa as rotas de `motorista/`, porque o papel dele é `MOTORISTA`: as telas Hoje, Grupo e Conta são literalmente as mesmas, e a aba Gestão é escondida para quem não é admin (opção `href: null` da aba). Os formulários da gestão (D2, D2b, D4, D5a, D6 e D7) escondem a barra de abas, como no protótipo; as listas (D1, D3, D8, D9 e D10) mostram a barra. O `initialRouteName` das pilhas "hoje" garante que, ao abrir uma tela pela notificação, o botão voltar leve à tela inicial da aba.

### 2.3 Identidade visual (extraída do protótipo)

| Uso | Valor |
|---|---|
| Fundo da tela | `#111111` |
| Superfície (cartões, campos) | `#1B1A17` |
| Superfície interna (blocos de horário, contadores, ícones da D1) | `#26241F` (o protótipo também usa `#262420`; unificar) |
| Borda | `#34322B` |
| Borda de botão secundário | `#4A473D` |
| Texto principal | `#FFFFFF` |
| Texto secundário | `#C4C0B4` |
| Texto apagado (datas, legendas) | `#9A968A` |
| Destaque (botão primário, opção marcada, aba ativa) | `#FFC800`, com texto `#111111` |
| Liberado | fundo `#99FF84`, texto `#267900` |
| Cancelado e ações destrutivas | `#FF6B5E` (selo com texto `#111111`; botão de excluir em contorno); fundo de alerta `#2A1512` |
| Selos da D10 | "Vinculado": fundo `#34322B`, texto branco; "Sem turma": contorno `#4A473D`, texto `#C4C0B4` |

Tipografia: Barlow (400, 500, 600 e 700) no texto, com corpo de 16; Saira itálica 800 nos títulos (26 a 32); Saira 700 nos números, horários e nomes nos cartões. Medidas: campos e botões com 54 de altura, raio 12 nos campos, 14 nos botões e 16 nos cartões; área de toque mínima de 44.

A logo, o símbolo (usado na A3) e os ícones do app já foram exportados do protótipo para `boragora-mobile/docs/prototipo/assets/` e `boragora-mobile/docs/prototipo/marca/`; a entrega `FND-02` os copia para `boragora-mobile/assets/`.

**Protótipo no repositório:** `boragora-mobile/docs/prototipo/` tem uma imagem PNG e um HTML de referência de cada tela, com um índice (`README.md`) que liga cada tela à entrega. A imagem é a referência visual; o HTML serve para conferir valores exatos e não deve ser copiado para o app.

### 2.4 Convenções que valem para todas as entregas

1. **O app não decide regra de negócio.** Quem diz o que pode ser feito é o bloco `acoes` do plano e os campos `idaSaiu` e `voltaSaiu`. O app nunca compara o relógio do celular com os horários do grupo. Mesmo com o botão oculto ou desabilitado, o backend revalida (RNF08).
2. **Tela nunca chama `fetch`, só o repositório. Repositório nunca monta URL base nem token, só usa o `api.ts`.**
3. **Toda tela que busca dados trata quatro estados:** carregando, erro (com "Tentar de novo"), vazio e com dados, usando os componentes `Carregando`, `EstadoErro` e `EstadoVazio`.
4. **Erros da API** chegam como `{ codigo, mensagem, campos }`. A mensagem exibida é a do backend. Erro 400 `VALIDACAO` marca os campos indicados em `campos`. Erro 401 em rota autenticada encerra a sessão e volta para a A1 com o aviso "Sua sessão expirou". Falha de rede mostra "Sem conexão com o servidor" (RNF06).
5. **A turma é identificada por `turma.nome`**, nunca por "Van " + número. Onde o protótipo mostra "Noite · Van 2", o app monta `grupo.nome · turma.nome`.
6. **Datas e horários** vêm prontos da API (`yyyy-MM-dd` e `HH:mm`). A data do cabeçalho ("Segunda, 5 de outubro") usa o campo `data` quando a resposta tiver; nas demais telas usa a data do aparelho, só para exibição.
7. **Depois de uma alteração**, a tela usa a resposta do `PUT` ou do `POST`; as telas anteriores se atualizam sozinhas ao voltar, pelo `useFocusEffect`.
8. **Ações destrutivas** (excluir grupo, excluir turma, remover aluno, cancelamento tardio) passam por um diálogo de confirmação.
9. **Tipos em um lugar só:** todo formato de resposta ou de corpo enviado ao backend está em `types/`. Nenhum arquivo declara de novo um formato da API.
10. **Uma tela e um repositório de modelo** (`FND-08`) servem de exemplo para as demais entregas. Toda tela nova segue o mesmo padrão.
11. **O protótipo é a referência visual.** Textos, ordem dos elementos e cores seguem a tela correspondente. Quando o protótipo e este plano divergirem, vale este plano, e a divergência é registrada no `checklist-frontend.md`.

### 2.5 Fluxo de trabalho

- Commits, branches e PRs do app ficam só no repositório `boragora-mobile`. Uma mudança que precise do backend vira um PR separado no `boragora-api`, feito pela etapa correspondente do plano do backend.
- Uma branch por entrega, com o código no nome: `front/ALU-03-marcar-ida-volta`.
- Título do commit ou do PR: `feat(app): <entrega> (<código>)`. Exemplo: `feat(app): marcar e desmarcar ida e volta (ALU-03)`.
- Cada PR é revisado por outra pessoa da equipe antes do merge.
- Cada pessoa altera as telas e os repositórios da sua trilha. Mudança em `components/`, `api/`, `types/` ou `theme/` vai em um PR separado e pequeno, avisado no grupo.
- Uma entrega está pronta quando: confere com o protótipo; trata os quatro estados da convenção 3; funciona com o backend real, não só com dados falsos; e está marcada no `checklist-frontend.md`.

---

## 3. Divisão do trabalho

### 3.1 Trilhas e responsáveis

| Pessoa | Trilha principal | Entregas | Total |
|---|---|---|---|
| 1 | Acesso, sessão, navegação e notificações | `FND-01`, `FND-06`, `FND-07`, `ACE-01` a `ACE-04`, `NOT-01` a `NOT-03` | 10 |
| 2 | Aluno: plano do dia; cadastros de pessoas na gestão | `FND-02`, `FND-03`, `ALU-01` a `ALU-06`, `GES-05`, `GES-12` | 10 |
| 3 | Listas do dia; lista de turmas da gestão | `FND-04`, `FND-08`, `LIS-01` a `LIS-06`, `GES-13` | 9 |
| 4 | Gestão de grupos e turmas | `FND-05`, `GES-01` a `GES-04`, `GES-06` a `GES-11` | 11 |
| Todos | Fechamento | `FEC-01` a `FEC-04` | 4 |

A pessoa 2 fica com as listas de motoristas e de alunos (`GES-05` e `GES-12`) porque dependem das etapas E4 e E5, que chegam antes da E6, de que dependem as telas do plano do dia. A pessoa 3 fica com a lista de turmas (`GES-13`), que usa os mesmos componentes de lista da trilha dela. A pessoa 4 tem mais entregas, mas quase todas são formulários curtos. Se alguém terminar antes, `GES-09`, `GES-11` e `LIS-06` são as mais fáceis de repassar.

### 3.2 Ordem geral (ondas)

Cada onda só pode ser **concluída** quando a etapa indicada estiver fechada no `checklist-backend.md`.

| Onda | Entregas | Backend necessário | Situação do backend |
|---|---|---|---|
| 0 — Fundação | `FND-01` a `FND-08` | E0, E2 e E3 | Pronto |
| 1 — Acesso e grupos | `ACE-01`, `ACE-02`, `GES-01` a `GES-04`, `LIS-01`, `NOT-01` | E2 e E3 | Pronto |
| 2 — Turmas e vínculos | `GES-05` a `GES-13`, `LIS-06` | E4 e E5 | Pendente |
| 3 — Plano do dia | `ALU-01` a `ALU-06`, `ACE-03` | E6 | Pendente |
| 4 — Listas do dia | `LIS-02` a `LIS-05`, `ACE-04` | E7 | Pendente |
| 5 — Notificações | `NOT-02`, `NOT-03` | E8 | Pendente |
| 6 — Fechamento | `FEC-01` a `FEC-04` | E9 | Pendente |

Ordem dentro da onda 0: `FND-01` primeiro (bloqueia todos, é curta); depois `FND-02` e `FND-05` em paralelo; depois `FND-03`, `FND-04`, `FND-06` e `FND-08`; por último `FND-07`.

### 3.3 Como ninguém fica parado

Com o backend na etapa 3, só as ondas 0 e 1 podem ser integradas hoje. As pessoas 2 e 3 dependem das etapas 6 e 7, que são as últimas. Para não esperarem (decisão 14):

- A partir da `FND-08`, cada tela pode ser construída com o repositório devolvendo um objeto fixo, no formato definido no plano do backend e já tipado em `types/`.
- Quando a etapa do backend fecha, a pessoa troca o objeto fixo pela chamada real, testa contra a API e só então marca a entrega como concluída.
- A coluna "Backend necessário" da seção 5 indica o que é preciso para **concluir**. Começar com dados falsos só exige a onda 0.

Sugestão de ritmo, supondo a entrega no início de novembro e o backend avançando cerca de duas etapas por semana: ondas 0 e 1 na semana de 12/10; ondas 2 e 3 na semana de 19/10; ondas 4 e 5 na semana de 26/10; onda 6 nos primeiros dias de novembro. Se o backend atrasar, as telas continuam avançando com dados falsos e a integração se acumula no fim, que é o principal risco do cronograma.

---

## 4. O que precisa estar pronto no backend

### 4.1 O que cada etapa do backend libera

| Etapa | Situação | Itens do `checklist-backend.md` que o app usa | Entregas que dependem dela |
|---|---|---|---|
| E0 Fundação | Concluída | Formato padrão de erro; `app.relogio.fixo` no perfil `dev` | `FND-05`; testes manuais de `ALU-02` a `ALU-06` |
| E1 Banco | Concluída | Nenhum item direto | — |
| E2 Autenticação | Concluída | `POST /auth/cadastro`, `POST /auth/login`, `GET /me`, 401 sem token ou com token expirado, autoridades por papel, admin inicial | `FND-06`, `FND-07`, `ACE-01`, `ACE-02`; perfil e "Sair" de `ACE-03` e `ACE-04` |
| E3 Grupos | Concluída | `POST`, `PUT` e `DELETE /admin/grupos`, `GET /grupos` (todos os grupos para o admin), `GET /grupos/{id}`, validação dos horários, 409 `GRUPO_COM_TURMAS` | `FND-08`, `GES-02`, `GES-03`, `GES-04`, `LIS-01` |
| E4 Motoristas e turmas | Não iniciada | `POST` e `GET /admin/motoristas`; `GET`, `POST`, `PUT` e `DELETE /admin/turmas`; `GET /turmas/{id}`; validação do nome; 409 `CONFLITO_GRUPO_MOTORISTA` | `GES-05` a `GES-09`, `GES-13`, `LIS-06` |
| E5 Vínculos | Não iniciada | `GET /admin/alunos` (com e sem `turmaId`), `POST /admin/turmas/{id}/alunos`, `DELETE /admin/turmas/{id}/alunos/{alunoId}`, 409 `CONFLITO_GRUPO_ALUNO` | `GES-10`, `GES-11`, `GES-12`; dados reais para `LIS-01` (aluno), `LIS-06` e `GES-13` |
| E6 Plano do dia | Não iniciada | `GET /aluno/turmas`, `GET /aluno/turmas/{turmaId}/plano` com o bloco `acoes`, os três `PUT` do plano, erros 422 `IDA_ENCERRADA`, `VOLTA_NAO_INCLUIDA` e `DIA_ENCERRADO` | `ALU-01` a `ALU-06`, "Minhas turmas" de `ACE-03` |
| E7 Listagens | Não iniciada | `GET /motorista/turmas` (lista vazia para o chefe sem turma), `GET /turmas/{id}/hoje`, `GET /grupos/{id}/hoje` | `LIS-02` a `LIS-05`, "Minhas turmas" de `ACE-04` |
| E8 Push | Não iniciada | `PUT` e `DELETE /me/push-token`, push de cancelamento tardio e lembrete, ambos com o campo `data` | `NOT-02`, `NOT-03` |
| E9 Fechamento | Não iniciada | Carga de dados do perfil `dev` (inclusive alunos sem vínculo), README, API acessível pela rede local | `FEC-01`, `FEC-02` |

### 4.2 Dependências que não são óbvias

- **`GET /grupos` já existe, mas devolve lista vazia para aluno e motorista sem turma.** Para ver as telas B8a e C3a com dados reais de aluno ou motorista comum é preciso ter turmas (E4) e vínculos (E5), ou inserir os registros direto no banco. Com o chefe, a C3a já funciona hoje, porque ele recebe todos os grupos.
- **A coluna "N turmas" da D8 vem de `totalTurmas`**, que já existe em `GET /grupos` (E3). Fica 0 até haver turmas.
- **As telas B1 a B7 dependem de `app.relogio.fixo`** para serem testadas sem esperar a hora real. A propriedade já existe (E0).
- **Para a E9, a carga de dados precisa ser igual à dos dados falsos do app** (grupos Manhã e Noite, Carlos Menezes e Vanderlei Dias, Van 1 e Van 2, João Gabriel e os demais, e os alunos sem vínculo Ana Beatriz Moura, Diego Farias e Vitor Sampaio), para que a troca de falso para real não mude o que aparece na tela.

### 4.3 Contrato que o app espera (conferir a cada etapa do backend)

| Etapa | Resposta | O que o app precisa |
|---|---|---|
| E4 | `GET /turmas/{id}` | `id`, `nome`, `numeroVan` e `capacidade` (podem vir nulos), `grupo` com `id`, `nome` e horários, `motorista` com `id` e `nome`, `alunos` com `id` e `nome` |
| E4 | `GET /admin/turmas` | Por item: `id`, `nome`, `grupo` (`id`, `nome`, `periodo`, horários), `motorista` (`id`, `nome`) e `totalAlunos`, já ordenados por grupo |
| E4 | `GET /admin/motoristas` | `id`, `nome` e `email` (D9 e seletores da D4 e da D5) |
| E5 | `GET /admin/alunos?turmaId=` | `id`, `nome`, `email`, `turmas`, `situacao` e o nome da turma em conflito (D6) |
| E5 | `GET /admin/alunos` sem `turmaId` | `id`, `nome`, `email` e `turmas` (vazia quando não está vinculado); `situacao` nula (D10) |
| E5 | 409 `CONFLITO_GRUPO_ALUNO` | Nome do aluno em conflito na `mensagem` |
| E6 | `GET /aluno/turmas` | Por item: `turma.id`, `turma.nome`, `grupo` (`id`, `nome`, horários), nome do motorista, `incluiIda` e `incluiVolta` |
| E6 | Plano | Exatamente o formato da etapa 6 do plano do backend, com `acoes`, `idaSaiu` e `voltaSaiu` |
| E7 | `GET /motorista/turmas` | Por turma: `id`, `nome`, grupo com `id`, nome e horários, `contadores` e `semConfirmacoes`. Lista vazia para o chefe sem turma |
| E7 | `GET /grupos/{id}/hoje` | Por turma: `minhaTurma`; por item de lista: `voce` |
| E8 | Envio do push | Campo `data` com `tipo` (`LEMBRETE` ou `CANCELAMENTO_TARDIO`) e `turmaId` |

As alterações que as decisões desta seção pediam no backend já estão no plano do backend v4 e no `checklist-backend.md`: `GET /admin/turmas` (E4), `turmaId` opcional em `GET /admin/alunos` (E5), remoção de `GET /admin/turmas/hoje` (E7) e campo `data` no push (E8). As etapas já concluídas (E0 a E3) não mudaram.

---

## 5. Entregas

Tamanho estimado: **P** até meio dia, **M** cerca de um dia, **G** dois dias ou mais. São estimativas para equilibrar a divisão, não prazos. Os itens de construção e os critérios de aceite de cada entrega estão no `checklist-frontend.md`.

### 5.1 Trilha FND — Fundação (onda 0)

| Código | Entrega | Pessoa | Backend necessário | Depende de | Tam. |
|---|---|---|---|---|---|
| `FND-01` | Criar o projeto Expo | 1 | — | — | P |
| `FND-02` | Tema, fontes e imagens da marca | 2 | — | `FND-01` | M |
| `FND-03` | Componentes de formulário e de ação | 2 | — | `FND-02` | M |
| `FND-04` | Componentes de cartão e de lista | 3 | — | `FND-02` | M |
| `FND-05` | `api.ts`, erros e tipos da API | 4 | E0 (pronta): formato padrão de erro | `FND-01` | M |
| `FND-06` | Sessão: login, token e expiração | 1 | E2 (pronta): `POST /auth/login`, `POST /auth/cadastro`, `GET /me`, 401 | `FND-05` | M |
| `FND-07` | Navegação, abas e guarda por papel | 1 | E2 (pronta): `papel` e `admin` em `GET /me` | `FND-02`, `FND-06` | M |
| `FND-08` | Repositório e tela de modelo, dados falsos | 3 | E3 (pronta): `GET /grupos` | `FND-04`, `FND-05` | M |

- **`FND-01`** — Projeto em `boragora-mobile/` com TypeScript e expo-router, ESLint e Prettier, atalho `@/` para `src/`, `.env.example` com `EXPO_PUBLIC_API_URL` e as pastas da seção 2.2.
- **`FND-02`** — `theme/` com os valores da seção 2.3; fontes carregadas antes de esconder a tela de abertura; ícone e tela de abertura do app (de `docs/prototipo/marca/`); logo e símbolo copiados de `docs/prototipo/assets/` para `assets/`; componente `Tela` (área segura e fundo).
- **`FND-03`** — `Botao` (primário, contorno, texto e perigo; carregando e desabilitado), `CampoTexto` (rótulo, erro, senha, máscara), `Cabecalho` (voltar, título e ação à direita, como o "Novo grupo" da D8), `SeletorSegmentado`, `Aviso`, `DialogoConfirmacao` e `SeletorModal`.
- **`FND-04`** — `Cartao`, `CartaoAtalho` (os cartões da D1), `BlocoHorarios`, `Contadores`, `LinhaAluno`, `LinhaPessoa` (iniciais, nome e e-mail, da D9), `Selo` (Você, Sua turma, Cancelado, Liberado, Em aula, Vinculado, Sem turma), `EstadoVazio`, `EstadoErro`, `Carregando` e `ListaAtualizavel`.
- **`FND-05`** — `api/api.ts`, classe `ErroApi`, falha de rede, ponto único para avisar a sessão sobre o 401, e a pasta `types/` com os formatos do plano do backend, um arquivo por recurso.
- **`FND-06`** — `contexts/SessaoContext.tsx` com `entrar`, `cadastrar` e `sair`; token no `expo-secure-store`; restauração da sessão com `GET /me`; 401 global leva à A1 com o aviso de sessão expirada.
- **`FND-07`** — Todos os arquivos de rota da seção 2.2 com telas provisórias; abas de cada papel na ordem da decisão 4; redirecionamento por papel; aba Gestão só para admin; `gestao/_layout.tsx` recusa quem não é admin.
- **`FND-08`** — `repositories/grupoRepository.ts` e uma tela de modelo com os quatro estados e recarga ao focar; pasta `repositories/mocks/` com o cenário do protótipo; padrão de troca entre objeto fixo e chamada real. É o modelo que todas as trilhas copiam.

### 5.2 Trilha ACE — Acesso e conta (pessoa 1)

| Código | Entrega | Telas | Endpoints | Backend necessário | Depende de | Tam. |
|---|---|---|---|---|---|---|
| `ACE-01` | Tela de entrar | A1 | `POST /auth/login` | E2 (pronta) | `FND-03`, `FND-07` | P |
| `ACE-02` | Tela de criar conta | A2 | `POST /auth/cadastro` | E2 (pronta): 409 `EMAIL_JA_CADASTRADO` | `FND-03`, `FND-07` | P |
| `ACE-03` | Conta do aluno | B9 | `GET /me`, `GET /aluno/turmas` | E2 (pronta) para perfil e "Sair"; E6 para "Minhas turmas" | `FND-04`, `FND-07`, `ALU-01` | P |
| `ACE-04` | Conta do motorista e do chefe | C6 | `GET /me`, `GET /motorista/turmas` | E2 (pronta) para perfil e "Sair"; E7 para "Minhas turmas" | `ACE-03`, `LIS-04` | P |

### 5.3 Trilha ALU — Aluno: plano do dia (pessoa 2)

| Código | Entrega | Telas | Endpoints | Backend necessário | Depende de | Tam. |
|---|---|---|---|---|---|---|
| `ALU-01` | Tela inicial do aluno e estado sem turma | Tela inicial, A3 | `GET /aluno/turmas` | E6 | `FND-04`, `FND-07`, `FND-08` | M |
| `ALU-02` | Plano de hoje: leitura e estados | B1, B2 | `GET /aluno/turmas/{turmaId}/plano` | E6: bloco `acoes`; 403 sem vínculo | `ALU-01` | M |
| `ALU-03` | Marcar e desmarcar ida e volta | B1, B2 | `PUT .../plano/ida`, `PUT .../plano/volta` | E6 | `ALU-02` | M |
| `ALU-04` | Status da volta | B2, B3 | `PUT .../plano/status-volta` | E6: 422 `VOLTA_NAO_INCLUIDA` | `ALU-03` | P |
| `ALU-05` | Cancelamento tardio da ida | B3, B4, B5 | `PUT .../plano/ida` | E6: `cancelouAposSaida` | `ALU-03` | M |
| `ALU-06` | Ida bloqueada e dia encerrado | B6, B7 | os mesmos | E6: 422 `IDA_ENCERRADA` e `DIA_ENCERRADO`; E0 (pronta): relógio fixo | `ALU-02` | M |

A entrega `ALU-02` inclui a função pura `utils/estadoDoPlano.ts`, que escolhe o estado da tela nesta ordem (a primeira condição verdadeira vence):

| Ordem | Condição | Estado | Tela |
|---|---|---|---|
| 1 | `voltaSaiu` | `ENCERRADO` | B7 |
| 2 | `cancelouAposSaida` | `IDA_CANCELADA` | B5 |
| 3 | `idaSaiu` e `incluiIda` | `APOS_SAIDA` | B3 |
| 4 | `idaSaiu` e não `incluiIda` | `IDA_BLOQUEADA` | B6 |
| 5 | `incluiIda` ou `incluiVolta` | `DECLARADO` | B2 |
| 6 | nenhuma das anteriores | `SEM_PLANO` | B1 |

O estado define o aviso e o que fica bloqueado; o texto de cada cartão vem dos campos (`incluiIda`, `cancelouAposSaida`, `incluiVolta`). Na B2, o seletor de status da volta usa o título "Status da volta" e o texto "Pode mudar até HH:mm", como na B3.

### 5.4 Trilha LIS — Listas do dia (pessoa 3)

| Código | Entrega | Telas | Endpoints | Backend necessário | Depende de | Tam. |
|---|---|---|---|---|---|---|
| `LIS-01` | Meus grupos (aluno, motorista e chefe) | B8a, C3a | `GET /grupos` | E3 (pronta). Dados reais de aluno e motorista comum: E4 e E5 | `FND-08` | P |
| `LIS-02` | Grupo do aluno: ida e volta | B8, B8b | `GET /grupos/{id}/hoje` | E7: `minhaTurma` e `voce`; 403 fora do grupo | `LIS-01` | M |
| `LIS-03` | Grupo do motorista e do chefe | C3 | `GET /grupos/{id}/hoje` | E7 | `LIS-02`, `LIS-05` | P |
| `LIS-04` | Hoje do motorista e do chefe | C0, C0b | `GET /motorista/turmas` | E7: contadores; lista vazia para o chefe sem turma | `FND-08` | M |
| `LIS-05` | Lista do dia da turma | C1, C2, C5 | `GET /turmas/{id}/hoje` | E7: `listaIda`, `listaVolta`, `semConfirmacoes` | `LIS-04` | M |
| `LIS-06` | Alunos da turma | C4 | `GET /turmas/{id}` | E4; E5 para a lista ter alunos | `LIS-05` | P |

### 5.5 Trilha GES — Gestão do motorista-chefe (pessoas 4, 2 e 3)

| Código | Entrega | Telas | Endpoints | Pessoa | Backend necessário | Depende de | Tam. |
|---|---|---|---|---|---|---|---|
| `GES-01` | Tela de gestão | D1 | — | 4 | Nenhum | `FND-04`, `FND-07` | P |
| `GES-02` | Lista de grupos | D8 | `GET /grupos` | 4 | E3 (pronta) | `GES-01`, `FND-08` | P |
| `GES-03` | Novo grupo | D2 | `POST /admin/grupos` | 4 | E3 (pronta): 400 com ida não anterior à volta | `GES-02`, `FND-03` | M |
| `GES-04` | Editar e excluir grupo | D2b | `GET /grupos/{id}`, `PUT` e `DELETE /admin/grupos/{id}` | 4 | E3 (pronta): 409 `GRUPO_COM_TURMAS` | `GES-03` | P |
| `GES-05` | Motoristas: lista e cadastro | D9, D7 | `GET /admin/motoristas`, `POST /admin/motoristas` | 2 | E4 | `GES-01`, `FND-03` | M |
| `GES-06` | Nova turma | D4 | `GET /grupos`, `GET /admin/motoristas`, `POST /admin/turmas` | 4 | E4: validação do nome; 409 `CONFLITO_GRUPO_MOTORISTA` | `GES-01`, `GES-05` | M |
| `GES-07` | Gerenciar turma: leitura | D5 | `GET /turmas/{id}` | 4 | E4 | `GES-06` | P |
| `GES-08` | Trocar motorista e editar dados | D5, D5a | `PUT /admin/turmas/{id}` | 4 | E4: conflito também na troca | `GES-07` | M |
| `GES-09` | Excluir turma | D5a | `DELETE /admin/turmas/{id}` | 4 | E4: 204 com exclusão em cascata | `GES-08` | P |
| `GES-10` | Vincular alunos | D6 | `GET /admin/alunos?turmaId=`, `POST /admin/turmas/{id}/alunos` | 4 | E5: `situacao`; 409 `CONFLITO_GRUPO_ALUNO` | `GES-07` | M |
| `GES-11` | Remover aluno da turma | D5 | `DELETE /admin/turmas/{id}/alunos/{alunoId}` | 4 | E5 | `GES-07` | P |
| `GES-12` | Lista de alunos | D10 | `GET /admin/alunos` sem `turmaId` | 2 | E5 | `GES-01`, `FND-08` | P |
| `GES-13` | Lista de turmas | D3 | `GET /admin/turmas` | 3 | E4; E5 para `totalAlunos` maior que zero | `GES-01`, `FND-08` | P |

### 5.6 Trilha NOT — Notificações (pessoa 1)

| Código | Entrega | Telas | Endpoints | Backend necessário | Depende de | Tam. |
|---|---|---|---|---|---|---|
| `NOT-01` | Prova de conceito: development build e token | — | — | Nenhum | `FND-01` | G |
| `NOT-02` | Registrar e remover o token | — | `PUT /me/push-token`, `DELETE /me/push-token` | E8 | `NOT-01`, `FND-06` | P |
| `NOT-03` | Receber e abrir notificações | E1 | — | E8: campo `data` | `NOT-02`, `FND-07`, `ALU-02`, `LIS-05` | M |

Destinos do toque (`NOT-03`):

| `data.tipo` | Destino | Tela | Botão voltar |
|---|---|---|---|
| `LEMBRETE` | `/aluno/hoje/{turmaId}` | B1 (plano de hoje da turma), na aba Hoje | Tela inicial do aluno |
| `CANCELAMENTO_TARDIO` | `/motorista/hoje/{turmaId}`, trecho Ida | C1 (lista da ida da turma) | C0 |

Vale igual para o motorista comum e para o chefe responsável pela turma. Com a sessão expirada, o app abre a A1 e, depois do login, vai para a tela inicial do papel. Sem `data` ou com tipo desconhecido, o toque abre a tela inicial do papel.

### 5.7 Trilha FEC — Fechamento (todos)

| Código | Entrega | Backend necessário | Tam. |
|---|---|---|---|
| `FEC-01` | Roteiro de teste de ponta a ponta no app | E9: carga de dados e `app.relogio.fixo` | M |
| `FEC-02` | Teste no aparelho pela rede local | E9: API acessível pela rede local | P |
| `FEC-03` | Revisão visual e de acessibilidade contra o protótipo | — | M |
| `FEC-04` | README do app | — | P |

---

## 6. Mapa de telas para entregas

| Tela | Entrega | | Tela | Entrega |
|---|---|---|---|---|
| A1 Entrar | `ACE-01` | | C4 Alunos da turma | `LIS-06` |
| A2 Criar conta | `ACE-02` | | C5 Sem confirmações | `LIS-05` |
| A3 Aluno sem turma | `ALU-01` | | C6 Conta do motorista e do chefe | `ACE-04` |
| Tela inicial do aluno | `ALU-01` | | D1 Gestão | `GES-01` |
| B1 Sem plano | `ALU-02`, `ALU-03` | | D8 Grupos | `GES-02` |
| B2 Plano declarado | `ALU-02` a `ALU-04` | | D2 Novo grupo | `GES-03` |
| B3 Depois da saída | `ALU-04`, `ALU-05` | | D2b Editar grupo | `GES-04` |
| B4 Confirmar cancelamento | `ALU-05` | | D3 Turmas | `GES-13` |
| B5 Ida cancelada | `ALU-05` | | D4 Nova turma | `GES-06` |
| B6 Ida bloqueada | `ALU-06` | | D5 Gerenciar turma | `GES-07`, `GES-08`, `GES-11` |
| B7 Dia encerrado | `ALU-06` | | D5a Editar turma | `GES-08`, `GES-09` |
| B8a Grupos do aluno | `LIS-01` | | D6 Vincular alunos | `GES-10` |
| B8 e B8b Grupo, ida e volta | `LIS-02` | | D9 Motoristas | `GES-05` |
| B9 Conta | `ACE-03` | | D7 Novo motorista | `GES-05` |
| C0 Hoje do motorista | `LIS-04` | | D10 Alunos | `GES-12` |
| C0b Hoje do chefe sem turma | `LIS-04` | | E1 Notificações | `NOT-03` |
| C1 e C2 Listas do dia | `LIS-05` | | | |
| C3a Grupos do motorista e do chefe | `LIS-01` | | | |
| C3 Grupo do motorista e do chefe | `LIS-03` | | | |

---

## 7. Rastreabilidade: requisitos do escopo por entrega

| Requisito | Entregas | | Requisito | Entregas |
|---|---|---|---|---|
| RF01 Turmas | `GES-06` a `GES-11`, `GES-13` | | RF11 Cancelar volta | `ALU-03` |
| RF02 Motoristas | `GES-05`, `GES-06`, `GES-08` | | RF12 Status do grupo (aluno) | `LIS-01`, `LIS-02` |
| RF03 Vincular alunos | `GES-10`, `GES-11` | | RF13 Lembrete | `NOT-02`, `NOT-03` |
| RF04 Status de qualquer turma | `LIS-01`, `LIS-03` (chefe) | | RF14 Grupos | `GES-02` a `GES-04` |
| RF05 Ver turmas e alunos | `LIS-04`, `LIS-06` | | RF16 Demais turmas do grupo | `LIS-03` |
| RF06 Status de presença | `LIS-05` | | RN02, RN03, RN15 Limites de horário | `ALU-06` (exibição; a regra é do backend) |
| RF07 Cadastro do aluno | `ACE-02` | | RN05, RN06 Cancelamento tardio e aviso | `ALU-05`, `LIS-05`, `NOT-03` |
| RF08 Plano do dia | `ALU-01` a `ALU-03` | | RN16, RN17 Exclusões | `GES-04`, `GES-09` |
| RF09 Status da volta | `ALU-04` | | RNF03 Sessão de 1 dia | `FND-06` |
| RF10 Cancelar ida | `ALU-03`, `ALU-05` | | RNF05 Push | `NOT-01` a `NOT-03` |

---

## 8. Riscos do frontend

| Risco | Impacto | O que fazer |
|---|---|---|
| Push não funciona no Expo Go em Android (a partir do SDK 53). É preciso um development build, um projeto no EAS e credenciais do Firebase (FCM). | Alto | `NOT-01` começa na onda 1, como prova de conceito. No iOS, as credenciais de push normalmente exigem a conta paga de desenvolvedor da Apple; o caminho mais simples para a apresentação é Android. |
| As trilhas ALU e LIS dependem das últimas etapas do backend (E6 e E7). | Alto | Dados falsos desde a `FND-08`, com o formato tirado do plano do backend e tipado em `types/`. Uma entrega só é marcada depois de testada com a API real. |
| Resposta real diferente dos dados falsos. | Médio | Contrato da seção 4.3 conferido a cada etapa do backend; `types/` é a única fonte dos formatos no app. |
| Sem camada de hooks, cada tela repete o controle de carregando e erro, e as cópias podem divergir. | Médio | Tela de modelo da `FND-08` revisada pela equipe e copiada em todas as telas; componentes `Carregando`, `EstadoErro` e `EstadoVazio` compartilhados. |
| Tela aberta durante a virada de horário mostra ações que já não valem. | Baixo | Recarregar ao focar e tratar os erros 422 recarregando o plano (`ALU-06`). |
| Sessão de 1 dia expira no meio do uso. | Baixo | Tratamento global do 401 na `FND-06`, com aviso ao usuário. |
| Aplicativo gerado em modo de publicação não acessa a API por HTTP simples no Android. | Baixo | Apresentar com o development build ou com o Expo Go, ou liberar HTTP na configuração do build. |

---

## 9. Instruções para a execução com o Claude Code

1. Trabalhar **uma entrega por vez**, dentro do repositório `boragora-mobile`. Não alterar `../boragora-api/` a partir de uma entrega do app (é outro repositório); se a API não tiver o que a tela precisa, parar e avisar.
2. Antes de começar, conferir em `../boragora-api/docs/checklist-backend.md` se a etapa indicada em "Backend necessário" está concluída. Se não estiver, construir com o objeto fixo de `repositories/mocks/` e deixar a entrega como "aguardando EN" no `checklist-frontend.md`.
3. Seguir as convenções da seção 2.4, em especial: tela → repositório → api; tipos só em `types/`; nenhuma regra de horário no app.
4. Usar a tela e o repositório da `FND-08` como modelo de toda tela nova.
5. Abrir a imagem da tela em `docs/prototipo/png/` antes de construir e seguir textos, ordem dos elementos e cores; conferir valores exatos no HTML de mesmo nome em `docs/prototipo/html/`, sem copiá-lo.
6. Não implementar nada da seção 10.
7. Ao concluir, marcar os itens da entrega no `checklist-frontend.md` e informar: o que foi criado, como testar no aparelho e qualquer decisão tomada que não estava no plano (que vai para a tabela de decisões do checklist).
8. Em caso de conflito entre este plano, o protótipo, o plano do backend ou o escopo, parar e perguntar em vez de escolher.

---

## 10. Fora deste plano

- Tudo o que está na seção 8 do escopo e na seção 7 do plano do backend: geolocalização, unificação de turmas, edição e exclusão de contas, recuperação de senha, telefone do motorista e botão do WhatsApp, histórico.
- Ações sobre contas de aluno na D10 (a tela é somente leitura).
- Modo offline (RNF06).
- Publicação nas lojas.
- Tema claro. O protótipo só tem o tema escuro.

---

## Changelog — o que mudou da versão 2 para a versão 3

| # | Mudança | Motivo |
|---|---|---|
| 1 | Pontos em aberto A a H fechados; seção 1 reorganizada em decisões de telas e decisões técnicas | A equipe aceitou as propostas, exceto a pasta do app. |
| 2 | Dois repositórios separados (`boragora-api` e `boragora-mobile`), clonados lado a lado em `Boragora/`; documentos do app em `boragora-mobile/docs/`, documentos do backend em `boragora-api/docs/` | Organização definida pela equipe. |
| 3 | D3 passa a ser lista cadastral com `GET /admin/turmas` (E4); a entrega sai da trilha LIS (`LIS-07`) e vira `GES-13`, na onda 2 | Decisão 7. A gestão de turmas deixa de depender da E7. |
| 4 | Ordem das abas do chefe: Hoje, Grupo, Gestão, Conta | Ordem adotada pela equipe no protótipo. |
| 5 | Telas novas no protótipo e no plano: C0b, C6, D2b, D5a; `GES-04`, `GES-08`, `GES-09`, `ACE-04` e `LIS-04` apontam para elas | Protótipo revisado em 2026-10-13. |
| 6 | D7 com "Confirmar senha", conferido só no app | Campo adicionado pela equipe no protótipo. |
| 7 | Alterações no backend incorporadas ao plano do backend v4 e ao `checklist-backend.md` | Pedido da equipe. |
| 8 | Itens de construção e critérios de aceite movidos para o novo `checklist-frontend.md`; nova seção 7 (rastreabilidade) e nova seção 9 (instruções para o Claude Code) | Acompanhamento no mesmo formato do backend. |

## Changelog — o que mudou da versão 1 para a versão 2

| # | Mudança | Motivo |
|---|---|---|
| 1 | Lista geral de alunos (D10), destinos do toque nas notificações, Conta do motorista, navegação do chefe com a aba Gestão, D1 com quatro cartões e tela D8 | Decisões 1 a 5 da equipe. |
| 2 | Arquitetura tela → repositório → api, sem hooks e sem TanStack Query; pasta `types/` | Estrutura mais simples e enxuta. |
| 3 | Seção de alterações necessárias no backend | Sinalizar o que muda no backend. |

---

## Referências

- [Notificações no Expo](https://docs.expo.dev/versions/latest/sdk/notifications/) — indisponibilidade do push no Expo Go em Android e necessidade de development build.
- [Configuração de push no Expo](https://docs.expo.dev/push-notifications/push-notifications-setup/) — bibliotecas, `projectId` do EAS e credenciais.
