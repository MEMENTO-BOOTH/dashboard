"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogRoot, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { marquerExpediee } from "../actions";

const CARRIERS = ["Colissimo", "Chronopost", "Mondial Relay", "UPS", "DHL"];

export function ExpedierButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [carrier, setCarrier] = useState("");
  const [tracking, setTracking] = useState("");
  const [pending, startTransition] = useTransition();
  const trackingId = useId();
  const ready = carrier !== "" && tracking.trim() !== "";

  function go() {
    if (!ready) return;
    startTransition(async () => {
      await marquerExpediee(orderId, tracking.trim(), carrier);
      setOpen(false);
      setCarrier("");
      setTracking("");
      router.refresh();
    });
  }

  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-auto py-2 shadow-none">
          Expédier
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[420px] rounded-[14px] p-6">
        <DialogTitle className="text-lg font-semibold text-card-foreground">
          Expédier la commande
        </DialogTitle>
        <p className="text-sm text-muted-foreground">
          Renseigne le transporteur et le numéro de suivi.
        </p>
        <div className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Transporteur</Label>
            <Select value={carrier} onValueChange={setCarrier}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un transporteur" />
              </SelectTrigger>
              <SelectContent>
                {CARRIERS.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={trackingId}>Numéro de suivi</Label>
            <Input
              id={trackingId}
              value={tracking}
              onChange={(event) => setTracking(event.target.value)}
              placeholder="Ex. 6A12345678901"
            />
          </div>
          <Button className="mt-1" onClick={go} loading={pending} disabled={!ready}>
            Confirmer l'expédition
          </Button>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
