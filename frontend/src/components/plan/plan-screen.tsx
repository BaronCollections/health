import { AppShell } from '@/components/app-shell/app-shell';

export function PlanScreen() {
  return (
    <AppShell currentPath="/plan" title="Plan">
      <section className="rounded-[28px] border border-mint-line/70 bg-white/88 p-6 shadow-[0_18px_34px_rgba(109,181,120,0.08)]">
        <p className="text-sm leading-6 text-mint-ink/72">
          Recommendation, report, and saved-plan experiences will live here in
          Milestone 2.
        </p>
      </section>
    </AppShell>
  );
}
