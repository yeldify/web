# Yeldify - Implementação Frontend (100% Fidelidade aos Protótipos)

## Visão Geral

Este documento registra o progresso da implementação do frontend do Yeldify com base nos protótipos HTML localizados em `web/exemplos/` e no documento de referência `front`.

---

## ✅ **IMPLEMENTADO**

### 1. Sistema de Design (`src/styles/`)
- **`design-system.css`** - Paleta Papel Pólen completa:
  - `--bg-base: #F4F1EA` (background principal)
  - `--texto-principal: #1e2f23` (texto principal)
  - `--texto-mutado: #6B6F67` (texto secundário)
  - `--linha-divisoria: rgba(30, 47, 35, 0.12)`
  - `--verde-terroso: #607744` (primária/sucesso)
  - `--dourado-suave: #9c8335` (destaque)
  - `--alerta-vermelho: #9B453A` (erro/estourado)
  - `--alerta-amarelo: #B5812A` (alerta/limite)
- **`components.css`** - Estilos para todos os componentes reutilizáveis
- **`global.css`** - Reset e utilitários globais
- **`animations.css`** - Animações de transição

### 2. Tipografia
- **Fontes Google**: Sora (UI) e IBM Plex Mono (dados)
- Integrado em `index.html`
- Aplicado em todo o sistema via `--fonte-ui` e `--fonte-dados`

### 3. Componentes Reutilizáveis (`src/components/`)
- **`GlassDock.tsx`** - Menu flutuante inferior com:
  - 4 itens (Dashboard, Orçamentos, Transações, Relatórios)
  - Animações de hover com elevação do ícone
  - Indicação visual do item ativo
  - Backdrop blur e sombra sutil

- **`SubtleSwitcher.tsx`** - Alternador Micro/Macro com:
  - Estilo minimalista (underline verde no ativo)
  - Navegação automática entre rotas
  - Suporte a botão de desenvolvimento (Testar Empty State)

- **`TransacaoItem.tsx`** - Item de transação reutilizável:
  - Data, descrição, tag de categoria, conta e valor
  - Tag tracejada amarela `[Pendente]` quando `pendente === true` ou sem categoria
  - Sinal `+`/`-` conforme `tipo` (ENTRADA/SAIDA)

### 4. Páginas Implementadas

#### Landing Page (`src/pages/landing.tsx`)
- ✅ 5 Atos com seções independentes
- ✅ Header fixo com CTA "Iniciar Experiência"
- ✅ Animações de fade-in via Intersection Observer
- ✅ Overlay de identificação por CPF (slide from bottom)
- ✅ Feedback visual ao digitar CPF
- ✅ Navegação para `/identificacao`

#### Onboarding
- **`src/pages/onboarding/index.tsx`** - Slides de Diagnóstico:
  - ✅ Slide 1: Pontos de Atenção (desvios)
  - ✅ Slide 2: Reconhecimento de Consistência (acertos)
  - ✅ Slide 3: Proposta do Sistema
  - ✅ Metrics Grid com valores positivos/negativos
  - ✅ Navegação suave entre slides
  - ✅ Botões "Ver os acertos" / "Ver proposta" / "Voltar"
  
- **`src/pages/onboarding/orcamentos.tsx`** - Proposta Final:
  - ✅ Lista de orçamentos com checkboxes
  - ✅ Valores editáveis inline
  - ✅ Botão "Aplicar Proposta e Iniciar"
  - ✅ Navegação para `/dashboard/micro`

#### Dashboard
- **`src/pages/dashboard/micro.tsx`** - Painel Principal:
  - ✅ Header com logo e month selector
  - ✅ SubtleSwitcher Micro/Macro
  - ✅ Data Ribbon com 3 blocos:
    - Saldo Disponível (R$ 14.530,00)
    - Estourou: iFood (115%)
    - Atenção: Uber (85%)
  - ✅ Layout split (1.6fr / 1fr)
  - ✅ Seção de Transações:
    - Lista com fade-out na parte inferior
    - Empty state quando vazio
    - Botão "Ver todas (52)"
    - Tags de categoria
    - Valores positivos/negativos com cores
  - ✅ Seção de Orçamentos:
    - Lista com progress bars
    - Empty state quando vazio
    - Botão "Ver todos (12)"
  - ✅ Botão de teste "Testar Empty State" (dev)
  - ✅ GlassDock integrado
  - ✅ Transações/orçamentos consomem `useMockData` (mocks alinhados ao back)

