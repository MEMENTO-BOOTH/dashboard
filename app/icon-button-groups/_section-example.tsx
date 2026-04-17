import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ChevronLeft,
  ChevronRight,
  Eraser,
  Grid2x2,
  Grid2x2Check,
  Grid3x3,
  Paintbrush,
  Scissors,
  Shapes,
} from "lucide-react";
import { RowLabel, Section } from "@/components/showcase/primitives";
import { IconButton } from "@/components/ui/icon-button";
import { IconButtonGroup } from "@/components/ui/icon-button-group";

export function ExampleSection() {
  return (
    <Section title="Example With Variants">
      <div className="flex flex-1 flex-col gap-[20px]">
        <div className="flex items-center gap-[50px]">
          <RowLabel width={120}>Align Group</RowLabel>
          <IconButtonGroup aria-label="Align">
            <IconButton variant="soft" aria-label="Align left">
              <AlignLeft />
            </IconButton>
            <IconButton variant="soft" aria-label="Align center">
              <AlignCenter />
            </IconButton>
            <IconButton variant="soft" aria-label="Align right">
              <AlignRight />
            </IconButton>
          </IconButtonGroup>
        </div>

        <div className="flex items-center gap-[50px]">
          <RowLabel width={120}>Right Left Group</RowLabel>
          <IconButtonGroup aria-label="Navigation">
            <IconButton variant="soft" aria-label="Previous">
              <ChevronLeft />
            </IconButton>
            <IconButton variant="soft" aria-label="Next">
              <ChevronRight />
            </IconButton>
          </IconButtonGroup>
        </div>

        <div className="flex items-center gap-[50px]">
          <RowLabel width={120}>Tool Group</RowLabel>
          <IconButtonGroup aria-label="Tools">
            <IconButton variant="soft" aria-label="Cut">
              <Scissors />
            </IconButton>
            <IconButton variant="soft" aria-label="Shapes">
              <Shapes />
            </IconButton>
            <IconButton variant="soft" aria-label="Paint">
              <Paintbrush />
            </IconButton>
            <IconButton variant="soft" aria-label="Erase">
              <Eraser />
            </IconButton>
          </IconButtonGroup>
        </div>

        <div className="flex items-center gap-[50px]">
          <RowLabel width={120}>Grid Group</RowLabel>
          <IconButtonGroup aria-label="Grid layout">
            <IconButton variant="soft" aria-label="2 columns">
              <Grid2x2 />
            </IconButton>
            <IconButton variant="soft" aria-label="3 columns">
              <Grid3x3 />
            </IconButton>
            <IconButton variant="soft" aria-label="Grid check">
              <Grid2x2Check />
            </IconButton>
          </IconButtonGroup>
        </div>
      </div>
    </Section>
  );
}
