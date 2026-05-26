'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ZoomIn, X, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

const easing = [0.22, 1, 0.36, 1];

interface GalleryItem {
  id: number | string;
  type: 'single' | 'before-after';
  src?: string;
  before?: string;
  after?: string;
  label: string;
  desc: string;
  span: string;
}

const FALLBACK_ITEMS: GalleryItem[] = [
  {
    id: 1, type: 'before-after',
    before: 'https://placehold.co/600x400/1A2F45/94A3B8?text=Avant+%E2%80%94+Orthodontie',
    after: 'https://placehold.co/600x400/071929/67E8F9?text=Apr%C3%A8s+%E2%80%94+Orthodontie',
    label: 'Orthodontie', desc: 'Correction d\'un chevauchement dentaire', span: 'col-span-2',
  },
  {
    id: 2, type: 'single',
    src: 'https://placehold.co/400x400/0B2235/22D3EE?text=Blanchiment',
    label: 'Blanchiment', desc: 'Résultat après 1 séance', span: '',
  },
  {
    id: 3, type: 'single',
    src: 'https://placehold.co/400x400/071929/C9A84C?text=Proth%C3%A8se',
    label: 'Prothèse', desc: 'Prothèse fixe sur implant', span: '',
  },
  {
    id: 4, type: 'single',
    src: 'https://placehold.co/400x600/0B2235/06B6D4?text=Restauration',
    label: 'Restauration', desc: 'Composite esthétique naturel', span: 'row-span-2',
  },
  {
    id: 5, type: 'before-after',
    before: 'https://placehold.co/600x300/1A2F45/94A3B8?text=Avant+%E2%80%94+Blanchiment',
    after: 'https://placehold.co/600x300/071929/67E8F9?text=Apr%C3%A8s+%E2%80%94+Blanchiment',
    label: 'Blanchiment', desc: 'Éclaircissement de 4 teintes', span: 'col-span-2',
  },
  {
    id: 6, type: 'single',
    src: 'https://placehold.co/400x300/0B2235/22D3EE?text=Cabinet',
    label: 'Notre Cabinet', desc: 'Environnement moderne et rassurant', span: '',
  },
];

// Repeating span pattern for DB items
const SPAN_PATTERN = ['col-span-2', '', '', 'row-span-2', 'col-span-2', ''];

function GalleryItemCard({ item, onOpen }: { item: GalleryItem; onOpen: (id: GalleryItem['id']) => void }) {
  const [showAfter, setShowAfter] = useState(false);

  if (item.type === 'before-after') {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`relative rounded-3xl overflow-hidden cursor-pointer group ${item.span}`}
        style={{ boxShadow: '0 8px 32px rgba(7,25,41,0.15)' }}
        onClick={() => onOpen(item.id)}
      >
        <div className="relative aspect-video">
          <img
            src={showAfter ? item.after! : item.before!}
            alt={item.label}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(0deg, rgba(4,17,31,0.7) 0%, transparent 50%)' }}
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={e => { e.stopPropagation(); setShowAfter(false); }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${!showAfter ? 'bg-white text-navy-900' : 'bg-white/20 text-white'}`}
            >
              Avant
            </button>
            <button
              onClick={e => { e.stopPropagation(); setShowAfter(true); }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${showAfter ? 'bg-cyan-400 text-navy-900' : 'bg-white/20 text-white'}`}
            >
              Après
            </button>
          </div>
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white font-semibold text-sm">{item.label}</p>
            <p className="text-white/70 text-xs">{item.desc}</p>
          </div>
          <div className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ZoomIn className="w-4 h-4 text-white" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative rounded-3xl overflow-hidden cursor-pointer group ${item.span}`}
      style={{ boxShadow: '0 8px 32px rgba(7,25,41,0.15)' }}
      onClick={() => onOpen(item.id)}
    >
      <div className="relative w-full h-full min-h-[200px]">
        <img
          src={item.src}
          alt={item.label}
          className="w-full h-full object-cover"
          style={{ minHeight: '200px' }}
          onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/400x400/071929/06B6D4?text=${encodeURIComponent(item.label)}`; }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(0deg, rgba(4,17,31,0.6) 0%, rgba(4,17,31,0.1) 50%, transparent 100%)' }}
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 mix-blend-multiply"
          style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' }}
        />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white font-semibold text-sm">{item.label}</p>
          <p className="text-white/60 text-xs mt-0.5">{item.desc}</p>
        </div>
        <div className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <ZoomIn className="w-4 h-4 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true });
  const [lightboxId, setLightboxId] = useState<GalleryItem['id'] | null>(null);
  const [items, setItems] = useState<GalleryItem[]>(FALLBACK_ITEMS);

  useEffect(() => {
    fetch('/api/admin/gallery?limit=20')
      .then(r => r.json())
      .then(data => {
        if (!data.success) return;
        const raw: Array<{ id: string; imageUrl: string; category: string; title?: string | null; altText?: string | null }> =
          Array.isArray(data.data) ? data.data : [];
        if (raw.length === 0) return;
        const mapped: GalleryItem[] = raw.map((img, i) => ({
          id: img.id,
          type: 'single',
          src: img.imageUrl,
          label: img.title ?? img.category,
          desc: img.altText ?? img.category,
          span: SPAN_PATTERN[i % SPAN_PATTERN.length],
        }));
        setItems(mapped);
      })
      .catch(() => {/* keep fallback */});
  }, []);

  const lightboxItem = items.find(g => g.id === lightboxId);

  const goNext = () => {
    const idx = items.findIndex(g => g.id === lightboxId);
    setLightboxId(items[(idx + 1) % items.length].id);
  };
  const goPrev = () => {
    const idx = items.findIndex(g => g.id === lightboxId);
    setLightboxId(items[(idx - 1 + items.length) % items.length].id);
  };

  return (
    <section
      className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F0F6FB 0%, #E8F2F9 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: easing }}
          className="text-center mb-16"
        >
          <div className="section-tag mx-auto mb-4">
            <LayoutGrid className="w-3 h-3" />
            Galerie & Résultats
          </div>
          <h2
            className="text-4xl lg:text-5xl font-display font-bold text-navy-900 mb-5"
            style={{ letterSpacing: '-0.02em' }}
          >
            Des transformations
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' }}
            >
              qui parlent d&apos;elles-mêmes
            </span>
          </h2>
          <p className="text-navy-500 text-lg max-w-xl mx-auto">
            Avant / après et aperçus de nos réalisations au cabinet.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: easing }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]"
        >
          {items.map(item => (
            <GalleryItemCard key={item.id} item={item} onOpen={setLightboxId} />
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxId !== null && lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            style={{ background: 'rgba(4,17,31,0.95)', backdropFilter: 'blur(20px)' }}
            onClick={() => setLightboxId(null)}
          >
            <button
              onClick={() => setLightboxId(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); goPrev(); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <motion.div
              key={String(lightboxId)}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: easing }}
              className="max-w-3xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={lightboxItem.type === 'before-after' ? lightboxItem.after : lightboxItem.src}
                alt={lightboxItem.label}
                className="w-full rounded-3xl"
                onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/800x600/071929/06B6D4?text=${encodeURIComponent(lightboxItem.label)}`; }}
              />
              <div className="text-center mt-4">
                <p className="text-white font-semibold">{lightboxItem.label}</p>
                <p className="text-white/50 text-sm">{lightboxItem.desc}</p>
              </div>
            </motion.div>
            <button
              onClick={e => { e.stopPropagation(); goNext(); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
