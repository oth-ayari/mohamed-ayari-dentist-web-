'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, Phone, Calendar, ShieldCheck } from 'lucide-react';

const links = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'À propos', href: '#apropos' },
  { label: 'Services', href: '#services' },
  { label: 'Témoignages', href: '#temoignages' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

interface NavbarProps {
  onBookingOpen: () => void;
}

export default function Navbar({ onBookingOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    links.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'backdrop-blur-xl py-3'
            : 'py-5'
        }`}
        style={
          scrolled
            ? {
                background: 'rgba(4, 17, 31, 0.85)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 8px 32px rgba(4,17,31,0.4)',
              }
            : {}
        }
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group"
            aria-label="Accueil"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(6,182,212,0.05) 100%)',
                border: '1px solid rgba(6,182,212,0.3)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 44 44" fill="none">
                <path
                  d="M22 4C17.5 4 14 7 12 10C10 13 9 17 9 20C9 24 10 28 11 31C12 34 13.5 40 16 40C18.5 40 19 37 20 34C20.5 32.5 21 31 22 31C23 31 23.5 32.5 24 34C25 37 25.5 40 28 40C30.5 40 32 34 33 31C34 28 35 24 35 20C35 17 34 13 32 10C30 7 26.5 4 22 4Z"
                  fill="url(#navToothGrad)"
                />
                <defs>
                  <linearGradient id="navToothGrad" x1="9" y1="4" x2="35" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#22D3EE" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-display font-semibold text-base leading-tight tracking-tight">
                Dr Ayari Mohamed
              </p>
              <p className="text-cyan-400/70 text-[10px] font-medium tracking-[0.15em] uppercase leading-tight">
                Médecin Dentiste · Orthodontie
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map(({ label, href }) => (
              <button
                key={href}
                onClick={() => handleNavClick(href)}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeSection === href.slice(1)
                    ? 'text-cyan-400'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {label}
                {activeSection === href.slice(1) && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+21698302743"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/80 hover:text-white text-sm font-medium transition-all duration-200 hover:bg-white/5"
            >
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>+216 98 302 743</span>
            </a>
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white/40 hover:text-white/70 text-xs font-medium transition-all duration-200 hover:bg-white/5 border border-white/10 hover:border-white/20"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Administrateur
            </Link>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onBookingOpen}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                boxShadow: '0 4px 16px rgba(6,182,212,0.35)',
              }}
            >
              <Calendar className="w-4 h-4" />
              Prendre RDV
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-white p-2 rounded-xl transition-colors hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 w-80 z-50 flex flex-col lg:hidden"
              style={{
                background: 'linear-gradient(180deg, #071929 0%, #04111F 100%)',
                borderLeft: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/06">
                <div>
                  <p className="text-white font-display font-semibold">Dr Ayari Mohamed</p>
                  <p className="text-cyan-400/70 text-xs tracking-widest uppercase mt-0.5">Médecin Dentiste</p>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-white/60 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <nav className="space-y-1">
                  {links.map(({ label, href }, i) => (
                    <motion.button
                      key={href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1, duration: 0.4 }}
                      onClick={() => handleNavClick(href)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                        activeSection === href.slice(1)
                          ? 'text-cyan-400 bg-cyan-400/10'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {label}
                    </motion.button>
                  ))}
                </nav>
              </div>

              <div className="p-6 border-t border-white/06 space-y-3">
                <a
                  href="tel:+21698302743"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white text-sm font-medium"
                >
                  <Phone className="w-4 h-4 text-cyan-400" />
                  +216 98 302 743
                </a>
                <button
                  onClick={() => { setMobileOpen(false); onBookingOpen(); }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm"
                  style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' }}
                >
                  <Calendar className="w-4 h-4" />
                  Prendre Rendez-vous
                </button>
                <Link
                  href="/admin/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-white/40 hover:text-white/60 text-xs font-medium border border-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Espace Administrateur
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
