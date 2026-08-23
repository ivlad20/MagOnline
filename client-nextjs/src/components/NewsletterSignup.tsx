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
      // TODO: leagă de endpoint-ul real, ex. POST /api/newsletter
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="relative bg-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 lg:px-8">
        <span className="text-base font-bold uppercase tracking-wider text-voltaic sm:text-lg">
          Newsletter
        </span>
        <h2 className="font-display text-2xl font-semibold text-gray-900 sm:text-3xl">
          Fii primul care află de reduceri
        </h2>
        <p className="max-w-md text-sm text-gray-500">
          Prețuri bune, lansări noi și oferte exclusive, direct în inbox. Fără spam, promis.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-2 shadow-sm sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="adresa@email.com"
            className="w-full rounded-full bg-transparent px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 rounded-full bg-voltaic px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-voltaic/90 disabled:opacity-60"
          >
            {status === "loading" ? "Se trimite..." : "Mă abonez"}
          </button>
        </form>

        {status === "success" && (
          <p className="text-sm text-emerald-600">Te-ai abonat cu succes. Mulțumim!</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-600">A apărut o eroare. Încearcă din nou.</p>
        )}
      </div>
    </section>
  );
}