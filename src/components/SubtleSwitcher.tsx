import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface SwitcherOption {
  value: 'micro' | 'macro';
  label: string;
}

interface SubtleSwitcherProps {
  value?: 'micro' | 'macro';
  onChange?: (value: 'micro' | 'macro') => void;
  showDevToggle?: boolean;
  onDevToggle?: () => void;
  devToggleText?: string;
}

export default function SubtleSwitcher({
  value = 'micro',
  onChange,
  showDevToggle = false,
  onDevToggle,
  devToggleText = 'Testar Empty State'
}: SubtleSwitcherProps) {
  const navigate = useNavigate();
  const [internalValue, setInternalValue] = useState<'micro' | 'macro'>(value);

  const handleSwitch = (newValue: 'micro' | 'macro') => {
    setInternalValue(newValue);
    
    // Navigate to the appropriate dashboard
    if (newValue === 'micro') {
      navigate('/dashboard/micro');
    } else {
      navigate('/dashboard/macro');
    }
    
    // Call onChange if provided
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center gap-5">
      {showDevToggle && onDevToggle && (
        <button
          onClick={onDevToggle}
          className="dev-toggle"
        >
          {devToggleText}
        </button>
      )}
      
      <div className="subtle-switcher">
        <span
          className={internalValue === 'micro' ? 'active' : ''}
          onClick={() => handleSwitch('micro')}
        >
          Micro
        </span>
        <span
          className={internalValue === 'macro' ? 'active' : ''}
          onClick={() => handleSwitch('macro')}
        >
          Macro
        </span>
      </div>
    </div>
  );
}

// Estilos para o SubtleSwitcher
export const subtleSwitcherStyles = `
  .subtle-switcher {
    display: flex;
    gap: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--texto-mutado);
    text-transform: uppercase;
    letter-spacing: 1px;
    align-items: center;
  }
  
  .subtle-switcher span {
    cursor: pointer;
    padding-bottom: 4px;
    position: relative;
    transition: color 0.2s;
  }
  
  .subtle-switcher span:hover {
    color: var(--texto-principal);
  }
  
  .subtle-switcher span.active {
    color: var(--texto-principal);
  }
  
  .subtle-switcher span.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--verde-terroso);
    border-radius: 2px;
  }
  
  .dev-toggle {
    background: transparent;
    border: 1px solid var(--linha-divisoria);
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.7rem;
    cursor: pointer;
    color: var(--texto-mutado);
    transition: all 0.2s;
  }
  
  .dev-toggle:hover {
    border-color: var(--texto-principal);
    color: var(--texto-principal);
  }
`;
