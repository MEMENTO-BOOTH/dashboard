export type PaperBorne = {
  id: string;
  name: string;
  avatar: string | null;
  /** Sheets remaining (out of TOTAL_SHEETS). */
  sheets: number;
};

export const TOTAL_SHEETS = 400;
export const PAPER_THRESHOLD = 50;

export const PAPER_BORNES: PaperBorne[] = [];
