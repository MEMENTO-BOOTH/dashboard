import { alertGraviteFor, alertIconFor } from "./icons";

// Pastille circulaire rouge (critique) ou orange (warning) avec l'icône Lucide
// spécifique au type d'alerte en blanc au centre.
// 100 % Lucide pour une cohérence visuelle complète.

export function AlertBadge({
  type,
  size = 38,
  className,
}: {
  type: string;
  size?: number;
  className?: string;
}) {
  const Icon = alertIconFor(type);
  const gravite = alertGraviteFor(type);
  const bg = gravite === "warning" ? "bg-warning" : "bg-destructive";
  const iconSize = Math.round(size * 0.52);

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full ${bg} ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <Icon className="text-white" style={{ width: iconSize, height: iconSize }} strokeWidth={2} />
    </div>
  );
}
