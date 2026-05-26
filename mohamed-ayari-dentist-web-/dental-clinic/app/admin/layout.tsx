'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminProvider, useAdmin } from '@/components/admin/AdminProvider';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopNavbar } from '@/components/admin/TopNavbar';
import { LoadingScreen } from '@/components/admin/LoadingScreen';

function AdminShell({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAdmin();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) return <LoadingScreen />;
  if (pathname === '/admin/login' || pathname === '/admin') return <>{children}</>;
  if (!isAuthenticated) return <LoadingScreen />;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-navy-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuOpen={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
