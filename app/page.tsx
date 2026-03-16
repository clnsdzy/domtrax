import Link from "next/link";
import { Globe, Clock, Activity, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Globe className="h-6 w-6" />
            <span className="text-lg font-bold">DomTrax</span>
          </Link>
          <Button asChild variant="default" size="sm">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center gap-6 px-4 py-24 text-center md:py-32">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Your Domains. Always in Check.
          </h1>
          <p className="max-w-[600px] text-balance text-lg text-muted-foreground md:text-xl">
            Never miss a domain expiration again. Track, monitor, and manage all your domains in one centralized dashboard.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link href="/login">Get Started</Link>
          </Button>
        </section>

        <section className="container mx-auto px-4 pb-24">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">Track Expiry</CardTitle>
                <CardDescription>
                  Monitor expiration dates and get notified before your domains expire.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Keep track of registration and expiry dates with clear visual indicators showing days remaining.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Activity className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">Status Monitoring</CardTitle>
                <CardDescription>
                  Instantly see which domains are active, expiring soon, or expired.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Color-coded status badges make it easy to identify domains that need attention at a glance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <LayoutDashboard className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">Centralised View</CardTitle>
                <CardDescription>
                  All your domains from different registrars in one place.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No more logging into multiple registrar accounts. Manage everything from a single dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>DomTrax &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
