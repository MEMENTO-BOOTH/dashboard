import type { LucideIcon } from "lucide-react";
import {
  Camera,
  CameraOff,
  CreditCard,
  Database,
  DoorOpen,
  Download,
  FileWarning,
  HardDrive,
  Hammer,
  Lightbulb,
  Network,
  Printer,
  Receipt,
  Scroll,
  Siren,
  Sparkles,
  Wifi,
  Wrench,
} from "lucide-react";
import type { Intervention } from "../api";

function formatRelativeDate(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "aujourd'hui";
  if (diffDays === 1) return "il y a 1 jour";
  if (diffDays < 7) return `il y a ${diffDays} jours`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return "il y a 1 semaine";
  if (diffWeeks < 5) return `il y a ${diffWeeks} semaines`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "il y a 1 mois";
  if (diffMonths < 12) return `il y a ${diffMonths} mois`;

  const diffYears = Math.floor(diffDays / 365);
  return diffYears === 1 ? "il y a 1 an" : `il y a ${diffYears} ans`;
}

type IconSpec = { icon: LucideIcon; colorClass: string; iconClass: string };

// Mapping mot-clé → icône Lucide spécifique + teinte sémantique du design system
const INTERVENTION_ICON_MAP: Array<{ patterns: string[]; spec: IconSpec }> = [
  // Papier / Imprimante
  {
    patterns: ["bourrage"],
    spec: { icon: FileWarning, colorClass: "bg-destructive/10", iconClass: "text-destructive" },
  },
  {
    patterns: ["fin papier", "papier vide", "manque papier", "rechargement"],
    spec: { icon: Scroll, colorClass: "bg-warning/15", iconClass: "text-warning" },
  },
  {
    patterns: ["ruban"],
    spec: { icon: Receipt, colorClass: "bg-warning/15", iconClass: "text-warning" },
  },
  {
    patterns: ["imprimante"],
    spec: { icon: Printer, colorClass: "bg-destructive/10", iconClass: "text-destructive" },
  },
  {
    patterns: ["papier"],
    spec: { icon: Scroll, colorClass: "bg-warning/15", iconClass: "text-warning" },
  },
  // Caméra
  {
    patterns: ["caméra hs", "caméra panne", "camera off"],
    spec: { icon: CameraOff, colorClass: "bg-destructive/10", iconClass: "text-destructive" },
  },
  {
    patterns: ["caméra", "camera"],
    spec: { icon: Camera, colorClass: "bg-info/10", iconClass: "text-info" },
  },
  // Paiement / TPE
  {
    patterns: ["tpe", "paiement", "carte"],
    spec: { icon: CreditCard, colorClass: "bg-warning/15", iconClass: "text-warning" },
  },
  // Réseau
  {
    patterns: ["wifi", "wi-fi", "internet", "connexion"],
    spec: { icon: Wifi, colorClass: "bg-info/10", iconClass: "text-info" },
  },
  {
    patterns: ["réseau", "reseau", "ethernet"],
    spec: { icon: Network, colorClass: "bg-info/10", iconClass: "text-info" },
  },
  // Stockage
  {
    patterns: ["disque", "stockage", "espace"],
    spec: { icon: HardDrive, colorClass: "bg-warning/15", iconClass: "text-warning" },
  },
  {
    patterns: ["base de données", "bdd", "supabase", "database"],
    spec: { icon: Database, colorClass: "bg-info/10", iconClass: "text-info" },
  },
  // Capot / mécanique
  {
    patterns: ["capot ouvert", "porte ouverte", "capot"],
    spec: { icon: DoorOpen, colorClass: "bg-warning/15", iconClass: "text-warning" },
  },
  {
    patterns: ["mécanique", "mecanique", "moteur", "panne"],
    spec: { icon: Wrench, colorClass: "bg-destructive/10", iconClass: "text-destructive" },
  },
  // Mise à jour
  {
    patterns: ["mise à jour", "mise a jour", "update", "agent"],
    spec: { icon: Download, colorClass: "bg-success/10", iconClass: "text-success" },
  },
  // Nettoyage
  {
    patterns: ["nettoyage", "lustrage"],
    spec: { icon: Sparkles, colorClass: "bg-success/10", iconClass: "text-success" },
  },
  // Éclairage
  {
    patterns: ["led", "lumière", "lampe", "éclairage", "eclairage"],
    spec: { icon: Lightbulb, colorClass: "bg-warning/15", iconClass: "text-warning" },
  },
  // Alerte critique
  {
    patterns: ["urgence", "critique", "alerte critique"],
    spec: { icon: Siren, colorClass: "bg-destructive/10", iconClass: "text-destructive" },
  },
];

