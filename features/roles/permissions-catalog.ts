import type { LucideIcon } from "lucide-react";
import { Coins, Hammer, UsersRound, Warehouse } from "lucide-react";
import type { Permission } from "@/features/auth/permissions";

export type PermissionEntry = {
  key: Permission;
  label: string;
  description?: string;
};

export type PermissionGroup = {
  title: string;
  icon: LucideIcon;
  permissions: PermissionEntry[];
};

// Catalogue des permissions affichées dans le formulaire de création de rôle.
// `finance.view` n'y figure pas : c'est piloté par le toggle individuel `voir_ca`
// sur chaque utilisateur (overrides la permission du rôle).
export const PERMISSIONS_CATALOG: PermissionGroup[] = [
  {
    title: "Parc",
    icon: Warehouse,
    permissions: [
      {
        key: "bornes.edit",
        label: "Modifier une borne",
        description: "Modifier le nom, l'adresse et les horaires",
      },
      {
        key: "bornes.delete",
        label: "Supprimer une borne",
        description: "Suppression définitive de la borne et de ses données",
      },
    ],
  },
  {
    title: "Interventions",
    icon: Hammer,
    permissions: [
      { key: "interventions.create", label: "Créer une intervention" },
      { key: "interventions.complete", label: "Terminer une intervention assignée" },
      { key: "interventions.delete", label: "Supprimer une intervention" },
    ],
  },
  {
    title: "Utilisateurs",
    icon: UsersRound,
    permissions: [
      {
        key: "utilisateurs.manage",
        label: "Gérer les utilisateurs",
        description: "Ajouter, modifier ou retirer des membres de l'équipe",
      },
      {
        key: "roles.manage",
        label: "Gérer les rôles",
        description: "Créer et modifier les rôles et leurs permissions",
      },
    ],
  },
  {
    title: "Jetons",
    icon: Coins,
    permissions: [
      {
        key: "jetons.view",
        label: "Voir mes jetons",
        description: "Accéder à la liste de ses interventions assignées",
      },
    ],
  },
];
