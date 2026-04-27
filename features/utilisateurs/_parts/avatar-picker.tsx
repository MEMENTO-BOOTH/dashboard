import { cn } from "@/lib/utils/cn";

const AVATAR_COUNT = 19;
const AVATARS = Array.from(
  { length: AVATAR_COUNT },
  (_, i) => `/avatars/notion-avatar-${i + 1}.png`,
);

export function AvatarPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {AVATARS.map((url) => {
        const selected = value === url;
        return (
          <button
            key={url}
            type="button"
            onClick={() => onChange(url)}
            aria-pressed={selected}
            aria-label={`Avatar ${url.split("/").pop()}`}
            className={cn(
              "relative flex size-12 shrink-0 items-center justify-center overflow-clip rounded-full transition-all",
              selected
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : "opacity-60 hover:opacity-100",
            )}
          >
            {/* biome-ignore lint/performance/noImgElement: small avatar preview */}
            <img src={url} alt="" className="size-full object-cover" />
          </button>
        );
      })}
    </div>
  );
}

export function getRandomAvatar(): string {
  const idx = Math.floor(Math.random() * AVATAR_COUNT) + 1;
  return `/avatars/notion-avatar-${idx}.png`;
}
