import { Heart } from "lucide-react";
import { RowLabel, Section } from "@/components/showcase/primitives";
import { IconButton } from "@/components/ui/icon-button";
import { IconButtonGroup } from "@/components/ui/icon-button-group";

type StateRow = {
  label: string;
  middleClass?: string;
  groupClass?: string;
  disabled?: boolean;
};

const states: StateRow[] = [
  { label: "Enabled" },
  { label: "Hover", middleClass: "bg-primary/30" },
  { label: "Active" },
  { label: "Focus", middleClass: "ring-[3px] ring-ring/40" },
  { label: "Disabled", groupClass: "opacity-50", disabled: true },
];

export function StatesSection() {
  return (
    <Section title="States">
      <div className="flex flex-1 flex-col gap-[20px]">
        {states.map((s) => (
          <div key={s.label} className="flex items-center gap-[50px]">
            <RowLabel>{s.label}</RowLabel>
            <IconButtonGroup aria-label={s.label} className={s.groupClass}>
              <IconButton variant="soft" aria-label="Like 1" disabled={s.disabled}>
                <Heart />
              </IconButton>
              <IconButton
                variant="soft"
                aria-label="Like 2"
                className={s.middleClass}
                disabled={s.disabled}
              >
                <Heart />
              </IconButton>
              <IconButton variant="soft" aria-label="Like 3" disabled={s.disabled}>
                <Heart />
              </IconButton>
            </IconButtonGroup>
          </div>
        ))}
      </div>
    </Section>
  );
}
