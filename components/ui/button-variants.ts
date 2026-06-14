import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap select-none",
    "transition-all outline-none",
    "focus-visible:ring-[3px] focus-visible:ring-ring/40",
    "active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground border border-secondary hover:bg-secondary/70",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "bg-background text-foreground border border-border shadow-xs hover:bg-muted",
        ghost: "bg-transparent text-primary hover:bg-muted",
        gradient: "text-primary-foreground bg-[image:var(--gradient-primary)] hover:opacity-90",
        soft: "bg-primary/10 text-primary hover:bg-primary/20",
        link: "bg-transparent text-primary underline-offset-4 hover:underline",
      },
      color: {
        default: "",
        info: "",
        success: "",
        warning: "",
      },
      size: {
        xs: "h-7 px-2 py-1 text-xs gap-1.5 rounded-md [&_svg]:size-3.5",
        sm: "h-8 px-3 py-1.5 text-sm gap-1.5 rounded-md [&_svg]:size-4",
        md: "h-9 px-4 py-2 text-sm gap-2 rounded-md [&_svg]:size-4",
        lg: "h-10 px-6 py-2.5 text-sm gap-2 rounded-md [&_svg]:size-4",
        icon: "size-9 rounded-md [&_svg]:size-4",
      },
    },
    compoundVariants: [
      // primary semantic colors
      { variant: "primary", color: "info", className: "bg-info text-info-foreground hover:bg-info/90" },
      { variant: "primary", color: "success", className: "bg-success text-success-foreground hover:bg-success/90" },
      { variant: "primary", color: "warning", className: "bg-warning text-warning-foreground hover:bg-warning/90" },
      // outline semantic colors
      { variant: "outline", color: "info", className: "border-info text-info hover:bg-info/10" },
      { variant: "outline", color: "success", className: "border-success text-success hover:bg-success/10" },
      { variant: "outline", color: "warning", className: "border-warning text-warning hover:bg-warning/10" },
      // ghost semantic colors (Figma: radius 10px)
      { variant: "ghost", color: "info", className: "text-info hover:bg-info/10 rounded-lg" },
      { variant: "ghost", color: "success", className: "text-success hover:bg-success/10 rounded-lg" },
      { variant: "ghost", color: "warning", className: "text-warning hover:bg-warning/10 rounded-lg" },
      // soft semantic colors (Figma: radius 10px)
      { variant: "soft", color: "info", className: "bg-info/10 text-info hover:bg-info/20 rounded-lg" },
      { variant: "soft", color: "success", className: "bg-success/10 text-success hover:bg-success/20 rounded-lg" },
      { variant: "soft", color: "warning", className: "bg-warning/10 text-warning hover:bg-warning/20 rounded-lg" },
      // gradient semantic colors
      { variant: "gradient", color: "info", className: "bg-[image:var(--gradient-info)] text-white" },
      { variant: "gradient", color: "success", className: "bg-[image:var(--gradient-success)] text-white" },
      { variant: "gradient", color: "warning", className: "bg-[image:var(--gradient-warning)] text-white" },
      // link semantic colors
      { variant: "link", color: "info", className: "text-info" },
      { variant: "link", color: "success", className: "text-success" },
      { variant: "link", color: "warning", className: "text-warning" },
      // destructive as color on outline/ghost/soft
      { variant: "outline", color: "default", className: "" },
    ],
    defaultVariants: {
      variant: "primary",
      color: "default",
      size: "md",
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