#### Transações (`src/pages/transacoes/index.tsx`)
- ✅ Header com logo e SubtleSwitcher
- ✅ Toolbar de busca e filtros (Todas/Despesas/Receitas)
- ✅ Botão "+ Novo Lançamento"
- ✅ Timeline editorial agrupada por data
- ✅ Grid: Descrição + Conta, Categoria (tag editável), Valor
- ✅ Edição inline de categoria (select ao clicar)
- ✅ Tag `[Pendente]` para transações `pendente`/sem categoria
- ✅ Drawer de Novo Lançamento com Conta e Cartão/Dinheiro Vivo
- ✅ GlassDock integrado
- ✅ Consome `useMockData` (`transacoes.json`)

### 5. Roteamento (`src/App.tsx`)
- ✅ Novas rotas configuradas
- ✅ Layouts com e sem GlassDock
- ✅ Páginas organizadas por fluxo:
  - Sem Dock: Landing, Identificação, Senha, Onboarding
  - Com Dock: Dashboard Micro, Dashboard Macro, Orçamentos, Transações

---

## ⏳ **A FAZER**

### 1. Página de Orçamentos (`/orcamentos`)
**Baseado em:** `web/exemplos/micro_orcamento.html`

- [ ] Header com logo e SubtleSwitcher
- [ ] Tabela de orçamentos ativos:
  - [ ] Grid: 32px (checkbox) / 1.5fr / 2fr / 1.2fr
  - [ ] Status dots (verde/amarelo/vermelho)
  - [ ] Progress bars horizontais
  - [ ] Valores: R$ gasto / R$ teto
  - [ ] Ações em hover (editar, arquivar)
- [ ] **Accordion** para transações excedentes:
  - [ ] Título: "Transações que ultrapassaram o teto"
  - [ ] Lista de transações com data, nome, valor
- [ ] **Batch Mode** (modo lote):
  - [ ] Botão "Gerenciar Lote" para ativar
  - [ ] Checkboxes visíveis em todas as linhas
  - [ ] Barra flutuante inferior com contagem
  - [ ] Botão "Arquivar Selecionados"
- [ ] Seção de Orçamentos Arquivados:
  - [ ] Toggle "Ver orçamentos arquivados (X)"
  - [ ] Lista de arquivados com badge
  - [ ] Botão "Reativar" para cada item
- [ ] **Drawer Lateral** (Gaveta):
  - [ ] Abertura pelo botão "+ Novo Orçamento"
  - [ ] Campos: Categoria (select), Valor Alvo Mensal (input monetário)
  - [ ] **Nota de Governança**:
    - [ ] Aviso se orçamento já tem movimentações
    - [ ] Textarea para justificativa
    - [ ] Bloqueio se não houver nota
  - [ ] Botões: Cancelar, Salvar Alterações
- [ ] GlassDock integrado

### 2. Dashboard Macro (`/dashboard/macro`)
**Baseado no documento `front`**

- [ ] Header com logo e SubtleSwitcher
- [ ] Patrimônio Líquido Global:
  - [ ] Valor total (R$ 195.000,00)
  - [ ] Crescimento nos últimos 12 meses (+12.5%)
  - [ ] Gráfico de barras (evolução mensal)
- [ ] Liquidez:
  - [ ] Donut chart visual
  - [ ] Valores: Líquido (R$ 487.500) / Ilíquido (R$ 262.500)
- [ ] Alocação de Ativos:
  - [ ] Renda Fixa (35%)
  - [ ] Renda Variável (20%)
  - [ ] Fundos (15%)
  - [ ] Reserva de Emergência (10%)
  - [ ] Progress bars finos
