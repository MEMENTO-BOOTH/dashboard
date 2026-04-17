import {
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Minus,
  Pin,
  Plus,
  User,
  Volume1,
} from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils/cn";

const iconBox = "size-4 shrink-0";
const solidSeg = "inline-flex items-center justify-center bg-primary text-primary-foreground shadow-sm";

// Figma 14786:218771 (Up Down Rounded) & 14786:218803 (Up Down Round)
export function UpDownButton({
  value = 250,
  shape = "square",
}: {
  value?: number;
  shape?: "square" | "round";
}) {
  const outerRadius = shape === "round" ? "rounded-full" : "rounded-md";
  return (
    <div className={cn("inline-flex items-center overflow-clip", outerRadius)}>
      <button type="button" className={cn(solidSeg, "p-2.5")}>
        <ChevronUp className={iconBox} />
      </button>
      <div
        className={cn(
          solidSeg,
          "self-stretch px-1 text-sm font-medium leading-5 border-x border-[rgba(250,250,250,0.3)]",
        )}
      >
        {value}
      </div>
      <button type="button" className={cn(solidSeg, "p-2.5")}>
        <ChevronDown className={iconBox} />
      </button>
    </div>
  );
}

// Figma volume (14786:218886..)
export function VolumeButton({ value = 3 }: { value?: number }) {
  return (
    <div className="inline-flex items-center">
      <button
        type="button"
        className={cn(solidSeg, "rounded-full border border-primary p-2.5")}
      >
        <Minus className={iconBox} />
      </button>
      <div className="flex items-center px-3">
        <Volume1 className={cn(iconBox, "text-foreground")} />
        <span className="pl-2 w-[18px] text-sm font-medium leading-5 text-foreground">{value}</span>
      </div>
      <button
        type="button"
        className={cn(solidSeg, "rounded-full border border-primary p-2.5")}
      >
        <Plus className={iconBox} />
      </button>
    </div>
  );
}

// Figma 14786:218976 (Sign In) — user icon per screenshot
export function SignInButton({ children = "Sign in" }: { children?: React.ReactNode }) {
  return (
    <div className="inline-flex items-center overflow-clip rounded-md">
      <button
        type="button"
        className={cn(
          solidSeg,
          "rounded-l-md border-r border-[rgba(250,250,250,0.3)] p-2.5",
        )}
      >
        <User className={iconBox} />
      </button>
      <button
        type="button"
        className={cn(
          solidSeg,
          "rounded-r-md px-4 py-2 text-sm font-medium leading-5",
        )}
      >
        {children}
      </button>
    </div>
  );
}

// Figma 14786:219057 (Pinned)
export function PinnedButton({ children = "Pinned" }: { children?: React.ReactNode }) {
  return (
    <div className="inline-flex items-center overflow-clip rounded-md">
      <button
        type="button"
        className={cn(
          solidSeg,
          "rounded-l-md border-r border-[rgba(250,250,250,0.3)] p-2.5",
        )}
      >
        <ChevronDown className={iconBox} />
      </button>
      <button
        type="button"
        className={cn(
          solidSeg,
          "gap-2 rounded-r-md px-4 py-2 text-sm font-medium leading-5",
        )}
      >
        <Pin className={iconBox} />
        {children}
      </button>
    </div>
  );
}

// Figma 14786:219187 (Merge pull request)
export function MergePullRequestButton({
  children = "Merge pull request",
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center overflow-clip rounded-md">
      <button
        type="button"
        className={cn(
          solidSeg,
          "rounded-l-md border-r border-[rgba(250,250,250,0.3)] px-4 py-2 text-sm font-medium leading-5",
        )}
      >
        {children}
      </button>
      <button type="button" className={cn(solidSeg, "rounded-r-md p-2.5")}>
        <ChevronDown className={iconBox} />
      </button>
    </div>
  );
}

// Figma 14787:219845 (Upload Image)
export function UploadImageButton({
  children = "Upload image",
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md border border-input bg-background p-2.5 shadow-xs"
      >
        <ImageIcon className={iconBox} />
      </button>
      <button
        type="button"
        className={cn(solidSeg, "gap-2 rounded-md px-4 py-2 text-sm font-medium leading-5")}
      >
        {children}
      </button>
    </div>
  );
}
