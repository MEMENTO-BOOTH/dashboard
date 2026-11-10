"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogRoot, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Assignee } from "@/features/dashboard/alerts";
import { createIncidentAction } from "../actions";
import type { IncidentBorne } from "../api";
import { PRIORITIES } from "../lib";

export function NewIncidentDialog({
  open,
  onOpenChange,
  bornes,
  assignees,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bornes: readonly IncidentBorne[];
  assignees: readonly Assignee[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [borneId, setBorneId] = useState("");
  const [priority, setPriority] = useState("3");
  const [assigneeId, setAssigneeId] = useState("");
  const [description, setDescription] = useState("");

  function reset() {
    setTitle("");
    setBorneId("");
    setPriority("3");
    setAssigneeId("");
    setDescription("");
  }

  function submit() {
    if (!(title.trim() && borneId)) return;
    startTransition(async () => {
      try {
        await createIncidentAction({
          title,
          borneId,
          priority: Number(priority) as 1 | 2 | 3 | 4 | 5,
          assigneeId: assigneeId || null,
          description,
          source: "manuel",
        });
        reset();
        onOpenChange(false);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Impossible de créer l'incident.");
      }
    });
  }

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-md p-5">
        <DialogTitle className="mb-3 text-base font-semibold">Nouvel incident</DialogTitle>
        <div className="flex flex-col gap-3">
          <Input placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Select value={borneId} onValueChange={setBorneId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Borne concernée" />
            </SelectTrigger>
            <SelectContent>
              {bornes.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.code} · {b.nomLieu}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PRIORITIES).map(([value, { name }]) => (
                <SelectItem key={value} value={value}>
                  P{value} · {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={assigneeId} onValueChange={setAssigneeId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Responsable (optionnel)" />
            </SelectTrigger>
            <SelectContent>
              {assignees.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <textarea
            placeholder="Description (optionnel)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-20 rounded-md border border-input bg-background p-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button disabled={!(title.trim() && borneId) || isPending} onClick={submit}>
            Créer
          </Button>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
