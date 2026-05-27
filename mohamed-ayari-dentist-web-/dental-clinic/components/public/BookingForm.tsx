'use client';

import { useState } from 'react';

const services = [
  'Orthodontie',
  'Blanchiment dentaire',
  'Chirurgie buccale',
  'Prothèses dentaires',
  'Implantologie',
  'Détartrage et nettoyage',
  'Soins dentaires',
  'Consultation générale',
];

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
];

const inputClass =
  'w-full px-4 py-2.5 text-[14px] text-warm-900 bg-white border border-warm-300 rounded [color-scheme:light] placeholder:text-warm-400 focus:outline-none focus:border-navy-500 focus:ring-1 focus:ring-navy-500 transition-colors';

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export default function BookingForm() {
  const [form, setForm] = useState({
    patientName: '',
    email: '',
    phone: '',
    selectedService: '',
    appointmentDate: '',
    appointmentTime: '',
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
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || data.message || 'Une erreur est survenue lors de la réservation.');
      }

      setStatus('success');
      setForm({
        patientName: '',
        email: '',
        phone: '',
        selectedService: '',
        appointmentDate: '',
        appointmentTime: '',
        message: '',
      });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  if (status === 'success') {
    return (
      <div className="border border-green-200 bg-green-50 rounded p-10 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-semibold text-green-800 mb-3">Demande envoyée</h3>
        <p className="text-green-700 text-[14.5px] leading-relaxed max-w-md mx-auto">
          Votre demande de rendez-vous a bien été reçue. Notre équipe vous contactera
          pour confirmer votre créneau dans les meilleurs délais.
        </p>
        <p className="mt-3 text-green-600 text-sm">
          Vous recevrez une confirmation par e-mail.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm font-medium text-green-700 hover:text-green-900 underline transition-colors"
        >
          Faire une autre demande
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">

      <fieldset>
        <legend className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-5">
          Informations patient
        </legend>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="patientName" className="block text-[13px] font-medium text-warm-800 mb-1.5">
              Nom complet <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="patientName"
              name="patientName"
              type="text"
              required
              value={form.patientName}
              onChange={handleChange}
              placeholder="Prénom et nom"
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
          <div>
            <label htmlFor="phone" className="block text-[13px] font-medium text-warm-800 mb-1.5">
              Téléphone <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={handleChange}
              placeholder="+216 XX XXX XXX"
              className={inputClass}
              autoComplete="tel"
            />
          </div>
          <div>
            <label htmlFor="selectedService" className="block text-[13px] font-medium text-warm-800 mb-1.5">
              Soin souhaité <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <select
              id="selectedService"
              name="selectedService"
              required
              value={form.selectedService}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="" disabled>Choisir un soin</option>
              {services.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-5">
          Date et heure souhaitées
        </legend>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="appointmentDate" className="block text-[13px] font-medium text-warm-800 mb-1.5">
              Date <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="appointmentDate"
              name="appointmentDate"
              type="date"
              required
              min={getTodayString()}
              value={form.appointmentDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="appointmentTime" className="block text-[13px] font-medium text-warm-800 mb-1.5">
              Créneau horaire <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <select
              id="appointmentTime"
              name="appointmentTime"
              required
              value={form.appointmentTime}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="" disabled>Choisir un horaire</option>
              {timeSlots.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className="block text-[13px] font-medium text-warm-800 mb-1.5">
          Message (optionnel)
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          placeholder="Précisez votre motif de consultation, vos disponibilités préférées ou toute information utile..."
          className={inputClass + ' resize-none'}
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
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
            'Envoyer la demande'
          )}
        </button>
        <p className="text-[12px] text-warm-500">
          Nous confirmons le rendez-vous par téléphone ou e-mail sous 24h.
        </p>
      </div>
    </form>
  );
}
