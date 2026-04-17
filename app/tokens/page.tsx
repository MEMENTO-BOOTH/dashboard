type ColorToken = {
  name: string;
  hex: string;
  role: string;
  swatch: string;
  text?: string;
};

const base: ColorToken[] = [
  {
    name: "background",
    hex: "#FFFFFF",
    role: "white",
    swatch: "bg-background border border-border",
  },
  {
    name: "foreground",
    hex: "#302E33",
    role: "neutral-950",
    swatch: "bg-foreground",
    text: "text-background",
  },
];

const surfaces: ColorToken[] = [
  { name: "card", hex: "#FFFFFF", role: "white", swatch: "bg-card border border-border" },
  {
    name: "card-foreground",
    hex: "#302E33",
    role: "neutral-950",
    swatch: "bg-card-foreground",
    text: "text-background",
  },
  { name: "popover", hex: "#FFFFFF", role: "white", swatch: "bg-popover border border-border" },
  {
    name: "popover-foreground",
    hex: "#302E33",
    role: "neutral-950",
    swatch: "bg-popover-foreground",
    text: "text-background",
  },
];

const actions: ColorToken[] = [
  {
    name: "primary",
    hex: "#3C3A40",
    role: "neutral-900",
    swatch: "bg-primary",
    text: "text-primary-foreground",
  },
  {
    name: "primary-foreground",
    hex: "#F7F7F8",
    role: "neutral-50",
    swatch: "bg-primary-foreground border border-border",
  },
  {
    name: "secondary",
    hex: "#EFEEF0",
    role: "neutral-100",
    swatch: "bg-secondary border border-border",
  },
  {
    name: "secondary-foreground",
    hex: "#302E33",
    role: "neutral-950",
    swatch: "bg-secondary-foreground",
    text: "text-background",
  },
  { name: "accent", hex: "#EFEEF0", role: "neutral-100", swatch: "bg-accent border border-border" },
  {
    name: "accent-foreground",
    hex: "#3C3A40",
    role: "neutral-900",
    swatch: "bg-accent-foreground",
    text: "text-background",
  },
  {
    name: "destructive",
    hex: "#E03434",
    role: "red-600",
    swatch: "bg-destructive",
    text: "text-destructive-foreground",
  },
  {
    name: "destructive-foreground",
    hex: "#FFFAF5",
    role: "red-50",
    swatch: "bg-destructive-foreground border border-border",
  },
];

const neutral: ColorToken[] = [
  { name: "muted", hex: "#EFEEF0", role: "neutral-100", swatch: "bg-muted border border-border" },
  {
    name: "muted-foreground",
    hex: "#76717F",
    role: "neutral-500",
    swatch: "bg-muted-foreground",
    text: "text-background",
  },
  { name: "border", hex: "#DBD9DE", role: "neutral-200", swatch: "bg-border" },
  { name: "input", hex: "#DBD9DE", role: "neutral-200", swatch: "bg-input" },
  { name: "ring", hex: "#97929E", role: "neutral-400", swatch: "bg-ring" },
];

const status: ColorToken[] = [
  {
    name: "info",
    hex: "#0891B2",
    role: "cyan-600",
    swatch: "bg-info",
    text: "text-info-foreground",
  },
  {
    name: "info-foreground",
    hex: "#ECFEFF",
    role: "cyan-50",
    swatch: "bg-info-foreground border border-border",
  },
  {
    name: "success",
    hex: "#02B541",
    role: "green-600",
    swatch: "bg-success",
    text: "text-success-foreground",
  },
  {
    name: "success-foreground",
    hex: "#F0FCF8",
    role: "green-50",
    swatch: "bg-success-foreground border border-border",
  },
  {
    name: "warning",
    hex: "#E39219",
    role: "amber-900",
    swatch: "bg-warning",
    text: "text-warning-foreground",
  },
  {
    name: "warning-foreground",
    hex: "#FFFDF5",
    role: "amber-100",
    swatch: "bg-warning-foreground border border-border",
  },
];

