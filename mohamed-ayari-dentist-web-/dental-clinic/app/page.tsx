import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Phone, Clock, Star } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const services = [
  {
    title: 'Orthodontie',
    description: 'Correction de l\'alignement dentaire avec appareils fixes ou amovibles pour enfants et adultes.',
    href: '/services/orthodontie',
  },
  {
    title: 'Blanchiment dentaire',
    description: 'Éclaircissement professionnel en séance unique pour un résultat visible et durable.',
    href: '/services/blanchiment-dentaire',
  },
  {
    title: 'Chirurgie dentaire',
    description: 'Extractions, chirurgie parodontale et petites interventions bucco-dentaires.',
    href: '/services/chirurgie-dentaire',
  },
  {
    title: 'Prothèses dentaires',
    description: 'Couronnes, bridges et prothèses amovibles réalisés sur mesure selon vos besoins.',
    href: '/services/protheses-dentaires',
  },
  {
    title: 'Prévention & Nettoyage',
    description: 'Détartrage, polissage et bilan annuel pour maintenir une bonne santé bucco-dentaire.',
    href: '/services/prevention-nettoyage',
  },
];

export default async function HomePage() {
  const testimonials = await prisma.testimonial
    .findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    })
    .catch(() => []);

  const galleryImages = await prisma.galleryImage
    .findMany({
      orderBy: { uploadedAt: 'desc' },
      take: 3,
    })
    .catch(() => []);

  return (
    <>
      <Header />
      <main className="pt-[68px]">

        {/* ── Hero ── */}
        <section className="bg-white py-14 lg:py-24">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-center">
              <div>
                <p className="text-[11px] font-sans font-medium uppercase tracking-widest text-navy-600 mb-5">
                  Cabinet dentaire · Hammam Lif, Ben Arous
                </p>
                <h1 className="font-display text-[2.6rem] lg:text-[3.4rem] font-semibold text-navy-800 leading-[1.1] mb-2">
                  Dr Mohamed Ben Othman Ayari
                </h1>
                <p className="font-display text-[1.4rem] lg:text-[1.7rem] font-normal text-warm-500 mb-7 leading-snug">
                  Chirurgien-dentiste spécialisé en orthodontie
                </p>
                <p className="text-warm-700 text-[15px] leading-[1.75] mb-9 max-w-lg">
                  Des soins dentaires complets et un suivi personnalisé dans un cabinet
                  à taille humaine à Hammam Lif. Consultations pour toute la famille,
                  enfants et adultes.
                </p>
                <div className="flex flex-wrap gap-3 mb-12">
                  <Link
                    href="/book-appointment"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-600 text-white text-sm font-medium rounded hover:bg-navy-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2"
                  >
                    Prendre rendez-vous
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-warm-300 text-warm-800 text-sm font-medium rounded hover:border-navy-400 hover:text-navy-700 transition-colors"
                  >
                    Découvrir nos soins
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
                <div className="flex gap-10 pt-8 border-t border-warm-200">
                  {[
                    { value: '15+', label: "Années d'expérience" },
                    { value: '2 000+', label: 'Patients traités' },
                    { value: '5', label: 'Spécialités' },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="font-display text-[2rem] font-semibold text-navy-700 leading-none">{s.value}</p>
                      <p className="text-[11.5px] text-warm-600 mt-1.5 font-sans">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative order-first lg:order-last">
                <div className="aspect-[3/4] relative rounded overflow-hidden bg-warm-200">
                  <Image
                    src="/doctor-photo.png"
                    alt="Dr Mohamed Ben Othman Ayari, chirurgien-dentiste à Hammam Lif"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 420px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Services ── */}
        <section className="bg-warm-100 py-14 lg:py-24">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-3">Nos prestations</p>
              <h2 className="font-display text-3xl lg:text-4xl font-semibold text-navy-800 mb-3">
                Soins dentaires complets
              </h2>
              <p className="text-warm-600 text-[14.5px] leading-relaxed max-w-lg">
                Du bilan annuel aux traitements spécialisés, notre cabinet prend en
                charge l'ensemble de vos besoins bucco-dentaires.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {services.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="group bg-white border border-warm-200 rounded p-6 hover:border-navy-200 hover:shadow-card-md transition-all duration-200 flex flex-col"
                >
                  <h3 className="font-display text-[1.2rem] font-semibold text-navy-800 mb-2.5">
                    {service.title}
                  </h3>
                  <p className="text-warm-600 text-sm leading-relaxed flex-1 mb-5">
                    {service.description}
                  </p>
                  <span className="text-[13px] font-medium text-navy-600 group-hover:text-navy-800 flex items-center gap-1.5 transition-colors">
                    En savoir plus
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </Link>
              ))}

              {/* Book CTA card */}
              <div className="bg-navy-600 rounded p-6 flex flex-col justify-between">
                <div>
                  <p className="text-white/60 text-[11px] uppercase tracking-widest font-medium mb-3">Consultation</p>
                  <h3 className="font-display text-[1.3rem] font-semibold text-white mb-3">
                    Prendre un rendez-vous
                  </h3>
                  <p className="text-white/65 text-sm leading-relaxed">
                    Disponible du lundi au vendredi, de 8h à 19h, et le samedi matin.
                  </p>
                </div>
                <Link
                  href="/book-appointment"
                  className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-white text-navy-700 text-sm font-medium rounded hover:bg-warm-100 transition-colors self-start"
                >
                  Réserver
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section className="bg-white py-14 lg:py-24">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="relative">
                <div className="aspect-[4/5] relative rounded overflow-hidden bg-warm-200">
                  <Image
                    src="/clinic-photo.png"
                    alt="Cabinet dentaire Dr Ayari, Hammam Lif"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-4">À propos</p>
                <h2 className="font-display text-3xl lg:text-4xl font-semibold text-navy-800 mb-6 leading-[1.2]">
                  Un cabinet à taille humaine, au service de votre santé
                </h2>
                <div className="space-y-4 text-warm-700 text-[14.5px] leading-[1.75]">
                  <p>
                    Dr Mohamed Ben Othman Ayari exerce la chirurgie dentaire à Hammam Lif
                    depuis plus de quinze ans. Diplômé de la Faculté de Médecine Dentaire
                    de Monastir, il s'est spécialisé en orthodontie et assure régulièrement
                    des formations continues.
                  </p>
                  <p>
                    Le cabinet accueille patients de tous âges dans un environnement calme
                    et professionnel. Chaque patient bénéficie d'un suivi personnalisé et
                    d'explications claires sur les traitements proposés.
                  </p>
                </div>
                <div className="mt-8">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-[13.5px] font-medium text-navy-600 hover:text-navy-800 transition-colors"
                  >
                    En savoir plus sur le cabinet
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Gallery teaser ── */}
        {galleryImages.length > 0 && (
          <section className="bg-warm-100 py-14 lg:py-24">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-2.5">Galerie</p>
                  <h2 className="font-display text-3xl font-semibold text-navy-800">Notre cabinet en images</h2>
                </div>
                <Link
                  href="/gallery"
                  className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors"
                >
                  Voir tout <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {galleryImages.map((img, index) => (
                  <div
                    key={img.id}
                    className={`relative rounded overflow-hidden bg-warm-200 ${index === 0 ? 'sm:row-span-2 aspect-[3/4] sm:aspect-auto' : 'aspect-[4/3]'}`}
                  >
                    <Image
                      src={img.imageUrl}
                      alt={img.altText || img.title || 'Cabinet dentaire Dr Ayari'}
                      fill
                      className="object-cover hover:scale-[1.03] transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-5 sm:hidden">
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-600"
                >
                  Voir toute la galerie <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── Testimonials ── */}
        {testimonials.length > 0 && (
          <section className="bg-white py-14 lg:py-24">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-2.5">Témoignages</p>
                  <h2 className="font-display text-3xl font-semibold text-navy-800">Ce que disent nos patients</h2>
                </div>
                <Link
                  href="/reviews"
                  className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors"
                >
                  Tous les avis <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonials.map((t) => (
                  <div key={t.id} className="border border-warm-200 rounded p-6 bg-white">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-warm-300'}`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="text-warm-700 text-sm leading-relaxed mb-5 line-clamp-4">
                      &ldquo;{t.review}&rdquo;
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-[13px] text-navy-700">{t.patientName}</p>
                      {t.service && (
                        <span className="text-[11px] text-warm-500 bg-warm-100 px-2 py-1 rounded">
                          {t.service}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Contact strip ── */}
        <section className="bg-navy-600 py-12">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-3 gap-8 text-white">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 bg-white/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium text-[13.5px] mb-1">Adresse</p>
                  <p className="text-white/60 text-sm">Hammam Lif, Ben Arous</p>
                  <p className="text-white/60 text-sm">Tunisie</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 bg-white/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium text-[13.5px] mb-1">Téléphone</p>
                  <a
                    href="tel:+21698302743"
                    className="text-white/60 hover:text-white text-sm transition-colors block"
                  >
                    +216 98 302 743
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 bg-white/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium text-[13.5px] mb-1">Horaires</p>
                  <p className="text-white/60 text-sm">Lun – Ven : 8h00 – 19h00</p>
                  <p className="text-white/60 text-sm">Sam : 8h00 – 13h00</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
