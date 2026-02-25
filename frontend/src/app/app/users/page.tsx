"use client";

import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Mail, Shield, Trash2 } from 'lucide-react';
import api from '@/lib/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'CONTADOR_USER',
        password: ''
    });

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users/');
            setUsers(response.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/users/', newUser);
            setShowModal(false);
            fetchUsers();
            setNewUser({ name: '', email: '', role: 'CONTADOR_USER', password: '' });
        } catch (err) {
            console.error('Error adding user:', err);
            alert('Erro ao adicionar usuário.');
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este usuário?')) return;
        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Erro ao remover usuário.');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Gestão de Usuários</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Gerencie quem tem acesso ao sistema do escritório.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Novo Usuário
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-card border border-border focus:border-primary outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="glass border border-border rounded-[2.5rem] overflow-hidden shadow-xl bg-card/50">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-secondary/30">
                            <th className="p-6 font-bold text-sm uppercase tracking-wider text-muted-foreground">Usuário</th>
                            <th className="p-6 font-bold text-sm uppercase tracking-wider text-muted-foreground">Permissão</th>
                            <th className="p-6 font-bold text-sm uppercase tracking-wider text-muted-foreground text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-secondary/10 transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold">
                                            {u.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">{u.name}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Mail className="w-3 h-3" /> {u.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 w-fit ${u.role.includes('ADMIN')
                                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                                        }`}>
                                        <Shield className="w-3.5 h-3.5" />
                                        {u.role.replace('CONTADOR_', '').replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="p-6 text-center">
                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleDeleteUser(u.id)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Excluir"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && !loading && (
                    <div className="p-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto">
                            <Users className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold">Nenhum usuário encontrado</h3>
                    </div>
                )}
            </div>

            {/* Invite User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-card w-full max-w-lg rounded-[2.5rem] border border-border shadow-2xl p-8 space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Novo Usuário</h2>
                            <button onClick={() => setShowModal(false)} className="text-2xl">&times;</button>
                        </div>

                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Nome Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="w-full p-4 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
                                    placeholder="Ex: Maria Silva"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">E-mail</label>
                                <input
                                    type="email"
                                    required
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full p-4 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
                                    placeholder="maria@exemplo.com"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Permissão</label>
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
                                    >
                                        <option value="CONTADOR_USER">Usuário (Padrão)</option>
                                        <option value="CONTADOR_ADMIN">Administrador</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Senha Provisória</label>
                                    <input
                                        type="password"
                                        required
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
                            >
                                Adicionar Usuário
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
