"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUser, logout } from "@/lib/auth";

interface NavbarProps {
  showAuth?: boolean;
}

export function Navbar({ showAuth = false }: NavbarProps) {
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <Globe className="h-6 w-6" />
          <span className="text-lg font-bold">DomTrax</span>
        </Link>

        <div className="flex items-center gap-4">
          {showAuth && user ? (
            <>
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="ml-2">Logout</span>
              </Button>
            </>
          ) : !showAuth ? (
            <Button asChild variant="default" size="sm">
              <Link href="/login">Login</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
