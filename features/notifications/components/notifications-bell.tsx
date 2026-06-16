"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { PopoverContent, PopoverRoot, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRecentNotifications } from "../actions";
import { metaForEvent } from "../event-meta";
import type { Notification } from "../schemas";

function relativeTime(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  return `il y a ${Math.round(hours / 24)} j`;
}

export function NotificationsBell() {
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await getRecentNotifications();
        if (active) setItems(data);
      } catch {
        if (active) setItems((prev) => prev);
      }
    }
    void load();
    const timer = setInterval(() => void load(), 30000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const count = items.length;

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <IconButton variant="ghost" size="md" aria-label="Notifications" className="relative">
          <Bell />
          {count > 0 && (
            <span className="absolute right-0.5 top-0.5 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </IconButton>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border px-4 py-3 text-sm font-semibold">Notifications</div>
        <ScrollArea className="max-h-96">
          {count === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              Aucune activité récente.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((n) => {
                const meta = metaForEvent(n.type);
                return (
                  <li key={n.id}>
                    <Link
                      href="/postal"
                      className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50"
                    >
                      <meta.Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <span className="flex flex-col gap-0.5">
                        <span className="text-sm leading-tight">{meta.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {relativeTime(n.createdAt)} · #{n.orderId.slice(0, 8).toUpperCase()}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </PopoverRoot>
  );
}
