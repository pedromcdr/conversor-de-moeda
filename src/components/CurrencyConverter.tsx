/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeftRight, Check, Sparkles, HelpCircle, ChevronDown, DollarSign, Calendar, ExternalLink, RefreshCw } from "lucide-react";
import { 
  CurrencyItem, 
  LatestRateResponse, 
  PORTUGUESE_CURRENCY_NAMES, 
  CURRENCY_SYMBOLS, 
  getCurrencyFlag,
  getCurrencyFlagUrl
} from "../types";

interface CurrencyConverterProps {
  onSelectedChange?: (from: string, to: string) => void;
  currentDate: string; // "2026-05-23"
}

export default function CurrencyConverter({ onSelectedChange, currentDate }: CurrencyConverterProps) {
  // State for loaded currencies
  const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState<boolean>(true);
  const [currencyError, setCurrencyError] = useState<string | null>(null);

  // State for conversion form
  const [amount, setAmount] = useState<string>("1000");
  const [fromCurrency, setFromCurrency] = useState<string>("EUR");
  const [toCurrency, setToCurrency] = useState<string>("USD");

  // Output states
  const [result, setResult] = useState<number | null>(null);
  const [inverseRate, setInverseRate] = useState<number | null>(null);
  const [converting, setConverting] = useState<boolean>(false);
  const [conversionError, setConversionError] = useState<string | null>(null);

  // UI state for custom select dropdowns to ensure premium styling
  const [showFromDropdown, setShowFromDropdown] = useState<boolean>(false);
  const [showToDropdown, setShowToDropdown] = useState<boolean>(false);
  const [filterFrom, setFilterFrom] = useState<string>("");
  const [filterTo, setFilterTo] = useState<string>("");

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  // Fetch all available currencies
  useEffect(() => {
    async function loadCurrencies() {
      setLoadingCurrencies(true);
      setCurrencyError(null);
      try {
        const res = await fetch("https://api.frankfurter.dev/v1/currencies");
        if (!res.ok) {
          throw new Error("Falha ao obter lista de moedas suportadas.");
        }
        const data = await res.json();
        const items: CurrencyItem[] = Object.entries(data).map(([code, englishName]) => ({
          code,
          name: PORTUGUESE_CURRENCY_NAMES[code] || (englishName as string),
          flag: getCurrencyFlag(code),
          symbol: CURRENCY_SYMBOLS[code] || "",
        }));

        // Sort standard list prioritizing EUR, USD, BRL, GBP, CHF, CAD
        const priority = ["EUR", "USD", "BRL", "GBP", "CHF", "CAD"];
        items.sort((a, b) => {
          const idxA = priority.indexOf(a.code);
          const idxB = priority.indexOf(b.code);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return a.name.localeCompare(b.name, "pt");
        });

        setCurrencies(items);
      } catch (err: any) {
        console.error(err);
        setCurrencyError(err.message || "Não foi possível carregar as moedas.");
      } finally {
        setLoadingCurrencies(false);
      }
    }
    loadCurrencies();
  }, []);

  // Fetch conversion function
  const fetchConversion = async (currentAmount: string, currentFrom: string, currentTo: string) => {
    const parsedAmount = parseFloat(currentAmount);
    if (!currentAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setResult(null);
      setInverseRate(null);
      return;
    }

    setConverting(true);
    setConversionError(null);
    try {
      // 1. Convert actual base
      const conversionUrl = `https://api.frankfurter.dev/v1/latest?amount=${parsedAmount}&from=${currentFrom}&to=${currentTo}`;
      const res = await fetch(conversionUrl);
      if (!res.ok) {
        throw new Error("Câmbio indisponível para este par.");
      }
      const data: LatestRateResponse = await res.json();
      const calculatedResult = data.rates[currentTo];
      setResult(calculatedResult);

      // 2. Obtain inverse unit rate (1 TO -> FROM) to show detailed sub-quotes
      const inverseUrl = `https://api.frankfurter.dev/v1/latest?amount=1&from=${currentTo}&to=${currentFrom}`;
      const invRes = await fetch(inverseUrl);
      if (invRes.ok) {
        const invData: LatestRateResponse = await invRes.json();
        setInverseRate(invData.rates[currentFrom]);
      } else {
        setInverseRate(null);
      }
    } catch (err: any) {
      console.error(err);
      setConversionError("Erro de conversão. Tente novamente ou mude o par.");
    } finally {
      setConverting(false);
    }
  };

  // Trigger conversion dynamically
  // Debounce effect on amount, instant trigger on currencies change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchConversion(amount, fromCurrency, toCurrency);
    }, 300); // 300ms debounce according to spec

    return () => clearTimeout(delayDebounce);
  }, [amount]);

  // Instant trigger when currencies change (so selecting is lightning fast)
  useEffect(() => {
    fetchConversion(amount, fromCurrency, toCurrency);
    if (onSelectedChange) {
      onSelectedChange(fromCurrency, toCurrency);
    }
  }, [fromCurrency, toCurrency]);

  // Click outside hooks for selector dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        setShowFromDropdown(false);
      }
      if (toRef.current && !toRef.current.contains(event.target as Node)) {
        setShowToDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Inverter imediato (EUR/USD para USD/EUR)
  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const selectedFromObj = currencies.find((c) => c.code === fromCurrency);
  const selectedToObj = currencies.find((c) => c.code === toCurrency);

  // Filters currencies lists
  const filteredFromList = currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(filterFrom.toLowerCase()) ||
      c.name.toLowerCase().includes(filterFrom.toLowerCase())
  );

  const filteredToList = currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(filterTo.toLowerCase()) ||
      c.name.toLowerCase().includes(filterTo.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6" id="bloco-conversor">
      {/* Primary Conversion Card */}
      <div className="glass-premium rounded-2xl p-4 sm:p-6 md:p-8 relative overflow-hidden shadow-2xl">
        {/* Glow Decorator */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Local time badge details */}
        <div className="flex items-center justify-between mb-6 border-b border-brand-border pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-brand-text font-bold">Cotação Real-Time</span>
          </div>
          <span className="text-[10px] text-brand-muted font-mono tracking-wider">
            BCE • Atualizado {currentDate}
          </span>
        </div>

        {loadingCurrencies ? (
          <div className="flex flex-col items-center justify-center py-12 text-brand-muted">
            <div className="w-8 h-8 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin mb-4" />
            <p className="text-sm font-medium">A carregar sistemas...</p>
          </div>
        ) : currencyError ? (
          <div className="text-center py-8 text-rose-500 font-medium text-sm">
            ❌ {currencyError}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Amount and Selectors arranged in a spacious sequence for total alignment & clarity */}
            <div className="space-y-5">
              {/* Quantia Input - Occupies full width for clean input, presets & typography */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs md:text-sm font-black text-brand-title uppercase tracking-widest" htmlFor="valor-conversao">
                    Valor a Converter
                  </label>
                  {amount && (
                    <button
                      type="button"
                      onClick={() => setAmount("")}
                      className="text-xs md:text-sm text-amber-500/90 hover:text-amber-400 font-mono font-bold transition-colors cursor-pointer"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                
                <div className="relative h-16 rounded-2xl bg-brand-inner border border-brand-border focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/10 transition-all duration-300 px-3 flex items-center shadow-inner">
                  <span className="text-brand-text text-xl font-mono font-bold pr-2 select-none shrink-0">
                    {selectedFromObj?.symbol || "€"}
                  </span>
                  <input
                    type="number"
                    id="valor-conversao"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="any"
                    className="w-full bg-transparent border-0 text-brand-title font-mono text-2xl lg:text-3xl font-extrabold py-0 focus:ring-0 focus:outline-none placeholder-slate-400 dark:placeholder-slate-700"
                  />
                  {selectedFromObj && (
                    <div className="flex items-center gap-1.5 shrink-0 select-none">
                      <div className="w-8 h-5.5 rounded overflow-hidden border border-brand-border bg-brand-card shadow-sm flex items-center justify-center">
                        <img 
                          src={getCurrencyFlagUrl(selectedFromObj.code)} 
                          alt={selectedFromObj.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-xs bg-brand-card border border-brand-border text-brand-title font-mono font-black px-2.5 py-1 rounded-lg shadow-sm">
                        {selectedFromObj.code}
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick Presets row */}
                <div className="flex items-center gap-1.5 mt-1 overflow-x-auto pb-1 scrollbar-none border-b border-transparent">
                  {[100, 500, 1000, 5000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(String(val))}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all border shrink-0 cursor-pointer ${
                        amount === String(val)
                          ? "bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-sm shadow-amber-500/10"
                          : "bg-brand-inner border-brand-border text-brand-muted hover:text-brand-title hover:border-amber-500"
                      }`}
                    >
                      {val.toLocaleString("pt-PT")}{selectedFromObj?.symbol || ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selectors with perfect alignment mapping: 5-1-5 grid ratio on sm screen, stacked on xs/mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-end relative w-full">
                
                {/* Source Selector (De) - taking 5/11ths of width */}
                <div className="col-span-1 sm:col-span-5 flex flex-col gap-2" ref={fromRef}>
                  <label className="text-xs md:text-sm font-black text-brand-title uppercase tracking-widest">
                    De (Origem)
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowFromDropdown(!showFromDropdown);
                        setShowToDropdown(false);
                        setFilterFrom("");
                      }}
                      className={`w-full h-16 rounded-2xl bg-brand-inner border px-4 text-left text-brand-title flex items-center justify-between transition-all cursor-pointer shadow-sm ${
                        showFromDropdown 
                          ? "border-amber-500 ring-2 ring-amber-500/10" 
                          : "border-brand-border hover:border-slate-400"
                      }`}
                    >
                      <span className="flex items-center gap-3 font-medium min-w-0">
                        <div className="w-10 h-7 rounded-lg overflow-hidden border border-brand-border bg-brand-card flex items-center justify-center shrink-0 shadow-sm">
                          <img 
                            src={getCurrencyFlagUrl(fromCurrency)} 
                            alt={selectedFromObj?.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <span className="font-mono text-sm md:text-base font-black tracking-wider text-brand-title uppercase leading-none truncate">{fromCurrency}</span>
                          <span className="text-brand-muted text-[11px] md:text-xs font-bold truncate max-w-[125px] xs:max-w-[150px] sm:max-w-[180px] lg:max-w-[140px] xl:max-w-[200px] mt-1.5 leading-none">
                            {selectedFromObj?.name}
                          </span>
                        </div>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-brand-muted duration-200 shrink-0 ${showFromDropdown ? "transform rotate-180 text-amber-500" : ""}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {showFromDropdown && (
                      <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-brand-card border border-brand-border shadow-2xl z-50 max-h-80 flex flex-col overflow-hidden backdrop-filter backdrop-blur-xl">
                        <div className="p-3 border-b border-brand-border bg-brand-card">
                          <input
                            type="text"
                            placeholder="Pesquisador rápido... (EUR, BRL, USD...)"
                            value={filterFrom}
                            onChange={(e) => setFilterFrom(e.target.value)}
                            className="w-full bg-brand-inner border border-brand-border rounded-xl text-xs py-2.5 px-3.5 text-brand-title placeholder-slate-400 dark:placeholder-slate-600 font-mono focus:outline-none focus:border-amber-500/50"
                            autoFocus
                          />
                        </div>
                        <div className="overflow-y-auto flex-1 py-1 divide-y divide-brand-border/40 custom-scrollbar bg-brand-card">
                          {filteredFromList.length > 0 ? (
                            <>
                              {/* Grouping Header: Popular */}
                              {filterFrom === "" && (
                                <div className="bg-brand-inner border-b border-brand-border/30 px-3 py-1.5 text-[9px] font-bold text-amber-500 uppercase tracking-widest sticky top-0 backdrop-blur-sm z-10">
                                  Mais Procuradas em Portugal
                                </div>
                              )}
                              
                              {/* Popular elements list (indices 0 to 5 in prioritized currencies EUR, USD, BRL, GBP, CHF, CAD) */}
                              {filteredFromList.map((item, index) => {
                                const renderGroupTitle = filterFrom === "" && index === 6; // Mark starting other coins
                                return (
                                  <React.Fragment key={item.code}>
                                    {renderGroupTitle && (
                                      <div className="bg-brand-inner border-y border-brand-border/30 px-3 py-1.5 text-[9px] font-bold text-brand-muted uppercase tracking-widest sticky top-0 backdrop-blur-sm z-10">
                                        Outras Moedas Globais
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFromCurrency(item.code);
                                        setShowFromDropdown(false);
                                      }}
                                      className={`w-full py-3 px-3.5 hover:bg-brand-inner flex items-center justify-between text-left text-xs transition-colors cursor-pointer ${
                                        fromCurrency === item.code ? "bg-amber-500/10 text-amber-500 font-extrabold" : "text-brand-text hover:text-brand-title"
                                      }`}
                                    >
                                      <span className="flex items-center gap-3">
                                        <div className="w-7 h-5 rounded overflow-hidden border border-brand-border bg-brand-inner flex items-center justify-center shrink-0 shadow-sm">
                                          <img 
                                            src={getCurrencyFlagUrl(item.code)} 
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                          />
                                        </div>
                                        <div className="flex flex-col">
                                          <div className="flex items-center gap-1.5">
                                            <span className="font-mono font-extrabold tracking-wider text-brand-title">{item.code}</span>
                                            {item.symbol && <span className="text-[10px] text-brand-muted">({item.symbol})</span>}
                                          </div>
                                          <span className="text-brand-muted text-[10px] font-semibold">{item.name}</span>
                                        </div>
                                      </span>
                                      {fromCurrency === item.code && <Check className="w-4 h-4 text-amber-500" />}
                                    </button>
                                  </React.Fragment>
                                );
                              })}
                            </>
                          ) : (
                            <p className="p-4 text-brand-muted text-center text-xs font-medium">Nenhuma moeda encontrada.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Intermediary Swap Button Column - taking 1/11th of width, layout behaves nicely on responsive grids */}
                <div className="col-span-1 sm:col-span-1 flex flex-col items-center justify-center shrink-0 z-10 self-center sm:self-auto py-1 sm:py-0">
                  <div className="h-12 sm:h-16 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleSwap}
                      className="w-12 h-12 rounded-full bg-brand-card border border-brand-border hover:border-amber-500 hover:text-amber-500 text-brand-title transition-all cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95 shadow-md hover:shadow-lg hover:shadow-amber-500/5 shadow-black"
                      title="Inverter Moedas"
                    >
                      <ArrowLeftRight className="w-5 h-5 sm:rotate-0 rotate-90" />
                    </button>
                  </div>
                </div>

                {/* Destination Selector (Para) - taking 5/11ths of width */}
                <div className="col-span-1 sm:col-span-5 flex flex-col gap-2" ref={toRef}>
                  <label className="text-xs md:text-sm font-black text-brand-title uppercase tracking-widest">
                    Para (Destino)
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowToDropdown(!showToDropdown);
                        setShowFromDropdown(false);
                        setFilterTo("");
                      }}
                      className={`w-full h-16 rounded-2xl bg-brand-inner border px-4 text-left text-brand-title flex items-center justify-between transition-all cursor-pointer shadow-sm ${
                        showToDropdown 
                          ? "border-amber-500 ring-2 ring-amber-500/10" 
                          : "border-brand-border hover:border-slate-400"
                      }`}
                    >
                      <span className="flex items-center gap-3 font-medium min-w-0">
                        <div className="w-10 h-7 rounded-lg overflow-hidden border border-brand-border bg-brand-card flex items-center justify-center shrink-0 shadow-sm">
                          <img 
                            src={getCurrencyFlagUrl(toCurrency)} 
                            alt={selectedToObj?.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <span className="font-mono text-sm md:text-base font-black tracking-wider text-brand-title uppercase leading-none truncate">{toCurrency}</span>
                          <span className="text-brand-muted text-[11px] md:text-xs font-bold truncate max-w-[125px] xs:max-w-[150px] sm:max-w-[180px] lg:max-w-[140px] xl:max-w-[200px] mt-1.5 leading-none">
                            {selectedToObj?.name}
                          </span>
                        </div>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-brand-muted duration-200 shrink-0 ${showToDropdown ? "transform rotate-180 text-amber-500" : ""}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {showToDropdown && (
                      <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-brand-card border border-brand-border shadow-2xl z-50 max-h-80 flex flex-col overflow-hidden backdrop-filter backdrop-blur-xl">
                        <div className="p-3 border-b border-brand-border bg-brand-card">
                          <input
                            type="text"
                            placeholder="Pesquisador rápido... (USD, GBP, BRL...)"
                            value={filterTo}
                            onChange={(e) => setFilterTo(e.target.value)}
                            className="w-full bg-brand-inner border border-brand-border rounded-xl text-xs py-2.5 px-3.5 text-brand-title placeholder-slate-400 dark:placeholder-slate-600 font-mono focus:outline-none focus:border-amber-500/50"
                            autoFocus
                          />
                        </div>
                        <div className="overflow-y-auto flex-1 py-1 divide-y divide-brand-border/40 custom-scrollbar bg-brand-card">
                          {filteredToList.length > 0 ? (
                            <>
                              {/* Grouping Header: Popular */}
                              {filterTo === "" && (
                                <div className="bg-brand-inner border-b border-brand-border/30 px-3 py-1.5 text-[9px] font-bold text-amber-500 uppercase tracking-widest sticky top-0 backdrop-blur-sm z-10">
                                  Mais Procuradas em Portugal
                                </div>
                              )}
                              
                              {filteredToList.map((item, index) => {
                                const renderGroupTitle = filterTo === "" && index === 6; // Mark starting other coins
                                return (
                                  <React.Fragment key={item.code}>
                                    {renderGroupTitle && (
                                      <div className="bg-brand-inner border-y border-brand-border/30 px-3 py-1.5 text-[9px] font-bold text-brand-muted uppercase tracking-widest sticky top-0 backdrop-blur-sm z-10">
                                        Outras Moedas Globais
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setToCurrency(item.code);
                                        setShowToDropdown(false);
                                      }}
                                      className={`w-full py-3 px-3.5 hover:bg-brand-inner flex items-center justify-between text-left text-xs transition-colors cursor-pointer ${
                                        toCurrency === item.code ? "bg-amber-500/10 text-amber-500 font-extrabold" : "text-brand-text hover:text-brand-title"
                                      }`}
                                    >
                                      <span className="flex items-center gap-3">
                                        <div className="w-7 h-5 rounded overflow-hidden border border-brand-border bg-brand-inner flex items-center justify-center shrink-0 shadow-sm">
                                          <img 
                                            src={getCurrencyFlagUrl(item.code)} 
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                          />
                                        </div>
                                        <div className="flex flex-col">
                                          <div className="flex items-center gap-1.5">
                                            <span className="font-mono font-extrabold tracking-wider text-brand-title">{item.code}</span>
                                            {item.symbol && <span className="text-[10px] text-brand-muted">({item.symbol})</span>}
                                          </div>
                                          <span className="text-brand-muted text-[10px] font-semibold">{item.name}</span>
                                        </div>
                                      </span>
                                      {toCurrency === item.code && <Check className="w-4 h-4 text-emerald-500" />}
                                    </button>
                                  </React.Fragment>
                                );
                              })}
                            </>
                          ) : (
                            <p className="p-4 text-brand-muted text-center text-xs font-medium">Nenhuma moeda encontrada.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
                {/* Results Output Canvas Component */}
            <div className="mt-8 pt-4 border-t border-brand-border">
              {converting ? (
                <div className="bg-brand-inner rounded-2xl p-6 flex flex-col items-center justify-center border border-brand-border min-h-[140px]">
                  <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mb-2" />
                  <p className="text-brand-text text-sm md:text-base font-mono font-medium animate-pulse">A calcular taxa em tempo real...</p>
                </div>
              ) : conversionError ? (
                <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 text-center">
                  <p className="text-base font-bold text-rose-500">{conversionError}</p>
                </div>
              ) : result !== null ? (
                <div className="bg-brand-inner border border-brand-border rounded-2xl p-6 shadow-inner relative overflow-hidden transition-colors duration-250">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      {/* Original string preview */}
                      <p className="text-sm md:text-base text-brand-text font-bold">
                        {parseFloat(amount).toLocaleString("pt-PT")} {selectedFromObj?.name} =
                      </p>
                      
                      {/* Big Output Target Result */}
                      <h2 className="text-3xl sm:text-4xl md:text-5.5xl font-black tracking-tight text-brand-title font-sans mt-1">
                        <span className="text-emerald-500 dark:text-emerald-400 font-black">
                          {result.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                        </span>{" "}
                        {toCurrency}
                      </h2>
 
                      {/* Small reverse formulas */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs md:text-sm text-brand-text font-mono mt-3">
                        <span className="bg-brand-card px-2.5 py-1 rounded-lg border border-brand-border">
                          1 {fromCurrency} = {(result / parseFloat(amount)).toFixed(5)} {toCurrency}
                        </span>
                        {inverseRate !== null && (
                          <span className="text-brand-muted bg-brand-card px-2.5 py-1 rounded-lg border border-brand-border">
                            1 {toCurrency} = {inverseRate.toFixed(5)} {fromCurrency}
                          </span>
                        )}
                      </div>
                    </div>
 
                    {/* Quick rate info indicator */}
                    <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 px-4 py-3 rounded-xl self-start md:self-auto shadow-sm">
                      <Sparkles className="w-5 h-5 text-emerald-force-color-icon text-emerald-500 dark:text-emerald-400 shrink-0" />
                      <div className="text-left">
                        <p className="text-[10px] md:text-xs font-black text-brand-muted uppercase tracking-wide">Fórmula Direta</p>
                        <p className="text-xs md:text-sm text-emerald-500 dark:text-emerald-400 font-bold">Câmbio Comercial BCE Sem Taxas</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-brand-inner/40 rounded-2xl p-8 text-center text-brand-muted text-sm font-mono font-medium">
                  Insira um valor numérico para iniciar o cálculo imediato.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Wise strategic affiliate promotion */}
      <div className="bg-brand-card rounded-2xl p-6 border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-lg transition-transform hover:translate-y-[-2px] duration-300">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
        <div className="space-y-1.5 text-center sm:text-left">
          <span className="inline-block px-2.5 py-1 rounded bg-amber-500/10 text-amber-500 text-xs font-black uppercase tracking-wider">
            Recomendado
          </span>
          <h4 className="text-base font-black text-brand-title tracking-tight mt-1 flex items-center justify-center sm:justify-start gap-1.5">
            Precisa de transferir ou enviar dinheiro?
          </h4>
          <p className="text-xs md:text-sm text-brand-text font-medium leading-relaxed">
            Poupe até <strong className="text-amber-500 dark:text-amber-400">8x em taxas de envio</strong> transferindo fundos com a nossa recomendação (<strong className="text-brand-title font-bold">Wise</strong>).
          </p>
        </div>
        <a
          href="https://wise.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shrink-0 select-none"
        >
          <span>Poupe com a Wise</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
