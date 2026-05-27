'use client';

import { useState } from 'react';

const subjects = [
  'Demande d\'information générale',
  'Question sur un traitement',
  'Demande de devis',
  'Urgence dentaire',
  'Annulation de rendez-vous',
  'Autre',
];

const inputClass =
  'w-full px-4 py-2.5 text-[14px] text-warm-900 bg-white border border-warm-300 rounded [color-scheme:light] placeholder:text-warm-400 focus:outline-none focus:border-navy-500 focus:ring-1 focus:ring-navy-500 transition-colors';

export default function ContactForm() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
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
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || data.message || 'Erreur lors de l\'envoi.');
      }

      setStatus('success');
      setForm({ fullName: '', email: '', phone: '', subject: '', message: '' });
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
        <h3 className="font-display text-xl font-semibold text-green-800 mb-2">Message envoyé</h3>
        <p className="text-green-700 text-sm leading-relaxed">
          Votre message a bien été reçu. Nous vous répondrons dans les plus brefs délais,
          généralement sous 24 heures ouvrées.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-5 text-sm font-medium text-green-700 hover:text-green-900 underline transition-colors"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="fullName" className="block text-[13px] font-medium text-warm-800 mb-1.5">
            Nom complet <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={form.fullName}
            onChange={handleChange}
            placeholder="Votre nom et prénom"
            className={inputClass}
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-[13px] font-medium text-warm-800 mb-1.5">
            Adresse e-mail <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="votre@email.com"
            className={inputClass}
            autoComplete="email"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className="block text-[13px] font-medium text-warm-800 mb-1.5">
            Téléphone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+216 XX XXX XXX"
            className={inputClass}
            autoComplete="tel"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-[13px] font-medium text-warm-800 mb-1.5">
            Objet <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            required
            value={form.subject}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="" disabled>Sélectionner un objet</option>
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-[13px] font-medium text-warm-800 mb-1.5">
          Message <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="Décrivez votre demande..."
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
            Envoi en cours…
          </>
        ) : (
          'Envoyer le message'
        )}
      </button>
    </form>
  );
}
