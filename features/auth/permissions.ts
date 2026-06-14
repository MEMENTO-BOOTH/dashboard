export type Permission =
  | "finance.view"
  | "utilisateurs.manage"
  | "roles.manage"
  | "bornes.delete"
  | "bornes.edit"
  | "interventions.create"
  | "interventions.delete"
  | "interventions.complete"
  | "jetons.view"
  | "commandes.assign"
  | "commandes.expedite";

export type Permissions = Partial<Record<Permission, boolean>>;

export function can(perms: Permissions, perm: Permission): boolean {
  return perms[perm] === true;
}

export function permissionsFromArray(arr: string[], voirCa: boolean): Permissions {
  const out: Permissions = {};
  for (const p of arr) {
    out[p as Permission] = true;
  }
  // voir_ca du user override le finance.view du rôle (colonne dédiée sur utilisateurs)
  out["finance.view"] = voirCa;
  return out;
}
