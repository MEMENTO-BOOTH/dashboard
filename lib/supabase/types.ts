export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alerte_destinataires: {
        Row: {
          actif: boolean | null
          borne_id: string | null
          created_at: string | null
          email: string | null
          id: string
          telephone: string
        }
        Insert: {
          actif?: boolean | null
          borne_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          telephone: string
        }
        Update: {
          actif?: boolean | null
          borne_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          telephone?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerte_destinataires_borne_id_fkey"
            columns: ["borne_id"]
            isOneToOne: false
            referencedRelation: "bornes"
            referencedColumns: ["id"]
          },
        ]
      }
      alertes: {
        Row: {
          assignee_a: string | null
          assignee_at: string | null
          borne_id: string
          created_at: string
          gravite: Database["public"]["Enums"]["alerte_gravite"]
          id: string
          message: string | null
          resolue_at: string | null
          resolue_par: string | null
          sms_envoye: boolean
          source: string
          statut: Database["public"]["Enums"]["alerte_statut"]
          timestamp: string
          type: string
        }
        Insert: {
          assignee_a?: string | null
          assignee_at?: string | null
          borne_id: string
          created_at?: string
          gravite?: Database["public"]["Enums"]["alerte_gravite"]
          id?: string
          message?: string | null
          resolue_at?: string | null
          resolue_par?: string | null
          sms_envoye?: boolean
          source: string
          statut?: Database["public"]["Enums"]["alerte_statut"]
          timestamp?: string
          type: string
        }
        Update: {
          assignee_a?: string | null
          assignee_at?: string | null
          borne_id?: string
          created_at?: string
          gravite?: Database["public"]["Enums"]["alerte_gravite"]
          id?: string
          message?: string | null
          resolue_at?: string | null
          resolue_par?: string | null
          sms_envoye?: boolean
          source?: string
          statut?: Database["public"]["Enums"]["alerte_statut"]
          timestamp?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "alertes_borne_id_fkey"
            columns: ["borne_id"]
            isOneToOne: false
            referencedRelation: "bornes"
            referencedColumns: ["id"]
          },
        ]
      }
      bornes: {
        Row: {
          adresse: string | null
          code: string
          created_at: string
          date_installation: string | null
          derniere_maintenance: string | null
          id: string
          logo_url: string | null
          nayax_device_serial: string | null
          nom_lieu: string
          partenaire_id: string | null
          setup_done: boolean | null
          statut: Database["public"]["Enums"]["borne_statut"]
          updated_at: string
          ville: string
        }
        Insert: {
          adresse?: string | null
          code: string
          created_at?: string
          date_installation?: string | null
          derniere_maintenance?: string | null
          id?: string
          logo_url?: string | null
          nayax_device_serial?: string | null
          nom_lieu: string
          partenaire_id?: string | null
          setup_done?: boolean | null
          statut?: Database["public"]["Enums"]["borne_statut"]
          updated_at?: string
          ville: string
        }
        Update: {
          adresse?: string | null
          code?: string
          created_at?: string
          date_installation?: string | null
          derniere_maintenance?: string | null
          id?: string
          logo_url?: string | null
          nayax_device_serial?: string | null
          nom_lieu?: string
          partenaire_id?: string | null
          setup_done?: boolean | null
          statut?: Database["public"]["Enums"]["borne_statut"]
          updated_at?: string
          ville?: string
        }
        Relationships: [
          {
            foreignKeyName: "bornes_partenaire_id_fkey"
            columns: ["partenaire_id"]
            isOneToOne: false
            referencedRelation: "partenaires"
            referencedColumns: ["id"]
          },
        ]
      }
      commandes: {
        Row: {
          borne_id: string
          commande: string
          created_at: string
          creee_par: string
          executee_at: string | null
          id: string
          message_erreur: string | null
          parametres: Json | null
          statut: Database["public"]["Enums"]["commande_statut"]
        }
        Insert: {
          borne_id: string
          commande: string
          created_at?: string
          creee_par: string
          executee_at?: string | null
          id?: string
          message_erreur?: string | null
          parametres?: Json | null
          statut?: Database["public"]["Enums"]["commande_statut"]
        }
        Update: {
          borne_id?: string
          commande?: string
          created_at?: string
          creee_par?: string
          executee_at?: string | null
          id?: string
          message_erreur?: string | null
          parametres?: Json | null
          statut?: Database["public"]["Enums"]["commande_statut"]
        }
        Relationships: [
          {
            foreignKeyName: "commandes_borne_id_fkey"
            columns: ["borne_id"]
            isOneToOne: false
            referencedRelation: "bornes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commandes_creee_par_fkey"
            columns: ["creee_par"]
            isOneToOne: false
            referencedRelation: "utilisateurs"
            referencedColumns: ["id"]
          },
        ]
      }
      config: {
        Row: {
          cle: string
          created_at: string | null
          id: string
          valeur: string
        }
        Insert: {
          cle: string
          created_at?: string | null
          id?: string
          valeur: string
        }
        Update: {
          cle?: string
          created_at?: string | null
          id?: string
          valeur?: string
        }
        Relationships: []
      }
      ememento: {
        Row: {
          bar: string | null
          borne_id: string | null
          code: string
          created_at: string
          etape_echec: string | null
          id: string
          message_erreur: string | null
          originals: Json | null
          photos: Json | null
          qr_url: string | null
          session_id: string
          statut: string
          timestamp: string
        }
        Insert: {
          bar?: string | null
          borne_id?: string | null
          code: string
          created_at?: string
          etape_echec?: string | null
          id?: string
          message_erreur?: string | null
          originals?: Json | null
          photos?: Json | null
          qr_url?: string | null
          session_id: string
          statut?: string
          timestamp?: string
        }
        Update: {
          bar?: string | null
          borne_id?: string | null
          code?: string
          created_at?: string
          etape_echec?: string | null
          id?: string
          message_erreur?: string | null
          originals?: Json | null
          photos?: Json | null
          qr_url?: string | null
          session_id?: string
          statut?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "ememento_borne_id_fkey"
            columns: ["borne_id"]
            isOneToOne: false
            referencedRelation: "bornes"
            referencedColumns: ["id"]
          },
        ]
      }
      heartbeats: {
        Row: {
          appareil_connecte: boolean | null
          borne_id: string
          cash_interface_running: boolean | null
          disque_libre_go: number | null
          dslrbooth_running: boolean | null
          feuilles_restantes: number | null
          id: string
          imprimante_statut: string | null
          mode_coupe: string | null
          serial_appareil_photo: string | null
          serial_imprimante: string | null
          ssid_wifi: string | null
          timestamp: string
          version_agent: string | null
          version_cash_interface: string | null
          version_dslrbooth: string | null
        }
        Insert: {
          appareil_connecte?: boolean | null
          borne_id: string
          cash_interface_running?: boolean | null
          disque_libre_go?: number | null
          dslrbooth_running?: boolean | null
          feuilles_restantes?: number | null
          id?: string
          imprimante_statut?: string | null
          mode_coupe?: string | null
          serial_appareil_photo?: string | null
          serial_imprimante?: string | null
          ssid_wifi?: string | null
          timestamp?: string
          version_agent?: string | null
          version_cash_interface?: string | null
          version_dslrbooth?: string | null
        }
        Update: {
          appareil_connecte?: boolean | null
          borne_id?: string
          cash_interface_running?: boolean | null
          disque_libre_go?: number | null
          dslrbooth_running?: boolean | null
          feuilles_restantes?: number | null
          id?: string
          imprimante_statut?: string | null
          mode_coupe?: string | null
          serial_appareil_photo?: string | null
          serial_imprimante?: string | null
          ssid_wifi?: string | null
          timestamp?: string
          version_agent?: string | null
          version_cash_interface?: string | null
          version_dslrbooth?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "heartbeats_borne_id_fkey"
            columns: ["borne_id"]
            isOneToOne: true
            referencedRelation: "bornes"
            referencedColumns: ["id"]
          },
        ]
      }
      horaires: {
        Row: {
          borne_id: string
          created_at: string
          ferme: boolean
          fermeture: string
          id: string
          jour: number
          ouverture: string
          updated_at: string
        }
        Insert: {
          borne_id: string
          created_at?: string
          ferme?: boolean
          fermeture: string
          id?: string
          jour: number
          ouverture: string
          updated_at?: string
        }
        Update: {
          borne_id?: string
          created_at?: string
          ferme?: boolean
          fermeture?: string
          id?: string
          jour?: number
          ouverture?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "horaires_borne_id_fkey"
            columns: ["borne_id"]
            isOneToOne: false
            referencedRelation: "bornes"
            referencedColumns: ["id"]
          },
        ]
      }
      interventions: {
        Row: {
          alerte_id: string | null
          borne_id: string
          created_at: string
          date: string
          description: string | null
          duree_minutes: number | null
          id: string
          intervenant_id: string
          type: string
        }
        Insert: {
          alerte_id?: string | null
          borne_id: string
          created_at?: string
          date?: string
          description?: string | null
          duree_minutes?: number | null
          id?: string
          intervenant_id: string
          type: string
        }
        Update: {
          alerte_id?: string | null
          borne_id?: string
          created_at?: string
          date?: string
          description?: string | null
          duree_minutes?: number | null
          id?: string
          intervenant_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "interventions_alerte_id_fkey"
            columns: ["alerte_id"]
            isOneToOne: false
            referencedRelation: "alertes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interventions_borne_id_fkey"
            columns: ["borne_id"]
            isOneToOne: false
            referencedRelation: "bornes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interventions_intervenant_id_fkey"
            columns: ["intervenant_id"]
            isOneToOne: false
            referencedRelation: "utilisateurs"
            referencedColumns: ["id"]
          },
        ]
      }
      paper_history: {
        Row: {
          borne_id: string
          feuilles_restantes: number
          id: string
          recorded_at: string
        }
        Insert: {
          borne_id: string
          feuilles_restantes: number
          id?: string
          recorded_at?: string
        }
        Update: {
          borne_id?: string
          feuilles_restantes?: number
          id?: string
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_history_borne_id_fkey"
            columns: ["borne_id"]
            isOneToOne: false
            referencedRelation: "bornes"
            referencedColumns: ["id"]
          },
        ]
      }
      partenaires: {
        Row: {
          created_at: string
          email: string | null
          entreprise: string | null
          id: string
          logo_url: string | null
          nom: string
          telephone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          entreprise?: string | null
          id?: string
          logo_url?: string | null
          nom: string
          telephone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          entreprise?: string | null
          id?: string
          logo_url?: string | null
          nom?: string
          telephone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      printer_status_config: {
        Row: {
          couleur: string
          created_at: string
          gravite: Database["public"]["Enums"]["gravite_type"]
          id: string
          label_fr: string
          status_code: number
          updated_at: string
        }
        Insert: {
          couleur?: string
          created_at?: string
          gravite?: Database["public"]["Enums"]["gravite_type"]
          id?: string
          label_fr: string
          status_code: number
          updated_at?: string
        }
        Update: {
          couleur?: string
          created_at?: string
          gravite?: Database["public"]["Enums"]["gravite_type"]
          id?: string
          label_fr?: string
          status_code?: number
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          anomalie_impression: string | null
          borne_id: string
          created_at: string
          delai_avant_inhibited: number | null
          feuilles_apres: number | null
          feuilles_avant: number | null
          flag: string | null
          id: string
          impression_declenchee: boolean
          impression_verifiee_papier: boolean | null
          montant: number
          paiement_at: string
          session_id: string | null
          tpe_inhibited_at: string | null
          tpe_resumed_at: string | null
        }
        Insert: {
          anomalie_impression?: string | null
          borne_id: string
          created_at?: string
          delai_avant_inhibited?: number | null
          feuilles_apres?: number | null
          feuilles_avant?: number | null
          flag?: string | null
          id?: string
          impression_declenchee?: boolean
          impression_verifiee_papier?: boolean | null
          montant?: number
          paiement_at: string
          session_id?: string | null
          tpe_inhibited_at?: string | null
          tpe_resumed_at?: string | null
        }
        Update: {
          anomalie_impression?: string | null
          borne_id?: string
          created_at?: string
          delai_avant_inhibited?: number | null
          feuilles_apres?: number | null
          feuilles_avant?: number | null
          flag?: string | null
          id?: string
          impression_declenchee?: boolean
          impression_verifiee_papier?: boolean | null
          montant?: number
          paiement_at?: string
          session_id?: string | null
          tpe_inhibited_at?: string | null
          tpe_resumed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_borne_id_fkey"
            columns: ["borne_id"]
            isOneToOne: false
            referencedRelation: "bornes"
            referencedColumns: ["id"]
          },
        ]
      }
      updates: {
        Row: {
          created_at: string
          fichier_url: string
          id: string
          notes: string | null
          publiee_at: string
          publiee_par: string | null
          version: string
        }
        Insert: {
          created_at?: string
          fichier_url: string
          id?: string
          notes?: string | null
          publiee_at?: string
          publiee_par?: string | null
          version: string
        }
        Update: {
          created_at?: string
          fichier_url?: string
          id?: string
          notes?: string | null
          publiee_at?: string
          publiee_par?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "updates_publiee_par_fkey"
            columns: ["publiee_par"]
            isOneToOne: false
            referencedRelation: "utilisateurs"
            referencedColumns: ["id"]
          },
        ]
      }
      updates_bornes: {
        Row: {
          borne_id: string
          created_at: string
          id: string
          message_erreur: string | null
          mise_a_jour_at: string | null
          statut: string
          update_id: string
        }
        Insert: {
          borne_id: string
          created_at?: string
          id?: string
          message_erreur?: string | null
          mise_a_jour_at?: string | null
          statut?: string
          update_id: string
        }
        Update: {
          borne_id?: string
          created_at?: string
          id?: string
          message_erreur?: string | null
          mise_a_jour_at?: string | null
          statut?: string
          update_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "updates_bornes_borne_id_fkey"
            columns: ["borne_id"]
            isOneToOne: false
            referencedRelation: "bornes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "updates_bornes_update_id_fkey"
            columns: ["update_id"]
            isOneToOne: false
            referencedRelation: "updates"
            referencedColumns: ["id"]
          },
        ]
      }
      utilisateurs: {
        Row: {
          actif: boolean
          created_at: string
          email: string
          id: string
          nom: string
          partenaire_id: string | null
          pin: string | null
          role: Database["public"]["Enums"]["user_role"]
          telephone: string | null
          updated_at: string
          voir_ca: boolean | null
        }
        Insert: {
          actif?: boolean
          created_at?: string
          email: string
          id: string
          nom: string
          partenaire_id?: string | null
          pin?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          telephone?: string | null
          updated_at?: string
          voir_ca?: boolean | null
        }
        Update: {
          actif?: boolean
          created_at?: string
          email?: string
          id?: string
          nom?: string
          partenaire_id?: string | null
          pin?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          telephone?: string | null
          updated_at?: string
          voir_ca?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "utilisateurs_partenaire_id_fkey"
            columns: ["partenaire_id"]
            isOneToOne: false
            referencedRelation: "partenaires"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_heartbeats: { Args: never; Returns: number }
    }
    Enums: {
      alerte_gravite: "info" | "warning" | "critique"
      alerte_statut: "ouverte" | "assignee" | "resolue"
      borne_statut: "active" | "maintenance" | "desactivee"
      commande_statut: "en_attente" | "envoyee" | "executee" | "echouee"
      gravite_type: "ok" | "info" | "warning" | "critique"
      user_role: "admin" | "technicien" | "partenaire"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alerte_gravite: ["info", "warning", "critique"],
      alerte_statut: ["ouverte", "assignee", "resolue"],
      borne_statut: ["active", "maintenance", "desactivee"],
      commande_statut: ["en_attente", "envoyee", "executee", "echouee"],
      gravite_type: ["ok", "info", "warning", "critique"],
      user_role: ["admin", "technicien", "partenaire"],
    },
  },
} as const
