import type { Metadata } from 'next';
import Link from 'next/link';
import { Star } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ReviewSubmitForm from '@/components/public/ReviewSubmitForm';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Avis patients',
  description:
    'Témoignages de patients du Cabinet Dentaire Dr Ayari à Hammam Lif. Lisez les avis ou partagez votre expérience.',
};

export default async function ReviewsPage() {
  const testimonials = await prisma.testimonial
    .findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        patientName: true,
        rating: true,
        review: true,
        service: true,
        createdAt: true,
      },
    })
    .catch(() => []);

  const totalRatings = testimonials.length;
  const averageRating =
    totalRatings > 0
      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / totalRatings).toFixed(1)
      : null;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: testimonials.filter((t) => t.rating === star).length,
  }));

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
              <span className="text-warm-700">Avis patients</span>
            </nav>
            <p className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-3">Témoignages</p>
            <h1 className="font-display text-[2.5rem] lg:text-[3rem] font-semibold text-navy-800 leading-[1.15]">
              Avis de nos patients
            </h1>
            <p className="text-warm-600 mt-3 text-[15px] max-w-xl leading-relaxed">
              Les retours de nos patients nous permettent d'améliorer continuellement la qualité de nos soins.
            </p>
          </div>
        </div>

        {/* Stats + Reviews */}
        <section className="py-14 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">

            {/* Rating summary */}
            {averageRating && totalRatings > 0 && (
              <div className="mb-12 bg-warm-100 border border-warm-200 rounded p-6 max-w-sm">
                <div className="flex items-center gap-4 mb-4">
                  <p className="font-display text-[3rem] font-semibold text-navy-800 leading-none">{averageRating}</p>
                  <div>
                    <div className="flex gap-0.5 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.round(parseFloat(averageRating)) ? 'text-amber-400 fill-amber-400' : 'text-warm-300'}`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="text-[12px] text-warm-500">{totalRatings} avis vérifiés</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {ratingDistribution.map(({ star, count }) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-[12px] text-warm-600 w-4">{star}</span>
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" aria-hidden="true" />
                      <div className="flex-1 bg-warm-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full"
                          style={{ width: totalRatings > 0 ? `${(count / totalRatings) * 100}%` : '0%' }}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-[12px] text-warm-500 w-4 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews grid */}
            {testimonials.length === 0 ? (
              <div className="text-center py-16 bg-warm-100 rounded border border-warm-200">
                <p className="text-warm-500 text-[15px]">Aucun avis pour le moment.</p>
                <p className="text-warm-400 text-sm mt-2">Soyez le premier à partager votre expérience.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonials.map((t) => (
                  <article key={t.id} className="border border-warm-200 rounded p-6 bg-white">
                    <div className="flex gap-0.5 mb-4" aria-label={`Note : ${t.rating} étoiles sur 5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-warm-300'}`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <blockquote className="text-warm-700 text-sm leading-relaxed mb-5">
                      &ldquo;{t.review}&rdquo;
                    </blockquote>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-[13px] text-navy-700">{t.patientName}</p>
                      {t.service && (
                        <span className="text-[11px] text-warm-500 bg-warm-100 px-2 py-1 rounded">
                          {t.service}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-warm-400 mt-2">
                      {new Date(t.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Submit form */}
        <section className="py-14 lg:py-20 bg-warm-100 border-t border-warm-200">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-3">Votre témoignage</p>
              <h2 className="font-display text-2xl lg:text-3xl font-semibold text-navy-800 mb-3">
                Partagez votre expérience
              </h2>
              <p className="text-warm-600 text-[14.5px] leading-relaxed mb-8">
                Votre avis aide d'autres patients à prendre leur décision et nous permet d'améliorer nos services.
              </p>
              <ReviewSubmitForm />
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
