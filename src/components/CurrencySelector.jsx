import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CurrencySelector = ({ selectedCurrency, currencies, onCurrencyChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Filter currencies based on search
  const filteredCurrencies = Object.entries(currencies).filter(([code, name]) => 
    code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div 
        className="dropdown-trigger" 
        onClick={toggleDropdown}
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
          {/* Search Box */}
          <div style={{ padding: '10px', position: 'sticky', top: 0, background: '#1e293b', zIndex: 10 }}>
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="dropdown-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '6px 10px',
                color: 'white',
                outline: 'none',
                fontSize: '13px'
              }}
            />
          </div>

          <div className="dropdown-scroll-area">
            {filteredCurrencies.length === 0 ? (
              <div style={{ padding: '12px 18px', color: 'var(--text-dim)', fontSize: '13px' }}>
                No results
              </div>
            ) : filteredCurrencies.map(([code, name]) => (
              <div
                key={code}
                className={`dropdown-item ${selectedCurrency === code ? 'active' : ''}`}
                onClick={() => {
                  onCurrencyChange(code);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                role="option"
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
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
