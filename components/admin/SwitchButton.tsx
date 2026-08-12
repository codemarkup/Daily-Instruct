'use client';

import React, { useState } from 'react';
import '../../styles/admin/components.css';

interface SwitchButtonProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({ 
  id, 
  checked, 
  onChange, 
  disabled = false 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    if (disabled) return;
    
    setIsAnimating(true);
    onChange(!checked);
    
    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="switch-container">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleToggle}
        className="switch-input"
        disabled={disabled}
      />
      <label 
        htmlFor={id} 
        className={`switch-label ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}
      >
        <span className="switch-handle"></span>
        <span className="switch-track">
          <span className="switch-on">ON</span>
          <span className="switch-off">OFF</span>
        </span>
        {isAnimating && <span className="switch-glow"></span>}
      </label>
    </div>
  );
};

export default SwitchButton;
