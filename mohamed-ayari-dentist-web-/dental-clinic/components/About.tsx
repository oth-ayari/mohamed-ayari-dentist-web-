'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, GraduationCap, Stethoscope, Heart } from 'lucide-react';
import Image from 'next/image';

const easing = [0.22, 1, 0.36, 1];

const highlights = [
  'Approche bienveillante et personnalisée pour chaque patient',
  'Technologies de pointe pour des soins précis et confortables',
  'Prise en charge complète, de la prévention à la réhabilitation',
  'Cabinet chaleureux, moderne et adapté à tous les âges',
];

const credentials = [
  {
    icon: GraduationCap,
    title: 'Formation d\'excellence',
    desc: 'Diplômé en médecine dentaire avec spécialisation en orthodontie',
  },
  {
    icon: Stethoscope,
    title: 'Pratique rigoureuse',
    desc: 'Protocoles stricts d\'hygiène et de sécurité pour votre protection',
  },
  {
    icon: Heart,
    title: 'Engagement patient',
    desc: 'Suivi durable et relation de confiance construite dans la durée',
  },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="apropos" ref={ref} className="py-28 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at top right, rgba(6,182,212,0.04) 0%, transparent 60%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at bottom left, rgba(201,168,76,0.04) 0%, transparent 60%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Image + decorative elements */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: easing }}
            className="relative"
          >
            {/* Main image */}
            <div
              className="relative rounded-4xl overflow-hidden aspect-[4/5]"
              style={{
                boxShadow: '0 40px 80px rgba(7,25,41,0.15), 0 12px 32px rgba(7,25,41,0.08)',
              }}
            >
              <Image
                src="/doctor-photo.png"
                alt="Dr Ayari Mohamed — Médecin Dentiste"
                fill
                className="object-cover object-top"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(0deg, rgba(7,25,41,0.5) 0%, transparent 50%)' }}
              />
              {/* Name overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div
                  className="p-4 rounded-2xl"
                  style={{
                    background: 'rgba(4,17,31,0.7)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <p className="text-white font-display font-semibold text-lg">Dr Ayari Mohamed</p>
                  <p className="text-cyan-400 text-sm font-medium">Médecin Dentiste · Orthodontiste</p>
                </div>
              </div>
            </div>

            {/* Floating experience badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-6 -right-6 p-5 rounded-3xl text-center"
              style={{
                background: 'linear-gradient(135deg, #071929 0%, #0B2235 100%)',
                border: '1px solid rgba(6,182,212,0.25)',
                boxShadow: '0 20px 40px rgba(4,17,31,0.4)',
              }}
            >
              <p className="font-mono font-bold text-3xl text-cyan-400 leading-none">15+</p>
              <p className="text-white/70 text-xs font-medium mt-1 leading-tight">Années<br/>d&apos;expertise</p>
            </motion.div>

            {/* Floating rating badge */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="absolute -bottom-4 -left-4 p-4 rounded-2xl flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg, #071929 0%, #0B2235 100%)',
                border: '1px solid rgba(201,168,76,0.25)',
                boxShadow: '0 16px 32px rgba(4,17,31,0.4)',
              }}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill={i < 4 ? '#C9A84C' : 'rgba(201,168,76,0.3)'}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div>
                <p className="text-white font-mono font-bold text-sm leading-none">4.3/5</p>
                <p className="text-white/50 text-[10px] mt-0.5">6 avis Google</p>
              </div>
            </motion.div>

            {/* Decorative line */}
            <div
              className="absolute top-1/4 -left-8 w-1 h-1/2 rounded-full hidden lg:block"
              style={{ background: 'linear-gradient(180deg, transparent, #06B6D4, transparent)' }}
            />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: easing }}
            className="space-y-8"
          >
            <div>
              <div className="section-tag mb-4">
                <Stethoscope className="w-3 h-3" />
                À propos du Docteur
              </div>
              <h2
                className="text-4xl lg:text-5xl font-display font-bold text-navy-900 leading-tight mb-6"
                style={{ letterSpacing: '-0.02em' }}
              >
                Une médecine dentaire
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' }}
                >
                  centrée sur l&apos;humain
                </span>
              </h2>
              <div className="space-y-4 text-navy-600 leading-relaxed" style={{ lineHeight: '1.8' }}>
                <p>
                  Le Dr Ayari Mohamed exerce la médecine dentaire à Hammam Lif, au cœur du gouvernorat de Ben Arous, avec une vision claire : offrir des soins d&apos;excellence dans un environnement rassurant, moderne et bienveillant.
                </p>
                <p>
                  Son cabinet marie expertise médicale éprouvée, équipements de dernière génération et relation de confiance durable — pour que chaque patient, quel que soit son âge, vive une expérience de soin sereine et personnalisée.
                </p>
                <p>
                  Profondément attaché à la prévention et au suivi individualisé, le Dr Ayari accompagne ses patients tout au long de leur parcours bucco-dentaire, avec rigueur et humanité.
                </p>
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-3">
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: easing }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <span className="text-navy-700 text-sm leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {credentials.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.6, ease: easing }}
                  className="p-4 rounded-2xl border border-navy-100 hover:border-cyan-200 transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #F8FBFD 0%, #F0F7FA 100%)' }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: 'rgba(6,182,212,0.1)' }}
                  >
                    <Icon className="w-4 h-4 text-cyan-600" />
                  </div>
                  <p className="text-navy-900 font-semibold text-xs leading-tight mb-1">{title}</p>
                  <p className="text-navy-500 text-[11px] leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
