import { ReactNode } from 'react';
import SubtleSwitcher from './SubtleSwitcher';

interface PageHeaderProps {
  subtitle?: string;
  showSwitcher?: boolean;
  children?: ReactNode;
}

export default function PageHeader({ 
  subtitle = '', 
  showSwitcher = true,
  children 
}: PageHeaderProps) {
  return (
    <header className="flex justify-between items-end mb-14">
      <div className="header-left">
        <div className="logo-wrapper flex items-baseline gap-4">
          <div className="logo">
            <h1>Yeldify</h1>
          </div>
          {subtitle && (
            <div 
              className="month-selector flex items-center gap-3 text-sm font-medium" 
              style={{ color: 'var(--texto-mutado)', fontFamily: 'var(--fonte-dados)' }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
      
      {showSwitcher && <SubtleSwitcher />}
      
      {children}
    </header>
  );
}
