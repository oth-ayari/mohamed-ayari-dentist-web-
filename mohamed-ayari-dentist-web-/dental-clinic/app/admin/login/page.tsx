'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Stethoscope, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminProvider';

export default function AdminLogin() {
  const { login, isAuthenticated, isLoading } = useAdmin();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/admin/dashboard');
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    const result = await login(email, password);
    if (result.success) {
      router.replace('/admin/dashboard');
    } else {
      setError(result.error ?? 'Identifiants invalides');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-32 -right-32 h-[600px] w-[600px] rounded-full bg-navy-500/30 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute left-1/2 top-1/4 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-gold-500/5 blur-3xl"
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md px-4"
      >
        <div className="rounded-2xl border border-navy-700/60 bg-navy-900/80 p-8 shadow-navy backdrop-blur-xl">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-700 shadow-cyan"
            >
              <Stethoscope className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="mt-4 text-center font-display text-2xl font-bold text-white">
              Cabinet Dr. Ayari
            </h1>
            <p className="mt-1 text-center text-sm text-navy-300">Espace Administration</p>
          </div>

          {/* Security badge */}
          <div className="mb-6 flex items-center justify-center gap-2 rounded-lg bg-cyan-500/10 px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-300">Connexion sécurisée · JWT · HTTPS</span>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-navy-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@cabinet-ayari.tn"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-navy-700 bg-navy-800 py-3 pl-10 pr-4 text-sm text-white placeholder-navy-500 outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-navy-300">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-navy-700 bg-navy-800 py-3 pl-10 pr-12 text-sm text-white placeholder-navy-500 outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-navy-600 bg-navy-800 accent-cyan-500"
                />
                <span className="text-sm text-navy-300">Se souvenir de moi</span>
              </label>
              <button type="button" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                Mot de passe oublié?
              </button>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 py-3 text-sm font-semibold text-white shadow-cyan transition-all hover:from-cyan-400 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connexion en cours...
                </span>
              ) : (
                'Se connecter'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-[11px] text-navy-500">
            Cabinet dentaire Dr Mohamed Ben Othman Ayari · Hammam Lif
          </p>
        </div>
      </motion.div>
    </div>
  );
}
