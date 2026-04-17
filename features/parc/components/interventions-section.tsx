import { Camera, CreditCard, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Figma 39555:118178 — Centered Timeline, pixel-perfect.
// Container: flex flex-col gap-10
// Each item: flex gap-4 items-center
//   Col left (flex-1): date or card
//   Center (w-[36px]): dot (colored bg + icon) + dashed line
//   Col right (flex-1): card or date
// Card: bg-card rounded-[10px] shadow-md p-6 gap-4
// Dot: bg-{color}/20 p-1.5 rounded-full, icon size-5
// Date: 14px Regular muted-foreground

type TimelineItem = {
  date: string;
  side: "right" | "left";
  dotColor: string;
  dotIcon: LucideIcon;
  title: string;
  description: string;
};

const ITEMS: TimelineItem[] = [
  {
    date: "2 month's ago",
    side: "right",
    dotColor: "bg-destructive/20",
    dotIcon: FileText,
    title: "Bourrage Papier",
    description:
      "Le 6 Avril , Collins est allé à l'imaginaire et a changé le papier bloqué dans l'imprimante.",
  },
  {
    date: "24 day's ago",
    side: "left",
    dotColor: "bg-success/10",
    dotIcon: Camera,
    title: "Remplacement Caméra",
    description:
      "Le 19 Dècembre , Gauthier a remplacé la caméra par une nouvelle de marque xxx-xxx-xxx.",
  },
  {
    date: "2 week's ago",
    side: "right",
    dotColor: "bg-warning/20",
    dotIcon: CreditCard,
    title: "Changement TPE",
    description:
      "Le 10 Janvier , Romain a changé le TPE car , on le TPE ne se déclenchait plus automatiquement.",
  },
];

function TimelineCard({ item }: { item: TimelineItem }) {
  return (
    <div className="flex flex-1 flex-col gap-4 rounded-[10px] bg-card p-6 shadow-md">
      <p className="text-[18px] font-medium leading-[28px] text-card-foreground">{item.title}</p>
      <p className="text-[16px] font-normal leading-6 text-muted-foreground">{item.description}</p>
    </div>
  );
}

function TimelineDot({ item, isLast }: { item: TimelineItem; isLast: boolean }) {
  const Icon = item.dotIcon;
  return (
    <div className="flex w-9 shrink-0 flex-col items-center gap-4 self-stretch pt-4">
      <div className={`flex shrink-0 items-center rounded-full p-1.5 ${item.dotColor}`}>
        <Icon className="size-5" />
      </div>
      {!isLast ? <div className="w-px flex-1 border-l border-dashed border-border" /> : null}
    </div>
  );
}

function TimelineDate({ date }: { date: string }) {
  return (
    <div className="flex flex-1 items-start py-6">
      <p className="text-[14px] font-normal leading-5 text-muted-foreground">{date}</p>
    </div>
  );
}

function TimelineDateRight({ date }: { date: string }) {
  return (
    <div className="flex flex-1 items-start justify-start py-6">
      <p className="text-[14px] font-normal leading-5 text-muted-foreground">{date}</p>
    </div>
  );
}

function TimelineDateLeft({ date }: { date: string }) {
  return (
    <div className="flex flex-1 items-start justify-end py-6">
      <p className="text-[14px] font-normal leading-5 text-muted-foreground">{date}</p>
    </div>
  );
}

export function InterventionsSection() {
  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8 pt-12">
      <h2 className="text-[24px] font-semibold leading-8 text-foreground">
        Interventions réalisées
      </h2>

      <div className="flex flex-col gap-10">
        {ITEMS.map((item, idx) => (
          <div key={item.title} className="flex items-center gap-4">
            {item.side === "right" ? (
              <>
                <TimelineDateLeft date={item.date} />
                <TimelineDot item={item} isLast={idx === ITEMS.length - 1} />
                <TimelineCard item={item} />
              </>
            ) : (
              <>
                <TimelineCard item={item} />
                <TimelineDot item={item} isLast={idx === ITEMS.length - 1} />
                <TimelineDateRight date={item.date} />
              </>
            )}
          </div>
        ))}
      </div>

      <div className="h-px bg-border" />
    </div>
  );
}
