"use client";

import {
  Building2,
  ChartNoAxesCombined,
  ClipboardList,
  Coins,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MapPinned,
  PowerOff,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DialogClose, DialogContent, DialogRoot, DialogTitle } from "@/components/ui/dialog";
import { signOutAction } from "@/features/auth";
import { can, type Permissions } from "@/features/auth/permissions";

export function CommandPalette({
  open,
  onOpenChange,
  permissions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permissions: Permissions;
}) {
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[640px] max-w-[calc(100vw-2rem)] p-0">
        <DialogTitle className="sr-only">Recherche / Commandes</DialogTitle>
        <Command>
          <CommandInput
            placeholder="Tape une commande ou une borne…"
            trailing={
              <DialogClose
                aria-label="Fermer"
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </DialogClose>
            }
          />
          <CommandList className="max-h-[440px]">
            <CommandEmpty>Aucun résultat.</CommandEmpty>

            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => go("/")}>
                <LayoutDashboard className="size-4 shrink-0" aria-hidden />
                <span>Tableau de bord</span>
              </CommandItem>
              <CommandItem onSelect={() => go("/parc")}>
                <MapPinned className="size-4 shrink-0" aria-hidden />
                <span>Mon parc</span>
              </CommandItem>
              {can(permissions, "jetons.view") ? (
                <CommandItem onSelect={() => go("/jetons")}>
                  <Coins className="size-4 shrink-0" aria-hidden />
                  <span>Jetons</span>
                </CommandItem>
              ) : null}
              {can(permissions, "finance.view") ? (
                <CommandItem onSelect={() => go("/transactions")}>
                  <ChartNoAxesCombined className="size-4 shrink-0" aria-hidden />
                  <span>Finance</span>
                </CommandItem>
              ) : null}
              {can(permissions, "utilisateurs.manage") ? (
                <CommandItem onSelect={() => go("/utilisateurs")}>
                  <Users className="size-4 shrink-0" aria-hidden />
                  <span>Utilisateurs</span>
                </CommandItem>
              ) : null}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Sous-pages">
              <CommandItem onSelect={() => go("/parc/bornes")}>
                <Building2 className="size-4 shrink-0" aria-hidden />
                <span>Liste des bornes</span>
              </CommandItem>
              <CommandItem onSelect={() => go("/parc/interventions")}>
                <ClipboardList className="size-4 shrink-0" aria-hidden />
                <span>Interventions du parc</span>
              </CommandItem>
              {can(permissions, "roles.manage") ? (
                <CommandItem onSelect={() => go("/utilisateurs/roles")}>
                  <KeyRound className="size-4 shrink-0" aria-hidden />
                  <span>Rôles & permissions</span>
                </CommandItem>
              ) : null}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Vues filtrées">
              <CommandItem onSelect={() => go("/parc/bornes?type=maintenance")}>
                <Wrench className="size-4 shrink-0" aria-hidden />
                <span>Bornes en maintenance</span>
              </CommandItem>
              <CommandItem onSelect={() => go("/parc/bornes?type=desactivee")}>
                <PowerOff className="size-4 shrink-0" aria-hidden />
                <span>Bornes désactivées</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Compte">
              <CommandItem
                onSelect={() => {
                  onOpenChange(false);
                  void signOutAction();
                }}
                className="text-destructive data-[selected=true]:bg-destructive/10 data-[selected=true]:text-destructive"
              >
                <LogOut className="size-4 shrink-0" aria-hidden />
                <span>Se déconnecter</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </DialogRoot>
  );
}
