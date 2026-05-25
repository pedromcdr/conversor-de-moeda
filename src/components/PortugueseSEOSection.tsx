/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Globe, ShieldAlert, BadgeInfo } from "lucide-react";
import MiniChartsGrid from "./MiniChartsGrid";

interface FAQItemProps {
  id: string;
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ id, question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div 
      id={`faq-card-container-${id}`}
      className="border border-brand-border rounded-xl bg-brand-inner/40 hover:bg-brand-inner/60 overflow-hidden transition-all duration-300 hover:border-amber-500/50 shadow-sm"
    >
      <button
        id={id}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between p-4 px-5 text-left text-brand-title hover:text-amber-500 transition-all cursor-pointer font-bold gap-3 focus:outline-none select-none"
      >
        <span className="text-sm sm:text-base font-extrabold pr-2 select-text">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-amber-500 shrink-0 transform scale-110 transition-transform duration-200" />
        ) : (
          <ChevronDown className="w-5 h-5 text-brand-muted shrink-0 transition-transform duration-200" />
        )}
      </button>
      {isOpen && (
        <div 
          id={`faq-answer-content-${id}`}
          className="p-5 pt-4 border-t border-brand-border/80 bg-brand-inner/25 text-sm sm:text-[15px] text-brand-text leading-relaxed space-y-3 transition-opacity duration-300"
        >
          {answer}
        </div>
      )}
    </div>
  );
}

