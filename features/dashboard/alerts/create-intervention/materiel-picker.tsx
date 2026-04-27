import { Check, type LucideIcon, Monitor, MoreHorizontal } from "lucide-react";
import { MATERIEL_LABELS, type MaterielType } from "../intervention-types";

// Grille 3-cols : caméra + imprimante + TPE + câble = images, reste = icônes Lucide

type Entry = { type: MaterielType; img?: string; icon?: LucideIcon };

const ENTRIES: Entry[] = [
  { type: "camera", img: "/materiel/camera.png" },
  { type: "imprimante", img: "/materiel/imprimante.png" },
  { type: "tpe", img: "/materiel/tpe.png" },
  { type: "cable", img: "/materiel/cable.png" },
  { type: "ecran", icon: Monitor },
  { type: "autre", icon: MoreHorizontal },
];

export function MaterielPicker({
  value,
  onChange,
}: {
  value: MaterielType;
  onChange: (m: MaterielType) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {ENTRIES.map((e) => {
        const selected = value === e.type;
        return (
          <button
            key={e.type}
            type="button"
            onClick={() => onChange(e.type)}
            aria-pressed={selected}
            className={`group relative flex flex-col overflow-clip rounded-[12px] border bg-card transition-colors ${
              selected ? "border-foreground" : "border-border hover:border-foreground/30"
            }`}
          >
            {selected ? (
              <span className="absolute right-3 top-3 z-10 flex size-6 items-center justify-center rounded-full bg-foreground text-background">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
            ) : null}
            <div className="relative flex aspect-[4/3] w-full items-center justify-center bg-muted">
              {e.img ? (
                // biome-ignore lint/performance/noImgElement: material photo
                <img
                  src={e.img}
                  alt=""
                  className="absolute inset-0 block size-full object-contain p-3"
                />
              ) : e.icon ? (
                <e.icon className="size-10 text-muted-foreground" strokeWidth={1.5} />
              ) : null}
            </div>
            <p className="px-4 py-3 text-left text-[14px] font-medium leading-5 text-foreground">
              {MATERIEL_LABELS[e.type]}
            </p>
          </button>
        );
      })}
    </div>
  );
}
