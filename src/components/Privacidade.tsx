/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, Eye, Lock, ArrowRight, BookOpen } from "lucide-react";

interface PrivacidadeProps {
  onBackToConverter: () => void;
}

export default function Privacidade({ onBackToConverter }: PrivacidadeProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 py-2 sm:py-4 animate-fade-in" id="pagina-privacidade">
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
          <Shield className="w-6 h-6 sm:w-8 r-8 text-amber-500 shrink-0" />
          <span>Política de Privacidade</span>
        </h2>
        <p className="text-xs sm:text-base text-brand-muted leading-relaxed">
          No conversordemoeda.pt, a sua segurança e a privacidade dos seus dados pessoais são garantidas ao abrigo do Regulamento Geral sobre a Proteção de Dados (RGPD).
        </p>
      </div>

      {/* Grid de Pontos-Chave */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-6 space-y-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 w-fit">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-brand-title text-sm sm:text-md">Zero Registo Obrigatório</h3>
          <p className="text-xs text-brand-text leading-relaxed">
            Não necessita de criar uma conta ou fornecer o seu nome ou e-mail para utilizar o nosso simulador. Garantimos total privacidade.
          </p>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-6 space-y-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 w-fit">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-brand-title text-sm sm:text-md">Encriptação HTTPS</h3>
          <p className="text-xs text-brand-text leading-relaxed">
            Todas as comunicações entre o seu browser e as nossas APIs de cotações são encriptadas de forma segura sob protocolo SSL/HTTPS moderno.
          </p>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-6 space-y-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 w-fit">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-brand-title text-sm sm:text-md font-sans">Sem Cookies Invasivos</h3>
          <p className="text-xs text-brand-text leading-relaxed">
            Utilizamos apenas cookies funcionais e de análise agregada extremamente leves. Não fazemos rastreio publicitário comportamental.
          </p>
        </div>
      </div>

      {/* Detalhes Longos */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
        <section className="space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-brand-title">1. Recolha e Tratamento de Dados</h3>
          <p className="text-xs sm:text-sm text-brand-text leading-relaxed">
            Como utilizador do <strong>conversordemoeda.pt</strong>, as únicas informações processadas pelo nosso servidor de alojamento são de caráter puramente técnico do protocolo HTTP (como o seu IP aproximado, dados de sistema operativo, tempo de carregamento da página e consultas efetuadas ao seletor de moedas). Estes dados não são associados a nenhuma identidade real e servem apenas para fins estatísticos ou de depuração técnica.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-brand-title">2. Ligações Externas e APIs</h3>
          <p className="text-xs sm:text-sm text-brand-text leading-relaxed">
            O nosso portal comunica de modo direto com a infraestrutura da <strong>Frankfurter API</strong> para descarregar o histórico de cotações oficial do Banco Central Europeu. Estas transmissões não transportam qualquer informação pessoal do utilizador e aplicam restrições de segurança padrão.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-brand-title">3. Direitos dos Utilizadores (RGPD)</h3>
          <p className="text-xs sm:text-sm text-brand-text leading-relaxed">
            Dado que não guardamos nem indexamos nomes, faturas ou correios eletrónicos individuais, não mantemos qualquer perfil pessoal para exclusão ou anonimização. No entanto, se tiver qualquer dúvida genérica sobre a forma como o nosso tráfego flui, pode entrar em contacto seguro com a equipa de manutenção do projeto.
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
