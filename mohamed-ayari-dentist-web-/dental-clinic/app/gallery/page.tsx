import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GalleryGrid from '@/components/public/GalleryGrid';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Galerie',
  description:
    'Photos du cabinet dentaire Dr Ayari à Hammam Lif — salle de soins, équipements et espaces d\'accueil.',
};

export default async function GalleryPage() {
  const images = await prisma.galleryImage
    .findMany({
      orderBy: { uploadedAt: 'desc' },
      select: {
        id: true,
        imageUrl: true,
        title: true,
        altText: true,
        category: true,
        uploadedAt: true,
      },
    })
    .catch(() => []);

  return (
    <>
      <Header />
      <main className="pt-[68px]">

        {/* Page header */}
        <div className="bg-warm-100 border-b border-warm-200 py-10 lg:py-16">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-[12px] text-warm-500 mb-5" aria-label="Fil d'Ariane">
              <Link href="/" className="hover:text-navy-600 transition-colors">Accueil</Link>
              <span>/</span>
              <span className="text-warm-700">Galerie</span>
            </nav>
            <p className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-3">Nos locaux</p>
            <h1 className="font-display text-[2.5rem] lg:text-[3rem] font-semibold text-navy-800 leading-[1.15]">
              Galerie photos
            </h1>
            <p className="text-warm-600 mt-3 text-[15px] max-w-xl leading-relaxed">
              Découvrez les espaces du cabinet dentaire Dr Ayari — salle d'accueil,
              salles de soins et équipements.
            </p>
          </div>
        </div>

        {/* Gallery */}
        <section className="py-14 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            {images.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-warm-500 text-[15px]">La galerie sera disponible prochainement.</p>
                <Link
                  href="/"
                  className="mt-6 inline-flex items-center text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors"
                >
                  ← Retour à l'accueil
                </Link>
              </div>
            ) : (
              <GalleryGrid images={images} />
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
