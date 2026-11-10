"use client";

import { Send } from "lucide-react";
import { useId, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { addNoteAction } from "../actions";
import { formatWhen } from "../lib";
import { SectionTitle } from "./detail-related";

export type TimelineEvent = {
  id: string;
  kind: "event" | "note";
  authorId: string | null;
  body: string;
  createdAt: Date;
};

type Author = { nom: string; logoUrl: string | null };

export function DetailTimeline({
  incidentId,
  events,
  author,
  canManage,
  onNoteAdded,
}: {
  incidentId: string;
  events: readonly TimelineEvent[];
  author: (userId: string) => Author;
  canManage: boolean;
  onNoteAdded: () => void;
}) {
  const noteId = useId();
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const now = new Date();

  function submitNote() {
    if (!note.trim()) return;
    startTransition(async () => {
      try {
        await addNoteAction({ incidentId, body: note });
        setNote("");
        onNoteAdded();
        toast.success("Note ajoutée");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Impossible d'ajouter la note.");
      }
    });
  }

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle>Suivi</SectionTitle>
      <ul className="flex flex-col gap-4">
        {events.map((event) =>
          event.kind === "note" ? (
            <NoteBubble
              key={event.id}
              event={event}
              author={event.authorId ? author(event.authorId) : { nom: "Système", logoUrl: null }}
              now={now}
            />
          ) : (
            <li key={event.id} className="grid grid-cols-[24px_minmax(0,1fr)] gap-3">
              <span className="mx-auto mt-2 size-2 rounded-full bg-border" />
              <div className="flex flex-col">
                <p className="text-[14px] leading-5 text-card-foreground">{event.body}</p>
                <time className="text-[13px] leading-5 text-muted-foreground">
                  {formatWhen(event.createdAt, now)} ·{" "}
                  {event.authorId ? author(event.authorId).nom : "automatique"}
                </time>
              </div>
            </li>
          ),
        )}
        {events.length === 0 && (
          <p className="text-[14px] leading-5 text-muted-foreground">Aucun événement.</p>
        )}
      </ul>
      {canManage && (
        <div className="flex flex-col gap-2">
          <label htmlFor={noteId} className="text-[14px] leading-5 text-foreground">
            Ajouter une note
          </label>
          <textarea
            id={noteId}
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ce que tu as constaté, fait ou prévu…"
            className="min-h-20 rounded-md border border-border bg-background px-3 py-2 text-sm leading-5 shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40"
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] leading-5 text-muted-foreground">
              Les changements (colonne, priorité, responsable…) s'ajoutent tout seuls.
            </p>
            <Button
              size="sm"
              variant="outline"
              disabled={!note.trim() || isPending}
              onClick={submitNote}
              iconStart={<Send />}
            >
              Ajouter
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

function NoteBubble({ event, author, now }: { event: TimelineEvent; author: Author; now: Date }) {
  return (
    <li className="grid grid-cols-[24px_minmax(0,1fr)] gap-3">
      <InitialsAvatar
        name={author.nom}
        logoUrl={author.logoUrl}
        className="size-6 rounded-full text-[10px]"
      />
      <div className="min-w-0 rounded-[10px] border border-border bg-muted/40 px-3 py-2">
        <div className="flex justify-between gap-3 text-[13px] leading-5 text-muted-foreground">
          <b className="font-medium text-card-foreground">{author.nom}</b>
          <time>{formatWhen(event.createdAt, now)}</time>
        </div>
        <p className="mt-1 text-[14px] leading-5 whitespace-pre-wrap text-card-foreground [overflow-wrap:anywhere]">
          {event.body}
        </p>
      </div>
    </li>
  );
}
