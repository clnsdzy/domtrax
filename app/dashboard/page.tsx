"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Globe, AlertCircle, Clock } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DomainCard } from "@/components/domain-card";
import { getDomains, deleteDomain, getDomainStats } from "@/lib/domains";
import type { Domain } from "@/lib/types";

export default function DashboardPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [stats, setStats] = useState({ total: 0, expiringSoon: 0, expired: 0 });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState<Domain | null>(null);

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = () => {
    const data = getDomains();
    setDomains(data);
    setStats(getDomainStats());
  };

  const handleDeleteClick = (domain: Domain) => {
    setDomainToDelete(domain);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (domainToDelete) {
      deleteDomain(domainToDelete.id);
      loadDomains();
      setDeleteDialogOpen(false);
      setDomainToDelete(null);
    }
  };

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar showAuth />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-3xl font-bold">My Domains</h1>
              <Button asChild>
                <Link href="/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Domain
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                  <Clock className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-500">{stats.expiringSoon}</div>
                  <p className="text-xs text-muted-foreground">Within 30 days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expired</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{stats.expired}</div>
                </CardContent>
              </Card>
            </div>

            {/* Domain cards grid */}
            {domains.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-24 text-center text-muted-foreground gap-3">
                <Globe className="h-10 w-10 opacity-30" />
                <p className="text-sm">No domains yet. Add your first domain to get started.</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Domain
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {domains.map((domain) => (
                  <DomainCard
                    key={domain.id}
                    domain={domain}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Domain</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>{domainToDelete?.name}</strong>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthProvider>
  );
}
