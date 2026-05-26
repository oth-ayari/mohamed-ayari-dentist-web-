'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminContextValue {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('admin-theme') as 'light' | 'dark' | null;
    const initial = saved ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setAdmin(data.data ?? null);
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  useEffect(() => {
    if (!isLoading && !admin && pathname?.startsWith('/admin') && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isLoading, admin, pathname, router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setAdmin(data.data.admin);
        return { success: true };
      }
      return { success: false, error: data.error ?? 'Échec de la connexion' };
    } catch {
      return { success: false, error: 'Erreur réseau. Réessayez.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } finally {
      setAdmin(null);
      router.push('/admin/login');
    }
  };

  const refreshAdmin = useCallback(async () => { await fetchMe(); }, [fetchMe]);

  const toggleTheme = () =>
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <AdminContext.Provider
      value={{ admin, isLoading, isAuthenticated: !!admin, login, logout, refreshAdmin, theme, toggleTheme }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
