import { NavLink } from 'react-router-dom';

export interface DockItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

interface GlassDockProps {
  items?: DockItem[];
  activePath?: string;
}

const defaultItems: DockItem[] = [
  {
    path: '/dashboard/micro',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      </svg>
    ),
    label: 'Dashboard'
  },
  {
    path: '/orcamentos',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 8v4l3 3"></path>
      </svg>
    ),
    label: 'Orçamentos'
  },
  {
    path: '/transacoes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
      </svg>
    ),
    label: 'Transações'
  },
  {
    path: '/dashboard/macro',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    ),
    label: 'Relatórios'
  }
];

export default function GlassDock({ items = defaultItems, activePath }: GlassDockProps) {
  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="glass-dock">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `dock-item ${isActive || activePath === item.path ? 'active' : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

// Estilos para o GlassDock (serão movidos para CSS global)
export const glassDockStyles = `
  .glass-dock {
    background-color: rgba(244, 241, 234, 0.75);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(30, 47, 35, 0.1);
    border-radius: 24px;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.06);
  }
  
  .dock-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 56px;
    border-radius: 16px;
    color: var(--texto-mutado);
    text-decoration: none;
    transition: all 0.3s;
    position: relative;
  }
  
  .dock-item svg {
    width: 20px;
    height: 20px;
    stroke-width: 1.5;
    transition: all 0.2s;
  }
  
  .dock-item span {
    font-size: 0.6rem;
    font-weight: 600;
    opacity: 0;
    transform: translateY(4px);
    transition: all 0.2s;
    position: absolute;
    bottom: 6px;
  }
  
  .dock-item:hover {
    color: var(--texto-principal);
    background-color: rgba(30, 47, 35, 0.04);
  }
  
  .dock-item:hover svg {
    transform: translateY(-6px);
  }
  
  .dock-item:hover span {
    opacity: 1;
    transform: translateY(0);
  }
  
  .dock-item.active {
    color: var(--verde-terroso);
    background-color: rgba(96, 119, 68, 0.1);
  }
`;
