import PageHeader from '../../components/PageHeader';

export default function DashboardMacro() {
  // Mock data
  const currentNetWorth = 195000;
  const yearlyGrowth = 12.5;
  const projected10Years = 450000;
  const liquidAssets = 487500;
  const illiquidAssets = 262500;
  const totalAssets = liquidAssets + illiquidAssets;

  const assetAllocation = [
    { category: 'Renda Fixa', percentage: 35, value: totalAssets * 0.35 },
    { category: 'Renda Variável', percentage: 20, value: totalAssets * 0.20 },
    { category: 'Fundos', percentage: 15, value: totalAssets * 0.15 },
    { category: 'Reserva de Emergência', percentage: 10, value: totalAssets * 0.10 },
    { category: 'Outros', percentage: 20, value: totalAssets * 0.20 }
  ];

  const yearsToIndependence = 15;
  const averageYield = 12.5;

  // Net worth data for chart
  const netWorthData = [
    { month: 'Jan', value: 175000 },
    { month: 'Fev', value: 178000 },
    { month: 'Mar', value: 180500 },
    { month: 'Abr', value: 182000 },
    { month: 'Mai', value: 185000 },
    { month: 'Jun', value: 187500 },
    { month: 'Jul', value: 190000 },
    { month: 'Ago', value: 192500 },
    { month: 'Set', value: currentNetWorth },
    { month: 'Out', value: 197500 },
    { month: 'Nov', value: 200000 },
    { month: 'Dez', value: 205000 }
  ];

  const maxNetWorth = Math.max(...netWorthData.map(d => d.value), currentNetWorth);
  const liquidPercentage = Math.round(liquidAssets / totalAssets * 100);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-10 pb-40">
      <div className="container max-w-[1100px] mx-auto relative">
        <PageHeader />

        {/* NET WORTH SECTION */}
        <section className="mb-16">
          <div className="section-header" style={{ marginBottom: '32px' }}>
            <h2>Patrimônio Líquido Global</h2>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--texto-mutado)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Patrimônio Líquido
              </div>
              <div style={{ fontFamily: 'var(--fonte-dados)', fontSize: '3rem', fontWeight: '400', color: 'var(--texto-principal)', letterSpacing: '-1px' }}>
                R$ {formatCurrency(currentNetWorth)}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--verde-terroso)', marginTop: '8px' }}>
                +{yearlyGrowth}% nos últimos 12 meses
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--texto-mutado)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Patrimônio Projetado
              </div>
              <div style={{ fontFamily: 'var(--fonte-dados)', fontSize: '1.8rem', fontWeight: '400', color: 'var(--dourado-suave)' }}>
                R$ {formatCurrency(projected10Years)} em 10 anos
              </div>
            </div>
          </div>

          {/* Net Worth Chart */}
          <div style={{ height: '200px', position: 'relative', marginBottom: '48px' }}>
            <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '160px', display: 'flex', alignItems: 'flex-end', gap: '8px', paddingRight: '40px' }}>
              {netWorthData.map((data, index) => {
                const heightPercentage = (data.value / maxNetWorth) * 100;
                return (
                  <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '40px',
                      height: `${heightPercentage}%`,
                      backgroundColor: 'rgba(96, 119, 68, 0.3)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease'
                    }}></div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--texto-mutado)', fontFamily: 'var(--fonte-dados)' }}>
                      {data.month}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* LIQUIDITY SECTION */}
        <section className="mb-16">
          <div className="section-header" style={{ marginBottom: '32px' }}>
            <h2>Liquidez</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
                  <circle cx="100" cy="100" r="80" fill="none" stroke="var(--linha-divisoria)" strokeWidth="16" />
                  <circle cx="100" cy="100" r="80" fill="none" stroke="var(--verde-terroso)" strokeWidth="16" strokeDasharray={`${2 * Math.PI * 80 * (liquidAssets / totalAssets)} 1000`} strokeLinecap="round" transform="rotate(-90 100 100)" />
                  <circle cx="100" cy="100" r="80" fill="none" stroke="var(--dourado-suave)" strokeWidth="16" strokeDasharray={`${2 * Math.PI * 80 * (illiquidAssets / totalAssets)} 1000`} strokeLinecap="round" transform={`rotate(${-90 + 360 * (liquidAssets / totalAssets)} 100 100)`} />
                  <text x="100" y="95" textAnchor="middle" style={{ fontFamily: 'var(--fonte-dados)', fontSize: '1.4rem', fontWeight: '600', fill: 'var(--texto-principal)' }}>{liquidPercentage}%</text>
                  <text x="100" y="115" textAnchor="middle" style={{ fontSize: '0.7rem', fill: 'var(--texto-mutado)' }}>Líquido</text>
                </svg>
              </div>
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontFamily: 'var(--fonte-dados)', fontSize: '1.4rem', fontWeight: '500', color: 'var(--texto-principal)' }}>
                  R$ {formatCurrency(liquidAssets)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--texto-mutado)' }}>
                  Ativos Líquidos
                </div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontFamily: 'var(--fonte-dados)', fontSize: '1.4rem', fontWeight: '500', color: 'var(--dourado-suave)' }}>
                  R$ {formatCurrency(illiquidAssets)}
                </div>
              </div>
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--texto-mutado)' }}>
                  Ativos Ilíquidos
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ASSET ALLOCATION */}
        <section className="mb-16">
          <div className="section-header" style={{ marginBottom: '32px' }}>
            <h2>Alocação de Ativos</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {assetAllocation.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ width: '200px', fontSize: '0.85rem', color: 'var(--texto-principal)' }}>{item.category}</div>
                <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--linha-divisoria)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.percentage}%`, backgroundColor: 'var(--verde-terroso)', borderRadius: '4px' }}></div>
                </div>
                <div style={{ width: '80px', textAlign: 'right', fontFamily: 'var(--fonte-dados)', fontSize: '0.85rem', color: 'var(--texto-mutado)' }}>{item.percentage}%</div>
                <div style={{ width: '120px', textAlign: 'right', fontFamily: 'var(--fonte-dados)', fontSize: '0.85rem', color: 'var(--texto-principal)' }}>R$ {formatCurrency(item.value)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PREDICTABILITY */}
        <section>
          <div className="section-header" style={{ marginBottom: '32px' }}>
            <h2>Previsibilidade</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            <div style={{ borderTop: '1px solid var(--linha-divisoria)', paddingTop: '24px' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--texto-mutado)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Independência Financeira</div>
              <div style={{ fontFamily: 'var(--fonte-dados)', fontSize: '2.5rem', fontWeight: '400', color: 'var(--dourado-suave)', letterSpacing: '-1px' }}>{yearsToIndependence} anos</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--texto-mutado)', marginTop: '8px' }}>Com base nos rendimentos atuais</div>
            </div>
            <div style={{ borderTop: '1px solid var(--linha-divisoria)', paddingTop: '24px' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--texto-mutado)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Rendimento Médio</div>
              <div style={{ fontFamily: 'var(--fonte-dados)', fontSize: '2.5rem', fontWeight: '400', color: 'var(--verde-terroso)', letterSpacing: '-1px' }}>{averageYield}% a.a.</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--texto-mutado)', marginTop: '8px' }}>Rendimento anual médio do portfólio</div>
            </div>
            <div style={{ borderTop: '1px solid var(--linha-divisoria)', paddingTop: '24px' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--texto-mutado)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Patrimônio Projetado</div>
              <div style={{ fontFamily: 'var(--fonte-dados)', fontSize: '2.5rem', fontWeight: '400', color: 'var(--texto-principal)', letterSpacing: '-1px' }}>R$ {formatCurrency(projected10Years)}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--texto-mutado)', marginTop: '8px' }}>Projeção em 10 anos</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
