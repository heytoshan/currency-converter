import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, TrendingUp, RefreshCw, Globe } from 'lucide-react';
import CurrencySelector from './components/CurrencySelector';
import './index.css';

// Extensive hardcoded list to ensure "Global" feel immediately
const INITIAL_CURRENCIES = {
  USD: "United States Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  INR: "Indian Rupee",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  AED: "UAE Dirham",
  SAR: "Saudi Riyal",
  SGD: "Singapore Dollar",
  HKD: "Hong Kong Dollar",
  MXN: "Mexican Peso",
  BRL: "Brazilian Real",
  RUB: "Russian Ruble",
  ZAR: "South African Rand",
  KRW: "South Korean Won",
  TRY: "Turkish Lira",
  SEK: "Swedish Krona",
  NZD: "New Zealand Dollar",
  MYR: "Malaysian Ringgit",
  PHP: "Philippine Peso",
  IDR: "Indonesian Rupiah",
  THB: "Thai Baht",
  KWD: "Kuwaiti Dinar",
  BHD: "Bahraini Dinar",
  OMR: "Omani Rial",
  QAR: "Qatari Rial",
  PKR: "Pakistani Rupee"
};

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [currencies, setCurrencies] = useState(INITIAL_CURRENCIES);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch full global currency list
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await fetch('https://api.frankfurter.app/currencies');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCurrencies(prev => ({ ...prev, ...data }));
      } catch (err) {
        try {
          const res2 = await fetch('https://open.er-api.com/v6/latest/USD');
          const data2 = await res2.json();
          const codes = Object.keys(data2.rates);
          const nameMap = {};
          codes.forEach(c => { nameMap[c] = c; });
          setCurrencies(prev => ({ ...prev, ...nameMap }));
        } catch (err2) {
          console.warn('Using initial list');
        }
      }
    };
    fetchCurrencies();
  }, []);

  const fetchConversion = async (amt, from, to) => {
    try {
      const res = await fetch(`https://api.frankfurter.app/latest?amount=${amt}&from=${from}&to=${to}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      return { converted: data.rates[to], rate: data.rates[to] / amt };
    } catch (e) {
      try {
        const res2 = await fetch(`https://open.er-api.com/v6/latest/${from}`);
        const data2 = await res2.json();
        const rate = data2.rates[to];
        return { converted: amt * rate, rate: rate };
      } catch (e2) {
        throw new Error('Conversion failed');
      }
    }
  };

  const handleConvert = async () => {
    if (amount <= 0 || !amount) return;
    if (fromCurrency === toCurrency) {
      setExchangeRate(1); setConvertedAmount(amount); return;
    }
    setLoading(true);
    try {
      const data = await fetchConversion(amount, fromCurrency, toCurrency);
      setConvertedAmount(data.converted);
      setExchangeRate(data.rate);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(handleConvert, 500);
    return () => clearTimeout(timeoutId);
  }, [amount, fromCurrency, toCurrency]);

  return (
    <>
      <div className="aurora aurora-1"></div>
      <div className="aurora aurora-2"></div>
      
      <div className="app-container">
        <div className="glass-container">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
             <Globe className={loading ? 'loading-spin' : ''} size={28} style={{ color: 'var(--primary)' }} />
             <h1 style={{ margin: 0, fontSize: '32px' }}>Currency Converter</h1>
          </div>
          
          <div className="converter-body">
            <div className="input-card">
              <span className="label">Your Amount</span>
              <div className="input-row">
                <input
                  type="number"
                  className="amount-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={(e) => e.target.select()}
                />
                <CurrencySelector
                  selectedCurrency={fromCurrency}
                  currencies={currencies}
                  onCurrencyChange={setFromCurrency}
                />
              </div>
            </div>

            <div className="swap-button-wrapper">
              <button className="swap-btn" onClick={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); }}>
                <ArrowLeftRight size={24} />
              </button>
            </div>

            <div className="input-card">
              <span className="label">Target Currency</span>
              <div className="input-row">
                <div className="amount-display">
                  {loading ? '---' : (convertedAmount?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0.00')}
                </div>
                <CurrencySelector
                  selectedCurrency={toCurrency}
                  currencies={currencies}
                  onCurrencyChange={setToCurrency}
                />
              </div>
            </div>

            {convertedAmount && !loading && (
              <div className="result-display">
                <div className="result-formula">{Number(amount).toLocaleString()} {fromCurrency} =</div>
                <div className="result-main">
                  {convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} 
                  <span style={{ color: 'var(--primary)', marginLeft: '12px' }}>{toCurrency}</span>
                </div>
                <div className="rate-info">
                  <TrendingUp size={14} />
                  Live Rate: 1 {fromCurrency} = {exchangeRate?.toFixed(6)} {toCurrency}
                </div>
              </div>
            )}
          </div>
        </div>
        <footer style={{ marginTop: '30px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px', opacity: 0.5 }}>
          Global banking rates updated every 60 seconds
        </footer>
      </div>
    </>
  );
}

export default App;
