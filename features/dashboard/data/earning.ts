export type EarningBar = {
  label: string; // Short label "Lu", "Ma"...
  fullLabel: string; // Full name "Lundi", "Mardi"...
  amount: number; // EUR
  amountLastWeek: number;
  changePct: number; // % vs same day last week
  active?: boolean;
  future?: boolean; // jour pas encore arrivé cette semaine
};

export type EarningData = {
  totalThisWeek: number;
  totalLastWeek: number;
  variationPct: number;
  bars: EarningBar[];
};

export const EARNING_DATA: EarningData = {
  totalThisWeek: 0,
  totalLastWeek: 0,
  variationPct: 0,
  bars: [
    { label: "Lu", fullLabel: "Lundi", amount: 0, amountLastWeek: 0, changePct: 0 },
    { label: "Ma", fullLabel: "Mardi", amount: 0, amountLastWeek: 0, changePct: 0 },
    { label: "Me", fullLabel: "Mercredi", amount: 0, amountLastWeek: 0, changePct: 0 },
    { label: "Je", fullLabel: "Jeudi", amount: 0, amountLastWeek: 0, changePct: 0 },
    { label: "Ve", fullLabel: "Vendredi", amount: 0, amountLastWeek: 0, changePct: 0 },
    { label: "Sa", fullLabel: "Samedi", amount: 0, amountLastWeek: 0, changePct: 0 },
    { label: "Di", fullLabel: "Dimanche", amount: 0, amountLastWeek: 0, changePct: 0 },
  ],
};
