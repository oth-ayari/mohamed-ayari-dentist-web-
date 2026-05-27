import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'À propos', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Galerie', href: '/gallery' },
  { label: 'Avis patients', href: '/reviews' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
];

const serviceLinks = [
  { label: 'Orthodontie', href: '/services/orthodontie' },
  { label: 'Blanchiment dentaire', href: '/services/blanchiment-dentaire' },
  { label: 'Chirurgie dentaire', href: '/services/chirurgie-dentaire' },
  { label: 'Prothèses dentaires', href: '/services/protheses-dentaires' },
  { label: 'Prévention & Nettoyage', href: '/services/prevention-nettoyage' },
];

export default function Footer() {
  return (
    <footer className="bg-navy-700 text-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group" aria-label="Accueil">
              <div className="w-9 h-9 bg-white/10 rounded flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <svg width="18" height="20" viewBox="0 0 36 42" fill="none" aria-hidden="true">
                  <path
                    d="M18 2C13.8 2 10.6 5 8.8 8C7 11 6 14.5 6 18C6 22 7 26 8 29C9 32 10.5 38 13 38C15.5 38 16 35 17 32C17.5 30.5 17.8 29 18 29C18.2 29 18.5 30.5 19 32C20 35 20.5 38 23 38C25.5 38 27 32 28 29C29 26 30 22 30 18C30 14.5 29 11 27.2 8C25.4 5 22.2 2 18 2Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div className="leading-tight">
                <span className="block font-display font-semibold text-white text-[15px]">
                  Cabinet Dr Ayari
                </span>
                <span className="block text-[10px] tracking-widest uppercase text-white/50">
                  Médecin dentiste
                </span>
              </div>
            </Link>
            <p className="text-white/55 text-sm leading-relaxed">
              Soins dentaires complets et orthodontie à Hammam Lif, Ben Arous, Tunisie.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-5">Navigation</h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13.5px] text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-5">Nos soins</h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13.5px] text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link
                href="/book-appointment"
                className="inline-flex items-center px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white text-[13px] font-medium rounded transition-colors"
              >
                Prendre rendez-vous
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-5">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-white/40 flex-shrink-0" aria-hidden="true" />
                <span className="text-[13.5px] text-white/60">
                  Hammam Lif, Ben Arous<br />Tunisie
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-white/40 flex-shrink-0" aria-hidden="true" />
                <a
                  href="tel:+21698302743"
                  className="text-[13.5px] text-white/60 hover:text-white transition-colors"
                >
                  +216 98 302 743
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-white/40 flex-shrink-0" aria-hidden="true" />
                <a
                  href="mailto:contact@cabinet-ayari.tn"
                  className="text-[13.5px] text-white/60 hover:text-white transition-colors"
                >
                  contact@cabinet-ayari.tn
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-white/40 flex-shrink-0" aria-hidden="true" />
                <div className="text-[13.5px] text-white/60">
                  <p>Lun – Ven : 8h00 – 19h00</p>
                  <p>Samedi : 8h00 – 13h00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/35 text-xs">
            © {new Date().getFullYear()} Cabinet Dentaire Dr Mohamed Ben Othman Ayari. Tous droits réservés.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="text-xs text-white/35 hover:text-white/60 transition-colors">
              Confidentialité
            </Link>
            <Link href="/admin/login" className="text-xs text-white/25 hover:text-white/45 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
