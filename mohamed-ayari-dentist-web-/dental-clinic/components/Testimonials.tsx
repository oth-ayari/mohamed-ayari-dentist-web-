'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, PenLine } from 'lucide-react';
import ReviewForm from './ReviewForm';

const easing = [0.22, 1, 0.36, 1];

const AVATAR_COLORS = ['#0891B2', '#06B6D4', '#C9A84C', '#22D3EE', '#0891B2', '#C9A84C'];

const STATIC_TESTIMONIALS = [
  {
    id: 's1',
    name: 'Sonia Belhadj',
    service: 'Orthodontie',
    rating: 5,
    text: 'Le Dr Ayari a transformé le sourire de ma fille. Son approche patiente et rassurante a mis notre enfant complètement à l\'aise dès la première séance. Un suivi irréprochable tout au long du traitement. Je recommande vivement ce cabinet !',
    date: 'Janvier 2025',
    initials: 'SB',
    avatarColor: '#0891B2',
  },
  {
    id: 's2',
    name: 'Karim Haddad',
    service: 'Détartrage & Prévention',
    rating: 4,
    text: 'Cabinet très propre et moderne. L\'équipe est accueillante et professionnelle. Le Dr Ayari prend le temps d\'expliquer chaque étape du soin, ce qui est très rassurant. Mes dents n\'ont jamais été aussi saines !',
    date: 'Mars 2025',
    initials: 'KH',
    avatarColor: '#06B6D4',
  },
  {
    id: 's3',
    name: 'Amira Tlili',
    service: 'Blanchiment Dentaire',
    rating: 5,
    text: 'Résultat spectaculaire après le traitement de blanchiment ! Mes dents sont plusieurs teintes plus claires et le résultat est parfaitement naturel. Le Dr Ayari est à l\'écoute et s\'assure du confort du patient tout au long du processus.',
    date: 'Février 2025',
    initials: 'AT',
    avatarColor: '#C9A84C',
  },
  {
    id: 's4',
    name: 'Mohamed Ali Brahmi',
    service: 'Soins conservateurs',
    rating: 4,
    text: 'J\'avais une grande anxiété face aux soins dentaires. Le Dr Ayari a su me rassurer avec calme et professionnalisme. Les soins sont réalisés sans douleur et avec beaucoup de précision. Je ne me souviens plus de ma peur !',
    date: 'Avril 2025',
    initials: 'MB',
    avatarColor: '#22D3EE',
  },
  {
    id: 's5',
    name: 'Fatima Ezzahra Mansouri',
    service: 'Urgence Dentaire',
    rating: 5,
    text: 'J\'ai eu une urgence en soirée avec une douleur insupportable. Le Dr Ayari m\'a reçue rapidement et soulagée en quelques minutes. Son professionnalisme et sa disponibilité m\'ont vraiment impressionnée. Merci infiniment !',
    date: 'Janvier 2025',
    initials: 'FM',
    avatarColor: '#0891B2',
  },
  {
    id: 's6',
    name: 'Ahmed Saidi',
    service: 'Prothèse dentaire',
    rating: 5,
    text: 'Après avoir perdu plusieurs dents suite à un accident, le Dr Ayari m\'a accompagné avec énormément de patience et d\'expertise dans la mise en place de mes prothèses. Le résultat est naturel et confortable. Je mange à nouveau normalement !',
    date: 'Mai 2025',
    initials: 'AS',
    avatarColor: '#C9A84C',
  },
];

interface DbTestimonial {
  id: string; patientName: string; rating: number; review: string;
  service?: string; approved: boolean; createdAt: string;
}

