"use client";

import type { User } from "./types";

const VALID_CREDENTIALS = {
  email: "admin@domtrax.com",
  password: "password123",
};

const AUTH_KEY = "domtrax_auth";

export function login(email: string, password: string): boolean {
  if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ email }));
    }
    return true;
  }
  return false;
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}
