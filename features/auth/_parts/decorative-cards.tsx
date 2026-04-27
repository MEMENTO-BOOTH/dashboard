import Image from "next/image";

export function DecorativeCards() {
  return (
    <>
      <div className="pointer-events-none absolute bottom-0 left-0 hidden h-[310.344px] w-[302.309px] items-center justify-center lg:flex">
        <div className="-rotate-[21.06deg]">
          <OrderCard />
        </div>
      </div>
      <div className="pointer-events-none absolute top-0 right-0 hidden h-[301.214px] w-[291.994px] items-center justify-center lg:flex">
        <div className="rotate-[17.24deg]">
          <ImpressionCard />
        </div>
      </div>
    </>
  );
}

const ORDER_BARS = [
  { id: "ord-1", h: 41, offset: false },
  { id: "ord-2", h: 101, offset: false },
  { id: "ord-3", h: 66, offset: false },
  { id: "ord-4", h: 84, offset: true },
  { id: "ord-5", h: 116, offset: false },
  { id: "ord-6", h: 66, offset: false },
  { id: "ord-7", h: 78, offset: false },
];

function OrderCard() {
  return (
    <div className="flex w-[230px] flex-col items-start gap-4 rounded-[14px] border border-border bg-card py-6 shadow-sm">
      <div className="flex w-full flex-col items-start gap-1 px-6">
        <p className="h-[26px] w-full text-lg font-semibold leading-7 text-card-foreground">
          Ventes
        </p>
        <p className="h-[22px] w-full text-base font-normal leading-6 text-muted-foreground">
          7 derniers jours
        </p>
      </div>
      <div className="flex h-[84px] w-full items-end justify-between overflow-clip px-6">
        {ORDER_BARS.map((b) => (
          <div
            key={b.id}
            className="relative h-full w-[10px] shrink-0 overflow-clip rounded-full bg-primary/10"
          >
            {b.offset ? (
              <div
                className="absolute left-1/2 w-[12px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
                style={{ height: `${b.h}px`, top: "calc(50% + 33px)" }}
              />
            ) : (
              <div
                className="absolute bottom-0 left-1/2 w-[12px] -translate-x-1/2 rounded-full bg-primary"
                style={{ height: `${b.h}px` }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex w-full items-center justify-between px-6">
        <p className="flex-1 text-xl font-semibold leading-7 text-card-foreground">21K</p>
        <p className="text-base font-normal leading-6 text-primary">+12.6%</p>
      </div>
    </div>
  );
}

function ImpressionCard() {
  return (
    <div className="flex w-[230px] flex-col items-start gap-4 overflow-clip rounded-[14px] border border-border bg-card py-6 shadow-sm">
      <div className="flex w-full flex-col items-start gap-1">
        <div className="flex w-full items-center px-6">
          <p className="h-[26px] flex-1 text-lg font-semibold leading-7 text-card-foreground">
            Impressions
          </p>
        </div>
        <div className="flex w-full items-center justify-center px-6">
          <p className="h-[22px] flex-1 text-base font-normal leading-6 text-muted-foreground">
            12 derniers mois
          </p>
        </div>
      </div>
      <div className="relative h-[84px] w-full shrink-0">
        <Image src="/auth/chart-line.svg" alt="" fill className="object-cover" />
      </div>
      <div className="flex w-full items-center justify-between px-6">
        <p className="flex-1 text-xl font-semibold leading-7 text-card-foreground">378</p>
        <p className="text-base font-normal leading-6 text-primary">+24%</p>
      </div>
    </div>
  );
}
