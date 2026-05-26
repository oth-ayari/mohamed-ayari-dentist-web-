'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, CalendarDays, MessageSquare, BarChart2,
  Globe, Monitor, Smartphone, Activity, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

interface AnalyticsOverview {
  totalVisitorsAllTime: number; todayVisits: number; monthlyVisits: number;
  visitGrowth: number; totalAppointments: number; pendingAppointments: number;
  confirmedAppointments: number; appointmentsThisMonth: number; bookingGrowth: number;
  totalMessages: number; unreadMessages: number; conversionRate: number;
}

interface ChartData {
  dailyVisits: { date: string; totalVisits: number; uniqueVisitors: number; bookingCount: number }[];
  serviceDistribution: { service: string; count: number }[];
  devices: { device: string; count: number }[];
  browsers: { browser: string; count: number }[];
}

interface AnalyticsData {
  overview: AnalyticsOverview;
  charts: ChartData;
  recentAppointments: { id: string; patientName: string; selectedService: string; appointmentDate: string; status: string }[];
}

interface RealtimeData {
  activeNow: number; lastHourVisits: number;
  todayAppointments: number; todayMessages: number;
  hourlyActivity: { hour: number; count: number }[];
}

function MiniBarChart({ data, color = 'bg-cyan-500' }: { data: number[]; color?: string }) {
  const peak = Math.max(...data, 1);
  return (
    <div className="flex h-16 items-end gap-0.5">
      {data.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }} animate={{ height: `${(v / peak) * 100}%` }}
          transition={{ delay: i * 0.015, duration: 0.4 }}
          className={`flex-1 min-w-[2px] rounded-t-sm ${color} hover:opacity-80 transition-opacity cursor-pointer`}
          title={String(v)}
        />
      ))}
    </div>
  );
}

