import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  Heart,
  Trash2,
  X,
} from "lucide-react";

const icon = "size-4 shrink-0";

export function LikeButton({ count = 5 }: { count?: number }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 overflow-clip rounded-full border border-primary bg-primary px-4 py-2 text-sm font-medium leading-5 text-primary-foreground"
    >
      <Heart className={icon} />
      <span>Like</span>
      <span className="rounded-full bg-muted px-2 py-[2px] text-sm font-normal text-foreground">
        {count}
      </span>
    </button>
  );
}

export function MessagesButton({ count = "99+" }: { count?: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 overflow-clip rounded-[10px] border border-primary px-4 py-2 text-sm font-medium leading-5 text-primary"
    >
      <span>Messages</span>
      <span className="rounded-full bg-destructive px-[6px] py-[2px] text-xs font-medium leading-4 text-white">
        {count}
      </span>
    </button>
  );
}

export function LivePreviewButton({ children = "Live preview" }: { children?: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 overflow-clip rounded-[10px] border border-primary px-4 py-2 text-sm font-medium leading-5 text-primary"
    >
      <span>{children}</span>
      <ExternalLink className={icon} />
    </button>
  );
}

export function CopyButton({ url = "https://shadcnstudio.com.." }: { url?: string }) {
  return (
    <div className="inline-flex items-center gap-2 overflow-clip rounded-full border border-border px-4 py-2 text-sm font-medium leading-5">
      <span className="text-muted-foreground">{url}</span>
      <button
        type="button"
        className="inline-flex items-center justify-center overflow-clip rounded-full bg-info p-1.5 text-white"
      >
        <Copy className={icon} />
      </button>
    </div>
  );
}

export function TrashButton({ children = "Trash" }: { children?: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-full border border-destructive px-4 py-2 text-sm font-medium leading-5 text-destructive shadow-xs"
    >
      <Trash2 className={icon} />
      <span>{children}</span>
    </button>
  );
}

export function CancelButton({ children = "Cancel" }: { children?: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 overflow-clip rounded-md bg-destructive px-4 py-2 text-sm font-medium leading-5 text-white shadow-xs"
    >
      <X className={icon} />
      <span>{children}</span>
    </button>
  );
}

export function ExploreButton({ children = "Explore All Service" }: { children?: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium leading-5 text-white shadow-xs"
      style={{
        backgroundImage:
          "linear-gradient(135deg, var(--warning) 0.69%, color-mix(in oklch, var(--warning) 60%, transparent) 99.31%)",
      }}
    >
      <span>{children}</span>
      <ArrowRight className={icon} />
    </button>
  );
}

export function ProBadgeButton({ children = "Upgrade to" }: { children?: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-4 overflow-clip rounded-md border border-secondary bg-secondary px-4 py-2 shadow-xs"
    >
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium leading-5 text-muted-foreground">{children}</span>
        <span className="rounded-[6px] bg-primary px-1.5 py-[2px] text-xs font-medium leading-4 text-primary-foreground">
          PRO
        </span>
      </div>
      <ChevronRight className={icon} />
    </button>
  );
}

export function ShareButton({ children = "Publish" }: { children?: React.ReactNode }) {
  return (
    <div className="inline-flex items-center justify-center gap-2 overflow-clip rounded-full border border-primary px-4 py-2">
      <button
        type="button"
        className="inline-flex items-center justify-center overflow-clip rounded-full bg-primary p-1.5 text-primary-foreground"
      >
        <ArrowUpRight className={icon} />
      </button>
      <span className="text-sm font-medium leading-5 text-primary">{children}</span>
    </div>
  );
}

export function SpinButton({ children = "Spin Now" }: { children?: React.ReactNode }) {
  return (
    <div className="inline-flex items-center justify-center gap-2 overflow-clip rounded-full bg-background px-4 py-2 shadow-xs">
      <button
        type="button"
        className="inline-flex items-center justify-center overflow-clip rounded-full bg-success p-1.5 text-white"
      >
        <ArrowRight className={icon} />
      </button>
      <span className="text-sm font-medium leading-5 text-primary">{children}</span>
    </div>
  );
}

export function ActivateButton({ children = "Activated" }: { children?: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-md bg-success/10 px-4 py-2 text-sm font-medium leading-5 text-success shadow-xs"
    >
      <Check className={icon} />
      <span>{children}</span>
    </button>
  );
}
