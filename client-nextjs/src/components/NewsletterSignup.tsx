"use client";

import { useState, type FormEvent } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      // TODO: wire to a real endpoint, e.g. POST /api/newsletter
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-seal">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-5 px-4 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-white">
          <h2 className="font-display text-xl font-semibold sm:text-2xl">Fii primul care află de reduceri</h2>
          <p className="mt-1 text-sm text-white/75">
            Oferte exclusive și lansări noi, direct în inbox. Fără spam, promis.
          </p>
        </div>

        <div className="w-full lg:max-w-md">
          <form onSubmit={handleSubmit} className="flex overflow-hidden rounded-lg bg-white shadow-sm">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="adresa@email.com"
              className="w-full bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 bg-crimson px-6 text-sm font-semibold text-white transition-colors hover:bg-crimson-deep disabled:opacity-60"
            >
              {status === "loading" ? "Se trimite..." : "Mă abonez"}
            </button>
          </form>
          {status === "success" && <p className="mt-2 text-sm text-white">Te-ai abonat cu succes. Mulțumim!</p>}
          {status === "error" && <p className="mt-2 text-sm text-crimson-soft">A apărut o eroare. Încearcă din nou.</p>}
        </div>
      </div>
    </section>
  );
}
