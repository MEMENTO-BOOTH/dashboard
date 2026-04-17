export type Variant = "outline" | "gradient" | "solid" | "soft" | "ghost";
export type Size = "lg" | "md" | "sm" | "xs";
export type SemanticColor = "info" | "success" | "warning" | "destructive";

export const allVariants: Variant[] = ["outline", "gradient", "solid", "soft", "ghost"];
export const allSizes: { key: Size; label: string }[] = [
  { key: "lg", label: "Large" },
  { key: "md", label: "Medium" },
  { key: "sm", label: "Small" },
  { key: "xs", label: "Extra Small" },
];
export const allColors: SemanticColor[] = ["info", "success", "warning", "destructive"];

export function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-['Inter'] text-[20px] font-semibold leading-[20px] text-foreground">
      {children}
    </p>
  );
}

export function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full items-start gap-[20px] rounded-[12px] border border-dashed border-[rgba(23,23,23,0.2)] p-[30px]">
      {children}
    </div>
  );
}

export function RowLabel({ children, width = 88 }: { children: React.ReactNode; width?: number }) {
  return (
    <div
      className="shrink-0 pr-4 text-right font-['Inter'] text-[15px] font-medium leading-[20px] text-foreground"
      style={{ width }}
    >
      {children}
    </div>
  );
}

export function ColHeader({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-['Inter'] text-[15px] font-medium leading-[20px] text-foreground">
      {children}
    </span>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-[14px]">
      <SectionTitle>{title}</SectionTitle>
      <Frame>{children}</Frame>
    </section>
  );
}
