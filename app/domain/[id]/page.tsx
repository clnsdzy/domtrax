"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Server, Globe } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getDomainById, deleteDomain, getDaysRemaining } from "@/lib/domains";
import type { Domain } from "@/lib/types";

export default function DomainDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [domain, setDomain] = useState<Domain | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    const data = getDomainById(id);
    if (!data) {
      router.replace("/dashboard");
      return;
    }
    setDomain(data);
  }, [params.id, router]);

  const handleDelete = () => {
    if (domain) {
      deleteDomain(domain.id);
      router.push("/dashboard");
    }
  };

  if (!domain) {
    return (
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar showAuth />
          <main className="flex-1 container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          </main>
        </div>
      </AuthProvider>
    );
  }

  const daysRemaining = getDaysRemaining(domain.expiryDate);

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar showAuth />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold">{domain.name}</h1>
                <Badge
                  variant={domain.status === "active" ? "success" : "danger"}
                  className="text-sm"
                >
                  {domain.status === "active" ? "Active" : "Expired"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" disabled>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Domain Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Domain Name</dt>
                      <dd className="mt-1 text-sm">{domain.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Registrar</dt>
                      <dd className="mt-1 text-sm">{domain.registrar}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Registration Date</dt>
                      <dd className="mt-1 text-sm">
                        {format(parseISO(domain.registeredDate), "MMMM d, yyyy")}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Expiry Date</dt>
                      <dd className="mt-1 text-sm">
                        {format(parseISO(domain.expiryDate), "MMMM d, yyyy")}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Days Remaining</dt>
                      <dd className="mt-1">
                        {daysRemaining < 0 ? (
                          <Badge variant="danger">Expired {Math.abs(daysRemaining)} days ago</Badge>
                        ) : daysRemaining <= 30 ? (
                          <Badge variant="warning">{daysRemaining} days</Badge>
                        ) : (
                          <Badge variant="success">{daysRemaining} days</Badge>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                      <dd className="mt-1">
                        <Badge variant={domain.status === "active" ? "success" : "danger"}>
                          {domain.status === "active" ? "Active" : "Expired"}
                        </Badge>
                      </dd>
                    </div>
                    {domain.notes && (
                      <div className="col-span-2">
                        <dt className="text-sm font-medium text-muted-foreground">Notes</dt>
                        <dd className="mt-1 text-sm">{domain.notes}</dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    WHOIS Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <dt className="text-sm font-medium text-muted-foreground">Registrar</dt>
                      <dd className="mt-1 text-sm">{domain.registrar}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-sm font-medium text-muted-foreground">Name Servers</dt>
                      <dd className="mt-1 space-y-1">
                        {domain.ns1 ? (
                          <>
                            <p className="text-sm font-mono text-muted-foreground">{domain.ns1}</p>
                            {domain.ns2 && (
                              <p className="text-sm font-mono text-muted-foreground">{domain.ns2}</p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not specified</p>
                        )}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-sm font-medium text-muted-foreground">DNS Status</dt>
                      <dd className="mt-1">
                        <Badge variant={domain.status === "active" ? "success" : "secondary"}>
                          {domain.status === "active" ? "OK" : "Inactive"}
                        </Badge>
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Domain</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>{domain.name}</strong>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthProvider>
  );
}
