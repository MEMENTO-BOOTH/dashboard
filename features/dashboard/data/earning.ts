export type EarningBar = {
  label: string;
  height: number;
  active?: boolean;
};

export type EarningData = {
  value: string;
  variation: string;
  description: string;
  bars: EarningBar[];
};

export const EARNING_DATA: EarningData = {
  value: "€0",
  variation: "0%",
  description: "CA de cette semaine vs. semaine dernière.",
  bars: [
    { label: "Lu", height: 0 },
    { label: "Ma", height: 0 },
    { label: "Me", height: 0 },
    { label: "Je", height: 0 },
    { label: "Ve", height: 0 },
    { label: "Sa", height: 0 },
    { label: "Di", height: 0 },
  ],
};
