"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuthStore } from "@/lib/client/auth-store";
import { useAuthedFetch } from "@/lib/client/api";

type Account = {
  id: string;
  broker: string;
  accountNumber: string;
  environment: string;
  balanceSnapshots: Array<{
    id: string;
    balance: number;
    equity: number;
    timestamp: string;
  }>;
  positions: Array<{
    id: string;
    symbol: string;
    quantity: number;
    side: string;
    status: string;
    pnl: number | null;
  }>;
};

type Signal = {
  id: string;
  title: string;
  description: string;
  symbol: string;
  direction: string;
  confidence: number;
  riskReward: number;
  status: string;
  createdAt: string;
  metadata: Record<string, unknown>;
};

function UnauthorizedState() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-6 rounded-3xl bg-slate-900/80 p-12 text-center">
      <h2 className="text-2xl font-semibold text-slate-100">Session Required</h2>
      <p className="text-slate-500">
        You need to authenticate before accessing the operations console.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-sky-500/80 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:scale-105"
      >
        Return to access control
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const authedFetch = useAuthedFetch();

  useEffect(() => {
    if (token) {
      localStorage.setItem("aegis_token", token);
    }
  }, [token]);

  const accountsQuery = useQuery({
    queryKey: ["accounts", user?.id],
    enabled: Boolean(token),
    queryFn: async () => {
      return (await authedFetch("/api/accounts")) as { accounts: Account[] };
    },
  });

  const signalsQuery = useQuery({
    queryKey: ["signals", user?.id],
    enabled: Boolean(token),
    queryFn: async () => {
      return (await authedFetch("/api/signals")) as { signals: Signal[] };
    },
  });

  if (!user || !token) {
    return <UnauthorizedState />;
  }

  const accounts = accountsQuery.data?.accounts ?? [];
  const signals = signalsQuery.data?.signals ?? [];

  const activeSignals = signals.filter((signal) => signal.status === "ACTIVE" || signal.status === "PENDING");

  return (
    <main className="min-h-screen space-y-10 px-6 py-10">
      <header className="glass-panel neon-border flex flex-wrap items-center justify-between rounded-3xl px-8 py-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-sky-300/70">Operations Console</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-100">Institutional Command Center</h1>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Signed in as</p>
          <p className="text-lg font-semibold text-slate-100">{user.fullName}</p>
          <p className="text-xs text-slate-500">{user.email}</p>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="glass-panel rounded-3xl p-6">
          <p className="text-xs uppercase tracking-widest text-slate-500">Accounts</p>
          <p className="mt-3 text-3xl font-semibold text-slate-100">{accounts.length}</p>
          <p className="mt-2 text-sm text-slate-500">Active broker endpoints with risk controls.</p>
        </div>
        <div className="glass-panel rounded-3xl p-6">
          <p className="text-xs uppercase tracking-widest text-slate-500">Active Signals</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-300">{activeSignals.length}</p>
          <p className="mt-2 text-sm text-slate-500">Agentic trade plans with execution readiness.</p>
        </div>
        <div className="glass-panel rounded-3xl p-6">
          <p className="text-xs uppercase tracking-widest text-slate-500">Confidence</p>
          <p className="mt-3 text-3xl font-semibold text-sky-300">
            {activeSignals.length
              ? `${Math.round(
                  (activeSignals.reduce((acc, signal) => acc + signal.confidence, 0) / activeSignals.length) * 100,
                )}%`
              : "—"}
          </p>
          <p className="mt-2 text-sm text-slate-500">Weighted by risk-adjusted signal confidence.</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">Equity Curve</h2>
            <p className="text-xs text-slate-500">Last 30 sessions</p>
          </div>
          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={
                  accounts[0]?.balanceSnapshots.map((snapshot) => ({
                    time: new Date(snapshot.timestamp).toLocaleDateString(),
                    balance: snapshot.balance,
                  })) ?? []
                }
              >
                <CartesianGrid stroke="rgba(148,163,184,0.1)" strokeDasharray="5 5" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(148,163,184,0.2)",
                    borderRadius: 16,
                    color: "#e2e8f0",
                  }}
                />
                <Line type="monotone" dataKey="balance" stroke="#38bdf8" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">Position Risk</h2>
            <p className="text-xs text-slate-500">Intraday</p>
          </div>
          <div className="mt-6 space-y-4">
            {(accounts[0]?.positions ?? []).map((position) => (
              <div key={position.id} className="rounded-2xl border border-white/5 bg-slate-900/70 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{position.symbol}</p>
                    <p className="text-xs text-slate-500">{position.side}</p>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      (position.pnl ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {(position.pnl ?? 0).toFixed(2)} PnL
                  </p>
                </div>
              </div>
            ))}
            {accounts[0]?.positions?.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 p-6 text-center text-sm text-slate-500">
                No live positions. Agents ready for next execution window.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Agentic Signal Feed</h2>
          <p className="text-xs text-slate-500">Newest first</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {signals.map((signal) => (
            <article key={signal.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
              <p className="text-xs uppercase tracking-widest text-slate-500">{signal.symbol}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-100">{signal.title}</h3>
              <p className="mt-2 text-sm text-slate-400 line-clamp-3">{signal.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">{signal.direction}</span>
                <span className="text-sky-300">
                  {(signal.confidence * 100).toFixed(0)}% confidence
                </span>
              </div>
            </article>
          ))}
          {signals.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 p-8 text-center text-sm text-slate-500 md:col-span-2 lg:col-span-3">
              Once the ingestion gateway receives order flow snapshots, the decision engine will populate signals here.
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
