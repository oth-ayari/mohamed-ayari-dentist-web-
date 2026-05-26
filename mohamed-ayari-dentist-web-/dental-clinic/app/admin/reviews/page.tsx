'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, X, Trash2, RefreshCw, Search, MessageSquare } from 'lucide-react';

interface Testimonial {
  id: string; patientName: string; rating: number;
  review: string; service?: string; approved: boolean; createdAt: string;
}

interface Meta { total: number; page: number; limit: number; totalPages: number }

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-gold-500 text-gold-500' : 'text-gray-300 dark:text-navy-600'}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '12' });
    if (filter === 'pending') params.set('approved', 'false');
    if (filter === 'approved') params.set('approved', 'true');
    const res = await fetch(`/api/admin/testimonials?${params}`, { credentials: 'include' });
    const data = await res.json();
    if (data.success) {
      setReviews(data.data?.testimonials ?? data.data ?? []);
      if (data.meta) setMeta(data.meta as Meta);
    }
    setLoading(false);
  }, [page, filter]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);
  useEffect(() => { setPage(1); }, [filter, search]);

  const approve = async (id: string, approved: boolean) => {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ approved }),
    });
    fetchReviews();
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Supprimer cet avis ?')) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchReviews();
  };

  const filtered = search
    ? reviews.filter(r =>
        r.patientName.toLowerCase().includes(search.toLowerCase()) ||
        r.review.toLowerCase().includes(search.toLowerCase()))
    : reviews;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-navy-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un avis..."
            className="w-full rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-navy-900 dark:text-white placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 p-1">
          {(['all', 'pending', 'approved'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                filter === f ? 'bg-cyan-500 text-white' : 'text-gray-500 dark:text-navy-400 hover:text-cyan-500'
              }`}
            >
              {f === 'all' ? 'Tous' : f === 'pending' ? 'En attente' : 'Approuvés'}
            </button>
          ))}
        </div>

        <button onClick={fetchReviews} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-gray-400 hover:text-cyan-500">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-gray-200 dark:bg-navy-800" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <MessageSquare className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-navy-600" />
          <p className="text-gray-400 dark:text-navy-400">Aucun avis trouvé</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className={`relative flex flex-col rounded-2xl border p-5 shadow-card transition-all ${
                  r.approved
                    ? 'border-green-200/50 bg-white dark:border-green-500/20 dark:bg-navy-900'
                    : 'border-amber-200/50 bg-amber-50/30 dark:border-amber-500/20 dark:bg-navy-900'
                }`}
              >
                {/* Status badge */}
                <div className={`absolute right-4 top-4 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  r.approved
                    ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                    : 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                }`}>
                  {r.approved ? 'Approuvé' : 'En attente'}
                </div>

                {/* Rating */}
                <StarRating rating={r.rating} />

                {/* Content */}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-navy-200 line-clamp-4">
                  &ldquo;{r.review}&rdquo;
                </p>

                {/* Patient info */}
                <div className="mt-4 border-t border-gray-100 dark:border-navy-700 pt-3">
                  <p className="font-medium text-navy-900 dark:text-white">{r.patientName}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-gray-400 dark:text-navy-400">
                      {r.service ?? 'Service non précisé'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-navy-400">
                      {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center gap-2">
                  {!r.approved && (
                    <button
                      onClick={() => approve(r.id, true)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-500 py-2 text-xs font-semibold text-white hover:bg-green-600 transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" /> Approuver
                    </button>
                  )}
                  {r.approved && (
                    <button
                      onClick={() => approve(r.id, false)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-amber-200 dark:border-amber-500/20 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" /> Retirer
                    </button>
                  )}
                  <button
                    onClick={() => deleteReview(r.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 dark:border-red-500/20 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-gray-200 dark:border-navy-700 px-4 py-2 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-navy-700">
            Précédent
          </button>
          <span className="text-sm text-gray-500 dark:text-navy-400">Page {page} / {meta.totalPages}</span>
          <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages} className="rounded-lg border border-gray-200 dark:border-navy-700 px-4 py-2 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-navy-700">
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
