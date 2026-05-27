import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Nos soins',
  description:
    'Orthodontie, blanchiment dentaire, chirurgie buccale, prothèses dentaires et prévention — cabinet Dr Ayari, Hammam Lif.',
};

const services = [
  {
    slug: 'orthodontie',
    title: 'Orthodontie',
    subtitle: 'Alignement dentaire pour tous les âges',
    description:
      'Correction des malpositions dentaires et des anomalies d\'occlusion avec appareils fixes ou amovibles. Traitement pour enfants à partir de 7 ans, adolescents et adultes.',
    points: ['Appareils fixes métalliques ou céramiques', 'Gouttières transparentes', 'Contentions post-traitement', 'Suivi régulier et ajustements'],
    duration: '12 à 24 mois selon le cas',
    href: '/services/orthodontie',
  },
  {
    slug: 'blanchiment-dentaire',
    title: 'Blanchiment dentaire',
    subtitle: 'Éclaircissement professionnel',
    description:
      'Traitement d\'éclaircissement en cabinet avec des produits professionnels pour un résultat visible dès la première séance. Technique sûre et contrôlée par le praticien.',
    points: ['Séance en cabinet (~1h)', 'Gouttières à domicile en complément', 'Résultats visibles et durables', 'Bilan préalable obligatoire'],
    duration: '1 à 2 séances',
    href: '/services/blanchiment-dentaire',
  },
  {
    slug: 'chirurgie-dentaire',
    title: 'Chirurgie dentaire',
    subtitle: 'Extractions et petites interventions',
    description:
      'Extractions simples et complexes, chirurgie parodontale, traitement des kystes et petites interventions bucco-dentaires réalisées sous anesthésie locale.',
    points: ['Extractions dentaires', 'Dents de sagesse', 'Chirurgie parodontale', 'Soins post-opératoires'],
    duration: 'Selon l\'intervention',
    href: '/services/chirurgie-dentaire',
  },
  {
    slug: 'protheses-dentaires',
    title: 'Prothèses dentaires',
    subtitle: 'Restauration et remplacement dentaire',
    description:
      'Couronnes, bridges et prothèses amovibles pour restaurer les dents abîmées ou remplacer les dents manquantes. Réalisés sur mesure en collaboration avec un laboratoire.',
    points: ['Couronnes céramiques ou zircone', 'Bridges sur dents naturelles', 'Prothèses amovibles partielles', 'Prothèses complètes'],
    duration: '3 à 6 semaines par prothèse',
    href: '/services/protheses-dentaires',
  },
  {
    slug: 'prevention-nettoyage',
    title: 'Prévention & Nettoyage',
    subtitle: 'Hygiène bucco-dentaire et bilan annuel',
    description:
      'Détartrage ultrasonique, polissage et bilan dentaire annuel. Conseils personnalisés d\'hygiène bucco-dentaire pour adultes et enfants. Dépistage précoce des caries.',
    points: ['Détartrage ultrasonique', 'Polissage et fluoration', 'Bilan radiologique annuel', 'Conseils d\'hygiène personnalisés'],
    duration: '45 à 60 minutes',
    href: '/services/prevention-nettoyage',
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="pt-[68px]">

        {/* Page header */}
        <div className="bg-warm-100 border-b border-warm-200 py-10 lg:py-16">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-[12px] text-warm-500 mb-5" aria-label="Fil d'Ariane">
              <Link href="/" className="hover:text-navy-600 transition-colors">Accueil</Link>
              <span aria-hidden="true">/</span>
              <span className="text-warm-700">Services</span>
            </nav>
            <p className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-3">Prestations</p>
            <h1 className="font-display text-[2.5rem] lg:text-[3rem] font-semibold text-navy-800 leading-[1.15]">
              Nos soins dentaires
            </h1>
            <p className="text-warm-600 mt-3 text-[15px] max-w-xl leading-relaxed">
              Du bilan annuel aux traitements spécialisés, notre cabinet assure l'ensemble
              de vos besoins bucco-dentaires.
            </p>
          </div>
        </div>

        {/* Services list */}
        <section className="py-14 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {services.map((service, index) => (
                <article
                  key={service.slug}
                  className="border border-warm-200 rounded overflow-hidden hover:border-navy-200 hover:shadow-card-md transition-all duration-200"
                >
                  <div className="grid md:grid-cols-[1fr_auto] gap-0">
                    <div className="p-6 lg:p-8">
                      <div className="flex items-start gap-4 mb-4">
                        <span
                          className="w-8 h-8 bg-navy-50 rounded flex items-center justify-center flex-shrink-0 font-sans text-[13px] font-semibold text-navy-600 mt-0.5"
                          aria-hidden="true"
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h2 className="font-display text-[1.4rem] font-semibold text-navy-800 mb-1">
                            {service.title}
                          </h2>
                          <p className="text-[12px] text-warm-500 uppercase tracking-widest font-medium">
                            {service.subtitle}
                          </p>
                        </div>
                      </div>
                      <p className="text-warm-700 text-[14px] leading-relaxed mb-5 max-w-2xl">
                        {service.description}
                      </p>
                      <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-6">
                        {service.points.map((point) => (
                          <li key={point} className="flex items-center gap-2 text-sm text-warm-700">
                            <span className="w-1 h-1 bg-navy-500 rounded-full flex-shrink-0" aria-hidden="true" />
                            {point}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap items-center gap-4">
                        <Link
                          href={service.href}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-600 text-white text-sm font-medium rounded hover:bg-navy-700 transition-colors"
                        >
                          En savoir plus
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                        <span className="text-[12.5px] text-warm-500">
                          Durée estimée : {service.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-warm-100 py-14 lg:py-20">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="bg-navy-600 rounded p-8 lg:p-12 text-white">
              <div className="max-w-2xl">
                <h2 className="font-display text-2xl lg:text-3xl font-semibold mb-4">
                  Vous avez une question sur un traitement ?
                </h2>
                <p className="text-white/70 text-[14.5px] leading-relaxed mb-8">
                  Consultez notre FAQ ou prenez rendez-vous pour une première consultation.
                  Le Dr Ayari vous expliquera en détail les options qui correspondent à votre situation.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/book-appointment"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-navy-700 text-sm font-medium rounded hover:bg-warm-100 transition-colors"
                  >
                    Prendre rendez-vous
                  </Link>
                  <Link
                    href="/faq"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/30 text-white text-sm font-medium rounded hover:bg-white/10 transition-colors"
                  >
                    Consulter la FAQ
                  </Link>
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
