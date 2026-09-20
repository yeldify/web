# Yeldify Web

**[hialth/web](https://github.com/hialth/web)** · Frontend da plataforma de previsibilidade financeira **Yeldify**.

> Design minimalista "Apple-like", paleta Papel Pólen, **zero caixas brancas** — o sistema propõe, o usuário decide.

[![CI](https://github.com/hialth/web/actions/workflows/ci.yml/badge.svg)](https://github.com/hialth/web/actions/workflows/ci.yml)

---

## Visão geral

Interface do **Yeldify** em **React 18 + Vite 5 + TypeScript strict**, sem framework de UI (CSS próprio,
fiel a um *brand manual* editorial). O app consome a **[Yeldify API](https://github.com/hialth/yeldify-api)**
com **fallback automático para mocks locais** — se o backend estiver fora, o fluxo inteiro continua navegável.

A experiência é dividida em dois mundos:

- **[ MICRO ]** — o mês operacional: dashboard, orçamentos (com governança de teto), transações em timeline.
- **[ MACRO ]** — o longo patrimônio: curva de net worth, liquidez, alocação de ativos e previsibilidade.

![Screenshot em breve](https://via.placeholder.com/1200x630/607744/F4F1EA?text=Yeldify+—+Dashboard+Micro)

## Funcionalidades

- **Landing em 5 Atos** — storytelling cinematográfico com *fade-in* via Intersection Observer e overlay de acesso por CPF.
- **Acesso sem fricção** — identificação por CPF que resolve *novo usuário → onboarding* ou *existente → senha*.
- **Onboarding Analítico** — diagnóstico em 2 eixos (desvios/oportunidades × acertos/vitórias) + proposta de tetos **editável antes de entrar**.
- **Dashboard Micro** — saldo disponível, índice de comprometimento, desvios/estourados, transações e orçamentos recentes.
- **Orçamentos** — progress bars finas, status visual, **modo lote** (arquivar vários), arquivados com reativação e **nota de governança** exigida ao alterar teto com movimentações.
- **Transações** — timeline editorial agrupada (Hoje/Semana), edição inline de categoria, tag tracejada `[Pendente]`, drawer de novo lançamento com **dinheiro vivo (espécie)**.
- **Dashboard Macro** — patrimônio líquido, liquidez (donut), alocação de ativos e projeção de independência financeira.
- **Fallback resiliente** — API primeiro; mocks locais quando offline (flag `usandoApi` visível).

## Stack

- **React 18** + **React Router 6**
- **Vite 5** + **TypeScript strict** (`tsc && vite build` como gate)
- CSS puro do design system (`src/styles/`) — Sora (UI) e IBM Plex Mono (dados)

## Estrutura

```
web/
├── src/
│   ├── api/                  # Cliente HTTP tipado (client.ts, types.ts)
│   ├── components/           # GlassDock, SubtleSwitcher, TransacaoItem, PageHeader
│   ├── context/              # AuthContext (token JWT)
│   ├── hooks/                # useMockData — API com fallback p/ mocks
│   ├── mocks/                # dados locais (orcamentos, transacoes, diagnostico)
│   ├── pages/                # 1 arquivo = 1 rota (landing, onboarding, micro, macro…)
│   ├── styles/               # design-system, components, animations, global
│   └── App.tsx               # rotas + layouts (com/sem GlassDock)
├── exemplos/                 # protótipos HTML de referência
└── .github/workflows/ci.yml  # Pipeline GitHub Actions
```

## Como rodar

```bash
npm install
npm run dev        # http://localhost:5173 (proxy /api → localhost:8000)

npm run build      # gate: tsc + vite build
npm run preview    # serve o build de produção
```

### Conectar à API

O Vite faz proxy de `/api` para `http://localhost:8000` (remove o prefixo). Para apontar direto:

```bash
VITE_API_URL=http://localhost:8000 npm run dev
```

> Sem a API no ar, o app cai para os mocks de `src/mocks/` e segue 100% funcional.

## Rotas

| Rota | Tela | GlassDock |
|------|------|-----------|
| `/` | Landing (5 Atos) | — |
| `/identificacao` | Acesso por CPF | — |
| `/senha` | Validação (usuário existente) | — |
| `/onboarding` · `/onboarding/orcamentos` | Diagnóstico + proposta | — |
| `/dashboard/micro` | Mundo operacional (mês) | ✅ |
| `/orcamentos` · `/transacoes` | Gestão de tetos e lançamentos | ✅ |
| `/dashboard/macro` | Mundo estratégico (patrimônio) | ✅ |

## Design system (resumo)

| Token | Hex |
|-------|-----|
| Papel Pólen (fundo) | `#F4F1EA` |
| Verde Terroso (primária) | `#607744` |
| Dourado Suave (destaque) | `#C5B358` |
| Grafite Editorial (texto) | `#2C322B` |
| Estourado / Alerta | `#9B453A` / `#B5812A` |

Regra de ouro: **proibido** cards brancos, gráficos poluídos e notificações agressivas. A interface respira.

## CI/CD

`main` é protegida — mudanças entram via **Pull Request**.

| Job | O que valida |
|-----|--------------|
| **build** | `npm ci` + `npm run build` (typecheck + bundling) |

> Próximo passo documentado no workspace: adicionar **lint** (ESLint) ao pipeline.

## Documentação complementar

- `PLANO_IMPLEMENTACAO.md` — plano original do frontend (mockado → integrado)
- `IMPLEMENTACAO_FRONT.md` — status da implementação e fidelidade aos protótipos
- Backend: **[hialth/yeldify-api](https://github.com/hialth/yeldify-api)**
- Brand manual e arquitetura do produto: `documentacao/` do workspace raiz