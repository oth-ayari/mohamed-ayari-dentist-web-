'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: string;
  imageUrl: string;
  title: string | null;
  altText: string | null;
  category: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
}

const ALL_CATEGORY = 'Tous';

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);

  const categories = [ALL_CATEGORY, ...Array.from(new Set(images.map((img) => img.category)))];
  const filtered = activeCategory === ALL_CATEGORY
    ? images
    : images.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = '';
  };

  const goNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % filtered.length);
  };

  const goPrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + filtered.length) % filtered.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  };

  return (
    <>
      {/* Category filter */}
      {categories.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-[13px] font-medium rounded border transition-colors ${
                activeCategory === cat
                  ? 'bg-navy-600 text-white border-navy-600'
                  : 'bg-white text-warm-700 border-warm-300 hover:border-navy-400 hover:text-navy-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-warm-500">
          <p>Aucune image disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((img, index) => (
            <button
              key={img.id}
              onClick={() => openLightbox(index)}
              className="relative aspect-square rounded overflow-hidden bg-warm-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2"
              aria-label={img.altText || img.title || `Photo ${index + 1}`}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText || img.title || 'Cabinet dentaire Dr Ayari'}
                fill
                className="object-cover group-hover:scale-[1.04] transition-transform duration-400"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" aria-hidden="true" />
              {img.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-[12px] font-medium">{img.title}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse d'images"
          tabIndex={0}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous */}
          {filtered.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-4xl max-h-[85vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[selectedIndex].imageUrl}
              alt={filtered[selectedIndex].altText || filtered[selectedIndex].title || 'Cabinet dentaire'}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Next */}
          {filtered.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Caption & counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
            {filtered[selectedIndex].title && (
              <p className="text-white/80 text-sm mb-1">{filtered[selectedIndex].title}</p>
            )}
            <p className="text-white/50 text-[12px]">
              {selectedIndex + 1} / {filtered.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
