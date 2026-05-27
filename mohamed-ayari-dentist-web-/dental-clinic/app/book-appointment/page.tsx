import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Phone } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BookingForm from '@/components/public/BookingForm';

export const metadata: Metadata = {
  title: 'Prendre rendez-vous',
  description:
    'Réservez votre consultation dentaire en ligne au cabinet Dr Ayari, Hammam Lif. Orthodontie, soins, prothèses — confirmation sous 24h.',
};

export default function BookAppointmentPage() {
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
              <span className="text-warm-700">Prendre rendez-vous</span>
            </nav>
            <p className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-3">Réservation en ligne</p>
            <h1 className="font-display text-[2.5rem] lg:text-[3rem] font-semibold text-navy-800 leading-[1.15]">
              Prendre rendez-vous
            </h1>
            <p className="text-warm-600 mt-3 text-[15px] max-w-xl leading-relaxed">
              Remplissez le formulaire ci-dessous et nous vous confirmerons votre
              rendez-vous par téléphone ou e-mail sous 24 heures ouvrées.
            </p>
          </div>
        </div>

        {/* Form section */}
        <section className="py-14 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-start">

              <div>
                <BookingForm />
              </div>

              {/* Sidebar info */}
              <div className="space-y-5">
                <div className="bg-warm-100 border border-warm-200 rounded p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-4 h-4 text-navy-600" aria-hidden="true" />
                    <h3 className="font-semibold text-navy-800 text-[14.5px]">Horaires</h3>
                  </div>
                  <div className="space-y-2 text-[13px]">
                    {[
                      { day: 'Lun – Ven', hours: '8h00 – 19h00' },
                      { day: 'Samedi', hours: '8h00 – 13h00' },
                      { day: 'Dimanche', hours: 'Fermé' },
                    ].map(({ day, hours }) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-warm-600">{day}</span>
                        <span className={hours === 'Fermé' ? 'text-warm-400' : 'text-navy-700 font-medium'}>
                          {hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-warm-200 rounded p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Phone className="w-4 h-4 text-navy-600" aria-hidden="true" />
                    <h3 className="font-semibold text-navy-800 text-[14.5px]">Par téléphone</h3>
                  </div>
                  <p className="text-warm-600 text-[13px] mb-3 leading-relaxed">
                    Vous préférez appeler ? Contactez-nous directement.
                  </p>
                  <a
                    href="tel:+21698302743"
                    className="text-navy-600 hover:text-navy-800 font-medium text-[14px] transition-colors"
                  >
                    +216 98 302 743
                  </a>
                </div>

                <div className="border border-warm-200 rounded p-6">
                  <h3 className="font-semibold text-navy-800 text-[14.5px] mb-3">Comment ça marche ?</h3>
                  <ol className="space-y-3 text-[13px] text-warm-700">
                    {[
                      'Remplissez le formulaire avec vos informations.',
                      'Nous vérifions les disponibilités et vous contactons.',
                      'Vous recevez une confirmation par e-mail ou SMS.',
                      'Vous vous présentez le jour convenu au cabinet.',
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-5 h-5 bg-navy-600 text-white rounded-full text-[11px] font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
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
