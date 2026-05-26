'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Plus, Trash2, RefreshCw, X, Link, Upload } from 'lucide-react';

interface GalleryImage {
  id: string; imageUrl: string; thumbnailUrl?: string;
  category: string; title?: string; altText?: string; uploadedAt: string;
}

const CATEGORIES = ['Avant/Après', 'Cabinet', 'Orthodontie', 'Blanchiment', 'Prothèses', 'Équipe', 'Autre'];

function AddModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [tab, setTab] = useState<'file' | 'url'>('file');
  const [form, setForm] = useState({ imageUrl: '', category: CATEGORIES[0], title: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let imageUrl = form.imageUrl;

    if (tab === 'file') {
      const file = fileRef.current?.files?.[0];
      if (!file) { setError('Choisissez une image'); setLoading(false); return; }
      const fd = new FormData();
      fd.append('file', file);
      fd.append('slot', 'gallery');
      const up = await fetch('/api/admin/upload', { method: 'POST', credentials: 'include', body: fd });
      const upData = await up.json();
      if (!upData.success) { setError(upData.error ?? 'Erreur upload'); setLoading(false); return; }
      imageUrl = upData.data.url;
    } else {
      if (!imageUrl) { setError('URL requise'); setLoading(false); return; }
    }

    const res = await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ imageUrl, category: form.category, title: form.title || null }),
    });
    const data = await res.json();
    if (data.success) { onAdded(); onClose(); }
    else { setError(data.error ?? 'Erreur lors de l\'ajout'); }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700 p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-navy-900 dark:text-white">Ajouter une image</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex gap-2 rounded-xl bg-gray-100 dark:bg-navy-800 p-1">
          <button
            type="button"
            onClick={() => setTab('file')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${tab === 'file' ? 'bg-white dark:bg-navy-700 text-cyan-600 shadow-sm' : 'text-gray-500 dark:text-navy-400'}`}
          >
            <Upload className="h-3.5 w-3.5" /> Depuis mon appareil
          </button>
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${tab === 'url' ? 'bg-white dark:bg-navy-700 text-cyan-600 shadow-sm' : 'text-gray-500 dark:text-navy-400'}`}
          >
            <Link className="h-3.5 w-3.5" /> URL externe
          </button>
        </div>

        {error && <p className="mb-3 text-sm text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}

        <form onSubmit={submit} className="space-y-4">
          {tab === 'file' ? (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-navy-400 mb-1.5">
                Image *
              </label>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-navy-700 p-6 text-center hover:border-cyan-400 transition-colors">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="aperçu" className="max-h-32 rounded-lg object-cover" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-300 dark:text-navy-600" />
                    <span className="text-sm text-gray-400 dark:text-navy-400">Cliquez pour choisir une image</span>
                    <span className="text-xs text-gray-300 dark:text-navy-600">JPG, PNG, WebP — max 5 Mo</span>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={onFileChange}
                />
              </label>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-navy-400 mb-1.5">URL de l&apos;image *</label>
              <input
                value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 text-navy-900 dark:text-white"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-navy-400 mb-1.5">Catégorie</label>
            <select
              value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 text-navy-900 dark:text-white"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-navy-400 mb-1.5">Titre (optionnel)</label>
            <input
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ex: Traitement orthodontique"
              className="w-full rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 text-navy-900 dark:text-white"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full rounded-xl bg-cyan-500 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600 disabled:opacity-70 transition-colors"
          >
            {loading ? 'Ajout en cours...' : 'Ajouter l\'image'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '12' });
    if (categoryFilter) params.set('category', categoryFilter);
    const res = await fetch(`/api/admin/gallery?${params}`, { credentials: 'include' });
    const data = await res.json();
    if (data.success) {
      setImages(data.data?.images ?? data.data ?? []);
      if (data.data?.categories) setCategories(data.data.categories);
      if (data.meta) setTotalPages(data.meta.totalPages ?? 1);
    }
    setLoading(false);
  }, [page, categoryFilter]);

  useEffect(() => { fetchImages(); }, [fetchImages]);
  useEffect(() => { setPage(1); }, [categoryFilter]);

  const deleteImage = async (id: string) => {
    if (!confirm('Supprimer cette image ?')) return;
    await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchImages();
  };

  const allCategories = Array.from(new Set([...categories, ...CATEGORIES]));

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCategoryFilter('')}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
              !categoryFilter ? 'bg-cyan-500 text-white' : 'border border-gray-200 dark:border-navy-700 text-gray-500 dark:text-navy-400 hover:text-cyan-500 bg-white dark:bg-navy-800'
            }`}
          >
            Toutes
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                categoryFilter === cat ? 'bg-cyan-500 text-white' : 'border border-gray-200 dark:border-navy-700 text-gray-500 dark:text-navy-400 hover:text-cyan-500 bg-white dark:bg-navy-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={fetchImages} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-gray-400 hover:text-cyan-500">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600 transition-colors"
          >
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-2xl bg-gray-200 dark:bg-navy-800" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="py-16 text-center">
          <ImageIcon className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-navy-600" />
          <p className="text-gray-400">Aucune image trouvée</p>
          <button onClick={() => setShowAdd(true)} className="mt-3 text-sm text-cyan-500 hover:text-cyan-400">
            Ajouter la première image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence>
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.04 }}
                className="group relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-navy-800 aspect-square shadow-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.thumbnailUrl ?? img.imageUrl}
                  alt={img.altText ?? img.title ?? img.category}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/400x400/071929/06B6D4?text=${encodeURIComponent(img.category)}`; }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => deleteImage(img.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div>
                    {img.title && <p className="text-xs font-semibold text-white truncate">{img.title}</p>}
                    <span className="mt-0.5 inline-block rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white/80">
                      {img.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-gray-200 dark:border-navy-700 px-4 py-2 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-navy-700">
            Précédent
          </button>
          <span className="text-sm text-gray-500 dark:text-navy-400">Page {page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg border border-gray-200 dark:border-navy-700 px-4 py-2 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-navy-700">
            Suivant
          </button>
        </div>
      )}

      <AnimatePresence>
        {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdded={fetchImages} />}
      </AnimatePresence>
    </div>
  );
}
