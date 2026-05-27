import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/public/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contactez le Cabinet Dentaire Dr Ayari à Hammam Lif. Formulaire en ligne, téléphone ou e-mail — nous répondons dans les 24 heures ouvrées.',
};

export default function ContactPage() {
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
              <span className="text-warm-700">Contact</span>
            </nav>
            <p className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-3">Nous écrire</p>
            <h1 className="font-display text-[2.5rem] lg:text-[3rem] font-semibold text-navy-800 leading-[1.15]">
              Contacter le cabinet
            </h1>
            <p className="text-warm-600 mt-3 text-[15px] max-w-xl leading-relaxed">
              Pour toute question ou demande d'information, utilisez le formulaire
              ci-dessous ou contactez-nous directement par téléphone.
            </p>
          </div>
        </div>

        {/* Content */}
        <section className="py-14 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_320px] gap-12 lg:gap-16 items-start">

              {/* Form */}
              <div>
                <h2 className="font-display text-2xl font-semibold text-navy-800 mb-7">
                  Envoyer un message
                </h2>
                <ContactForm />
              </div>

              {/* Info sidebar */}
              <div className="space-y-5">
                <div className="border border-warm-200 rounded p-6">
                  <h3 className="font-semibold text-navy-800 text-[14.5px] mb-5">Informations de contact</h3>
                  <ul className="space-y-5">
                    <li className="flex items-start gap-3.5">
                      <div className="w-9 h-9 bg-navy-50 rounded flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-navy-600" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-medium text-navy-800 text-[13.5px] mb-0.5">Adresse</p>
                        <p className="text-warm-600 text-[13px]">Hammam Lif, Ben Arous</p>
                        <p className="text-warm-600 text-[13px]">Tunisie</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3.5">
                      <div className="w-9 h-9 bg-navy-50 rounded flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-navy-600" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-medium text-navy-800 text-[13.5px] mb-0.5">Téléphone</p>
                        <a
                          href="tel:+21698302743"
                          className="text-navy-600 hover:text-navy-800 text-[13px] transition-colors"
                        >
                          +216 98 302 743
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3.5">
                      <div className="w-9 h-9 bg-navy-50 rounded flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-navy-600" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-medium text-navy-800 text-[13.5px] mb-0.5">E-mail</p>
                        <a
                          href="mailto:contact@cabinet-ayari.tn"
                          className="text-navy-600 hover:text-navy-800 text-[13px] transition-colors"
                        >
                          contact@cabinet-ayari.tn
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="border border-warm-200 rounded p-6">
                  <div className="flex items-start gap-3.5 mb-4">
                    <div className="w-9 h-9 bg-navy-50 rounded flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-navy-600" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-navy-800 text-[14.5px] mt-1.5">Horaires d'ouverture</h3>
                  </div>
                  <div className="space-y-2.5 text-[13px]">
                    {[
                      { day: 'Lundi – Vendredi', hours: '8h00 – 19h00' },
                      { day: 'Samedi', hours: '8h00 – 13h00' },
                      { day: 'Dimanche', hours: 'Fermé' },
                    ].map(({ day, hours }) => (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-warm-700">{day}</span>
                        <span className={hours === 'Fermé' ? 'text-warm-400' : 'text-navy-700 font-medium'}>
                          {hours}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-[12px] text-warm-500 border-t border-warm-200 pt-4">
                    Pour les urgences en dehors des horaires, appelez le +216 98 302 743.
                  </p>
                </div>

                <div className="bg-navy-600 rounded p-6 text-white">
                  <h3 className="font-semibold text-[14.5px] mb-2">Besoin d'un rendez-vous ?</h3>
                  <p className="text-white/65 text-[13px] leading-relaxed mb-4">
                    Réservez directement en ligne en choisissant votre créneau.
                  </p>
                  <Link
                    href="/book-appointment"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-navy-700 text-sm font-medium rounded hover:bg-warm-100 transition-colors"
                  >
                    Prendre rendez-vous
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
