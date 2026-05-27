'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';

const services = [
  { label: 'Orthodontie', href: '/services/orthodontie' },
  { label: 'Blanchiment dentaire', href: '/services/blanchiment-dentaire' },
  { label: 'Chirurgie dentaire', href: '/services/chirurgie-dentaire' },
  { label: 'Prothèses dentaires', href: '/services/protheses-dentaires' },
  { label: 'Prévention & Nettoyage', href: '/services/prevention-nettoyage' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesExpanded(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-200 ${
          scrolled
            ? 'shadow-[0_1px_8px_rgb(0_0_0/0.07)]'
            : 'border-b border-warm-300'
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              aria-label="Cabinet Dr Ayari — Accueil"
            >
              <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-navy-600 rounded group-hover:bg-navy-700 transition-colors">
                <svg width="18" height="20" viewBox="0 0 36 42" fill="none" aria-hidden="true">
                  <path
                    d="M18 2C13.8 2 10.6 5 8.8 8C7 11 6 14.5 6 18C6 22 7 26 8 29C9 32 10.5 38 13 38C15.5 38 16 35 17 32C17.5 30.5 17.8 29 18 29C18.2 29 18.5 30.5 19 32C20 35 20.5 38 23 38C25.5 38 27 32 28 29C29 26 30 22 30 18C30 14.5 29 11 27.2 8C25.4 5 22.2 2 18 2Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div className="hidden sm:block leading-tight">
                <span className="block font-display font-semibold text-navy-800 text-[15px]">
                  Dr Ayari Mohamed
                </span>
                <span className="block text-[10px] tracking-widest uppercase text-warm-600 font-sans">
                  Médecin dentiste
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5" role="navigation" aria-label="Navigation principale">
              <Link
                href="/"
                className={`px-3 py-2 text-[13.5px] font-medium rounded transition-colors ${
                  isActive('/') ? 'text-navy-700' : 'text-warm-700 hover:text-navy-700'
                }`}
              >
                Accueil
              </Link>
              <Link
                href="/about"
                className={`px-3 py-2 text-[13.5px] font-medium rounded transition-colors ${
                  isActive('/about') ? 'text-navy-700' : 'text-warm-700 hover:text-navy-700'
                }`}
              >
                À propos
              </Link>

              {/* Services dropdown */}
              <div className="relative group">
                <Link
                  href="/services"
                  className={`flex items-center gap-1 px-3 py-2 text-[13.5px] font-medium rounded transition-colors ${
                    isActive('/services') ? 'text-navy-700' : 'text-warm-700 hover:text-navy-700'
                  }`}
                >
                  Services
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" aria-hidden="true" />
                </Link>
                <div className="absolute top-full left-0 pt-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-white border border-warm-200 rounded-md shadow-card-md py-1.5 w-52">
                    {services.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className={`block px-4 py-2.5 text-[13px] transition-colors ${
                          pathname === s.href
                            ? 'text-navy-700 bg-warm-100'
                            : 'text-warm-700 hover:text-navy-700 hover:bg-warm-100'
                        }`}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href="/gallery"
                className={`px-3 py-2 text-[13.5px] font-medium rounded transition-colors ${
                  isActive('/gallery') ? 'text-navy-700' : 'text-warm-700 hover:text-navy-700'
                }`}
              >
                Galerie
              </Link>
              <Link
                href="/reviews"
                className={`px-3 py-2 text-[13.5px] font-medium rounded transition-colors ${
                  isActive('/reviews') ? 'text-navy-700' : 'text-warm-700 hover:text-navy-700'
                }`}
              >
                Avis
              </Link>
              <Link
                href="/contact"
                className={`px-3 py-2 text-[13.5px] font-medium rounded transition-colors ${
                  isActive('/contact') ? 'text-navy-700' : 'text-warm-700 hover:text-navy-700'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:+21698302743"
                className="flex items-center gap-1.5 text-[13px] text-warm-600 hover:text-navy-700 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                <span>98 302 743</span>
              </a>
              <Link
                href="/book-appointment"
                className="inline-flex items-center px-4 py-2 bg-navy-600 text-white text-[13px] font-medium rounded hover:bg-navy-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2"
              >
                Rendez-vous
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 -mr-1 text-warm-700 hover:text-navy-700 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`fixed top-0 right-0 bottom-0 z-50 w-[280px] bg-white shadow-card-lg lg:hidden flex flex-col transform transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between px-5 h-[68px] border-b border-warm-200 flex-shrink-0">
          <span className="font-display font-semibold text-navy-800">Navigation</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 -mr-1 text-warm-600 hover:text-navy-700 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <Link
            href="/"
            className="flex items-center px-3 py-2.5 text-[14px] font-medium text-warm-800 hover:text-navy-700 hover:bg-warm-100 rounded transition-colors"
          >
            Accueil
          </Link>
          <Link
            href="/about"
            className="flex items-center px-3 py-2.5 text-[14px] font-medium text-warm-800 hover:text-navy-700 hover:bg-warm-100 rounded transition-colors"
          >
            À propos
          </Link>

          {/* Services accordion */}
          <div>
            <button
              onClick={() => setServicesExpanded(!servicesExpanded)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-[14px] font-medium text-warm-800 hover:text-navy-700 hover:bg-warm-100 rounded transition-colors"
              aria-expanded={servicesExpanded}
            >
              Services
              <ChevronDown
                className={`w-4 h-4 text-warm-500 transition-transform duration-200 ${servicesExpanded ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
            {servicesExpanded && (
              <div className="ml-3 mt-0.5 pl-3 border-l border-warm-200 space-y-0.5">
                {services.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="block px-3 py-2 text-[13.5px] text-warm-700 hover:text-navy-700 hover:bg-warm-100 rounded transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/gallery"
            className="flex items-center px-3 py-2.5 text-[14px] font-medium text-warm-800 hover:text-navy-700 hover:bg-warm-100 rounded transition-colors"
          >
            Galerie
          </Link>
          <Link
            href="/reviews"
            className="flex items-center px-3 py-2.5 text-[14px] font-medium text-warm-800 hover:text-navy-700 hover:bg-warm-100 rounded transition-colors"
          >
            Avis patients
          </Link>
          <Link
            href="/contact"
            className="flex items-center px-3 py-2.5 text-[14px] font-medium text-warm-800 hover:text-navy-700 hover:bg-warm-100 rounded transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/faq"
            className="flex items-center px-3 py-2.5 text-[14px] font-medium text-warm-800 hover:text-navy-700 hover:bg-warm-100 rounded transition-colors"
          >
            FAQ
          </Link>
        </nav>

        <div className="flex-shrink-0 p-4 border-t border-warm-200 space-y-2.5">
          <a
            href="tel:+21698302743"
            className="flex items-center gap-3 px-4 py-3 bg-warm-100 hover:bg-warm-200 rounded text-[14px] font-medium text-navy-700 transition-colors"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            +216 98 302 743
          </a>
          <Link
            href="/book-appointment"
            className="flex items-center justify-center px-4 py-3 bg-navy-600 hover:bg-navy-700 rounded text-white text-[14px] font-medium transition-colors"
          >
            Prendre rendez-vous
          </Link>
        </div>
      </div>
    </>
  );
}
