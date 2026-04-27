import Image from "next/image";

export function BrandLogo() {
  return (
    <div className="flex h-8 items-center gap-3">
      <div className="relative size-8 shrink-0">
        <Image src="/memento-logo.png" alt="Kapsule" fill className="object-contain" sizes="32px" />
      </div>
      <p className="text-xl font-semibold leading-[26px] text-foreground">Kapsule</p>
    </div>
  );
}
