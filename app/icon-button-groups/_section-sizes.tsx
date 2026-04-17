import { Heart } from "lucide-react";
import { RowLabel, Section } from "@/components/showcase/primitives";
import { IconButton } from "@/components/ui/icon-button";
import { IconButtonGroup } from "@/components/ui/icon-button-group";

type Size = "lg" | "md" | "sm" | "xs";
const sizes: { key: Size; label: string }[] = [
  { key: "lg", label: "Large" },
  { key: "md", label: "Medium" },
  { key: "sm", label: "Small" },
  { key: "xs", label: "Ex.Small" },
];

export function SizesSection() {
  return (
    <Section title="Sizes">
      <div className="flex flex-1 flex-col gap-[20px]">
        {sizes.map((s) => (
          <div key={s.key} className="flex items-center gap-[50px]">
            <RowLabel>{s.label}</RowLabel>
            <IconButtonGroup aria-label={`Favorites ${s.label}`}>
              <IconButton variant="soft" size={s.key} aria-label="Like 1">
                <Heart />
              </IconButton>
              <IconButton variant="soft" size={s.key} aria-label="Like 2">
                <Heart />
              </IconButton>
              <IconButton variant="soft" size={s.key} aria-label="Like 3">
                <Heart />
              </IconButton>
            </IconButtonGroup>
          </div>
        ))}
      </div>
    </Section>
  );
}
