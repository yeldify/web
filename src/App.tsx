import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Pages
import Landing from './pages/landing'
import Identificacao from './pages/identificacao'
import Senha from './pages/senha'

// Onboarding
import Onboarding from './pages/onboarding'
import OnboardingOrcamentos from './pages/onboarding/orcamentos'

// Dashboard
import DashboardMicro from './pages/dashboard/micro'
import DashboardMacro from './pages/dashboard/macro'

// Outras
import Orcamentos from './pages/orcamentos'
import Transacoes from './pages/transacoes'

// Components
import GlassDock from './components/GlassDock'

// Wrapper para páginas com GlassDock
function LayoutWithDock({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <GlassDock />
    </>
  )
}

// Wrapper para páginas sem GlassDock (LP e Auth)
function LayoutWithoutDock({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Fluxo Principal - Sem Dock */}
        <Route path="/" element={<LayoutWithoutDock><Landing /></LayoutWithoutDock>} />
        <Route path="/identificacao" element={<LayoutWithoutDock><Identificacao /></LayoutWithoutDock>} />
        <Route path="/senha" element={<LayoutWithoutDock><Senha /></LayoutWithoutDock>} />

        {/* Onboarding - Sem Dock */}
        <Route path="/onboarding" element={<LayoutWithoutDock><Onboarding /></LayoutWithoutDock>} />
        <Route path="/onboarding/orcamentos" element={<LayoutWithoutDock><OnboardingOrcamentos /></LayoutWithoutDock>} />

        {/* Dashboard e Outras - Com Dock */}
        <Route path="/dashboard/micro" element={<LayoutWithDock><DashboardMicro /></LayoutWithDock>} />
        <Route path="/dashboard/macro" element={<LayoutWithDock><DashboardMacro /></LayoutWithDock>} />
        <Route path="/orcamentos" element={<LayoutWithDock><Orcamentos /></LayoutWithDock>} />
        <Route path="/transacoes" element={<LayoutWithDock><Transacoes /></LayoutWithDock>} />

        {/* Fallback */}
        <Route path="*" element={<LayoutWithoutDock><Landing /></LayoutWithoutDock>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
