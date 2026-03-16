"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addDomain } from "@/lib/domains";

export default function NewDomainPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const registrar = formData.get("registrar") as string;
    const registeredDate = formData.get("registeredDate") as string;
    const expiryDate = formData.get("expiryDate") as string;
    const ns1 = formData.get("ns1") as string;
    const ns2 = formData.get("ns2") as string;
    const notes = formData.get("notes") as string;

    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Domain name is required";
    }
    if (!registrar.trim()) {
      newErrors.registrar = "Registrar is required";
    }
    if (!registeredDate) {
      newErrors.registeredDate = "Registration date is required";
    }
    if (!expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    }
    if (registeredDate && expiryDate && new Date(registeredDate) >= new Date(expiryDate)) {
      newErrors.expiryDate = "Expiry date must be after registration date";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    addDomain({
      name: name.trim(),
      registrar: registrar.trim(),
      registeredDate,
      expiryDate,
      ns1: ns1.trim() || undefined,
      ns2: ns2.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    router.push("/dashboard");
  };

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar showAuth />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col gap-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Track a New Domain</CardTitle>
                <CardDescription>
                  Add a new domain to your tracking list. Fill in the details below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Domain Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="example.com"
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registrar">
                        Registrar <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="registrar"
                        name="registrar"
                        placeholder="GoDaddy, Namecheap, etc."
                        aria-invalid={!!errors.registrar}
                      />
                      {errors.registrar && (
                        <p className="text-sm text-red-500">{errors.registrar}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="registeredDate">
                        Registration Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="registeredDate"
                        name="registeredDate"
                        type="date"
                        aria-invalid={!!errors.registeredDate}
                      />
                      {errors.registeredDate && (
                        <p className="text-sm text-red-500">{errors.registeredDate}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">
                        Expiry Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        type="date"
                        aria-invalid={!!errors.expiryDate}
                      />
                      {errors.expiryDate && (
                        <p className="text-sm text-red-500">{errors.expiryDate}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ns1">Name Server 1</Label>
                      <Input
                        id="ns1"
                        name="ns1"
                        placeholder="ns1.example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ns2">Name Server 2</Label>
                      <Input
                        id="ns2"
                        name="ns2"
                        placeholder="ns2.example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Any additional notes about this domain..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Adding..." : "Add Domain"}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href="/dashboard">Cancel</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
