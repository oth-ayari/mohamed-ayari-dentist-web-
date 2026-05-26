'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Phone, Star, MapPin, ChevronDown, Shield, Award, Clock } from 'lucide-react';

interface HeroProps {
  onBookingOpen: () => void;
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="font-mono font-bold">
      {count}{suffix}
    </span>
  );
}

export default function Hero({ onBookingOpen }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, -80]);
  const y2 = useTransform(scrollY, [0, 600], [0, -40]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const stats = [
    { value: 15, suffix: '+', label: 'Années d\'expérience', icon: Award },
    { value: 500, suffix: '+', label: 'Patients satisfaits', icon: Shield },
    { value: 7, suffix: '', label: 'Spécialités médicales', icon: Clock },
  ];

  return (
    <section
      id="accueil"
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #04111F 0%, #071929 45%, #0B2235 100%)' }}
    >
      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.03] noise-overlay pointer-events-none" />

      {/* Animated background blobs */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            borderRadius: ['60% 40% 30% 70%/60% 30% 70% 40%', '30% 60% 70% 40%/50% 60% 30% 60%', '60% 40% 30% 70%/60% 30% 70% 40%'],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 w-[700px] h-[700px]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.12) 0%, rgba(6,182,212,0.04) 50%, transparent 70%)' }}
        />
        <motion.div
          animate={{
            borderRadius: ['40% 60% 60% 40%/40% 40% 60% 60%', '60% 40% 40% 60%/60% 60% 40% 40%', '40% 60% 60% 40%/40% 40% 60% 60%'],
            scale: [1.05, 1, 1.05],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-60 -right-40 w-[800px] h-[800px]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, rgba(11,34,53,0.04) 50%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/3 right-1/4 w-96 h-96"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 60%)' }}
        />
      </motion.div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Hero Content */}
      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* Left: Main copy */}
        <div className="flex-1 text-center lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{
                background: 'rgba(6,182,212,0.1)',
                border: '1px solid rgba(6,182,212,0.25)',
                color: '#67E8F9',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Cabinet d&apos;Excellence · Hammam Lif
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6"
          >
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.05] tracking-tight"
              style={{ letterSpacing: '-0.03em' }}
            >
              <span className="text-white">Un sourire</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #67E8F9 0%, #06B6D4 40%, #22D3EE 100%)' }}
              >
                qui inspire
              </span>
              <br />
              <span className="text-white">confiance.</span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-white/60 text-lg leading-relaxed max-w-lg mb-10 lg:mb-12"
            style={{ lineHeight: '1.75' }}
          >
            Le Cabinet du Dr Ayari Mohamed allie expertise médicale, technologies modernes et attention personnalisée pour offrir des soins dentaires d&apos;exception à Hammam Lif.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-14"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onBookingOpen}
              className="relative group flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold text-base overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                boxShadow: '0 8px 30px rgba(6,182,212,0.45), 0 2px 8px rgba(6,182,212,0.3)',
              }}
            >
              <span className="relative z-10">Prendre Rendez-vous</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, #22D3EE 0%, #06B6D4 100%)' }}
              />
            </motion.button>

            <a
              href="tel:+21698302743"
              className="flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold text-base transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <Phone className="w-5 h-5 text-cyan-400" />
              Nous Appeler
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-6"
          >
            {stats.map(({ value, suffix, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}
                >
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white font-mono font-bold text-xl leading-none">
                    <AnimatedCounter target={value} suffix={suffix} />
                  </p>
                  <p className="text-white/50 text-xs mt-0.5 leading-tight">{label}</p>
                </div>
                {i < stats.length - 1 && (
                  <div className="h-8 w-px bg-white/10 ml-3 hidden sm:block" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right: Floating glass card */}
        <motion.div
          style={{ y: y2 }}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0 w-full max-w-sm lg:w-80"
        >
          {/* Main doctor card */}
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 32px 64px rgba(4,17,31,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            {/* Clinic image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src="/clinic-photo.png"
                alt="Cabinet Dentaire Dr Ayari"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(4,17,31,0.8) 0%, transparent 60%)' }} />
              {/* Rating badge */}
              <div
                className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                style={{ background: 'rgba(4,17,31,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                <span className="text-white font-semibold text-sm font-mono">4.3/5</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-white font-display font-semibold text-xl">Dr Ayari Mohamed</h3>
                <p className="text-cyan-400 text-sm font-medium mt-0.5">Médecin Dentiste · Orthodontiste</p>
              </div>

              <div className="flex items-start gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Avenue Taieb Mhiri, Hammam-Lif, Ben Arous, Tunisie</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href="tel:+21698302743"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-white text-xs font-semibold transition-all duration-200 hover:opacity-80"
                  style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.25)' }}
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  Appeler
                </a>
                <button
                  onClick={onBookingOpen}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-white text-xs font-semibold transition-all duration-200 hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' }}
                >
                  Réserver
                </button>
              </div>
            </div>
          </div>

          {/* Floating badge: Opening hours */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="mt-4 p-4 rounded-2xl flex items-center gap-3"
            style={{
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.2)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201,168,76,0.15)' }}
            >
              <Clock className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Horaires d&apos;ouverture</p>
              <p className="text-white/50 text-xs mt-0.5">Lun–Ven: 8h–18h · Sam: 8h–13h</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-white/30" />
        </motion.div>
        <p className="text-white/25 text-xs tracking-widest uppercase font-medium">Découvrir</p>
      </motion.div>
    </section>
  );
}
