import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import type { DashboardMicro } from '../api/types';

// Tipos para os dados (forma unificada consumida pelo front)
interface Usuario {
  tipo: 'novo' | 'existente';
  nome: string;
  email: string;
  senha?: string;
}

interface Orcamento {
  id: string;
  nome: string;
  teto: number;
  gasto: number;
  status: 'ok' | 'limite' | 'estourado';
  categoria: string;
  transacoesExcedentes: number[];
  arquivado: boolean;
  notaGovernanca: string | null;
}

interface Transacao {
  id: string;
  budget_id: string;
  descricao: string;
  valor: number;
  categoria: string | null;
  data: string;
  pendente: boolean;
  tipo: 'ENTRADA' | 'SAIDA';
  metodo_pagamento: 'cartao' | 'especie' | 'pix' | 'outros';
  conta: string;
}

interface Diagnostico {
  desviosOportunidades: Array<{
    id: number;
    titulo: string;
    descricao: string;
    tipo: 'alerta' | 'desvio' | 'oportunidade';
    severidade: 'baixa' | 'media' | 'alta';
    acao: string;
  }>;
  acertosVitorias: Array<{
    id: number;
    titulo: string;
    descricao: string;
    tipo: 'acerto' | 'vitoria';
    impacto: string;
  }>;
  propostaOrcamentos: Array<{
    id: number;
    nome: string;
    tetoSugerido: number;
    tetoAtual: number;
    editavel: boolean;
  }>;
  resumo: {
    totalDespesas: number;
    totalRenda: number;
    percentualPoupanca: number;
    scoreFinanceiro: number;
  };
}

interface MockData {
  usuarios: Record<string, Usuario>;
  orcamentos: Orcamento[];
  transacoes: Transacao[];
  diagnostico: Diagnostico;
  dashboardMicro?: DashboardMicro;
  usandoApi: boolean;
}

// ---- Mappers API → forma do front ----

function mapApiTransacao(t: import('../api/types').Transacao): Transacao {
  return {
    id: t.id,
    budget_id: t.budget_id,
    descricao: t.descricao,
    valor: t.valor,
    categoria: t.categoria,
    data: t.data,
    pendente: t.pendente,
    tipo: t.tipo,
    metodo_pagamento: t.metodo_pagamento,
    conta: t.conta,
  };
}

function statusOrcamento(gasto: number, teto: number): Orcamento['status'] {
  if (gasto > teto) return 'estourado';
  if (gasto >= teto * 0.8) return 'limite';
  return 'ok';
}

function mapApiOrcamento(o: import('../api/types').Orcamento): Orcamento {
  return {
    id: o.id,
    nome: o.nome,
    teto: o.valor_planejado,
    gasto: o.gasto,
    status: statusOrcamento(o.gasto, o.valor_planejado),
    categoria: o.categoria,
    transacoesExcedentes: [],
    arquivado: !o.ativo,
    notaGovernanca: null,
  };
}

function normalizarMockTransacao(t: Record<string, unknown>): Transacao {
  return {
    id: String(t.id ?? ''),
    budget_id: String(t.budget_id ?? ''),
    descricao: String(t.descricao ?? ''),
    valor: Number(t.valor ?? 0),
    categoria: (t.categoria as Transacao['categoria']) ?? null,
    data: String(t.data ?? ''),
    pendente: Boolean(t.pendente),
    tipo: (t.tipo as Transacao['tipo']) ?? 'SAIDA',
    metodo_pagamento: (t.metodo_pagamento as Transacao['metodo_pagamento']) ?? 'outros',
    conta: String(t.conta ?? 'Não informada'),
  };
}

function normalizarMockOrcamento(o: Record<string, unknown>): Orcamento {
  const teto = Number(o.teto ?? 0);
  const gasto = Number(o.gasto ?? 0);
  return {
    id: String(o.id ?? ''),
    nome: String(o.nome ?? ''),
    teto,
    gasto,
    status: (o.status as Orcamento['status']) ?? statusOrcamento(gasto, teto),
    categoria: String(o.categoria ?? ''),
    transacoesExcedentes: Array.isArray(o.transacoesExcedentes) ? o.transacoesExcedentes : [],
    arquivado: Boolean(o.arquivado),
    notaGovernanca: (o.notaGovernanca as string | null) ?? null,
  };
}

function loadMocksFallback(): Promise<Omit<MockData, 'usandoApi'>> {
  return Promise.all([
    import('../mocks/usuarios.json'),
    import('../mocks/orcamentos.json'),
    import('../mocks/transacoes.json'),
    import('../mocks/diagnostico.json'),
  ]).then(([usuarios, orcs, txs, diag]) => ({
    usuarios: usuarios.default as MockData['usuarios'],
    orcamentos: (orcs.default as Array<Record<string, unknown>>).map(normalizarMockOrcamento),
    transacoes: (txs.default as Array<Record<string, unknown>>).map(normalizarMockTransacao),
    diagnostico: diag.default as MockData['diagnostico'],
  }));
}

