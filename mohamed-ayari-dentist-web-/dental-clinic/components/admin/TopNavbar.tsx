'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, Sun, Moon, Bell, Search } from 'lucide-react';
import { useAdmin } from './AdminProvider';

interface TopNavbarProps {
  onMenuOpen: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Tableau de bord',
  '/admin/appointments': 'Rendez-vous',
  '/admin/reviews': 'Avis patients',
  '/admin/messages': 'Messages',
  '/admin/gallery': 'Galerie',
  '/admin/analytics': 'Analytiques',
  '/admin/settings': 'Paramètres',
};

export function TopNavbar({ onMenuOpen }: TopNavbarProps) {
  const pathname = usePathname();
  const { admin, theme, toggleTheme } = useAdmin();
  const title = PAGE_TITLES[pathname ?? ''] ?? 'Administration';

  return (
    <header className="flex h-16 items-center justify-between border-b border-navy-700/30 bg-white/80 px-4 backdrop-blur-md dark:bg-navy-900/80 dark:border-navy-700/50">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-400 hover:bg-gray-100 dark:hover:bg-navy-700 hover:text-navy-700 dark:hover:text-white transition-colors lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold text-navy-900 dark:text-white">{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="hidden md:flex h-9 items-center gap-2 rounded-lg border border-gray-200 dark:border-navy-700 bg-gray-50 dark:bg-navy-800 px-3 text-sm text-navy-400 hover:border-cyan-400/50 transition-colors">
          <Search className="h-4 w-4" />
          <span className="text-xs">Rechercher...</span>
          <kbd className="ml-2 rounded bg-gray-200 dark:bg-navy-700 px-1.5 py-0.5 text-[10px] font-mono text-navy-400">⌘K</kbd>
        </button>

        {/* Theme toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-navy-700 text-navy-500 dark:text-navy-300 hover:bg-gray-100 dark:hover:bg-navy-700 hover:text-cyan-500 transition-colors"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-navy-700 text-navy-500 dark:text-navy-300 hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-cyan-500 ring-2 ring-white dark:ring-navy-900" />
        </button>

        {/* Avatar */}
        <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 text-sm font-bold text-white shadow-md ring-2 ring-cyan-500/20 hover:ring-cyan-500/40 transition-all">
          {admin?.name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