const charts: ColorToken[] = [
  { name: "chart-1", hex: "#EA580C", role: "orange-600", swatch: "bg-chart-1" },
  { name: "chart-2", hex: "#0D9488", role: "teal-600", swatch: "bg-chart-2" },
  { name: "chart-3", hex: "#164E63", role: "cyan-900", swatch: "bg-chart-3" },
  { name: "chart-4", hex: "#FCCB60", role: "amber-400", swatch: "bg-chart-4" },
  { name: "chart-5", hex: "#FCAA1D", role: "amber-500", swatch: "bg-chart-5" },
];

const sidebar: ColorToken[] = [
  {
    name: "sidebar",
    hex: "#F7F7F8",
    role: "neutral-50",
    swatch: "bg-sidebar border border-border",
  },
  {
    name: "sidebar-foreground",
    hex: "#302E33",
    role: "neutral-950",
    swatch: "bg-sidebar-foreground",
    text: "text-background",
  },
  {
    name: "sidebar-primary",
    hex: "#3C3A40",
    role: "neutral-900",
    swatch: "bg-sidebar-primary",
    text: "text-background",
  },
  {
    name: "sidebar-accent",
    hex: "#EFEEF0",
    role: "neutral-100",
    swatch: "bg-sidebar-accent border border-border",
  },
  { name: "sidebar-border", hex: "#DBD9DE", role: "neutral-200", swatch: "bg-sidebar-border" },
  { name: "sidebar-ring", hex: "#97929E", role: "neutral-400", swatch: "bg-sidebar-ring" },
];

function Swatch({ token }: { token: ColorToken }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`${token.swatch} ${token.text ?? ""} flex h-20 items-end justify-start rounded-[10px] p-3`}
      >
        <span className="font-mono text-[11px] tracking-tight">{token.hex}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <code className="font-mono text-[13px] font-medium">{token.name}</code>
        <span className="text-muted-foreground text-[11px]">{token.role}</span>
      </div>
    </div>
  );
}

function Section({ title, tokens }: { title: string; tokens: ColorToken[] }) {
  return (
    <section className="space-y-4">
      <h2 className="font-heading text-[15px] font-semibold tracking-tight">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {tokens.map((t) => (
          <Swatch key={t.name} token={t} />
        ))}
      </div>
    </section>
  );
}

type TypeRow = {
  label: string;
  sample: string;
  className: string;
  meta: string;
};

const headings: TypeRow[] = [
  {
    label: "H1",
    sample: "The quick brown fox",
    className: "text-4xl leading-10 font-bold",
    meta: "text-4xl · 36px / 40px",
  },
  {
    label: "H2",
    sample: "The quick brown fox",
    className: "text-3xl leading-9 font-semibold",
    meta: "text-3xl · 30px / 36px",
  },
  {
    label: "H3",
    sample: "The quick brown fox",
    className: "text-2xl leading-8 font-semibold",
    meta: "text-2xl · 24px / 32px",
  },
  {
    label: "H4",
    sample: "The quick brown fox",
    className: "text-xl leading-[1.625rem] font-semibold",
    meta: "text-xl · 20px / 26px",
  },
  {
    label: "H5",
    sample: "The quick brown fox",
    className: "text-lg leading-6 font-medium",
    meta: "text-lg · 18px / 24px",
  },
  {
    label: "H6",
    sample: "The quick brown fox",
    className: "text-base leading-[1.375rem] font-medium",
    meta: "text-base · 16px / 22px",
  },
];

const bodyRows: TypeRow[] = [
  {
    label: "Body",
    sample: "Paragraphe standard — The quick brown fox jumps over the lazy dog.",
    className: "text-sm leading-5",
    meta: "text-sm · 14px / 20px",
  },
  {
    label: "Small",
    sample: "Texte secondaire — The quick brown fox jumps over the lazy dog.",
    className: "text-xs leading-4",
    meta: "text-xs · 12px / 16px",
  },
];

const displayRows: TypeRow[] = [
  {
    label: "5xl",
    sample: "Display 5xl",
    className: "text-5xl font-bold leading-tight",
    meta: "text-5xl · 48px",
  },
  {
    label: "6xl",
    sample: "Display 6xl",
    className: "text-6xl font-bold leading-tight",
    meta: "text-6xl · 60px",
  },
  {
    label: "7xl",
    sample: "Display 7xl",
    className: "text-7xl font-bold leading-tight",
    meta: "text-7xl · 72px",
  },
  {
    label: "8xl",
    sample: "Display 8xl",
    className: "text-8xl font-bold leading-none",
    meta: "text-8xl · 96px",
  },
  {
    label: "9xl",
    sample: "Display 9xl",
    className: "text-9xl font-bold leading-none",
    meta: "text-9xl · 128px",
  },
];

