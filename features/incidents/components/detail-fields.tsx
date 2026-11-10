"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Assignee } from "@/features/dashboard/alerts";
import { ORIGIN_LABELS, type Origin, type Priority } from "../lib";

export function PriorityButtons({
  value,
  onChange,
}: {
  value: Priority;
  onChange: (p: Priority) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {([1, 2, 3, 4, 5] as Priority[]).map((p) => (
        <Button
          key={p}
          size="sm"
          variant={value === p ? "primary" : "outline"}
          onClick={() => onChange(p)}
        >
          P{p}
        </Button>
      ))}
    </div>
  );
}

export function OriginButtons({
  value,
  onChange,
}: {
  value: Origin;
  onChange: (o: Origin) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {(Object.entries(ORIGIN_LABELS) as [Origin, string][]).map(([key, label]) => (
        <Button
          key={key}
          size="sm"
          variant={value === key ? "primary" : "outline"}
          onClick={() => onChange(key)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}

export function AssigneeSelect({
  value,
  assignees,
  onChange,
}: {
  value: string | null;
  assignees: readonly Assignee[];
  onChange: (id: string | null) => void;
}) {
  return (
    <Select value={value ?? "none"} onValueChange={(v) => onChange(v === "none" ? null : v)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Non attribué" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Non attribué</SelectItem>
        {assignees.map((a) => (
          <SelectItem key={a.id} value={a.id}>
            {a.nom}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function PlannedDateInput({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <Input
      type="date"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="w-full"
    />
  );
}
