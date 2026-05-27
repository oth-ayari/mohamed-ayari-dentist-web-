import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="pt-[68px] min-h-[calc(100vh-68px)] flex flex-col">
        <div className="flex-1 flex items-center justify-center py-20 bg-white">
          <div className="max-w-md mx-auto px-5 text-center">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-navy-400 mb-4">
              Erreur 404
            </p>
            <h1 className="font-display text-[3rem] font-semibold text-navy-800 mb-4 leading-none">
              Page introuvable
            </h1>
            <p className="text-warm-600 text-[15px] leading-relaxed mb-10">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-navy-600 text-white text-sm font-medium rounded hover:bg-navy-700 transition-colors"
              >
                Retour à l'accueil
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-warm-300 text-warm-800 text-sm font-medium rounded hover:border-navy-400 hover:text-navy-700 transition-colors"
              >
                Nous contacter
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-warm-200">
              <p className="text-[12px] text-warm-500 mb-4">Pages utiles</p>
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                {[
                  { label: 'Services', href: '/services' },
                  { label: 'À propos', href: '/about' },
                  { label: 'Rendez-vous', href: '/book-appointment' },
                  { label: 'FAQ', href: '/faq' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[13px] text-navy-600 hover:text-navy-800 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
