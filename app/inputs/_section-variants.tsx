import { ColHeader, Section } from "@/components/showcase/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function VariantsBaseSection() {
  return (
    <Section title="Variants">
      <div className="flex flex-1 flex-wrap gap-10 items-end">
        <Field header="Default input">
          <Input placeholder="Type here" />
        </Field>
        <Field header="Disabled input">
          <Input placeholder="Type here" disabled />
        </Field>
        <Field header="With Label">
          <Input label="Label" placeholder="Type here" id="with-label" />
        </Field>
        <Field header="File">
          <Input type="file" id="file-input" />
        </Field>
      </div>
    </Section>
  );
}

export function ExamplesSection() {
  return (
    <Section title="Examples">
      <div className="flex flex-1 flex-wrap gap-12 items-end">
        <Field header="With Button" width={240}>
          <div className="flex items-center gap-2">
            <Input placeholder="Type here" />
            <Button>Button</Button>
          </div>
        </Field>
        <Field header="Form" width={288}>
          <Input
            label="User Name"
            placeholder="Type here"
            bottomText="This is your public display name."
            id="user-name"
          />
          <div className="pt-6">
            <Button>Submit</Button>
          </div>
        </Field>
      </div>
    </Section>
  );
}

function Field({
  header,
  children,
  width = 288,
}: {
  header: string;
  children: React.ReactNode;
  width?: number;
}) {
  return (
    <div className="flex flex-col gap-3" style={{ width }}>
      <ColHeader>{header}</ColHeader>
      {children}
    </div>
  );
}
