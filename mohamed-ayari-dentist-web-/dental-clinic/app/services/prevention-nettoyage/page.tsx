import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Prévention & Nettoyage',
  description:
    'Détartrage, polissage, bilan annuel et prévention bucco-dentaire à Hammam Lif. Cabinet Dr Ayari — hygiène et suivi pour toute la famille.',
};

const services = [
  { title: 'Bilan annuel', desc: 'Examen complet de l\'état dentaire et gingival, accompagné d\'un bilan radiologique panoramique ou de radios rétro-alvéolaires ciblées.' },
  { title: 'Détartrage ultrasonique', desc: 'Élimination du tartre supra et sous-gingival à l\'aide d\'une sonde à ultrasons. Plus confortable et plus précis que le détartrage manuel seul.' },
  { title: 'Polissage', desc: 'Élimination des colorations de surface (café, thé, tabac) et lissage des surfaces dentaires après le détartrage pour retarder la reformation du tartre.' },
  { title: 'Fluoration', desc: 'Application de vernis fluoré en protection complémentaire, notamment pour les enfants et les adultes présentant un risque carieux élevé.' },
  { title: 'Conseils d\'hygiène personnalisés', desc: 'Techniques de brossage adaptées à votre anatomie, choix de la brosse et du fil dentaire, conseils sur les révélateurs de plaque.' },
  { title: 'Dentisterie pédiatrique', desc: 'Suivi régulier des enfants dès la première dent, avec un accent sur la prévention et la gestion de l\'anxiété dentaire dès le plus jeune âge.' },
];

const faqs = [
  { q: 'À quelle fréquence faut-il faire un détartrage ?', a: 'Généralement une à deux fois par an, selon votre tendance à former du tartre et l\'état de vos gencives. Votre praticien vous indique la fréquence adaptée à votre situation lors du bilan.' },
  { q: 'Le détartrage abîme-t-il l\'émail des dents ?', a: 'Non. Les ultrasons utilisés sont réglés pour éliminer le tartre sans abraser l\'émail sain. En revanche, ne pas faire de détartrage régulièrement aggrave les maladies gingivales et peut entraîner une perte osseuse.' },
  { q: 'À quel âge emmener son enfant chez le dentiste pour la première fois ?', a: 'La première visite est recommandée dès l\'âge d\'un an ou lors de l\'apparition des premières dents. L\'objectif principal est de familiariser l\'enfant avec le cabinet et de donner des conseils aux parents sur l\'hygiène et l\'alimentation.' },
  { q: 'Le remboursement du bilan annuel est-il possible ?', a: 'En Tunisie, le détartrage et le bilan radiologique peuvent être pris en charge par la CNAM dans certaines conditions. Renseignez-vous auprès de votre caisse selon votre affiliation.' },
];

export default function PreventionPage() {
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
              <span className="text-warm-700">Prévention & Nettoyage</span>
            </nav>
            <p className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-3">Hygiène bucco-dentaire</p>
            <h1 className="font-display text-[2.5rem] lg:text-[3rem] font-semibold text-navy-800 leading-[1.15]">
              Prévention & Nettoyage
            </h1>
            <p className="text-warm-600 mt-3 text-[15px] max-w-xl leading-relaxed">
              Détartrage, bilan annuel et conseils personnalisés pour toute la famille.
              La prévention est le pilier d'une bonne santé dentaire à long terme.
            </p>
          </div>
        </div>

        <section className="py-14 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_260px] gap-12 lg:gap-16">
              <div>
                <h2 className="font-display text-2xl lg:text-3xl font-semibold text-navy-800 mb-6 leading-[1.2]">
                  Pourquoi la prévention est essentielle
                </h2>
                <div className="space-y-4 text-warm-700 text-[14.5px] leading-[1.75] mb-10">
                  <p>
                    La majorité des problèmes dentaires — caries, maladies des gencives, mauvaise
                    haleine — sont évitables avec un entretien régulier et des consultations
                    préventives. Un bilan annuel permet de détecter les lésions à un stade précoce,
                    quand elles sont plus simples et moins coûteuses à traiter.
                  </p>
                  <p>
                    Le cabinet Dr Ayari place la prévention au cœur de sa pratique. Chaque patient
                    repart avec des conseils personnalisés adaptés à son âge, à sa denture et à ses
                    habitudes.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {services.map((s) => (
                    <div key={s.title} className="border border-warm-200 rounded p-5">
                      <h3 className="font-semibold text-navy-800 text-[14px] mb-2">{s.title}</h3>
                      <p className="text-warm-600 text-[13px] leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-navy-50 border border-navy-100 rounded p-5">
                  <h3 className="font-semibold text-navy-800 text-sm mb-4">Bilan annuel recommandé</h3>
                  <ul className="space-y-2.5 text-[13px] text-warm-700">
                    {[
                      'Examen clinique complet',
                      'Radiographies ciblées',
                      'Détartrage et polissage',
                      'Conseils hygiène personnalisés',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-navy-500 rounded-full flex-shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-warm-100 border border-warm-200 rounded p-5">
                  <p className="text-[12px] uppercase tracking-widest font-medium text-warm-500 mb-2">Durée estimée</p>
                  <p className="font-display text-2xl font-semibold text-navy-700">45 – 60 min</p>
                  <p className="text-sm text-warm-600 mt-1">Bilan + nettoyage complet</p>
                </div>
                <div className="border border-warm-200 rounded p-5">
                  <p className="text-sm text-warm-700 leading-relaxed">
                    <span className="font-medium text-navy-700">Enfants :</span> Première visite
                    recommandée dès 12 mois. Suivi régulier tous les 6 mois.
                  </p>
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
              <h2 className="font-display text-2xl font-semibold mb-3">Votre bilan annuel</h2>
              <p className="text-white/65 text-[14px] leading-relaxed mb-7">
                Ne repoussez pas votre bilan dentaire. Prenez rendez-vous pour un examen
                complet et un nettoyage professionnel.
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
