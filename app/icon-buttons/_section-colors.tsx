import { Heart } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { allColors, allVariants, ColHeader, capitalize, RowLabel, Section } from "./_parts";

export function ColorsSection() {
  return (
    <Section title="Colors">
      <div className="flex flex-1 flex-col gap-[20px]">
        <div className="flex items-center gap-[50px] pl-[100px]">
          {allColors.map((c) => (
            <ColHeader key={c}>{capitalize(c)}</ColHeader>
          ))}
        </div>
        {allVariants.map((v) => (
          <div key={v} className="flex items-center gap-[50px]">
            <RowLabel>{capitalize(v)}</RowLabel>
            {allColors.map((c) => (
              <IconButton key={c} variant={v} color={c} aria-label="Like">
                <Heart />
              </IconButton>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}
