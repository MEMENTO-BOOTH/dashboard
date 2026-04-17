import { ArrowRight, Check, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";

type Size = "xs" | "sm" | "md" | "lg";

const sizes: { key: Size; label: string }[] = [
  { key: "lg", label: "Large" },
  { key: "md", label: "Medium" },
  { key: "sm", label: "Small" },
  { key: "xs", label: "Extra Small" },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-foreground font-['Inter'] text-[20px] leading-[20px] font-semibold">
      {children}
    </p>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full items-start gap-[20px] rounded-[12px] border border-dashed border-[rgba(23,23,23,0.2)] p-[30px]">
      {children}
    </div>
  );
}

function LeftLabels({ labels }: { labels: string[] }) {
  return (
    <div className="flex w-[88px] shrink-0 flex-col items-end pt-[89px] text-right">
      {labels.map((l, i) => (
        <div
          key={l}
          className="text-foreground h-[65px] font-['Inter'] text-[15px] leading-[20px] font-medium"
          style={{ marginTop: i === 0 ? 0 : 0 }}
        >
          {l}
        </div>
      ))}
    </div>
  );
}

function HeaderRow({ columns, gap }: { columns: string[]; gap: number }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <div className="flex items-center" style={{ gap: `${gap}px` }}>
        {columns.map((c) => (
          <div
            key={c}
            className="text-foreground font-['Inter'] text-[15px] leading-[20px] font-medium"
          >
            {c}
          </div>
        ))}
      </div>
      <div className="border-border border-t border-dashed" />
    </div>
  );
}

function SmallBadge() {
  return (
    <span className="bg-primary-foreground/15 text-primary-foreground rounded-full px-[6px] py-[2px] font-['Inter'] text-[12px] leading-[16px] font-medium">
      Badge
    </span>
  );
}

export default function ButtonsPage() {
  return (
    <main className="mx-auto max-w-[1240px] space-y-[60px] px-10 py-12">
      <header className="space-y-2">
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
          shadcn studio · Figma Pro v5
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight">Button</h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Reproduction pixel-perfect des 4 sections Figma : Examples, Variants, Sizes, Colors.
        </p>
        <nav className="flex gap-3 pt-4">
          <a href="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
            ← Tokens
          </a>
          <a href="/buttons/addons" className={buttonVariants({ variant: "primary", size: "sm" })}>
            23 addons →
          </a>
          <a href="/icon-buttons" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Icon Button →
          </a>
        </nav>
      </header>

      {/* ============= 1. EXAMPLES ============= */}
      <section className="flex flex-col gap-[14px]">
        <SectionHeading>Examples</SectionHeading>
        <Frame>
          <LeftLabels labels={["Variants"]} />
          <div className="flex flex-[1_0_0] flex-col gap-[20px]">
            <HeaderRow
              columns={["Primary", "Secondary", "Destructive", "Outline", "With Icon", "Ghost"]}
              gap={50}
            />
            <div className="flex items-center gap-[50px]">
              <Button>Button</Button>
              <Button variant="secondary">Button</Button>
              <Button variant="destructive">Button</Button>
              <Button variant="outline">Button</Button>
              <Button iconStart={<Plus />}>Button</Button>
              <Button variant="ghost">Button</Button>
            </div>
          </div>
        </Frame>
      </section>

      {/* ============= 2. VARIANTS ============= */}
      <section className="flex flex-col gap-[14px]">
        <SectionHeading>Variants</SectionHeading>
        <Frame>
          <LeftLabels labels={["Variants"]} />
          <div className="flex flex-[1_0_0] flex-col gap-[20px]">
            <HeaderRow
              columns={["Gradient", "Soft", "Right icon", "Both icon", "Badge"]}
              gap={50}
            />
            <div className="flex items-center gap-[50px]">
              <Button variant="gradient">Button</Button>
              <Button variant="soft">Button</Button>
              <Button iconEnd={<ArrowRight />}>Button</Button>
              <Button iconStart={<Plus />} iconEnd={<ChevronRight />}>
                Button
              </Button>
              <Button badge={<SmallBadge />}>Button</Button>
            </div>
          </div>
        </Frame>
      </section>

      {/* ============= 3. SIZES ============= */}
      <section className="flex flex-col gap-[14px]">
        <SectionHeading>Sizes</SectionHeading>
        <Frame>
          <LeftLabels
            labels={["Gradient", "Secondary", "Destructive", "Outline", "Solid", "Ghost"]}
          />
          <div className="flex flex-[1_0_0] flex-col gap-[20px]">
            <HeaderRow columns={sizes.map((s) => s.label)} gap={49} />
            <div className="flex flex-col gap-[20px]">
              <div className="flex items-center gap-[49px]">
                {sizes.map((s) => (
                  <Button key={s.key} variant="gradient" size={s.key}>
                    Button
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-[49px]">
                {sizes.map((s) => (
                  <Button key={s.key} variant="secondary" size={s.key}>
                    Button
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-[49px]">
                {sizes.map((s) => (
                  <Button key={s.key} variant="destructive" size={s.key}>
                    Button
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-[49px]">
                {sizes.map((s) => (
                  <Button key={s.key} variant="outline" size={s.key}>
                    Button
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-[49px]">
                {sizes.map((s) => (
                  <Button key={s.key} size={s.key}>
                    Button
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-[49px]">
                {sizes.map((s) => (
                  <Button key={s.key} variant="ghost" size={s.key}>
                    Button
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Frame>
      </section>

      {/* ============= 4. COLORS ============= */}
      <section className="flex flex-col gap-[14px]">
        <SectionHeading>Colors</SectionHeading>
        <Frame>
          <LeftLabels labels={["Gradient", "Solid", "Outline", "With Icon", "Ghost"]} />
          <div className="flex flex-[1_0_0] flex-col gap-[30px]">
            <HeaderRow columns={["Info", "Success", "Warning"]} gap={38} />
            <div className="flex items-center gap-[38px]">
              <Button variant="gradient" color="info">
                Button
              </Button>
              <Button variant="gradient" color="success">
                Submit
              </Button>
              <Button variant="gradient" color="warning">
                Cancel
              </Button>
            </div>
            <div className="flex items-center gap-[38px]">
              <Button color="info">Button</Button>
              <Button color="success">Button</Button>
              <Button color="warning">Button</Button>
            </div>
            <div className="flex items-center gap-[38px]">
              <Button variant="outline" color="info">
                Button
              </Button>
              <Button variant="outline" color="success">
                Button
              </Button>
              <Button variant="outline" color="warning">
                Button
              </Button>
            </div>
            <div className="flex items-center gap-[38px]">
              <Button variant="soft" color="info" iconStart={<Check />}>
                Button
              </Button>
              <Button variant="soft" color="success" iconStart={<Check />}>
                Button
              </Button>
              <Button variant="soft" color="warning" iconStart={<Check />}>
                Button
              </Button>
            </div>
            <div className="flex items-center gap-[38px]">
              <Button variant="ghost" color="info">
                Button
              </Button>
              <Button variant="ghost" color="success">
                Button
              </Button>
              <Button variant="ghost" color="warning">
                Button
              </Button>
            </div>
          </div>
        </Frame>
      </section>
    </main>
  );
}
