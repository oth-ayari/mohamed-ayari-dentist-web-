'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Phone, Mail, MessageSquare, CheckCircle2, Loader2, ChevronDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { BookingFormData } from '@/types';

const easing = [0.22, 1, 0.36, 1];

const services = [
  'Dentisterie restauratrice',
  'Prévention & Nettoyage',
  'Blanchiment dentaire',
  'Orthodontie',
  'Solutions prothétiques',
  'Chirurgie dentaire',
  'Urgence dentaire',
  'Consultation générale',
];

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
];

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [formState, setFormState] = useState<FormState>('idle');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>();

  const onSubmit = async (data: BookingFormData) => {
    setFormState('loading');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          selectedService: data.service,
          // On envoie la date au format simple YYYY-MM-DD
          appointmentDate: new Date(data.date).toISOString(),
          appointmentTime: data.time,
          message: data.message || '',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // On affiche l'erreur précise venant du serveur (ex: "Créneau invalide")
        const errorMsg = result.details
          ? Object.values(result.details).flat().join(', ')
          : result.error;

        alert(`Erreur : ${errorMsg || 'Données invalides'}`);
        setFormState('idle');
        return;
      }

      setFormState('success');
      setTimeout(() => {
        setFormState('idle');
        reset();
        onClose();
      }, 3000);

    } catch (error) {
      alert("Impossible de contacter le serveur. Vérifiez votre connexion.");
      setFormState('idle');
    }
  };

  const handleClose = () => {
    if (formState === 'loading') return;
    setFormState('idle');
    reset();
    onClose();
  };

  const inputClass = (hasError: boolean) => `
    w-full px-4 py-3.5 rounded-xl text-navy-900 text-sm font-medium
    border ${hasError ? 'border-red-300 bg-red-50' : 'border-navy-200 bg-white'}
    focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-red-200 focus:border-red-400' : 'focus:ring-cyan-100 focus:border-cyan-400'}
    placeholder:text-navy-400 placeholder:font-normal
    transition-all duration-200
  `;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-navy-950/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.4, ease: easing }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl pointer-events-auto scrollbar-hide"
              style={{
                background: 'white',
                boxShadow: '0 40px 80px rgba(4,17,31,0.3), 0 16px 32px rgba(4,17,31,0.15)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="sticky top-0 z-10 flex items-center justify-between px-7 py-5 rounded-t-3xl"
                style={{
                  background: 'linear-gradient(135deg, #071929 0%, #0B2235 100%)',
                  borderBottom: '1px solid rgba(6,182,212,0.15)',
                }}
              >
                <div>
                  <h2 className="text-white font-display font-bold text-xl">Prendre Rendez-vous</h2>
                  <p className="text-white/50 text-xs mt-0.5">Cabinet Dr Ayari · Hammam Lif</p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={formState === 'loading'}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Success State */}
              <AnimatePresence mode="wait">
                {formState === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 px-7 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 12 }}
                      className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
                      style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(6,182,212,0.05))', border: '1px solid rgba(6,182,212,0.3)' }}
                    >
                      <CheckCircle2 className="w-10 h-10 text-cyan-500" />
                    </motion.div>
                    <h3 className="text-navy-900 font-display font-bold text-2xl mb-3">
                      Demande envoyée !
                    </h3>
                    <p className="text-navy-500 text-sm leading-relaxed max-w-xs">
                      Nous vous contacterons dans les plus brefs délais pour confirmer votre rendez-vous au cabinet.
                    </p>
                    <p className="text-cyan-600 font-semibold text-sm mt-4">
                      +216 98 302 743
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-7 space-y-5"
                  >
                    {/* Name Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-navy-700 text-xs font-semibold mb-1.5 tracking-wide uppercase">
                          Prénom *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                          <input
                            {...register('firstName', { required: 'Requis' })}
                            placeholder="Mohamed"
                            className={`${inputClass(!!errors.firstName)} pl-10`}
                          />
                        </div>
                        {errors.firstName && (
                          <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-navy-700 text-xs font-semibold mb-1.5 tracking-wide uppercase">
                          Nom *
                        </label>
                        <input
                          {...register('lastName', { required: 'Requis' })}
                          placeholder="Ben Ali"
                          className={inputClass(!!errors.lastName)}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-navy-700 text-xs font-semibold mb-1.5 tracking-wide uppercase">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                        <input
                          {...register('email', {
                            required: 'Email requis',
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' },
                          })}
                          type="email"
                          placeholder="votre@email.com"
                          className={`${inputClass(!!errors.email)} pl-10`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-navy-700 text-xs font-semibold mb-1.5 tracking-wide uppercase">
                        Téléphone *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                        <input
                          {...register('phone', {
                            required: 'Téléphone requis',
                            pattern: { value: /^[\d\s+()-]{8,}$/, message: 'Numéro invalide' },
                          })}
                          type="tel"
                          placeholder="+216 xx xxx xxx"
                          className={`${inputClass(!!errors.phone)} pl-10`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Service */}
                    <div>
                      <label className="block text-navy-700 text-xs font-semibold mb-1.5 tracking-wide uppercase">
                        Service souhaité *
                      </label>
                      <div className="relative">
                        <select
                          {...register('service', { required: 'Veuillez choisir un service' })}
                          className={`${inputClass(!!errors.service)} appearance-none cursor-pointer`}
                        >
                          <option value="">Choisir un service...</option>
                          {services.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
                      </div>
                      {errors.service && (
                        <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>
                      )}
                    </div>

                    {/* Date + Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-navy-700 text-xs font-semibold mb-1.5 tracking-wide uppercase">
                          Date souhaitée *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                          <input
                            {...register('date', { required: 'Requis' })}
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            className={`${inputClass(!!errors.date)} pl-10`}
                          />
                        </div>
                        {errors.date && (
                          <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-navy-700 text-xs font-semibold mb-1.5 tracking-wide uppercase">
                          Heure *
                        </label>
                        <div className="relative">
                          <select
                            {...register('time', { required: 'Requis' })}
                            className={`${inputClass(!!errors.time)} appearance-none cursor-pointer`}
                          >
                            <option value="">Choisir...</option>
                            {timeSlots.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
                        </div>
                        {errors.time && (
                          <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-navy-700 text-xs font-semibold mb-1.5 tracking-wide uppercase">
                        Message (optionnel)
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-navy-400" />
                        <textarea
                          {...register('message')}
                          rows={3}
                          placeholder="Décrivez votre situation ou précisez votre demande..."
                          className={`${inputClass(false)} pl-10 resize-none`}
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <motion.button
                      whileHover={{ scale: formState === 'loading' ? 1 : 1.01 }}
                      whileTap={{ scale: formState === 'loading' ? 1 : 0.98 }}
                      type="submit"
                      disabled={formState === 'loading'}
                      className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-semibold text-base transition-all duration-300 disabled:opacity-70"
                      style={{
                        background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                        boxShadow: '0 8px 24px rgba(6,182,212,0.35)',
                      }}
                    >
                      {formState === 'loading' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Calendar className="w-5 h-5" />
                          Confirmer le Rendez-vous
                        </>
                      )}
                    </motion.button>

                    <p className="text-center text-navy-400 text-xs">
                      En soumettant ce formulaire, vous acceptez d&apos;être contacté par le cabinet pour confirmer votre rendez-vous.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
