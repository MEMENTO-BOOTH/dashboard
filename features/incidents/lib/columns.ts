import {
  COLUMN_NAME_MAX,
  type Column,
  type ColumnRole,
  type Incident,
  MAX_COLUMNS,
  MIN_COLUMNS,
  ROLE_LABELS,
} from "./types";

export const DEFAULT_COLUMNS: ReadonlyArray<Omit<Column, "id">> = [
  { name: "À traiter", role: "entree", observationDays: null, position: 1 },
  { name: "En cours", role: "libre", observationDays: null, position: 2 },
  { name: "En attente d'intervention", role: "libre", observationDays: null, position: 3 },
  { name: "À vérifier J+7", role: "observation", observationDays: 7, position: 4 },
  { name: "Traité", role: "cloture", observationDays: null, position: 5 },
  { name: "Fausses alertes", role: "rejete", observationDays: null, position: 6 },
];

export const isFinalRole = (role: ColumnRole): boolean => role === "cloture" || role === "rejete";

export function indexColumns(columns: readonly Column[]): Map<string, Column> {
  return new Map(columns.map((c) => [c.id, c]));
}

export function columnByRole(columns: readonly Column[], role: ColumnRole): Column | undefined {
  return columns.find((c) => c.role === role);
}

export function requireRole(columns: readonly Column[], role: ColumnRole): Column {
  const column = columnByRole(columns, role);
  if (!column) throw new Error(`Aucune colonne avec le rôle « ${ROLE_LABELS[role]} ».`);
  return column;
}

/** Ouvert = dans une colonne qui n'est ni Clôture ni Rejet. */
export function isOpen(incident: Incident, columnsById: ReadonlyMap<string, Column>): boolean {
  const column = columnsById.get(incident.columnId);
  return column !== undefined && !isFinalRole(column.role);
}

export function observationDaysOf(column: Column): number {
  return column.observationDays ?? 7;
}

// RG-16 : exactement une colonne Entrée / Clôture / Rejet, au plus une Observation.
export function validateColumns(
  columns: ReadonlyArray<Pick<Column, "name" | "role" | "observationDays">>,
): string[] {
  const errors: string[] = [];
  const count = (role: ColumnRole) => columns.filter((c) => c.role === role).length;
  if (columns.length < MIN_COLUMNS) errors.push(`Il faut au moins ${MIN_COLUMNS} colonnes.`);
  if (columns.length > MAX_COLUMNS)
    errors.push(`${MAX_COLUMNS} colonnes au maximum : au-delà, le tableau devient illisible.`);
  if (count("entree") !== 1)
    errors.push(
      "Il faut exactement une colonne « Entrée » : c'est là qu'arrivent les nouveaux incidents.",
    );
  if (count("cloture") !== 1)
    errors.push("Il faut exactement une colonne « Clôture » pour les incidents réglés.");
  if (count("rejete") !== 1)
    errors.push("Il faut exactement une colonne « Rejet » pour les fausses alertes.");
  if (count("observation") > 1) errors.push("Une seule colonne « Observation » possible.");
  if (columns.some((c) => c.name.trim().length === 0 || c.name.trim().length > COLUMN_NAME_MAX)) {
    errors.push(`Chaque colonne doit avoir un nom de 1 à ${COLUMN_NAME_MAX} caractères.`);
  }
  if (
    columns.some(
      (c) =>
        c.role === "observation" &&
        (c.observationDays == null || c.observationDays < 1 || c.observationDays > 60),
    )
  ) {
    errors.push("La durée de surveillance doit être comprise entre 1 et 60 jours.");
  }
  return errors;
}
