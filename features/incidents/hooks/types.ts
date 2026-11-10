import type { Assignee } from "@/features/dashboard/alerts";
import type { IncidentBorne } from "../api";
import type { Column, Incident, Settings, SignalRule } from "../lib";

export type BoardData = {
  columns: Column[];
  incidents: Incident[];
  bornes: IncidentBorne[];
  assignees: Assignee[];
  signalRules: SignalRule[];
  settings: Settings;
  ignoredSignals: string[];
  noteCounts: Record<string, number>;
  canManage: boolean;
  canSettings: boolean;
  currentUserId: string;
};

export type PendingMove = {
  incidentId: string;
  toColumnId: string;
  need: "assignee" | "origin";
};
