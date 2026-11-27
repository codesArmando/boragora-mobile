# Boragora Viagens — App

App de controle de passageiros de van, para alunos e motoristas. React Native + Expo (SDK 58) + expo-router, em TypeScript. Estilos com `StyleSheet` e o tema de `src/theme/`.

O app consome a API do repositório [boragora-api](https://github.com/codesArmando/boragora-api). Clone os dois lado a lado, porque este repositório lê os documentos de `../boragora-api/docs/`:

```
Boragora/
├── boragora-api/
└── boragora-mobile/
```

```bash
git clone https://github.com/codesArmando/boragora-api.git
git clone https://github.com/codesArmando/boragora-mobile.git
```

## Pré-requisitos

| Ferramenta                                                                                                                                                      | Versão                          | Para quê                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------- |
| [Node.js](https://nodejs.org/)                                                                                                                                  | 20 LTS ou mais novo             | Rodar o Expo e as ferramentas                              |
| App **Expo Go** no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)) | SDK 58 (a versão atual da loja) | Abrir o app no celular sem build nativo                    |
| A API rodando                                                                                                                                                   | —                               | Veja o [README do boragora-api](../boragora-api/README.md) |

Também dá para usar um emulador Android (Android Studio) ou o simulador do iOS (Xcode, só no macOS).

## Rodando localmente

### 1. Subir a API

O app precisa da API para tudo, a começar pelo login. Siga o README do `boragora-api`. Em resumo:

```bash
cd ../boragora-api
docker compose up -d
./gradlew bootRun          # Windows: .\gradlew.bat bootRun
```

Confira se `http://localhost:8080/health` responde antes de seguir.

### 2. Instalar as dependências

```bash
cd ../boragora-mobile
npm ci
```

Use `npm ci` para instalar exatamente as versões do `package-lock.json`. Depois de um pull que mude o `package.json` (por exemplo, a troca de SDK), rode de novo.

### 3. Iniciar o Expo

```bash
npx expo start
```

Vai aparecer um QR code no terminal.

- **Android:** abra o Expo Go e escaneie o QR code (ou use a câmera / Google Lens).
- **iOS:** escaneie com a câmera do iPhone e toque no link para abrir no Expo Go. O Expo Go do iPhone exige que o **Expo Go e o computador estejam logados na mesma conta Expo**: entre no Expo Go (ícone de perfil) e rode `npx expo login` no computador.
- **Emulador Android:** com o emulador aberto, aperte `a` no terminal do Expo.

### 4. Entrar

Use os usuários que a API cria no perfil `dev` (carga de demonstração):

| Papel                    | E-mail                                                                          | Senha      |
| ------------------------ | ------------------------------------------------------------------------------- | ---------- |
| Motorista-chefe (gestão) | `admin@boragora.local`                                                          | `admin123` |
| Motorista                | `vanderlei@boragora.local` ou `carlos@boragora.local`                           | `senha123` |
| Aluno                    | `joao@boragora.local` (e `beatriz@`, `camila@`, `rafael@`... `@boragora.local`) | `senha123` |
| Aluno sem turma          | `ana@`, `diego@` ou `vitor@boragora.local`                                      | `senha123` |

Um aluno novo se cadastra pelo próprio app, em **Criar conta** (A2). Ele entra direto e vê a A3 até o motorista-chefe vinculá-lo a uma turma (Gestão › Turmas › Vincular).

## Como o app encontra a API

Sem a variável `EXPO_PUBLIC_API_URL`, o app usa **o IP do computador que está rodando o Expo, na porta 8080** (veja `urlBase()` em `src/api/api.ts`). Ou seja, ele espera que a API rode na mesma máquina que o Expo.

Para isso funcionar:

- o celular e o computador precisam estar **na mesma rede** (o celular no Wi-Fi do mesmo roteador);
- o firewall do computador precisa liberar conexões de entrada nas portas **8080** (API) e **8081** (Metro, o servidor do Expo). No Windows, confira se a regra vale para o perfil da rede em uso (Privada ou Pública).

Teste rápido: abra `http://<IP-do-computador>:8080/health` no navegador do celular. Se não abrir, o problema é de rede ou firewall, não do app.

