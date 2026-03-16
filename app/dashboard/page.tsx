"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Eye, Trash2, ArrowUpDown, Globe, AlertCircle, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getDomains, deleteDomain, getDaysRemaining, getDomainStats } from "@/lib/domains";
import type { Domain } from "@/lib/types";

type SortField = "name" | "registrar" | "expiryDate" | "daysRemaining" | "status";
type SortOrder = "asc" | "desc";

export default function DashboardPage() {
  const router = useRouter();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [stats, setStats] = useState({ total: 0, expiringSoon: 0, expired: 0 });
  const [sortField, setSortField] = useState<SortField>("expiryDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedDomains = [...domains].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "registrar":
        comparison = a.registrar.localeCompare(b.registrar);
        break;
      case "expiryDate":
        comparison = new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        break;
      case "daysRemaining":
        comparison = getDaysRemaining(a.expiryDate) - getDaysRemaining(b.expiryDate);
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

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

  const getDaysRemainingBadge = (expiryDate: string) => {
    const days = getDaysRemaining(expiryDate);
    if (days < 0) {
      return <Badge variant="danger">Expired</Badge>;
    }
    if (days <= 30) {
      return <Badge variant="warning">{days} days</Badge>;
    }
    return <Badge variant="success">{days} days</Badge>;
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => handleSort(field)}
      >
        {children}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );

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

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableHeader field="name">Domain Name</SortableHeader>
                      <SortableHeader field="registrar">Registrar</SortableHeader>
                      <TableHead>Registered</TableHead>
                      <TableHead>Expires</TableHead>
                      <SortableHeader field="daysRemaining">Days Remaining</SortableHeader>
                      <SortableHeader field="status">Status</SortableHeader>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedDomains.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          No domains found. Add your first domain to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedDomains.map((domain) => (
                        <TableRow key={domain.id}>
                          <TableCell className="font-medium">{domain.name}</TableCell>
                          <TableCell>{domain.registrar}</TableCell>
                          <TableCell>{format(parseISO(domain.registeredDate), "MMM d, yyyy")}</TableCell>
                          <TableCell>{format(parseISO(domain.expiryDate), "MMM d, yyyy")}</TableCell>
                          <TableCell>{getDaysRemainingBadge(domain.expiryDate)}</TableCell>
                          <TableCell>
                            <Badge variant={domain.status === "active" ? "success" : "danger"}>
                              {domain.status === "active" ? "Active" : "Expired"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/domain/${domain.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(domain)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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
