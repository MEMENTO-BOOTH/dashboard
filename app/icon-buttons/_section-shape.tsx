import { Heart } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { allVariants, ColHeader, capitalize, RowLabel, Section } from "./_parts";

export function ShapeSection() {
  return (
    <Section title="Shape">
      <div className="flex flex-1 flex-col gap-[20px]">
        <div className="flex items-center gap-[50px] pl-[100px]">
          {allVariants.map((v) => (
            <ColHeader key={v}>{capitalize(v)}</ColHeader>
          ))}
        </div>
        <div className="flex items-center gap-[50px]">
          <RowLabel>Square</RowLabel>
          {allVariants.map((v) => (
            <IconButton key={v} variant={v} shape="square" aria-label="Like">
              <Heart />
            </IconButton>
          ))}
        </div>
        <div className="flex items-center gap-[50px]">
          <RowLabel>Rounded</RowLabel>
          {allVariants.map((v) => (
            <IconButton key={v} variant={v} shape="rounded" aria-label="Like">
              <Heart />
            </IconButton>
          ))}
        </div>
      </div>
    </Section>
  );
}