### Quando definir `EXPO_PUBLIC_API_URL`

Copie o arquivo de exemplo e descomente a linha:

```bash
cp .env.example .env
```

```
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
```

Defina quando:

- a API roda em outra máquina ou em outra porta;
- você usa `npx expo start --tunnel` (o IP do túnel não é o da API);
- a detecção automática pega o IP errado (por exemplo, com VPN, como o Radmin, ou várias placas de rede). Nesse caso, fixe também o IP do Metro: `REACT_NATIVE_PACKAGER_HOSTNAME=<IP> npx expo start`.

Nunca use `localhost` no celular: lá, `localhost` é o próprio celular. O IP do computador pode mudar de um dia para o outro (confira com `ipconfig`/`ifconfig`). Depois de mudar o `.env`, reinicie o Expo com cache limpo: `npx expo start -c`.

## Testando regras de horário

As regras do plano do aluno dependem da hora (antes da saída, depois da saída, dia encerrado) e são todas decididas pela API. Para testar as telas B1 a B7 sem esperar o horário real, suba a API com o relógio parado:

```bash
APP_RELOGIO_FIXO=2026-10-05T17:00 ./gradlew bootRun                 # Linux/macOS
$env:APP_RELOGIO_FIXO="2026-10-05T17:00"; .\gradlew.bat bootRun    # PowerShell
```

| Horário (grupo Noite: ida 18:10, volta 22:30) | O que aparece para o aluno                                            |
| --------------------------------------------- | --------------------------------------------------------------------- |
| 17:00                                         | B1 (nada marcado) e B2 (ida e volta confirmadas)                      |
| 19:00                                         | B3 (depois da saída), B4/B5 (cancelamento tardio), B6 (ida bloqueada) |
| 22:30                                         | B7 (dia encerrado)                                                    |

A carga de demonstração cria as confirmações **do dia em que roda**; em outro dia as listas do motorista começam vazias. Para recriá-la: `docker compose down -v && docker compose up -d` e suba a API de novo.

## Dados falsos (mocks)

Todas as etapas do backend usadas pelo app estão prontas, então os dados falsos estão **desligados**. Os interruptores ficam em `src/repositories/mocks/mocksAtivos.ts` (`e3`, `e4`, `e5`, `e7`); com `true`, o repositório correspondente devolve os objetos de `src/repositories/mocks/` em vez de chamar a API. Use só para desenvolver uma tela sem a API; os testes de `src/repositories/mocks/` ligam os mocks por conta própria.

## Notificações push

O código está pronto (`src/notificacoes/`): depois do login o app pede permissão, obtém o Expo push token e o envia com `PUT /me/push-token`; ao sair, remove com `DELETE /me/push-token`. Com o app aberto, a notificação aparece como banner; o toque abre o plano de hoje (lembrete) ou a lista da ida da turma (cancelamento tardio).

**O Expo Go não recebe push remoto** (desde o SDK 53). Nele, o módulo de notificações não é carregado e o resto do app funciona normalmente. Para receber push de verdade é preciso um **development build**:

1. Crie o projeto no EAS (precisa de uma conta Expo): `npx eas-cli@latest init`. Isso grava o `projectId` em `app.json` (`expo.extra.eas.projectId`), que o app usa para pedir o token.
2. Android: crie um projeto no Firebase, gere a chave de conta de serviço do FCM V1 e envie para o EAS (`npx eas-cli@latest credentials`). iOS: precisa de uma conta paga da Apple.
3. Gere e instale o build: `npx eas-cli@latest build --profile development --platform android` (ou `npx expo run:android` com o Android Studio instalado).
4. Abra o app pelo build (não pelo Expo Go) com `npx expo start --dev-client`.

## Comandos

| Comando                     | O que faz                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| `npx expo start`            | Inicia o servidor de desenvolvimento                                                        |
| `npx expo start -c`         | Inicia limpando o cache do Metro                                                            |
| `npm run lint`              | ESLint + Prettier                                                                           |
| `npm run typecheck`         | Checagem de tipos do TypeScript                                                             |
| `npm test`                  | Testes (Jest)                                                                               |
| `npm run format`            | Formata o código com o Prettier                                                             |
| `npx expo install <pacote>` | Adiciona dependência na versão compatível com o SDK. Use no lugar de `npm install <pacote>` |
| `npx expo-doctor`           | Diagnostica problemas de dependências e configuração                                        |

