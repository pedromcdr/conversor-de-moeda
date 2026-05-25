/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Calendar, RefreshCw, BarChart2 } from "lucide-react";
import { HistoricalRate, ChartDataPoints, getCurrencyFlag, CURRENCY_SYMBOLS } from "../types";

interface InteractiveChartProps {
  currentDate: string; // "2026-05-23"
}

export default function InteractiveChart({ currentDate }: InteractiveChartProps) {
  const [selectedPair, setSelectedPair] = useState<string>("EUR/BRL");
  const [period, setPeriod] = useState<"30" | "180">("30");
  const [chartData, setChartData] = useState<ChartDataPoints | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Track hover state for the interactive SVG crosshair and tooltip
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const pairs = [
    { label: "EUR / BRL", base: "EUR", target: "BRL", desc: "Comunidade brasileira" },
    { label: "EUR / USD", base: "EUR", target: "USD", desc: "Compras e Ref. Global" },
    { label: "EUR / GBP", base: "EUR", target: "GBP", desc: "Turismo e UK expat" },
    { label: "EUR / CHF", base: "EUR", target: "CHF", desc: "Imigração na Suíça" },
    { label: "EUR / CAD", base: "EUR", target: "CAD", desc: "Diáspora no Canadá" },
  ];

  useEffect(() => {
    async function fetchHistoricalData() {
      setLoading(true);
      setError(null);
      try {
        const activePair = pairs.find((p) => p.label === selectedPair) || pairs[0];
        
        // Calculate start date
        const endDateObj = new Date(currentDate);
        const startDateObj = new Date(currentDate);
        if (period === "30") {
          startDateObj.setDate(endDateObj.getDate() - 30);
        } else {
          startDateObj.setMonth(endDateObj.getMonth() - 6);
        }

        const startStr = startDateObj.toISOString().split("T")[0];
        const endStr = endDateObj.toISOString().split("T")[0];

        const url = `https://api.frankfurter.dev/v1/${startStr}..${endStr}?base=${activePair.base}&symbols=${activePair.target}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erro ao obter dados históricos da Frankfurter.");
        }

        const json = await response.json();
        const ratesObj = json.rates as Record<string, Record<string, number>>;
        
        // Parse into sorted historical rates list
        const ratesList: HistoricalRate[] = Object.entries(ratesObj)
          .map(([date, targets]) => ({
            date,
            value: targets[activePair.target],
          }))
          .sort((a, b) => a.date.localeCompare(b.date));

        if (ratesList.length === 0) {
          throw new Error("Não existem dados disponíveis para este período.");
        }

        const values = ratesList.map((r) => r.value);
        const minRate = Math.min(...values);
        const maxRate = Math.max(...values);
        const avgRate = values.reduce((sum, v) => sum + v, 0) / values.length;
        const latestRate = ratesList[ratesList.length - 1].value;
        const firstRate = ratesList[0].value;
        const percentChange = ((latestRate - firstRate) / firstRate) * 100;

        setChartData({
          pair: selectedPair,
          rates: ratesList,
          minRate,
          maxRate,
          avgRate,
          latestRate,
          percentChange,
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Falha ao carregar dados do gráfico.");
      } finally {
        setLoading(false);
      }
    }

    fetchHistoricalData();
  }, [selectedPair, period, currentDate]);

  // Dimension values for responsive coordinate calculation
  const width = 600;
  const height = 240;
  const paddingLeft = isMobile ? 88 : 58;
  const paddingRight = 15;
  const paddingTop = 25;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Compute point positions
  let points: { x: number; y: number; data: HistoricalRate; index: number }[] = [];
  let pathD = "";
  let areaD = "";
  let yMin = 0;
  let yMax = 0;

  if (chartData && chartData.rates.length > 1) {
    const values = chartData.rates.map((r) => r.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const gap = maxVal - minVal || 0.0001;
    yMin = minVal - gap * 0.1;
    yMax = maxVal + gap * 0.1;

    points = chartData.rates.map((rate, i) => {
      const x = paddingLeft + (i / (chartData.rates.length - 1)) * chartWidth;
      const y = paddingTop + chartHeight - ((rate.value - yMin) / (yMax - yMin)) * chartHeight;
      return { x, y, data: rate, index: i };
    });

    pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ");
    areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;
  }

  // Combined helper for touch and mouse pointing to support mobile dragging smoothly
  const handlePointerMoveCoords = (clientX: number, svg: SVGSVGElement) => {
    if (!points.length || !chartData) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = width / rect.width;
    const svgX = (clientX - rect.left) * scaleX;

    let closestPt = points[0];
    let minDistance = Math.abs(points[0].x - svgX);

    for (let i = 1; i < points.length; i++) {
      const distance = Math.abs(points[i].x - svgX);
      if (distance < minDistance) {
        minDistance = distance;
        closestPt = points[i];
      }
    }

    setHoveredIndex(closestPt.index);
    setHoverCoords({ x: closestPt.x, y: closestPt.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    handlePointerMoveCoords(e.clientX, e.currentTarget);
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length > 0) {
      handlePointerMoveCoords(e.touches[0].clientX, e.currentTarget);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setHoverCoords(null);
  };

  // Helper values for active rate display
  const activeRate = hoveredIndex !== null && chartData ? chartData.rates[hoveredIndex] : null;
  const latestValueFormatted = chartData ? chartData.latestRate.toFixed(4) : "...";
  const trendPositive = chartData ? chartData.percentChange >= 0 : true;

  // Format date helper (e.g., "YYYY-MM-DD" -> "DD/MM")
  const formatDateLabel = (dateStr: string) => {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }
    return dateStr;
  };

  // Clean formatted full date
  const formatFullDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateStr).toLocaleDateString("pt-PT", options);
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-6 relative overflow-hidden flex flex-col h-full transition-colors duration-250" id="seccao-graficos">
      {/* Background radial highlight */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 z-10">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-brand-title tracking-tight transition-colors duration-250">Cotações Históricas</h3>
          </div>
          <p className="text-xs text-brand-muted mt-1 transition-colors duration-250">
            Tendências e oscilações cambiais ligadas diretamente ao mercado português.
          </p>
        </div>

        {/* Period selection */}
        <div className="flex items-center bg-brand-inner p-1 rounded-lg border border-brand-border self-start md:self-auto transition-colors duration-250">
          <button
            onClick={() => setPeriod("30")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer ${
              period === "30"
                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10"
                : "text-brand-muted hover:text-brand-title"
            }`}
          >
            Últimos 30 Dias
          </button>
          <button
            onClick={() => setPeriod("180")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer ${
              period === "180"
                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10"
                : "text-brand-muted hover:text-brand-title"
            }`}
          >
            Últimos 6 Meses
          </button>
        </div>
      </div>

      {/* Currency Pill Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6 z-10">
        {pairs.map((p) => {
          const isSelected = selectedPair === p.label;
          const targetFlag = getCurrencyFlag(p.target);
          const baseFlag = getCurrencyFlag(p.base);
          return (
            <button
              key={p.label}
              onClick={() => setSelectedPair(p.label)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-200 text-center cursor-pointer ${
                isSelected
                  ? "bg-brand-inner border-amber-500 shadow-md shadow-amber-500/5"
                  : "bg-brand-inner/40 border-brand-border hover:border-slate-400 dark:hover:border-slate-650 hover:bg-brand-inner/70"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm font-mono tracking-tight text-brand-title font-semibold">
                  {p.base}/{p.target}
                </span>
              </div>
              <span className="text-[10px] text-brand-muted font-medium truncate max-w-full">
                {p.desc}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[250px] text-brand-muted z-10">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mb-3" />
          <p className="text-sm text-brand-text animate-pulse font-medium">A carregar dados históricos do Banco Central Europeu...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[250px] p-4 text-center z-10">
          <div className="text-rose-500 font-semibold mb-2 text-sm">❌ {error}</div>
          <button
            onClick={() => setSelectedPair(selectedPair)}
            className="mt-3 px-4 py-1.5 bg-brand-inner border border-brand-border hover:border-amber-500/80 text-xs text-brand-title font-semibold rounded-lg transition-all"
          >
            Tentar Novamente
          </button>
        </div>
      ) : chartData ? (
        <div className="flex-1 flex flex-col z-10">
          {/* Quick Statistic Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5 p-3.5 bg-brand-inner border border-brand-border rounded-xl">
            <div>
              <p className="text-[11px] md:text-xs font-bold text-brand-text uppercase tracking-wider">Último Câmbio</p>
              <p className="text-xl md:text-2xl font-mono font-black text-brand-title tracking-tight mt-0.5">
                {chartData.latestRate.toFixed(4)}
                <span className="text-xs md:text-sm text-brand-muted font-normal ml-1">
                  {CURRENCY_SYMBOLS[chartData.pair.split("/")[1]] || ""}
                </span>
              </p>
            </div>
            <div>
              <p className="text-[11px] md:text-xs font-bold text-brand-text uppercase tracking-wider">Flutuação</p>
              <div className="flex items-center gap-1 mt-0.5">
                {trendPositive ? (
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-rose-500" />
                )}
                <span
                  className={`text-base md:text-lg font-mono font-black ${
                    trendPositive ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {trendPositive ? "+" : ""}
                  {chartData.percentChange.toFixed(2)}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-[11px] md:text-xs font-bold text-brand-text uppercase tracking-wider font-mono">Cotação Máxima</p>
              <p className="text-sm md:text-base font-bold text-brand-title font-mono mt-1">{chartData.maxRate.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-[11px] md:text-xs font-bold text-brand-text uppercase tracking-wider font-mono">Cotação Mínima</p>
              <p className="text-sm md:text-base font-bold text-brand-title font-mono mt-1">{chartData.minRate.toFixed(4)}</p>
            </div>
          </div>

          {/* Indicator Info Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-brand-inner border border-brand-border px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-all mb-4 select-none">
            <span className="text-brand-text font-bold">
              {activeRate ? (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Câmbio em {formatFullDate(activeRate.date)}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-brand-muted">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500/40 animate-pulse shrink-0" />
                  <span>Passa o rato sobre o gráfico para ver câmbios diários</span>
                </span>
              )}
            </span>
            <span className="font-mono text-amber-500 font-extrabold text-right">
              {activeRate ? (
                <span className="text-brand-title">
                  1 EUR = <span className="text-amber-500 font-black">{activeRate.value.toFixed(4)}</span>{" "}
                  {chartData.pair.split("/")[1]}
                </span>
              ) : (
                <span className="text-brand-muted font-sans font-semibold">
                  Média no período: <strong className="text-brand-title font-extrabold font-mono">{chartData.avgRate.toFixed(4)}</strong>
                </span>
              )}
            </span>
          </div>

          {/* SVG Frame Wrapper with Mouse & Touch Tracking */}
          <div className="relative flex-1 min-h-[180px] w-full select-none touch-none">
            {/* SVG Content responsive container */}
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full min-h-[180px] overflow-visible touch-none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchMove}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseLeave}
              onTouchCancel={handleMouseLeave}
            >
              <defs>
                {/* Area Gradient */}
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.00" />
                </linearGradient>
                {/* Line Gradient */}
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
 
               {/* Gridlines and Axis Labels */}
              {points.length > 1 && (
                <>
                  {/* Top Grid (Max) */}
                  <line
                    x1={paddingLeft}
                    y1={paddingTop}
                    x2={width - paddingRight}
                    y2={paddingTop}
                    stroke="var(--color-brand-border, #1e293b)"
                    strokeWidth="1.2"
                    strokeDasharray="4 6"
                    className="opacity-75"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={paddingTop}
                    fill="currentColor"
                    fontSize={isMobile ? "15" : "11"}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    className="font-mono text-brand-title font-extrabold"
                  >
                    {yMax.toFixed(4)}
                  </text>
 
                   {/* Mid Grid */}
                  <line
                    x1={paddingLeft}
                    y1={paddingTop + chartHeight / 2}
                    x2={width - paddingRight}
                    y2={paddingTop + chartHeight / 2}
                    stroke="var(--color-brand-border, #1e293b)"
                    strokeWidth="1"
                    strokeDasharray="4 6"
                    className="opacity-75"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={paddingTop + chartHeight / 2}
                    fill="currentColor"
                    fontSize={isMobile ? "15" : "11"}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    className="font-mono text-brand-title font-extrabold"
                  >
                    {((yMin + yMax) / 2).toFixed(4)}
                  </text>
 
                   {/* Bottom Grid (Min) */}
                  <line
                    x1={paddingLeft}
                    y1={paddingTop + chartHeight}
                    x2={width - paddingRight}
                    y2={paddingTop + chartHeight}
                    stroke="var(--color-brand-border, #1e293b)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={paddingTop + chartHeight}
                    fill="currentColor"
                    fontSize={isMobile ? "15" : "11"}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    className="font-mono text-brand-title font-extrabold"
                  >
                    {yMin.toFixed(4)}
                  </text>
 
                   {/* Date labels on timeline X-axis (Draw 4 points along the horizontal space) */}
                  {(() => {
                    const step = Math.floor(points.length / 3);
                    const labelIndices = [0, step, step * 2, points.length - 1];
                    return labelIndices.map((idx) => {
                      const pt = points[idx];
                      if (!pt) return null;
                      return (
                        <g key={idx}>
                          <line
                            x1={pt.x}
                            y1={paddingTop + chartHeight}
                            x2={pt.x}
                            y2={paddingTop + chartHeight + 5}
                            stroke="var(--color-brand-border, #1e293b)"
                            strokeWidth="1.5"
                          />
                          <text
                            x={pt.x}
                            y={paddingTop + chartHeight + 15}
                            fill="currentColor"
                            fontSize={isMobile ? "13" : "10"}
                            textAnchor="middle"
                            className="font-mono text-brand-text font-extrabold"
                          >
                            {formatDateLabel(pt.data.date)}
                          </text>
                        </g>
                      );
                    });
                  })()}
                </>
              )}
 
               {/* Area fill */}
              {areaD && <path d={areaD} fill="url(#chartGradient)" />}
 
               {/* Trend line */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
 
               {/* Hover crosshair state */}
              {hoverCoords && (
                <>
                  {/* Vertical coordinate line */}
                  <line
                    x1={hoverCoords.x}
                    y1={paddingTop}
                    x2={hoverCoords.x}
                    y2={paddingTop + chartHeight}
                    stroke="#f59e0b"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                    className="opacity-80"
                  />
                  {/* Horizontal tracker line helper */}
                  <line
                    x1={paddingLeft}
                    y1={hoverCoords.y}
                    x2={hoverCoords.x}
                    y2={hoverCoords.y}
                    stroke="#f59e0b"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                    className="opacity-80"
                  />
                  {/* Dynamic background badge on Y-axis for precise hover value feedback */}
                  <rect
                    x={2}
                    y={hoverCoords.y - (isMobile ? 11 : 8)}
                    width={paddingLeft - 8}
                    height={isMobile ? 22 : 16}
                    rx={4}
                    fill="#f59e0b"
                    className="shadow-md"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={hoverCoords.y}
                    fill="#020617"
                    fontSize={isMobile ? "14" : "9.5"}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    className="font-mono font-black"
                  >
                    {activeRate ? activeRate.value.toFixed(4) : ""}
                  </text>
 
                   {/* Glowing connector intersection circle */}
                  <circle
                    cx={hoverCoords.x}
                    cy={hoverCoords.y}
                    r="5"
                    fill="#f59e0b"
                    stroke="var(--color-brand-card, #090d16)"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={hoverCoords.x}
                    cy={hoverCoords.y}
                    r="9"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    className="animate-ping opacity-30"
                  />
                </>
              )}
            </svg>
          </div>
        </div>
      ) : null}
    </div>
  );
}
