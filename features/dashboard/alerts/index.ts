// Exports SAFE pour Server + Client Components uniquement.
// Les fonctions server-only (getInterventionCandidates, getAssignees) doivent être importées
// directement depuis ./intervention-api pour éviter un server-only leak côté client.

export { AlertBadge } from "./alert-badge";
export { CreateInterventionDialog } from "./create-intervention";
export {
  type AlertGravite,
  alertGraviteFor,
  alertIconFor,
  alertLabelFor,
  allAlertTypes,
  TYPE_LABELS,
} from "./icons";
export { createInterventionsBulk } from "./intervention-actions";
export {
  type Assignee,
  type BorneIssue,
  type BorneSummary,
  type InterventionCandidate,
  type InterventionMode,
  MATERIEL_LABELS,
  type MaterielType,
  PHYSICAL_ALERT_TYPES,
} from "./intervention-types";
