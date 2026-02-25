"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Info } from 'lucide-react';

const MeiCalculator = () => {
  const [revenue, setRevenue] = useState<number>(75000);
  const [segment, setSegment] = useState<'comercio' | 'servicos' | 'ambos'>('servicos');
  const [results, setResults] = useState({
    meiAnual: 0,
    simplesAnual: 0,
    economy: 0
  });

  const calculate = () => {
    // MEI Fixed values (2024 approximation)
    const meiMonthly = segment === 'comercio' ? 71.60 : segment === 'servicos' ? 75.60 : 76.60;
    const meiAnual = meiMonthly * 12;

    // Simples Nacional - Annex I (Comercio) or III (Servicos) - Simplified for MVP
    // Annex I (Comercio): 4% up to 180k
    // Annex III (Servicos): 6% up to 180k
    const simplesRate = segment === 'comercio' ? 0.04 : 0.06;
    const simplesAnual = revenue * simplesRate;

    setResults({
      meiAnual,
      simplesAnual,
      economy: simplesAnual - meiAnual
    });
  };

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revenue, segment]);

  return (
    <div className="w-full max-w-2xl mx-auto glass p-8 rounded-2xl shadow-xl border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Calculator className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-2xl font-bold">Calculadora MEI vs Simples</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Faturamento Anual Previsto</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="20000"
              max="150000"
              step="5000"
              value={revenue}
              onChange={(e) => setRevenue(Number(e.target.value))}
              className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-lg font-mono font-bold whitespace-nowrap">
              R$ {revenue.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Segmento de Atuação</label>
          <div className="grid grid-cols-3 gap-3">
            {(['comercio', 'servicos', 'ambos'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSegment(s)}
                className={`py-2 px-4 rounded-xl text-sm font-medium transition-all ${segment === s
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="p-4 bg-secondary/50 rounded-xl border border-border">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Imposto Anual MEI</p>
            <p className="text-2xl font-bold">R$ {results.meiAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-xl border border-border">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Simples Nacional (Est.)</p>
            <p className="text-2xl font-bold">R$ {results.simplesAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        {revenue > 81000 && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-xl border border-amber-200 dark:border-amber-800 flex gap-3 text-sm">
            <Info className="w-5 h-5 flex-shrink-0" />
            <p>
              <strong>Atenção:</strong> Seu faturamento ultrapassa o limite do MEI (R$ 81.000).
              A migração para o Simples Nacional é obrigatória para evitar multas.
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-border mt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Perspectiva de Crescimento</p>
              <h4 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Sem limites para sua empresa
              </h4>
            </div>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95">
              Falar com Contador
            </button>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground mt-6 text-center italic">
        * Os valores exibidos são estimativas baseadas na legislação de 2024. Consulte sempre um contador credenciado.
      </p>
    </div>
  );
};

export default MeiCalculator;