const weights = [
  { label: "Light 300", className: "font-light" },
  { label: "Regular 400", className: "font-normal" },
  { label: "Medium 500", className: "font-medium" },
  { label: "Semibold 600", className: "font-semibold" },
  { label: "Bold 700", className: "font-bold" },
];

const radiusTokens = [
  { name: "none", px: "0px", className: "rounded-none" },
  { name: "xs", px: "2px", className: "rounded-xs" },
  { name: "sm", px: "6px", className: "rounded-sm" },
  { name: "md", px: "8px", className: "rounded-md" },
  { name: "lg", px: "10px", className: "rounded-lg" },
  { name: "xl", px: "14px", className: "rounded-xl" },
  { name: "full", px: "9999px", className: "rounded-full" },
];

const shadowTokens = [
  { name: "2xs", className: "shadow-2xs", meta: "0 1px 0" },
  { name: "xs", className: "shadow-xs", meta: "0 1px 2px" },
  { name: "sm", className: "shadow-sm", meta: "0 1px 3px" },
  { name: "md", className: "shadow-md", meta: "0 4px 6px" },
  { name: "lg", className: "shadow-lg", meta: "0 10px 15px" },
  { name: "xl", className: "shadow-xl", meta: "0 20px 25px" },
  { name: "2xl", className: "shadow-2xl", meta: "0 25px 50px" },
];

const coloredShadowTokens = [
  { name: "shadow-primary", className: "[box-shadow:var(--shadow-primary)]" },
  { name: "shadow-secondary", className: "[box-shadow:var(--shadow-secondary)]" },
  { name: "shadow-accent", className: "[box-shadow:var(--shadow-accent)]" },
  { name: "shadow-info", className: "[box-shadow:var(--shadow-info)]" },
  { name: "shadow-success", className: "[box-shadow:var(--shadow-success)]" },
  { name: "shadow-warning", className: "[box-shadow:var(--shadow-warning)]" },
  { name: "shadow-destructive", className: "[box-shadow:var(--shadow-destructive)]" },
];

