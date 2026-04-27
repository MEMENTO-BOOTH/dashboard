"use client";

import { X } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { createMember } from "../actions";
import { AvatarPicker, getRandomAvatar } from "./avatar-picker";
import { CaToggle } from "./ca-toggle";
import { PinInput } from "./pin-input";
import { type RoleOption, RoleSelect } from "./role-select";

export function CreateMemberDialog({
  open,
  onOpenChange,
  roles,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: RoleOption[];
}) {
  const defaultRole = roles[0]?.slug ?? "";
  const [nom, setNom] = useState("");
  const [avatar, setAvatar] = useState(() => getRandomAvatar());
  const [role, setRole] = useState<string>(defaultRole);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pin, setPin] = useState("");
  const [voirCa, setVoirCa] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setNom("");
    setAvatar(getRandomAvatar());
    setRole(defaultRole);
    setIsAdmin(false);
    setPin("");
    setVoirCa(false);
    setError(null);
  }

  function onSubmit() {
    setError(null);
    startTransition(async () => {
      try {
        await createMember({
          nom,
          logo_url: avatar,
          role: isAdmin ? "" : role,
          is_admin: isAdmin,
          pin,
          voir_ca: voirCa,
        });
        reset();
        onOpenChange(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      }
    });
  }

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{ width: 670, maxWidth: 670, height: 780, maxHeight: 780 }}
        className="top-[6%] overflow-y-auto p-0"
      >
        <div className="flex items-start justify-between gap-4 px-6 py-5">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-[18px] font-semibold leading-7 text-foreground">
              Créer un membre
            </DialogTitle>
            <DialogDescription className="text-[14px] font-normal leading-5 text-muted-foreground">
              Ajoutez une personne qui aura accès au dashboard et à l'agent.
            </DialogDescription>
          </div>
          <DialogClose
            aria-label="Fermer"
            className="shrink-0 rounded-[6px] p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" />
          </DialogClose>
        </div>

        <div className="h-px bg-border" />

        <div className="flex flex-col gap-5 px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-member-nom"
              className="text-[14px] font-medium leading-5 text-foreground"
            >
              Nom
            </label>
            <input
              id="create-member-nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Prénom Nom"
              style={{ width: 320 }}
              className="h-10 rounded-[8px] border border-input bg-background px-3 text-[14px] leading-5 text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[14px] font-medium leading-5 text-foreground">Avatar</span>
            <AvatarPicker value={avatar} onChange={setAvatar} />
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-[10px] border border-border bg-background px-4 py-3 transition-colors hover:bg-accent">
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="mt-0.5 size-4 rounded border border-input"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-[14px] font-medium leading-5 text-foreground">
                Administrateur
              </span>
              <span className="text-[13px] font-normal leading-5 text-muted-foreground">
                Accès complet à toutes les fonctionnalités, indépendamment du rôle.
              </span>
            </div>
          </label>

          {!isAdmin ? (
            roles.length === 0 ? (
              <div className="rounded-[10px] border border-dashed border-border bg-muted/50 px-4 py-3">
                <p className="text-[13px] font-normal leading-5 text-muted-foreground">
                  Aucun rôle défini. Ce membre n'aura aucune permission tant que vous n'en créez pas
                  un dans <span className="font-medium">Utilisateurs → Rôles</span>.
                </p>
              </div>
            ) : (
              <RoleSelect value={role} onChange={setRole} roles={roles} />
            )
          ) : null}

          <div className="flex flex-col gap-1.5">
            <span className="text-[14px] font-medium leading-5 text-foreground">
              Code PIN (6 chiffres — agent Capsule)
            </span>
            <PinInput value={pin} onChange={setPin} />
          </div>

          <CaToggle value={voirCa} onChange={setVoirCa} />

          {error ? (
            <p className="text-[14px] font-normal leading-5 text-destructive">{error}</p>
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button variant="outline" size="md" disabled={isPending}>
                Annuler
              </Button>
            </DialogClose>
            <Button
              variant="primary"
              size="md"
              onClick={onSubmit}
              disabled={!nom || pin.length !== 6}
              loading={isPending}
            >
              Créer le membre
            </Button>
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
