import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Blanchiment dentaire',
  description:
    'Blanchiment dentaire professionnel à Hammam Lif. Séance en cabinet ou gouttières à domicile. Dr Ayari, résultats visibles et durables.',
};

const steps = [
  { step: '01', title: 'Consultation préalable', desc: 'Examen de l\'état de la gencive, des obturations existantes et de la couleur de départ. Contre-indications évaluées. La grossesse, l\'allaitement et les dents très sensibles nécessitent une approche adaptée.' },
  { step: '02', title: 'Nettoyage préalable', desc: 'Détartrage et polissage réalisés si nécessaire pour que le gel blanchissant soit appliqué sur des surfaces saines.' },
  { step: '03', title: 'Séance en cabinet', desc: 'Application d\'un gel à base de peroxyde d\'hydrogène sur les dents. Une protection gingivale est posée. La séance dure environ 45 minutes à 1 heure.' },
  { step: '04', title: 'Résultat et entretien', desc: 'Le résultat est visible immédiatement. Des gouttières avec gel à domicile peuvent être prescrites en complément. Une alimentation moins colorante est conseillée les premiers jours.' },
];

const faqs = [
  { q: 'Combien de teintes peut-on gagner ?', a: 'Le résultat dépend de la couleur de départ et de la nature du changement de couleur (taches extrinsèques vs coloration intrinsèque). En moyenne, on observe un éclaircissement de 3 à 6 teintes.' },
  { q: 'Le blanchiment fonctionne-t-il sur les couronnes et les obturations ?', a: 'Non. Le gel blanchissant n\'agit que sur les dents naturelles. Les prothèses, couronnes et composites gardent leur couleur d\'origine. Si vous avez des prothèses visibles, ce point est discuté en consultation.' },
  { q: 'Les dents peuvent-elles devenir sensibles ?', a: 'Une sensibilité temporaire est possible dans les jours suivant le traitement. Elle disparaît spontanément. Des produits désensibilisants peuvent être utilisés si nécessaire.' },
  { q: 'Combien de temps le résultat dure-t-il ?', a: 'Les résultats durent entre 1 et 3 ans selon les habitudes alimentaires et l\'hygiène bucco-dentaire. Café, thé, vin rouge et tabac accélèrent le ternissement.' },
  { q: 'Qui ne peut pas se faire blanchir les dents ?', a: 'Les femmes enceintes ou allaitantes, les enfants de moins de 16 ans, et les personnes souffrant de maladies parodontales actives. Un bilan préalable permet de s\'assurer que le traitement est indiqué pour vous.' },
];

export default function BlanchimentPage() {
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
              <span className="text-warm-700">Blanchiment dentaire</span>
            </nav>
            <p className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-3">Soin esthétique</p>
            <h1 className="font-display text-[2.5rem] lg:text-[3rem] font-semibold text-navy-800 leading-[1.15]">
              Blanchiment dentaire
            </h1>
            <p className="text-warm-600 mt-3 text-[15px] max-w-xl leading-relaxed">
              Éclaircissement professionnel en cabinet avec des résultats visibles dès la
              première séance.
            </p>
          </div>
        </div>

        <section className="py-14 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_280px] gap-12 lg:gap-16">
              <div>
                <h2 className="font-display text-2xl lg:text-3xl font-semibold text-navy-800 mb-6 leading-[1.2]">
                  Retrouver un sourire plus lumineux
                </h2>
                <div className="space-y-4 text-warm-700 text-[14.5px] leading-[1.75]">
                  <p>
                    La couleur des dents peut ternir avec le temps sous l'effet du café, du thé,
                    du vin rouge, du tabac ou simplement du vieillissement naturel de l'émail.
                    Le blanchiment dentaire professionnel permet de corriger ces changements de
                    façon sûre et contrôlée.
                  </p>
                  <p>
                    Contrairement aux kits vendus en pharmacie, le blanchiment en cabinet utilise
                    des concentrations de peroxyde d'hydrogène plus efficaces, appliquées sous
                    surveillance professionnelle. La gencive est protégée pendant toute la séance.
                  </p>
                  <p>
                    Un bilan préalable est systématiquement réalisé pour s'assurer que le traitement
                    est adapté à votre situation. Si des caries ou une maladie gingivale sont
                    présentes, elles sont traitées en priorité.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-navy-50 border border-navy-100 rounded p-5">
                  <h3 className="font-semibold text-navy-800 text-sm mb-3">Deux méthodes</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-navy-700">En cabinet</p>
                      <p className="text-[13px] text-warm-600 mt-0.5">Résultats immédiats en 1 séance d'environ 1h.</p>
                    </div>
                    <div className="border-t border-navy-100 pt-3">
                      <p className="text-sm font-medium text-navy-700">Gouttières à domicile</p>
                      <p className="text-[13px] text-warm-600 mt-0.5">Gouttières sur mesure + gel. À porter 1h/jour pendant 2 semaines.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-warm-100 rounded p-5 border border-warm-200">
                  <p className="text-[12px] uppercase tracking-widest font-medium text-warm-500 mb-2">Durée séance cabinet</p>
                  <p className="font-display text-2xl font-semibold text-navy-700">45 – 60 min</p>
                  <p className="text-sm text-warm-600 mt-1">Résultat visible immédiatement</p>
                </div>
              </div>
            </div>
          </div>
        </section>

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
              <h2 className="font-display text-2xl font-semibold mb-3">Intéressé par le blanchiment ?</h2>
              <p className="text-white/65 text-[14px] leading-relaxed mb-7">
                Prenez rendez-vous pour une consultation préalable afin d'évaluer votre éligibilité
                et discuter du résultat attendu.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/book-appointment"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-navy-700 text-sm font-medium rounded hover:bg-warm-100 transition-colors"
                >
                  Prendre rendez-vous <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
