import { Heart } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { ColHeader, RowLabel, Section } from "./_parts";

export function VariantsBaseSection() {
  return (
    <Section title="Variants">
      <div className="flex flex-1 flex-col gap-[20px]">
        <div className="flex items-center gap-[50px] pl-[100px]">
          <ColHeader>Outline</ColHeader>
        </div>
        <div className="flex items-center gap-[50px]">
          <RowLabel>Variants</RowLabel>
          <IconButton variant="outline" aria-label="Like">
            <Heart />
          </IconButton>
        </div>
      </div>
    </Section>
  );
}

export function StudioVariantsSection() {
  return (
    <Section title="ShadCN Studio Variants">
      <div className="flex flex-1 flex-col gap-[20px]">
        <div className="flex items-center gap-[50px] pl-[100px]">
          <ColHeader>Gradient</ColHeader>
          <ColHeader>Solid</ColHeader>
          <ColHeader>Soft</ColHeader>
          <ColHeader>Ghost</ColHeader>
        </div>
        <div className="flex items-center gap-[50px]">
          <RowLabel>Variants</RowLabel>
          <IconButton variant="gradient" aria-label="Like">
            <Heart />
          </IconButton>
          <IconButton variant="solid" aria-label="Like">
            <Heart />
          </IconButton>
          <IconButton variant="soft" aria-label="Like">
            <Heart />
          </IconButton>
          <IconButton variant="ghost" aria-label="Like">
            <Heart />
          </IconButton>
        </div>
      </div>
    </Section>
  );
}
