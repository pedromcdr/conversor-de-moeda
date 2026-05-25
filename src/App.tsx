/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Coins, ShieldCheck, BadgeCheck, Sun, Moon } from "lucide-react";
import CurrencyConverter from "./components/CurrencyConverter";
import InteractiveChart from "./components/InteractiveChart";
import PortugueseSEOSection from "./components/PortugueseSEOSection";
import TaxasETarifas from "./components/TaxasETarifas";
import Privacidade from "./components/Privacidade";
import TermosDeUtilizacao from "./components/TermosDeUtilizacao";
import SobreNos from "./components/SobreNos";

export default function App() {
  // Compute today's dynamic date string for Frankfurt requests
  const [todayDate, setTodayDate] = useState<string>("2026-05-23");
  const [tickerRates, setTickerRates] = useState<Record<string, number>>({});
  const [loadingTicker, setLoadingTicker] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<"converter" | "taxas" | "privacidade" | "termos" | "sobrenos">("converter");

  // Automatizar scroll para o topo sempre que muda de página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Initialize theme with "light" as the default
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return (saved === "dark" || saved === "light") ? saved : "light";
    }
    return "light";
  });

  useEffect(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    // Set current date safely
    setTodayDate(`${yyyy}-${mm}-${dd}`);

    // Fetch real-time ticker highlights
    async function fetchTickerRates() {
      try {
        const response = await fetch("https://api.frankfurter.dev/v1/latest?base=EUR");
        if (response.ok) {
          const json = await response.json();
          if (json && json.rates) {
            setTickerRates(json.rates);
          }
        }
      } catch (err) {
        console.error("Erro ao obter cotações para o ticker:", err);
      } finally {
        setLoadingTicker(false);
      }
    }
    fetchTickerRates();
  }, []);

  // Set the theme class securely on the root HTML
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const tickerItems = [
    { pair: "EUR/BRL", code: "BRL", flag: "🇧🇷", label: "Real Brasileiro", color: "text-emerald-500" },
    { pair: "EUR/USD", code: "USD", flag: "🇺🇸", label: "Dólar Americano", color: "text-amber-500" },
    { pair: "EUR/GBP", code: "GBP", flag: "🇬🇧", label: "Libra Esterlina", color: "text-sky-400" },
    { pair: "EUR/CHF", code: "CHF", flag: "🇨🇭", label: "Franco Suíço", color: "text-rose-500" },
    { pair: "EUR/CAD", code: "CAD", flag: "🇨🇦", label: "Dólar Canadiano", color: "text-amber-600" },
    { pair: "EUR/AUD", code: "AUD", flag: "🇦🇺", label: "Dólar Australiano", color: "text-teal-400" },
    { pair: "EUR/JPY", code: "JPY", flag: "🇯🇵", label: "Iene Japonês", color: "text-indigo-400" },
    { pair: "EUR/CNY", code: "CNY", flag: "🇨🇳", label: "Yuan Chinês", color: "text-red-400" },
    { pair: "EUR/SEK", code: "SEK", flag: "🇸🇪", label: "Coroa Sueca", color: "text-blue-400" },
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans flex flex-col selection:bg-amber-500 selection:text-slate-950 transition-colors duration-250 relative overflow-x-hidden">
      {/* Background glow graphics */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-emerald-500/3 rounded-full blur-[160px] pointer-events-none" />

      {/* Header element */}
      <header className="border-b border-brand-border bg-brand-card/85 backdrop-blur-md sticky top-0 z-50 transition-colors duration-250">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentPage("converter")}
            className="flex items-center gap-3 cursor-pointer select-none group"
            title="Ir para o Conversor Principal"
          >
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/15 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <Coins className="w-5 h-5 font-bold" />
            </div>
            <div className="flex flex-col">
              <div className="text-base sm:text-lg font-extrabold tracking-tight text-brand-title flex items-center gap-1 transition-colors duration-250 group-hover:text-amber-550 group-hover:dark:text-amber-400">
                conversordemoeda<span className="text-amber-500 font-black">.pt</span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-brand-muted font-mono tracking-wider uppercase font-medium">
                Mercado Português 🇵🇹
              </span>
            </div>
          </div>

          {/* Quick status details & Dynamic Theme Toggle */}
          <div className="flex items-center gap-3 sm:gap-6 text-xs text-brand-muted font-medium">
            <div className="hidden sm:flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-555 text-emerald-500" />
              <span>Conexão Segura SSL</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 border-l border-brand-border pl-6 transition-colors duration-250">
              <BadgeCheck className="w-4 h-4 text-amber-500" />
              <span>BCE Oficial</span>
            </div>
            <div className="hidden md:flex items-center gap-2 border-l border-brand-border pl-6 font-mono text-xs transition-colors duration-250">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-brand-text">Serviço Online</span>
            </div>

            {/* Dynamic Interactive Theme Toggle */}
            <div className="flex items-center border-l-0 sm:border-l border-brand-border pl-0 sm:pl-6 transition-colors duration-250">
              <button
                type="button"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-2 rounded-xl bg-brand-inner hover:bg-brand-accent text-brand-title hover:text-amber-550 border border-brand-border transition-all duration-200 cursor-pointer flex items-center justify-center shadow-sm select-none"
                title={theme === "light" ? "Mudar para Modo Escuro" : "Mudar para Modo Claro"}
                id="botão-tema"
              >
                {theme === "light" ? (
                  <Moon className="w-4.5 h-4.5 text-slate-700" />
                ) : (
                  <Sun className="w-4.5 h-4.5 text-amber-400 animate-spin-slow" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Decorative dynamic ticker strip for popular pairs */}
      <div className="bg-brand-accent/35 border-b border-brand-border overflow-hidden py-3 shadow-sm relative transition-colors duration-250">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center relative z-10">
          
          {/* Scroller Frame */}
          <div className="flex-1 overflow-hidden relative w-full h-5 flex items-center">
            {/* Fade overlays for soft scrolling edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-brand-bg/0 to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-brand-bg/0 to-transparent pointer-events-none z-10" />

            {/* Loop structure to create infinite marquee effect */}
            <div className="animate-marquee flex gap-12 items-center">
              {/* Original Set */}
              {tickerItems.map((item, index) => {
                const liveRate = tickerRates[item.code];
                return (
                  <div key={`orig-${item.code}-${index}`} className="flex items-center gap-2 shrink-0 select-none">
                    <span className="text-xs font-semibold text-brand-muted font-mono">{item.flag}</span>
                    <span className="text-xs font-bold text-brand-title font-sans">{item.pair}</span>
                    <span className={`text-xs font-mono font-bold ${item.color}`}>
                      {loadingTicker ? (
                        <span className="opacity-40">...</span>
                      ) : liveRate ? (
                        liveRate.toFixed(4)
                      ) : (
                        "N/D"
                      )}
                    </span>
                    <span className="text-[10px] text-brand-subtle font-medium font-sans">({item.label})</span>
                  </div>
                );
              })}
              {/* Duplicate Set to ensure seamless infinite looping */}
              {tickerItems.map((item, index) => {
                const liveRate = tickerRates[item.code];
                return (
                  <div key={`dup-${item.code}-${index}`} className="flex items-center gap-2 shrink-0 select-none">
                    <span className="text-xs font-semibold text-brand-muted font-mono">{item.flag}</span>
                    <span className="text-xs font-bold text-brand-title font-sans">{item.pair}</span>
                    <span className={`text-xs font-mono font-bold ${item.color}`}>
                      {loadingTicker ? (
                        <span className="opacity-40">...</span>
                      ) : liveRate ? (
                        liveRate.toFixed(4)
                      ) : (
                        "N/D"
                      )}
                    </span>
                    <span className="text-[10px] text-brand-subtle font-medium font-sans">({item.label})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 flex flex-col gap-8 sm:gap-10">
        {currentPage === "converter" ? (
          <>
            {/* Banner Hero Title Section */}
            <div className="text-center max-w-3xl mx-auto space-y-4 px-1">
              <h1 className="text-2xl xs:text-3.5xl sm:text-5xl md:text-6xl font-black text-brand-title tracking-tight leading-tight sm:leading-none">
                Conversor de Moedas <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Premium</span> de Portugal
              </h1>
              <p className="text-base md:text-lg text-brand-muted font-semibold leading-relaxed max-w-2xl mx-auto pt-1">
                Simulações cambiais instantâneas com base em dados de mercado oficiais do Banco Central Europeu. Seguro, preciso e otimizado para o mercado português.
              </p>
            </div>

            {/* Dynamic 2-Column Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Column Left (De & Conversor) */}
              <div className="lg:col-span-7 space-y-8">
                <CurrencyConverter currentDate={todayDate} />
              </div>

              {/* Column Right (Histórico Gráfico) */}
              <div className="lg:col-span-5 h-full">
                <InteractiveChart currentDate={todayDate} />
              </div>
            </div>

            {/* Structured SEO FAQ section in footer block */}
            <PortugueseSEOSection currentDate={todayDate} />
          </>
        ) : currentPage === "taxas" ? (
          <TaxasETarifas onBackToConverter={() => setCurrentPage("converter")} />
        ) : currentPage === "privacidade" ? (
          <Privacidade onBackToConverter={() => setCurrentPage("converter")} />
        ) : currentPage === "termos" ? (
          <TermosDeUtilizacao onBackToConverter={() => setCurrentPage("converter")} />
        ) : (
          <SobreNos onBackToConverter={() => setCurrentPage("converter")} />
        )}
      </main>

      {/* Styled web footer */}
      <footer className="bg-brand-card border-t border-brand-border py-10 mt-16 text-xs text-brand-text transition-colors duration-250">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div 
              onClick={() => setCurrentPage("converter")}
              className="flex items-center gap-2 font-bold text-brand-title cursor-pointer hover:text-amber-500 transition-colors select-none"
              title="Ir para o Conversor Principal"
            >
              <Coins className="w-4 h-4 text-amber-500" />
              <span>conversordemoeda.pt</span>
            </div>
            <p className="mt-1 font-medium text-center md:text-left text-brand-muted">
              © 2026 conversordemoeda.pt. Todos os direitos reservados.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 font-bold text-brand-text">
            <button 
              onClick={() => setCurrentPage("taxas")} 
              className={`hover:text-amber-500 transition-colors cursor-pointer select-none focus:outline-none ${currentPage === 'taxas' ? 'text-amber-500' : ''}`}
            >
              Taxas e Tarifas
            </button>
            <button 
              onClick={() => setCurrentPage("privacidade")} 
              className={`hover:text-amber-550 hover:text-amber-500 transition-colors cursor-pointer select-none focus:outline-none ${currentPage === 'privacidade' ? 'text-amber-500' : ''}`}
            >
              Privacidade
            </button>
            <button 
              onClick={() => setCurrentPage("termos")} 
              className={`hover:text-amber-500 transition-colors cursor-pointer select-none focus:outline-none ${currentPage === 'termos' ? 'text-amber-500' : ''}`}
            >
              Termos de Utilização
            </button>
            <button 
              onClick={() => setCurrentPage("sobrenos")} 
              className={`hover:text-amber-500 transition-colors cursor-pointer select-none focus:outline-none ${currentPage === 'sobrenos' ? 'text-amber-500' : ''}`}
            >
              Sobre Nós
            </button>
          </div>
          
          <p className="text-[10px] text-brand-muted font-mono">
            Versão 3.1.2-stable (PT)
          </p>
        </div>
      </footer>
    </div>
  );
}