function GrowthBadge({ value }: { value: number }) {
  if (value === 0) return <span className="text-xs text-gray-400">—</span>;
  const positive = value > 0;
  return (
    <span className={`flex items-center gap-0.5 text-xs font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
      {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {Math.abs(value)}%
    </span>
  );
}

function KpiCard({ label, value, sub, growth, icon: Icon, color, index }: {
  label: string; value: number | string; sub?: string;
  growth?: number; icon: React.ElementType; color: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
      className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-card dark:border-navy-700/50 dark:bg-navy-900"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-navy-400">{label}</p>
          <p className="mt-1.5 text-3xl font-bold text-navy-900 dark:text-white">{value}</p>
          <div className="mt-1 flex items-center gap-2">
            {sub && <p className="text-xs text-gray-500 dark:text-navy-400">{sub}</p>}
            {growth !== undefined && <GrowthBadge value={growth} />}
          </div>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [realtime, setRealtime] = useState<RealtimeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/analytics', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/analytics/realtime', { credentials: 'include' }).then(r => r.json()),
    ]).then(([a, rt]) => {
      if (a.success) setAnalytics(a.data);
      if (rt.success) setRealtime(rt.data);
    }).finally(() => setLoading(false));
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

  const o = analytics?.overview;
  const charts = analytics?.charts;

  return (
    <div className="space-y-6">
      {/* Realtime banner */}
      {realtime && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-5 py-3"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
            </span>
            <span className="text-sm font-semibold text-cyan-400">En temps réel</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-navy-300">
            <span><strong className="text-navy-900 dark:text-white">{realtime.activeNow}</strong> actif(s) maintenant</span>
            <span><strong className="text-navy-900 dark:text-white">{realtime.lastHourVisits}</strong> visites dernière heure</span>
            <span><strong className="text-navy-900 dark:text-white">{realtime.todayAppointments}</strong> RDV aujourd&apos;hui</span>
            <span><strong className="text-navy-900 dark:text-white">{realtime.todayMessages}</strong> messages aujourd&apos;hui</span>
          </div>
        </motion.div>
      )}

      {/* KPIs */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-navy-400">Aperçu général</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard index={0} label="Visiteurs total" value={(o?.totalVisitorsAllTime ?? 0).toLocaleString()} icon={Globe} color="bg-cyan-500" />
          <KpiCard index={1} label="Visites ce mois" value={(o?.monthlyVisits ?? 0).toLocaleString()} growth={o?.visitGrowth} icon={TrendingUp} color="bg-violet-500" />
          <KpiCard index={2} label="RDV ce mois" value={o?.appointmentsThisMonth ?? 0} growth={o?.bookingGrowth} icon={CalendarDays} color="bg-green-500" />
          <KpiCard index={3} label="Taux conversion" value={`${o?.conversionRate ?? 0}%`} sub="visites → RDV" icon={BarChart2} color="bg-gold-500" />
          <KpiCard index={4} label="Total RDV" value={o?.totalAppointments ?? 0} icon={CalendarDays} color="bg-cyan-600" />
          <KpiCard index={5} label="RDV en attente" value={o?.pendingAppointments ?? 0} icon={Activity} color="bg-amber-500" />
          <KpiCard index={6} label="Total messages" value={o?.totalMessages ?? 0} sub={`${o?.unreadMessages ?? 0} non lus`} icon={MessageSquare} color="bg-orange-500" />
          <KpiCard index={7} label="Visites aujourd'hui" value={o?.todayVisits ?? 0} icon={Users} color="bg-pink-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Daily visits chart */}
        {charts?.dailyVisits && charts.dailyVisits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-card dark:border-navy-700/50 dark:bg-navy-900"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-navy-900 dark:text-white">Visites quotidiennes</h3>
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-400">30 jours</span>
            </div>
            <MiniBarChart data={charts.dailyVisits.map(d => d.totalVisits)} color="bg-cyan-500/70" />
            <div className="mt-2 flex justify-between text-[10px] text-gray-400 dark:text-navy-500">
              <span>{charts.dailyVisits[0]?.date ? new Date(charts.dailyVisits[0].date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : ''}</span>
              <span>Aujourd&apos;hui</span>
            </div>
          </motion.div>
        )}

        {/* Hourly activity */}
        {realtime?.hourlyActivity && realtime.hourlyActivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-card dark:border-navy-700/50 dark:bg-navy-900"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-navy-900 dark:text-white">Activité par heure (24h)</h3>
              <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-400">Aujourd&apos;hui</span>
            </div>
            <MiniBarChart
              data={Array.from({ length: 24 }, (_, h) => realtime.hourlyActivity.find(a => a.hour === h)?.count ?? 0)}
              color="bg-violet-500/60"
            />
            <div className="mt-2 flex justify-between text-[10px] text-gray-400 dark:text-navy-500">
              <span>00:00</span><span>12:00</span><span>23:59</span>
            </div>
          </motion.div>
        )}

        {/* Service distribution */}
        {charts?.serviceDistribution && charts.serviceDistribution.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-card dark:border-navy-700/50 dark:bg-navy-900"
          >
            <h3 className="mb-4 font-semibold text-navy-900 dark:text-white">Services les plus demandés</h3>
            <div className="space-y-3">
              {charts.serviceDistribution.map((s, i) => {
                const max = charts.serviceDistribution[0].count;
                const pct = max > 0 ? Math.round((s.count / max) * 100) : 0;
                const colors = ['bg-cyan-500', 'bg-violet-500', 'bg-green-500', 'bg-amber-500', 'bg-pink-500', 'bg-orange-500'];
                return (
                  <div key={s.service} className="flex items-center gap-3">
                    <span className="w-4 text-center text-xs font-bold text-gray-300 dark:text-navy-600">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="truncate text-navy-900 dark:text-white">{s.service}</span>
                        <span className="ml-2 flex-shrink-0 text-gray-500 dark:text-navy-400">{s.count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-navy-700">
                        <motion.div
                          className={`h-full rounded-full ${colors[i % colors.length]}`}
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.4 + i * 0.06, duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Devices */}
        {charts?.devices && charts.devices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-card dark:border-navy-700/50 dark:bg-navy-900"
          >
            <h3 className="mb-4 font-semibold text-navy-900 dark:text-white">Appareils utilisés</h3>
            <div className="space-y-3">
              {charts.devices.map(d => {
                const total = charts.devices.reduce((s, x) => s + x.count, 0);
                const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
                return (
                  <div key={d.device} className="flex items-center gap-3">
                    {d.device === 'mobile' ? <Smartphone className="h-4 w-4 text-cyan-400 flex-shrink-0" /> : <Monitor className="h-4 w-4 text-violet-400 flex-shrink-0" />}
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-navy-900 dark:text-white">{d.device}</span>
                        <span className="text-gray-500 dark:text-navy-400">{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-navy-700">
                        <motion.div
                          className={`h-full rounded-full ${d.device === 'mobile' ? 'bg-cyan-500' : d.device === 'desktop' ? 'bg-violet-500' : 'bg-green-500'}`}
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.5, duration: 0.6 }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-navy-900 dark:text-white">{d.count}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {!analytics && !realtime && (
        <div className="py-16 text-center">
          <BarChart2 className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-navy-600" />
          <p className="text-gray-400">Aucune donnée disponible</p>
          <p className="mt-1 text-xs text-gray-300 dark:text-navy-500">Les données apparaîtront après les premières visites</p>
        </div>
      )}
    </div>
  );
}
