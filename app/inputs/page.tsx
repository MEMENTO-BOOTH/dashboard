import { buttonVariants } from "@/components/ui/button-variants";
import { PossibilitiesSection } from "./_section-possibilities";
import { SizesSection } from "./_section-sizes";
import { StateSection } from "./_section-state";
import { ShapeSection, StudioVariantsSection } from "./_section-studio";
import { ExamplesSection, VariantsBaseSection } from "./_section-variants";

export default function InputsPage() {
  return (
    <main className="mx-auto max-w-[1240px] space-y-[60px] px-10 py-12">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          shadcn studio · Figma Pro v5
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight">Text Input</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Refined text inputs with subtle adjustments that cover a wide range of design needs and
          interaction scenarios.
        </p>
        <nav className="flex gap-3 pt-4">
          <a href="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
            ← Tokens
          </a>
          <a href="/buttons" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Button
          </a>
          <a href="/icon-buttons" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Icon Button
          </a>
          <a
            href="/icon-button-groups"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Icon Button Group
          </a>
        </nav>
      </header>

      <VariantsBaseSection />
      <ExamplesSection />
      <StudioVariantsSection />
      <ShapeSection />
      <StateSection />
      <SizesSection />
      <PossibilitiesSection />
    </main>
  );
}
