"use client";

import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, MoreVertical, Filter, Trash2, Edit2 } from 'lucide-react';
import api from '@/lib/api';

interface Company {
    id: string;
    name: string;
    tax_id: string;
    address: string;
    city: string;
    state: string;
}

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newCompany, setNewCompany] = useState({
        name: '',
        tax_id: '',
        address: '',
        city: '',
        state: ''
    });

    const fetchCompanies = async () => {
        try {
            const response = await api.get('/companies/');
            setCompanies(response.data);
        } catch (err) {
            console.error('Error fetching companies:', err);
            // For demo purposes, set some mock data if API fails
            setCompanies([
                { id: '1', name: 'Padaria do João', tax_id: '12.345.678/0001-90', address: 'Rua das Flores, 123', city: 'São Paulo', state: 'SP' },
                { id: '2', name: 'Oficina Mecânica Silva', tax_id: '98.765.432/0001-10', address: 'Av. Brasil, 456', city: 'Curitiba', state: 'PR' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleAddCompany = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/companies/', newCompany);
            setShowModal(false);
            fetchCompanies();
            setNewCompany({ name: '', tax_id: '', address: '', city: '', state: '' });
        } catch (err) {
            console.error('Error adding company:', err);
            alert('Erro ao adicionar empresa. Verifique se o backend está rodando.');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Suas Empresas</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Gerencie os clientes associados à sua conta.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Nova Empresa
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou CNPJ..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-card border border-border focus:border-primary outline-none transition-all shadow-sm"
                    />
                </div>
                <button className="px-6 py-3 rounded-2xl bg-card border border-border flex items-center gap-2 font-medium hover:bg-secondary/50 transition-all">
                    <Filter className="w-5 h-5 text-muted-foreground" /> Filtros
                </button>
            </div>

            <div className="glass border border-border rounded-[2.5rem] overflow-hidden shadow-xl bg-card/50">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-secondary/30">
                            <th className="p-6 font-bold text-sm uppercase tracking-wider text-muted-foreground">Empresa</th>
                            <th className="p-6 font-bold text-sm uppercase tracking-wider text-muted-foreground">CNPJ</th>
                            <th className="p-6 font-bold text-sm uppercase tracking-wider text-muted-foreground">Localização</th>
                            <th className="p-6 font-bold text-sm uppercase tracking-wider text-muted-foreground">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {companies.map((company) => (
                            <tr key={company.id} className="hover:bg-secondary/10 transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                            <Building2 className="w-6 h-6" />
                                        </div>
                                        <span className="font-bold text-lg">{company.name}</span>
                                    </div>
                                </td>
                                <td className="p-6 font-mono text-sm">{company.tax_id}</td>
                                <td className="p-6">
                                    <p className="font-medium">{company.city}, {company.state}</p>
                                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{company.address}</p>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
                                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors"><MoreVertical className="w-4 h-4 text-muted-foreground" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {companies.length === 0 && !loading && (
                    <div className="p-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto">
                            <Building2 className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold">Nenhuma empresa encontrada</h3>
                        <p className="text-muted-foreground">Comece adicionando o seu primeiro cliente.</p>
                    </div>
                )}
            </div>

            {/* Basic Modal for Adding Company */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-card w-full max-w-lg rounded-[2.5rem] border border-border shadow-2xl p-8 space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Nova Empresa</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-secondary rounded-full transition-colors"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleAddCompany} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Nome Fantasia</label>
                                <input
                                    type="text"
                                    required
                                    value={newCompany.name}
                                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                                    className="w-full p-4 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
                                    placeholder="Ex: Padaria do João"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">CNPJ</label>
                                <input
                                    type="text"
                                    required
                                    value={newCompany.tax_id}
                                    onChange={(e) => setNewCompany({ ...newCompany, tax_id: e.target.value })}
                                    className="w-full p-4 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
                                    placeholder="00.000.000/0001-00"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Cidade</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCompany.city}
                                        onChange={(e) => setNewCompany({ ...newCompany, city: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Estado</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCompany.state}
                                        onChange={(e) => setNewCompany({ ...newCompany, state: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
                                        placeholder="SP"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
                            >
                                Salvar Empresa
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