function TypeSection() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h2 className="font-heading text-[15px] font-semibold tracking-tight">
          Headings · <span className="text-muted-foreground font-sans font-normal">Inter</span>
        </h2>
        <div className="divide-border border-border divide-y rounded-[10px] border">
          {headings.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-6 p-4">
              <div className="flex items-baseline gap-6">
                <code className="text-muted-foreground w-10 font-mono text-xs">{row.label}</code>
                <span className={row.className}>{row.sample}</span>
              </div>
              <span className="text-muted-foreground font-mono text-[11px]">{row.meta}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-heading text-[15px] font-semibold tracking-tight">
          Body · <span className="text-muted-foreground font-sans font-normal">Inter</span>
        </h2>
        <div className="divide-border border-border divide-y rounded-[10px] border">
          {bodyRows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-6 p-4">
              <div className="flex items-baseline gap-6">
                <code className="text-muted-foreground w-10 font-mono text-xs">{row.label}</code>
                <span className={row.className}>{row.sample}</span>
              </div>
              <span className="text-muted-foreground font-mono text-[11px]">{row.meta}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-heading text-[15px] font-semibold tracking-tight">
          Display · <span className="text-muted-foreground font-sans font-normal">Inter Bold</span>
        </h2>
        <div className="divide-border border-border divide-y rounded-[10px] border">
          {displayRows.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-6 overflow-hidden p-4"
            >
              <div className="flex items-baseline gap-6">
                <code className="text-muted-foreground w-10 font-mono text-xs">{row.label}</code>
                <span className={row.className}>{row.sample}</span>
              </div>
              <span className="text-muted-foreground font-mono text-[11px] whitespace-nowrap">
                {row.meta}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-heading text-[15px] font-semibold tracking-tight">
          Weights · <span className="text-muted-foreground font-sans font-normal">Inter</span>
        </h2>
        <div className="divide-border border-border divide-y rounded-[10px] border">
          {weights.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-6 p-4">
              <span className={`text-lg ${row.className}`}>
                The quick brown fox jumps over the lazy dog
              </span>
              <code className="text-muted-foreground font-mono text-[11px]">{row.label}</code>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-heading text-[15px] font-semibold tracking-tight">
          Monospace ·{" "}
          <span className="text-muted-foreground font-sans font-normal">JetBrains Mono</span>
        </h2>
        <div className="border-border rounded-[10px] border p-4">
          <pre className="font-mono text-sm leading-6">
            <code className="text-muted-foreground">{"// transactions.ts\n"}</code>
            <code>const transaction = {"{"}</code>
            {"\n"}
            <code>{"  "}id: &quot;tx_01H9PK3&quot;,</code>
            {"\n"}
            <code>{"  "}montant: 3.0,</code>
            {"\n"}
            <code>{"  "}paiement_at: &quot;2026-04-14T16:33:05Z&quot;,</code>
            {"\n"}
            <code>{"}"};</code>
          </pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-heading text-[15px] font-semibold tracking-tight">
          Heading font · <span className="text-muted-foreground font-sans font-normal">Outfit</span>
        </h2>
        <div className="border-border space-y-3 rounded-[10px] border p-8">
          <p className="font-heading text-5xl leading-tight font-bold">Section Title</p>
          <p className="font-heading text-3xl font-semibold">Titres de sections Figma</p>
          <p className="font-heading text-xl font-medium">Usage limité — accent éditorial</p>
        </div>
      </div>
    </section>
  );
}

function RadiusSection() {
  return (
    <section className="space-y-4">
      <h2 className="font-heading text-[15px] font-semibold tracking-tight">Border radius</h2>
      <div className="flex flex-wrap gap-6">
        {radiusTokens.map((token) => (
          <div key={token.name} className="flex flex-col items-center gap-2">
            <div
              className={`bg-muted border-border flex h-24 w-24 items-center justify-center border ${token.className}`}
            >
              <span className="text-muted-foreground font-mono text-[11px]">{token.px}</span>
            </div>
            <code className="font-mono text-xs">rounded-{token.name}</code>
          </div>
        ))}
      </div>
    </section>
  );
}

function ShadowSection() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h2 className="font-heading text-[15px] font-semibold tracking-tight">Shadows</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {shadowTokens.map((token) => (
            <div key={token.name} className="flex flex-col items-center gap-3">
              <div
                className={`bg-card border-border h-20 w-full rounded-[10px] border ${token.className}`}
              />
              <div className="flex flex-col items-center gap-0.5">
                <code className="font-mono text-xs">shadow-{token.name}</code>
                <span className="text-muted-foreground font-mono text-[10px]">{token.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-heading text-[15px] font-semibold tracking-tight">Colored variants</h3>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {coloredShadowTokens.map((token) => (
            <div key={token.name} className="flex flex-col items-center gap-3">
              <div
                className={`bg-card border-border h-20 w-full rounded-[10px] border ${token.className}`}
              />
              <code className="font-mono text-[11px]">{token.name}</code>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-[1200px] px-8 py-12">
      <header className="mb-12 space-y-2">
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
          shadcn studio · Figma Pro v5
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight">Design tokens</h1>
        <p className="text-muted-foreground text-sm">
          Palette, typographie, radius et shadows — extrait exact du kit Figma (fileKey
          FBfqfCzhFRVK4aC8nDNivA).
        </p>
        <nav className="flex gap-3 pt-4">
          <a
            href="/buttons"
            className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 font-medium text-primary-foreground text-sm transition-all hover:bg-primary/90"
          >
            Voir les boutons →
          </a>
        </nav>
      </header>

      <div className="space-y-14">
        <Section title="Base" tokens={base} />
        <Section title="Surfaces (Cards & Popovers)" tokens={surfaces} />
        <Section title="Actions principales" tokens={actions} />
        <Section title="UI neutre" tokens={neutral} />
        <Section title="Statuts" tokens={status} />
        <Section title="Charts" tokens={charts} />
        <Section title="Sidebar" tokens={sidebar} />

        <div className="border-border border-t pt-14">
          <TypeSection />
        </div>

        <div className="border-border border-t pt-14">
          <RadiusSection />
        </div>

        <div className="border-border border-t pt-14">
          <ShadowSection />
        </div>
      </div>
    </main>
  );
}
