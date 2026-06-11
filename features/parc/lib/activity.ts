export type RawTransaction = {
  paiement_at: string;
  montant: number;
  feuilles_avant: number | null;
  feuilles_apres: number | null;
};

export type PaymentStatut = "imprime" | "non_imprime" | "rembourse";

export type PaymentRow = {
  paiement_at: string;
  montant: number;
  feuilles_avant: number | null;
  feuilles_apres: number | null;
  statut: PaymentStatut;
};

export type Bilan = {
  periode_debut: string;
  periode_fin: string;
  feuilles_fin: number | null;
  feuilles_max: number;
  ca_total: number;
  photos_total: number;
  payes_non_sortis: number;
  remboursements: number;
};

export type Activity = {
  bilan: Bilan;
  paiements: PaymentRow[];
};

function papierConsomme(t: RawTransaction): boolean {
  return (
    t.feuilles_avant !== null && t.feuilles_apres !== null && t.feuilles_avant > t.feuilles_apres
  );
}

function statutOf(t: RawTransaction): PaymentStatut {
  if (Number(t.montant) < 0) return "rembourse";
  if (papierConsomme(t)) return "imprime";
  return "non_imprime";
}

function comblerPapierApres(sorted: RawTransaction[]): RawTransaction[] {
  return sorted.map((t, i) => {
    if (t.feuilles_apres !== null) return t;
    const suivante = sorted[i + 1];
    return { ...t, feuilles_apres: suivante?.feuilles_avant ?? null };
  });
}

export function buildActivity(
  transactions: RawTransaction[],
  feuilles_max: number,
  periode_debut: string,
  periode_fin: string,
): Activity {
  const sorted = [...transactions].sort((a, b) => a.paiement_at.localeCompare(b.paiement_at));
  const filled = comblerPapierApres(sorted);

  const paiements: PaymentRow[] = filled.map((t) => ({
    paiement_at: t.paiement_at,
    montant: Number(t.montant),
    feuilles_avant: t.feuilles_avant,
    feuilles_apres: t.feuilles_apres,
    statut: statutOf(t),
  }));

  const photos_total = paiements.filter((p) => p.statut === "imprime").length;
  const payes_non_sortis = paiements.filter(
    (p) => p.statut === "non_imprime" && p.montant > 0,
  ).length;
  const remboursements = paiements.filter((p) => p.statut === "rembourse").length;
  const ca_total = paiements.reduce((s, p) => s + p.montant, 0);

  const derniere = filled.at(-1);
  const feuilles_fin = derniere ? (derniere.feuilles_apres ?? derniere.feuilles_avant) : null;

  return {
    bilan: {
      periode_debut,
      periode_fin,
      feuilles_fin,
      feuilles_max,
      ca_total,
      photos_total,
      payes_non_sortis,
      remboursements,
    },
    paiements: [...paiements].reverse(),
  };
}