// Hook para carregar dados (API com fallback para mocks locais)
export function useMockData() {
  const [data, setData] = useState<MockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      let base: Omit<MockData, 'usandoApi'>;
      let usandoApi = false;

      try {
        const [todos, micro] = await Promise.all([
          api.listarTransacoes({ page_size: 100 }),
          api.dashboardMicro(),
        ]);

        const orcamentoList = await api.listarOrcamentos({ pasta: 'todos', page_size: 100 });
        const fallback = await loadMocksFallback();

        base = {
          ...fallback,
          transacoes: todos.items.map(mapApiTransacao),
          orcamentos: orcamentoList.items.map(mapApiOrcamento),
          dashboardMicro: micro,
        };
        usandoApi = true;
      } catch (e) {
        // API indisponível → cai para os mocks locais (o front continua funcional)
        console.warn('[useMockData] API indisponível, usando mocks locais:', e);
        base = await loadMocksFallback();
      }

      if (!cancelled) {
        setData({ ...base, usandoApi });
        setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  // Função para obter usuário por CPF
  const getUsuario = (cpf: string): Usuario | null => {
    if (!data) return null;
    return data.usuarios[cpf] || null;
  };

  // Função para verificar se usuário é novo
  const isUsuarioNovo = (cpf: string): boolean => {
    return getUsuario(cpf)?.tipo === 'novo';
  };

  // Função para verificar se usuário é existente
  const isUsuarioExistente = (cpf: string): boolean => {
    return getUsuario(cpf)?.tipo === 'existente';
  };

  // Função para validar senha (mock)
  const validarSenha = (cpf: string, senha: string): boolean => {
    const usuario = getUsuario(cpf);
    if (!usuario || usuario.tipo !== 'existente') return false;
    return usuario.senha === senha;
  };

  const getOrcamentos = (): Orcamento[] => data?.orcamentos ?? [];
  const getOrcamentosAtivos = (): Orcamento[] => data?.orcamentos.filter((o) => !o.arquivado) ?? [];
  const getOrcamentosArquivados = (): Orcamento[] => data?.orcamentos.filter((o) => o.arquivado) ?? [];
  const getTransacoes = (): Transacao[] => data?.transacoes ?? [];
  const getTransacoesPendentes = (): Transacao[] => data?.transacoes.filter((t) => t.pendente) ?? [];
  const getDiagnostico = (): Diagnostico | null => data?.diagnostico ?? null;
  const getDashboardMicro = (): DashboardMicro | undefined => data?.dashboardMicro;

  const getOrcamentoPorId = (id: number | string): Orcamento | null => {
    if (!data) return null;
    return data.orcamentos.find((o) => o.id === id) || null;
  };

  const isTetoEstourado = (orcamentoId: number | string): boolean => {
    const orcamento = getOrcamentoPorId(orcamentoId);
    if (!orcamento) return false;
    return orcamento.gasto > orcamento.teto;
  };

  // Função para arquivar orçamento (local; persistência via API em /orcamentos)
  const arquivarOrcamento = (id: number | string): Orcamento[] => {
    if (!data) return [];
    const novosOrcamentos = data.orcamentos.map((o) =>
      o.id === id ? { ...o, arquivado: true } : o
    );
    setData({ ...data, orcamentos: novosOrcamentos });
    return novosOrcamentos;
  };

  // Mutação: novo lançamento (POST despesa/receita) + refresh local
  const adicionarTransacao = async (
    payload: import('../api/types').CriarTransacaoPayload & { tipo: 'ENTRADA' | 'SAIDA' }
  ): Promise<Transacao> => {
    const { tipo, ...rest } = payload;
    if (tipo === 'ENTRADA') {
      const criada = await api.criarReceita(rest);
      refresh();
      return mapApiTransacao(criada);
    }
    const criada = await api.criarTransacao(rest);
    refresh();
    return mapApiTransacao(criada);
  };

  // Mutação: edição de transação (PATCH) + refresh local
  const editarTransacao = async (
    id: string,
    campos: import('../api/types').EditarTransacaoPayload
  ): Promise<Transacao> => {
    const editada = await api.editarTransacao(id, campos);
    refresh();
    return mapApiTransacao(editada);
  };

  return {
    data,
    loading,
    error,
    refresh,
    getUsuario,
    isUsuarioNovo,
    isUsuarioExistente,
    validarSenha,
    getOrcamentos,
    getOrcamentosAtivos,
    getOrcamentosArquivados,
    getTransacoes,
    getTransacoesPendentes,
    getDiagnostico,
    getDashboardMicro,
    getOrcamentoPorId,
    isTetoEstourado,
    arquivarOrcamento,
    adicionarTransacao,
    editarTransacao,
  };
}

// Tipos exportados para uso em outros arquivos
export type { Usuario, Orcamento, Transacao, Diagnostico, MockData, DashboardMicro };