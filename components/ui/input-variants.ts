import { cva, type VariantProps } from "class-variance-authority";

// Exact Figma v5 specs (node 4119:7647 State, 4119:7723 Possibilities)
// Shell uses flex layout with icons as flex children (not absolute overlays).
// - h-9 px-3 py-1 gap-1.5 rounded-md border-input bg-background shadow-xs
// - Icons: 16x16 flex children; gap between icon and input text = 6px (gap-1.5)

export const inputShellVariants = cva(
  [
    "flex w-full items-center bg-background",
    "border outline-none transition-colors",
  ],
  {
    variants: {
      state: {
        default:
          "shadow-xs border-input focus-within:border-ring focus-within:shadow-[0_0_0_3px_rgb(161_161_170/0.5)]",
        focus:
          "border-ring shadow-[0_0_0_3px_rgb(161_161_170/0.5)] overflow-clip",
        success: "shadow-xs border-success overflow-clip",
        destructive: "shadow-xs border-destructive overflow-clip",
      },
      size: {
        xs: "h-7 px-3 py-0.5 gap-1",
        sm: "h-8 px-3 py-1 gap-1",
        md: "h-9 px-3 py-1 gap-1.5",
        lg: "h-10 px-3 py-1.5 gap-2",
      },
      shape: {
        rounded: "rounded-[8px]",
        round: "rounded-full",
      },
    },
    defaultVariants: {
      state: "default",
      size: "md",
      shape: "rounded",
    },
  },
);

export type InputShellVariantProps = VariantProps<typeof inputShellVariants>;
