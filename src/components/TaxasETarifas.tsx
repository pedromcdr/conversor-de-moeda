/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Percent, ShieldAlert, ArrowRight, Table, HelpCircle } from "lucide-react";

interface TaxasETarifasProps {
  onBackToConverter: () => void;
}

export default function TaxasETarifas({ onBackToConverter }: TaxasETarifasProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 py-2 sm:py-4 animate-fade-in" id="pagina-taxas">
      {/* Header */}
      <div className="space-y-3 px-1">
        <button
          onClick={onBackToConverter}
          className="text-xs sm:text-sm font-bold text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1.5 cursor-pointer select-none active:scale-95 duration-150"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Voltar ao Conversor Principal
        </button>
        <h2 className="text-2xl sm:text-3.5xl md:text-4xl font-black text-brand-title tracking-tight flex flex-row items-center gap-2.5 sm:gap-3 flex-wrap">
          <Percent className="w-6 h-6 sm:w-8 r-8 text-amber-500 shrink-0" />
          <span>Taxas e Tarifas Cambiais</span>
        </h2>
        <p className="text-xs sm:text-base text-brand-muted leading-relaxed">
          Compreenda de forma clara e límpida como funcionam as taxas de câmbio, as comissões cobradas pelos operadores de mercado portugueses e como obter o melhor valor possível.
        </p>
      </div>

      {/* Grid de Informação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-6 space-y-3 shadow-sm hover:border-amber-500/30 transition-all duration-300">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 w-fit">
            <Percent className="w-5 h-5 font-bold" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-brand-title">Câmbio Oficial do BCE vs. Câmbio Comercial</h3>
          <p className="text-xs sm:text-sm text-brand-text leading-relaxed">
            O Banco Central Europeu (BCE) divulga diariamente a <strong>taxa média interbancária nacional</strong>. É esta taxa real e pura que utilizamos no <em>conversordemoeda.pt</em>. No entanto, agências de câmbio de aeroportos e bancos tradicionais costumam adicionar o chamado <em>spread</em> sobre esta taxa oficial de forma a garantir margens de lucro ocultas.
          </p>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-6 space-y-3 shadow-sm hover:border-amber-500/30 transition-all duration-300">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 w-fit">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-brand-title">Evite as Taxas Ocultas de Câmbio</h3>
          <p className="text-xs sm:text-sm text-brand-text leading-relaxed">
            Muitas entidades promovem serviços com "Comissão 0%". Contudo, aplicam uma taxa de conversão inflacionada. Para descobrir o verdadeiro custo do seu envio, multiplique a taxa de câmbio real que vê no nosso portal e compare com o total que receberá no destino.
          </p>
        </div>
      </div>

      {/* Tabela de Comparação Ilustrativa de Custos em Portugal */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-brand-title flex items-center gap-2">
          <Table className="w-5 h-5 text-amber-500 shrink-0" />
          <span>Simulação de Custo em Portugal (Envia 1.000€)</span>
        </h3>
        <p className="text-xs text-brand-muted leading-relaxed">
          Comparação média estimada com base nas tarifas padrão de envio internacional cobradas por diferentes tipos de prestadores de serviços financeiros regulados pela CMVM ou Banco de Portugal.
        </p>
        
        <div className="overflow-x-auto border border-brand-border rounded-xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[340px]">
            <thead>
              <tr className="bg-brand-inner/50 border-b border-brand-border text-brand-title font-bold">
                <th className="p-2.5 sm:p-4 font-extrabold text-[11px] sm:text-xs uppercase tracking-wider">Operador de Câmbio</th>
                <th className="p-2.5 sm:p-4 font-extrabold text-[11px] sm:text-xs uppercase tracking-wider">Taxa Fixa</th>
                <th className="p-2.5 sm:p-4 font-extrabold text-[11px] sm:text-xs uppercase tracking-wider">Spread Cambial</th>
                <th className="p-2.5 sm:p-4 font-extrabold text-[11px] sm:text-xs uppercase tracking-wider">Custo Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-brand-text font-medium">
              <tr>
                <td className="p-2.5 sm:p-4 text-brand-title font-bold text-xs sm:text-sm">Bancos Tradicionais</td>
                <td className="p-2.5 sm:p-4 text-xs sm:text-sm">15€ a 30€ (SWIFT)</td>
                <td className="p-2.5 sm:p-4 text-xs sm:text-sm">2.5% a 5.0%</td>
                <td className="p-2.5 sm:p-4 text-red-500 font-bold text-xs sm:text-sm">40€ a 80€</td>
              </tr>
              <tr className="bg-brand-inner/20">
                <td className="p-2.5 sm:p-4 text-brand-title font-bold text-xs sm:text-sm">Lojas de Câmbio Físico</td>
                <td className="p-2.5 sm:p-4 text-xs sm:text-sm">2€ a 5€</td>
                <td className="p-2.5 sm:p-4 text-xs sm:text-sm text-red-400">4.0% a 8.0%</td>
                <td className="p-2.5 sm:p-4 text-red-500 font-bold text-xs sm:text-sm">42€ a 85€</td>
              </tr>
              <tr>
                <td className="p-2.5 sm:p-4 text-brand-title font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">Wise (Recomendado)</td>
                <td className="p-2.5 sm:p-4 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">~4.50€</td>
                <td className="p-2.5 sm:p-4 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">0.0% (Câmbio Interbancário)</td>
                <td className="p-2.5 sm:p-4 text-emerald-600 dark:text-emerald-400 font-black text-xs sm:text-sm">~4.50€ a 7.00€</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dicas e FAQ Rápidas */}
      <div className="bg-brand-inner/40 rounded-2xl p-4 sm:p-6 border border-brand-border space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-extrabold text-brand-title flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <span>Dica Prática para Utilizadores Portugueses</span>
        </h3>
        <p className="text-xs sm:text-sm text-brand-text leading-relaxed">
          Ao fazer um envio internacional, converta sempre pelo método de transferência eletrónica do banco local. Evite recolhas físicas de dinheiro ao máximo caso o seu objetivo seja maximizar as poupanças cambiais. Recomenda-se vivamente o uso de plataformas digitais transparentes e que utilizem comissões reduzidas.
        </p>
      </div>

      {/* Button Back */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onBackToConverter}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold tracking-tight shadow-md hover:shadow-lg hover:shadow-amber-500/10 transition-all cursor-pointer select-none active:scale-95 duration-150"
        >
          Voltar ao Simulador de Câmbio
        </button>
      </div>
    </div>
  );
}
