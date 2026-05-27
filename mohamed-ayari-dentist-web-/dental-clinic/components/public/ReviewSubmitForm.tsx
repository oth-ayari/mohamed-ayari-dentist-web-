'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

const services = [
  'Orthodontie',
  'Blanchiment dentaire',
  'Chirurgie dentaire',
  'Prothèses dentaires',
  'Prévention & Nettoyage',
  'Soins conservateurs',
  'Consultation générale',
];

const inputClass =
  'w-full px-4 py-2.5 text-[14px] text-warm-900 bg-white border border-warm-300 rounded [color-scheme:light] placeholder:text-warm-400 focus:outline-none focus:border-navy-500 focus:ring-1 focus:ring-navy-500 transition-colors';

export default function ReviewSubmitForm() {
  const [form, setForm] = useState({
    patientName: '',
    rating: 5,
    review: '',
    service: '',
  });
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || data.message || 'Erreur lors de l\'envoi.');
      }

      setStatus('success');
      setForm({ patientName: '', rating: 5, review: '', service: '' });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  if (status === 'success') {
    return (
      <div className="border border-green-200 bg-green-50 rounded p-8 text-center">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-semibold text-green-800 mb-2">Avis envoyé</h3>
        <p className="text-green-700 text-sm leading-relaxed">
          Merci pour votre témoignage ! Votre avis sera publié après vérification par notre équipe.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="rev-patientName" className="block text-[13px] font-medium text-warm-800 mb-1.5">
            Votre nom <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="rev-patientName"
            name="patientName"
            type="text"
            required
            value={form.patientName}
            onChange={handleChange}
            placeholder="Prénom N."
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="rev-service" className="block text-[13px] font-medium text-warm-800 mb-1.5">
            Soin concerné
          </label>
          <select
            id="rev-service"
            name="service"
            value={form.service}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Non précisé</option>
            {services.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <p className="text-[13px] font-medium text-warm-800 mb-2">
          Note <span className="text-red-500" aria-hidden="true">*</span>
        </p>
        <div className="flex gap-1" role="group" aria-label="Note de 1 à 5 étoiles">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, rating: star }))}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              className="p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-1 rounded"
              aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
              aria-pressed={form.rating >= star}
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  (hoverRating ?? form.rating) >= star
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-warm-300'
                }`}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="rev-review" className="block text-[13px] font-medium text-warm-800 mb-1.5">
          Votre avis <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <textarea
          id="rev-review"
          name="review"
          required
          rows={4}
          minLength={10}
          value={form.review}
          onChange={handleChange}
          placeholder="Décrivez votre expérience au cabinet..."
          className={inputClass + ' resize-none'}
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex items-center gap-2 px-6 py-3 bg-navy-600 text-white text-sm font-medium rounded hover:bg-navy-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2"
      >
        {status === 'sending' ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Envoi…
          </>
        ) : (
          'Publier mon avis'
        )}
      </button>
      <p className="text-[11.5px] text-warm-500">
        Les avis sont vérifiés avant publication.
      </p>
    </form>
  );
}
