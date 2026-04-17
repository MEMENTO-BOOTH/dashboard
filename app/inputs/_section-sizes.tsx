import { ColHeader, RowLabel, Section } from "@/components/showcase/primitives";
import { FloatingInput } from "@/components/ui/floating-input";
import { Input } from "@/components/ui/input";

type DefaultSize = "lg" | "md" | "sm" | "xs";
const defaultSizes: { key: DefaultSize; label: string }[] = [
  { key: "lg", label: "Large" },
  { key: "md", label: "Medium" },
  { key: "sm", label: "Small" },
  { key: "xs", label: "Ex.Small" },
];

type FloatSize = "lg" | "md" | "sm";
const floatSizes: FloatSize[] = ["lg", "md", "sm"];

export function SizesSection() {
  return (
    <Section title="Sizes">
      <div className="flex flex-1 flex-col gap-[30px]">
        <div className="flex items-start gap-[24px] pl-[120px]">
          {defaultSizes.map((s) => (
            <div key={s.key} className="w-[220px]">
              <ColHeader>{s.label}</ColHeader>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-[24px]">
          <RowLabel width={120}>Default</RowLabel>
          {defaultSizes.map((s) => (
            <div key={s.key} className="w-[220px]">
              <Input size={s.key} placeholder="Type here" />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-[24px]">
          <RowLabel width={120}>Floating</RowLabel>
          {floatSizes.map((s) => (
            <div key={s} className="w-[220px]">
              <FloatingInput
                id={`float-${s}`}
                size={s}
                label="Label"
                topRightLabel="Top Right label"
                placeholder="Type here"
              />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
