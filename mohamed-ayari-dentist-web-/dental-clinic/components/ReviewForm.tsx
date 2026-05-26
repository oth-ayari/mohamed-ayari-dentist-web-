'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, CheckCircle, AlertCircle, User, MessageSquare } from 'lucide-react';

const SERVICES = [
  'Dentisterie restauratrice',
  'Prévention & Nettoyage',
  'Blanchiment dentaire',
  'Orthodontie',
  'Solutions prothétiques',
  'Chirurgie dentaire',
  'Urgence dentaire',
  'Consultation générale',
];

export default function ReviewForm() {
  const [form, setForm] = useState({
    patientName: '',
    rating: 5,
    review: '',
    service: '',
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const update = (key: keyof typeof form, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientName.trim() || !form.review.trim()) {
      setErrorMsg('Veuillez remplir votre nom et votre avis.');
      return;
    }
    if (form.review.trim().length < 10) {
      setErrorMsg('Votre avis doit contenir au moins 10 caractères.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: form.patientName.trim(),
          rating: form.rating,
          review: form.review.trim(),
          service: form.service || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
      } else {
        setErrorMsg(data.error ?? 'Une erreur est survenue');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Erreur réseau. Réessayez.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center py-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
        >
          <CheckCircle className="h-8 w-8 text-green-500" />
        </motion.div>
        <h3 className="mt-4 text-xl font-bold text-navy-900">Merci pour votre avis !</h3>
        <p className="mt-2 text-sm text-navy-500 max-w-sm">
          Votre témoignage a été soumis avec succès. Il sera visible après validation par notre équipe.
        </p>
        <button
          onClick={() => { setStatus('idle'); setForm({ patientName: '', rating: 5, review: '', service: '' }); }}
          className="mt-5 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600 transition-colors"
        >
          Soumettre un autre avis
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Error */}
      <AnimatePresence>
        {(status === 'error' || errorMsg) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-navy-700">Votre nom</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input
            value={form.patientName}
            onChange={e => update('patientName', e.target.value)}
            placeholder="Prénom Nom"
            maxLength={100}
            className="w-full rounded-xl border border-navy-200 bg-white py-3 pl-9 pr-4 text-sm text-navy-900 outline-none transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 placeholder-navy-300"
          />
        </div>
      </div>

      {/* Star rating */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-navy-700">Votre note</label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHoveredStar(i + 1)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => update('rating', i + 1)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className="h-7 w-7"
                fill={i < (hoveredStar || form.rating) ? '#C9A84C' : 'transparent'}
                stroke={i < (hoveredStar || form.rating) ? '#C9A84C' : '#CBD5E1'}
                strokeWidth={1.5}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-navy-500">
            {['', 'Très insatisfait', 'Insatisfait', 'Moyen', 'Satisfait', 'Très satisfait'][hoveredStar || form.rating]}
          </span>
        </div>
      </div>

      {/* Service */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-navy-700">Service concerné <span className="text-navy-400 font-normal">(optionnel)</span></label>
        <select
          value={form.service}
          onChange={e => update('service', e.target.value)}
          className="w-full rounded-xl border border-navy-200 bg-white py-3 px-4 text-sm text-navy-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
        >
          <option value="">Sélectionner un service</option>
          {SERVICES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Review text */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-navy-700">Votre avis</label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-navy-400" />
          <textarea
            value={form.review}
            onChange={e => update('review', e.target.value)}
            placeholder="Partagez votre expérience au cabinet..."
            rows={4}
            maxLength={1000}
            className="w-full rounded-xl border border-navy-200 bg-white py-3 pl-9 pr-4 text-sm text-navy-900 outline-none transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 placeholder-navy-300 resize-none"
          />
          <p className="mt-1 text-right text-xs text-navy-400">{form.review.length}/1000</p>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={status === 'loading'}
        whileTap={{ scale: 0.98 }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 py-3 text-sm font-semibold text-white shadow-cyan transition-all hover:from-cyan-400 hover:to-cyan-500 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Envoi en cours...
          </>
        ) : (
          <><Send className="h-4 w-4" /> Soumettre mon avis</>
        )}
      </motion.button>

      <p className="text-center text-xs text-navy-400">
        Votre avis sera examiné avant publication. Aucune information personnelle ne sera partagée.
      </p>
    </form>
  );
}
