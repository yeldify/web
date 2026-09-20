# 📋 Yeldify - Plano de Implementação do Frontend (Mockado)

> **Status:** Em andamento  
> **Versão:** 1.0  
> **Data:** 18/09/2026  
> **Modo:** Somente frontend com dados mockados (sem backend)

---

## 🎯 Visão Geral

O **Yeldify** é um sistema de previsibilidade financeira com foco em **design minimalista** (inspirado na Apple) e **soberania do usuário**. Este plano detalha a implementação do **frontend estático** com dados mockados para validação rápida de UX/UI e fluxos de navegação.

**Paleta de Cores:** Papel Pólen (`#F4F1EA` como base)  
**Design:** Sem caixas pesadas, gráficos poluídos, com animações suaves (fade-in)  
**Premissa:** O sistema propõe, mas o usuário decide

---

## 📁 Estrutura do Projeto

```
frontend/
├── public/                # Assets estáticos
├── src/
│   ├── mocks/             # Dados mockados (JSON)
│   │   ├── usuarios.json
│   │   ├── orcamentos.json
│   │   ├── transacoes.json
│   │   └── diagnostico.json
│   │
│   ├── components/        # Componentes reutilizáveis
│   │   ├── CTAButton.tsx
│   │   ├── Dropzone.tsx
│   │   ├── KpiCard.tsx
│   │   ├── ComprometimentoRenda.tsx
│   │   ├── TransacaoItem.tsx
│   │   └── ...
│   │
│   ├── pages/             # Telas (1 arquivo = 1 rota)
│   │   ├── landing.tsx
│   │   ├── identificacao.tsx
│   │   ├── senha.tsx
│   │   ├── onboarding/
│   │   │   ├── boas-vindas.tsx
│   │   │   ├── upload.tsx
│   │   │   ├── processando.tsx
│   │   │   ├── diagnostico.tsx
│   │   │   └── orcamentos.tsx
│   │   ├── dashboard/
│   │   │   ├── micro.tsx
│   │   │   └── macro.tsx
│   │   ├── orcamentos/
│   │   │   └── index.tsx
│   │   └── transacoes/
│   │       └── index.tsx
│   │
│   ├── styles/            # Estilos
│   │   ├── design-system.css
│   │   ├── animations.css
│   │   └── global.css
│   │
│   ├── types/             # Tipos TypeScript
│   │   ├── Usuario.ts
│   │   ├── Orcamento.ts
│   │   └── Transacao.ts
│   │
│   ├── hooks/             # Hooks customizados
│   │   └── useMockData.ts
│   │
│   ├── App.tsx            # Rotas + Providers
│   ├── main.tsx           # Entry point
│   └── vite-env.d.ts      # Tipos Vite
│
├── package.json
├── vite.config.ts
└── PLANO_IMPLEMENTACAO.md
```

---

## 🚀 Fases de Implementação

### **📌 Fase 0: Setup (1 dia)**
**Objetivo:** Configurar ambiente e estruturas base.

| # | Passo | Ação | Artefatos | Status |
|---|-------|------|-----------|--------|
| 0.1 | Inicializar projeto Vite + React + TypeScript | `npm create vite@latest . -- --template react-ts` | `package.json`, `vite.config.ts` | ⬜ |
| 0.2 | Configurar Design System | Paleta Papel Pólen, tipografia, spacing, botões | `src/styles/design-system.css` | ⬜ |
| 0.3 | Criar arquivos de mocks | Dados JSON para usuários, orçamentos, transações | `src/mocks/*.json` | ✅ |
| 0.4 | Criar hook de dados | Hook para carregar mocks | `src/hooks/useMockData.ts` | ⬜ |
| 0.5 | Configurar rotas | React Router com rotas do fluxo | `src/App.tsx` | ⬜ |

---

### **🎨 Fase 1: Landing Page (1 dia)**
**Objetivo:** Storytelling cinematográfico em 5 atos.

| # | Passo | Ação | Artefatos | Status |
|---|-------|------|-----------|--------|
| 1.1 | Estrutura HTML | 5 seções (`ato-1` a `ato-5`) | `src/pages/landing.tsx` | ⬜ |
| 1.2 | Animações fade-in | `Intersection Observer` + CSS | `src/styles/animations.css` | ⬜ |
| 1.3 | Estilização | Fundo `#F4F1EA`, whitespace, tipografia | `src/styles/landing.css` | ⬜ |
| 1.4 | CTA fixo | Botão "Iniciar Experiência" (topo + final) | `src/components/CTAButton.tsx` | ⬜ |

---

### **🔐 Fase 2: Identificação por CPF (1 dia)**
**Objetivo:** Acesso sem fricção via CPF.

| # | Passo | Ação | Artefatos | Status |
|---|-------|------|-----------|--------|
| 2.1 | Input de CPF | Máscara `XXX.XXX.XXX-XX`, validação | `src/pages/identificacao.tsx` | ⬜ |
| 2.2 | Lógica de redirecionamento | Novo → `/onboarding/boas-vindas` / Existente → `/senha` | `src/pages/identificacao.tsx` | ⬜ |
| 2.3 | Tela de senha | Input para senha (mock: qualquer valor) | `src/pages/senha.tsx` | ⬜ |

