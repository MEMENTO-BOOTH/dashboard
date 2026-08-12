"use client";

import { KeyRound } from "lucide-react";
import { useActionState, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { type CreateLicenceState, createLicenceAction } from "../actions";

const initialState: CreateLicenceState = { error: null, licence: null };

export function LicencesPage() {
  const [state, formAction, isPending] = useActionState(createLicenceAction, initialState);
  const clientId = useId();
  const borneCodeId = useId();
  const [copied, setCopied] = useState(false);
  const licence = state.licence;

  function copy(code: string) {
    void navigator.clipboard.writeText(code).then(() => setCopied(true));
  }

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col gap-6 pt-4">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold leading-8 text-foreground">Créer une licence</h1>
        <p className="text-sm leading-5 text-muted-foreground">
          Génère un code d'activation à donner à un client pour sa borne.
        </p>
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
    </div>
  );
}