Rode `npm run lint`, `npm run typecheck` e `npm test` antes de abrir um PR. No Windows, se o lint acusar milhares de erros `Delete ␍`, é o Git convertendo as quebras de linha: `git config core.autocrlf input` e um novo checkout resolvem.

## Problemas comuns

| Sintoma                                                                    | Causa provável e solução                                                                                                                                                                 |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Login falha com erro de rede ou fica carregando                            | O celular não alcança a API. Confira se a API está de pé, se estão na mesma rede e se o firewall libera a 8080 (teste o `/health` pelo navegador do celular).                            |
| Expo Go diz que o projeto é incompatível com a versão do SDK               | Atualize o Expo Go pela loja. O projeto usa o SDK 58.                                                                                                                                    |
| Expo Go (iPhone) pede `npx expo login`                                     | Entre na mesma conta Expo no Expo Go e no computador (`npx expo login`) e reinicie o `npx expo start`.                                                                                   |
| O QR code não conecta                                                      | Rede corporativa ou de faculdade costuma bloquear conexões entre aparelhos. Tente `npx expo start --tunnel` e defina `EXPO_PUBLIC_API_URL` com um endereço da API que o celular alcance. |
| Mudei o `.env` e nada mudou                                                | Reinicie com `npx expo start -c`.                                                                                                                                                        |
| `URL da API não encontrada. Defina EXPO_PUBLIC_API_URL no .env.`           | O app não conseguiu descobrir o IP do Metro. Defina a variável no `.env`.                                                                                                                |
| Aviso `[expo-notifications] Push notifications ... unavailable in Expo Go` | Esperado no Expo Go. Veja "Notificações push".                                                                                                                                           |
| Erro depois de adicionar uma biblioteca nativa                             | O Expo Go só traz os módulos nativos dele. Bibliotecas com código nativo próprio exigem um development build.                                                                            |

## Estrutura

```
app/                  telas e rotas (expo-router): cada arquivo é uma tela
  (auth)/             entrar (A1) e criar conta (A2)
  aluno/              telas do aluno (B1 a B9)
  motorista/          telas do motorista e do chefe (C0 a C6, gestão D1 a D10)
src/api/api.ts        cliente HTTP: único lugar que chama fetch
src/repositories/     acesso aos dados, usado pelas telas (e os mocks desligados)
src/notificacoes/     push: token, aviso com o app aberto e toque na notificação
src/components/       componentes compartilhados (formulário, listas, cabeçalhos)
src/types/            tipos das respostas da API
src/theme/            cores, fontes e espaçamentos
src/utils/            funções puras (máscaras, textos, datas), com testes
docs/                 plano, checklist e protótipo das telas
```

Regras de camadas: tela (`app/`) → repositório (`src/repositories/`) → api (`src/api/api.ts`). A tela nunca chama `fetch` direto. Nenhuma regra de horário no app: as telas usam o bloco `acoes` da API.

## Documentação

| Documento                                             | Conteúdo                                                   |
| ----------------------------------------------------- | ---------------------------------------------------------- |
| `docs/plano-implementacao-frontend.md`                | Plano por entregas do app                                  |
| `docs/checklist-frontend.md`                          | O que já está pronto no app e as decisões tomadas          |
| `docs/roteiro-de-teste.md`                            | Roteiro de teste de ponta a ponta (`FEC-01`)               |
| `docs/prototipo/README.md`                            | Índice do protótipo: liga cada tela ao arquivo e à entrega |
| `../boragora-api/docs/checklist-backend.md`           | Quais endpoints da API já existem                          |
| `../boragora-api/docs/plano-implementacao-backend.md` | Formato das respostas da API                               |

## Como contribuir

1. Atualize a `master` e crie uma branch a partir dela, por exemplo `front/FND-08-nome-da-entrega`.
2. Siga a entrega em andamento no `docs/plano-implementacao-frontend.md`.
3. Rode lint, typecheck e testes.
4. Marque no `docs/checklist-frontend.md` os itens concluídos.
5. Abra um Pull Request para a `master`.
