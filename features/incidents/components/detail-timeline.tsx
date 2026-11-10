"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addNoteAction } from "../actions";

export type TimelineEvent = {
  id: string;
  kind: "event" | "note";
  authorId: string | null;
  body: string;
  createdAt: Date;
};

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function DetailTimeline({
  incidentId,
  events,
  authorName,
  canManage,
  onNoteAdded,
}: {
  incidentId: string;
  events: readonly TimelineEvent[];
  authorName: (userId: string) => string;
  canManage: boolean;
  onNoteAdded: () => void;
}) {
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  function submitNote() {
    if (!note.trim()) return;
    startTransition(async () => {
      try {
        await addNoteAction({ incidentId, body: note });
        setNote("");
        onNoteAdded();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Impossible d'ajouter la note.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground">Suivi</h3>
      <div className="flex flex-col gap-2">
        {events.map((event) => (
          <div key={event.id} className="rounded-md border border-input bg-background p-2 text-sm">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>{event.authorId ? authorName(event.authorId) : "Automatique"}</span>
              <span>{dateFmt.format(event.createdAt)}</span>
            </div>
            <p className={event.kind === "note" ? "text-foreground" : "text-muted-foreground"}>
              {event.body}
            </p>
          </div>
        ))}
        {events.length === 0 && <p className="text-xs text-muted-foreground">Aucun événement.</p>}
      </div>
      {canManage && (
        <div className="flex flex-col gap-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ajouter une note…"
            className="min-h-16 rounded-md border border-input bg-background p-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <Button
            size="sm"
            disabled={!note.trim() || isPending}
            onClick={submitNote}
            className="self-end"
          >
            Ajouter
          </Button>
        </div>
      )}
    </div>
  );
}