function dbToDisplay(t: DbTestimonial) {
  const words = t.patientName.split(' ');
  const initials = (words[0]?.[0] ?? '') + (words[1]?.[0] ?? '');
  const colorIdx = t.patientName.charCodeAt(0) % AVATAR_COLORS.length;
  return {
    id: t.id,
    name: t.patientName,
    service: t.service ?? '',
    rating: t.rating,
    text: t.review,
    date: new Date(t.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    initials: initials.toUpperCase(),
    avatarColor: AVATAR_COLORS[colorIdx],
  };
}

type Testimonial = typeof STATIC_TESTIMONIALS[0];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4"
          fill={i < rating ? '#C9A84C' : 'transparent'}
          stroke={i < rating ? '#C9A84C' : '#5B8CAE'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(STATIC_TESTIMONIALS);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetch('/api/admin/testimonials?limit=20')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const dbItems = (data.data?.testimonials ?? data.data ?? []) as DbTestimonial[];
          const approved = dbItems.filter(t => t.approved).map(dbToDisplay);
          if (approved.length > 0) {
            setTestimonials([...STATIC_TESTIMONIALS, ...approved]);
          }
        }
      })
      .catch(() => {});
  }, []);

  const visible = 3;
  const total = testimonials.length;

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [autoplay, next]);

  const getSlides = () => {
    const items = [];
    for (let i = 0; i < visible; i++) {
      items.push(testimonials[(current + i) % total]);
    }
    return items;
  };

  return (
    <section
      id="temoignages"
      className="py-28 relative overflow-hidden bg-white"
    >
      <div
        className="absolute top-0 right-0 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 60%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: easing }}
          className="text-center mb-16"
        >
          <div className="section-tag mx-auto mb-4">
            <Star className="w-3 h-3" />
            Témoignages Patients
          </div>
          <h2
            className="text-4xl lg:text-5xl font-display font-bold text-navy-900 mb-5"
            style={{ letterSpacing: '-0.02em' }}
          >
            Ils nous font
            <span
              className="bg-clip-text text-transparent ml-3"
              style={{ backgroundImage: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' }}
            >
              confiance
            </span>
          </h2>
          <p className="text-navy-500 text-lg max-w-xl mx-auto">
            Découvrez ce que nos patients disent de leur expérience au cabinet.
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          {/* Desktop: 3 visible */}
          <div className="hidden lg:grid grid-cols-3 gap-6 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              {getSlides().map((testimonial, i) => (
                <motion.div
                  key={testimonial.id + current}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -60 }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: easing }}
                  className="relative p-7 rounded-3xl border border-navy-100 hover:border-cyan-200 transition-all duration-500 group"
                  style={{ boxShadow: '0 4px 24px rgba(7,25,41,0.06)' }}
                >
                  {/* Quote icon */}
                  <div
                    className="absolute top-6 right-6 w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(6,182,212,0.08)' }}
                  >
                    <Quote className="w-4 h-4 text-cyan-400" />
                  </div>

                  {/* Stars */}
                  <StarRating rating={testimonial.rating} />

                  {/* Text */}
                  <p className="text-navy-600 text-sm leading-relaxed mt-4 mb-6" style={{ lineHeight: '1.8' }}>
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-navy-100">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-white text-sm flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${testimonial.avatarColor} 0%, ${testimonial.avatarColor}CC 100%)` }}
                    >
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="text-navy-900 font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-cyan-600 text-xs font-medium">{testimonial.service}</p>
                    </div>
                    <p className="ml-auto text-navy-400 text-xs">{testimonial.date}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Mobile: 1 visible */}
          <div className="lg:hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.4, ease: easing }}
                className="relative p-7 rounded-3xl border border-navy-100"
                style={{ boxShadow: '0 4px 24px rgba(7,25,41,0.06)' }}
              >
                <div
                  className="absolute top-6 right-6 w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(6,182,212,0.08)' }}
                >
                  <Quote className="w-4 h-4 text-cyan-400" />
                </div>
                <StarRating rating={testimonials[current].rating} />
                <p className="text-navy-600 text-sm leading-relaxed mt-4 mb-6">
                  &ldquo;{testimonials[current].text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-navy-100">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-white text-sm"
                    style={{ background: `linear-gradient(135deg, ${testimonials[current].avatarColor}, ${testimonials[current].avatarColor}CC)` }}
                  >
                    {testimonials[current].initials}
                  </div>
                  <div>
                    <p className="text-navy-900 font-semibold text-sm">{testimonials[current].name}</p>
                    <p className="text-cyan-600 text-xs">{testimonials[current].service}</p>
                  </div>
                  <p className="ml-auto text-navy-400 text-xs">{testimonials[current].date}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-xl border border-navy-200 flex items-center justify-center text-navy-400 hover:text-navy-900 hover:border-cyan-400 transition-all duration-200"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? '24px' : '8px',
                    height: '8px',
                    background: i === current ? '#06B6D4' : '#CBD5E1',
                  }}
                  aria-label={`Témoignage ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-xl border border-navy-200 flex items-center justify-center text-navy-400 hover:text-navy-900 hover:border-cyan-400 transition-all duration-200"
              aria-label="Suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CTA to leave review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: easing }}
          className="mt-14 text-center"
        >
          <p className="text-navy-500 mb-4">Vous avez visité notre cabinet ? Partagez votre expérience !</p>
          <button
            onClick={() => setShowReviewForm(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-6 py-3 text-sm font-semibold text-navy-700 shadow-card hover:border-cyan-400 hover:text-cyan-600 hover:shadow-card-hover transition-all duration-300"
          >
            <PenLine className="h-4 w-4" />
            Laisser un avis
          </button>
        </motion.div>
      </div>

      {/* Review form modal */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowReviewForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl bg-white p-7 shadow-navy overflow-y-auto max-h-[90vh]"
            >
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-navy-900">Votre avis compte</h3>
                  <p className="mt-1 text-sm text-navy-500">Aidez d&apos;autres patients à nous découvrir</p>
                </div>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-navy-400 hover:bg-navy-100 transition-colors"
                >
                  ✕
                </button>
              </div>
              <ReviewForm />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
