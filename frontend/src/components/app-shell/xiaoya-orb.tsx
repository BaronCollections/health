'use client';

export function XiaoyaOrb() {
  return (
    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/75 shadow-[0_16px_36px_rgba(109,181,120,0.22)] backdrop-blur">
      <div className="absolute inset-1 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.95),rgba(161,226,199,0.95)_42%,rgba(109,181,120,0.92)_70%,rgba(53,117,71,0.95)_100%)]" />
      <div className="absolute left-3 top-3 h-3 w-5 rounded-full bg-white/55 blur-sm" />
      <span className="relative text-[10px] font-semibold uppercase tracking-[0.28em] text-mint-ink">
        AI
      </span>
    </div>
  );
}
