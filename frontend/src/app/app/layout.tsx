"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Users, Building2, CreditCard, LogOut, ChevronRight, Menu, Tag, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { logout, user } = useAuth();

    const menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/app/dashboard' },
        { label: 'Transações', icon: CreditCard, href: '/app/transactions' },
        { label: 'Empresas', icon: Building2, href: '/app/companies' },
        { label: 'Categorias', icon: Tag, href: '/app/categories' },
        { label: 'Contas', icon: Wallet, href: '/app/accounts' },
        { label: 'Usuários', icon: Users, href: '/app/users' },
    ];

    return (
        <div className="min-h-screen bg-secondary/30 flex">
            {/* Sidebar */}
            <aside className="w-72 bg-card border-r border-border flex flex-col hidden lg:flex">
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">L</span>
                        </div>
                        <span className="font-bold text-xl">LivroCaixa</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center justify-between p-4 rounded-2xl hover:bg-secondary/50 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="font-medium">{item.label}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-border mt-auto">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                            {user?.name?.[0] || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-sm truncate">{user?.name || 'Carregando...'}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.role || 'User'}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 p-4 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Sair da conta
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Top Header */}
                <header className="h-20 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-8 lg:px-12 sticky top-0 z-10">
                    <button className="lg:hidden p-2 rounded-xl bg-secondary">
                        <Menu className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-bold">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary"></div>
                    </div>
                </header>

                <div className="p-8 lg:p-12 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
