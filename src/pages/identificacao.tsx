import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Identificacao() {
  const [cpf, setCpf] = useState('');
  const [, setStatus] = useState<'idle' | 'analyzing' | 'recognized' | 'new'>('idle');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const existingUsers = ['12345678901', '98765432109', '11144477735'];

  const formatarCPF = (valor: string): string => {
    const apenasNumeros = valor.replace(/\D/g, '');
    if (apenasNumeros.length <= 3) return apenasNumeros;
    if (apenasNumeros.length <= 6) return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
    if (apenasNumeros.length <= 9) return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6)}`;
    return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9, 11)}`;
  };

  useEffect(() => {
    const apenasNumeros = cpf.replace(/\D/g, '');
    if (apenasNumeros.length === 0) {
      setStatus('idle');
      setMessage('');
    } else if (apenasNumeros.length < 11) {
      setStatus('analyzing');
      setMessage('Analisando base com seguranca local...');
    } else if (apenasNumeros.length === 11) {
      setStatus(existingUsers.includes(apenasNumeros) ? 'recognized' : 'new');
      setMessage(existingUsers.includes(apenasNumeros) ? 'Usuario reconhecido...' : 'Novo usuario detectado...');
      const timer = setTimeout(() => {
        if (existingUsers.includes(apenasNumeros)) {
          navigate('/senha', { state: { cpf: cpf } });
        } else {
          navigate('/onboarding', { state: { cpf: cpf, isNewUser: true } });
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [cpf, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const apenasNumeros = cpf.replace(/\D/g, '');
    if (apenasNumeros.length === 11) {
      if (existingUsers.includes(apenasNumeros)) {
        navigate('/senha', { state: { cpf: cpf } });
      } else {
        navigate('/onboarding', { state: { cpf: cpf, isNewUser: true } });
      }
    }
  };

  const isComplete = cpf.replace(/\D/g, '').length === 11;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-10" style={{ paddingBottom: '100px' }}>
      <div className="auth-content" style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>
        <div style={{ marginBottom: '48px' }}>
          <div className="logo" style={{ marginBottom: '24px' }}>
            <h1 className="site-logo" style={{ fontSize: '2.2rem' }}>Yeldify</h1>
          </div>
          <div className="section-tag">ATO 1: IDENTIFICACAO</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '400', letterSpacing: '-0.8px', color: 'var(--texto-principal)', margin: '12px 0' }}>
            Analisar perfil com seguranca local
          </h2>
          <p className="diag-description" style={{ maxWidth: '100%', textAlign: 'center' }}>
            Digite seu CPF para que possamos analisar seu perfil com seguranca local.
            <br />
            <span style={{ fontSize: '0.8rem' }}>(Somente voce tem acesso as suas informacoes)</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%', marginBottom: '24px' }}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(formatarCPF(e.target.value))}
              placeholder="000.000.000-00"
              maxLength={14}
              className="auth-input"
              style={{ textAlign: 'center', letterSpacing: '2px' }}
            />
            <div className="auth-feedback" style={{ minHeight: '24px' }}>{message}</div>
          </div>
          <button type="submit" disabled={!isComplete} className="btn-primary-outline" style={{ width: '100%' }}>
            {isComplete ? 'Continuar' : 'Digite seu CPF'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button className="auth-back" onClick={() => navigate('/')}>
            <svg style={{ width: '12px', height: '12px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Voltar para a Pagina Inicial
          </button>
        </div>

        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--linha-divisoria)', fontSize: '0.75rem', color: 'var(--texto-mutado)', textAlign: 'center' }}>
          Seu CPF e usado apenas para identificar seu perfil.<br />
          Nao compartilhamos suas informacoes com ninguem.
        </div>
      </div>
    </div>
  );
}
