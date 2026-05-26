'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RefreshCw, Mail, MailOpen, Trash2, ChevronLeft, X } from 'lucide-react';

interface ContactMessage {
  id: string; fullName: string; email: string; phone?: string;
  subject: string; message: string; isRead: boolean; createdAt: string;
}

interface Meta { total: number; page: number; totalPages: number }

function MessageDetail({ msg, onClose, onMarkRead }: {
  msg: ContactMessage; onClose: () => void; onMarkRead: (id: string) => void;
}) {
  useEffect(() => { if (!msg.isRead) onMarkRead(msg.id); }, [msg.id, msg.isRead, onMarkRead]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-navy-700 px-5 py-4">
          <div>
            <h3 className="font-semibold text-navy-900 dark:text-white">{msg.subject}</h3>
            <p className="text-xs text-gray-400 dark:text-navy-400 mt-0.5">
              De {msg.fullName} · {new Date(msg.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">
          <div className="mb-4 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-navy-400">
            <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{msg.email}</span>
            {msg.phone && <span>{msg.phone}</span>}
          </div>
          <div className="rounded-xl bg-gray-50 dark:bg-navy-800 p-4 text-sm leading-relaxed text-navy-700 dark:text-navy-200 whitespace-pre-wrap">
            {msg.message}
          </div>
          <a
            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600 transition-colors"
          >
            <Mail className="h-4 w-4" /> Répondre par email
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '15' });
    if (unreadOnly) params.set('unread', 'true');
    if (search) params.set('search', search);
    const res = await fetch(`/api/contact?${params}`, { credentials: 'include' });
    const data = await res.json();
    if (data.success) {
      setMessages(data.data?.messages ?? data.data ?? []);
      if (data.meta) setMeta(data.meta as Meta);
    }
    setLoading(false);
  }, [page, unreadOnly, search]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);
  useEffect(() => { setPage(1); }, [search, unreadOnly]);

  const markRead = useCallback(async (id: string) => {
    await fetch(`/api/contact?id=${id}`, { method: 'PATCH', credentials: 'include' });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
  }, []);

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-navy-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Nom, email, sujet..."
            className="w-full rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-navy-900 dark:text-white placeholder-gray-400"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 px-3 py-2.5">
          <input type="checkbox" checked={unreadOnly} onChange={e => setUnreadOnly(e.target.checked)} className="accent-cyan-500" />
          <span className="text-sm text-gray-600 dark:text-navy-300">Non lus seulement</span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-cyan-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{unreadCount}</span>
          )}
        </label>

        <button onClick={fetchMessages} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-gray-400 hover:text-cyan-500">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Stats */}
      <p className="text-sm text-gray-500 dark:text-navy-400">{meta.total} message{meta.total !== 1 ? 's' : ''} · {unreadCount} non lu{unreadCount !== 1 ? 's' : ''}</p>

      {/* Messages list */}
      <div className="rounded-2xl border border-gray-200/60 bg-white dark:border-navy-700/50 dark:bg-navy-900 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-cyan-500" /></div>
        ) : messages.length === 0 ? (
          <div className="py-16 text-center">
            <Mail className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-navy-600" />
            <p className="text-gray-400">Aucun message</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-navy-800">
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => setSelected(msg)}
                className={`flex cursor-pointer items-center gap-4 px-5 py-4 transition-all hover:bg-gray-50 dark:hover:bg-navy-800/50 ${
                  !msg.isRead ? 'bg-cyan-50/30 dark:bg-cyan-500/5' : ''
                }`}
              >
                {/* Avatar */}
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  !msg.isRead ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-100 dark:bg-navy-700 text-gray-500 dark:text-navy-400'
                }`}>
                  {msg.fullName.charAt(0)}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${!msg.isRead ? 'font-semibold text-navy-900 dark:text-white' : 'font-medium text-gray-700 dark:text-navy-200'}`}>
                      {msg.fullName}
                    </p>
                    {!msg.isRead && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-cyan-500" />}
                  </div>
                  <p className={`truncate text-sm ${!msg.isRead ? 'text-navy-700 dark:text-navy-300' : 'text-gray-500 dark:text-navy-400'}`}>
                    <span className="font-medium">{msg.subject}</span>
                    {' '}— {msg.message.substring(0, 80)}...
                  </p>
                </div>

                {/* Meta */}
                <div className="flex flex-shrink-0 flex-col items-end gap-1">
                  <p className="text-xs text-gray-400 dark:text-navy-400">
                    {new Date(msg.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                  </p>
                  {msg.isRead
                    ? <MailOpen className="h-4 w-4 text-gray-300 dark:text-navy-600" />
                    : <Mail className="h-4 w-4 text-cyan-400" />
                  }
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-navy-700 px-5 py-3">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center gap-1 text-sm text-gray-500 disabled:opacity-40 hover:text-cyan-500">
              <ChevronLeft className="h-4 w-4" /> Précédent
            </button>
            <span className="text-xs text-gray-400">{page} / {meta.totalPages}</span>
            <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages} className="flex items-center gap-1 text-sm text-gray-500 disabled:opacity-40 hover:text-cyan-500">
              Suivant <ChevronLeft className="h-4 w-4 rotate-180" />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && <MessageDetail msg={selected} onClose={() => { setSelected(null); fetchMessages(); }} onMarkRead={markRead} />}
      </AnimatePresence>
    </div>
  );
}
