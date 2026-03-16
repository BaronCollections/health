type WeComCallbackRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function resolveValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? ""
  }

  return value ?? ""
}

export default async function WeComCallbackRoute({ searchParams }: WeComCallbackRouteProps) {
  const params = searchParams ? await searchParams : {}
  const code = resolveValue(params.code)
  const state = resolveValue(params.state)

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col bg-[linear-gradient(180deg,#F3FAF3_0%,#FFFFFF_40%,#F8FBF8_100%)] px-4 py-16">
      <section className="rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-[0_24px_60px_rgba(109,181,120,0.14)]">
        <div className="inline-flex items-center rounded-full bg-[#EFF8F0] px-3 py-1 text-xs font-semibold text-primary">
          WeCom callback
        </div>
        <h1 className="mt-4 text-[28px] font-semibold leading-9 text-foreground">Phase 2 placeholder</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This route is reserved for Enterprise WeCom authentication handoff. The production SDK flow is deferred to Phase 2.
        </p>

        <div className="mt-5 space-y-3">
          <div className="rounded-[22px] bg-[#F7FAF7] px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground">code</p>
            <p className="mt-2 break-all text-sm font-semibold text-foreground">{code || "not provided"}</p>
          </div>
          <div className="rounded-[22px] bg-[#F7FAF7] px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground">state</p>
            <p className="mt-2 break-all text-sm font-semibold text-foreground">{state || "not provided"}</p>
          </div>
        </div>
      </section>
    </main>
  )
}
