import { buttonVariants } from "@/components/ui/button-variants";
import { ExampleSection } from "./_section-example";
import { ShapeSection } from "./_section-shape";
import { SizesSection } from "./_section-sizes";
import { StatesSection } from "./_section-states";

export default function IconButtonGroupsPage() {
  return (
    <main className="mx-auto max-w-[1240px] space-y-[60px] px-10 py-12">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          shadcn studio · Figma Pro v5
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight">Icon Button Group</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Group multiple icon buttons together in a clean, organized layout for quick access and
          consistent alignment across your design.
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
        </nav>
      </header>

      <ShapeSection />
      <SizesSection />
      <StatesSection />
      <ExampleSection />
    </main>
  );
}
