import { AppShell } from '@/components/app-shell/app-shell';

export function CheckInScreen() {
  return (
    <AppShell currentPath="/check-in" title="Check-in">
      <section className="rounded-[28px] border border-mint-line/70 bg-white/88 p-6 shadow-[0_18px_34px_rgba(109,181,120,0.08)]">
        <p className="text-sm leading-6 text-mint-ink/72">
          Daily adherence, streaks, and rewards will be attached after the
          foundation layer is complete.
        </p>
      </section>
    </AppShell>
  );
}
