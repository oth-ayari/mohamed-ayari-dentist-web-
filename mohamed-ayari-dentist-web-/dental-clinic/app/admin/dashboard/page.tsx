'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays, Clock, CheckCircle, XCircle, MessageSquare,
  Star, Image, TrendingUp, Users, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  appointments: {
    total: number; pending: number; confirmed: number; cancelled: number;
    today: number; thisWeek: number;
  };
  messages: { total: number; unread: number };
  content: { testimonials: number; pendingTestimonials: number; galleryImages: number };
}

interface Appointment {
  id: string; patientName: string; email: string; phone: string;
  selectedService: string; appointmentDate: string; appointmentTime: string;
  status: string; createdAt: string;
}

interface Message {
  id: string; fullName: string; email: string; subject: string;
  isRead: boolean; createdAt: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentAppointments: Appointment[];
  recentMessages: Message[];
  upcomingAppointments: Appointment[];
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  PENDING:   { label: 'En attente', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  CONFIRMED: { label: 'Confirmé',   bg: 'bg-green-500/10', text: 'text-green-400' },
  CANCELLED: { label: 'Annulé',     bg: 'bg-red-500/10',   text: 'text-red-400' },
  COMPLETED: { label: 'Terminé',    bg: 'bg-blue-500/10',  text: 'text-blue-400' },
};

function StatCard({
  label, value, sub, icon: Icon, color, href, index,
}: {
  label: string; value: number | string; sub?: string;
  icon: React.ElementType; color: string; href?: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <Link href={href ?? '#'}>
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white p-5 shadow-card transition-all hover:shadow-card-hover dark:border-navy-700/50 dark:bg-navy-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-navy-400">{label}</p>
              <p className="mt-1.5 text-3xl font-bold tracking-tight text-navy-900 dark:text-white">{value}</p>
              {sub && <p className="mt-1 text-xs text-gray-500 dark:text-navy-400">{sub}</p>}
            </div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className={`absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r ${color.replace('bg-', 'from-')} to-transparent group-hover:w-full transition-all duration-500`} />
        </div>
      </Link>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, bg: 'bg-gray-100', text: 'text-gray-500' };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.success) setData(d.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-200 dark:bg-navy-800" />
        ))}
      </div>
    );
  }

  if (!data) return <p className="text-center text-red-400">Erreur de chargement</p>;

  const { stats, recentAppointments, recentMessages, upcomingAppointments } = data;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard index={0} label="Total RDV" value={stats.appointments.total} icon={CalendarDays} color="bg-cyan-500" href="/admin/appointments" />
        <StatCard index={1} label="Aujourd'hui" value={stats.appointments.today} sub={`${stats.appointments.thisWeek} cette semaine`} icon={Clock} color="bg-gold-500" href="/admin/appointments" />
        <StatCard index={2} label="En attente" value={stats.appointments.pending} sub={`${stats.appointments.confirmed} confirmés`} icon={TrendingUp} color="bg-amber-500" href="/admin/appointments?status=PENDING" />
        <StatCard index={3} label="Messages" value={stats.messages.unread} sub={`${stats.messages.total} total`} icon={MessageSquare} color="bg-violet-500" href="/admin/messages" />
        <StatCard index={4} label="Avis en attente" value={stats.content.pendingTestimonials} sub={`${stats.content.testimonials} total`} icon={Star} color="bg-orange-500" href="/admin/reviews" />
        <StatCard index={5} label="Confirmés" value={stats.appointments.confirmed} icon={CheckCircle} color="bg-green-500" href="/admin/appointments?status=CONFIRMED" />
        <StatCard index={6} label="Annulés" value={stats.appointments.cancelled} icon={XCircle} color="bg-red-500" href="/admin/appointments?status=CANCELLED" />
        <StatCard index={7} label="Galerie" value={stats.content.galleryImages} sub="images" icon={Image} color="bg-pink-500" href="/admin/gallery" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl border border-gray-200/60 bg-white p-5 shadow-card dark:border-navy-700/50 dark:bg-navy-900"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-navy-900 dark:text-white">Rendez-vous récents</h2>
            <Link href="/admin/appointments" className="flex items-center gap-1 text-xs font-medium text-cyan-500 hover:text-cyan-400">
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-navy-700">
                  <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-navy-400">Patient</th>
                  <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-navy-400 hidden md:table-cell">Service</th>
                  <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-navy-400">Date</th>
                  <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-navy-400">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-navy-800">
                {recentAppointments.map(apt => (
                  <tr key={apt.id} className="group hover:bg-gray-50 dark:hover:bg-navy-800/50">
                    <td className="py-2.5 pr-4">
                      <p className="font-medium text-navy-900 dark:text-white">{apt.patientName}</p>
                      <p className="text-xs text-gray-400 dark:text-navy-400">{apt.email}</p>
                    </td>
                    <td className="py-2.5 pr-4 text-gray-600 dark:text-navy-300 hidden md:table-cell">
                      <span className="truncate max-w-[140px] block">{apt.selectedService}</span>
                    </td>
                    <td className="py-2.5 pr-4 text-gray-600 dark:text-navy-300">
                      {new Date(apt.appointmentDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      <span className="ml-1 text-xs text-gray-400">{apt.appointmentTime}</span>
                    </td>
                    <td className="py-2.5"><StatusBadge status={apt.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Upcoming */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-card dark:border-navy-700/50 dark:bg-navy-900"
          >
            <h2 className="mb-3 text-base font-semibold text-navy-900 dark:text-white">À venir</h2>
            <div className="space-y-3">
              {upcomingAppointments.length === 0 && (
                <p className="text-sm text-gray-400">Aucun rendez-vous à venir</p>
              )}
              {upcomingAppointments.map(apt => (
                <div key={apt.id} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-cyan-500/10">
                    <span className="text-[10px] font-bold text-cyan-400">
                      {new Date(apt.appointmentDate).toLocaleDateString('fr-FR', { day: '2-digit' })}
                    </span>
                    <span className="text-[9px] text-cyan-500 uppercase">
                      {new Date(apt.appointmentDate).toLocaleDateString('fr-FR', { month: 'short' })}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-navy-900 dark:text-white">{apt.patientName}</p>
                    <p className="truncate text-xs text-gray-400 dark:text-navy-400">{apt.appointmentTime} · {apt.selectedService}</p>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-card dark:border-navy-700/50 dark:bg-navy-900"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-navy-900 dark:text-white">Messages</h2>
              <Link href="/admin/messages" className="text-xs text-cyan-500 hover:text-cyan-400">Voir tout</Link>
            </div>
            <div className="space-y-3">
              {recentMessages.map(msg => (
                <div key={msg.id} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-bold text-violet-400">
                    {msg.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-navy-900 dark:text-white">{msg.fullName}</p>
                      {!msg.isRead && <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-500" />}
                    </div>
                    <p className="truncate text-xs text-gray-400 dark:text-navy-400">{msg.subject}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="rounded-2xl border border-gray-200/60 bg-gradient-to-br from-cyan-500 to-cyan-700 p-5 shadow-cyan"
          >
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-white/80" />
              <div>
                <p className="text-sm font-medium text-white/80">Taux de confirmation</p>
                <p className="text-2xl font-bold text-white">
                  {stats.appointments.total > 0
                    ? Math.round((stats.appointments.confirmed / stats.appointments.total) * 100)
                    : 0}%
                </p>
              </div>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white/70"
                style={{
                  width: `${stats.appointments.total > 0 ? Math.round((stats.appointments.confirmed / stats.appointments.total) * 100) : 0}%`
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
