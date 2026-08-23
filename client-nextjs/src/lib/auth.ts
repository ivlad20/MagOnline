"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_KEY = "magonline_token";

export function saveToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  surname: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

export async function login(payload: LoginPayload): Promise<string> {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    // backend-ul întoarce un string simplu pe 401, nu JSON
    const message = await res.text();
    throw new Error(message || "Email sau parolă incorecte.");
  }

  const data: { token: string } = await res.json();
  saveToken(data.token);
  return data.token;
}

export async function signup(payload: SignupPayload): Promise<void> {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, address: null }),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Nu am putut crea contul. Verifică datele introduse.");
  }
}