import { cva, type VariantProps } from "class-variance-authority";

export const iconButtonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center select-none",
    "transition-all outline-none",
    "focus-visible:ring-[3px] focus-visible:ring-ring/40",
    "active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
  ],
  {
    variants: {
      variant: {
        outline: "bg-background border border-input text-foreground shadow-xs hover:bg-muted",
        gradient: "bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90",
        solid: "bg-primary text-primary-foreground overflow-clip hover:bg-primary/90",
        soft: "bg-primary/10 text-foreground hover:bg-primary/15",
        ghost: "bg-transparent text-foreground hover:bg-muted",
      },
      color: {
        default: "",
        info: "",
        success: "",
        warning: "",
        destructive: "",
      },
      size: {
        xs: "p-1.5",
        sm: "p-2",
        md: "p-2.5",
        lg: "p-3",
      },
      shape: {
        square: "",
        rounded: "rounded-full",
      },
    },
    compoundVariants: [
      // ---------- Square radius per variant (Figma v5) ----------
      { variant: "outline", shape: "square", className: "rounded-[10px]" },
      { variant: "gradient", shape: "square", className: "rounded-md" },
      { variant: "solid", shape: "square", className: "rounded-[10px]" },
      { variant: "soft", shape: "square", className: "rounded-[10px]" },
      { variant: "ghost", shape: "square", className: "rounded-[10px]" },

      // ---------- Rounded shape extras ----------
      { variant: "outline", shape: "rounded", className: "border-primary shadow-sm" },
      {
        variant: "gradient",
        shape: "rounded",
        className: "border-[2px] border-primary shadow-sm",
      },
      { variant: "solid", shape: "rounded", className: "shadow-sm" },

      // ---------- Info color ----------
      {
        variant: "outline",
        color: "info",
        className: "border-info text-info hover:bg-info/10",
      },
      {
        variant: "gradient",
        color: "info",
        className: "bg-[image:var(--gradient-info)] text-white",
      },
      {
        variant: "solid",
        color: "info",
        className: "bg-info text-white hover:bg-info/90",
      },
      {
        variant: "soft",
        color: "info",
        className: "bg-info/10 text-info hover:bg-info/15",
      },
      { variant: "ghost", color: "info", className: "text-info hover:bg-info/10" },

      // ---------- Success color ----------
      {
        variant: "outline",
        color: "success",
        className: "border-success text-success hover:bg-success/10",
      },
      {
        variant: "gradient",
        color: "success",
        className: "bg-[image:var(--gradient-success)] text-white",
      },
      {
        variant: "solid",
        color: "success",
        className: "bg-success text-white hover:bg-success/90",
      },
      {
        variant: "soft",
        color: "success",
        className: "bg-success/10 text-success hover:bg-success/15",
      },
      { variant: "ghost", color: "success", className: "text-success hover:bg-success/10" },

      // ---------- Warning color ----------
      {
        variant: "outline",
        color: "warning",
        className: "border-warning text-warning hover:bg-warning/10",
      },
      {
        variant: "gradient",
        color: "warning",
        className: "bg-[image:var(--gradient-warning)] text-white",
      },
      {
        variant: "solid",
        color: "warning",
        className: "bg-warning text-white hover:bg-warning/90",
      },
      {
        variant: "soft",
        color: "warning",
        className: "bg-warning/10 text-warning hover:bg-warning/15",
      },
      { variant: "ghost", color: "warning", className: "text-warning hover:bg-warning/10" },

      // ---------- Destructive color ----------
      {
        variant: "outline",
        color: "destructive",
        className: "border-destructive text-destructive hover:bg-destructive/10",
      },
      {
        variant: "gradient",
        color: "destructive",
        className: "bg-[image:var(--gradient-destructive)] text-white",
      },
      {
        variant: "solid",
        color: "destructive",
        className: "bg-destructive text-white hover:bg-destructive/90",
      },
      {
        variant: "soft",
        color: "destructive",
        className: "bg-destructive/10 text-destructive hover:bg-destructive/15",
      },
      {
        variant: "ghost",
        color: "destructive",
        className: "text-destructive hover:bg-destructive/10",
      },
    ],
    defaultVariants: {
      variant: "solid",
      color: "default",
      size: "md",
      shape: "square",
    },
  },
);

export type IconButtonVariantProps = VariantProps<typeof iconButtonVariants>;