const DEFAULT_ICON: IconSpec = {
  icon: Hammer,
  colorClass: "bg-muted",
  iconClass: "text-foreground",
};

function iconForType(type: string): IconSpec {
  const t = type.toLowerCase();
  for (const { patterns, spec } of INTERVENTION_ICON_MAP) {
    if (patterns.some((p) => t.includes(p))) return spec;
  }
  return DEFAULT_ICON;
}

function TimelineCard({ intervention }: { intervention: Intervention }) {
  return (
    <div className="flex flex-1 flex-col gap-3 rounded-[10px] border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[16px] font-medium leading-6 text-card-foreground">
          {intervention.type}
        </p>
        {intervention.intervenant_nom && intervention.intervenant_nom !== "—" ? (
          <p className="text-[13px] font-normal leading-5 text-muted-foreground">
            {intervention.intervenant_nom}
          </p>
        ) : null}
      </div>
      {intervention.description ? (
        <p className="text-[14px] font-normal leading-5 text-muted-foreground">
          {intervention.description}
        </p>
      ) : null}
      {intervention.duree_minutes ? (
        <p className="text-[13px] font-normal leading-5 text-muted-foreground">
          Durée : {intervention.duree_minutes} min
        </p>
      ) : null}
    </div>
  );
}

function TimelineDot({ type, isLast }: { type: string; isLast: boolean }) {
  const { icon: Icon, colorClass, iconClass } = iconForType(type);
  return (
    <div className="flex w-9 shrink-0 flex-col items-center gap-4 self-stretch pt-4">
      <div className={`flex shrink-0 items-center rounded-full p-1.5 ${colorClass}`}>
        <Icon className={`size-5 ${iconClass}`} />
      </div>
      {!isLast ? <div className="w-px flex-1 border-l border-dashed border-border" /> : null}
    </div>
  );
}

function TimelineDate({ date, align }: { date: string; align: "left" | "right" }) {
  return (
    <div
      className={`flex flex-1 items-start py-6 ${align === "left" ? "justify-end" : "justify-start"}`}
    >
      <p className="text-[14px] font-normal leading-5 text-muted-foreground">
        {formatRelativeDate(date)}
      </p>
    </div>
  );
}

export function InterventionsSection({ interventions }: { interventions: Intervention[] }) {
  if (interventions.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8 pt-12">
        <h2 className="text-[24px] font-semibold leading-8 text-foreground">
          Interventions réalisées
        </h2>
        <p className="py-8 text-[14px] text-muted-foreground">
          Aucune intervention enregistrée sur cette borne.
        </p>
        <div className="h-px bg-border" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8 pt-12">
      <h2 className="text-[24px] font-semibold leading-8 text-foreground">
        Interventions réalisées
      </h2>

      <div className="flex flex-col gap-10">
        {interventions.map((intervention, idx) => {
          const isLast = idx === interventions.length - 1;
          const side: "right" | "left" = idx % 2 === 0 ? "right" : "left";
          return (
            <div key={intervention.id} className="flex items-start gap-4">
              {side === "right" ? (
                <>
                  <TimelineDate date={intervention.date} align="left" />
                  <TimelineDot type={intervention.type} isLast={isLast} />
                  <TimelineCard intervention={intervention} />
                </>
              ) : (
                <>
                  <TimelineCard intervention={intervention} />
                  <TimelineDot type={intervention.type} isLast={isLast} />
                  <TimelineDate date={intervention.date} align="right" />
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="h-px bg-border" />
    </div>
  );
}
