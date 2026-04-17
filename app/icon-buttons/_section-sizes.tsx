import { Heart } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { allSizes, ColHeader, capitalize, RowLabel, Section, type Variant } from "./_parts";

const orderedVariants: Variant[] = ["gradient", "solid", "soft", "outline", "ghost"];

export function SizesSection() {
  return (
    <Section title="Sizes">
      <div className="flex flex-1 flex-col gap-[20px]">
        <div className="flex items-center gap-[50px] pl-[100px]">
          {allSizes.map((s) => (
            <ColHeader key={s.key}>{s.label}</ColHeader>
          ))}
        </div>
        {orderedVariants.map((v) => (
          <div key={v} className="flex items-center gap-[50px]">
            <RowLabel>{capitalize(v)}</RowLabel>
            {allSizes.map((s) => (
              <IconButton key={s.key} variant={v} size={s.key} aria-label="Like">
                <Heart />
              </IconButton>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}
