export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function InitialsAvatar({
  name,
  logoUrl,
  className = "size-9 rounded-full text-[14px]",
}: {
  name: string;
  logoUrl?: string | null;
  className?: string;
}) {
  if (logoUrl) {
    return (
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-clip ${className}`}
      >
        {/* biome-ignore lint/performance/noImgElement: avatar */}
        <img src={logoUrl} alt="" className="size-full object-contain" />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-muted font-medium text-muted-foreground ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
