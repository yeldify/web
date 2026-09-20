import type { Transacao } from '../hooks/useMockData';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

interface TransacaoItemProps {
  transacao: Transacao;
}

function formatarValor(valor: number): string {
  return Math.abs(valor)
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatarData(data: string): string {
  const d = new Date(data);
  return `${d.getDate()} ${MESES[d.getMonth()]}`;
}

export default function TransacaoItem({ transacao }: TransacaoItemProps) {
  const pendente = transacao.pendente || !transacao.categoria;
  const isEntrada = transacao.tipo === 'ENTRADA';

  return (
    <div className="t-item">
      <div className="t-data">{formatarData(transacao.data)}</div>
      <div className="t-info">
        <div className="t-nome-wrapper">
          <span className="t-nome">{transacao.descricao}</span>
          {pendente ? (
            <span className="tag-pendente">Pendente</span>
          ) : (
            <span className="t-tag">{transacao.categoria}</span>
          )}
        </div>
        <span className="t-conta">{transacao.conta}</span>
      </div>
      <div className={`t-valor ${isEntrada ? 'v-positivo' : ''}`}>
        {isEntrada ? '+ ' : '- '} {formatarValor(transacao.valor)}
      </div>
    </div>
  );
}