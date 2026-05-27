import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Orthodontie',
  description:
    'Traitement orthodontique à Hammam Lif : appareils fixes, gouttières transparentes pour enfants et adultes. Dr Ayari Mohamed, spécialiste en orthodontie.',
};

const steps = [
  { step: '01', title: 'Consultation initiale', desc: 'Examen clinique complet, analyse des radiographies panoramiques et céphalométriques. Discussion des objectifs et des options de traitement.' },
  { step: '02', title: 'Plan de traitement', desc: 'Élaboration d\'un plan personnalisé avec estimation de la durée et du coût. Devis détaillé remis par écrit.' },
  { step: '03', title: 'Pose de l\'appareil', desc: 'Mise en place des brackets ou livraison des premières gouttières. Explications sur l\'hygiène et l\'entretien de l\'appareil.' },
  { step: '04', title: 'Suivi mensuel', desc: 'Rendez-vous d\'ajustement toutes les 4 à 6 semaines pour contrôler la progression du traitement.' },
  { step: '05', title: 'Contention', desc: 'Après la dépose de l\'appareil, port d\'une contention (fil collé ou gouttière de nuit) pour stabiliser les résultats.' },
];

const faqs = [
  { q: 'À quel âge peut-on commencer un traitement orthodontique ?', a: 'Le premier bilan orthodontique est recommandé vers 7 ans, lors de l\'apparition des premières dents permanentes. Le traitement actif commence généralement entre 10 et 13 ans. Les adultes peuvent également se traiter à tout âge.' },
  { q: 'Quelle est la différence entre les bagues et les gouttières ?', a: 'Les bagues (brackets) sont des attaches collées sur les dents, reliées par un fil métallique. Elles sont actives en permanence et non amovibles. Les gouttières transparentes sont des aligneurs amovibles changés toutes les 2 semaines. Le choix dépend du type de correction nécessaire.' },
  { q: 'L\'orthodontie est-elle douloureuse ?', a: 'Une gêne légère est normale les premiers jours après la pose et après chaque ajustement. Cette sensation disparaît en 2 à 3 jours. Des antalgiques classiques peuvent être pris si nécessaire.' },
  { q: 'Combien de temps dure un traitement orthodontique ?', a: 'La durée varie de 12 à 30 mois selon la complexité du cas. Un suivi rigoureux et le port régulier de l\'appareil permettent de respecter le calendrier prévu.' },
  { q: 'Le traitement est-il remboursé ?', a: 'En Tunisie, la prise en charge varie selon la caisse d\'assurance. Nous vous aidons à constituer votre dossier de demande de prise en charge si vous êtes affilié à la CNAM.' },
];

export default function OrthodontiePage() {
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
              <Link href="/services" className="hover:text-navy-600 transition-colors">Services</Link>
              <span>/</span>
              <span className="text-warm-700">Orthodontie</span>
            </nav>
            <p className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-3">Soin spécialisé</p>
            <h1 className="font-display text-[2.5rem] lg:text-[3rem] font-semibold text-navy-800 leading-[1.15]">
              Orthodontie
            </h1>
            <p className="text-warm-600 mt-3 text-[15px] max-w-xl leading-relaxed">
              Alignement dentaire pour enfants, adolescents et adultes. Appareils fixes
              ou gouttières transparentes selon votre cas.
            </p>
          </div>
        </div>

        {/* Intro */}
        <section className="py-14 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_300px] gap-12 lg:gap-16">
              <div>
                <h2 className="font-display text-2xl lg:text-3xl font-semibold text-navy-800 mb-6 leading-[1.2]">
                  Pourquoi traiter les malpositions dentaires ?
                </h2>
                <div className="space-y-4 text-warm-700 text-[14.5px] leading-[1.75]">
                  <p>
                    Les malpositions dentaires — dents chevauchées, espaces, décalages entre
                    les mâchoires — ne sont pas seulement esthétiques. Elles peuvent rendre le
                    brossage difficile, favoriser les caries et les maladies parodontales, et
                    engendrer des douleurs articulaires.
                  </p>
                  <p>
                    L'orthodontie vise à corriger ces anomalies par des forces légères et
                    continues appliquées sur les dents. Le résultat est à la fois fonctionnel
                    et esthétique.
                  </p>
                  <p>
                    Le Dr Ayari pratique l'orthodontie pour les enfants dès 7 ans (traitement
                    interceptif précoce), pour les adolescents en pleine croissance, et pour
                    les adultes qui souhaitent corriger leur sourire à tout âge.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-navy-50 rounded p-5 border border-navy-100">
                  <h3 className="font-semibold text-navy-800 text-sm mb-3">Appareils disponibles</h3>
                  <ul className="space-y-2 text-sm text-warm-700">
                    {['Bagues métalliques', 'Bagues céramiques (esthétiques)', 'Gouttières transparentes', 'Appareils amovibles pédiatriques', 'Contentions fixes et amovibles'].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-navy-500 rounded-full flex-shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-warm-100 rounded p-5 border border-warm-200">
                  <p className="text-[12px] uppercase tracking-widest font-medium text-warm-500 mb-2">Durée typique</p>
                  <p className="font-display text-2xl font-semibold text-navy-700">12 – 24 mois</p>
                  <p className="text-sm text-warm-600 mt-1">Selon la complexité du cas</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-14 lg:py-20 bg-warm-100">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-navy-800 mb-10">
              Déroulement du traitement
            </h2>
            <div className="space-y-4">
              {steps.map((s) => (
                <div key={s.step} className="bg-white border border-warm-200 rounded p-6 flex gap-5 items-start">
                  <span className="font-sans text-[13px] font-semibold text-navy-400 w-8 flex-shrink-0 pt-0.5">{s.step}</span>
                  <div>
                    <h3 className="font-semibold text-navy-800 text-[15px] mb-1.5">{s.title}</h3>
                    <p className="text-warm-600 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-navy-800 mb-10">
              Questions fréquentes
            </h2>
            <div className="space-y-4 max-w-3xl">
              {faqs.map((faq) => (
                <details key={faq.q} className="group border border-warm-200 rounded">
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none font-medium text-[14.5px] text-navy-800 hover:text-navy-600 transition-colors">
                    {faq.q}
                    <span className="ml-4 text-warm-400 group-open:rotate-45 transition-transform text-xl font-light flex-shrink-0">+</span>
                  </summary>
                  <div className="px-6 pb-5">
                    <p className="text-warm-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-warm-100 py-14 lg:py-20">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="bg-navy-600 rounded p-8 lg:p-10 text-white max-w-2xl">
              <h2 className="font-display text-2xl font-semibold mb-3">Première consultation orthodontique</h2>
              <p className="text-white/65 text-[14px] leading-relaxed mb-7">
                La première consultation permet d'évaluer votre cas et de vous proposer un plan de
                traitement adapté, sans engagement.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/book-appointment"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-navy-700 text-sm font-medium rounded hover:bg-warm-100 transition-colors"
                >
                  Prendre rendez-vous <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <a
                  href="tel:+21698302743"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/30 text-white text-sm font-medium rounded hover:bg-white/10 transition-colors"
                >
                  +216 98 302 743
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
