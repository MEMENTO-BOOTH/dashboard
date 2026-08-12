"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, Copy, KeyRound } from "lucide-react";
import { useActionState, useId, useState, useTransition } from "react";
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
import type { LicenceRow } from "../schemas";

const initialState: CreateLicenceState = { error: null, licence: null };

function formatDate(iso: string): string {
  return format(new Date(iso), "d MMM yyyy", { locale: fr });
}

function formatSeen(iso: string | null): string {
  if (!iso) return "Jamais";
  return format(new Date(iso), "d MMM yyyy 'à' HH:mm", { locale: fr });
}

function StatusBadge({ status }: { status: string }) {
  if (status === "revoked") return <Badge variant="destructive">Révoquée</Badge>;
  return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">Active</Badge>;
}

function RevokeButton({ licence }: { licence: LicenceRow }) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await revokeLicenceAction(licence.tenantId, licence.borneId, licence.id);
        })
      }
    >
      {pending ? "…" : "Révoquer"}
    </Button>
  );
}

export function LicencesPage({ licences }: { licences: LicenceRow[] }) {
  const [state, formAction, isPending] = useActionState(createLicenceAction, initialState);
  const clientId = useId();
  const borneCodeId = useId();
  const [copied, setCopied] = useState(false);
  const licence = state.licence;

  function copy(code: string) {
    void navigator.clipboard.writeText(code).then(() => setCopied(true));
  }

  return (
    <div className="flex w-full flex-col gap-8 pt-4">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold leading-8 text-foreground">Licences</h1>
        <p className="text-sm leading-5 text-muted-foreground">
          Crée un code d'activation pour un client et gère les licences existantes.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold leading-7 text-foreground">Nouvelle licence</h2>
        <form action={formAction} className="flex max-w-[720px] flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
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
          </div>
          {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isPending}
            className="w-full sm:w-fit"
          >
            Générer le code d'activation
          </Button>
        </form>

        {licence ? (
          <div className="flex max-w-[720px] flex-col gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <KeyRound className="size-4 text-primary" />
              Code pour {licence.clientName} — borne {licence.borneCode}
            </div>
            <div className="flex items-center gap-3">
              <code className="flex-1 rounded-md bg-background px-4 py-3 font-mono text-[15px] break-all text-foreground">
                {licence.code}
              </code>
              <Button type="button" variant="outline" onClick={() => copy(licence.code)}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copié" : "Copier"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Donne ce code au client : il le tape sur l'écran d'activation de sa borne.
            </p>
          </div>
        ) : null}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold leading-7 text-foreground">
          Licences existantes ({licences.length})
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
                {licences.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      Aucune licence pour le moment.
                    </TableCell>
                  </TableRow>
                ) : (
                  licences.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="pl-6 font-medium text-foreground">
                        {row.tenantName ?? "—"}
                      </TableCell>
                      <TableCell className="font-mono text-[13px] text-muted-foreground">
                        {row.borneCode ?? "—"}
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
                        {row.status === "revoked" ? null : <RevokeButton licence={row} />}
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
