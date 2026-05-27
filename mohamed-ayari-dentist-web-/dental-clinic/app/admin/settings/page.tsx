'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Check, AlertCircle, Shield, Stethoscope, ImageIcon, Upload, Key, Copy, RefreshCw, Info } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminProvider';

function Section({ title, icon: Icon, children }: {
  title: string; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-card dark:border-navy-700/50 dark:bg-navy-900">
      <div className="mb-5 flex items-center gap-3 border-b border-gray-100 dark:border-navy-700 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10">
          <Icon className="h-5 w-5 text-cyan-500" />
        </div>
        <h2 className="font-semibold text-navy-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Alert({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm ${
        type === 'success' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20' :
        'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20'
      }`}
    >
      {type === 'success' ? <Check className="h-4 w-4 flex-shrink-0" /> : <AlertCircle className="h-4 w-4 flex-shrink-0" />}
      {message}
    </motion.div>
  );
}

function ImageUploadCard({
  slot,
  label,
  description,
}: {
  slot: 'clinic-photo' | 'doctor-photo';
  label: string;
  description: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentUrl = `/${slot}.png?v=${Date.now()}`;

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setMsg(null);
  };

  const upload = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg(null);
    const form = new FormData();
    form.append('file', file);
    form.append('slot', slot);
    const res = await fetch('/api/admin/upload', { method: 'POST', credentials: 'include', body: form });
    const data = await res.json();
    if (data.success) {
      setMsg({ type: 'success', text: 'Image mise à jour !' });
      setPreview(null);
      if (inputRef.current) inputRef.current.value = '';
    } else {
      setMsg({ type: 'error', text: data.error ?? 'Erreur lors du téléchargement' });
    }
    setUploading(false);
  };

  return (
    <div className="rounded-2xl border border-gray-200/60 bg-white dark:border-navy-700/50 dark:bg-navy-800/50 overflow-hidden">
      <div className="relative h-40 bg-navy-100 dark:bg-navy-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview ?? currentUrl}
          alt={label}
          className="w-full h-full object-cover"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        {preview && (
          <span className="absolute top-2 right-2 text-[10px] font-semibold bg-amber-400 text-black px-2 py-0.5 rounded-full">
            Aperçu
          </span>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <p className="font-semibold text-sm text-navy-900 dark:text-white">{label}</p>
          <p className="text-xs text-gray-400 dark:text-navy-400 mt-0.5">{description}</p>
        </div>
        {msg && <Alert type={msg.type} message={msg.text} />}
        <div className="flex items-center gap-2">
          <label className="flex-1 flex items-center gap-2 cursor-pointer rounded-xl border border-dashed border-gray-300 dark:border-navy-600 px-3 py-2 text-xs text-gray-500 dark:text-navy-400 hover:border-cyan-400 hover:text-cyan-500 transition-colors">
            <ImageIcon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Choisir une image…</span>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={onFileChange}
            />
          </label>
          {preview && (
            <button
              onClick={upload}
              disabled={uploading}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-600 disabled:opacity-70 transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              {uploading ? '…' : 'Enregistrer'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RecoveryCodesSection() {
  const [unusedCount, setUnusedCount] = useState<number | null>(null);
  const [codes, setCodes] = useState<string[]>([]);
  const [confirmPw, setConfirmPw] = useState('');
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/recovery-codes', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setUnusedCount(data.data.unusedCount);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmPw) { setMsg({ type: 'error', text: 'Confirmez votre mot de passe actuel.' }); return; }
    setLoading(true); setMsg(null);
    try {
      const res = await fetch('/api/admin/recovery-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword: confirmPw }),
      });
      const data = await res.json();
      if (data.success) {
        setCodes(data.data.codes);
        setConfirmPw('');
        setUnusedCount(8);
        setMsg({ type: 'success', text: data.message });
      } else {
        setMsg({ type: 'error', text: data.error ?? 'Erreur lors de la génération.' });
      }
    } catch { setMsg({ type: 'error', text: 'Erreur réseau.' }); }
    finally { setLoading(false); }
  };

  const copyAll = () => {
    navigator.clipboard.writeText(codes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section title="Codes de récupération" icon={Key}>
      <div className="space-y-4">
        {/* Status */}
        <div className={`flex items-center gap-2.5 rounded-xl p-3.5 border text-sm ${
          unusedCount === 0
            ? 'bg-red-500/10 border-red-500/20 text-red-400'
            : unusedCount !== null && unusedCount <= 3
            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300'
        }`}>
          <Shield className="h-4 w-4 flex-shrink-0" />
          {unusedCount === null
            ? 'Chargement…'
            : unusedCount === 0
            ? 'Aucun code actif — générez-en maintenant !'
            : `${unusedCount} code(s) de récupération restant(s)`}
        </div>

        {/* How-to */}
        <div className="flex gap-2 rounded-xl border border-navy-700 bg-navy-800/50 p-3 text-xs text-navy-300">
          <Info className="h-4 w-4 flex-shrink-0 text-cyan-400 mt-0.5" />
          <p>
            Ces codes vous permettent de réinitialiser votre mot de passe si vous y avez accès perdu. Chaque code n&apos;est valide qu&apos;une seule fois.
            <strong className="text-white"> Imprimez-les et conservez-les dans un endroit sûr.</strong>
          </p>
        </div>

        {/* Generated codes display */}
        {codes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-green-500/20 bg-green-500/5 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                Sauvegardez ces codes — ils ne seront plus affichés
              </p>
              <button
                onClick={copyAll}
                className="flex items-center gap-1.5 rounded-lg bg-navy-700 px-2.5 py-1 text-xs text-white hover:bg-navy-600 transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {codes.map((code, i) => (
                <div key={i} className="rounded-lg border border-navy-600 bg-navy-800 px-3 py-2 font-mono text-sm text-white tracking-widest text-center">
                  {code}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {msg && (
          <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm border ${
            msg.type === 'success'
              ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20'
              : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20'
          }`}>
            {msg.type === 'success' ? <Check className="h-4 w-4 flex-shrink-0" /> : <AlertCircle className="h-4 w-4 flex-shrink-0" />}
            {msg.text}
          </div>
        )}

        {/* Generate form */}
        <form onSubmit={generate} className="space-y-3">
          <p className="text-xs font-medium text-gray-500 dark:text-navy-400">
            {codes.length > 0 ? 'Régénérer de nouveaux codes (invalidera les anciens) :' : 'Générer des codes de récupération :'}
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-navy-500" />
              <input
                type={showConfirmPw ? 'text' : 'password'}
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                placeholder="Mot de passe actuel"
                className="w-full rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 py-2.5 pl-9 pr-10 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-navy-900 dark:text-white"
              />
              <button type="button" onClick={() => setShowConfirmPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-navy-800 dark:bg-navy-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 dark:hover:bg-navy-600 disabled:opacity-70 transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? '…' : codes.length > 0 ? 'Régénérer' : 'Générer'}
            </button>
          </div>
        </form>
      </div>
    </Section>
  );
}

