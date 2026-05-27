import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Questions fréquentes',
  description:
    'Réponses aux questions fréquentes sur les consultations, les soins et le fonctionnement du Cabinet Dentaire Dr Ayari à Hammam Lif.',
};

const categories = [
  {
    title: 'Consultations et rendez-vous',
    faqs: [
      {
        q: 'Comment prendre un premier rendez-vous ?',
        a: 'Vous pouvez prendre rendez-vous en ligne via le formulaire de réservation, par téléphone au +216 98 302 743, ou en vous présentant directement au cabinet aux heures d\'ouverture.',
      },
      {
        q: 'Quels sont les délais de rendez-vous habituels ?',
        a: 'Pour une consultation de routine, le délai est généralement de 1 à 2 semaines. Pour les urgences dentaires (douleur aiguë, traumatisme), nous nous efforçons de vous recevoir dans la journée ou le lendemain.',
      },
      {
        q: 'Que faut-il apporter à la première consultation ?',
        a: 'Votre carte d\'identité, votre carte d\'assurance maladie si vous êtes affilié à la CNAM, et vos dernières radiographies dentaires si vous en avez.',
      },
      {
        q: 'Est-il possible d\'annuler ou de reporter un rendez-vous ?',
        a: 'Oui, merci de nous prévenir au minimum 24 heures à l\'avance par téléphone afin que nous puissions proposer le créneau à un autre patient.',
      },
    ],
  },
  {
    title: 'Traitements et soins',
    faqs: [
      {
        q: 'L\'orthodontie est-elle réservée aux enfants ?',
        a: 'Non. L\'orthodontie pour adultes est tout à fait possible et de plus en plus courante. Le Dr Ayari propose des solutions adaptées (bagues céramiques esthétiques, gouttières transparentes) aux adultes qui souhaitent améliorer leur alignement dentaire.',
      },
      {
        q: 'Combien de temps dure un détartrage ?',
        a: 'Une séance de détartrage combinée à un polissage dure généralement entre 30 et 45 minutes selon l\'accumulation de tartre. Si un bilan radiologique est réalisé en même temps, comptez 60 minutes.',
      },
      {
        q: 'Le blanchiment dentaire est-il sans danger ?',
        a: 'Oui, lorsqu\'il est réalisé par un professionnel après un bilan préalable. La gencive est protégée pendant la séance. Une sensibilité temporaire peut apparaître les jours suivants et disparaît sans traitement spécifique.',
      },
      {
        q: 'Combien de temps dure la fabrication d\'une prothèse ?',
        a: 'Entre 1 et 4 semaines selon le type de prothèse. Une couronne simple prend environ 2 semaines. Pendant la période de fabrication, une prothèse provisoire est posée si nécessaire.',
      },
    ],
  },
  {
    title: 'Tarifs et remboursements',
    faqs: [
      {
        q: 'Les soins sont-ils remboursés par la CNAM ?',
        a: 'Certains soins (consultations, détartrage, soins conservateurs, extractions) sont partiellement remboursés par la CNAM selon votre affiliation. Les soins esthétiques (blanchiment) et l\'orthodontie ne font généralement pas l\'objet d\'une prise en charge. Nous vous aidons à établir votre dossier.',
      },
      {
        q: 'Proposez-vous des facilités de paiement ?',
        a: 'Pour les traitements importants (orthodontie, prothèses), un échelonnement des paiements peut être discuté directement avec le cabinet. Contactez-nous pour en savoir plus.',
      },
      {
        q: 'Un devis est-il fourni avant un traitement important ?',
        a: 'Oui, systématiquement. Avant tout traitement prothétique, orthodontique ou chirurgical, un devis écrit détaillé vous est remis. Vous disposez du temps nécessaire pour réfléchir avant de prendre votre décision.',
      },
    ],
  },
  {
    title: 'Urgences',
    faqs: [
      {
        q: 'Que faire en cas d\'urgence dentaire ?',
        a: 'Appelez le cabinet au +216 98 302 743. En dehors des horaires d\'ouverture, laissez un message et nous vous recontacterons dès que possible. Pour une urgence grave avec gonflement important ou traumatisme, rendez-vous aux urgences médicales.',
      },
      {
        q: 'Qu\'est-ce qu\'une urgence dentaire ?',
        a: 'Une douleur aiguë et persistante, un gonflement du visage ou de la gencive, une dent cassée ou décollée, un saignement qui ne s\'arrête pas, ou un traumatisme dentaire (dent expulsée suite à un choc).',
      },
    ],
  },
];

export default function FAQPage() {
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
              <span className="text-warm-700">FAQ</span>
            </nav>
            <p className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-3">Questions fréquentes</p>
            <h1 className="font-display text-[2.5rem] lg:text-[3rem] font-semibold text-navy-800 leading-[1.15]">
              Questions & Réponses
            </h1>
            <p className="text-warm-600 mt-3 text-[15px] max-w-xl leading-relaxed">
              Retrouvez les réponses aux questions les plus souvent posées sur nos soins,
              les rendez-vous et le fonctionnement du cabinet.
            </p>
          </div>
        </div>

        {/* FAQ content */}
        <section className="py-14 lg:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {categories.map((category) => (
                <div key={category.title}>
                  <h2 className="font-display text-xl font-semibold text-navy-700 mb-5 pb-3 border-b border-warm-200">
                    {category.title}
                  </h2>
                  <div className="space-y-3">
                    {category.faqs.map((faq) => (
                      <details key={faq.q} className="group border border-warm-200 rounded">
                        <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none font-medium text-[14.5px] text-navy-800 hover:text-navy-600 transition-colors gap-4">
                          <span>{faq.q}</span>
                          <span className="text-warm-400 group-open:rotate-45 transition-transform text-xl font-light flex-shrink-0">+</span>
                        </summary>
                        <div className="px-6 pb-5">
                          <p className="text-warm-600 text-sm leading-relaxed">{faq.a}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-warm-100 py-14 lg:py-20 border-t border-warm-200">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="bg-white border border-warm-200 rounded p-8 max-w-2xl">
              <h2 className="font-display text-2xl font-semibold text-navy-800 mb-3">
                Vous n'avez pas trouvé votre réponse ?
              </h2>
              <p className="text-warm-600 text-[14.5px] leading-relaxed mb-7">
                Contactez-nous directement par téléphone ou via notre formulaire de contact.
                Nous répondons généralement sous 24 heures ouvrées.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-600 text-white text-sm font-medium rounded hover:bg-navy-700 transition-colors"
                >
                  Nous écrire
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <a
                  href="tel:+21698302743"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-warm-300 text-warm-800 text-sm font-medium rounded hover:border-navy-400 hover:text-navy-700 transition-colors"
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
