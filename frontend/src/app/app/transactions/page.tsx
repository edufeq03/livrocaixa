"use client";

import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Search, ArrowUpCircle, ArrowDownCircle, Calendar } from 'lucide-react';
import api from '@/lib/api';

interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    date_lancamento: string;
    category_id: string;
    account_id: string;
    company_id: string;
    category_name?: string;
    account_name?: string;
    company_name?: string;
}

interface Company {
    id: string;
    company_name: string;
}

interface Category {
    id: string;
    name: string;
    type: 'INCOME' | 'EXPENSE';
}

interface Account {
    id: string;
    name: string;
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'amount' | 'description'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const [newTransaction, setNewTransaction] = useState({
        description: '',
        amount: 0,
        type: 'INCOME' as 'INCOME' | 'EXPENSE',
        date_lancamento: new Date().toISOString(),
        category_id: '',
        account_id: '',
        company_id: ''
    });

    const fetchData = async () => {
        try {
            const [transRes, compRes, catRes, accRes] = await Promise.all([
                api.get('/transactions/'),
                api.get('/companies/'),
                api.get('/categories/'),
                api.get('/accounts/')
            ]);
            setTransactions(transRes.data);
            setCompanies(compRes.data);
            setCategories(catRes.data);
            setAccounts(accRes.data);

            if (compRes.data.length > 0 && !newTransaction.company_id) {
                setNewTransaction(prev => ({
                    ...prev,
                    company_id: compRes.data[0].id,
                    category_id: catRes.data.find((c: Category) => c.type === prev.type)?.id || '',
                    account_id: accRes.data[0]?.id || ''
                }));
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/transactions/', newTransaction);
            setShowModal(false);
            setNewTransaction({
                description: '',
                amount: 0,
                type: 'INCOME',
                date_lancamento: new Date().toISOString(),
                category_id: categories.find(c => c.type === 'INCOME')?.id || '',
                account_id: accounts[0]?.id || '',
                company_id: companies[0]?.id || ''
            });
            fetchData();
        } catch (err) {
            console.error('Error adding transaction:', err);
            alert('Erro ao adicionar transação.');
        }
    };

    const filteredAndSortedTransactions = transactions
        .filter(t =>
            t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const key = sortBy === 'date' ? 'date_lancamento' : sortBy;
            const valA = a[key as keyof Transaction];
            const valB = b[key as keyof Transaction];

            if (sortBy === 'date') {
                const timeA = new Date(valA as string).getTime();
                const timeB = new Date(valB as string).getTime();
                return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
            }

            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortOrder === 'asc' ? valA - valB : valB - valA;
            }

            const strA = String(valA).toLowerCase();
            const strB = String(valB).toLowerCase();
            if (sortOrder === 'asc') return strA > strB ? 1 : -1;
            return strA < strB ? 1 : -1;
        });

    const toggleSort = (field: 'date' | 'amount' | 'description') => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };


    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Transações</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Registro detalhado de entradas e saídas.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Novo Lançamento
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar por descrição ou categoria..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-card border border-border focus:border-primary outline-none transition-all shadow-sm"
                    />
                </div>
                {/* Simplified sort UI inside headers, but could add filter button here if needed */}
            </div>

            <div className="glass border border-border rounded-[2.5rem] overflow-hidden shadow-xl bg-card/50">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-secondary/30">
                            <th
                                className="p-6 font-bold text-sm uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                                onClick={() => toggleSort('description')}
                            >
                                Descrição {sortBy === 'description' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                className="p-6 font-bold text-sm uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                                onClick={() => toggleSort('amount')}
                            >
                                Valor {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="p-6 font-bold text-sm uppercase tracking-wider text-muted-foreground">Categoria</th>
                            <th className="p-6 font-bold text-sm uppercase tracking-wider text-muted-foreground">Empresa</th>
                            <th
                                className="p-6 font-bold text-sm uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                                onClick={() => toggleSort('date')}
                            >
                                Data {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredAndSortedTransactions.map((t) => (
                            <tr key={t.id} className="hover:bg-secondary/10 transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                            {t.type === 'INCOME' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                                        </div>
                                        <span className="font-bold">{t.description}</span>
                                    </div>
                                </td>
                                <td className={`p-6 font-bold ${t.type === 'INCOME' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {t.type === 'INCOME' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="p-6">
                                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-bold uppercase whitespace-nowrap">
                                        {t.category_name}
                                    </span>
                                </td>
                                <td className="p-6 text-sm text-muted-foreground italic">
                                    {t.company_name}
                                </td>
                                <td className="p-6 text-muted-foreground text-sm flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {t.date_lancamento ? new Date(t.date_lancamento).toLocaleDateString('pt-BR') : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredAndSortedTransactions.length === 0 && !loading && (
                    <div className="p-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto">
                            <CreditCard className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold">Nenhuma transação encontrada</h3>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-card w-full max-w-lg rounded-[2.5rem] border border-border shadow-2xl p-8 space-y-6 animate-in zoom-in-95 duration-300">
                        <h2 className="text-2xl font-bold">Novo Lançamento</h2>

                        <form onSubmit={handleAddTransaction} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const type = 'INCOME';
                                        setNewTransaction({ ...newTransaction, type, category_id: categories.find(c => c.type === type)?.id || '' });
                                    }}
                                    className={`p-4 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${newTransaction.type === 'INCOME'
                                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                                        : 'bg-secondary/50 border-border'
                                        }`}
                                >
                                    <ArrowUpCircle className="w-5 h-5" /> Receita
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const type = 'EXPENSE';
                                        setNewTransaction({ ...newTransaction, type, category_id: categories.find(c => c.type === type)?.id || '' });
                                    }}
                                    className={`p-4 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${newTransaction.type === 'EXPENSE'
                                        ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20'
                                        : 'bg-secondary/50 border-border'
                                        }`}
                                >
                                    <ArrowDownCircle className="w-5 h-5" /> Despesa
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Descrição</label>
                                <input
                                    type="text"
                                    required
                                    value={newTransaction.description}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                                    className="w-full p-4 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary"
                                    placeholder="Ex: Pagamento Fornecedor"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Valor (R$)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={newTransaction.amount || ''}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })}
                                        className="w-full p-4 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Data</label>
                                    <input
                                        type="date"
                                        required
                                        value={newTransaction.date_lancamento.split('T')[0]}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, date_lancamento: new Date(e.target.value).toISOString() })}
                                        className="w-full p-4 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Categoria</label>
                                    <select
                                        required
                                        value={newTransaction.category_id}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, category_id: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary"
                                    >
                                        <option value="">Selecione</option>
                                        {categories.filter(c => c.type === newTransaction.type).map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Conta</label>
                                    <select
                                        required
                                        value={newTransaction.account_id}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, account_id: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary"
                                    >
                                        <option value="">Selecione</option>
                                        {accounts.map(a => (
                                            <option key={a.id} value={a.id}>{a.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Empresa</label>
                                <select
                                    required
                                    value={newTransaction.company_id}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, company_id: e.target.value })}
                                    className="w-full p-4 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary"
                                >
                                    <option value="">Selecione a empresa</option>
                                    {companies.map(c => (
                                        <option key={c.id} value={c.id}>{c.company_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 p-4 rounded-xl font-bold border border-border hover:bg-secondary transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary text-primary-foreground p-4 rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
