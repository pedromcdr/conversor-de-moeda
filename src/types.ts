/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CurrencyItem {
  code: string;
  name: string;
  flag: string;
  symbol: string;
}

export interface LatestRateResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface HistoricalRate {
  date: string;
  value: number;
}

export interface ChartDataPoints {
  pair: string;
  rates: HistoricalRate[];
  minRate: number;
  maxRate: number;
  avgRate: number;
  latestRate: number;
  percentChange: number;
}

export const PORTUGUESE_CURRENCY_NAMES: Record<string, string> = {
  EUR: "Euro",
  USD: "Dólar Americano",
  BRL: "Real Brasileiro",
  GBP: "Libra Esterlina",
  CHF: "Franco Suíço",
  CAD: "Dólar Canadiano",
  AUD: "Dólar Australiano",
  BGN: "Lev Búlgaro",
  CNY: "Yuan Renminbi Chinês",
  CZK: "Coroa Checa",
  DKK: "Coroa Dinamarquesa",
  HKD: "Dólar de Hong Kong",
  HUF: "Florim Húngaro",
  IDR: "Rupia Indonésia",
  ILS: "Novo Shekel Israelita",
  INR: "Rupia Indiana",
  ISK: "Coroa Islandesa",
  JPY: "Iene Japonês",
  KRW: "Won Sul-Coreano",
  MXN: "Peso Mexicano",
  MYR: "Ringgit Malaio",
  NOK: "Coroa Norueguesa",
  NZD: "Dólar da Nova Zelândia",
  PHP: "Peso Filipino",
  PLN: "Zloty Polaco",
  RON: "Leu Romeno",
  SEK: "Coroa Sueca",
  SGD: "Dólar de Singapura",
  THB: "Baht Tailandês",
  TRY: "Lira Turca",
  ZAR: "Rand Sul-Africano",
  AED: "Dirham dos Emirados Árabes Unidos",
  ARS: "Peso Argentino",
  CLP: "Peso Chileno",
  COP: "Peso Colombiano",
  EGP: "Libra Egípcia",
  HRK: "Kuna Croata",
  KWD: "Dinar Kuwaitiano",
  LBP: "Libra Libanesa",
  MAD: "Dirham Marroquino",
  PEN: "Sol Peruano",
  PKR: "Rupia Paquistanesa",
  RUB: "Rublo Russo",
  SAR: "Riyal Saudita",
  TWD: "Novo Dólar de Taiwan",
  UAH: "Hryvnia Ucraniano",
  VND: "Dong Vietnamita",
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  BRL: "R$",
  GBP: "£",
  CHF: "CHF",
  CAD: "C$",
  AUD: "A$",
  BGN: "лв",
  CNY: "¥",
  CZK: "Kč",
  DKK: "kr",
  HKD: "$",
  HUF: "Ft",
  IDR: "Rp",
  ILS: "₪",
  INR: "₹",
  ISK: "kr",
  JPY: "¥",
  KRW: "₩",
  MXN: "$",
  MYR: "RM",
  NOK: "kr",
  NZD: "$",
  PHP: "₱",
  PLN: "zł",
  RON: "lei",
  SEK: "kr",
  SGD: "$",
  THB: "฿",
  TRY: "₺",
  ZAR: "R",
  AED: "د.إ",
  ARS: "$",
  CLP: "$",
  COP: "$",
  EGP: "E£",
  HRK: "kn",
  KWD: "د.ك",
  LBP: "ل.ل",
  MAD: "د.m.",
  PEN: "S/",
  PKR: "₨",
  RUB: "₽",
  SAR: "ر.s",
  TWD: "NT$",
  UAH: "₴",
  VND: "₫",
};

export function getCurrencyFlag(code: string): string {
  const flags: Record<string, string> = {
    EUR: "🇪🇺",
    USD: "🇺🇸",
    BRL: "🇧🇷",
    GBP: "🇬🇧",
    CHF: "🇨🇭",
    CAD: "🇨🇦",
    AUD: "🇦🇺",
    BGN: "🇧🇬",
    CNY: "🇨🇳",
    CZK: "🇨🇿",
    DKK: "🇩🇰",
    HKD: "🇭🇰",
    HUF: "🇭🇺",
    IDR: "🇮🇩",
    ILS: "🇮🇱",
    INR: "🇮🇳",
    ISK: "🇮🇸",
    JPY: "🇯🇵",
    KRW: "🇰🇷",
    MXN: "🇲🇽",
    MYR: "🇲🇾",
    NOK: "🇳🇴",
    NZD: "🇳🇿",
    PHP: "🇵🇭",
    PLN: "🇵🇱",
    RON: "🇷🇴",
    SEK: "🇸🇪",
    SGD: "🇸🇬",
    THB: "🇹🇭",
    TRY: "🇹🇷",
    ZAR: "🇿🇦",
    AED: "🇦🇪",
    ARS: "🇦🇷",
    CLP: "🇨🇱",
    COP: "🇨🇴",
    EGP: "🇪🇬",
    HRK: "🇭🇷",
    KWD: "🇰🇼",
    LBP: "🇱🇧",
    MAD: "🇲🇦",
    PEN: "🇵🇪",
    PKR: "🇵🇰",
    RUB: "🇷🇺",
    SAR: "🇸🇦",
    TWD: "🇹🇼",
    UAH: "🇺🇦",
    VND: "🇻🇳",
  };
  return flags[code] || "🏳️";
}

export function getCurrencyFlagUrl(code: string): string {
  const mapping: Record<string, string> = {
    EUR: "eu",
    USD: "us",
    BRL: "br",
    GBP: "gb",
    CHF: "ch",
    CAD: "ca",
    AUD: "au",
    BGN: "bg",
    CNY: "cn",
    CZK: "cz",
    DKK: "dk",
    HKD: "hk",
    HUF: "hu",
    IDR: "id",
    ILS: "il",
    INR: "in",
    ISK: "is",
    JPY: "jp",
    KRW: "kr",
    MXN: "mx",
    MYR: "my",
    NOK: "no",
    NZD: "nz",
    PHP: "ph",
    PLN: "pl",
    RON: "ro",
    SEK: "se",
    SGD: "sg",
    THB: "th",
    TRY: "tr",
    ZAR: "za",
    AED: "ae",
    ARS: "ar",
    CLP: "cl",
    COP: "co",
    EGP: "eg",
    HRK: "hr",
    KWD: "kw",
    LBP: "lb",
    MAD: "ma",
    PEN: "pe",
    PKR: "pk",
    RUB: "ru",
    SAR: "sa",
    TWD: "tw",
    UAH: "ua",
    VND: "vn",
    AOA: "ao",
    CVE: "cv"
  };
  const countryCode = mapping[code.toUpperCase()] || "un";
  // Usar imagens públicas de alta fiabilidade do FlagCDN com cantos ligeiramente arredondados
  return `https://flagcdn.com/w80/${countryCode}.png`;
}
