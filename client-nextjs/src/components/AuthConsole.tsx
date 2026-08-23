"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin, signup } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

type Mode = "login" | "signup";


export default function AuthConsole() {
  const { login: setAuthUser } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const update =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);
  try {
    if (mode === "login") {
      const token = await apiLogin({ email: form.email, password: form.password });
      setAuthUser(token);
    } else {
      await signup(form);
      const token = await apiLogin({ email: form.email, password: form.password });
      setAuthUser(token);
    }
    router.push("/");
  } catch (err) {
    setError(err instanceof Error ? err.message : "A apărut o eroare.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-xl">
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-voltaic">
        {mode === "login" ? "> autentificare" : "> cont nou"}
      </p>
      <h2 className="mb-6 font-display text-2xl font-semibold">
        {mode === "login" ? "Bine ai revenit" : "Creează-ți contul"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === "signup" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="Prenume"
                value={form.name}
                onChange={update("name")}
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm placeholder-white/40 outline-none focus:border-voltaic"
              />
              <input
                required
                placeholder="Nume"
                value={form.surname}
                onChange={update("surname")}
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm placeholder-white/40 outline-none focus:border-voltaic"
              />
            </div>
            <input
              required
              placeholder="Nume utilizator"
              value={form.username}
              onChange={update("username")}
              className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm placeholder-white/40 outline-none focus:border-voltaic"
            />
            <input
              required
              type="tel"
              placeholder="Telefon"
              value={form.phone}
              onChange={update("phone")}
              className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm placeholder-white/40 outline-none focus:border-voltaic"
            />
          </>
        )}

        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={update("email")}
          className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm placeholder-white/40 outline-none focus:border-voltaic"
        />
        <input
          required
          type="password"
          placeholder="Parolă"
          value={form.password}
          onChange={update("password")}
          className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm placeholder-white/40 outline-none focus:border-voltaic"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-voltaic px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-voltaic/90 disabled:opacity-50"
        >
          {loading ? "Se procesează..." : mode === "login" ? "Autentificare" : "Creează cont"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setError(null);
          setMode(mode === "login" ? "signup" : "login");
        }}
        className="mt-5 w-full text-center text-xs text-white/60 hover:text-white"
      >
        {mode === "login" ? "Nu ai cont? Creează unul" : "Ai deja cont? Autentifică-te"}
      </button>
    </div>
  );
}