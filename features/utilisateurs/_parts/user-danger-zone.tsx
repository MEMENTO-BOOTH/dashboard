"use client";

import { KeyRound, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteMember, updateMemberPin } from "../actions";
import { PinInput } from "./pin-input";

export function UserDangerZone({ userId, userNom }: { userId: string; userNom: string }) {
  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-12 pt-12 pb-12">
      <PinSection userId={userId} />
      <DeleteSection userId={userId} userNom={userNom} />
    </div>
  );
}

function PinSection({ userId }: { userId: string }) {
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit() {
    setMessage(null);
    startTransition(async () => {
      try {
        await updateMemberPin(userId, pin);
        setMessage({ kind: "success", text: "Code PIN mis à jour." });
        setPin("");
      } catch (err) {
        setMessage({
          kind: "error",
          text: err instanceof Error ? err.message : "Erreur inconnue",
        });
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[24px] font-semibold leading-8 text-foreground">
          Modifier le code PIN
        </h2>
        <p className="text-[14px] font-normal leading-5 text-muted-foreground">
          Le nouveau code sera demandé à l'utilisateur sur les bornes Capsule.
        </p>
      </div>

      <div className="rounded-[10px] border border-dashed border-border bg-muted/20 p-8">
        <div className="flex gap-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-border bg-background shadow-xs">
            <KeyRound className="size-4 text-foreground" />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[16px] font-semibold leading-6 text-foreground">
              Nouveau code PIN (6 chiffres)
            </p>
            <p className="text-[14px] font-normal leading-5 text-muted-foreground">
              Choisissez un code différent de l'ancien. L'utilisateur devra l'utiliser à sa
              prochaine connexion.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-5">
          <PinInput value={pin} onChange={setPin} />
          {message ? (
            <p
              className={`text-[14px] font-normal leading-5 ${
                message.kind === "success" ? "text-success" : "text-destructive"
              }`}
            >
              {message.text}
            </p>
          ) : null}
          <div>
            <Button
              variant="primary"
              size="md"
              onClick={onSubmit}
              disabled={pin.length !== 6}
              loading={isPending}
            >
              Mettre à jour le code PIN
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteSection({ userId, userNom }: { userId: string; userNom: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onDelete() {
    startTransition(async () => {
      await deleteMember(userId);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[24px] font-semibold leading-8 text-foreground">Supprimer le membre</h2>
        <p className="text-[14px] font-normal leading-5 text-muted-foreground">
          Retirez définitivement cet utilisateur du dashboard et de l'agent.
        </p>
      </div>

      <div className="rounded-[10px] border border-dashed border-destructive/40 bg-destructive/5 p-8">
        <div className="flex gap-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-destructive bg-background shadow-xs">
            <Trash2 className="size-4 text-destructive" />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[16px] font-semibold leading-6 text-foreground">
              Supprimer ce membre supprimera aussi ses connexions aux bornes.
            </p>
            <p className="text-[14px] font-normal leading-5 text-muted-foreground">
              Assurez-vous que cet utilisateur n'a plus besoin d'accéder au dashboard ou à l'agent.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <Button variant="primary" size="md" onClick={() => setOpen(true)}>
            Supprimer le membre
          </Button>
        </div>
      </div>

      <DialogRoot open={open} onOpenChange={setOpen}>
        <DialogContent
          style={{ width: 500, maxWidth: 500 }}
          className="top-1/2 -translate-y-1/2 gap-4 rounded-[10px] border-none bg-background p-6 shadow-lg"
        >
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-[18px] font-semibold leading-[28px] text-foreground">
              Êtes-vous absolument sûr ?
            </DialogTitle>
            <DialogDescription className="text-[14px] font-normal leading-5 text-muted-foreground">
              Cette action est irréversible. Elle supprimera définitivement {userNom} du dashboard
              et de l'agent.
            </DialogDescription>
          </div>
          <div className="flex items-center justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" size="md" disabled={isPending}>
                Annuler
              </Button>
            </DialogClose>
            <Button variant="destructive" size="md" onClick={onDelete} loading={isPending}>
              Confirmer la suppression
            </Button>
          </div>
        </DialogContent>
      </DialogRoot>
    </div>
  );
}
