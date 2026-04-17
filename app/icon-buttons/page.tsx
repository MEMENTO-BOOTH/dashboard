import { buttonVariants } from "@/components/ui/button-variants";
import { ColorsSection } from "./_section-colors";
import { ExampleSection } from "./_section-example";
import { ShapeSection } from "./_section-shape";
import { SizesSection } from "./_section-sizes";
import { StudioVariantsSection, VariantsBaseSection } from "./_section-variants";

export default function IconButtonsPage() {
  return (
    <main className="mx-auto max-w-[1240px] space-y-[60px] px-10 py-12">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          shadcn studio · Figma Pro v5
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight">Icon Button</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Use custom icon button styles for actions in forms, dialogs, and more with support for
          multiple sizes, states, and shapes.
        </p>
        <nav className="flex gap-3 pt-4">
          <a href="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
            ← Tokens
          </a>
          <a href="/buttons" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Button
          </a>
          <a href="/buttons/addons" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Addons
          </a>
          <a
            href="/icon-button-groups"
            className={buttonVariants({ variant: "primary", size: "sm" })}
          >
            Icon Button Group →
          </a>
        </nav>
      </header>

      <VariantsBaseSection />
      <StudioVariantsSection />
      <ShapeSection />
      <SizesSection />
      <ColorsSection />
      <ExampleSection />
    </main>
  );
}
