"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { KeyRound } from "lucide-react";
import { useActionState, useId, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8 pt-4">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold leading-8 text-foreground">Licences</h1>
        <p className="text-sm leading-5 text-muted-foreground">
          Crée un code d'activation pour un client et gère les licences existantes.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-5 sm:max-w-[560px]">
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
        {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
        <Button type="submit" variant="primary" size="lg" loading={isPending} className="w-full">
          Générer le code d'activation
        </Button>
      </form>

      {licence ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="size-4 text-primary" />
              Code d'activation
            </CardTitle>
            <CardDescription>
              Pour {licence.clientName} — borne {licence.borneCode}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <code className="flex-1 rounded-md bg-muted px-4 py-3 font-mono text-[15px] break-all text-foreground">
                {licence.code}
              </code>
              <Button type="button" variant="outline" onClick={() => copy(licence.code)}>
                {copied ? "Copié" : "Copier"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Donne ce code au client : il le tape sur l'écran d'activation de sa borne pour
              l'activer.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold leading-7 text-foreground">
          Licences existantes ({licences.length})
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Borne</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Créée le</TableHead>
              <TableHead>Dernière connexion</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {licences.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.tenantName ?? "—"}</TableCell>
                <TableCell>{row.borneCode ?? "—"}</TableCell>
                <TableCell>
                  {row.status === "revoked" ? (
                    <span className="text-destructive">Révoquée</span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-500">Active</span>
                  )}
                </TableCell>
                <TableCell>{formatDate(row.createdAt)}</TableCell>
                <TableCell>{formatSeen(row.lastSeenAt)}</TableCell>
                <TableCell className="text-right">
                  {row.status === "revoked" ? null : <RevokeButton licence={row} />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
