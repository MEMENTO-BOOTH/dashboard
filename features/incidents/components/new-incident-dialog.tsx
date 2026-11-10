"use client";

import { Plus, Store, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogRoot, DialogTitle } from "@/components/ui/dialog";
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
import { type Origin, PRIORITIES, type Priority, TITLE_MAX } from "../lib";
import { OriginButtons, PriorityButtons } from "./detail-segmented";

type Source = "manuel" | "bar";

export function NewIncidentDialog({
  open,
  onOpenChange,
  bornes,
  assignees,
  currentUserId,
  entreeName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bornes: readonly IncidentBorne[];
  assignees: readonly Assignee[];
  currentUserId: string;
  entreeName: string;
}) {
  const router = useRouter();
  const uid = useId();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [borneId, setBorneId] = useState("");
  const [source, setSource] = useState<Source>("manuel");
  const [priority, setPriority] = useState<Priority>(3);
  const [origin, setOrigin] = useState<Origin>("diag");
  const [assigneeId, setAssigneeId] = useState("later");
  const [description, setDescription] = useState("");

  function reset() {
    setTitle("");
    setTitleError(false);
    setBorneId("");
    setSource("manuel");
    setPriority(3);
    setOrigin("diag");
    setAssigneeId("later");
    setDescription("");
  }

  function submit() {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }
    if (!borneId) return;
    startTransition(async () => {
      try {
        await createIncidentAction({
          title,
          borneId,
          priority,
          origin,
          assigneeId: assigneeId === "later" ? null : assigneeId,
          description,
          source,
        });
        reset();
        onOpenChange(false);
        router.refresh();
        toast.success(`Incident créé dans « ${entreeName} »`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Impossible de créer l'incident.");
      }
    });
  }

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[8%] w-[92vw] max-w-[560px] rounded-[14px] border-border bg-card p-6 shadow-sm">
        <DialogTitle className="text-[18px] font-semibold leading-[28px] text-card-foreground">
          Nouvel incident
        </DialogTitle>
        <DialogDescription className="mt-1 text-[14px] leading-5 text-muted-foreground">
          Il arrive dans « {entreeName} », comme les incidents automatiques.
        </DialogDescription>
        <div className="mt-4 flex max-h-[70vh] flex-col gap-3.5 overflow-y-auto">
          <Field label="Titre" htmlFor={`${uid}-title`}>
            <Input
              id={`${uid}-title`}
              placeholder="Ex. : le bouton Valider ne réagit plus"
              value={title}
              maxLength={TITLE_MAX}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setTitleError(false);
              }}
            />
            {titleError && <p className="text-xs text-destructive">Donne un titre à l'incident.</p>}
          </Field>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
            <Field label="Borne">
              <Select value={borneId} onValueChange={setBorneId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir une borne" />
                </SelectTrigger>
                <SelectContent>
                  {bornes.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.code} · {[b.nomLieu, b.ville].filter(Boolean).join(", ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Responsable">
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="later">Plus tard</SelectItem>
                  {assignees.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.nom}
                      {a.id === currentUserId ? " (moi)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Qui le signale ?">
            <div className="flex gap-0.5 rounded-md bg-muted p-0.5">
              <SourceButton active={source === "manuel"} onClick={() => setSource("manuel")}>
                <User className="size-3.5" />
                Moi, à la main
              </SourceButton>
              <SourceButton active={source === "bar"} onClick={() => setSource("bar")}>
                <Store className="size-3.5" />
                Le personnel du bar
              </SourceButton>
            </div>
          </Field>
          <Field label="Priorité">
            <PriorityButtons value={priority} onChange={setPriority} />
            <p className="text-xs leading-relaxed text-muted-foreground">
              <b className="font-semibold text-foreground/80">
                P{priority} · {PRIORITIES[priority].name}.
              </b>{" "}
              {PRIORITIES[priority].definition}
            </p>
          </Field>
          <Field label="Origine de la panne">
            <OriginButtons value={origin} onChange={setOrigin} />
          </Field>
          <Field label="Description (facultatif)" htmlFor={`${uid}-desc`}>
            <textarea
              id={`${uid}-desc`}
              rows={3}
              placeholder="Ce qui se passe, depuis quand, ce que dit le bar…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-20 rounded-md border border-input bg-background px-2.5 py-2 text-sm shadow-xs outline-none focus-visible:border-ring"
            />
          </Field>
        </div>
        <div className="mt-4 flex justify-end gap-2 border-t border-input pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            disabled={!borneId || isPending}
            onClick={submit}
            iconStart={<Plus className="size-4" />}
          >
            Créer l'incident
          </Button>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function SourceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        active
          ? "flex flex-1 items-center justify-center gap-1.5 rounded-[6px] bg-background px-2 py-1.5 text-[13px] font-medium text-foreground shadow-xs"
          : "flex flex-1 items-center justify-center gap-1.5 rounded-[6px] px-2 py-1.5 text-[13px] font-medium text-foreground/70 hover:text-foreground"
      }
    >
      {children}
    </button>
  );
}
