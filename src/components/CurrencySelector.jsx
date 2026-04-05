import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CurrencySelector = ({ selectedCurrency, currencies, onCurrencyChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div 
        className="dropdown-trigger" 
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="currency-code">{selectedCurrency}</span>
        <ChevronDown 
          size={16} 
          style={{ 
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'var(--text-dim)'
          }} 
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          {Object.entries(currencies).length === 0 ? (
            <div style={{ padding: '12px 18px', color: 'var(--text-dim)', fontSize: '13px' }}>
              Loading...
            </div>
          ) : Object.entries(currencies).map(([code, name]) => (
            <div
              key={code}
              className={`dropdown-item ${selectedCurrency === code ? 'active' : ''}`}
              onClick={() => {
                onCurrencyChange(code);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={selectedCurrency === code}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="currency-code" style={{ fontSize: '14px' }}>{code}</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {name}
                </span>
              </div>
              {selectedCurrency === code && <Check size={14} style={{ color: 'var(--primary)' }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
