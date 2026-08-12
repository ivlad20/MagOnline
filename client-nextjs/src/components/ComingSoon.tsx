import Link from "next/link";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <Navbar />
      <main className="mx-auto flex min-h-[50vh] w-full max-w-[1400px] flex-col items-start justify-center gap-3 px-4 py-16 sm:px-8">
        <span
          className="flex h-10 w-10 items-center justify-center bg-ember text-paper font-display text-sm font-bold"
          style={{ clipPath: "polygon(0% 50%, 14% 0%, 100% 0%, 100% 100%, 14% 100%)" }}
        >
          !
        </span>
        <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
        <p className="max-w-md text-sm text-ink-soft">{description}</p>
        <Link href="/" className="mt-2 text-sm font-medium text-voltaic hover:underline">
          ← Înapoi la pagina principală
        </Link>
      </main>
      <Footer />
    </div>
  );
}
