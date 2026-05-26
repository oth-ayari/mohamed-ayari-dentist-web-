'use client';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-navy-700" />
          <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-cyan-500" />
        </div>
        <p className="font-sans text-sm tracking-widest text-navy-200 uppercase">Chargement...</p>
      </div>
    </div>
  );
}
