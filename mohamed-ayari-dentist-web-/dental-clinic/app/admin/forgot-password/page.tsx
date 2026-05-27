'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Lock,
  Mail,
  Key,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';
import Link from 'next/link';

type Step = 'verify' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('verify');

  const [email, setEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pwStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[a-z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const strength = pwStrength(newPassword);
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-400', 'bg-green-500'];
  const strengthLabels = ['', 'Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (strength < 4) {
      setError('Mot de passe trop faible. Respectez toutes les règles ci-dessous.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, recoveryCode, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('success');
      } else {
        setError(data.error ?? 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch {
      setError('Erreur réseau. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950 p-4">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.10, 0.18, 0.10] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-32 -right-32 h-[550px] w-[550px] rounded-full bg-navy-500/30 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl border border-navy-700/60 bg-navy-900/80 p-8 shadow-2xl backdrop-blur-xl">

          <AnimatePresence mode="wait">
            {step === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center gap-4 py-4"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                  <CheckCircle className="h-9 w-9 text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Mot de passe réinitialisé</h2>
                <p className="text-sm text-navy-300">
                  Votre mot de passe a été mis à jour avec succès. Toutes vos sessions actives ont été invalidées.
                </p>
                <button
                  onClick={() => router.push('/admin/login')}
                  className="mt-2 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 py-3 text-sm font-semibold text-white hover:from-cyan-400 hover:to-cyan-500 transition-all"
                >
                  Se connecter
                </button>
              </motion.div>
            ) : (
              <motion.div key="verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Header */}
                <div className="mb-6 flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-700 shadow-lg mb-4">
                    <Key className="h-7 w-7 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-white">Récupération du compte</h1>
                  <p className="mt-1 text-sm text-navy-300">
                    Utilisez un code de récupération pour réinitialiser votre mot de passe
                  </p>
                </div>

                {/* Info box */}
                <div className="mb-5 flex gap-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3.5">
                  <Info className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-cyan-300 leading-relaxed">
                    Les codes de récupération sont générés depuis{' '}
                    <strong>Paramètres → Sécurité</strong>. Chaque code ne peut être utilisé qu&apos;une seule fois.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
                    <p className="text-sm text-red-400">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-navy-300">
                      Email administrateur
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="admin@cabinet-ayari.tn"
                        required
                        className="w-full rounded-xl border border-navy-700 bg-navy-800 py-3 pl-10 pr-4 text-sm text-white placeholder-navy-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>

                  {/* Recovery code */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-navy-300">
                      Code de récupération
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
                      <input
                        type="text"
                        value={recoveryCode}
                        onChange={e => setRecoveryCode(e.target.value.toUpperCase())}
                        placeholder="XXXX-XXXX"
                        required
                        maxLength={9}
                        autoComplete="off"
                        className="w-full rounded-xl border border-navy-700 bg-navy-800 py-3 pl-10 pr-4 font-mono text-sm tracking-widest text-white placeholder-navy-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>

                  {/* New password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-navy-300">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
                      <input
                        type={showPw ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full rounded-xl border border-navy-700 bg-navy-800 py-3 pl-10 pr-10 text-sm text-white placeholder-navy-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-white transition-colors"
                      >
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {newPassword && (
                      <div className="mt-1.5">
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                i < strength ? strengthColors[strength] : 'bg-navy-700'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`mt-1 text-xs ${strength >= 4 ? 'text-green-400' : strength >= 3 ? 'text-amber-400' : 'text-red-400'}`}>
                          {strengthLabels[strength]}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-navy-300">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-white placeholder-navy-500 outline-none bg-navy-800 focus:ring-2 transition-colors ${
                          confirmPassword && confirmPassword !== newPassword
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                            : confirmPassword && confirmPassword === newPassword
                            ? 'border-green-400 focus:border-green-400 focus:ring-green-400/20'
                            : 'border-navy-700 focus:border-cyan-500 focus:ring-cyan-500/20'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Password rules */}
                  <div className="rounded-xl border border-navy-700 bg-navy-800/50 p-3">
                    <p className="mb-2 text-xs font-medium text-navy-400">Le mot de passe doit contenir :</p>
                    <ul className="grid grid-cols-2 gap-1">
                      {[
                        { label: '8+ caractères', test: newPassword.length >= 8 },
                        { label: 'Majuscule (A-Z)', test: /[A-Z]/.test(newPassword) },
                        { label: 'Minuscule (a-z)', test: /[a-z]/.test(newPassword) },
                        { label: 'Chiffre (0-9)', test: /\d/.test(newPassword) },
                        { label: 'Caractère spécial', test: /[^A-Za-z0-9]/.test(newPassword) },
                      ].map(rule => (
                        <li key={rule.label} className={`flex items-center gap-1 text-xs ${rule.test ? 'text-green-400' : 'text-navy-500'}`}>
                          <span className={`text-[10px] ${rule.test ? 'opacity-100' : 'opacity-40'}`}>✓</span>
                          {rule.label}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 py-3 text-sm font-semibold text-white hover:from-cyan-400 hover:to-cyan-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Réinitialisation…
                      </span>
                    ) : (
                      'Réinitialiser le mot de passe'
                    )}
                  </button>
                </form>

                <div className="mt-5 text-center">
                  <Link
                    href="/admin/login"
                    className="inline-flex items-center gap-1.5 text-sm text-navy-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Retour à la connexion
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
