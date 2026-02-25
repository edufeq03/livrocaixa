"use client";

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Search, Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import api from '@/lib/api';

interface Category {
    id: string;
    name: string;
    type: 'INCOME' | 'EXPENSE';
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'INCOME' as 'INCOME' | 'EXPENSE'
    });

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories/');
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await api.put(`/categories/${editingCategory.id}`, formData);
            } else {
                await api.post('/categories/', formData);
            }
            setShowModal(false);
            setEditingCategory(null);
            setFormData({ name: '', type: 'INCOME' });
            fetchCategories();
        } catch (err) {
            console.error('Error saving category:', err);
            alert('Erro ao salvar categoria.');
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, type: category.type });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (err) {
            console.error('Error deleting category:', err);
            alert('Erro ao excluir categoria.');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Categorias</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Gerencie as categorias de receitas e despesas.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCategory(null);
                        setFormData({ name: '', type: 'INCOME' });
                        setShowModal(true);
                    }}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Nova Categoria
                </button>
            </div>

            <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-secondary/30">
                            <th className="text-left p-6 font-bold">Nome</th>
                            <th className="text-left p-6 font-bold">Tipo</th>
                            <th className="text-right p-6 font-bold">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan={3} className="p-12 text-center text-muted-foreground">Carregando categorias...</td></tr>
                        ) : categories.length === 0 ? (
                            <tr><td colSpan={3} className="p-12 text-center text-muted-foreground">Nenhuma categoria encontrada.</td></tr>
                        ) : categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-secondary/20 transition-colors">
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-secondary rounded-lg">
                                            <Tag className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="font-bold">{cat.name}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${cat.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {cat.type === 'INCOME' ? <ArrowUpCircle className="w-3 h-3" /> : <ArrowDownCircle className="w-3 h-3" />}
                                        {cat.type === 'INCOME' ? 'Receita' : 'Despesa'}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(cat)} className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-primary">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-red-500">
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
                        <h2 className="text-2xl font-bold">{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Nome da Categoria</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-4 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary"
                                    placeholder="Ex: Vendas, Aluguel, etc."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Tipo</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                                        className={`p-4 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${formData.type === 'INCOME'
                                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                                                : 'bg-secondary/50 border-border'
                                            }`}
                                    >
                                        <ArrowUpCircle className="w-5 h-5" /> Receita
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                                        className={`p-4 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${formData.type === 'EXPENSE'
                                                ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20'
                                                : 'bg-secondary/50 border-border'
                                            }`}
                                    >
                                        <ArrowDownCircle className="w-5 h-5" /> Despesa
                                    </button>
                                </div>
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
