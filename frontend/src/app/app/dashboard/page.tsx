"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '@/lib/api';

export default function DashboardPage() {
    const [statsData, setStatsData] = useState({
        total_income: 0,
        total_expense: 0,
        balance: 0,
        total_companies: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/stats/summary');
                setStatsData(res.data);
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        {
            label: 'Saldo Atual',
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(statsData.balance),
            icon: DollarSign,
            trend: '+0%',
            up: statsData.balance >= 0
        },
        {
            label: 'Entradas (Total)',
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(statsData.total_income),
            icon: TrendingUp,
            trend: '+0%',
            up: true
        },
        {
            label: 'Saídas (Total)',
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(statsData.total_expense),
            icon: TrendingDown,
            trend: '-0%',
            up: false
        },
        {
            label: 'Empresas Ativas',
            value: statsData.total_companies.toString(),
            icon: Users,
            trend: '+0',
            up: true
        },
    ];

    if (loading) {
        return <div className="p-12 text-center text-muted-foreground">Carregando painel...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Painel Geral</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Visão consolidada do fluxo financeiro.</p>
                </div>
                <div className="flex items-center gap-3">
                    <a href="/app/transactions" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:scale-[1.02] transition-all shadow-xl shadow-primary/20">
                        Novo Lançamento
                    </a>
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
