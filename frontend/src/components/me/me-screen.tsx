import { AppShell } from '@/components/app-shell/app-shell';

export function MeScreen() {
  return (
    <AppShell currentPath="/me" title="Me">
      <section className="grid gap-4">
        {[
          'Language and region preferences',
          'Notification and OCR confirmation preferences',
          'Privacy, permissions, and account controls',
        ].map((item) => (
          <div
            key={item}
            className="rounded-[24px] border border-mint-line/70 bg-white/88 p-5 text-sm leading-6 text-mint-ink/72 shadow-[0_14px_28px_rgba(109,181,120,0.08)]"
          >
            {item}
          </div>
        ))}
      </section>
    </AppShell>
  );
}
