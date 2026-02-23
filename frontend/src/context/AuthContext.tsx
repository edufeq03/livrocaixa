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
                    // This would ideally be a /auth/me or similar endpoint
                    // For now we'll just parse the token or fetch basic info if possible
                    // In a real app we'd verify the token with the backend
                    // const res = await api.get('/auth/me');
                    // setUser(res.data);

                    // Simplified for MVP setup
                    setUser({ id: '1', name: 'User', email: 'user@example.com', role: 'ADMIN', tenant_id: null });
                } catch (err) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkUser();
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        // Fetch user info...
        setUser({ id: '1', name: 'User', email: 'user@example.com', role: 'ADMIN', tenant_id: null });
        router.push('/app/dashboard');
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
