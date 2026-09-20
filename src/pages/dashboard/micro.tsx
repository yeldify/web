import { useState } from 'react';
import SubtleSwitcher from '../../components/SubtleSwitcher';
import TransacaoItem from '../../components/TransacaoItem';
import { useMockData } from '../../hooks/useMockData';

function formatCurrency(value: number): string {
  const partes = value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.').split('.');
  return `${partes[0]},${partes[1] ?? '00'}`;
}

export default function DashboardMicro() {
  const [isEmpty, setIsEmpty] = useState(false);
  const { data, getDashboardMicro } = useMockData();

  const transacoes = data?.transacoes ?? [];
  const orcamentos = data?.orcamentos.filter(o => !o.arquivado) ?? [];
  const micro = getDashboardMicro();

  const usandoApi = !!micro;

  // Dados do ribbon: API quando disponível, senão fallback visual
  const saldo = micro?.resumo.saldo_disponivel ?? 14530;
  const estourado = micro?.orcamentos?.find(o => o.status === 'estourado') ?? null;
  const atencao = micro?.orcamentos?.find(o => o.status === 'atencao') ?? null;

  const estouradoExcedente = estourado ? estourado.gasto - estourado.teto : 75;
  const atencaoRestam = atencao ? atencao.teto - atencao.gasto : 60;
  const atencaoDias = atencao ? (micro?.desvios?.find(d => d.budget_id === atencao.id)?.dias_restantes ?? 12) : 12;

  const toggleDados = () => {
    setIsEmpty(!isEmpty);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-10 pb-40">
      <div className="mx-auto max-w-[1200px] relative">
        {/* HEADER */}
        <header className="flex justify-between items-end mb-14">
          <div className="header-left">
            <div className="logo-wrapper flex items-baseline gap-4">
              <div className="logo">
                <h1>Yeldify</h1>
              </div>
              <div className="month-selector flex items-center gap-3 text-sm font-medium" style={{ color: 'var(--texto-mutado)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5 cursor-pointer">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Setembro 2026
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5 cursor-pointer">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {usandoApi && (
              <span style={{ fontSize: '0.7rem', color: 'var(--texto-mutado)', fontFamily: 'var(--fonte-dados)' }}>
                Conectado à API
              </span>
            )}
            <button className="dev-toggle" onClick={toggleDados}>
              {isEmpty ? 'Voltar com Dados' : 'Testar Empty State'}
            </button>
            <SubtleSwitcher />
          </div>
        </header>

        {/* DATA RIBBON */}
        <div className="data-ribbon">
          <div className="data-block">
            <div className="data-label">Saldo Disponível</div>
            <div className="data-value color-gold">
              <span className="data-currency">R$</span>{formatCurrency(saldo).split(',')[0]}<span style={{ fontSize: '1.2rem' }}>,{formatCurrency(saldo).split(',')[1]}</span>
            </div>
            <div className="data-subtext">Caixa real consolidado</div>
          </div>
          {estourado ? (
            <div className="data-block">
              <div className="data-label">
                <div className="status-dot dot-red"></div>Estourou: {estourado.nome}
              </div>
              <div className="data-value color-red">{Math.round(estourado.percentual)}<span className="data-currency">%</span></div>
              <div className="data-subtext">Você passou R$ {formatCurrency(estouradoExcedente)} do limite.</div>
            </div>
          ) : (
            <div className="data-block">
              <div className="data-label">
                <div className="status-dot dot-red"></div>Estourou: iFood
              </div>
              <div className="data-value color-red">115<span className="data-currency">%</span></div>
              <div className="data-subtext">Você passou R$ 75,00 do limite.</div>
            </div>
          )}
          {atencao ? (
            <div className="data-block">
              <div className="data-label">
                <div className="status-dot dot-yellow"></div>Atenção: {atencao.nome}
              </div>
              <div className="data-value color-yellow">{Math.round(atencao.percentual)}<span className="data-currency">%</span></div>
              <div className="data-subtext">Restam R$ {formatCurrency(atencaoRestam)} ({atencaoDias} dias).</div>
            </div>
          ) : (
            <div className="data-block">
              <div className="data-label">
                <div className="status-dot dot-yellow"></div>Atenção: Uber
              </div>
              <div className="data-value color-yellow">85<span className="data-currency">%</span></div>
              <div className="data-subtext">Restam R$ 60,00 (12 dias).</div>
            </div>
          )}
        </div>

        {/* LAYOUT PRINCIPAL */}
        <div className="split-layout grid grid-cols-[1.6fr_1fr] gap-10">
          {/* ESQUERDA: TRANSAÇÕES */}
          <div id="transacoes-container" className={`min-w-0 ${isEmpty ? 'show-empty' : ''}`}>
            <div className="section-header">
              <h2>Últimas Movimentações</h2>
            </div>

            <div style={{ position: 'relative' }}>
              {/* EMPTY STATE */}
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <h3>Nenhuma movimentação</h3>
                <p>Arraste uma fatura ou arquivo OFX para qualquer lugar da tela para começar.</p>
              </div>

              {/* LISTA COM FADE */}
              <div className="fade-list-container">
                <div className="transaction-list">
                  {transacoes.map((t) => (
                    <TransacaoItem key={t.id} transacao={t} />
                  ))}
                </div>
              </div>
              <button className="btn-view-all">Ver todas ({transacoes.length})</button>
            </div>
          </div>

          {/* DIREITA: ORÇAMENTOS */}
          <div id="orcamentos-container" className={`min-w-0 ${isEmpty ? 'show-empty' : ''}`}>
            <div className="section-header">
              <h2>Meus Orçamentos</h2>
            </div>
            <div style={{ position: 'relative' }}>
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <h3>Sem orçamentos ativos</h3>
                <p>Configure limites de gastos para ver o acompanhamento do mês aqui.</p>
              </div>

              <div className="fade-list-container" style={{ maxHeight: '250px' }}>
                <div className="budget-list">
                  {orcamentos.map((o) => {
                    const percent = Math.min(100, Math.round((o.gasto / o.teto) * 100));
                    const fillClass =
                      o.status === 'estourado' ? 'fill-red' : o.status === 'limite' ? 'fill-yellow' : 'fill-green';
                    return (
                      <div className="b-item" key={o.id}>
                        <div className="b-header">
                          <span className="b-nome">{o.nome}</span>
                          <span className="b-valores">{formatCurrency(o.gasto)} / {formatCurrency(o.teto)}</span>
                        </div>
                        <div className="progress-track">
                          <div className={`progress-fill ${fillClass}`} style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <button className="btn-view-all">Ver todos ({orcamentos.length})</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}