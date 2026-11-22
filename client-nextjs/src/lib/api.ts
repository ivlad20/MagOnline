// lib/api.ts
import { USE_MOCK, mockGet } from "@/lib/mock";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL && !USE_MOCK && typeof window === "undefined") {
  // Fails loudly at build/server time instead of silently fetching "undefined/..."
  console.warn(
    "NEXT_PUBLIC_API_URL nu este setat — request-urile către backend vor eșua."
  );
}

export async function apiFetch<T>(path: string, revalidateSeconds = 60): Promise<T | null> {
  if (USE_MOCK) return mockGet<T>(path);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: revalidateSeconds },
    });
    if (!res.ok) {
      console.error(`API ${path} → ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`API ${path} a eșuat:`, err);
    return null;
  }
}
