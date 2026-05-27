'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-navy-700 mb-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-white" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.5 0-2.5 1-2.5 2.5v1.3C8 7.3 6.5 8.9 6.5 11c0 1.5.7 2.8 1.8 3.6L7 18h10l-1.3-3.4A4.5 4.5 0 0 0 17.5 11c0-2.1-1.5-3.7-3-4.2V5.5C14.5 4 13.5 3 12 3z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-semibold text-navy-800">Administration</h1>
          <p className="text-warm-500 text-sm mt-1">Cabinet Dr. Ayari — Hammam Lif</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-warm-200 rounded p-8 shadow-card">

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded bg-red-50 border border-red-200 px-3.5 py-3">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-warm-700 mb-1.5">
                Adresse e-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@cabinet-ayari.tn"
                  autoComplete="email"
                  required
                  className="w-full border border-warm-300 rounded py-2.5 pl-10 pr-4 text-sm text-warm-900 placeholder-warm-400 bg-white outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/10 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-warm-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full border border-warm-300 rounded py-2.5 pl-10 pr-10 text-sm text-warm-900 placeholder-warm-400 bg-white outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/10 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600 transition-colors"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember me + forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-warm-300 accent-navy-600"
                />
                <span className="text-sm text-warm-600">Se souvenir de moi</span>
              </label>
              <Link
                href="/admin/forgot-password"
                className="text-sm text-navy-600 hover:text-navy-800 transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-navy-700 hover:bg-navy-800 text-white text-sm font-medium py-2.5 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connexion en cours…
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[11px] text-warm-400">
          <Link href="/" className="hover:text-warm-600 transition-colors">← Retour au site public</Link>
        </p>

      </div>
    </div>
  );
}
