export type UserDetail = {
  id: string;
  nom: string;
  created_at: string;
  logoUrl: string | null;
  role: string;
  voirCa: boolean;
};

export type Connection = {
  id: string;
  borne_id: string;
  borne_nom: string;
  borne_logo: string | null;
  last_seen: string;
};

export type Member = {
  id: string;
  name: string;
  role: string;
  logoUrl: string | null;
};
