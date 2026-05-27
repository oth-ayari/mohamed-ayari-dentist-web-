import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, AlertCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Chirurgie dentaire',
  description:
    'Extractions dentaires, dents de sagesse, chirurgie parodontale à Hammam Lif. Cabinet Dr Ayari, soins chirurgicaux buccaux réalisés sous anesthésie locale.',
};

const interventions = [
  { title: 'Extractions simples', desc: 'Extraction des dents très abîmées, non conservables ou dont l\'absence est préférable pour la santé de l\'ensemble de la denture.' },
  { title: 'Dents de sagesse', desc: 'Extraction des troisièmes molaires incluses ou en mauvaise position, sous anesthésie locale. Suivi post-opératoire inclus.' },
  { title: 'Chirurgie parodontale', desc: 'Surfaçage radiculaire, lambeau de détersion pour traiter les formes avancées de maladie des gencives.' },
  { title: 'Kystes et petites tumeurs', desc: 'Ablation chirurgicale des kystes radiculaires et des lésions bénignes des tissus mous buccaux.' },
  { title: 'Frenectomie', desc: 'Correction des brides muqueuses gênant la mobilité de la langue ou l\'espace inter-incisif.' },
];

const faqs = [
  { q: 'L\'extraction est-elle douloureuse ?', a: 'L\'extraction se fait sous anesthésie locale efficace. Vous ne ressentez pas de douleur pendant l\'intervention, seulement des pressions. En post-opératoire, des douleurs modérées peuvent survenir et sont soulagées par les antalgiques prescrits.' },
  { q: 'Combien de temps dure la cicatrisation après une extraction ?', a: 'La cicatrisation de la gencive prend 2 à 4 semaines. La reconstruction osseuse complète prend plusieurs mois. Pendant les 24 premières heures, il est conseillé d\'éviter de fumer, de boire chaud et de pratiquer un effort physique intense.' },
  { q: 'Quelles sont les suites opératoires habituelles ?', a: 'Un léger gonflement et un saignement résiduel les premières heures sont normaux. Des antalgiques et parfois un antibiotique sont prescrits. Une alimentation molle est recommandée les 2 à 3 premiers jours.' },
  { q: 'Quand faut-il appeler le cabinet après une intervention ?', a: 'Si le saignement ne s\'arrête pas après 20 minutes de compression, si la douleur s\'intensifie après 48 heures malgré les antalgiques, ou si de la fièvre apparaît, contactez le cabinet sans attendre.' },
];

export default function ChirugiePage() {
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
              <span className="text-warm-700">Chirurgie dentaire</span>
            </nav>
            <p className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-3">Intervention buccale</p>
            <h1 className="font-display text-[2.5rem] lg:text-[3rem] font-semibold text-navy-800 leading-[1.15]">
              Chirurgie dentaire
            </h1>
            <p className="text-warm-600 mt-3 text-[15px] max-w-xl leading-relaxed">
              Extractions, dents de sagesse et petites interventions bucco-dentaires
              réalisées sous anesthésie locale avec suivi post-opératoire.
            </p>
          </div>
        </div>

        <section className="py-14 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_280px] gap-12 lg:gap-16">
              <div>
                <h2 className="font-display text-2xl lg:text-3xl font-semibold text-navy-800 mb-6 leading-[1.2]">
                  Interventions chirurgicales pratiquées
                </h2>
                <div className="space-y-4 text-warm-700 text-[14.5px] leading-[1.75] mb-8">
                  <p>
                    La chirurgie dentaire regroupe les actes réalisés en bouche qui nécessitent une
                    anesthésie locale et une incision ou une extraction. Elle est indiquée lorsqu'un
                    traitement conservateur n'est plus possible.
                  </p>
                  <p>
                    Toutes les interventions sont précédées d'un bilan clinique et radiologique.
                    Le Dr Ayari explique en détail chaque geste avant la séance et remet des
                    consignes post-opératoires écrites.
                  </p>
                </div>
                <div className="space-y-3">
                  {interventions.map((item) => (
                    <div key={item.title} className="border border-warm-200 rounded p-5">
                      <h3 className="font-semibold text-navy-800 text-[14.5px] mb-1.5">{item.title}</h3>
                      <p className="text-warm-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-amber-600" aria-hidden="true" />
                    <h3 className="font-semibold text-amber-800 text-sm">Urgences dentaires</h3>
                  </div>
                  <p className="text-amber-700 text-[13px] leading-relaxed">
                    En cas de douleur intense, de gonflement important ou de traumatisme dentaire,
                    appelez le cabinet.
                  </p>
                  <a
                    href="tel:+21698302743"
                    className="block mt-3 text-sm font-medium text-amber-800 hover:text-amber-900 transition-colors"
                  >
                    +216 98 302 743
                  </a>
                </div>
                <div className="bg-navy-50 border border-navy-100 rounded p-5">
                  <h3 className="font-semibold text-navy-800 text-sm mb-3">Préparation à l'intervention</h3>
                  <ul className="space-y-2 text-[13px] text-warm-700">
                    {[
                      'Informez le praticien de vos traitements médicaux',
                      'Évitez de venir à jeun (sauf indication contraire)',
                      'Prévoyez un accompagnant si nécessaire',
                      'Apportez vos radios récentes si vous en avez',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-navy-400 rounded-full mt-1.5 flex-shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-warm-100">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-navy-800 mb-10">
              Questions fréquentes
            </h2>
            <div className="space-y-4 max-w-3xl">
              {faqs.map((faq) => (
                <details key={faq.q} className="group border border-warm-200 bg-white rounded">
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

        <section className="bg-white py-14 lg:py-20">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="bg-navy-600 rounded p-8 lg:p-10 text-white max-w-2xl">
              <h2 className="font-display text-2xl font-semibold mb-3">Prendre rendez-vous</h2>
              <p className="text-white/65 text-[14px] leading-relaxed mb-7">
                Consultez le Dr Ayari pour évaluer votre situation et discuter des options thérapeutiques.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/book-appointment"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-navy-700 text-sm font-medium rounded hover:bg-warm-100 transition-colors"
                >
                  Réserver une consultation <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <a
                  href="tel:+21698302743"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/30 text-white text-sm font-medium rounded hover:bg-white/10 transition-colors"
                >
                  Appeler le cabinet
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