---

### **🌱 Fase 3: Onboarding Analítico (2 dias)**
**Objetivo:** Ingestão de dados + diagnóstico + proposta de orçamentos.

| # | Passo | Ação | Artefatos | Status |
|---|-------|------|-----------|--------|
| 3.1 | Boas-vindas | Tela com manifesto + botão "Continuar" | `src/pages/onboarding/boas-vindas.tsx` | ⬜ |
| 3.2 | Dropzone | Upload de PDF/OFX (simulado) | `src/components/Dropzone.tsx` | ⬜ |
| 3.3 | Processamento | Tela de loading com mensagens dinâmicas | `src/pages/onboarding/processando.tsx` | ⬜ |
| 3.4 | Diagnóstico | Layout 2 colunas: Desvios (amarelo) / Acertos (verde) | `src/pages/onboarding/diagnostico.tsx` | ⬜ |
| 3.5 | Proposta de Orçamentos | Lista editável de tetos + botão "Entrar" | `src/pages/onboarding/orcamentos.tsx` | ⬜ |

---

### **📊 Fase 4: Mundo Operacional (MICRO) (2 dias)**
**Objetivo:** Gestão de transações e orçamentos do ciclo atual.

#### **4.1 Dashboard Micro**
| # | Passo | Ação | Artefatos | Status |
|---|-------|------|-----------|--------|
| 4.1.1 | Layout base | Header com seletor MICRO/MACRO | `src/pages/dashboard/micro.tsx` | ⬜ |
| 4.1.2 | Índice de comprometimento | Componente circular/barra (mock: 65%) | `src/components/ComprometimentoRenda.tsx` | ⬜ |
| 4.1.3 | Atalhos rápidos | Botões: "Novo Lançamento", "Ver Orçamentos", etc. | `src/components/Atalhos.tsx` | ⬜ |

#### **4.2 Orçamentos**
| # | Passo | Ação | Artefatos | Status |
|---|-------|------|-----------|--------|
| 4.2.1 | Lista de orçamentos | Tabela/acordeão com status | `src/pages/orcamentos/index.tsx` | ⬜ |
| 4.2.2 | Edição inline | Permitir editar tetos (salvar localmente) | `src/components/EditableCell.tsx` | ⬜ |
| 4.2.3 | Transações excedentes | Mostrar ao expandir acordeão | `src/components/TransacoesExcedentes.tsx` | ⬜ |
| 4.2.4 | Bulk actions | Seleção múltipla para arquivar | `src/components/BulkActions.tsx` | ⬜ |

#### **4.3 Transações (Timeline)**
| # | Passo | Ação | Artefatos | Status |
|---|-------|------|-----------|--------|
| 4.3.1 | Timeline vertical | Agrupamento: Hoje, Semana Passada, Mês Passado | `src/pages/transacoes/index.tsx` | ⬜ |
| 4.3.2 | Edição inline de categorias | Dropdown para alterar categoria | `src/components/CategoriaSelector.tsx` | ⬜ |
| 4.3.3 | Novo lançamento | Modal com campos: descrição, valor, categoria, data, tipo | `src/components/NovoLancamentoModal.tsx` | ⬜ |

#### **4.4 Relatórios (Comportamental)**
| # | Passo | Ação | Artefatos | Status |
|---|-------|------|-----------|--------|
| 4.4.1 | KPIs | Cartões: Taxa de Poupança, Média Diária | `src/components/KpiCard.tsx` | ⬜ |
| 4.4.2 | Gráfico de barras | Distribuição por categoria (linear/fino) | `src/components/BarChart.tsx` | ⬜ |

---

### **📈 Fase 5: Mundo Estratégico (MACRO) (1 dia)**
**Objetivo:** Visão de longo prazo.

| # | Passo | Ação | Artefatos | Status |
|---|-------|------|-----------|--------|
| 5.1 | Dashboard Macro | Gráfico: Curva de Patrimônio Líquido + Liquidez | `src/pages/dashboard/macro.tsx` | ⬜ |
| 5.2 | Ativos/Investimentos | Tabela: Renda Fixa (60%), Variável (30%), Fundos (10%) | `src/pages/ativos/index.tsx` | ⬜ |
| 5.3 | Previsibilidade | Calculadora de Independência Financeira | `src/components/CalculadoraIF.tsx` | ⬜ |
| 5.4 | Relatórios Macro | Histórico de Rentabilidade e Inflação | `src/pages/relatorios/macro.tsx` | ⬜ |

---

### **⚙️ Fase 6: Regras de Negócio (1 dia)**
**Objetivo:** Implementar governança e validações no frontend.