export default function SettingsPage() {
  const { admin, refreshAdmin } = useAdmin();

  // Profile form
  const [name, setName] = useState(admin?.name ?? '');
  const [email, setEmail] = useState(admin?.email ?? '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password form
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (admin) { setName(admin.name); setEmail(admin.email); }
  }, [admin]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    const res = await fetch('/api/admin/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json();
    if (data.success) {
      setProfileMsg({ type: 'success', text: 'Profil mis à jour avec succès !' });
      await refreshAdmin();
    } else {
      setProfileMsg({ type: 'error', text: data.error ?? 'Erreur lors de la mise à jour' });
    }
    setProfileLoading(false);
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);

    if (newPw !== confirmPw) {
      setPwMsg({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }
    if (newPw.length < 8) {
      setPwMsg({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
      return;
    }
    if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(newPw)) {
      setPwMsg({ type: 'error', text: 'Doit contenir une majuscule, minuscule, chiffre et caractère spécial' });
      return;
    }

    setPwLoading(true);
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
    });
    const data = await res.json();
    if (data.success) {
      setPwMsg({ type: 'success', text: 'Mot de passe changé avec succès !' });
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } else {
      setPwMsg({ type: 'error', text: data.error ?? 'Erreur lors du changement' });
    }
    setPwLoading(false);
  };

  const pwStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = pwStrength(newPw);
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['', 'Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];

  return (
    <div className="max-w-2xl space-y-6">
      {/* Admin info card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 rounded-2xl border border-gray-200/60 bg-gradient-to-r from-cyan-500/10 to-transparent p-5 dark:border-navy-700/50 dark:bg-navy-900"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-700 text-xl font-bold text-white shadow-cyan">
          {admin?.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-navy-900 dark:text-white">{admin?.name}</h3>
          <p className="text-sm text-gray-500 dark:text-navy-400">{admin?.email}</p>
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-500">
            <Shield className="h-2.5 w-2.5" />
            {admin?.role === 'SUPER_ADMIN' ? 'Super Administrateur' : 'Administrateur'}
          </span>
        </div>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Section title="Informations du profil" icon={User}>
          {profileMsg && <div className="mb-4"><Alert type={profileMsg.type} message={profileMsg.text} /></div>}
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-navy-400">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-navy-500" />
                  <input
                    value={name} onChange={e => setName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-navy-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-navy-400">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-navy-500" />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-navy-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit" disabled={profileLoading}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600 disabled:opacity-70 transition-colors"
            >
              {profileLoading ? 'Enregistrement...' : <><Check className="h-4 w-4" /> Enregistrer</>}
            </button>
          </form>
        </Section>
      </motion.div>

      {/* Password */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Section title="Changer le mot de passe" icon={Lock}>
          {pwMsg && <div className="mb-4"><Alert type={pwMsg.type} message={pwMsg.text} /></div>}
          <form onSubmit={changePassword} className="space-y-4">
            {/* Current password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-navy-400">Mot de passe actuel</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-navy-500" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 py-2.5 pl-9 pr-10 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-navy-900 dark:text-white"
                />
                <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-navy-400">Nouveau mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-navy-500" />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPw} onChange={e => setNewPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 py-2.5 pl-9 pr-10 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-navy-900 dark:text-white"
                />
                <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Strength indicator */}
              {newPw && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? strengthColors[strength] : 'bg-gray-200 dark:bg-navy-700'}`} />
                    ))}
                  </div>
                  <p className={`mt-1 text-xs ${strength >= 4 ? 'text-green-500' : strength >= 3 ? 'text-amber-500' : 'text-red-400'}`}>
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-navy-400">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-navy-500" />
                <input
                  type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 bg-white dark:bg-navy-800 text-navy-900 dark:text-white transition-colors ${
                    confirmPw && confirmPw !== newPw
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                      : confirmPw && confirmPw === newPw
                      ? 'border-green-400 focus:border-green-400 focus:ring-green-400/20'
                      : 'border-gray-200 dark:border-navy-700 focus:border-cyan-400 focus:ring-cyan-400/20'
                  }`}
                />
                {confirmPw && confirmPw === newPw && (
                  <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400" />
                )}
              </div>
            </div>

            {/* Rules */}
            <div className="rounded-xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700 p-3">
              <p className="mb-2 text-xs font-medium text-gray-500 dark:text-navy-400">Le mot de passe doit contenir :</p>
              <ul className="space-y-1">
                {[
                  { label: 'Au moins 8 caractères', test: newPw.length >= 8 },
                  { label: 'Une lettre majuscule', test: /[A-Z]/.test(newPw) },
                  { label: 'Une lettre minuscule', test: /[a-z]/.test(newPw) },
                  { label: 'Un chiffre', test: /\d/.test(newPw) },
                  { label: 'Un caractère spécial', test: /[^A-Za-z0-9]/.test(newPw) },
                ].map(rule => (
                  <li key={rule.label} className={`flex items-center gap-1.5 text-xs transition-colors ${rule.test ? 'text-green-500' : 'text-gray-400 dark:text-navy-500'}`}>
                    <Check className={`h-3 w-3 ${rule.test ? 'opacity-100' : 'opacity-30'}`} />
                    {rule.label}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="submit" disabled={pwLoading}
              className="flex items-center gap-2 rounded-xl bg-navy-800 dark:bg-navy-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 dark:hover:bg-navy-600 disabled:opacity-70 transition-colors"
            >
              {pwLoading ? 'Changement en cours...' : <><Shield className="h-4 w-4" /> Changer le mot de passe</>}
            </button>
          </form>
        </Section>
      </motion.div>

      {/* Site images */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Section title="Photos du site" icon={ImageIcon}>
          <p className="mb-4 text-sm text-gray-500 dark:text-navy-400">
            Choisissez une image depuis votre appareil pour mettre à jour les photos affichées sur le site.
            Formats acceptés : JPG, PNG, WebP — max 5 Mo.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUploadCard
              slot="clinic-photo"
              label="Photo du cabinet"
              description="Affichée dans la section d'accueil (carte flottante)"
            />
            <ImageUploadCard
              slot="doctor-photo"
              label="Photo du médecin"
              description="Affichée dans la section « À propos »"
            />
          </div>
        </Section>
      </motion.div>

      {/* Recovery codes */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
        <RecoveryCodesSection />
      </motion.div>

      {/* System info */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Section title="Informations système" icon={Stethoscope}>
          <dl className="space-y-3 text-sm">
            {[
              { label: 'Cabinet', value: 'Dr Mohamed Ben Othman Ayari — Orthodontie' },
              { label: 'Adresse', value: 'Hammam Lif, Ben Arous, Tunisie' },
              { label: 'Version', value: '1.0.0' },
              { label: 'Framework', value: 'Next.js 15 · Prisma · MySQL' },
            ].map(item => (
              <div key={item.label} className="flex justify-between border-b border-gray-50 dark:border-navy-800 pb-3 last:border-0 last:pb-0">
                <dt className="text-gray-500 dark:text-navy-400">{item.label}</dt>
                <dd className="text-right font-medium text-navy-900 dark:text-white">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </motion.div>
    </div>
  );
}
