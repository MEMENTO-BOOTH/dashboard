"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, Copy, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useId, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type CreateLicenceState, createLicenceAction, revokeLicenceAction } from "../actions";
import type { LicenceOverview, LicenceStatus } from "../schemas";

const initialState: CreateLicenceState = { error: null, licence: null };

function formatDate(iso: string): string {
  return format(new Date(iso), "d MMM yyyy", { locale: fr });
}

function formatSeen(iso: string | null): string {
  if (!iso) return "Jamais";
  return format(new Date(iso), "d MMM yyyy 'à' HH:mm", { locale: fr });
}

function StatusBadge({ status }: { status: LicenceStatus }) {
  if (status === "revoked") return <Badge variant="destructive">Révoquée</Badge>;
  if (status === "active")
    return (
      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">Active</Badge>
    );
  return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-500">En attente</Badge>;
}

function RevokeButton({ row }: { row: LicenceOverview }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  if (row.status !== "active" || !row.licenseId) return null;
  const licenseId = row.licenseId;
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await revokeLicenceAction(row.tenantId, row.borneId, licenseId);
          router.refresh();
        })
      }
    >
      {pending ? "…" : "Révoquer"}
    </Button>
  );
}

export function LicencesPage({ overview }: { overview: LicenceOverview[] }) {
  const [state, formAction, isPending] = useActionState(createLicenceAction, initialState);
  const router = useRouter();
  const clientId = useId();
  const borneCodeId = useId();
  const [copied, setCopied] = useState(false);
  const licence = state.licence;

  useEffect(() => {
    if (state.licence) router.refresh();
  }, [state.licence, router]);

  function copy(code: string) {
    void navigator.clipboard.writeText(code).then(() => setCopied(true));
  }

  return (
    <div className="flex w-full flex-col gap-12 pt-6">
      <div className="mx-auto flex w-full max-w-[440px] flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <KeyRound className="size-6 text-primary" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold leading-8 text-foreground">Nouvelle licence</h1>
            <p className="text-sm leading-5 text-muted-foreground">
              Génère un code d'activation à donner à un client pour sa borne.
            </p>
          </div>
        </div>

        <form action={formAction} className="flex flex-col gap-5">
          <Input
            id={clientId}
            name="clientName"
            label="Nom du client"
            placeholder="Bar du Coin"
            autoComplete="off"
            required
            size="lg"
          />
          <Input
            id={borneCodeId}
            name="borneCode"
            label="Code de la borne"
            placeholder="BAR-01"
            autoComplete="off"
            required
            size="lg"
          />
          {state.error ? (
            <p className="text-center text-sm text-destructive">{state.error}</p>
          ) : null}
          <Button type="submit" variant="primary" size="lg" loading={isPending} className="w-full">
            Générer le code d'activation
          </Button>
        </form>

        {licence ? (
          <div className="flex flex-col gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
            <p className="text-center text-sm font-medium text-foreground">
              Code pour {licence.clientName} — borne {licence.borneCode}
            </p>
            <div className="flex items-center gap-3">
              <code className="flex-1 rounded-md bg-background px-4 py-3 text-center font-mono text-[15px] break-all text-foreground">
                {licence.code}
              </code>
              <Button type="button" variant="outline" onClick={() => copy(licence.code)}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copié" : "Copier"}
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Le client tape ce code sur l'écran d'activation de sa borne.
            </p>
          </div>
        ) : null}
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold leading-7 text-foreground">
          Bornes sous licence ({overview.length})
        </h2>
        <Card className="w-full overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Client</TableHead>
                  <TableHead>Borne</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créée le</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead className="pr-6 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overview.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      Aucune borne pour le moment.
                    </TableCell>
                  </TableRow>
                ) : (
                  overview.map((row) => (
                    <TableRow key={row.borneId}>
                      <TableCell className="pl-6 font-medium text-foreground">
                        {row.tenantName}
                      </TableCell>
                      <TableCell className="font-mono text-[13px] text-muted-foreground">
                        {row.borneCode}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={row.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(row.createdAt)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatSeen(row.lastSeenAt)}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <RevokeButton row={row} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </section>
    </div>
  );
}
