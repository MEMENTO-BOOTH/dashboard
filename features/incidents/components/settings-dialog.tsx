"use client";

import { useRouter } from "next/navigation";
import { DialogContent, DialogDescription, DialogRoot, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { IncidentBorne } from "../api";
import type { Column, Incident, Settings, SignalRule } from "../lib";
import { SettingsColumnsTab } from "./settings-columns-tab";
import { SettingsGeneralTab } from "./settings-general-tab";
import { SettingsRulesTab } from "./settings-rules-tab";

export function SettingsDialog({
  open,
  onOpenChange,
  columns,
  incidents,
  settings,
  signalRules,
  ignoredSignals,
  bornes,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: readonly Column[];
  incidents: readonly Incident[];
  settings: Settings;
  signalRules: readonly SignalRule[];
  ignoredSignals: readonly string[];
  bornes: readonly IncidentBorne[];
}) {
  const router = useRouter();
  const close = () => onOpenChange(false);

  return (
    <DialogRoot
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) router.refresh();
      }}
    >
      <DialogContent className="top-[6%] w-[92vw] max-w-[800px] rounded-[14px] border-border bg-card p-6 shadow-sm">
        <DialogTitle className="text-[18px] font-semibold leading-[28px] text-card-foreground">
          Paramètres du tableau
        </DialogTitle>
        <DialogDescription className="mt-1 text-[14px] leading-5 text-muted-foreground">
          Les changements s'appliquent quand tu enregistres.
        </DialogDescription>
        <Tabs defaultValue="columns" className="mt-4 flex-col gap-4">
          <TabsList className="h-9">
            <TabsTrigger value="columns" className="px-4">
              Colonnes
            </TabsTrigger>
            <TabsTrigger value="rules" className="px-4">
              Règles automatiques
            </TabsTrigger>
            <TabsTrigger value="general" className="px-4">
              Réglages
            </TabsTrigger>
          </TabsList>
          <TabsContent value="columns">
            <SettingsColumnsTab columns={columns} incidents={incidents} onClose={close} />
          </TabsContent>
          <TabsContent value="rules">
            <SettingsRulesTab
              signalRules={signalRules}
              ignoredSignals={ignoredSignals}
              bornes={bornes}
              onClose={close}
            />
          </TabsContent>
          <TabsContent value="general">
            <SettingsGeneralTab settings={settings} onClose={close} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </DialogRoot>
  );
}
