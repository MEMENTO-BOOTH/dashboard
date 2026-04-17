import { ColHeader, RowLabel, Section } from "@/components/showcase/primitives";
import { FloatingInput } from "@/components/ui/floating-input";
import { Input } from "@/components/ui/input";

type Row = {
  label: string;
  state: "default" | "focus" | "success" | "destructive";
  disabled?: boolean;
};
const rows: Row[] = [
  { label: "Default", state: "default" },
  { label: "Focus", state: "focus" },
  { label: "Success", state: "success" },
  { label: "Destructive", state: "destructive" },
  { label: "Disabled", state: "default", disabled: true },
];

export function StateSection() {
  return (
    <Section title="State">
      <div className="flex flex-1 flex-col gap-[34px]">
        <div className="flex items-start gap-[40px] pl-[120px]">
          <div className="w-[288px]">
            <ColHeader>Default Input</ColHeader>
          </div>
          <div className="w-[288px]">
            <ColHeader>Floating Input</ColHeader>
          </div>
        </div>
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-[40px]">
            <RowLabel width={120}>{r.label}</RowLabel>
            <div className="w-[288px]">
              <Input
                state={r.state}
                disabled={r.disabled}
                defaultValue={r.state === "default" && !r.disabled ? undefined : "This is my text"}
                placeholder={r.state === "default" && !r.disabled ? "Type here" : undefined}
              />
            </div>
            <div className="w-[288px]">
              <FloatingInput
                id={`state-${r.label}`}
                label="Label"
                state={r.state}
                disabled={r.disabled}
                defaultValue={r.state === "default" && !r.disabled ? undefined : "This is my text"}
                placeholder={r.state === "default" && !r.disabled ? "Type here" : undefined}
                topRightLabel="Top Right label"
              />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
