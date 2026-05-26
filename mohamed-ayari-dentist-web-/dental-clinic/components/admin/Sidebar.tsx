'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Star,
  MessageSquare,
  Image,
  BarChart3,
  Settings,
  LogOut,
  X,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';
import { useAdmin } from './AdminProvider';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/appointments', label: 'Rendez-vous', icon: CalendarDays },
  { href: '/admin/reviews', label: 'Avis patients', icon: Star },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/gallery', label: 'Galerie', icon: Image },
  { href: '/admin/analytics', label: 'Analytiques', icon: BarChart3 },
  { href: '/admin/settings', label: 'Paramètres', icon: Settings },
];

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick}>
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={`
          group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
          ${active
            ? 'bg-cyan-500/10 text-cyan-400 dark:text-cyan-400'
            : 'text-navy-300 hover:bg-white/5 hover:text-white dark:text-navy-300 dark:hover:text-white'
          }
        `}
      >
        {active && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-cyan-500"
          />
        )}
        <Icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-cyan-400' : ''}`} />
        <span className="flex-1 truncate">{label}</span>
        {active && <ChevronRight className="h-3 w-3 text-cyan-500 opacity-60" />}
      </motion.div>
    </Link>
  );
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { admin, logout } = useAdmin();

  const sidebarContent = (
    <div className="flex h-full flex-col bg-navy-900 dark:bg-navy-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-navy-700/50 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 shadow-cyan">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">Dr. Ayari</p>
            <p className="mt-0.5 text-xs text-navy-300">Administration</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-navy-400 hover:bg-white/10 hover:text-white transition-colors lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-widest text-navy-400">
          Navigation
        </p>
        {NAV_ITEMS.map(item => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href || pathname.startsWith(item.href + '/')}
            onClick={onClose}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-navy-700/50 p-3">
        <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-bold">
            {admin?.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{admin?.name}</p>
            <p className="truncate text-xs text-navy-400">{admin?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}</p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-navy-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden w-64 flex-shrink-0 lg:block">
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
