"use client";

import Link from "next/link";
import { useState } from "react";
import type { LayoutMode } from "@/components/ui/layout-toggle";
import type { Member } from "../schemas";
import { CreateMemberDialog } from "./create-member-dialog";
import { MemberCard, MemberRow } from "./member-card";
import type { RoleOption } from "./role-select";

export function EquipeCard({
  members,
  layout,
  roles,
}: {
  members: Member[];
  layout: LayoutMode;
  roles: RoleOption[];
}) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-col items-start gap-6 rounded-[14px] bg-card py-6">
      <div className="flex w-full flex-col items-start justify-center gap-1.5 px-6">
        <p className="w-full text-[16px] font-semibold leading-6 text-card-foreground">Équipe</p>
      </div>

      <div className="flex w-full flex-col items-start gap-4 px-6">
        {layout === "grid" ? (
          <div className="flex w-full flex-wrap content-center items-center gap-x-10 gap-y-4">
            <CreateMemberButton onClick={() => setCreateOpen(true)} />
            {members.map((m) => (
              <Link
                key={m.id}
                href={`/utilisateurs/${m.id}`}
                className="transition-opacity hover:opacity-70"
              >
                <MemberCard m={m} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-col gap-2">
            <CreateMemberButton fullWidth onClick={() => setCreateOpen(true)} />
            {members.map((m) => (
              <Link
                key={m.id}
                href={`/utilisateurs/${m.id}`}
                className="block rounded-[10px] transition-colors hover:bg-accent"
              >
                <MemberRow m={m} />
              </Link>
            ))}
          </div>
        )}
      </div>

      <CreateMemberDialog open={createOpen} onOpenChange={setCreateOpen} roles={roles} />
    </div>
  );
}

function CreateMemberButton({
  fullWidth = false,
  onClick,
}: {
  fullWidth?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 cursor-pointer items-center gap-7 transition-opacity hover:opacity-70 ${
        fullWidth ? "w-full py-2" : "min-w-[100px]"
      }`}
    >
      <div className="flex size-8 shrink-0 items-center justify-center">
        {/* biome-ignore lint/performance/noImgElement: Figma invite icon asset */}
        <img src="/invite-icon.svg" alt="" className="size-8" />
      </div>
      <span className="text-[14px] font-semibold leading-5 text-card-foreground">
        Create Member
      </span>
    </button>
  );
}
