import { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { useMockData } from '../../hooks/useMockData';
import type { Transacao } from '../../hooks/useMockData';

const CATEGORIAS = [
  'Alimentação',
  'Refeição',
  'Transporte',
  'Supermercado',
  'Assinaturas',
  'Saúde',
  'Lazer',
  'Renda',
  'Outros',
];

const CONTAS = [
  { label: 'Carteira Física • Dinheiro Vivo (Espécie)', metodo: 'especie' as const },
  { label: 'Nubank • Cartão de Crédito', metodo: 'cartao' as const },
  { label: 'Itaú • Conta Corrente', metodo: 'pix' as const },
  { label: 'Cartão XP • Crédito', metodo: 'cartao' as const },
];

function parseBrasileiro(valor: string): number {
  return Number.parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0;
}

export default function Transacoes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'todas' | 'despesas' | 'receitas'>('todas');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: string; currentValue: string } | null>(null);
  const [editFeedback, setEditFeedback] = useState<string | null>(null);

  // Formulário do novo lançamento
  const [novoTipo, setNovoTipo] = useState<'SAIDA' | 'ENTRADA'>('SAIDA');
  const [novoOrcamento, setNovoOrcamento] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('Outros');
  const [novaConta, setNovaConta] = useState(CONTAS[0].label);
  const [novaData, setNovaData] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { data, loading, adicionarTransacao, editarTransacao } = useMockData();
  const transactions: Transacao[] = data?.transacoes ?? [];
  const orcamentosAtivos = data?.orcamentos.filter((o) => !o.arquivado) ?? [];

  // Default ao primeiro orçamento ativo ao abrir o drawer
  useEffect(() => {
    if (isDrawerOpen && !novoOrcamento && orcamentosAtivos.length > 0) {
      setNovoOrcamento(orcamentosAtivos[0].id);
    }
  }, [isDrawerOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = searchTerm === '' || 
      tx.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.conta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.categoria ?? 'Pendente').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'todas' || 
      (activeFilter === 'despesas' && tx.tipo === 'SAIDA') ||
      (activeFilter === 'receitas' && tx.tipo === 'ENTRADA');
    return matchesSearch && matchesFilter;
  });

  // Group by date
  const grouped = filteredTransactions.reduce((acc: Record<string, Transacao[]>, tx) => {
    const d = new Date(tx.data);
    const key = `${d.getDate()} ${['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][d.getMonth()]}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(tx);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => {
    const dayA = parseInt(a.split(' ')[0]);
    const dayB = parseInt(b.split(' ')[0]);
    return dayB - dayA; // Newest first
  });

  // Get today label
  const getTodayLabel = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `Hoje • ${day} de ${monthNames[month]}`;
  };

  // Get date label
  const getDateLabel = (dateKey: string) => {
    const [dia, mesAbrev] = dateKey.split(' ');
    const mesiAbrev = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const mesiExt = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const idx = mesiAbrev.indexOf(mesAbrev);
    return `${mesiExt[idx]} • ${dia}`;
  };

  // Open drawer
  const openDrawer = () => {
    setFormError(null);
    setIsDrawerOpen(true);
  };
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    if (!submitting) {
      setNovaDescricao('');
      setNovoValor('');
      setNovaData(new Date().toISOString().split('T')[0]);
      setNovaCategoria('Outros');
      setNovoOrcamento('');
    }
  };

  // Inline category edit
  const activateInlineEdit = (id: string, current: string) => setEditingCategory({ id, currentValue: current });

  const saveCategoryInline = async (id: string, newCat: string) => {
    setEditFeedback(null);
    setEditingCategory(null);
    try {
      await editarTransacao(id, { categoria: newCat });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Falha ao salvar categoria';
      setEditFeedback(msg);
    }
  };

  const handleSubmitLancamento = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const valor = parseBrasileiro(novoValor);
    if (valor <= 0) {
      setFormError('Informe um valor maior que zero.');
      return;
    }
    if (!novaDescricao.trim()) {
      setFormError('Informe a descrição / estabelecimento.');
      return;
    }
    if (!novoOrcamento) {
      setFormError('Selecione um orçamento para o lançamento.');
      return;
    }
    const contaSelecionada = CONTAS.find((c) => c.label === novaConta) ?? CONTAS[0];
    setSubmitting(true);
    try {
      await adicionarTransacao({
        budget_id: novoOrcamento,
        tipo: novoTipo,
        valor,
        data: novaData,
        descricao: novaDescricao.trim(),
        categoria: novaCategoria,
        conta: novaConta,
        metodo_pagamento: contaSelecionada.metodo,
        pendente: false,
      });
      closeDrawer();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Falha ao criar lançamento';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => Math.abs(value).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Body overflow
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  // Close on backdrop
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.id === 'drawer-backdrop') closeDrawer();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-10 pb-40">
      <div className="container max-w-[1000px] mx-auto relative">
        <PageHeader subtitle="Extrato em Timeline Editorial" />

        <div className="transactions-toolbar">
          <div className="search-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" className="search-input" placeholder="Buscar por descrição, estabelecimento..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="toolbar-actions">
            <div className="toolbar-filters">
              <span className={`filter-item ${activeFilter === 'todas' ? 'active' : ''}`} onClick={() => setActiveFilter('todas')}>Todas</span>
              <span className={`filter-item ${activeFilter === 'despesas' ? 'active' : ''}`} onClick={() => setActiveFilter('despesas')}>Despesas</span>
              <span className={`filter-item ${activeFilter === 'receitas' ? 'active' : ''}`} onClick={() => setActiveFilter('receitas')}>Receitas</span>
            </div>
            <button className="btn-action-outline" onClick={openDrawer}>+ Novo Lançamento</button>
          </div>
        </div>

        {data?.usandoApi && (
          <div style={{ fontSize: '0.7rem', color: 'var(--texto-mutado)', fontFamily: 'var(--fonte-dados)', marginBottom: '12px' }}>
            Conectado à API {loading ? '• sincronizando…' : ''}
          </div>
        )}
        {editFeedback && (
          <div style={{ fontSize: '0.8rem', color: 'var(--alerta-vermelho)', marginBottom: '12px' }}>{editFeedback}</div>
        )}

        <div className="timeline-container">
          {loading && !data ? (
            <div className="empty-state" style={{ display: 'flex', marginTop: '40px' }}>
              <h3>Carregando transações…</h3>
            </div>
          ) : sortedDates.length > 0 ? (
            sortedDates.map((dateKey) => {
              const hoje = new Date();
              const [dia, mesAbrev] = dateKey.split(' ');
              const mesiAbrev = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
              const ehHoje = parseInt(dia) === hoje.getDate() && mesiAbrev.indexOf(mesAbrev) === hoje.getMonth();
              return (
              <div key={dateKey} className="timeline-block">
                <div className="timeline-marker-label">{ehHoje ? getTodayLabel() : getDateLabel(dateKey)}</div>
                {grouped[dateKey].map((tx) => {
                    const pendente = tx.pendente || !tx.categoria;
                    const isDespesa = tx.tipo === 'SAIDA';
                    return (
                      <div key={tx.id} className="transaction-row">
                        <div className="t-description">
                          <span className="t-title">{tx.descricao}</span>
                          <span className="t-account">{tx.conta}</span>
                        </div>
                        <div className="t-category">
                          {editingCategory?.id === tx.id ? (
                            <select className="inline-category-select" defaultValue={editingCategory.currentValue} onBlur={(e) => saveCategoryInline(tx.id, e.target.value)} onChange={(e) => saveCategoryInline(tx.id, e.target.value)} autoFocus>
                              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                          ) : pendente ? (
                            <span className="category-tag tag-pendente" onClick={() => activateInlineEdit(tx.id, tx.categoria ?? '')}>Pendente</span>
                          ) : (
                            <span className="category-tag" onClick={() => activateInlineEdit(tx.id, tx.categoria ?? '')}>{tx.categoria}</span>
                          )}
                        </div>
                        <div className={`t-amount ${isDespesa ? 'expense' : 'income'}`}>
                          <span>{isDespesa ? '-' : '+'}</span><span>R$ {formatCurrency(tx.valor)}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
              );
            })
          ) : (
            <div className="empty-state" style={{ display: 'flex', marginTop: '40px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '48px', height: '48px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              <div><h3>Nenhuma transação encontrada</h3><p>Tente ajustar seus filtros ou adicione uma nova transação.</p></div>
            </div>
          )}
        </div>
      </div>

      {isDrawerOpen && <div id="drawer-backdrop" className="drawer-backdrop open"></div>}

      <div className={`slide-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <form onSubmit={handleSubmitLancamento}>
          <div className="drawer-header">
            <h3>Novo Lançamento Manual</h3>
            <button type="button" className="drawer-close" onClick={closeDrawer}>×</button>
          </div>
          <div className="drawer-body">
            <div className="form-group">
              <label className="form-label">Tipo de Lançamento</label>
              <div className="toolbar-filters">
                <span className={`filter-item ${novoTipo === 'SAIDA' ? 'active' : ''}`} onClick={() => setNovoTipo('SAIDA')}>Despesa</span>
                <span className={`filter-item ${novoTipo === 'ENTRADA' ? 'active' : ''}`} onClick={() => setNovoTipo('ENTRADA')}>Receita</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Descrição / Estabelecimento</label>
              <input type="text" className="form-input-line" placeholder="Ex: Estacionamento, Café, Acerto..." value={novaDescricao} onChange={(e) => setNovaDescricao(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Valor</label>
              <div className="input-monetary-line-wrapper"><span>R$</span><input type="text" className="form-input-monetary" placeholder="0,00" value={novoValor} onChange={(e) => setNovoValor(e.target.value)} /></div>
            </div>
            <div className="form-group">
              <label className="form-label">Orçamento</label>
              <div className="select-wrapper">
                <select className="form-select-line" value={novoOrcamento || ''} onChange={(e) => setNovoOrcamento(e.target.value)} required>
                  <option value="" disabled>Selecione o orçamento…</option>
                  {orcamentosAtivos.map((o) => (
                    <option key={o.id} value={o.id}>{o.nome}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <div className="select-wrapper">
                <select className="form-select-line" value={novaCategoria} onChange={(e) => setNovaCategoria(e.target.value)}>
                  {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Conta / Origem (ou Dinheiro Vivo)</label>
              <div className="select-wrapper">
                <select className="form-select-line" value={novaConta} onChange={(e) => setNovaConta(e.target.value)}>
                  {CONTAS.map((c) => <option key={c.label} value={c.label}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Data</label>
              <input type="date" className="form-input-line" value={novaData} onChange={(e) => setNovaData(e.target.value)} />
            </div>
            {formError && <div style={{ color: 'var(--alerta-vermelho)', fontSize: '0.8rem', marginTop: '8px' }}>{formError}</div>}
          </div>
          <div className="drawer-footer">
            <button type="button" className="btn-cancel" onClick={closeDrawer}>Cancelar</button>
            <button type="submit" className="btn-submit-outline" disabled={submitting}>
              {submitting ? 'Adicionando…' : 'Adicionar Lançamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}