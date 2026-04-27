"use client";

import { Calendar, CheckCircle2, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { disconnectGoogleCalendar } from "./actions";

export function GoogleCalendarConnectCard({
  userId,
  connected,
}: {
  userId: string;
  connected: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function onDisconnect() {
    startTransition(async () => {
      await disconnectGoogleCalendar(userId);
    });
  }

  return (
    <div className="flex items-center gap-4 rounded-[10px] border border-border bg-card p-5 shadow-xs">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-muted text-muted-foreground">
        <Calendar className="size-5" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-[15px] font-semibold leading-6 text-foreground">Google Calendar</p>
        <p className="text-[13px] font-normal leading-5 text-muted-foreground">
          {connected
            ? "Les interventions assignées s'ajoutent automatiquement à ton agenda."
            : "Ajoute tes interventions directement dans ton agenda Google."}
        </p>
      </div>
      {connected ? (
        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[12px] font-medium leading-4 text-success">
            <CheckCircle2 className="size-3" /> Connecté
          </span>
          <Button variant="outline" size="md" onClick={onDisconnect} loading={isPending}>
            Déconnecter
          </Button>
        </div>
      ) : (
        <Button variant="primary" size="md" asChild disabled={isPending}>
          <a href={`/api/google/connect?user_id=${userId}`}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Connecter
          </a>
        </Button>
      )}
    </div>
  );
}
