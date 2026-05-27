import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Prothèses dentaires',
  description:
    'Couronnes, bridges et prothèses amovibles sur mesure à Hammam Lif. Cabinet Dr Ayari, restauration et remplacement dentaire.',
};

const types = [
  {
    category: 'Prothèses fixes',
    items: [
      { title: 'Couronne dentaire', desc: 'Coiffe protégeant une dent abîmée, fracturée ou dépulpée. Réalisée en céramique, métal-céramique ou zircone selon la position et les exigences esthétiques.' },
      { title: 'Bridge (pont)', desc: 'Prothèse fixée sur les dents adjacentes pour remplacer une dent manquante. Alternative à l\'implant lorsque les dents voisines nécessitent de toute façon une couronne.' },
      { title: 'Inlay / Onlay', desc: 'Reconstruction en céramique ou composite réalisée au laboratoire pour les dents postérieures très abîmées. Meilleure résistance que les obturations directes volumineuses.' },
    ],
  },
  {
    category: 'Prothèses amovibles',
    items: [
      { title: 'Prothèse partielle', desc: 'Remplace un ou plusieurs dents manquantes. Structures métalliques (châssis) ou en résine selon les cas. Retirée la nuit pour nettoyage.' },
      { title: 'Prothèse complète', desc: 'Remplace l\'ensemble des dents d\'une arcade. Réalisée en résine teintée pour un aspect naturel. Requiert un temps d\'adaptation à l\'élocution et à la mastication.' },
    ],
  },
];

const steps = [
  { step: '01', title: 'Consultation et bilan', desc: 'Examen de la dent à traiter, radiographies. Le type de prothèse le plus adapté est sélectionné avec le patient.' },
  { step: '02', title: 'Préparation de la dent', desc: 'Pour une couronne, la dent est taillée sous anesthésie. Une prothèse provisoire est posée pour la période d\'attente.' },
  { step: '03', title: 'Empreintes', desc: 'Empreinte précise envoyée au laboratoire de prothèse pour la fabrication. Délai de 1 à 3 semaines selon la prothèse.' },
  { step: '04', title: 'Essayage et mise en place', desc: 'Vérification de la couleur, de la forme et de l\'occlusion avant la pose définitive. Ajustements si nécessaires.' },
];

const faqs = [
  { q: 'Combien de temps dure une couronne dentaire ?', a: 'Une couronne bien réalisée et bien entretenue dure en moyenne 15 à 20 ans. Sa durée de vie dépend de l\'hygiène bucco-dentaire, des habitudes alimentaires et de la qualité de l\'ancrage sur la dent support.' },
  { q: 'Quelle est la différence entre céramique et zircone ?', a: 'La zircone est une céramique high-tech, plus résistante et sans métal. Elle est utilisée pour les couronnes postérieures soumises à de fortes contraintes et pour les patients allergiques au métal. La céramique pure (feldspathique) offre une esthétique optimale pour les dents antérieures.' },
  { q: 'Une prothèse amovible est-elle confortable ?', a: 'Les premières semaines nécessitent une période d\'adaptation à la mastication et à l\'élocution. La plupart des patients s\'y habituent progressivement. Des ajustements sont réalisés si des points d\'appui douloureux apparaissent.' },
  { q: 'L\'empreinte dentaire est-elle douloureuse ?', a: 'Non. L\'empreinte numérique (par scanner intra-oral) est indolore. L\'empreinte traditionnelle avec du matériau gélifiant peut être légèrement inconfortable mais pas douloureuse.' },
];

export default function ProthesesPage() {
  return (
    <>
      <Header />
      <main className="pt-[68px]">

        <div className="bg-warm-100 border-b border-warm-200 py-10 lg:py-16">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-[12px] text-warm-500 mb-5" aria-label="Fil d'Ariane">
              <Link href="/" className="hover:text-navy-600 transition-colors">Accueil</Link>
              <span>/</span>
              <Link href="/services" className="hover:text-navy-600 transition-colors">Services</Link>
              <span>/</span>
              <span className="text-warm-700">Prothèses dentaires</span>
            </nav>
            <p className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-3">Restauration dentaire</p>
            <h1 className="font-display text-[2.5rem] lg:text-[3rem] font-semibold text-navy-800 leading-[1.15]">
              Prothèses dentaires
            </h1>
            <p className="text-warm-600 mt-3 text-[15px] max-w-xl leading-relaxed">
              Couronnes, bridges et prothèses amovibles réalisés sur mesure pour restaurer
              ou remplacer les dents manquantes.
            </p>
          </div>
        </div>

        <section className="py-14 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="font-display text-2xl lg:text-3xl font-semibold text-navy-800 mb-6 leading-[1.2]">
                Types de prothèses disponibles
              </h2>
              <p className="text-warm-700 text-[14.5px] leading-[1.75] max-w-2xl">
                Les prothèses dentaires permettent de redonner une fonction masticatoire normale
                et un aspect esthétique naturel après la perte ou la destruction d'une dent.
                Le choix du type de prothèse dépend du nombre de dents à remplacer, de la
                situation clinique et des préférences du patient.
              </p>
            </div>
            <div className="space-y-8">
              {types.map((group) => (
                <div key={group.category}>
                  <h3 className="font-semibold text-[12px] uppercase tracking-widest text-navy-500 mb-4">{group.category}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.items.map((item) => (
                      <div key={item.title} className="border border-warm-200 rounded p-5">
                        <h4 className="font-display text-[1.1rem] font-semibold text-navy-800 mb-2">{item.title}</h4>
                        <p className="text-warm-600 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-warm-100">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-navy-800 mb-10">
              Déroulement du traitement
            </h2>
            <div className="space-y-4 max-w-3xl">
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

        <section className="bg-warm-100 py-14 lg:py-20">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="bg-navy-600 rounded p-8 lg:p-10 text-white max-w-2xl">
              <h2 className="font-display text-2xl font-semibold mb-3">Consultation prothétique</h2>
              <p className="text-white/65 text-[14px] leading-relaxed mb-7">
                Prenez rendez-vous pour évaluer vos besoins et recevoir un devis détaillé de votre traitement prothétique.
              </p>
              <Link
                href="/book-appointment"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-navy-700 text-sm font-medium rounded hover:bg-warm-100 transition-colors"
              >
                Prendre rendez-vous <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
