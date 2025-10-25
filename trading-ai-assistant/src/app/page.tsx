import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <section className="glass-panel neon-border w-full max-w-5xl rounded-3xl p-12 shadow-2xl">
        <div className="flex flex-col space-y-12 lg:flex-row lg:space-x-16 lg:space-y-0">
          <div className="max-w-lg space-y-6">
            <div>
              <span className="rounded-full bg-sky-500/10 px-4 py-1 text-sm font-medium text-sky-300">
                Aegis Trade Intelligence
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-slate-100 lg:text-5xl">
              Secure, agentic trade intelligence for institutional desks.
            </h1>
            <p className="text-lg leading-relaxed text-slate-400">
              Route multi-channel order flow, orchestrate AI decision agents, and monitor risk across every account from a single command center designed for mission-critical trading operations.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <p className="text-sm uppercase tracking-widest text-slate-500">Latency</p>
                <p className="mt-1 text-2xl font-semibold text-sky-300">&lt; 250ms</p>
                <p className="mt-2 text-xs text-slate-500">Edge inference with adaptive caching</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <p className="text-sm uppercase tracking-widest text-slate-500">Accounts</p>
                <p className="mt-1 text-2xl font-semibold text-emerald-300">100+</p>
                <p className="mt-2 text-xs text-slate-500">Broker-agnostic execution fabric</p>
              </div>
            </div>
          </div>
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-100">Access Control Center</h2>
            <p className="mt-2 text-sm text-slate-500">
              Authenticate with your issued credentials to synchronize agent memory and execution endpoints.
            </p>
            <LoginForm />
            <p className="mt-6 text-xs text-slate-500">
              Need an operator account?{" "}
              <Link href="/request-access" className="text-sky-300 hover:text-sky-200">
                Request provisioning
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
