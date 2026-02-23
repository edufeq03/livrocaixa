"use client";

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function DashboardPage() {
    const stats = [
        { label: 'Saldo Atual', value: 'R$ 12.450,00', icon: DollarSign, trend: '+12%', up: true },
        { label: 'Entradas (mês)', value: 'R$ 25.000,00', icon: TrendingUp, trend: '+8%', up: true },
        { label: 'Saídas (mês)', value: 'R$ 12.550,00', icon: TrendingDown, trend: '-2%', up: false },
        { label: 'Clientes Ativos', value: '142', icon: Users, trend: '+4', up: true },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Painel Geral</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Visão consolidada do fluxo financeiro.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:scale-[1.02] transition-all shadow-xl shadow-primary/20">
                        Novo Lançamento
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="p-6 bg-card rounded-[2rem] border border-border shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-secondary/50 rounded-2xl">
                                <stat.icon className="w-6 h-6 text-primary" />
                            </div>
                            <span className={`flex items-center gap-1 text-sm font-bold ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>
                                {stat.trend}
                                {stat.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-black mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-8 bg-card rounded-[2.5rem] border border-border h-96 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-secondary rounded-3xl flex items-center justify-center mb-4">
                        <TrendingUp className="w-8 h-8 text-muted-foreground opacity-50" />
                    </div>
                    <h3 className="text-xl font-bold">Gráfico de Crescimento</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">Os dados de transação serão exibidos aqui conforme os lançamentos forem realizados.</p>
                </div>
                <div className="p-8 bg-card rounded-[2.5rem] border border-border flex flex-col">
                    <h3 className="text-xl font-bold mb-6">Últimas Atividades</h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-secondary flex-shrink-0"></div>
                                <div>
                                    <p className="font-bold text-sm">Lançamento de Receita</p>
                                    <p className="text-xs text-muted-foreground">Há {i * 2} horas atrás</p>
                                </div>
                                <span className="ml-auto font-bold text-emerald-500">+ R$ {i * 100},00</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
