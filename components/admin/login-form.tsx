"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

type Props = {
  nextPath?: `/${string}`;
  onSuccess?: () => void;
};

export function LoginForm({ nextPath = "/admin", onSuccess }: Props) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(nextPath as never);
        router.refresh();
      }
    } catch {
      setError("That login didn’t work. Check your environment credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.26em] text-white/40">Username</label>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25"
          placeholder="admin"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.26em] text-white/40">Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25"
          placeholder="••••••••"
        />
      </div>

      {error ? <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-white px-4 py-3 font-medium text-zinc-900 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Signing in..." : "Enter dashboard"}
      </button>
    </form>
  );
}
