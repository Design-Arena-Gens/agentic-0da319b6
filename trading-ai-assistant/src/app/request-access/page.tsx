export default function RequestAccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="glass-panel neon-border w-full max-w-3xl rounded-3xl p-10">
        <h1 className="text-3xl font-semibold text-slate-100">Provision Access</h1>
        <p className="mt-4 text-sm text-slate-400">
          Submit a request to the compliance desk to provision a new operator account. All access is gated behind multi-factor controls and audited continuously.
        </p>
        <form className="mt-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="name">Full name</label>
            <input id="name" className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="email">Work email</label>
            <input id="email" type="email" className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="role">Role</label>
            <select id="role" className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40">
              <option value="">Select role</option>
              <option value="trader">Trader</option>
              <option value="risk">Risk Officer</option>
              <option value="compliance">Compliance</option>
              <option value="observer">Observer</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="notes">Justification</label>
            <textarea id="notes" rows={4} className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40" />
          </div>
          <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01]">
            Submit for review
          </button>
        </form>
      </section>
    </main>
  );
}
