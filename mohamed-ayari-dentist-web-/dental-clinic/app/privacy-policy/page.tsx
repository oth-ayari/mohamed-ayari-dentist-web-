import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité du Cabinet Dentaire Dr Ayari — traitement des données personnelles.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="pt-[68px]">

        <div className="bg-warm-100 border-b border-warm-200 py-10 lg:py-14">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-[12px] text-warm-500 mb-5" aria-label="Fil d'Ariane">
              <Link href="/" className="hover:text-navy-600 transition-colors">Accueil</Link>
              <span>/</span>
              <span className="text-warm-700">Confidentialité</span>
            </nav>
            <h1 className="font-display text-[2.2rem] lg:text-[2.7rem] font-semibold text-navy-800 leading-[1.2]">
              Politique de confidentialité
            </h1>
            <p className="text-warm-500 text-sm mt-2">Dernière mise à jour : janvier 2025</p>
          </div>
        </div>

        <section className="py-12 lg:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="prose prose-sm max-w-none text-warm-700 leading-relaxed space-y-8">

              <div>
                <h2 className="font-display text-xl font-semibold text-navy-800 mb-4">1. Responsable du traitement</h2>
                <p>
                  Cabinet Dentaire Dr Mohamed Ben Othman Ayari<br />
                  Hammam Lif, Ben Arous, Tunisie<br />
                  Téléphone : +216 98 302 743<br />
                  E-mail : contact@cabinet-ayari.tn
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-navy-800 mb-4">2. Données collectées</h2>
                <p>Nous collectons les données suivantes :</p>
                <ul className="mt-3 space-y-1 list-disc pl-5">
                  <li>Formulaire de contact : nom, e-mail, téléphone, message</li>
                  <li>Formulaire de rendez-vous : nom, e-mail, téléphone, soin souhaité, date et heure</li>
                  <li>Formulaire d'avis : nom et témoignage</li>
                  <li>Données de navigation : adresse IP, pages visitées, navigateur (à des fins statistiques)</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-navy-800 mb-4">3. Finalités du traitement</h2>
                <p>Vos données sont utilisées pour :</p>
                <ul className="mt-3 space-y-1 list-disc pl-5">
                  <li>Répondre à vos demandes de contact</li>
                  <li>Confirmer et gérer vos rendez-vous</li>
                  <li>Publier vos avis (après modération)</li>
                  <li>Améliorer le service proposé par le cabinet</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-navy-800 mb-4">4. Conservation des données</h2>
                <p>
                  Les données de contact et de rendez-vous sont conservées pendant 3 ans à compter de
                  la dernière interaction. Les avis publiés sont conservés jusqu'à demande de suppression.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-navy-800 mb-4">5. Vos droits</h2>
                <p>
                  Conformément à la loi tunisienne et aux principes du RGPD, vous disposez d'un droit
                  d'accès, de rectification, de suppression et de portabilité de vos données. Pour
                  exercer ces droits, contactez-nous à l'adresse e-mail indiquée ci-dessus.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-navy-800 mb-4">6. Cookies</h2>
                <p>
                  Ce site n'utilise pas de cookies de suivi commerciaux ou de tracking publicitaire.
                  Des cookies techniques peuvent être utilisés pour le bon fonctionnement du site.
                </p>
              </div>

            </div>

            <div className="mt-12 pt-8 border-t border-warm-200">
              <Link
                href="/"
                className="text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors"
              >
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
