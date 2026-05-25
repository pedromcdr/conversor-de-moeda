/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Users, Bookmark, Heart, Mail, CheckCircle2, ArrowRight } from "lucide-react";

interface SobreNosProps {
  onBackToConverter: () => void;
}

export default function SobreNos({ onBackToConverter }: SobreNosProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 py-2 sm:py-4 animate-fade-in" id="pagina-sobrenos">
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
          <Users className="w-6 h-6 sm:w-8 r-8 text-amber-500 shrink-0" />
          <span>Sobre Nós</span>
        </h2>
        <p className="text-xs sm:text-base text-brand-muted leading-relaxed">
          Conheça a missão, os valores e a equipa que desenvolve e mantém de forma independente o portal <strong>conversordemoeda.pt</strong> no mercado digital português.
        </p>
      </div>

      {/* Grid de Objetivos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-6 space-y-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 w-fit">
            <Bookmark className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-brand-title text-sm sm:text-md">Transparência Total</h3>
          <p className="text-xs text-brand-text leading-relaxed">
            A nossa prioridade é fornecer dados cambiais puros e limpos, sem margens inflacionadas ou truques escondidos.
          </p>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-6 space-y-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 w-fit">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-brand-title text-sm sm:text-md">Foco Utilizador</h3>
          <p className="text-xs text-brand-text leading-relaxed">
            Eliminamos banners com publicidades pesadas e cookies intrusivos para lhe dar a simulação de câmbio mais rápida do mercado.
          </p>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-6 space-y-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 w-fit">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-brand-title text-sm sm:text-md">Iniciativa Local</h3>
          <p className="text-xs text-brand-text leading-relaxed">
            Um projeto orgulhosamente concebido e otimizado com foco no mercado, emigrantes e investidores de Portugal.
          </p>
        </div>
      </div>

      {/* História e Propósito do Projeto */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg sm:text-xl font-bold text-brand-title">A Nossa Missão</h3>
          <p className="text-xs sm:text-sm text-brand-text leading-relaxed">
            O <strong>conversordemoeda.pt</strong> nasceu como resposta à escassez de ferramentas cambiais dinâmicas que fossem honestas de forma instantânea para os residentes em Portugal e para a nossa ampla comunidade lusófona global (emigrantes na Suíça, Alemanha, França, Reino Unido ou familiares no Brasil).
          </p>
          <p className="text-xs sm:text-sm text-brand-text leading-relaxed">
            A maioria dos websites de conversão tradicionais está sobrecarregada com anúncios pisca-pisca, lentidão, taxas desatualizadas e interfaces confusas que forçam a subscrição de contas ou serviços de envio internacionais. Nós acreditamos numa Web limpa, útil, intuitiva e instantaneamente compreensível.
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-brand-border">
          <h3 className="text-base sm:text-lg font-bold text-brand-title">Garantia Técnica e Resiliência</h3>
          <ul className="space-y-3 text-xs sm:text-sm text-brand-text">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <span>Conexão resiliente às cotações oficiais públicas do <strong>Banco Central Europeu (BCE)</strong> atualizadas diariamente.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <span>Geração dinâmica de gráficos realistas de desempenho cambial nos últimos 30 dias e nos últimos 6 meses.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <span>Desenvolvido utilizando tecnologias de vanguarda (React, Tailwind CSS, Lucide icons e SVG puro para máxima velocidade).</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-brand-inner/45 rounded-2xl p-4 sm:p-6 border border-brand-border text-center space-y-3">
        <h3 className="text-sm sm:text-lg font-black text-brand-title">Dúvidas ou Sugestões?</h3>
        <p className="text-xs sm:text-sm text-brand-text max-w-lg mx-auto leading-relaxed">
          Se detetar alguma cotação anormal, quiser sugerir novos pares cambiais ou pretender contactar-nos, envie e-mail para:
        </p>
        <div className="text-amber-500 font-mono font-bold text-xs sm:text-base hover:underline select-all py-1 break-all sm:break-normal inline-block">
          contacto@conversordemoeda.pt
        </div>
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
