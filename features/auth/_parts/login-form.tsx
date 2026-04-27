"use client";

import { User } from "lucide-react";
import { useActionState, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type SignInState, signInAction } from "../actions";
import { OtpInput } from "./otp-input";

const initialState: SignInState = { error: null };
const PIN_LENGTH = 6;

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signInAction, initialState);
  const [pin, setPin] = useState("");
  const nomId = useId();

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold leading-8 text-foreground">Bon retour</h1>
        <p className="text-sm leading-5 text-muted-foreground">
          Connecte-toi avec ton nom et ton code PIN à 6 chiffres.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-5">
        <Input
          id={nomId}
          name="nom"
          type="text"
          autoComplete="name"
          required
          label="Nom"
          placeholder="Prénom Nom"
          leftIcon={<User />}
          size="lg"
        />

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium leading-5 text-foreground">Code PIN</p>
          <OtpInput length={PIN_LENGTH} name="pin" value={pin} onChange={setPin} />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm leading-5 text-foreground">
          <input
            type="checkbox"
            name="remember"
            className="size-4 rounded border-input accent-primary"
          />
          Se souvenir de moi
        </label>

        {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isPending}
          disabled={pin.length !== PIN_LENGTH}
          className="w-full"
        >
          Se connecter
        </Button>
      </form>
    </div>
  );
}