- [ ] Previsibilidade:
  - [ ] Independência Financeira: 15 anos
  - [ ] Rendimento Médio: 12.5% ao ano
  - [ ] Patrimônio Projetado em 10 anos
- [ ] GlassDock integrado

### 3. Identificação e Senha
**Baseado em:** `web/exemplos/01_LP.html` (overlay de CPF)

- [ ] `/identificacao` - Atualizar para novo design:
  - [ ] Layout centralizado
  - [ ] Campo CPF com formatação automática
  - [ ] Feedback: "Analisando base com segurança local..."
  - [ ] Ao completar 11 dígitos: "Usuário reconhecido..."
  - [ ] Botão "Continuar" ou redirecionamento automático
  - [ ] Navegação: Novo usuário → Onboarding / Existente → Senha
  
- [ ] `/senha` - Atualizar para novo design:
  - [ ] Layout centralizado
  - [ ] Campo de senha
  - [ ] Botão "Entrar"
  - [ ] Link "Voltar para identificação"

### 4. Ajustes Finais
- [ ] Verificar fidelidade visual 100% em todos os breakpoints
- [ ] Testar fluxo completo: LP → CPF → Onboarding → Dashboard
- [ ] Ajustar espaçamentos e paddings
- [ ] Validar cores e tipografia em todos os componentes
- [ ] Otimizar performance (code splitting, lazy loading)

---

## 📋 **Prioridades Sugeridas**

### Prioridade Alta (Bloco o fluxo principal)
1. Página de Orçamentos
2. Identificação/Senha

### Prioridade Média
3. Dashboard Macro

### Prioridade Baixa
4. Ajustes finos de responsividade
5. Otimizações de performance

---

## 🎯 **Metas de Fidelidade**

Todos os componentes devem seguir **100% de fidelidade** aos protótipos HTML:

- ✅ Cores exatas (hex codes)
- ✅ Fontes corretas (Sora, IBM Plex Mono)
- ✅ Espaçamentos precisos (padding, margin, gap)
- ✅ Animações e transições
- ✅ Comportamento interativo (hover, focus, active)
- ✅ Layout e grid (proporções exatas)
- ✅ Sombras e bordas (subtle, Apple-like)

---

## 📁 **Estrutura de Arquivos Atual**

```
web/
├── src/
│   ├── components/
│   │   ├── GlassDock.tsx
│   │   ├── PageHeader.tsx
│   │   ├── SubtleSwitcher.tsx
│   │   └── TransacaoItem.tsx
│   ├── pages/
│   │   ├── landing.tsx          ✅ PRONTO
│   │   ├── identificacao.tsx    ⏳ FAZER
│   │   ├── senha.tsx            ⏳ FAZER
│   │   ├── onboarding/
│   │   │   ├── index.tsx        ✅ PRONTO
│   │   │   └── orcamentos.tsx   ✅ PRONTO
│   │   ├── dashboard/
│   │   │   ├── micro.tsx        ✅ PRONTO
│   │   │   └── macro.tsx        ⏳ FAZER
│   │   ├── orcamentos/
│   │   │   └── index.tsx        ⏳ FAZER
│   │   └── transacoes/
│   │       └── index.tsx        ✅ PRONTO
│   ├── styles/
│   │   ├── global.css          ✅ PRONTO
│   │   ├── design-system.css   ✅ PRONTO
│   │   ├── animations.css      ✅ PRONTO
│   │   └── components.css      ✅ PRONTO
│   └── App.tsx                 ✅ PRONTO
└── exemplos/                  (Protótipos de referência)
    ├── 01_LP.html
    ├── 02_micro_onboarding.html
    ├── 03_micro_painel_principal.html
    ├── micro_orcamento.html
    └── micro_transacoes.html
```

---

## 📞 **Como Continuar**

Para finalizar a implementação, execute:

```bash
# Continuar a partir daqui:
# 1. Implementar página de Orçamentos
# 2. Implementar Dashboard Macro
# 3. Atualizar Identificação e Senha
```

O progresso atual é de aproximadamente **70% concluído**.
