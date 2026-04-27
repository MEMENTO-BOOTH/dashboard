import Image from "next/image";

export function SidePanel({
  bornesCount,
  usersCount,
}: {
  bornesCount: number;
  usersCount: number;
}) {
  return (
    <div className="relative hidden h-full flex-col items-start justify-center p-5 lg:flex">
      <div className="flex min-h-px w-full flex-1 flex-col items-start justify-between rounded-[14px] bg-[#171717] p-8 text-[#fafafa]">
        <div className="flex w-full flex-col items-start gap-6">
          <p className="w-full text-5xl font-bold leading-none text-[#fafafa]">
            Bon retour !
            <br />
            Connecte-toi à ton
            <br />
            espace Kapsule.
          </p>
          <p className="w-full text-xl font-normal leading-7 text-[#fafafa]">
            Pilote ton parc de photomatons, suis les alertes en temps réel et planifie tes
            interventions.
          </p>
        </div>

        <MessageBlock bornesCount={bornesCount} usersCount={usersCount} />
      </div>
    </div>
  );
}

function MessageBlock({ bornesCount, usersCount }: { bornesCount: number; usersCount: number }) {
  return (
    <div className="relative grid w-full grid-cols-1 grid-rows-[max-content] place-items-start leading-[0]">
      <div className="col-start-1 row-start-1 grid w-full grid-cols-1 grid-rows-[max-content] place-items-start">
        <div className="col-start-1 row-start-1 relative h-[248px] w-full">
          <Image
            src="/auth/card-shape.svg"
            alt=""
            fill
            priority
            className="pointer-events-none select-none"
          />
        </div>

        <div
          className="relative col-start-1 row-start-1 flex flex-col items-start gap-6 pr-6"
          style={{ marginLeft: "6.61%", marginTop: "32px", width: "86.78%" }}
        >
          <p className="w-full text-3xl font-bold leading-9 text-[#0a0a0a]">
            Entre tes identifiants
          </p>
          <div className="flex w-full flex-col items-start gap-5">
            <p className="w-full text-lg font-normal leading-7 text-[#0a0a0a]">
              Déjà {bornesCount} borne{bornesCount > 1 ? "s" : ""} connectée
              {bornesCount > 1 ? "s" : ""} dans des bars partout en France.
            </p>
            <AvatarGroup extraCount={Math.max(10, usersCount - 3)} />
          </div>
        </div>
      </div>

      <LogoBadge />
    </div>
  );
}

function AvatarGroup({ extraCount }: { extraCount: number }) {
  const avatars = [
    { src: "/auth/avatar-1.png", borderClass: "border-card" },
    { src: "/auth/avatar-2.png", borderClass: "border-background" },
    { src: "/auth/avatar-3.png", borderClass: "border-background" },
  ];

  return (
    <div className="flex w-full flex-col items-end pr-12">
      <div className="flex items-start">
        {avatars.map((a) => (
          <div
            key={a.src}
            className={`relative -mr-5 size-14 shrink-0 overflow-clip rounded-full border-2 ${a.borderClass}`}
          >
            <Image src={a.src} alt="" fill className="object-cover" sizes="56px" />
          </div>
        ))}
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted">
          <span className="text-xs font-semibold leading-4 text-foreground">+{extraCount}</span>
        </div>
      </div>
    </div>
  );
}

function LogoBadge() {
  return (
    <div
      className="absolute col-start-1 row-start-1 flex items-center justify-center"
      style={{ left: "89.61%", top: "4px", width: "9.77%", aspectRatio: "1/1" }}
    >
      <div className="relative aspect-square w-[66%]">
        <Image src="/memento-logo.png" alt="Capsule" fill className="object-contain" sizes="60px" />
      </div>
    </div>
  );
}
