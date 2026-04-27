"use client";

import type { Assignee, BorneSummary, InterventionCandidate } from "../intervention-types";
import { AssigneeList } from "./assignee-list";
import { BornesSection } from "./bornes-section";
import { MaterielPicker } from "./materiel-picker";
import type { useInterventionForm } from "./use-form";

export function FormBody({
  f,
  candidates,
  allBornes,
  assignees,
}: {
  f: ReturnType<typeof useInterventionForm>;
  candidates: InterventionCandidate[];
  allBornes: BorneSummary[];
  assignees: Assignee[];
}) {
  return (
    <>
      {f.mode === "maintenance" ? (
        <Field label="Matériel à remplacer">
          <MaterielPicker value={f.materiel} onChange={f.setMateriel} />
        </Field>
      ) : null}
      <Field label={f.mode === "alerte" ? "Bornes à visiter" : "Bornes concernées"}>
        <BornesSection
          mode={f.mode ?? "alerte"}
          candidates={candidates}
          allBornes={allBornes}
          selected={f.selected}
          onToggle={f.toggle}
        />
      </Field>
      <Field label="Assigner à">
        <AssigneeList value={f.assigneeId} onChange={f.setAssigneeId} assignees={assignees} />
      </Field>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <Field label="Date planifiée">
          <input
            type="date"
            value={f.date}
            onChange={(e) => f.setDate(e.target.value)}
            className="h-11 w-full rounded-[10px] border border-input bg-background px-3 text-[14px] leading-5 text-foreground shadow-xs outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </Field>
        <Field label="Notes">
          <textarea
            value={f.notes}
            onChange={(e) => f.setNotes(e.target.value)}
            rows={3}
            placeholder="Matériel, consignes, accès bar…"
            className="h-[88px] w-full resize-none rounded-[10px] border border-input bg-background px-3 py-2.5 text-[14px] leading-5 text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </Field>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[14px] font-medium leading-5 text-foreground">{label}</p>
      {children}
    </div>
  );
}
