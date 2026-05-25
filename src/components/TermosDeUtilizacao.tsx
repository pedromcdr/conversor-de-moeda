/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileText, Award, AlertTriangle, Scale, ArrowRight } from "lucide-react";

interface TermosDeUtilizacaoProps {
  onBackToConverter: () => void;
}

export default function TermosDeUtilizacao({ onBackToConverter }: TermosDeUtilizacaoProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 py-2 sm:py-4 animate-fade-in" id="pagina-termos">
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
          <FileText className="w-6 h-6 sm:w-8 r-8 text-amber-500 shrink-0" />
          <span>Termos de Utilização</span>
        </h2>
        <p className="text-xs sm:text-base text-brand-muted leading-relaxed">
          Ao aceder e navegar nas ferramentas disponibilizadas pelo conversordemoeda.pt, o utilizador concorda tacitamente e compromete-se a cumprir os seguintes termos.
        </p>
      </div>

      {/* Grid de Pontos Importantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-6 space-y-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 w-fit">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-brand-title">Isenção de Responsabilidade Financeira</h3>
          <p className="text-xs sm:text-sm text-brand-text leading-relaxed">
            As taxas cambiais são fornecidas apenas para fins educativos, estatísticos e informativos généraux. Não aconselhamos nem efetuamos operações diretas de investimento ou especulação. Não nos responsabilizamos por perdas de lucro resultantes de decisões financeiras baseadas nestes simuladores.
          </p>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-6 space-y-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 w-fit">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-brand-title">Propriedade Intelectual Relevante</h3>
          <p className="text-xs sm:text-sm text-brand-text leading-relaxed">
            O design, código-fonte, layout visual e algoritmo desenvolvidos para o portal <strong>conversordemoeda.pt</strong> constituem propriedade autoral registada. É estritamente proibida qualquer raspagem robótica de dados (web scraping) ou republicação automatizada das nossas ferramentas sem consentimento expresso por escrito.
          </p>
        </div>
      </div>

      {/* Tabela de Responsabilidade e Termos Jurídicos */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
          <Scale className="w-5 h-5 text-amber-500 shrink-0" />
          <h3 className="text-base sm:text-lg font-bold text-brand-title">Enquadramento Legal e Jurisdição</h3>
        </div>

        <section className="space-y-2">
          <h4 className="text-sm sm:text-base font-bold text-brand-title">1. Exatidão das Informações Fornecidas</h4>
          <p className="text-xs sm:text-sm text-brand-text leading-relaxed">
            Embora todos os dados provenientes da Frankfurter API correspondam às taxas publicadas diariamente pela autoridade monetária central na Zona Euro, as informações podem não refletir instantaneamente discrepâncias pontuais de última hora introduzidas por feriados cambiais nacionais ou flutuações geopolíticas rápidas de fim-de-semana.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="text-sm sm:text-base font-bold text-brand-title">2. Modificações de Serviços</h4>
          <p className="text-xs sm:text-sm text-brand-text leading-relaxed">
            Reservamo-nos o direito de suspender, atualizar, otimizar ou restringir o acesso a partes ou à totalidade do website sem qualquer aviso prévio ou justificação subsequente, por razões associadas a atualizações nos servidores ou alterações regulatórias aplicadas de forma oficial no território português.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="text-sm sm:text-base font-bold text-brand-title">3. Uso Permitido e Ético</h4>
          <p className="text-xs sm:text-sm text-brand-text leading-relaxed">
            O site foi planeado de forma dedicada ao uso civil e de pequenas empresas locais em Portugal. O abuso nas consultas repetitivas que sobrecarregue desnecessariamente as ligações de rede será mitigado de forma proativa através de bloqueios de firewall automatizados de forma a salvaguardar a estabilidade para os restantes utilizadores nacionais.
          </p>
        </section>
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
