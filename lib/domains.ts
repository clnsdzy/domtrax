"use client";

import type { Domain } from "./types";
import { differenceInDays, parseISO } from "date-fns";

const DOMAINS_KEY = "domtrax_domains";

const SEED_DOMAINS: Domain[] = [
  {
    id: "1",
    name: "example.com",
    registrar: "GoDaddy",
    registeredDate: "2022-03-15",
    expiryDate: "2025-03-15",
    ns1: "ns1.godaddy.com",
    ns2: "ns2.godaddy.com",
    notes: "Main company website",
    status: "active",
  },
  {
    id: "2",
    name: "myapp.io",
    registrar: "Namecheap",
    registeredDate: "2023-06-20",
    expiryDate: "2026-06-20",
    ns1: "dns1.namecheaphosting.com",
    ns2: "dns2.namecheaphosting.com",
    notes: "SaaS product domain",
    status: "active",
  },
  {
    id: "3",
    name: "oldproject.net",
    registrar: "Cloudflare",
    registeredDate: "2021-01-10",
    expiryDate: "2024-01-10",
    ns1: "ns1.cloudflare.com",
    ns2: "ns2.cloudflare.com",
    notes: "Legacy project - consider letting expire",
    status: "expired",
  },
  {
    id: "4",
    name: "startup.co",
    registrar: "Google Domains",
    registeredDate: "2024-09-01",
    expiryDate: "2026-04-01",
    ns1: "ns-cloud-a1.googledomains.com",
    ns2: "ns-cloud-a2.googledomains.com",
    notes: "New venture landing page",
    status: "active",
  },
  {
    id: "5",
    name: "portfolio.dev",
    registrar: "Porkbun",
    registeredDate: "2023-11-05",
    expiryDate: "2026-04-05",
    ns1: "maceio.porkbun.com",
    ns2: "salvador.porkbun.com",
    notes: "Personal portfolio site",
    status: "active",
  },
];

function initializeDomains(): void {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(DOMAINS_KEY);
  if (!stored) {
    localStorage.setItem(DOMAINS_KEY, JSON.stringify(SEED_DOMAINS));
  }
}

export function getDomains(): Domain[] {
  if (typeof window === "undefined") return [];
  initializeDomains();
  const stored = localStorage.getItem(DOMAINS_KEY);
  if (!stored) return [];
  try {
    const domains = JSON.parse(stored) as Domain[];
    return domains.map((d) => ({
      ...d,
      status: getDomainStatus(d.expiryDate),
    }));
  } catch {
    return [];
  }
}

export function getDomainById(id: string): Domain | null {
  const domains = getDomains();
  return domains.find((d) => d.id === id) || null;
}

export function addDomain(domain: Omit<Domain, "id" | "status">): Domain {
  const domains = getDomains();
  const newDomain: Domain = {
    ...domain,
    id: Date.now().toString(),
    status: getDomainStatus(domain.expiryDate),
  };
  domains.push(newDomain);
  localStorage.setItem(DOMAINS_KEY, JSON.stringify(domains));
  return newDomain;
}

export function updateDomain(id: string, updates: Partial<Omit<Domain, "id" | "status">>): Domain | null {
  const domains = getDomains();
  const index = domains.findIndex((d) => d.id === id);
  if (index === -1) return null;
  
  const updatedDomain: Domain = {
    ...domains[index],
    ...updates,
    status: getDomainStatus(updates.expiryDate || domains[index].expiryDate),
  };
  domains[index] = updatedDomain;
  localStorage.setItem(DOMAINS_KEY, JSON.stringify(domains));
  return updatedDomain;
}

export function deleteDomain(id: string): void {
  const domains = getDomains();
  const filtered = domains.filter((d) => d.id !== id);
  localStorage.setItem(DOMAINS_KEY, JSON.stringify(filtered));
}

export function getDomainStatus(expiryDate: string): "active" | "expired" {
  const today = new Date();
  const expiry = parseISO(expiryDate);
  return differenceInDays(expiry, today) < 0 ? "expired" : "active";
}

export function getDaysRemaining(expiryDate: string): number {
  const today = new Date();
  const expiry = parseISO(expiryDate);
  return differenceInDays(expiry, today);
}

export function getDomainStats(): { total: number; expiringSoon: number; expired: number } {
  const domains = getDomains();
  const total = domains.length;
  const expired = domains.filter((d) => d.status === "expired").length;
  const expiringSoon = domains.filter((d) => {
    const days = getDaysRemaining(d.expiryDate);
    return days >= 0 && days <= 30;
  }).length;
  return { total, expiringSoon, expired };
}
