import { z } from "zod";

export const borneStatutSchema = z.enum(["active", "maintenance", "desactivee"]);
export const borneEnvironnementSchema = z.enum(["prod", "dev"]);
export type BorneEnvironnement = z.infer<typeof borneEnvironnementSchema>;
export const alerteGraviteSchema = z.enum(["info", "warning", "critique"]);
export const alerteStatutSchema = z.enum(["ouverte", "assignee", "resolue"]);

export const borneSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  nom_lieu: z.string(),
  logo_url: z.string().nullable(),
  statut: borneStatutSchema,
  partenaire_id: z.string().uuid().nullable(),
});
export type Borne = z.infer<typeof borneSchema>;

export const heartbeatSchema = z.object({
  borne_id: z.string().uuid(),
  timestamp: z.string(),
  feuilles_restantes: z.number().nullable(),
});
export type Heartbeat = z.infer<typeof heartbeatSchema>;

export const alerteSchema = z.object({
  id: z.string().uuid(),
  borne_id: z.string().uuid(),
  type: z.string(),
  message: z.string().nullable(),
  gravite: alerteGraviteSchema,
  statut: alerteStatutSchema,
  timestamp: z.string(),
});
export type Alerte = z.infer<typeof alerteSchema>;

export const transactionAggSchema = z.object({
  borne_id: z.string().uuid(),
  montant: z.number(),
  paiement_at: z.string(),
});
export type TransactionAgg = z.infer<typeof transactionAggSchema>;

export const partenaireSchema = z.object({
  id: z.string().uuid(),
  telephone: z.string().nullable(),
  logo_url: z.string().nullable(),
});
export type Partenaire = z.infer<typeof partenaireSchema>;

export type BorneDetail = {
  id: string;
  code: string;
  nom_lieu: string;
  adresse: string | null;
  ville: string;
  statut: z.infer<typeof borneStatutSchema>;
  environnement: BorneEnvironnement;
  date_installation: string | null;
  derniere_maintenance: string | null;
  logo_url: string | null;
  nayax_device_serial: string | null;
  setup_done: boolean | null;
  partenaire_nom: string | null;
  partenaire_telephone: string | null;
};

export type BorneTableRow = {
  id: string;
  name: string;
  subtitle: string;
  statut: z.infer<typeof borneStatutSchema>;
  logoUrl: string | null;
  alert: Alerte | null;
  lastActivityAt: string | null;
  caToday: number;
  feuillesRestantes: number | null;
  feuillesMax: number;
};
