"use client";

import Link from "next/link";
import { Globe, CalendarClock, FileText, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDaysRemaining } from "@/lib/domains";
import type { Domain } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DomainCardProps {
  domain: Domain;
  onDelete: (domain: Domain) => void;
}

export function DomainCard({ domain, onDelete }: DomainCardProps) {
  const days = getDaysRemaining(domain.expiryDate);

  const statusBadge =
    days < 0 ? (
      <Badge variant="danger">Expired</Badge>
    ) : days <= 30 ? (
      <Badge variant="warning">{days}d left</Badge>
    ) : (
      <Badge variant="success">{days}d left</Badge>
    );

  return (
    <div className="group relative rounded-lg border border-border bg-card overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      {/* Card body */}
      <Link href={`/domain/${domain.id}`} className="block px-4 pt-4 pb-1 focus:outline-none">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="text-sm font-semibold truncate text-foreground">{domain.name}</span>
          </div>
          {statusBadge}
        </div>

        <div className={cn(
          "flex items-center gap-1.5 mt-2 text-xs",
          days < 0 ? "text-destructive" : days <= 30 ? "text-amber-500" : "text-muted-foreground"
        )}>
          <CalendarClock className="h-3.5 w-3.5 shrink-0" />
          <span>
            {days < 0
              ? "Expired"
              : `Expires in ${days} day${days === 1 ? "" : "s"}`}
          </span>
        </div>

        {domain.notes && (
          <div className="flex items-start gap-1.5 mt-1.5 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5 shrink-0 mt-px" />
            <span className="line-clamp-2">{domain.notes}</span>
          </div>
        )}
      </Link>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 mt-1 border-t border-border">
        <span className="text-xs text-muted-foreground truncate">{domain.registrar}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.preventDefault();
            onDelete(domain);
          }}
          aria-label={`Delete ${domain.name}`}
        >
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
