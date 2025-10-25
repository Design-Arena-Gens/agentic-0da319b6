"use client";

import { useState, useTransition } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/client/auth-store";

type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
};

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const details = await response.json();
        throw new Error(details.error ?? "Unable to authenticate");
      }

      return (await response.json()) as LoginResponse;
    },
    onSuccess: (data) => {
      setError(null);
      setAuth(data.token, data.user);
      localStorage.setItem("aegis_token", data.token);
      localStorage.setItem("aegis_user", JSON.stringify(data.user));
      startTransition(() => {
        router.push("/dashboard");
      });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Unexpected error");
    },
  });

  return (
    <form
      className="mt-8 space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate();
      }}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300" htmlFor="email">
          Work Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@desk.example"
          className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-300" htmlFor="password">
            Passphrase
          </label>
          <button
            type="button"
            className="text-xs text-sky-300 hover:text-sky-100"
          >
            Forgot?
          </button>
        </div>
        <input
          id="password"
          type="password"
          placeholder="••••••••••••"
          className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>
      {error ? (
        <p className="text-sm text-rose-400">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={mutation.isPending || isPending}
        className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending || isPending ? "Establishing Secure Session..." : "Establish Secure Session"}
      </button>
    </form>
  );
}
