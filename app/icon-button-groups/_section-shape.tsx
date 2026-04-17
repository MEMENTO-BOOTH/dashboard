import { Heart } from "lucide-react";
import { RowLabel, Section } from "@/components/showcase/primitives";
import { IconButton } from "@/components/ui/icon-button";
import { IconButtonGroup } from "@/components/ui/icon-button-group";

export function ShapeSection() {
  return (
    <Section title="Shape">
      <div className="flex flex-1 flex-col gap-[20px]">
        <div className="flex items-center gap-[50px]">
          <RowLabel>Default</RowLabel>
          <IconButtonGroup aria-label="Favorites group">
            <IconButton variant="soft" aria-label="Like 1">
              <Heart />
            </IconButton>
            <IconButton variant="soft" aria-label="Like 2">
              <Heart />
            </IconButton>
            <IconButton variant="soft" aria-label="Like 3">
              <Heart />
            </IconButton>
          </IconButtonGroup>
        </div>
      </div>
    </Section>
  );
}
