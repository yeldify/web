import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';

const CATEGORIES: Record<number, string> = {
  1: 'supermercado',
  2: 'refeicao',
  3: 'transporte',
  4: 'saude',
  5: 'lazer',
};

function parseBrasileiro(valor: string): number {
  return Number.parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0;
}

export default function OnboardingOrcamentos() {
  const navigate = useNavigate();
  const [propostas, setPropostas] = useState([
    { id: 1, nome: 'Supermercado & Insumos', valor: '800,00', checked: true },
    { id: 2, nome: 'Refeição & Restaurantes', valor: '500,00', checked: true },
    { id: 3, nome: 'Mobilidade & Transporte', valor: '400,00', checked: true },
    { id: 4, nome: 'Saúde & Bem-estar', valor: '300,00', checked: true },
    { id: 5, nome: 'Lazer & Entretenimento', valor: '200,00', checked: true },
  ]);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleProposta = (id: number) => {
    setPropostas(prev => 
      prev.map(p => p.id === id ? { ...p, checked: !p.checked } : p)
    );
  };

  const handleAplicar = async () => {
    setError(null);
    setApplying(true);
    const selecionadas = propostas.filter((p) => p.checked);
    try {
      await Promise.all(
        selecionadas.map((p) =>
          api.criarOrcamento({
            nome: p.nome,
            categoria: CATEGORIES[p.id],
            valor: parseBrasileiro(p.valor),
            validade_meses: 1,
          })
        )
      );
      localStorage.setItem('yeldify-propostas', JSON.stringify(propostas));
      navigate('/dashboard/micro');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Falha ao aplicar proposta';
      setError(msg);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col p-10">
      <div className="container flex-1">
        <header className="flex justify-between items-center mb-10">
          <div className="logo-text">Yeldify</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--texto-mutado)', fontFamily: 'var(--fonte-dados)' }}>
            Proposta de Orçamentos
          </div>
        </header>

        <main className="diagnosis-container flex-1">
          <div className="diag-slide active" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <span className="diag-tag">Proposta Final</span>
            <h1 className="diag-title">O Yeldify estruturou estes tetos. O poder de aceite é seu.</h1>
            <p className="diag-description">
              Com base no seu histórico de 3 meses, sugerimos travar estes limites para garantir estabilidade. 
              Você pode desmarcar ou ajustar qualquer item antes de iniciar.
            </p>

            <div className="proposal-list">
              {propostas.map((proposta) => (
                <div key={proposta.id} className="proposal-row">
                  <div className="proposal-info">
                    <input
                      type="checkbox"
                      className="proposal-checkbox"
                      checked={proposta.checked}
                      onChange={() => toggleProposta(proposta.id)}
                    />
                    <span>{proposta.nome}</span>
                  </div>
                  <input
                    type="text"
                    className="proposal-val"
                    value={proposta.valor}
                    onChange={(e) => {
                      setPropostas(prev =>
                        prev.map(p => p.id === proposta.id ? { ...p, valor: e.target.value } : p)
                      );
                    }}
                    style={{ 
                      fontFamily: 'var(--fonte-dados)',
                      fontWeight: '500',
                      fontSize: '0.9rem',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--linha-divisoria)',
                      outline: 'none',
                      textAlign: 'right',
                      padding: '4px 0'
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="diag-footer">
              <button className="btn-text-link" onClick={() => navigate('/onboarding')} style={{ rotate: '180deg' }}>
                ← Voltar ao Diagnóstico
              </button>
              {error && <span style={{ color: 'var(--alerta-vermelho)', fontSize: '0.8rem' }}>{error}</span>}
              <button className="btn-primary-outline" onClick={handleAplicar} disabled={applying}>
                {applying ? 'Aplicando…' : 'Aplicar Proposta e Iniciar'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