export default function PortugueseSEOSection({ currentDate }: { currentDate: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-8 mt-12 border-t border-brand-border pt-10 transition-colors duration-250" id="seccao-seo">
      {/* 6 Mini Sparkline Charts Grid */}
      <MiniChartsGrid currentDate={currentDate} />

      {/* Intro Text / Explanatory SEO Block */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6 md:p-8 space-y-4 transition-colors duration-250">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-extrabold text-brand-title tracking-tight sm:text-xl">
            Conversor de Moedas Inteligente para Portugal
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-brand-text leading-relaxed">
          Bem-vindo ao <strong>conversordemoeda.pt</strong>, o seu portal independente de referência em Portugal para conversões e cotações cambiais de alta precisão. Obtemos dados em tempo real diretamente da Frankfurter API (que reflete as taxas oficiais diárias divulgadas pelo <strong>Banco Central Europeu</strong>). Quer precise de calcular o contravalor de uma compra internacional, de uma transferência para a vasta comunidade brasileira ou simplesmente acompanhar a moeda britânica, fornecemos uma calculadora limpa, sem publicidade intrusiva, e totalmente adaptada às necessidades dos utilizadores em Portugal.
        </p>
        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
          As nossas ferramentas foram desenvolvidas a pensar no mercado nacional, focando-se em pares cruciais como o <strong>EUR/BRL</strong> (reais brasileiros), <strong>EUR/USD</strong> (dólar comercial para transações de tecnologia e comércio internacional), <strong>EUR/GBP</strong> (viagens e turismo no Reino Unido), <strong>EUR/CHF</strong> (emigrantes na Suíça) e <strong>EUR/CAD</strong> (comunidade no Canadá).
        </p>
      </div>

      {/* SEO Frequently Asked Questions (FAQ) Section */}
      <div className="space-y-4">
        <h3 className="text-md sm:text-lg font-black text-brand-title uppercase tracking-wider flex items-center gap-2 px-1">
          <HelpCircle className="w-4.5 h-4.5 text-amber-500" />
          <span>Perguntas Frequentes — Portugal</span>
        </h3>

        <div className="flex flex-col gap-4">
          <FAQItem
            id="faq-taxas-hoje"
            question="Qual é a melhor taxa de câmbio hoje?"
            isOpen={openIndex === 0}
            onToggle={() => toggleFAQ(0)}
            answer={
              <>
                <p>
                  A melhor taxa de câmbio cambial é aquela que mais se aproxima do <strong>câmbio comercial médio de mercado</strong>, também conhecido como taxa média de mercado ou taxa do Banco Central Europeu (BCE). Esta é a taxa de referência sem margens de lucro adicionadas que nós exibimos no <strong>conversordemoeda.pt</strong>.
                </p>
                <p className="mt-2 text-brand-muted">
                  Ao enviar dinheiro, evite balcões físicos ou bancos tradicionais em Portugal (como a Caixa Geral de Depósitos, Millennium BCP ou Novo Banco), pois estes costumam aplicar taxas de câmbio próprias com margens sobrepostas altas de até 3% a 5%, além de comissões fixas. Serviços especializados online como a Wise oferecem taxas oficiais e comissões totalmente transparentes.
                </p>
              </>
            }
          />

          <FAQItem
            id="faq-transferir-brl"
            question="Como transferir de forma barata EUR para BRL?"
            isOpen={openIndex === 1}
            onToggle={() => toggleFAQ(1)}
            answer={
              <>
                <p>
                  Para converter e transferir Euros (EUR) para Reais Brasileiros (BRL) de forma eficiente, siga estes passos sugeridos:
                </p>
                <ol className="list-decimal pl-5 mt-2 space-y-2 text-brand-text">
                  <li>Consulte a cotação em tempo real aqui no site para perceber o valor real de mercado.</li>
                  <li>Utilize uma plataforma de transferências digitais regulada (como a Wise ou Remitly) em vez de uma transferência bancária internacional internacional por SWIFT tradicional.</li>
                  <li>Inicie uma transferência SEPA local para a conta da plataforma em Portugal para obter a isenção de comissões extra.</li>
                  <li>O dinheiro normalmente cai na conta brasileira via PIX em poucos minutos ou horas a um custo até 8 vezes menor que no banco convencional.</li>
                </ol>
              </>
            }
          />

          <FAQItem
            id="faq-consultar-cotacao"
            question="Onde posso consultar as cotações de moedas atualizadas?"
            isOpen={openIndex === 2}
            onToggle={() => toggleFAQ(2)}
            answer={
              <>
                <p>
                  O melhor sítio para consulta gratuita de cotações de moedas é através de portais dedicados online que usem dados de fontes conceituadas. O <strong>conversordemoeda.pt</strong> utiliza a Frankfurter API, uma infraestrutura de dados abertos que publica diariamente as atualizações do Banco Central Europeu pelas 15h00, horário de Lisboa.
                </p>
                <p className="mt-2 text-brand-muted">
                  Acompanhar as tendências através dos nossos gráficos interativos (de 30 dias e 6 meses) permite-lhe estudar flutuações e decidir o melhor momento para efetuar os seus pagamentos de forma otimizada.
                </p>
              </>
            }
          />

          <FAQItem
            id="faq-flutuacao-euro"
            question="O que determina a flutuação do Euro face a outras moedas?"
            isOpen={openIndex === 3}
            onToggle={() => toggleFAQ(3)}
            answer={
              <>
                <p>
                  A flutuação cambial da moeda única europeia (EUR) é influenciada por uma série de fatores económicos globais e locais, incluindo:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5 text-brand-text">
                  <li><strong>Taxas de Juro</strong>: Decisões de política monetária do BCE e da Reserva Federal dos EUA (FED).</li>
                  <li><strong>Dados de Inflação</strong>: Relatórios mensais de inflação na Zona Euro.</li>
                  <li><strong>Balança Comercial</strong>: Se as exportações da UE crescem, a procura pela moeda também aumenta.</li>
                  <li><strong>Geopolítica</strong>: Instabilidades políticas mundiais tendem a mover os investidores para moedas consideradas refúgio, como o Franco Suíço (CHF) ou o Dólar Americano (USD).</li>
                </ul>
              </>
            }
          />
        </div>
      </div>

      {/* Disclaimers & Info Banner */}
      <div className="bg-brand-inner/50 border border-brand-border rounded-xl p-4 flex gap-3 text-brand-muted transition-colors duration-250">
        <BadgeInfo className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong className="text-brand-text">Nota Informativa:</strong> Os valores cambiais e taxas exibidos no conversordemoeda.pt destinam-se exclusivamente a fins informativos e de simulação educacional. Embora obtenhamos atualizações regulares através de conectores de câmbio de mercado conceituados (Frankfurter/BCE), não garantimos a exatidão absoluta ao milésimo de segundo para transações ao vivo em bolsa. Verifique sempre com o seu fornecedor financeiro as condições finais aplicadas antes de executar operações financeiras de grande escala.
        </p>
      </div>
    </div>
  );
}
