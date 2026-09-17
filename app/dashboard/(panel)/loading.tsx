export default function DashboardLoading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Yuklanmoqda">
      <div className="mb-6 space-y-2">
        <div className="h-7 w-56 rounded-lg bg-dash-subtle" />
        <div className="h-4 w-80 max-w-full rounded bg-dash-subtle" />
      </div>
      <div className="rounded-xl border border-dash-border bg-dash-surface">
        <div className="flex justify-between gap-4 border-b border-dash-border p-4">
          <div className="h-9 w-64 rounded-lg bg-dash-subtle" />
          <div className="hidden h-9 w-60 rounded-lg bg-dash-subtle sm:block" />
        </div>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-dash-border px-4 py-4 last:border-0">
            <div className="h-4 flex-1 rounded bg-dash-subtle" />
            <div className="hidden h-4 w-24 rounded bg-dash-subtle md:block" />
            <div className="h-5 w-20 rounded-full bg-dash-subtle" />
          </div>
        ))}
      </div>
    </div>
  );
}
