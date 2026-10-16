# Boragora Viagens — App

React Native + Expo + expo-router, em TypeScript. Consome a API de boragora-api/.

## Documentos
- ../docs/plano-implementacao-frontend.md — ler a entrega em execução e as seções 1 e 2
- ../docs/checklist-frontend.md — marcar os itens conforme forem concluídos
- ../docs/checklist-backend.md — conferir se a etapa do backend que a entrega usa está concluída
- ../docs/plano-implementacao-backend.md — consultar o formato das respostas da API

## Protótipo das telas (../docs/prototipo/)
- Índice em ../docs/prototipo/README.md: liga cada tela (A1, B3, D5...) ao arquivo e à entrega.
- Antes de construir uma tela, abrir a imagem dela em ../docs/prototipo/png/.
- Para valores exatos (cores, tamanhos, espaçamentos, textos), ler o arquivo de mesmo nome em ../docs/prototipo/html/.
- O HTML é um mockup estático: não copiar a estrutura nem colocá-lo no app. Construir com componentes React Native e com o tema de src/theme/.
- Nomes, números e horários das telas são dados de exemplo; os dados reais vêm da API.
- Logo e símbolo em ../docs/prototipo/assets/; ícones do app em ../docs/prototipo/marca/.
- Se o protótipo e o plano divergirem, vale o plano. Registrar a divergência na tabela de decisões do checklist.

## Regras de trabalho
- Executar uma entrega por vez, seguindo a seção 9 do plano.
- Camadas: tela (app/) → repositório (src/repositories/) → api (src/api/api.ts). Tela nunca chama fetch.
- Tipos da API só em src/types/. Nenhuma regra de horário no app: usar o bloco `acoes` da API.
- Endpoint que ainda não existe: usar o objeto fixo de src/repositories/mocks/ e anotar "aguardando EN" no checklist.

## Comandos (rodar dentro de boragora-mobile/)
- Iniciar: npx expo start
- Lint: npm run lint
- Testes: npm test
