"use client";

import { useRouter } from "next/navigation";
import { DialogContent, DialogRoot, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Column, Settings, SignalRule } from "../lib";
import { SettingsColumnsTab } from "./settings-columns-tab";
import { SettingsGeneralTab } from "./settings-general-tab";
import { SettingsRulesTab } from "./settings-rules-tab";

export function SettingsDialog({
  open,
  onOpenChange,
  columns,
  settings,
  signalRules,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: readonly Column[];
  settings: Settings;
  signalRules: readonly SignalRule[];
}) {
  const router = useRouter();

  return (
    <DialogRoot
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) router.refresh();
      }}
    >
      <DialogContent className="w-[90vw] max-w-xl p-5">
        <DialogTitle className="mb-3 text-base font-semibold">Paramètres</DialogTitle>
        <Tabs defaultValue="columns">
          <TabsList>
            <TabsTrigger value="columns">Colonnes</TabsTrigger>
            <TabsTrigger value="rules">Règles automatiques</TabsTrigger>
            <TabsTrigger value="general">Réglages</TabsTrigger>
          </TabsList>
          <TabsContent value="columns">
            <SettingsColumnsTab columns={columns} />
          </TabsContent>
          <TabsContent value="rules">
            <SettingsRulesTab signalRules={signalRules} />
          </TabsContent>
          <TabsContent value="general">
            <SettingsGeneralTab settings={settings} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </DialogRoot>
  );
}
