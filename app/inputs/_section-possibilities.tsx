import { EyeOff, User } from "lucide-react";
import { RowLabel, Section } from "@/components/showcase/primitives";
import { FloatingInput } from "@/components/ui/floating-input";
import { Input } from "@/components/ui/input";

export function PossibilitiesSection() {
  return (
    <Section title="Possibilities">
      <div className="flex flex-1 flex-col gap-[32px]">
        <Header />

        <Row label="Default">
          <Input defaultValue="This is my text" />
          <FloatingInput defaultValue="This is my text" />
        </Row>

        <Row label="Left Icon">
          <Input defaultValue="This is my text" leftIcon={<User />} />
          <FloatingInput defaultValue="This is my text" leftIcon={<User />} />
        </Row>

        <Row label="Right Icon">
          <Input defaultValue="This is my text" rightIcon={<EyeOff />} />
          <FloatingInput defaultValue="This is my text" rightIcon={<EyeOff />} />
        </Row>

        <Row label="Top label">
          <Input label="Label" placeholder="Type here" id="p-top" />
          <FloatingInput id="p-top-float" label="Label" placeholder="Type here" />
        </Row>

        <Row label="Top Right Label">
          <Input defaultValue="This is my text" topRightLabel="Top Right label" />
          <FloatingInput defaultValue="This is my text" topRightLabel="Top Right label" />
        </Row>

        <Row label="Bottom Text">
          <Input defaultValue="This is my text" bottomText="Bottom Left label" />
          <FloatingInput defaultValue="This is my text" bottomText="Bottom Left label" />
        </Row>

        <Row label="Bottom Right Text">
          <Input defaultValue="This is my text" bottomRightText="Bottom Right label" />
          <FloatingInput defaultValue="This is my text" bottomRightText="Bottom Right label" />
        </Row>
      </div>
    </Section>
  );
}

function Header() {
  return (
    <div className="flex items-start gap-[60px] pl-[140px]">
      <div className="w-[288px] text-[15px] font-medium leading-5 text-foreground">
        Default Input
      </div>
      <div className="w-[288px] text-[15px] font-medium leading-5 text-foreground">
        Floating Input
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  const [first, second] = Array.isArray(children) ? children : [children, null];
  return (
    <div className="flex items-center gap-[60px]">
      <RowLabel width={140}>{label}</RowLabel>
      <div className="w-[288px]">{first}</div>
      <div className="w-[288px]">{second}</div>
    </div>
  );
}
