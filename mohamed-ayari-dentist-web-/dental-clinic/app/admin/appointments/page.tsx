'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ChevronLeft, ChevronRight,
  Check, X, Trash2, Eye, Calendar, CalendarDays, Phone, Mail, RefreshCw,
} from 'lucide-react';

type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

interface Appointment {
  id: string; patientName: string; email: string; phone: string;
  selectedService: string; appointmentDate: string; appointmentTime: string;
  message?: string; status: AppointmentStatus; createdAt: string;
}

interface Meta { total: number; page: number; limit: number; totalPages: number }

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; bg: string; text: string; dot: string }> = {
  PENDING:   { label: 'En attente', bg: 'bg-amber-500/10',  text: 'text-amber-400',  dot: 'bg-amber-400' },
  CONFIRMED: { label: 'Confirmé',   bg: 'bg-green-500/10',  text: 'text-green-400',  dot: 'bg-green-400' },
  CANCELLED: { label: 'Annulé',     bg: 'bg-red-500/10',    text: 'text-red-400',    dot: 'bg-red-400' },
  COMPLETED: { label: 'Terminé',    bg: 'bg-blue-500/10',   text: 'text-blue-400',   dot: 'bg-blue-400' },
};

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function DetailModal({ apt, onClose }: { apt: Appointment; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700 p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-navy-900 dark:text-white">{apt.patientName}</h3>
            <StatusBadge status={apt.status} />
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <dl className="space-y-3 text-sm">
          {[
            { label: 'Email', value: apt.email, icon: <Mail className="h-4 w-4" /> },
            { label: 'Téléphone', value: apt.phone, icon: <Phone className="h-4 w-4" /> },
            { label: 'Service', value: apt.selectedService },
            { label: 'Date', value: new Date(apt.appointmentDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), icon: <Calendar className="h-4 w-4" /> },
            { label: 'Heure', value: apt.appointmentTime },
            { label: 'Demande', value: new Date(apt.createdAt).toLocaleDateString('fr-FR') },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3">
              {item.icon && <span className="mt-0.5 text-gray-400 dark:text-navy-400">{item.icon}</span>}
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-navy-400">{item.label}</dt>
                <dd className="text-navy-900 dark:text-white">{item.value}</dd>
              </div>
            </div>
          ))}
          {apt.message && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-navy-400">Message</dt>
              <dd className="mt-1 rounded-lg bg-gray-50 dark:bg-navy-800 p-3 text-navy-700 dark:text-navy-200">{apt.message}</dd>
            </div>
          )}
        </dl>
      </motion.div>
    </motion.div>
  );
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Appointment | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    const res = await fetch(`/api/appointments?${params}`, { credentials: 'include' });
    const data = await res.json();
    if (data.success) {
      setAppointments(data.data);
      setMeta(data.meta as Meta);
    }
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const updateStatus = async (id: string, status: AppointmentStatus) => {
    await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status }),
    });
    fetchAppointments();
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm('Supprimer ce rendez-vous ?')) return;
    await fetch(`/api/appointments/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchAppointments();
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-navy-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Nom, email, téléphone..."
              className="w-full rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 py-2.5 pl-9 pr-4 text-sm text-navy-900 dark:text-white placeholder-gray-400 dark:placeholder-navy-500 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>
          <button onClick={fetchAppointments} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-gray-400 hover:text-cyan-500 transition-colors">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Status tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 p-1">
          {(['', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === s
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-gray-500 dark:text-navy-400 hover:text-cyan-500'
              }`}
            >
              {s === '' ? 'Tous' : STATUS_CONFIG[s as AppointmentStatus].label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-navy-400">
        <Filter className="h-4 w-4" />
        <span>{meta.total} rendez-vous</span>
        {statusFilter && (
          <button onClick={() => setStatusFilter('')} className="flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-500">
            <X className="h-3 w-3" /> Effacer filtre
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200/60 bg-white dark:border-navy-700/50 dark:bg-navy-900 overflow-hidden shadow-card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-cyan-500" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-gray-400 dark:text-navy-400">
            <CalendarDays className="mx-auto mb-3 h-10 w-10 opacity-40" />
            <p>Aucun rendez-vous trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 dark:border-navy-700 bg-gray-50/50 dark:bg-navy-800/30">
                <tr>
                  {['Patient', 'Service', 'Date / Heure', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-navy-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-navy-800">
                {appointments.map(apt => (
                  <motion.tr
                    key={apt.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="group hover:bg-gray-50/70 dark:hover:bg-navy-800/40"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-navy-900 dark:text-white">{apt.patientName}</p>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400 dark:text-navy-400">
                        <span>{apt.email}</span>
                        <span className="hidden sm:inline">·</span>
                        <span className="hidden sm:inline">{apt.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[160px]">
                      <span className="truncate block text-gray-700 dark:text-navy-200">{apt.selectedService}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-medium text-navy-900 dark:text-white">
                        {new Date(apt.appointmentDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-navy-400">{apt.appointmentTime}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={apt.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(apt)} className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-700 hover:text-cyan-500 transition-colors" title="Détails">
                          <Eye className="h-4 w-4" />
                        </button>
                        {apt.status === 'PENDING' && (
                          <button onClick={() => updateStatus(apt.id, 'CONFIRMED')} className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-500 transition-colors" title="Confirmer">
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                          <button onClick={() => updateStatus(apt.id, 'CANCELLED')} className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-500 transition-colors" title="Annuler">
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => deleteAppointment(apt.id)} className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors" title="Supprimer">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-navy-700 px-4 py-3">
            <p className="text-xs text-gray-500 dark:text-navy-400">
              Page {meta.page} sur {meta.totalPages} · {meta.total} résultats
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-navy-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-navy-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && <DetailModal apt={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
