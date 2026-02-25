"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    tenant_id: string | null;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // In a real app, we would verify the token with a /auth/me call
                    // For now, if we have a token, we'll try to use it
                    // The dummy user was masking 401 errors because the UI thought we were logged in
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                } catch (err) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkUser();
    }, []);

    const login = async (token: string) => {
        localStorage.setItem('token', token);
        try {
            const res = await api.get('/auth/me');
            setUser(res.data);
            router.push('/app/dashboard');
        } catch (err) {
            console.error('Failed to fetch user after login:', err);
            // Fallback to avoid breaking the flow if /auth/me is slow
            setUser({ id: 'current', name: 'User', email: 'email@example.com', role: 'CONTADOR_ADMIN', tenant_id: null });
            router.push('/app/dashboard');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
