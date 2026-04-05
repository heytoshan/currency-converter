import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, TrendingUp } from 'lucide-react';
import CurrencySelector from './components/CurrencySelector';
import './index.css';

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [currencies, setCurrencies] = useState({});
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch currency list on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await fetch('https://api.frankfurter.app/currencies');
        const data = await res.json();
        setCurrencies(data);
      } catch (err) {
        console.error('Error fetching currencies:', err);
      }
    };
    fetchCurrencies();
  }, []);

  // Fetch exchange rate when currencies/amount change
  useEffect(() => {
    const fetchRate = async () => {
      if (fromCurrency === toCurrency) {
        setExchangeRate(1);
        setConvertedAmount(amount);
        return;
      }
      
      setLoading(true);
      try {
        const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`);
        const data = await res.json();
        setExchangeRate(data.rates[toCurrency] / amount);
        setConvertedAmount(data.rates[toCurrency]);
      } catch (err) {
        console.error('Error fetching exchange rate:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (amount > 0) fetchRate();
    }, 400); // Faster debounce

    return () => clearTimeout(timeoutId);
  }, [amount, fromCurrency, toCurrency]);

  const handleSwap = (e) => {
    e.stopPropagation();
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <>
      {/* Background Decor */}
      <div className="aurora aurora-1"></div>
      <div className="aurora aurora-2"></div>
      
      <div className="app-container">
        <div className="glass-container">
          <h1>Currency Converter</h1>
          
          <div className="converter-body">
            {/* From Input Card */}
            <div className="input-card">
              <span className="label">Amount / From</span>
              <div className="input-row">
                <input
                  type="number"
                  className="amount-input"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min="0"
                />
                <CurrencySelector
                  selectedCurrency={fromCurrency}
                  currencies={currencies}
                  onCurrencyChange={setFromCurrency}
                />
              </div>
            </div>

            {/* Swap Button Wrapper for absolute positioning between cards */}
            <div className="swap-button-wrapper">
              <button 
                className="swap-btn" 
                onClick={handleSwap} 
                title="Swap Currencies"
              >
                <ArrowLeftRight size={24} />
              </button>
            </div>

            {/* To Input Card */}
            <div className="input-card">
              <span className="label">Converted / To</span>
              <div className="input-row">
                <div className="amount-display">
                  {loading ? <div className="premium-loader"></div> : (convertedAmount?.toFixed(2) || '0.00')}
                </div>
                <CurrencySelector
                  selectedCurrency={toCurrency}
                  currencies={currencies}
                  onCurrencyChange={setToCurrency}
                />
              </div>
            </div>

            {/* Result Section (Enhanced) */}
            {convertedAmount && !loading && (
              <div className="result-display">
                <div className="result-formula">
                  {amount} {fromCurrency} equals
                </div>
                <div className="result-main">
                  {convertedAmount.toFixed(4)} <span style={{ color: 'var(--primary)', fontSize: '24px' }}>{toCurrency}</span>
                </div>
                <div className="rate-info">
                  <TrendingUp size={14} style={{ color: 'var(--primary)' }} />
                  1 {fromCurrency} = {exchangeRate?.toFixed(6)} {toCurrency}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