| # | Passo | Ação | Artefatos | Status |
|---|-------|------|-----------|--------|
| 6.1 | Impedir alteração de teto estourado | Desabilitar input se `gasto > teto` + tooltip | `src/pages/orcamentos/index.tsx` | ⬜ |
| 6.2 | Transações pendentes | Tag `[Pendente]` (tracejada amarela) | `src/components/TransacaoItem.tsx` | ✅ |
| 6.3 | Soberania do usuário | Ícone de edição + checkbox "Eu ratifico" | `src/components/Ratificacao.tsx` | ⬜ |

---

### **🧪 Fase 7: Testes e Ajustes (1 dia)**
**Objetivo:** Validar fluxo completo.

| # | Passo | Ação | Artefatos | Status |
|---|-------|------|-----------|--------|
| 7.1 | Testes manuais | Fluxo novo usuário: Landing → CPF → Onboarding → Dashboard | - | ⬜ |
| 7.2 | Testes manuais | Fluxo usuário existente: Landing → CPF → Senha → Dashboard | - | ⬜ |
| 7.3 | Edge cases | Upload inválido, CPF inválido, teto sem nota | - | ⬜ |
| 7.4 | Ajustes de UX | Feedback visual, responsividade | - | ⬜ |

---

## 📅 Cronograma Sugerido

| Fase | Duração | Prioridade |
|------|---------|------------|
| 0 | 1 dia | ⭐⭐⭐ |
| 1 | 1 dia | ⭐⭐⭐ |
| 2 | 1 dia | ⭐⭐⭐ |
| 3 | 2 dias | ⭐⭐⭐ |
| 4 | 2 dias | ⭐⭐⭐ |
| 6 | 1 dia | ⭐⭐⭐ |
| 5 | 1 dia | ⭐⭐ |
| 7 | 1 dia | ⭐⭐ |

**Total estimado:** 10 dias úteis

---

## 🎨 Design System

### **Cores**
```css
:root {
  /* Papel Pólen */
  --color-background: #F4F1EA;
  --color-primary: #2C3E50;
  --color-secondary: #E74C3C;
  --color-success: #27AE60;
  --color-warning: #FFC107;
  --color-error: #E74C3C;
  
  /* Neutros */
  --color-text: #2C3E50;
  --color-text-light: #7F8C8D;
  --color-border: #BDC3C7;
  
  /* Whitespace */
  --spacing-xs: 8px;
  --spacing-sm: 16px;
  --spacing-md: 24px;
  --spacing-lg: 32px;
  --spacing-xl: 48px;
}
```

### **Tipografia**
- **Fonte principal:** Inter ou Roboto (clean, minimalista)
- **Tamanhos:**
  - Títulos: 32px - 48px
  - Corpo: 16px
  - Pequeno: 14px

### **Animações**
- **Fade-in:** `opacity: 0 → 1` + `transform: translateY(20px) → 0` (500ms)
- **Trigger:** Intersection Observer (quando elemento entra na viewport)

---

## 🔧 Configurações Iniciais

### **Dependências Necessárias**
```bash
npm install react-router-dom @types/react-router-dom
npm install react-icons
npm install date-fns  # Para manipulação de datas
```

### **Script de Desenvolvimento**
```bash
cd frontend
npm run dev  # Inicia servidor local (http://localhost:5173)
```

---

## 📌 Regras de Negócio no Frontend

### **1. Governança de Orçamentos**
- **Teto estourado:** Se `gasto > teto`, desabilitar edição do teto.
- **Nota de governança:** Mostrar modal para justificar alteração.
- **Arquivamento:** Nunca deletar, apenas marcar como `arquivado: true`.

### **2. Transações**
- **Pendentes:** Se `pendente === true` ou `categoria === null`, mostrar tag `[Pendente]` (CSS: `border: 1px dashed #FFC107; color: #FFC107`).
- **Dinheiro vivo:** Suportar `metodo_pagamento: "especie"` e `conta: "Carteira Física • Espécie"`.
- **Método de pagamento:** `metodo_pagamento` é `"cartao" | "especie" | "pix" | "outros"`, alinhado ao back; `tipo` significa `ENTRADA`/`SAIDA`.

### **3. Soberania do Usuário**
- **Sugestões da IA:** Todos os campos sugeridos devem:
  - Ter ícone de editação (✏️).
  - Exigir confirmação humana (checkbox "Eu ratifico").

---

## 📝 Checklist de Entrega

- [ ] Estrutura de pastas criada
- [ ] Dados mockados (JSON) prontos
- [ ] Design System implementado
- [ ] Fluxo de navegação funcional (Landing → Onboarding → Dashboard)
- [ ] Regras de negócio aplicadas no frontend
- [ ] Testes manuais realizados
- [ ] Documentação atualizada

---

## 🔗 Links Úteis

- [Figma/Design](link-para-design)  
- [Backend (futuro)](../backend/README.md)  
- [Vite Docs](https://vitejs.dev/)  
- [React Router](https://reactrouter.com/)

---

## 📝 Notas

- **Backend:** Este plano é **100% frontend com mocks**. Integração com backend será feita em fase posterior.
- **Feedback:** Priorizar validação de UX/UI antes de implementar funcionalidades complexas.
- **Performance:** Otimizar lazy loading de componentes pesados (gráficos) futuramente.
