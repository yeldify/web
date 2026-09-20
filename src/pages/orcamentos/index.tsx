import { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { api } from '../../api';
import { useMockData } from '../../hooks/useMockData';
import type { Orcamento } from '../../hooks/useMockData';

const CATEGORIAS = [
  { value: 'alimentacao', label: 'Alimentação & Supermercado' },
  { value: 'refeicao', label: 'Refeição & Restaurantes' },
  { value: 'transporte', label: 'Transporte & Mobilidade' },
  { value: 'lazer', label: 'Lazer & Festas' },
  { value: 'assinaturas', label: 'Assinaturas' },
  { value: 'saude', label: 'Saúde' },
  { value: 'renda', label: 'Renda' },
  { value: 'outros', label: 'Outros' },
];

function parseBrasileiro(valor: string): number {
  return Number.parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0;
}

function formatMoney(value: number): string {
  return value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const STATUS_DOT = { ok: 'green', limite: 'yellow', estourado: 'red' } as const;
const STATUS_FILL = { ok: 'fill-green', limite: 'fill-yellow', estourado: 'fill-red' } as const;

export default function Orcamentos() {
  const [batchMode, setBatchMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'novo' | 'editar'>('novo');
  const [drawerBudget, setDrawerBudget] = useState<Orcamento | null>(null);
  const [hasExistingTransactions, setHasExistingTransactions] = useState(false);
  const [category, setCategory] = useState('');
  const [monthlyTarget, setMonthlyTarget] = useState('800,00');
  const [governanceNote, setGovernanceNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const { data, loading, refresh, arquivarOrcamento } = useMockData();

  const budgets = data?.orcamentos.filter((o) => !o.arquivado) ?? [];
  const archivedBudgets = data?.orcamentos.filter((o) => o.arquivado) ?? [];
  const transacoes = data?.transacoes ?? [];

  // Toggle batch mode
  const toggleBatchMode = () => {
    setBatchMode(!batchMode);
    if (batchMode) setSelectedItems(new Set());
  };

  // Handle checkbox
  const handleCheckboxChange = (budgetId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(budgetId)) newSet.delete(budgetId);
      else newSet.add(budgetId);
      return newSet;
    });
  };

  // Toggle accordion
  const toggleAccordion = (budgetId: string, e: React.MouseEvent) => {
    if (batchMode) { e.stopPropagation(); return; }
    setActiveAccordion(prev => prev === budgetId ? null : budgetId);
  };

  // Open drawer
  const openDrawer = (mode: 'novo' | 'editar', budget?: Orcamento, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFeedback(null);
    setDrawerMode(mode);
    setDrawerBudget(budget ?? null);
    const temTransacoes = !!(budget && transacoes.some((t) => t.budget_id === budget.id));
    setHasExistingTransactions(mode === 'editar' && temTransacoes);
    setCategory(budget?.categoria ?? '');
    setMonthlyTarget(budget ? formatMoney(budget.teto) : '800,00');
    setGovernanceNote('');
    setIsDrawerOpen(true);
  };

  // Close drawer
  const closeDrawer = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsDrawerOpen(false);
    setCategory('');
    setMonthlyTarget('800,00');
    setGovernanceNote('');
    setDrawerBudget(null);
  };

  // Archive budget (PUT ativo=false)
  const archiveBudget = async (budgetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFeedback(null);
    try {
      await api.editarOrcamento(budgetId, { ativo: false });
      arquivarOrcamento(budgetId);
      refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Falha ao arquivar orçamento';
      setFeedback(msg);
    }
  };

  // Archive selected
  const archiveSelected = async () => {
    setFeedback(null);
    try {
      await Promise.all(
        Array.from(selectedItems).map((id) => api.editarOrcamento(id, { ativo: false }))
      );
      refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Falha ao arquivar selecionados';
      setFeedback(msg);
    }
    toggleBatchMode();
  };

  // Reactivate (PUT ativo=true)
  const reactivateBudget = async (budgetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFeedback(null);
    try {
      await api.editarOrcamento(budgetId, { ativo: true });
      refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Falha ao reativar orçamento';
      setFeedback(msg);
    }
  };

  // Save drawer
  const handleSave = async () => {
    setFeedback(null);
    const valor = parseBrasileiro(monthlyTarget);
    if (valor <= 0) {
      setFeedback('Informe um valor alvo válido maior que zero.');
      return;
    }
    if (drawerMode === 'novo' && !category) {
      setFeedback('Selecione a categoria do novo orçamento.');
      return;
    }
    if (drawerMode === 'editar' && hasExistingTransactions && !governanceNote.trim()) {
      setFeedback('Justificativa obrigatória para alterar orçamento com movimentações.');
      return;
    }
    setSaving(true);
    try {
      if (drawerMode === 'novo') {
        const cat = CATEGORIAS.find((c) => c.value === category) ?? CATEGORIAS[CATEGORIAS.length - 1];
        await api.criarOrcamento({ nome: cat.label, categoria: cat.value, valor, validade_meses: 1 });
      } else if (drawerBudget) {
        const notas = governanceNote.trim();
        await api.editarOrcamento(drawerBudget.id, {
          valor,
          ...(notas ? { nota_governanca: notas } : {}),
        });
      }
      refresh();
      closeDrawer();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar orçamento';
      setFeedback(msg);
    } finally {
      setSaving(false);
    }
  };

  // Format percentage
  const formatPercentage = (value: number) => value.toFixed(value % 1 === 0 ? 0 : 1);

  // Get percentage color
  const getPercentageColor = (p: number) => {
    if (p > 100) return 'var(--alerta-vermelho)';
    if (p >= 80) return 'var(--alerta-amarelo)';
    return 'var(--texto-principal)';
  };

  // Body class for batch mode
  useEffect(() => {
    document.body.classList.toggle('batch-mode', batchMode);
    return () => document.body.classList.remove('batch-mode');
  }, [batchMode]);

  // Body overflow for drawer
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  // Close drawer on backdrop click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.id === 'drawer-backdrop') closeDrawer();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-10 pb-40">
      <div className="container max-w-[1000px] mx-auto relative">
        <PageHeader />

        <div className="section-header">
          <h2>Categorias e Limites</h2>
          <div className="header-actions">
            <button className={`btn-text-action ${batchMode ? 'active-batch' : ''}`} onClick={toggleBatchMode}>
              {batchMode ? 'Cancelar Lote' : 'Gerenciar Lote'}
            </button>
              <button className="btn-primary-outline" onClick={(e) => openDrawer('novo', undefined, e)}>
              + Novo Orçamento
            </button>
          </div>
        </div>

        {data?.usandoApi && (
          <div style={{ fontSize: '0.7rem', color: 'var(--texto-mutado)', fontFamily: 'var(--fonte-dados)', marginBottom: '12px' }}>
            Conectado à API {loading ? '• sincronizando…' : ''}
          </div>
        )}
        {feedback && <div style={{ fontSize: '0.8rem', color: 'var(--alerta-vermelho)', marginBottom: '12px' }}>{feedback}</div>}

        <div className="budgets-list-container">
          {budgets.map((budget) => {
            const percentage = budget.teto > 0 ? (budget.gasto / budget.teto) * 100 : 0;
            const statusColor = STATUS_DOT[budget.status];
            const exceedido = percentage > 100;
            const budgetTransacoes = transacoes.filter((t) => t.budget_id === budget.id);
            return (
            <div key={budget.id} className={`budget-row ${activeAccordion === budget.id ? 'active' : ''}`} onClick={(e) => toggleAccordion(budget.id, e)}>
              <div className="budget-main-line">
                <div className="batch-checkbox-wrapper">
                  <input type="checkbox" className="batch-checkbox" onClick={(e) => e.stopPropagation()} onChange={(e) => handleCheckboxChange(budget.id, e)} checked={selectedItems.has(budget.id)} />
                </div>
                <div className="b-meta">
                  <div className={`status-dot dot-${statusColor}`}></div>
                  <span className="b-name">{budget.nome}</span>
                </div>
                <div className="b-progress-area">
                  <div className="progress-track"><div className={`progress-fill ${STATUS_FILL[budget.status]}`} style={{ width: `${Math.min(100, percentage)}%` }}></div></div>
                  <span style={{ fontFamily: 'var(--fonte-dados)', fontSize: '0.7rem', color: getPercentageColor(percentage), whiteSpace: 'nowrap' }}>{formatPercentage(percentage)}%</span>
                </div>
                <div className="b-numbers-area">
                  <span><strong>R$ {formatMoney(budget.gasto)}</strong> / R$ {formatMoney(budget.teto)}</span>
                  <div className="row-actions">
                    <svg className="action-icon" onClick={(e) => openDrawer('editar', budget, e)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    <svg className="action-icon" onClick={(e) => archiveBudget(budget.id, e)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
                  </div>
                </div>
              </div>
              {activeAccordion === budget.id && (
                <div className="budget-accordion">
                  <div className="acc-title">{exceedido ? 'Transações que ultrapassaram o teto' : 'Transações recentes'}</div>
                  <div className="acc-list">
                    {budgetTransacoes.length > 0 ? (
                      budgetTransacoes
                        .slice(0, exceedido ? 10 : 5)
                        .map((tx) => (
                          <div key={tx.id} className="acc-item">
                            <div className="acc-info">
                              <span className="acc-date">{new Date(tx.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                              <span>{tx.descricao}{tx.pendente ? ' (pendente)' : ''}</span>
                            </div>
                            <div className="acc-valor">{tx.tipo === 'SAIDA' ? `- R$ ${formatMoney(tx.valor)}` : `+ R$ ${formatMoney(tx.valor)}`}</div>
                          </div>
                        ))
                    ) : (
                      <div className="acc-item">
                        <div className="acc-info"><span>Sem lançamentos neste orçamento.</span></div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            );
          })}
          {budgets.length === 0 && (
            <div className="empty-state">
              <h3>Nenhum orçamento ativo</h3>
              <p>Crie um novo orçamento para começar a acompanhar seus gastos.</p>
            </div>
          )}
        </div>

        <div className="archived-section-wrapper">
          <span className="archived-toggle-link" onClick={() => setShowArchived(!showArchived)}>
            <svg style={{ width: '12px', height: '12px', transform: showArchived ? 'rotate(180deg)' : 'none' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            Ver orçamentos arquivados ({archivedBudgets.length})
          </span>
          {showArchived && (
            <div className="archived-list open">
              {archivedBudgets.map((b) => (
                <div key={b.id} className="archived-row">
                  <div className="archived-row-info"><span style={{ fontWeight: 500, color: 'var(--texto-principal)' }}>{b.nome}</span><span className="archived-badge">Arquivado</span></div>
                  <button className="btn-reactivate" onClick={(e) => reactivateBudget(b.id, e)}>Reativar</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {batchMode && selectedItems.size > 0 && (
        <div className="batch-toolbar visible"><span>{selectedItems.size} selecionado(s)</span><button className="btn-batch-action" onClick={archiveSelected}>Arquivar Selecionados</button></div>
      )}

      {isDrawerOpen && <div id="drawer-backdrop" className="drawer-backdrop open"></div>}

      <div className={`slide-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>{drawerMode === 'editar' && drawerBudget ? `Editar Orçamento: ${drawerBudget.nome}` : 'Novo Orçamento'}</h3>
          <button className="drawer-close" onClick={closeDrawer}>×</button>
        </div>
        <div className="drawer-body">
          {drawerMode === 'editar' && hasExistingTransactions && (
            <div className="governance-notice">
              <strong>Nota de Governança:</strong> Este orçamento já possui movimentações em Setembro. Alterar o teto agora ajusta a projeção futura, mas registra auditoria de alteração tardia.
              {drawerBudget?.notaGovernanca && (
                <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--texto-mutado)' }}>
                  Última justificativa registrada: “{drawerBudget.notaGovernanca}”
                </div>
              )}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Categoria</label>
            <div className="select-wrapper">
              <select className="form-select-line" value={category} onChange={(e) => setCategory(e.target.value)} disabled={drawerMode === 'editar'}>
                <option value="" disabled>Selecione a categoria...</option>
                {CATEGORIAS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Valor Alvo Mensal</label>
            <div className="input-monetary-line-wrapper"><span>R$</span><input type="text" className="form-input-monetary" value={monthlyTarget} onChange={(e) => setMonthlyTarget(e.target.value)} placeholder="0,00" /></div>
          </div>
          {drawerMode === 'editar' && hasExistingTransactions && (
            <div className="form-group">
              <label className="form-label">Justificativa (obrigatório)</label>
              <textarea className="form-input-line" value={governanceNote} onChange={(e) => setGovernanceNote(e.target.value)} placeholder="Explique por que está alterando este orçamento..." rows={3} style={{ resize: 'none', borderBottom: '1px solid var(--linha-divisoria)', padding: '10px 0' }} />
            </div>
          )}
          {feedback && <div style={{ color: 'var(--alerta-vermelho)', fontSize: '0.8rem', margin: '8px 0' }}>{feedback}</div>}
        </div>
        <div className="drawer-footer">
          <button className="btn-cancel" onClick={closeDrawer}>Cancelar</button>
          <button className="btn-submit-outline" onClick={handleSave} disabled={saving || (drawerMode === 'editar' && hasExistingTransactions && !governanceNote)}>
            {saving ? 'Salvando…' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}