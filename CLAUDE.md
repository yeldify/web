# CLAUDE.md

## Visão geral
Frontend do Yeldify ("web", v1) — React 18 + Vite 5 + TypeScript **strict** + React Router 6.
Consome a API FastAPI (`api/`, repo separado) com **fallback para mocks locais** quando a API
está fora do ar — o app continua navegável offline.

Leia também o [`AGENTS.md`](../AGENTS.md) na raiz do workspace: regras de trabalho, definição
de pronto e como o CI barra.

## Objetivo do projeto
Projeto de aprendizagem do autor (Product Manager, se seniorizando em engenharia de software
com IA): aplicar arquitetura limpa, tipagem estrita e boas práticas de front, com ênfase em
fluxos reais (auth, CRUD de transações/orçamentos, dashboard) em vez de maquetes.

## Stack
- React 18 + Vite 5 + TypeScript strict — sem framework de UI (CSS próprio por design).
- Rotas via `react-router-dom` v6 em `src/App.tsx`.
- Sem testes de front por enquanto — o gate é `npm run build` (`tsc && vite build`).

## Arquitetura — como o dado flui
```
[Páginas]  →  useMockData (hook único de dados)
                  │  tenta  │
                  ▼         ▼ (fallback se API fora do ar)
          src/api/*     src/mocks/*.json
          (fetch + tipos)
```

- **`src/api/types.ts`** — contrato único do front com a API (espelha os `schemas/` do back).
  Mudou contrato no back? Atualize aqui **e** os mappers em `useMockData.ts`.
- **`src/api/client.ts`** — wrapper de `fetch`: base `VITE_API_URL || '/api'` (proxy do Vite
  quando local, absoluto em produção), adiciona `user_id=user-123` como dev fallback quando
  não há token, injeta `Authorization: Bearer` quando há.
- **`src/api/index.ts`** — `api.*` com os endpoints: `login`, `listarTransacoes`,
  `criarTransacao` (`/despesas/`), `criarReceita` (`/receitas/`), `editarTransacao` (PATCH),
  `listarOrcamentos`, `criarOrcamento`, `editarOrcamento` (PUT), `dashboardMicro`.
- **`src/hooks/useMockData.ts`** — hook central que tenta a API primeiro e cai para os JSONs de
  `src/mocks/`; expõe `usandoApi` (flag), `refresh()` e os getters das páginas. Mapeia o
  contrato da API para a forma usada nas telas (ex.: status `atencao` → `limite`; `id` string).
- **`src/context/AuthContext.tsx`** — `login` (`/auth/token`, token em `localStorage
  yeldify-token`), `logout`, estado `token`/`username`. Tela `senha.tsx` usa `login('user-123')`
  (auth é mock no back).

## Páginas e fluxos
| Rota | Tela | O que liga |
|---|---|---|
| `/` | landing + identificação (mock) | cria conta/navega |
| `/senha` | login | `useAuth().login` → `/dashboard/micro` |
| `/onboarding` → `/onboarding/orcamentos` | diagnóstico + proposta | `diagnostico.json`; "Aplicar Proposta" faz POST `/orcamentos/` |
| `/dashboard/micro` | painel budget diário | `dashboardMicro` + `transacoes` + `orcamentos` |
| `/transacoes` | timeline editorial + drawer | GET/POST transações + PATCH categoria inline |
| `/orcamentos` | limites, acordeões, arquivar | GET/POST/PUT `/orcamentos/` (arquivar = `ativo:false`) |
| `/dashboard/macro` | visão macro histórica | **fora do escopo atual (dados hardcoded)** |

## Convenções
- TypeScript strict: sem `any` novo; importe tipos com `import type`.
- Português em toda UI e strings; `R$` em formato brasileiro.
- **Sem comentários de código** a menos que o pedido peça.
- CSS: por classes em `src/styles/*.css` (componentes reutilizáveis), sem lib externa.
- Nomes de componentes PascalCase; páginas em `src/pages/<rota>/index.tsx`.

## Comandos
```bash
# node/npm vivem fora do PATH (snap) — prefixe o PATH no seu shell:
PATH="/snap/node/current/bin:$PATH" npm …

# dev (porta 5173; proxy /api → localhost:8000 configurado no vite.config.ts)
npm run dev

# gate do CI (tsc + vite build)
npm run build

# lint — PENDÊNCIA: eslint não está instalado (follow-up); não rola hoje
npm run lint
```

## Pendências conhecidas
- `eslint` não instalado/`npm run lint` falha — follow-up.
- `dashboard/macro` e parte do onboarding são mocks/hardcoded.
- Auth 100% mock no back (`user-123`/`user-456`); front envia token se houver, senão `user_id`.
- `src/mocks/` são o fallback offline — manter forma compatível com `Transacao`/`Orcamento` do
  `useMockData.ts` ao editar.