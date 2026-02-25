"use client";

import React, { useState, useEffect } from 'react';
import { Landmark, Plus, Trash2, Edit } from 'lucide-react';
import api from '@/lib/api';

interface Account {
    id: string;
    name: string;
}

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const [formData, setFormData] = useState({
        name: ''
    });

    const fetchAccounts = async () => {
        try {
            const res = await api.get('/accounts/');
            setAccounts(res.data);
        } catch (err) {
            console.error('Error fetching accounts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAccount) {
                await api.put(`/accounts/${editingAccount.id}`, formData);
            } else {
                await api.post('/accounts/', formData);
            }
            setShowModal(false);
            setEditingAccount(null);
            setFormData({ name: '' });
            fetchAccounts();
        } catch (err) {
            console.error('Error saving account:', err);
            alert('Erro ao salvar conta.');
        }
    };

    const handleEdit = (account: Account) => {
        setEditingAccount(account);
        setFormData({ name: account.name });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta conta?')) return;
        try {
            await api.delete(`/accounts/${id}`);
            fetchAccounts();
        } catch (err) {
            console.error('Error deleting account:', err);
            alert('Erro ao excluir conta.');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Contas</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Gerencie as contas bancárias e caixa.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingAccount(null);
                        setFormData({ name: '' });
                        setShowModal(true);
                    }}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Nova Conta
                </button>
            </div>

            <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-secondary/30">
                            <th className="text-left p-6 font-bold">Nome da Conta</th>
                            <th className="text-right p-6 font-bold">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan={2} className="p-12 text-center text-muted-foreground">Carregando contas...</td></tr>
                        ) : accounts.length === 0 ? (
                            <tr><td colSpan={2} className="p-12 text-center text-muted-foreground">Nenhuma conta encontrada.</td></tr>
                        ) : accounts.map((acc) => (
                            <tr key={acc.id} className="hover:bg-secondary/20 transition-colors">
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-secondary rounded-lg">
                                            <Landmark className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="font-bold">{acc.name}</span>
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(acc)} className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-primary">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(acc.id)} className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-card w-full max-w-lg rounded-[2.5rem] border border-border shadow-2xl p-8 space-y-6 animate-in zoom-in-95 duration-300">
                        <h2 className="text-2xl font-bold">{editingAccount ? 'Editar Conta' : 'Nova Conta'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Nome da Conta</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-4 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary"
                                    placeholder="Ex: Banco do Brasil, Caixa, etc."
                                />
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
