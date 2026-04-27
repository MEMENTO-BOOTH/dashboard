import { InitialsAvatar } from "@/components/ui/initials-avatar";
import type { Member } from "../schemas";

export function MemberCard({ m }: { m: Member }) {
  return (
    <div className="flex w-[231px] min-w-[100px] shrink-0 items-center gap-4">
      <InitialsAvatar
        name={m.name}
        logoUrl={m.logoUrl}
        className="size-14 rounded-full text-[14px]"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate text-[14px] font-semibold leading-5 text-card-foreground">
          {m.name}
        </p>
        <p className="truncate text-[14px] font-normal leading-5 text-muted-foreground">{m.role}</p>
      </div>
    </div>
  );
}

export function MemberRow({ m }: { m: Member }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <InitialsAvatar
        name={m.name}
        logoUrl={m.logoUrl}
        className="size-14 rounded-full text-[14px]"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate text-[14px] font-semibold leading-5 text-card-foreground">
          {m.name}
        </p>
        <p className="truncate text-[14px] font-normal leading-5 text-muted-foreground">{m.role}</p>
      </div>
    </div>
  );
}
