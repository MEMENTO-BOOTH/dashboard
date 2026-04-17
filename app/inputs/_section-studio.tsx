import { ColHeader, RowLabel, Section } from "@/components/showcase/primitives";
import { FloatingInput } from "@/components/ui/floating-input";
import { Input } from "@/components/ui/input";

export function StudioVariantsSection() {
  return (
    <Section title="Variants">
      <div className="flex flex-1 flex-col gap-[30px]">
        <div className="flex items-start gap-[40px] pl-[120px]">
          <div className="w-[288px]">
            <ColHeader>Default Input</ColHeader>
          </div>
          <div className="w-[288px]">
            <ColHeader>Floating Input</ColHeader>
          </div>
        </div>
        <div className="flex items-center gap-[40px]">
          <RowLabel width={120}>Default</RowLabel>
          <div className="w-[288px]">
            <Input placeholder="Type here" />
          </div>
          <div className="w-[288px]">
            <FloatingInput
              id="studio-float-1"
              label="Label"
              placeholder="Type here"
              topRightLabel="Top Right label"
            />
          </div>
        </div>
        <div className="flex items-center gap-[40px]">
          <RowLabel width={120}>Filled</RowLabel>
          <div className="w-[288px]">
            <Input defaultValue="This is my text" />
          </div>
          <div className="w-[288px]">
            <FloatingInput
              id="studio-float-2"
              label="Label"
              defaultValue="This is my text"
              topRightLabel="Top Right label"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

export function ShapeSection() {
  return (
    <Section title="Shape">
      <div className="flex flex-1 flex-col gap-[30px]">
        <div className="flex items-start gap-[40px] pl-[120px]">
          <div className="w-[288px]">
            <ColHeader>Default Input</ColHeader>
          </div>
          <div className="w-[288px]">
            <ColHeader>Floating Input</ColHeader>
          </div>
        </div>
        <div className="flex items-center gap-[40px]">
          <RowLabel width={120}>Rounded</RowLabel>
          <div className="w-[288px]">
            <Input shape="rounded" defaultValue="This is my text" />
          </div>
          <div className="w-[288px]">
            <FloatingInput
              id="shape-rounded"
              shape="rounded"
              label="Label"
              defaultValue="This is my text"
              topRightLabel="Top Right label"
            />
          </div>
        </div>
        <div className="flex items-center gap-[40px]">
          <RowLabel width={120}>Round</RowLabel>
          <div className="w-[288px]">
            <Input shape="round" defaultValue="This is my text" />
          </div>
          <div className="w-[288px]">
            <FloatingInput
              id="shape-round"
              shape="round"
              label="Label"
              defaultValue="This is my text"
              topRightLabel="Top Right label"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
