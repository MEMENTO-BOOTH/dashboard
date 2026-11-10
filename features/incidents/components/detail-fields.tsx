"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Assignee } from "@/features/dashboard/alerts";
import type { Column } from "../lib";

export function AssigneeSelect({
  value,
  assignees,
  currentUserId,
  onChange,
  disabled,
}: {
  value: string | null;
  assignees: readonly Assignee[];
  currentUserId?: string;
  onChange: (id: string | null) => void;
  disabled?: boolean;
}) {
  return (
    <Select
      value={value ?? "none"}
      onValueChange={(v) => onChange(v === "none" ? null : v)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Sans responsable" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Sans responsable</SelectItem>
        {assignees.map((a) => (
          <SelectItem key={a.id} value={a.id}>
            {a.nom}
            {a.id === currentUserId ? " (moi)" : ""}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ColumnSelect({
  value,
  columns,
  onChange,
  disabled,
}: {
  value: string;
  columns: readonly Column[];
  onChange: (columnId: string) => void;
  disabled?: boolean;
}) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[...columns]
          .sort((a, b) => a.position - b.position)
          .map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}

export function PlannedDateInput({
  value,
  onChange,
  disabled,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
}) {
  return (
    <Input
      type="date"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      disabled={disabled}
      className="w-full"
    />
  );
}
